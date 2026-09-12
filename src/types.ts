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
  tokens: TokenSet
  connectedAt: number
  lastSyncAt?: number
}

export type Env = {
  OURA_KV: KVNamespace
  OURA_CLIENT_ID: string
  OURA_CLIENT_SECRET: string
  ADMIN_KEY: string
  OURA_SCOPE?: string
  REDIRECT_ORIGIN?: string
  CRON_PREFETCH?: string
}
