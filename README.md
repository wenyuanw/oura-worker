# oura-worker — Oura Ring 多用户数据服务（Cloudflare Workers）

一个部署在 Cloudflare Workers 上的 Oura Ring 数据服务：

- **多用户 OAuth2 接入**：每个 Oura 用户通过授权链接接入，token 自动刷新（KV 存储）
- **数据读取 API**：代理 Oura v2 全部数据端点，带 KV 缓存与限流透传
- **管理看板**：评分卡片、趋势图表（Chart.js）、原始数据探索器
- **定时任务**：每小时刷新 token 保活，并预取昨日+今日概览数据
- **Webhook（可选）**：接收 Oura 数据更新推送

## 部署步骤

```bash
npm install

# 1. 登录 Cloudflare（浏览器授权），或在 CI 中设置 CLOUDFLARE_API_TOKEN
npx wrangler login

# 2. 创建 KV 命名空间，把输出的 id 填入 wrangler.toml 的 kv_namespaces.id
npm run kv:create

# 3. 配置密钥（secrets）
npx wrangler secret put OURA_CLIENT_ID     # Oura 应用的 Client ID
npx wrangler secret put OURA_CLIENT_SECRET # Oura 应用的 Client Secret
npx wrangler secret put ADMIN_KEY          # 看板/API 管理密钥（自定，如 openssl rand -hex 16）

# 4. 部署
npm run deploy
```

部署完成后记下 Worker 域名（形如 `https://oura-service.<你的子域>.workers.dev`）。

## 回调 URL（Redirect URI）设置 —— 重要

在 **Oura 开发者后台**（[cloud.ouraring.com](https://cloud.ouraring.com) → My Applications → 你的应用 → Redirect URI 字段）设置为：

```
https://oura-service.<你的子域>.workers.dev/auth/callback
```

必须与上面完全一致（协议、域名、端口、路径都不能差）。Oura 的 authorize 接口在 redirect_uri 与注册值不匹配时会直接返回 `400 invalid_request`。

本地调试时把 Redirect URI 临时改为 `http://localhost:8787/auth/callback`，跑完再改回线上地址（Oura 一个应用仅支持一个回调地址）。

## 多用户接入

把授权链接发给任何一个 Oura 用户（看板顶部有复制按钮）：

```
https://<worker域名>/auth/oura
```

用户在 Oura 登录并同意授权后即接入服务，各自的数据互相隔离（KV 按 Oura user id 存储）。
未获 Oura 正式批准的应用最多接入 10 个用户。

## API

除 `/auth/*` 与 `/webhook/oura` 外均需鉴权：管理员 cookie（看板登录）或 `Authorization: Bearer <ADMIN_KEY>`。
此外可为每个用户生成独立的**个人数据 Key**（看板 → 设置），用该 Key 鉴权只能查询此人的数据（API 与 MCP 均生效），适合把 Key 交给对应的人自己用。

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/users` | 已接入用户列表 |
| POST | `/api/sync/:userId?days=30` | 立即拉取近 N 天概览数据入缓存 |
| GET | `/api/data/:userId/summary?days=30` | 聚合的每日睡眠/恢复度/活动/静息心率/HRV |
| GET | `/api/data/:userId/:endpoint` | 代理任意 Oura 端点（见下），支持 `start_date`、`end_date`、`next_token` |
| POST | `/api/connections/:id/disconnect` | 断开用户并清除缓存（管理员） |
| POST | `/api/connections/:id/alias` | 设置用户备注名，MCP 可用 alias 定位（管理员） |
| POST | `/api/connections/:id/key` | 生成/重置该用户的个人数据 Key（管理员） |
| POST | `/api/webhook/subscribe` | 注册 Oura webhook 订阅（可加 `?data_type=`） |
| POST | `/webhook/oura` | Oura webhook 接收端（含 HMAC 签名校验） |

`:endpoint` 白名单：`personal_info` `ring_configuration` `daily_activity` `daily_readiness` `daily_sleep` `daily_spo2` `daily_stress` `daily_resilience` `daily_cardiovascular_age` `vo2_max` `rest_mode_period` `sleep` `sleep_time` `heartrate` `session` `workout` `tag` `enhanced_tag`

示例：

```bash
KEY=<ADMIN_KEY>
BASE=https://oura-service.xxx.workers.dev

curl -s -H "Authorization: Bearer $KEY" $BASE/api/users
curl -s -H "Authorization: Bearer $KEY" "$BASE/api/data/<userId>/summary?days=7"
curl -s -H "Authorization: Bearer $KEY" "$BASE/api/data/<userId>/daily_sleep?start_date=2026-09-01&end_date=2026-09-12"
```

## MCP（Model Context Protocol）

Worker 同时是一个 MCP 服务器（无状态 Streamable HTTP 传输），可接入 Claude Desktop / Claude Code / 其它 MCP 客户端：

```
https://oura-service.<你的子域>.workers.dev/mcp
```

提供 3 个工具：`list_users`（列出已接入用户）、`get_daily_summary`（每日睡眠/恢复度/活动/静息心率/HRV 概览）、`get_oura_data`（查询任意 Oura 端点原始数据）。鉴权使用 `ADMIN_KEY`，支持 `Authorization: Bearer` 头或 `?key=` 查询参数。

Claude Code / Claude Desktop 接入示例：

```bash
claude mcp add --transport http oura https://oura-service.xxx.workers.dev/mcp \
  --header "Authorization: Bearer <ADMIN_KEY>"
```

或手动编辑 `claude_desktop_config.json`：

```json
{
  "mcpServers": {
    "oura": {
      "type": "http",
      "url": "https://oura-service.xxx.workers.dev/mcp",
      "headers": { "Authorization": "Bearer <ADMIN_KEY>" }
    }
  }
}
```

不支持自定义请求头的客户端可用 URL 参数形式：`https://.../mcp?key=<ADMIN_KEY>`（注意避免把带 key 的 URL 泄露到日志）。

## 缓存与限流

- 缓存 TTL：`daily_*`/`vo2_max` 等 15 分钟；`heartrate`/`session`/`workout`/`sleep*`/`tag` 5 分钟；`personal_info`/`ring_configuration` 1 小时
- Oura 限流（每 5 分钟 5000 次）触发时透传 `429` 与 `Retry-After`
- Cron（每小时第 17 分）：刷新所有用户 token（剩余寿命 <12h 时），并预取昨日+今日的三个每日端点（`CRON_PREFETCH=0` 可关闭）

## 本地开发

```bash
npm run dev   # http://localhost:8787，KV 为本地模拟
```

本地密钥放在 `.dev.vars`（已被 .gitignore 排除，不要提交）。

## 安全提示

- `.dev.vars`、`wrangler.toml` 中的密钥不要提交到公开仓库；secrets 用 `wrangler secret put` 管理
- 看板/管理 API 的唯一凭据是 `ADMIN_KEY`，请使用长随机值
