import { ENDPOINTS, OuraClient, OuraError, ensureFreshToken, getUser } from './oura'
import type { Access, Env, UserRecord } from './types'
import { hmacHex, isoDay } from './util'

// sleep = 睡眠分期端点（含睡眠期间心率采样），用于计算真实静息心率 BPM
export const SUMMARY_ENDPOINTS = ['daily_sleep', 'daily_readiness', 'daily_activity', 'sleep'] as const

export function cacheKey(userId: string, endpoint: string, params: Record<string, string>): string {
  return `cache:${userId}:${endpoint}:${JSON.stringify(params)}`
}

/** 解析请求的访问级别：ADMIN_KEY（Bearer 或管理员 cookie）→ admin；用户个人 Key → 仅该用户 */
export async function resolveAccess(c: {
  req: { url: string; header: (n: string) => string | undefined }
  env: Env
}): Promise<Access | null> {
  const env = c.env
  if (!env.ADMIN_KEY) return null
  const auth = c.req.header('authorization')
  const bearer = auth?.startsWith('Bearer ') ? auth.slice(7) : undefined
  if (bearer === env.ADMIN_KEY) return { admin: true }
  const queryKey = new URL(c.req.url).searchParams.get('key')
  if (queryKey === env.ADMIN_KEY) return { admin: true }
  const cookieHeader = c.req.header('cookie') ?? ''
  const m = cookieHeader.match(/(?:^|;\s*)oura_admin=([^;]+)/)
  if (m && m[1] === (await hmacHex(env.ADMIN_KEY, 'admin-v1'))) return { admin: true }
  if (bearer) {
    const rec = (await listUsers(env)).find((u) => u.userKey === bearer)
    if (rec) return { admin: false, rec }
  }
  return null
}

export async function listUsers(env: Env): Promise<UserRecord[]> {
  const users: UserRecord[] = []
  let cursor: string | undefined
  for (;;) {
    const list = await env.OURA_KV.list({ prefix: 'user:', cursor })
    for (const k of list.keys) {
      const rec = await getUser(env, k.name.slice('user:'.length))
      if (rec) users.push(rec)
    }
    if (list.list_complete) break
    cursor = list.cursor
  }
  // KV list 顺序不确定，按接入时间稳定排序（最早接入的排最前）
  return users.sort((a, b) => a.connectedAt - b.connectedAt)
}

/** 缓存优先读取 Oura 数据；未命中则回源并写入 KV */
export async function fetchCached(
  env: Env,
  rec: UserRecord,
  endpoint: string,
  params: Record<string, string> = {},
): Promise<{ data: any; hit: boolean }> {
  const spec = ENDPOINTS[endpoint]
  if (!spec) throw new OuraError(404, `unknown endpoint: ${endpoint}`)
  const key = cacheKey(rec.id, endpoint, params)
  const cached = await env.OURA_KV.get(key)
  if (cached) return { data: (JSON.parse(cached) as { data: any }).data, hit: true }
  const client = new OuraClient(env, rec)
  const { status, body, retryAfter } = await client.request(spec.path, params)
  if (status === 429) throw new OuraError(429, `Oura 限流，请 ${retryAfter || 60}s 后重试`, retryAfter ?? undefined)
  if (status !== 200) throw new OuraError(502, `Oura ${spec.path} 返回 ${status}: ${body?.detail ?? ''}`)
  await env.OURA_KV.put(key, JSON.stringify({ saved: Date.now(), data: body }), { expirationTtl: spec.ttl })
  return { data: body, hit: false }
}

/** 分页聚合读取：跟随 next_token 合并所有数据页后整体缓存（用于汇总统计，缓存键与单页版隔离） */
export async function fetchCachedPaged(
  env: Env,
  rec: UserRecord,
  endpoint: string,
  params: Record<string, string> = {},
): Promise<{ data: any; hit: boolean }> {
  const spec = ENDPOINTS[endpoint]
  if (!spec) throw new OuraError(404, `unknown endpoint: ${endpoint}`)
  const key = cacheKey(rec.id, endpoint, { ...params, paged: '1' })
  const cached = await env.OURA_KV.get(key)
  if (cached) return { data: (JSON.parse(cached) as { data: any }).data, hit: true }
  const client = new OuraClient(env, rec)
  let merged: any[] = []
  let nextToken: string | undefined
  for (let page = 0; page < 20; page++) {
    const pageParams: Record<string, string> = { ...params }
    if (nextToken) pageParams.next_token = nextToken
    const { status, body, retryAfter } = await client.request(spec.path, pageParams)
    if (status === 429) throw new OuraError(429, `Oura 限流，请 ${retryAfter || 60}s 后重试`, retryAfter ?? undefined)
    if (status !== 200) throw new OuraError(502, `Oura ${spec.path} 返回 ${status}: ${body?.detail ?? ''}`)
    merged = merged.concat(body?.data ?? [])
    if (!body?.next_token) break
    nextToken = body.next_token
  }
  await env.OURA_KV.put(key, JSON.stringify({ saved: Date.now(), data: { data: merged } }), {
    expirationTtl: spec.ttl,
  })
  return { data: { data: merged }, hit: false }
}

/** 聚合每日概览与睡眠分期为按日期合并的行（rhr = 睡眠期间平均心率 BPM，与 Oura App 口径一致） */
export async function getSummaryRows(
  env: Env,
  rec: UserRecord,
  range: { start: string; end: string },
): Promise<any[]> {
  // 先串行确保 token 新鲜，避免并发刷新导致 refresh_token 轮换竞态
  await ensureFreshToken(env, rec)
  const params = { start_date: range.start, end_date: range.end }
  const results = await Promise.all(SUMMARY_ENDPOINTS.map((e) => fetchCachedPaged(env, rec, e, params)))
  const byDay = new Map<string, any>()
  const put = (name: string, payload: any) => {
    for (const item of payload?.data ?? []) {
      if (!item?.day) continue
      const row = byDay.get(item.day) ?? { date: item.day }
      if (name === 'readiness') {
        row.readiness = item.score ?? null
        row.hrv = item.contributors?.hrv_balance ?? null
      } else {
        row[name] = item.score ?? null
      }
      byDay.set(item.day, row)
    }
  }
  // sleep 端点一天可能返回多段睡眠（小睡等）：取时长最长的一段作为主睡眠，
  // 静息心率取该段 5 分钟心率采样的平均值（Oura App 展示口径），缺失时退回 average_heart_rate
  const putSleepPeriods = (payload: any) => {
    const main = new Map<string, any>()
    for (const item of payload?.data ?? []) {
      if (!item?.day || item.type === 'deleted' || item.type === 'rest') continue
      const cur = main.get(item.day)
      if (!cur || (item.total_sleep_duration ?? 0) > (cur.total_sleep_duration ?? 0)) main.set(item.day, item)
    }
    for (const [day, item] of main) {
      const row = byDay.get(day) ?? { date: day }
      const samples: number[] = (item.heart_rate?.items ?? []).filter(
        (v: unknown) => typeof v === 'number' && v > 0,
      )
      row.rhr = samples.length
        ? Math.round(samples.reduce((s: number, v: number) => s + v, 0) / samples.length)
        : item.average_heart_rate != null
          ? Math.round(item.average_heart_rate)
          : null
      byDay.set(day, row)
    }
  }
  put('sleep', results[0].data)
  put('readiness', results[1].data)
  put('activity', results[2].data)
  putSleepPeriods(results[3].data)
  return [...byDay.values()].sort((a, b) => (a.date < b.date ? -1 : 1))
}
