import { ENDPOINTS, OuraClient, OuraError, ensureFreshToken, getUser } from './oura'
import type { Access, Env, UserRecord } from './types'
import { hmacHex, isoDay } from './util'

// sleep = 睡眠分期端点（含睡眠期间心率采样），用于计算真实静息心率 BPM 与睡眠结构/眠动图
export const SUMMARY_ENDPOINTS = [
  'daily_sleep',
  'daily_readiness',
  'daily_activity',
  'sleep',
  'daily_stress',
  'daily_spo2',
  'daily_resilience',
  'daily_cardiovascular_age',
  'vo2_max',
] as const

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

/** 解析 ISO 时间戳自带的时区偏移（分钟），如 "2026-09-13T07:12:34+08:00" → 480 */
function offsetMinutesOf(ts: string): number {
  const m = ts.match(/([+-])(\d{2}):?(\d{2})$/)
  if (!m) return 0
  return (Number(m[2]) * 60 + Number(m[3])) * (m[1] === '-' ? -1 : 1)
}

/** ISO 时间戳 → UTC 毫秒（按墙上时钟 + 自带偏移换算，不依赖运行环境时区） */
function tsToUtcMs(ts: string): number | null {
  const m = ts.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/)
  if (!m) return null
  return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]), Number(m[6])) -
    offsetMinutesOf(ts) * 60_000
}

/** 睡眠时刻 → 相对「锚定日前一日正午」（按该时间戳自身时区）的小时数，用于睡眠节奏图 */
function hoursSinceAnchorNoon(ts: string, day: string): number | null {
  const utcMs = tsToUtcMs(ts)
  const d = day.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (utcMs == null || !d) return null
  const anchorNoonMs = Date.UTC(Number(d[1]), Number(d[2]) - 1, Number(d[3]) - 1, 12) - offsetMinutesOf(ts) * 60_000
  return (utcMs - anchorNoonMs) / 3_600_000
}

// 概览端点 → 指标名：缺 scope 时把具体指标反馈给看板，提示用户重新授权
const SUMMARY_METRIC_NAMES: Partial<Record<(typeof SUMMARY_ENDPOINTS)[number], string>> = {
  daily_spo2: '血氧',
  daily_resilience: '韧性',
  daily_cardiovascular_age: '血管年龄',
  vo2_max: 'VO2 max',
}

/**
 * 聚合每日概览与睡眠分期为按日期合并的行（rhr = 睡眠期间平均心率 BPM，与 Oura App 口径一致）。
 * 返回 rows 与 profile.age（用于血管年龄对照）；单个端点失败（如未授予新 scope）不影响整体，
 * 因缺 scope 被跳过的端点汇总在 scopeGaps 里（scope → 受影响指标），供看板提示重新授权。
 */
export async function getSummary(
  env: Env,
  rec: UserRecord,
  range: { start: string; end: string },
): Promise<{ rows: any[]; age?: number; scopeGaps: { scope: string; metrics: string[] }[] }> {
  // 先串行确保 token 新鲜，避免并发刷新导致 refresh_token 轮换竞态
  await ensureFreshToken(env, rec)
  const params = { start_date: range.start, end_date: range.end }
  const scopeGaps = new Map<string, Set<string>>()
  const settled = await Promise.all(
    SUMMARY_ENDPOINTS.map(async (e) => {
      try {
        return (await fetchCachedPaged(env, rec, e, params)).data
      } catch (err) {
        // 单端点失败（scope 未授予、订阅过期等）时跳过该端点
        const m = err instanceof Error ? err.message.match(/not authorized access ([a-z0-9_]+) scope/) : null
        const metric = SUMMARY_METRIC_NAMES[e]
        if (m && metric) {
          const set = scopeGaps.get(m[1]) ?? new Set<string>()
          set.add(metric)
          scopeGaps.set(m[1], set)
        }
        return null
      }
    }),
  )
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
      // 睡眠结构（秒）
      row.deep = item.deep_sleep_duration ?? null
      row.rem = item.rem_sleep_duration ?? null
      row.light = item.light_sleep_duration ?? null
      row.awake = item.awake_time ?? null
      row.efficiency = item.efficiency ?? null
      // 睡眠窗口：正午起算的小时数（0 = 前一日 12:00，24 = 当日 12:00）
      const sh = item.bedtime_start ? hoursSinceAnchorNoon(item.bedtime_start, day) : null
      const eh = item.bedtime_end ? hoursSinceAnchorNoon(item.bedtime_end, day) : null
      if (sh != null && eh != null && eh > sh) {
        row.bedStartH = Math.round(Math.min(Math.max(sh, 0), 24) * 100) / 100
        row.bedEndH = Math.round(Math.min(Math.max(eh, 0), 24) * 100) / 100
      }
      // 眠动图（5 分钟分期字符串：1=深睡 2=浅睡 3=REM 4=清醒）
      row.hypno = typeof item.sleep_phase_5_min === 'string' && item.sleep_phase_5_min ? item.sleep_phase_5_min : null
      // 睡眠期间平均 HRV
      row.sleepHrv = item.average_hrv ?? null
      byDay.set(day, row)
    }
  }
  put('sleep', settled[0])
  put('readiness', settled[1])
  put('activity', settled[2])
  putSleepPeriods(settled[3])
  if (settled[4]) {
    for (const item of settled[4].data ?? []) {
      if (!item?.day) continue
      const row = byDay.get(item.day) ?? { date: item.day }
      row.stressHigh = item.stress_high ?? null
      row.recoveryHigh = item.recovery_high ?? null
      row.stressSummary = item.day_summary ?? null
      byDay.set(item.day, row)
    }
  }
  if (settled[5]) {
    for (const item of settled[5].data ?? []) {
      if (!item?.day) continue
      const row = byDay.get(item.day) ?? { date: item.day }
      row.spo2 = item.spo2_percentage?.average ?? null
      row.bdi = item.breathing_disturbance_index ?? null
      byDay.set(item.day, row)
    }
  }
  if (settled[6]) {
    for (const item of settled[6].data ?? []) {
      if (!item?.day) continue
      const row = byDay.get(item.day) ?? { date: item.day }
      row.resilience = item.level ?? null
      byDay.set(item.day, row)
    }
  }
  if (settled[7]) {
    for (const item of settled[7].data ?? []) {
      if (!item?.day) continue
      const row = byDay.get(item.day) ?? { date: item.day }
      row.vascularAge = item.vascular_age ?? null
      row.pwv = item.pulse_wave_velocity ?? null
      byDay.set(item.day, row)
    }
  }
  if (settled[8]) {
    for (const item of settled[8].data ?? []) {
      if (!item?.day) continue
      const row = byDay.get(item.day) ?? { date: item.day }
      row.vo2max = item.vo2_max ?? null
      byDay.set(item.day, row)
    }
  }
  let age: number | undefined
  try {
    const { data } = await fetchCached(env, rec, 'personal_info', {})
    const n = Number(data?.age)
    if (Number.isFinite(n) && n > 0) age = n
  } catch {
    // 无 personal 权限时忽略
  }
  return {
    rows: [...byDay.values()].sort((a, b) => (a.date < b.date ? -1 : 1)),
    age,
    scopeGaps: [...scopeGaps].map(([scope, metrics]) => ({ scope, metrics: [...metrics].sort() })),
  }
}
