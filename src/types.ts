export type TokenSet = {
  accessToken: string
  refreshToken: string
  /** unix 秒 */
  expiresAt: number
  scope: string
}

export type UserRecord = {
  /** Oura 用户 id（来自 personal_info） */
  id: string
  email?: string
  /** 备注名（如「我」「老婆」），MCP/看板展示与定位用 */
  alias?: string
  /** 个人数据 Key：持有人只能查询此用户的数据 */
  userKey?: string
  tokens: TokenSet
  connectedAt: number
  lastSyncAt?: number
}

/** 请求的访问级别：admin 全权限；user 只能访问 rec 自己的数据 */
export type Access = { admin: true } | { admin: false; rec: UserRecord }

export type Env = {
  OURA_KV: KVNamespace
  OURA_CLIENT_ID: string
  OURA_CLIENT_SECRET: string
  ADMIN_KEY: string
  OURA_SCOPE?: string
  REDIRECT_ORIGIN?: string
  CRON_PREFETCH?: string
}
