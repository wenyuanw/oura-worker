import type { Context, Hono } from 'hono'
import { ENDPOINTS } from './oura'
import { fetchCached, getSummaryRows, listUsers } from './data'
import type { Env, UserRecord } from './types'
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
      description: '列出已接入本服务的所有 Oura 用户（id、邮箱、连接与最近同步时间）',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    },
    {
      name: 'get_daily_summary',
      description:
        '获取按日期合并的每日概览：睡眠评分、恢复度、活动评分、静息心率、HRV 平衡。默认最近 30 天，可用 days 或 startDate/endDate 控制',
      inputSchema: {
        type: 'object',
        properties: {
          userId: { type: 'string', description: 'Oura 用户 id；省略时若服务内只有一个用户则自动使用' },
          days: { type: 'number', description: '回溯天数（1–365，默认 30），仅在未提供 startDate 时生效' },
          startDate: { type: 'string', description: '起始日期 YYYY-MM-DD' },
          endDate: { type: 'string', description: '结束日期 YYYY-MM-DD' },
        },
      },
    },
    {
      name: 'get_oura_data',
      description: '查询任意 Oura v2 端点的原始数据（睡眠分期、心率、锻炼、标签等）',
      inputSchema: {
        type: 'object',
        required: ['endpoint'],
        properties: {
          endpoint: {
            type: 'string',
            enum: Object.keys(ENDPOINTS),
            description: 'Oura 端点名；heartrate 必须提供 startDate/endDate',
          },
          userId: { type: 'string', description: 'Oura 用户 id；省略时若只有一个用户则自动使用' },
          startDate: { type: 'string', description: '起始日期 YYYY-MM-DD' },
          endDate: { type: 'string', description: '结束日期 YYYY-MM-DD' },
          nextToken: { type: 'string', description: '分页 token（上一页响应中的 next_token）' },
        },
      },
    },
  ]
}

/** 解析目标用户：省略 userId 时，单用户自动选定；多用户则返回引导文本 */
async function resolveUser(env: Env, userId?: string): Promise<{ rec: UserRecord } | { errorText: string }> {
  if (userId) {
    const rec = await listUsers(env).then((all) => all.find((u) => u.id === userId))
    if (!rec) return { errorText: `未找到用户 ${userId}，请先用 list_users 查看已接入用户` }
    return { rec }
  }
  const users = await listUsers(env)
  if (users.length === 0) {
    return { errorText: '还没有用户连接。先访问 /auth/oura 完成 Oura 授权后再试' }
  }
  if (users.length > 1) {
    const list = users.map((u) => `${u.id}（${u.email ?? '未提供邮箱'}）`).join('、')
    return { errorText: `服务中有 ${users.length} 个用户：${list}。请通过 userId 参数指定` }
  }
  return { rec: users[0] }
}

async function callTool(env: Env, name: string, args: any): Promise<{ content: any[]; isError?: boolean }> {
  const text = (t: string) => ({ type: 'text', text: t })
  try {
    if (name === 'list_users') {
      const users = await listUsers(env)
      return {
        content: [
          text(
            JSON.stringify(
              {
                users: users.map((u) => ({
                  id: u.id,
                  email: u.email ?? null,
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
      const u = await resolveUser(env, args?.userId)
      if ('errorText' in u) return { content: [text(u.errorText)], isError: true }
      const daysRaw = Number.parseInt(String(args?.days ?? '30'), 10)
      const days = Number.isFinite(daysRaw) ? Math.min(Math.max(daysRaw, 1), 365) : 30
      const start = typeof args?.startDate === 'string' && args.startDate ? args.startDate : isoDay(-(days - 1))
      const end = typeof args?.endDate === 'string' && args.endDate ? args.endDate : isoDay(0)
      const rows = await getSummaryRows(env, u.rec, { start, end })
      return { content: [text(JSON.stringify({ start, end, days: rows }, null, 2))] }
    }

    if (name === 'get_oura_data') {
      const endpoint = String(args?.endpoint ?? '')
      if (!ENDPOINTS[endpoint]) {
        return { content: [text(`未知端点 ${endpoint}，可用：${Object.keys(ENDPOINTS).join(', ')}`)], isError: true }
      }
      const u = await resolveUser(env, args?.userId)
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

function respond(c: Context<{ Bindings: Env }>, wantsSSE: boolean, payload: any): Response {
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

async function handleMcpPost(c: Context<{ Bindings: Env }>): Promise<Response> {
  const adminKey = c.env.ADMIN_KEY
  if (!adminKey) {
    return new Response(JSON.stringify({ error: 'ADMIN_KEY 未配置' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'content-type': 'application/json' },
    })
  }
  const auth = c.req.header('authorization')
  const bearer = auth?.startsWith('Bearer ') ? auth.slice(7) : undefined
  const queryKey = c.req.query('key')
  if (bearer !== adminKey && queryKey !== adminKey) {
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
        const result = await callTool(c.env, msg.params?.name, msg.params?.arguments ?? {})
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

export function registerMcpRoutes(app: Hono<{ Bindings: Env }>): void {
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
