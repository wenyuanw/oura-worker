import { ENDPOINTS, OuraClient, OuraError, ensureFreshToken, getUser } from './oura'
import type { Access, Env, UserRecord } from './types'
import { hmacHex, isoDay } from './util'

export const SUMMARY_ENDPOINTS = ['daily_sleep', 'daily_readiness', 'daily_activity'] as const

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
  return users
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

/** 聚合三张每日概览表为按日期合并的行 */
export async function getSummaryRows(
  env: Env,
  rec: UserRecord,
  range: { start: string; end: string },
): Promise<any[]> {
  // 先串行确保 token 新鲜，避免并发刷新导致 refresh_token 轮换竞态
  await ensureFreshToken(env, rec)
  const results = await Promise.all(
    SUMMARY_ENDPOINTS.map((e) => fetchCached(env, rec, e, { start_date: range.start, end_date: range.end })),
  )
  const byDay = new Map<string, any>()
  const put = (name: string, payload: any) => {
    for (const item of payload?.data ?? []) {
      if (!item?.day) continue
      const row = byDay.get(item.day) ?? { date: item.day }
      if (name === 'readiness') {
        row.readiness = item.score ?? null
        row.rhr = item.contributors?.resting_heart_rate ?? null
        row.hrv = item.contributors?.hrv_balance ?? null
      } else {
        row[name] = item.score ?? null
      }
      byDay.set(item.day, row)
    }
  }
  put('sleep', results[0].data)
  put('readiness', results[1].data)
  put('activity', results[2].data)
  return [...byDay.values()].sort((a, b) => (a.date < b.date ? -1 : 1))
}
