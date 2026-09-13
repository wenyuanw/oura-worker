import type { Context, Hono } from 'hono'
import { ENDPOINTS } from './oura'
import { fetchCached, getSummary, listUsers, resolveAccess } from './data'
import type { Access, Env, UserRecord } from './types'
import { isoDay } from './util'

/**
 * 无状态 MCP（Model Context Protocol）服务器，Streamable HTTP 传输：
 * 单一 POST /mcp 端点处理 JSON-RPC 2.0；不维护会话（无 Mcp-Session-Id）。
 * 鉴权：Authorization: Bearer <ADMIN_KEY> 或 ?key=<ADMIN_KEY>。
 */

const JSONRPC_VERSION = '2.0'
const SUPPORTED_PROTOCOL_VERSIONS = ['2024-11-05', '2025-03-26', '2025-06-18']
const LATEST_PROTOCOL_VERSION = '2025-06-18'
const SERVER_INFO = { name: 'oura-service', title: 'Oura Ring 数据服务', version: '1.1.0' }

const ERR_PARSE = -32700
const ERR_INVALID_REQUEST = -32600
const ERR_METHOD_NOT_FOUND = -32601
const ERR_INTERNAL = -32603

const CORS_HEADERS: Record<string, string> = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS',
  'access-control-allow-headers': 'authorization, content-type, mcp-session-id, last-event-id, mcp-protocol-version',
  'access-control-expose-headers': 'mcp-session-id',
}

type JsonRpcId = string | number | null
type JsonRpcResponse = {
  jsonrpc: string
  id: JsonRpcId
  result?: any
  error?: { code: number; message: string }
}

function ok(id: JsonRpcId, result: any): JsonRpcResponse {
  return { jsonrpc: JSONRPC_VERSION, id, result }
}

function rpcError(id: JsonRpcId, code: number, message: string): JsonRpcResponse {
  return { jsonrpc: JSONRPC_VERSION, id, error: { code, message } }
}

function toolDefinitions() {
  return [
    {
      name: 'list_users',
      description: '列出已接入本服务的所有 Oura 用户（id、邮箱、备注名、连接与最近同步时间）',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    },
    {
      name: 'get_daily_summary',
      description:
        '获取某个用户按日期合并的每日概览：睡眠/恢复度/活动评分、静息心率（BPM）、HRV 平衡、睡眠结构（deep/rem/light/awake 秒）、睡眠效率、睡眠窗口（bedStartH/bedEndH，正午起算小时）、5 分钟眠动图（hypno）、压力/恢复时长（秒）、血氧、韧性等级、血管年龄、VO2 max。默认最近 30 天，可用 days 或 startDate/endDate 控制',
      inputSchema: {
        type: 'object',
        properties: {
          userId: { type: 'string', description: 'Oura 用户 id' },
          email: { type: 'string', description: '按邮箱定位用户（支持部分匹配，忽略大小写）' },
          alias: { type: 'string', description: '按备注名定位用户（备注名在看板设置里设置，如「我」「老婆」）' },
          days: { type: 'number', description: '回溯天数（1–365，默认 30），仅在未提供 startDate 时生效' },
          startDate: { type: 'string', description: '起始日期 YYYY-MM-DD' },
          endDate: { type: 'string', description: '结束日期 YYYY-MM-DD' },
        },
      },
    },
    {
      name: 'get_today_overview',
      description:
        '获取某个用户「今天」的每日概览（按用户本地时区）：睡眠评分、恢复度、活动评分、静息心率（睡眠期间平均心率，次/分）、HRV 平衡，并附带当前实时心率。同时返回昨天数据作对照——今日的睡眠/恢复度通常在早晨首次同步后才生成，缺失时请参考昨日',
      inputSchema: {
        type: 'object',
        properties: {
          userId: { type: 'string', description: 'Oura 用户 id' },
          email: { type: 'string', description: '按邮箱定位用户（支持部分匹配，忽略大小写）' },
          alias: { type: 'string', description: '按备注名定位用户（备注名在看板设置里设置，如「我」「老婆」）' },
        },
      },
    },
    {
      name: 'get_oura_data',
      description: '查询某个用户的任意 Oura v2 端点原始数据（睡眠分期、心率、锻炼、标签等）',
      inputSchema: {
        type: 'object',
        required: ['endpoint'],
        properties: {
          endpoint: {
            type: 'string',
            enum: Object.keys(ENDPOINTS),
            description: 'Oura 端点名；heartrate 必须提供 startDate/endDate',
          },
          userId: { type: 'string', description: 'Oura 用户 id' },
          email: { type: 'string', description: '按邮箱定位用户（支持部分匹配，忽略大小写）' },
          alias: { type: 'string', description: '按备注名定位用户（备注名在看板设置里设置）' },
          startDate: { type: 'string', description: '起始日期 YYYY-MM-DD' },
          endDate: { type: 'string', description: '结束日期 YYYY-MM-DD' },
          nextToken: { type: 'string', description: '分页 token（上一页响应中的 next_token）' },
        },
      },
    },
  ]
}

/** 拼接用户列表（含备注名），用于错误提示 */
function describeUsers(users: UserRecord[]): string {
  return users
    .map((u) => (u.alias ? `${u.alias}（${u.email || u.id.slice(0, 8)}）` : u.email || u.id.slice(0, 8)))
    .join('、')
}

/** 解析目标用户：用户 Key 访问时强制限定本人；管理员支持 userId / email / alias 定位 */
async function resolveUser(env: Env, args: any, access: Access): Promise<{ rec: UserRecord } | { errorText: string }> {
  if (!access.admin) return { rec: access.rec }
  const users = await listUsers(env)
  if (!users.length) {
    return { errorText: '还没有用户连接。先访问 /auth/oura 完成 Oura 授权后再试' }
  }
  const userId = typeof args?.userId === 'string' && args.userId ? args.userId : ''
  const email = typeof args?.email === 'string' && args.email ? args.email.trim().toLowerCase() : ''
  const alias = typeof args?.alias === 'string' && args.alias ? args.alias.trim().toLowerCase() : ''
  if (userId) {
    const rec = users.find((u) => u.id === userId)
    if (!rec) return { errorText: `未找到用户 ${userId}，可用：${describeUsers(users)}` }
    return { rec }
  }
  if (email) {
    const matches = users.filter((u) => (u.email || '').toLowerCase().includes(email))
    if (matches.length === 1) return { rec: matches[0] }
    if (matches.length > 1) return { errorText: `邮箱「${email}」匹配到多个用户：${describeUsers(matches)}，请更精确地指定` }
    return { errorText: `没有邮箱包含「${email}」的用户，可用：${describeUsers(users)}` }
  }
  if (alias) {
    const matches = users.filter((u) => (u.alias || '').toLowerCase().includes(alias))
    if (matches.length === 1) return { rec: matches[0] }
    if (matches.length > 1) return { errorText: `备注名「${alias}」匹配到多个用户：${describeUsers(matches)}，请更精确地指定` }
    return { errorText: `没有备注名包含「${alias}」的用户，可用：${describeUsers(users)}` }
  }
  if (users.length === 1) return { rec: users[0] }
  return { errorText: `服务中有 ${users.length} 个用户：${describeUsers(users)}。请用 userId、email 或 alias 参数指定` }
}

async function callTool(env: Env, name: string, args: any, access: Access): Promise<{ content: any[]; isError?: boolean }> {
  const text = (t: string) => ({ type: 'text', text: t })
  try {
    if (name === 'list_users') {
      const users = access.admin ? await listUsers(env) : [access.rec]
      return {
        content: [
          text(
            JSON.stringify(
              {
                users: users.map((u) => ({
                  id: u.id,
                  email: u.email ?? null,
                  alias: u.alias ?? null,
                  connectedAt: new Date(u.connectedAt * 1000).toISOString(),
                  lastSyncAt: u.lastSyncAt ? new Date(u.lastSyncAt * 1000).toISOString() : null,
                })),
              },
              null,
              2,
            ),
          ),
        ],
      }
    }

    if (name === 'get_daily_summary') {
      const u = await resolveUser(env, args, access)
      if ('errorText' in u) return { content: [text(u.errorText)], isError: true }
      const daysRaw = Number.parseInt(String(args?.days ?? '30'), 10)
      const days = Number.isFinite(daysRaw) ? Math.min(Math.max(daysRaw, 1), 365) : 30
      const start = typeof args?.startDate === 'string' && args.startDate ? args.startDate : isoDay(-(days - 1))
      const end = typeof args?.endDate === 'string' && args.endDate ? args.endDate : isoDay(0)
      const { rows, age } = await getSummary(env, u.rec, { start, end })
      return {
        content: [
          text(
            JSON.stringify(
              {
                user: { id: u.rec.id, email: u.rec.email ?? null, alias: u.rec.alias ?? null },
                profile: { age: age ?? null },
                start,
                end,
                days: rows,
              },
              null,
              2,
            ),
          ),
        ],
      }
    }

    if (name === 'get_today_overview') {
      const u = await resolveUser(env, args, access)
      if ('errorText' in u) return { content: [text(u.errorText)], isError: true }
      // Oura 的 day 按用户本地日期划分；personal_info 无时区字段，
      // 这里从 daily_sleep.timestamp 的 UTC 偏移推出用户本地的「今天」
      let offsetMin = 0
      try {
        const { data } = await fetchCached(env, u.rec, 'daily_sleep', { start_date: isoDay(-2), end_date: isoDay(0) })
        const rows: any[] = data?.data ?? []
        for (let i = rows.length - 1; i >= 0; i--) {
          const ts = rows[i]?.timestamp
          const m = typeof ts === 'string' ? ts.match(/([+-])(\d{2}):?(\d{2})$/) : null
          if (m) {
            offsetMin = (Number(m[2]) * 60 + Number(m[3])) * (m[1] === '-' ? -1 : 1)
            break
          }
        }
      } catch {
        // 拿不到时区就按 UTC 处理
      }
      const localDay = (offsetDays: number) =>
        new Date(Date.now() + offsetMin * 60_000 + offsetDays * 86_400_000).toISOString().slice(0, 10)
      const today = localDay(0)
      const yesterday = localDay(-1)
      const { rows } = await getSummary(env, u.rec, { start: yesterday, end: today })
      const pick = (d: string) => rows.find((r) => r.date === d) ?? null
      let currentHeartRate: { bpm: number; timestamp: string | null; source: string | null } | null = null
      try {
        const { data } = await fetchCached(env, u.rec, 'heartrate', { latest: 'true' })
        const row = data?.data?.[0]
        if (row && typeof row.bpm === 'number') {
          currentHeartRate = { bpm: row.bpm, timestamp: row.timestamp ?? null, source: row.source ?? null }
        }
      } catch {
        // 无 heartrate 权限或暂无采样时忽略
      }
      return {
        content: [
          text(
            JSON.stringify(
              {
                user: { id: u.rec.id, email: u.rec.email ?? null, alias: u.rec.alias ?? null },
                today: pick(today),
                yesterday: pick(yesterday),
                currentHeartRate,
              },
              null,
              2,
            ),
          ),
        ],
      }
    }

    if (name === 'get_oura_data') {
      const endpoint = String(args?.endpoint ?? '')
      if (!ENDPOINTS[endpoint]) {
        return { content: [text(`未知端点 ${endpoint}，可用：${Object.keys(ENDPOINTS).join(', ')}`)], isError: true }
      }
      const u = await resolveUser(env, args, access)
      if ('errorText' in u) return { content: [text(u.errorText)], isError: true }
      const params: Record<string, string> = {}
      for (const [k, key] of [
        [args?.startDate, 'start_date'],
        [args?.endDate, 'end_date'],
        [args?.nextToken, 'next_token'],
      ] as const) {
        if (typeof k === 'string' && k) params[key] = k
      }
      const { data } = await fetchCached(env, u.rec, endpoint, params)
      return { content: [text(JSON.stringify(data, null, 2))] }
    }

    return { content: [text(`未知工具: ${name}`)], isError: true }
  } catch (e) {
    return { content: [text(e instanceof Error ? e.message : String(e))], isError: true }
  }
}

function respond(c: Context<{ Bindings: Env; Variables: { access: Access } }>, wantsSSE: boolean, payload: any): Response {
  const body = JSON.stringify(payload)
  if (wantsSSE) {
    return new Response(`event: message\ndata: ${body}\n\n`, {
      status: 200,
      headers: { ...CORS_HEADERS, 'content-type': 'text/event-stream', 'cache-control': 'no-cache' },
    })
  }
  return new Response(body, {
    status: 200,
    headers: { ...CORS_HEADERS, 'content-type': 'application/json' },
  })
}

async function handleMcpPost(c: Context<{ Bindings: Env; Variables: { access: Access } }>): Promise<Response> {
  const access = await resolveAccess(c)
  if (!access) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { ...CORS_HEADERS, 'content-type': 'application/json' },
    })
  }

  const wantsSSE = (c.req.header('accept') ?? '').includes('text/event-stream')

  let body: any
  try {
    body = await c.req.json()
  } catch {
    return respond(c, wantsSSE, rpcError(null, ERR_PARSE, 'Invalid JSON'))
  }

  const messages = Array.isArray(body) ? body : [body]
  const responses: JsonRpcResponse[] = []
  for (const msg of messages) {
    if (!msg || msg.jsonrpc !== JSONRPC_VERSION || typeof msg.method !== 'string') {
      responses.push(rpcError(msg?.id ?? null, ERR_INVALID_REQUEST, 'Invalid JSON-RPC request'))
      continue
    }
    // 通知（无 id）不返回响应，如 notifications/initialized
    if (msg.id === undefined || msg.id === null) continue

    switch (msg.method) {
      case 'initialize': {
        const requested = msg.params?.protocolVersion
        const version = SUPPORTED_PROTOCOL_VERSIONS.includes(requested) ? requested : LATEST_PROTOCOL_VERSION
        responses.push(
          ok(msg.id, {
            protocolVersion: version,
            capabilities: { tools: {} },
            serverInfo: SERVER_INFO,
          }),
        )
        break
      }
      case 'ping':
        responses.push(ok(msg.id, {}))
        break
      case 'tools/list':
        responses.push(ok(msg.id, { tools: toolDefinitions() }))
        break
      case 'tools/call': {
        const result = await callTool(c.env, msg.params?.name, msg.params?.arguments ?? {}, access)
        responses.push(ok(msg.id, result))
        break
      }
      default:
        responses.push(rpcError(msg.id, ERR_METHOD_NOT_FOUND, `Method not found: ${msg.method}`))
    }
  }

  if (responses.length === 0) return new Response(null, { status: 202, headers: CORS_HEADERS })
  if (responses.length === 1) return respond(c, wantsSSE, responses[0])
  return respond(c, wantsSSE, responses)
}

export function registerMcpRoutes(app: Hono<{ Bindings: Env; Variables: { access: Access } }>): void {
  app.options('/mcp', (c) => new Response(null, { status: 204, headers: CORS_HEADERS }))
  app.post('/mcp', (c) => handleMcpPost(c))
  app.get(
    '/mcp',
    (c) =>
      new Response(JSON.stringify({ error: 'stateless server: use POST for JSON-RPC' }), {
        status: 405,
        headers: { ...CORS_HEADERS, 'content-type': 'application/json' },
      }),
  )
  app.delete('/mcp', (c) => new Response(null, { status: 405, headers: CORS_HEADERS }))
}
