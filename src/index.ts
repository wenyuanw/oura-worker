import { Hono, type Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { connectedPage, dashboardPage, errorPage, loginPage } from './dashboard'
import {
  DEFAULT_SCOPE,
  ENDPOINTS,
  OuraClient,
  OuraError,
  OURA_AUTHORIZE,
  ensureFreshToken,
  exchangeCode,
  fetchPersonalInfo,
  getUser,
  saveUser,
} from './oura'
import type { Env, UserRecord } from './types'
import { hmacHex, isoDay } from './util'

const app = new Hono<{ Bindings: Env }>()

const COOKIE_NAME = 'oura_admin'
const SUMMARY_ENDPOINTS = ['daily_sleep', 'daily_readiness', 'daily_activity'] as const
// 每个订阅占用一个 (event_type, data_type) 组合
const WEBHOOK_DATA_TYPES = ['daily_sleep', 'daily_readiness', 'daily_activity', 'daily_stress', 'workout', 'session']
const QUERY_ALLOW = ['start_date', 'end_date', 'next_token', 'document_id']

function redirectUri(c: { req: { url: string }; env: Env }): string {
  const origin = (c.env.REDIRECT_ORIGIN || new URL(c.req.url).origin).replace(/\/+$/, '')
  return `${origin}/auth/callback`
}

async function isAdmin(c: Context<{ Bindings: Env }>): Promise<boolean> {
  if (!c.env.ADMIN_KEY) return false
  const auth = c.req.header('authorization')
  if (auth?.startsWith('Bearer ') && auth.slice(7) === c.env.ADMIN_KEY) return true
  return getCookie(c, COOKIE_NAME) === (await hmacHex(c.env.ADMIN_KEY, 'admin-v1'))
}

function cacheKey(userId: string, endpoint: string, params: Record<string, string>): string {
  return `cache:${userId}:${endpoint}:${JSON.stringify(params)}`
}

/** 缓存优先读取 Oura 数据；未命中则回源并写入 KV */
async function fetchCached(
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

function errorResponse(c: any, e: unknown) {
  if (e instanceof OuraError) {
    const headers: Record<string, string> = {}
    if (e.retryAfter) headers['retry-after'] = e.retryAfter
    return c.json({ error: e.message }, e.status, headers)
  }
  throw e
}

// ---------------- 管理登录 ----------------

app.get('/login', (c) => c.html(loginPage()))

app.post('/login', async (c) => {
  const body = await c.req.parseBody()
  const key = body['key']
  if (!c.env.ADMIN_KEY) return c.html(errorPage('未配置 ADMIN_KEY', '请先运行 wrangler secret put ADMIN_KEY'), 500)
  if (typeof key !== 'string' || key !== c.env.ADMIN_KEY) return c.html(loginPage('密钥错误'), 401)
  setCookie(c, COOKIE_NAME, await hmacHex(c.env.ADMIN_KEY, 'admin-v1'), {
    httpOnly: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: 7 * 86_400,
  })
  return c.redirect('/')
})

app.post('/logout', (c) => {
  deleteCookie(c, COOKIE_NAME, { path: '/' })
  return c.redirect('/login')
})

app.get('/', async (c) => {
  if (!(await isAdmin(c))) return c.redirect('/login')
  return c.html(dashboardPage())
})

app.get('/healthz', (c) => c.json({ ok: true, ts: Date.now() }))

// ---------------- 多用户 OAuth ----------------

app.get('/auth/oura', async (c) => {
  if (!c.env.OURA_CLIENT_ID || !c.env.OURA_CLIENT_SECRET) {
    return c.html(errorPage('未配置 Oura 凭据', '请先运行 wrangler secret put OURA_CLIENT_ID / OURA_CLIENT_SECRET'), 500)
  }
  const nonce = crypto.randomUUID()
  await c.env.OURA_KV.put(`state:${nonce}`, '1', { expirationTtl: 600 })
  // 手动 encodeURIComponent：URLSearchParams 会把空格编成 '+'，部分 OAuth 解析器不识别
  const qs = [
    `client_id=${encodeURIComponent(c.env.OURA_CLIENT_ID)}`,
    `redirect_uri=${encodeURIComponent(redirectUri(c))}`,
    `response_type=code`,
    `scope=${encodeURIComponent(c.env.OURA_SCOPE || DEFAULT_SCOPE)}`,
    `state=${encodeURIComponent(nonce)}`,
  ].join('&')
  return c.redirect(`${OURA_AUTHORIZE}?${qs}`)
})

app.get('/auth/callback', async (c) => {
  const { code, state, error, error_description } = c.req.query()
  if (error) return c.html(errorPage('Oura 授权被拒绝', error_description || error), 400)
  if (!code || !state) return c.html(errorPage('回调缺少参数', 'code/state 缺失，请重新发起授权'), 400)
  const stateKey = `state:${state}`
  if ((await c.env.OURA_KV.get(stateKey)) === null) {
    return c.html(errorPage('state 校验失败', 'state 已过期或不匹配，请重新发起授权'), 400)
  }
  await c.env.OURA_KV.delete(stateKey)
  try {
    const tokens = await exchangeCode(c.env, code, redirectUri(c))
    const info = await fetchPersonalInfo(c.env, tokens.accessToken)
    if (!info.id) throw new OuraError(502, 'personal_info 未返回用户 id，请确认已授予 personal 权限')
    const existing = await getUser(c.env, info.id)
    const rec: UserRecord = {
      id: info.id,
      email: info.email ?? existing?.email,
      tokens,
      connectedAt: existing?.connectedAt ?? Math.floor(Date.now() / 1000),
    }
    await saveUser(c.env, rec)
    return c.html(connectedPage(rec.email, rec.id))
  } catch (e) {
    return c.html(errorPage('连接失败', e instanceof Error ? e.message : String(e)), 502)
  }
})

// ---------------- 管理 API（Bearer ADMIN_KEY 或管理员 cookie） ----------------

app.use('/api/*', async (c, next) => {
  if (await isAdmin(c)) return next()
  return c.json({ error: 'unauthorized' }, 401)
})

app.get('/api/users', async (c) => {
  const users: { id: string; email?: string; connectedAt: number; lastSyncAt?: number }[] = []
  let cursor: string | undefined
  for (;;) {
    const list = await c.env.OURA_KV.list({ prefix: 'user:', cursor })
    for (const k of list.keys) {
      const rec = await getUser(c.env, k.name.slice('user:'.length))
      if (rec) users.push({ id: rec.id, email: rec.email, connectedAt: rec.connectedAt, lastSyncAt: rec.lastSyncAt })
    }
    if (list.list_complete) break
    cursor = list.cursor
  }
  return c.json({ users })
})

app.post('/api/connections/:id/disconnect', async (c) => {
  const id = c.req.param('id')
  if (!(await getUser(c.env, id))) return c.json({ error: 'user_not_found' }, 404)
  await c.env.OURA_KV.delete(`user:${id}`)
  let cursor: string | undefined
  for (;;) {
    const list = await c.env.OURA_KV.list({ prefix: `cache:${id}:`, cursor })
    for (const k of list.keys) await c.env.OURA_KV.delete(k.name)
    if (list.list_complete) break
    cursor = list.cursor
  }
  await c.env.OURA_KV.delete(`dirty:${id}`)
  return c.json({ ok: true })
})

// 注意：summary 路由必须注册在通配 :endpoint 之前
app.get('/api/data/:userId/summary', async (c) => {
  const rec = await getUser(c.env, c.req.param('userId'))
  if (!rec) return c.json({ error: 'user_not_found' }, 404)
  const days = Math.min(Math.max(Number.parseInt(c.req.query('days') ?? '30', 10) || 30, 1), 365)
  const range = { start_date: isoDay(-(days - 1)), end_date: isoDay(0) }
  try {
    // 先串行确保 token 新鲜，避免并发刷新导致 refresh_token 轮换竞态
    await ensureFreshToken(c.env, rec)
    const results = await Promise.all(SUMMARY_ENDPOINTS.map((e) => fetchCached(c.env, rec, e, range)))
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
    const rows = [...byDay.values()].sort((a, b) => (a.date < b.date ? -1 : 1))
    return c.json({ start: range.start_date, end: range.end_date, days: rows })
  } catch (e) {
    return errorResponse(c, e)
  }
})

app.post('/api/sync/:userId', async (c) => {
  const rec = await getUser(c.env, c.req.param('userId'))
  if (!rec) return c.json({ error: 'user_not_found' }, 404)
  const days = Math.min(Math.max(Number.parseInt(c.req.query('days') ?? '30', 10) || 30, 1), 365)
  const range = { start_date: isoDay(-(days - 1)), end_date: isoDay(0) }
  const synced: Record<string, boolean> = {}
  try {
    await ensureFreshToken(c.env, rec)
    for (const e of SUMMARY_ENDPOINTS) {
      try {
        await fetchCached(c.env, rec, e, range)
        synced[e] = true
      } catch {
        synced[e] = false
      }
    }
    rec.lastSyncAt = Math.floor(Date.now() / 1000)
    await saveUser(c.env, rec)
    await c.env.OURA_KV.delete(`dirty:${rec.id}`)
    return c.json({ ok: true, synced })
  } catch (e) {
    return errorResponse(c, e)
  }
})

app.get('/api/data/:userId/:endpoint', async (c) => {
  const endpoint = c.req.param('endpoint')
  if (!ENDPOINTS[endpoint]) return c.json({ error: 'unknown_endpoint', allowed: Object.keys(ENDPOINTS) }, 404)
  const rec = await getUser(c.env, c.req.param('userId'))
  if (!rec) return c.json({ error: 'user_not_found' }, 404)
  const params: Record<string, string> = {}
  for (const k of QUERY_ALLOW) {
    const v = c.req.query(k)
    if (v) params[k] = v
  }
  try {
    const { data, hit } = await fetchCached(c.env, rec, endpoint, params)
    c.header('x-cache', hit ? 'HIT' : 'MISS')
    return c.json(data)
  } catch (e) {
    return errorResponse(c, e)
  }
})

// ---------------- Oura webhook ----------------

app.post('/api/webhook/subscribe', async (c) => {
  const origin = redirectUri(c).replace(/\/auth\/callback$/, '')
  const single = c.req.query('data_type')
  const targets = single ? [single] : WEBHOOK_DATA_TYPES
  const results: any[] = []
  for (const data_type of targets) {
    const res = await fetch(`${'https://api.ouraring.com'}/v2/webhook/subscription`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-client-id': c.env.OURA_CLIENT_ID,
        'x-client-secret': c.env.OURA_CLIENT_SECRET,
      },
      body: JSON.stringify({ endpoint: `${origin}/webhook/oura`, event_type: 'create_update', data_type }),
    })
    const body = await res.json().catch(() => null)
    results.push({ data_type, status: res.status, body })
  }
  return c.json({ results })
})

app.post('/webhook/oura', async (c) => {
  const raw = await c.req.text()
  const body: any = (() => {
    try {
      return JSON.parse(raw)
    } catch {
      return {}
    }
  })()
  const sig = c.req.header('x-oura-signature') ?? ''
  const expected = await hmacHex(c.env.OURA_CLIENT_SECRET, raw)
  // 订阅验证请求：原样返回 verification_code
  if (body.verification_code) {
    if (sig !== expected) return c.json({ error: 'invalid signature' }, 401)
    return c.json({ verification_code: body.verification_code })
  }
  if (sig !== expected) return c.json({ error: 'invalid signature' }, 401)
  const userId = body?.user_id ? String(body.user_id) : ''
  if (userId) await c.env.OURA_KV.put(`dirty:${userId}`, String(Date.now()), { expirationTtl: 86_400 })
  return c.json({ ok: true })
})

// ---------------- 定时任务：保活 token + 预取数据 ----------------

async function cronSync(env: Env): Promise<void> {
  if (!env.OURA_CLIENT_ID || !env.OURA_CLIENT_SECRET) return
  const prefetch = env.CRON_PREFETCH !== '0'
  let cursor: string | undefined
  for (;;) {
    const list = await env.OURA_KV.list({ prefix: 'user:', cursor })
    for (const k of list.keys) {
      const rec = await getUser(env, k.name.slice('user:'.length))
      if (!rec) continue
      try {
        await ensureFreshToken(env, rec)
        if (prefetch) {
          const range = { start_date: isoDay(-1), end_date: isoDay(0) }
          for (const e of SUMMARY_ENDPOINTS) {
            try {
              await fetchCached(env, rec, e, range)
            } catch {
              // 单个用户/端点失败不影响其他用户
            }
          }
        }
        rec.lastSyncAt = Math.floor(Date.now() / 1000)
        await saveUser(env, rec)
      } catch (e) {
        console.log(`cron sync failed for ${rec.id}:`, e instanceof Error ? e.message : e)
      }
    }
    if (list.list_complete) break
    cursor = list.cursor
  }
}

export default {
  fetch: app.fetch,
  scheduled: (_controller: ScheduledController, env: Env, ctx: ExecutionContext) => {
    ctx.waitUntil(cronSync(env))
  },
}
