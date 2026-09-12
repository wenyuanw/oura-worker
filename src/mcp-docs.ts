import { esc, shell } from './dashboard'

export function mcpDocsPage(origin: string): string {
  const endpoint = `${origin}/mcp`
  const cliCmd = `claude mcp add --transport http oura ${endpoint} \\\n  --header "Authorization: Bearer <ADMIN_KEY>"`
  const desktopJson = JSON.stringify(
    { mcpServers: { oura: { type: 'http', url: endpoint, headers: { Authorization: 'Bearer <ADMIN_KEY>' } } } },
    null,
    2,
  )
  const agentPrompt = `请把我的 Oura Ring 戒指健康数据服务接入你的能力范围，然后查询数据。

## 服务信息
- 协议：MCP（Model Context Protocol），Streamable HTTP 传输，无状态
- 端点：${endpoint}
- 鉴权：每个请求带 Header「Authorization: Bearer <ADMIN_KEY>」

## 接入方式（按你的能力选择其一）

A. 你的运行环境原生支持 MCP：注册一个名为 oura 的 Streamable HTTP 服务器，URL 与鉴权头如上。例如 Claude Code 可执行：
   claude mcp add --transport http oura ${endpoint} --header "Authorization: Bearer <ADMIN_KEY>"

B. 你可以执行 shell 命令：用 curl 以 POST + JSON-RPC 2.0 直接调用（Header 需含 content-type: application/json 与上述 Authorization）：
   1) 握手：curl -s -X POST ${endpoint} -H "authorization: Bearer <ADMIN_KEY>" -H "content-type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"agent","version":"1"}}}'
   2) 列出工具：同上，body 为 {"jsonrpc":"2.0","id":2,"method":"tools/list"}
   3) 调用工具：同上，body 为 {"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_daily_summary","arguments":{"alias":"我","days":7}}}

C. 你只能发起简单 HTTP GET：直接用 REST 接口（无需 MCP）：
   用户列表：curl -s -H "authorization: Bearer <ADMIN_KEY>" "${origin}/api/users"
   每日概览：curl -s -H "authorization: Bearer <ADMIN_KEY>" "${origin}/api/data/<userId>/summary?days=7"

## 可用工具（MCP）
1. list_users() —— 列出用户（id、邮箱、备注名：「我」「老婆」）
2. get_daily_summary({ userId?/email?/alias?, days?, startDate?, endDate? }) —— 每日睡眠/恢复度/活动评分、静息心率、HRV 平衡
3. get_oura_data({ endpoint, userId?/email?/alias?, startDate?, endDate?, nextToken? }) —— 任意 Oura 端点原始数据；heartrate 必须带 startDate/endDate；翻页时把返回的 next_token 传入 nextToken

## 约定
- 多人数据：用 alias（「我」「老婆」）或 email 部分匹配定位；不确定先 list_users
- get_daily_summary 返回体含 user 字段，回答时请注明数据归属

## 现在执行
完成接入后：调用 list_users，然后查询每个用户最近 7 天的 get_daily_summary，分人用表格总结睡眠/恢复度趋势，并各指出最异常的一天。`

  return shell(
    'Oura MCP 接入文档',
    `<div class="wrap">
  <div class="row" style="margin-bottom:24px">
    <div class="brand" style="margin-right:auto"><span class="mark"></span>Oura MCP 接入文档</div>
    <a class="btn" href="/">← 返回看板</a>
  </div>

  <div class="panel">
    <h2>端点</h2>
    <p class="desc">MCP Streamable HTTP（无状态），兼容协议版本 2024-11-05 / 2025-03-26 / 2025-06-18</p>
    <div class="row">
      <span class="chip" id="epUrl">${esc(endpoint)}</span>
      <button class="copy-btn" data-copy="#epUrl">复制</button>
    </div>
    <p class="desc" style="margin:14px 0 0">鉴权二选一：请求头 <code>Authorization: Bearer &lt;ADMIN_KEY&gt;</code>；客户端不支持自定义 Header 时，改用 <code>${esc(endpoint)}?key=&lt;ADMIN_KEY&gt;</code>。ADMIN_KEY 即看板登录密钥。</p>
  </div>

    <div class="panel">
      <h2>可用工具</h2>
      <p class="desc">所有工具共享看板的 KV 缓存与 token 自动刷新，Oura 限流时返回错误提示稍后重试即可。多用户时可用 email（部分匹配）或 alias（备注名，在看板 → 设置 → 用户备注名 里设置，如「我」「老婆」）定位到具体的人</p>
      <div style="overflow:auto">
      <table>
        <tr><th>工具</th><th>说明</th><th>参数</th></tr>
        <tr><td class="mono">list_users</td><td>列出已接入用户（id、邮箱、备注名、最近同步时间）</td><td class="mono">—</td></tr>
        <tr><td class="mono">get_daily_summary</td><td>每日概览：睡眠 / 恢复度 / 活动评分、静息心率、HRV 平衡</td><td class="mono">userId? · email? · alias? · days? · startDate? · endDate?</td></tr>
        <tr><td class="mono">get_oura_data</td><td>查询任意 Oura v2 端点原始数据</td><td class="mono">endpoint（必填）· userId? · email? · alias? · startDate? · endDate? · nextToken?</td></tr>
      </table>
      </div>
      <p class="desc" style="margin:12px 0 0">端点可选值与看板探索器一致：daily_sleep / daily_readiness / daily_activity / daily_stress / daily_resilience / daily_spo2 / daily_cardiovascular_age / vo2_max / sleep / sleep_time / heartrate / session / workout / tag / enhanced_tag / rest_mode_period / ring_configuration / personal_info</p>
    </div>

  <div class="panel">
    <h2>Claude Code / CLI 接入</h2>
    <p class="desc">在终端执行（把 &lt;ADMIN_KEY&gt; 换成你的密钥）</p>
    <pre id="cliCmd">${esc(cliCmd)}</pre>
    <div class="row" style="margin-top:10px"><button class="copy-btn" data-copy="#cliCmd">复制命令</button></div>
  </div>

  <div class="panel">
    <h2>Claude Desktop / 通用客户端配置</h2>
    <p class="desc">编辑 claude_desktop_config.json，或填写到客户端的「自定义连接器 / MCP 服务器」表单</p>
    <pre id="deskJson">${esc(desktopJson)}</pre>
    <div class="row" style="margin-top:10px"><button class="copy-btn" data-copy="#deskJson">复制 JSON</button></div>
  </div>

  <div class="panel">
    <h2>给 Agent 的 Prompt（一键复制）</h2>
    <p class="desc">整段复制、粘贴给任何已接入本 MCP 的 AI Agent；Agent 没有 MCP 能力时，也可以让它按这段说明直接通过 HTTP 调用</p>
    <pre id="agentPrompt">${esc(agentPrompt)}</pre>
    <div class="row" style="margin-top:10px"><button class="copy-btn primary" data-copy="#agentPrompt">复制完整 Prompt</button></div>
  </div>

  <div class="panel">
    <h2>常见问题</h2>
    <div style="overflow:auto">
    <table>
      <tr><th>现象</th><th>原因与处理</th></tr>
      <tr><td class="mono">401 unauthorized</td><td>ADMIN_KEY 不对，或 Header 格式不是「Bearer 密钥」</td></tr>
      <tr><td class="mono">还没有用户连接</td><td>先在浏览器完成 <a href="/auth/oura">/auth/oura</a> 的 Oura 授权</td></tr>
      <tr><td class="mono">429 / Oura 限流</td><td>触达 Oura 限流（每 5 分钟 5000 次），稍后重试；服务端有缓存，通常不会触发</td></tr>
      <tr><td class="mono">连不上 workers.dev</td><td>部分地区网络访问 workers.dev 受阻，可给 Worker 绑定自定义域名后把端点换成自定义域名</td></tr>
      <tr><td class="mono">只想暴露某个人的数据</td><td>在看板 → 设置 → 个人数据 Key 为该用户生成独立 Key，用它做 Bearer 鉴权（API 与 MCP 均生效），即只能查询此人的数据、无法查看他人</td></tr>
    </table>
    </div>
  </div>
</div>
<script>
Array.prototype.forEach.call(document.querySelectorAll('.copy-btn'), function (b) {
  b.onclick = function () {
    var el = document.querySelector(b.getAttribute('data-copy'))
    if (!el) return
    var text = el.tagName === 'INPUT' ? el.value : el.textContent
    var old = b.textContent
    function done() { b.textContent = '已复制 ✓'; setTimeout(function () { b.textContent = old }, 1500) }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done)
    } else {
      var ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      done()
    }
  }
})
</script>`,
  )
}
