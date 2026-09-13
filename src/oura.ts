import type { Env, TokenSet, UserRecord } from './types'

export const OURA_API = 'https://api.ouraring.com/v2'
export const OURA_AUTHORIZE = 'https://cloud.ouraring.com/oauth/authorize'
export const OURA_TOKEN = 'https://api.ouraring.com/oauth/token'

// Oura 2026 现行 scope：spo2（旧的 spo2Daily 已失效）、stress（韧性/压力）、heart_health（心血管年龄）
export const DEFAULT_SCOPE = 'personal daily heartrate workout session spo2 stress heart_health email'

export class OuraError extends Error {
  status: number
  retryAfter?: string
  constructor(status: number, message: string, retryAfter?: string) {
    super(message)
    this.status = status
    this.retryAfter = retryAfter
  }
}

/** 数据端点白名单：别名 -> { 真实路径, 缓存 TTL 秒 } */
export const ENDPOINTS: Record<string, { path: string; ttl: number }> = {
  personal_info: { path: 'personal_info', ttl: 3600 },
  ring_configuration: { path: 'ring_configuration', ttl: 3600 },
  daily_activity: { path: 'daily_activity', ttl: 900 },
  daily_readiness: { path: 'daily_readiness', ttl: 900 },
  daily_sleep: { path: 'daily_sleep', ttl: 900 },
  daily_spo2: { path: 'daily_spo2', ttl: 900 },
  daily_stress: { path: 'daily_stress', ttl: 900 },
  daily_resilience: { path: 'daily_resilience', ttl: 900 },
  daily_cardiovascular_age: { path: 'daily_cardiovascular_age', ttl: 900 },
  // 注意：Oura 官方路径是 vO2_max（大写 O），小写会 404
  vo2_max: { path: 'vO2_max', ttl: 900 },
  rest_mode_period: { path: 'rest_mode_period', ttl: 900 },
  sleep: { path: 'sleep', ttl: 300 },
  sleep_time: { path: 'sleep_time', ttl: 300 },
  heartrate: { path: 'heartrate', ttl: 300 },
  session: { path: 'session', ttl: 300 },
  workout: { path: 'workout', ttl: 300 },
  tag: { path: 'tag', ttl: 300 },
  enhanced_tag: { path: 'enhanced_tag', ttl: 300 },
}

// 剩余寿命不足 12 小时就刷新（Oura access token 有效期约 24 小时，refresh_token 会轮换）
const REFRESH_MARGIN_SEC = 12 * 3600

export async function tokenRequest(env: Env, form: Record<string, string>): Promise<TokenSet> {
  const res = await fetch(OURA_TOKEN, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(form).toString(),
  })
  const json: any = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new OuraError(res.status, json?.error_description || json?.error || `token request failed (${res.status})`)
  }
  if (!json?.access_token) throw new OuraError(502, 'token response missing access_token')
  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token ?? '',
    expiresAt: Math.floor(Date.now() / 1000) + Number(json.expires_in ?? 86400),
    scope: json.scope ?? '',
  }
}

export function exchangeCode(env: Env, code: string, redirectUri: string) {
  return tokenRequest(env, {
    grant_type: 'authorization_code',
    code,
    client_id: env.OURA_CLIENT_ID,
    client_secret: env.OURA_CLIENT_SECRET,
    redirect_uri: redirectUri,
  })
}

export function refreshTokens(env: Env, refreshTokenValue: string) {
  return tokenRequest(env, {
    grant_type: 'refresh_token',
    refresh_token: refreshTokenValue,
    client_id: env.OURA_CLIENT_ID,
    client_secret: env.OURA_CLIENT_SECRET,
  })
}

export async function saveUser(env: Env, rec: UserRecord): Promise<void> {
  await env.OURA_KV.put(`user:${rec.id}`, JSON.stringify(rec))
}

export async function getUser(env: Env, id: string): Promise<UserRecord | null> {
  const raw = await env.OURA_KV.get(`user:${id}`)
  return raw ? (JSON.parse(raw) as UserRecord) : null
}

/** token 快过期时刷新并落库（注意：并发调用可能触发 refresh_token 轮换竞态，调用方应先串行 ensure 一次） */
export async function ensureFreshToken(env: Env, rec: UserRecord): Promise<UserRecord> {
  const now = Math.floor(Date.now() / 1000)
  if (rec.tokens.expiresAt - now > REFRESH_MARGIN_SEC) return rec
  const fresh = await refreshTokens(env, rec.tokens.refreshToken)
  rec.tokens = { ...fresh, scope: fresh.scope || rec.tokens.scope }
  await saveUser(env, rec)
  return rec
}

export class OuraClient {
  constructor(
    private env: Env,
    private rec: UserRecord,
  ) {}

  async request(
    path: string,
    params: Record<string, string> = {},
  ): Promise<{ status: number; body: any; retryAfter?: string }> {
    this.rec = await ensureFreshToken(this.env, this.rec)
    const qs = Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : ''
    const url = `${OURA_API}/usercollection/${path}${qs}`
    let res = await fetch(url, { headers: { authorization: `Bearer ${this.rec.tokens.accessToken}` } })
    if (res.status === 401) {
      // token 可能被服务端提前吊销：强制刷新后重试一次
      this.rec.tokens.expiresAt = 0
      this.rec = await ensureFreshToken(this.env, this.rec)
      res = await fetch(url, { headers: { authorization: `Bearer ${this.rec.tokens.accessToken}` } })
    }
    const body = await res.json().catch(() => null)
    return { status: res.status, body, retryAfter: res.headers.get('retry-after') ?? undefined }
  }
}

export async function fetchPersonalInfo(env: Env, accessToken: string): Promise<{ id: string; email?: string }> {
  const res = await fetch(`${OURA_API}/usercollection/personal_info`, {
    headers: { authorization: `Bearer ${accessToken}` },
  })
  const json: any = await res.json().catch(() => ({}))
  if (!res.ok) throw new OuraError(res.status, json?.detail || `personal_info failed (${res.status})`)
  // Oura 文档：personal_info 返回扁平对象 { id, age, email, ... }；这里兼容可能的 { data: {...} } 包裹
  const data = json?.data ?? json
  const id = String(data?.id ?? '')
  if (!id) {
    throw new OuraError(502, `personal_info 响应中没有 id（返回字段：${Object.keys(json ?? {}).join(', ') || '空'}）`)
  }
  return { id, email: data?.email || undefined }
}
