const BASE_CSS = `
:root {
  --bg: #000; --surface: #0a0a0a; --surface-2: #111;
  --fg: #ededed; --fg-muted: #a1a1a1; --fg-subtle: #666;
  --border: #262626; --border-strong: #333;
  --hover-bg: #1a1a1a; --hover-border: #444; --menu-hover: #1c1c1c;
  --avatar-bg: #262626; --topbar-bg: rgba(0,0,0,.75); --overlay-bg: rgba(0,0,0,.65);
  --primary-fg: #000; --primary-hover-bg: #fff;
  --chart-grid: #1c1c1c; --chart-tick: #666; --legend-text: #a1a1a1;
  --shadow-menu: 0 12px 32px rgba(0,0,0,.55); --shadow-modal: 0 24px 64px rgba(0,0,0,.6);
  --tip-bg: rgba(17,17,17,.96); --tip-border: #333;
  --scroll-thumb: #333;
  --accent: #0070f3; --red: #ee0000; --green: #50e3c2; --amber: #f5a623; --purple: #7928ca;
  color-scheme: dark;
}
:root[data-theme="light"] {
  --bg: #fff; --surface: #fafafa; --surface-2: #f5f5f5;
  --fg: #171717; --fg-muted: #666; --fg-subtle: #999;
  --border: #eaeaea; --border-strong: #d4d4d4;
  --hover-bg: #f0f0f0; --hover-border: #999; --menu-hover: #ededed;
  --avatar-bg: #eaeaea; --topbar-bg: rgba(255,255,255,.8); --overlay-bg: rgba(0,0,0,.4);
  --primary-fg: #fff; --primary-hover-bg: #383838;
  --chart-grid: #eaeaea; --chart-tick: #999; --legend-text: #666;
  --shadow-menu: 0 12px 32px rgba(0,0,0,.12); --shadow-modal: 0 24px 64px rgba(0,0,0,.18);
  --tip-bg: rgba(255,255,255,.98); --tip-border: #d4d4d4;
  --scroll-thumb: #ccc;
  color-scheme: light;
}
* { box-sizing: border-box }
html { background: var(--bg) }
body { margin:0; background:var(--bg); color:var(--fg);
  font:14px/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Helvetica,"PingFang SC","Microsoft YaHei",sans-serif;
  letter-spacing:-0.01em; -webkit-font-smoothing:antialiased }
code, pre, .mono { font-family:ui-monospace,"Geist Mono",SFMono-Regular,Menlo,Consolas,monospace; letter-spacing:0 }
a { color:var(--fg); text-decoration:none }
a:hover { color:var(--fg-muted) }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; border-radius:4px }
::selection { background:#0070f3; color:#fff }
::-webkit-scrollbar { width:10px; height:10px }
::-webkit-scrollbar-thumb { background:var(--scroll-thumb); border-radius:5px; border:2px solid var(--bg) }
::-webkit-scrollbar-track { background:transparent }

/* ---- buttons & controls ---- */
button, .btn { display:inline-flex; align-items:center; justify-content:center; gap:6px;
  height:32px; padding:0 14px; border-radius:6px; font-size:13px; font-weight:500;
  background:var(--surface-2); border:1px solid var(--border-strong); color:var(--fg);
  cursor:pointer; transition:border-color .15s, background .15s, color .15s; text-decoration:none }
button:hover, .btn:hover { background:var(--hover-bg); border-color:var(--hover-border) }
button.primary { background:var(--fg); color:var(--primary-fg); border-color:var(--fg) }
button.primary:hover { background:var(--primary-hover-bg); border-color:var(--primary-hover-bg) }
button.danger { color:var(--red) }
button.danger:hover { border-color:var(--red); background:rgba(238,0,0,.08) }
button:disabled { opacity:.45; cursor:not-allowed }
select, input { height:32px; padding:0 10px; border-radius:6px; font-size:13px;
  background:var(--surface); border:1px solid var(--border-strong); color:var(--fg);
  font-family:inherit; transition:border-color .15s }
select:hover, input:hover { border-color:var(--hover-border) }
input[type=password] { height:40px; width:100%; margin:16px 0 12px; padding:0 12px; font-size:14px }
.seg { display:inline-flex; border:1px solid var(--border-strong); border-radius:6px; overflow:hidden }
.seg button { height:30px; border:none; border-radius:0; background:transparent; padding:0 12px }
.seg button + button { border-left:1px solid var(--border) }
.seg button:hover { background:var(--surface-2) }
.seg button.active { background:var(--border-strong); color:var(--fg) }
.chip { display:inline-flex; align-items:center; gap:8px; padding:6px 10px; border-radius:6px;
  background:var(--surface-2); border:1px solid var(--border);
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; font-size:12px; color:var(--fg-muted);
  word-break:break-all; max-width:100%; min-width:0 }

/* ---- layout ---- */
.topbar { position:sticky; top:0; z-index:10; backdrop-filter:blur(12px);
  background:var(--topbar-bg); border-bottom:1px solid var(--border) }
.topbar-inner { max-width:1120px; margin:0 auto; padding:0 24px; height:56px;
  display:flex; flex-wrap:wrap; gap:10px; align-items:center }
.brand { display:flex; align-items:center; gap:10px; margin-right:auto; font-weight:600; font-size:15px }
.brand .mark { width:14px; height:14px; border:2.5px solid var(--fg); border-radius:50% }
.avatar-btn { display:flex; align-items:center; gap:8px; height:36px; padding:0 12px 0 4px; border-radius:999px;
  background:var(--surface-2); border:1px solid var(--border-strong); color:var(--fg); font-size:13px; font-weight:500;
  cursor:pointer; transition:border-color .15s; font-family:inherit }
.avatar-btn:hover { border-color:var(--hover-border) }
.icon-btn { width:36px; height:36px; padding:0; border-radius:999px; font-size:14px;
  display:inline-flex; align-items:center; justify-content:center }
.icon-btn svg { width:16px; height:16px; display:block }
.icon-btn .icon-moon { display:none }
:root[data-theme="light"] .icon-btn .icon-sun { display:none }
:root[data-theme="light"] .icon-btn .icon-moon { display:block }
.avatar { width:28px; height:28px; border-radius:50%; background:var(--avatar-bg); display:inline-flex; align-items:center;
  justify-content:center; font-size:12px; font-weight:600; flex:none }
.avatar-name { max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap }
.caret { color:var(--fg-subtle); font-size:10px }
.menu-wrap { position:relative }
.menu { position:absolute; right:0; top:calc(100% + 8px); z-index:50; min-width:220px; background:var(--surface-2);
  border:1px solid var(--border-strong); border-radius:10px; padding:6px; display:none;
  box-shadow:var(--shadow-menu) }
.menu.open { display:block }
.menu .section { padding:6px 10px 4px; font-size:11px; color:var(--fg-subtle); text-transform:uppercase; letter-spacing:.06em }
.menu-item { appearance: none; -webkit-appearance: none; display:flex; align-items:center; justify-content:flex-start;
  gap:8px; width:100%; padding:8px 10px;
  border:none; border-radius:6px; background:transparent; color:var(--fg); font-size:13px; cursor:pointer;
  text-align:left; font-family:inherit }
.menu-item:hover { background:var(--menu-hover) }
.menu-item:disabled { opacity:.5; cursor:default }
.menu-item .label { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap }
.menu-item .check { visibility:hidden; color:var(--fg-muted) }
.menu-item.active .check { visibility:visible }
.menu-item.danger { color:var(--red) }
.menu-item.danger:hover { background:rgba(238,0,0,.08) }
.menu-divider { height:1px; background:var(--border); margin:6px 4px }
.toolbar { display:flex; justify-content:flex-end; margin-bottom:16px }
.modal-overlay { position:fixed; inset:0; z-index:100; background:var(--overlay-bg); display:none;
  align-items:flex-start; justify-content:center; padding:12vh 16px 16px }
.modal-overlay.open { display:flex }
.modal { width:100%; max-width:520px; background:var(--surface); border:1px solid var(--border-strong);
  border-radius:12px; padding:20px; box-shadow:var(--shadow-modal) }
.modal-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px }
.modal-head h3 { font-size:15px; margin:0 }
.section-label { font-size:11px; text-transform:uppercase; letter-spacing:.06em; color:var(--fg-subtle); margin:10px 0 6px }
.modal-desc { font-size:13px; color:var(--fg-muted); margin:0 0 12px }
.invite-input { flex:1; min-width:0; font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; font-size:12px;
  color:var(--fg-muted) }
.wrap { max-width:1120px; margin:0 auto; padding:28px 24px 80px }
.muted { color:var(--fg-muted) }
.subtle { color:var(--fg-subtle) }
.row { display:flex; flex-wrap:wrap; gap:10px; align-items:center }
.spacer { flex:1 }

/* ---- panels & cards ---- */
.panel { background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:20px; margin-bottom:16px }
.panel h2 { font-size:14px; font-weight:600; margin:0 0 4px }
.panel .desc { font-size:12px; color:var(--fg-subtle); margin:0 0 16px }
.card { background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:16px 20px }
.grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:12px; margin-bottom:16px }
.stat .label { display:flex; align-items:center; gap:7px; color:var(--fg-muted); font-size:12px }
.stat .dot { width:6px; height:6px; border-radius:50% }
.stat .value { font-size:30px; font-weight:600; line-height:1.35;
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; font-variant-numeric:tabular-nums }
.stat .sub { color:var(--fg-subtle); font-size:12px }
.charts { display:grid; grid-template-columns:1fr; gap:16px; margin-bottom:16px }
@media (min-width: 880px) { .charts { grid-template-columns:1fr 1fr } }

/* ---- table ---- */
table { width:100%; border-collapse:collapse; font-size:13px; font-variant-numeric:tabular-nums }
th { text-align:left; padding:8px; border-bottom:1px solid var(--border-strong);
  color:var(--fg-subtle); font-weight:500; font-size:11px; text-transform:uppercase; letter-spacing:.06em }
td { text-align:left; padding:8px; border-bottom:1px solid var(--border) }
tr:last-child td { border-bottom:none }

/* ---- misc ---- */
pre { background:var(--surface-2); border:1px solid var(--border); border-radius:8px; padding:16px;
  max-height:420px; overflow:auto; font-size:12px; line-height:1.7; margin:12px 0 0; color:var(--fg-muted) }
.divider { height:1px; background:var(--border); margin:20px 0 }
.center { text-align:center }
.login { max-width:380px; margin:14vh auto 0; padding:32px }
.login .brand { justify-content:center; margin:0 0 4px; font-size:16px }
.login p { margin:0 0 8px }
.notice { border:1px dashed var(--border-strong); border-radius:10px; padding:36px 28px; text-align:center; margin-bottom:16px }
.notice .glyph { width:30px; height:30px; margin:0 auto; border:3px solid var(--border-strong); border-radius:50% }
.notice h2 { font-size:15px; margin:14px 0 6px }
.notice p { color:var(--fg-muted); font-size:13px; margin:0 0 16px }

/* ---- 图表容器：固定高度，避免窄屏下按比例压扁 ---- */
.chart-box { position:relative; height:230px }

/* ---- 移动端 ---- */
@media (max-width: 720px) {
  .wrap { padding:16px 12px 64px }
  .panel { padding:14px }
  .toolbar { justify-content:stretch }
  .toolbar .seg { flex:1 }
  .seg button { flex:1 }
  .chip { flex:1 1 auto }
  .grid { grid-template-columns:repeat(2,1fr); gap:10px }
  .grid .stat:last-child { grid-column:1 / -1 }
  .stat .value { font-size:24px }
  .chart-box { height:190px }
  .explorer-controls select { flex:1 1 100% }
  .explorer-controls input[type=date] { flex:1 1 40%; min-width:0 }
  .login { margin-top:9vh; padding:24px 20px }
  .notice { padding:28px 16px }
}
@media (max-width: 480px) {
  .avatar-name, .caret { display:none }
  .avatar-btn { padding:3px }
}
`

export function esc(s: string): string {
  return s.replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]!)
}

export function shell(title: string, body: string): string {
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#000000">
<script>try{var t=localStorage.getItem('oura_theme');if(!t){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','dark')}</script>
<title>${esc(title)}</title>
<style>${BASE_CSS}</style>
</head>
<body>${body}</body>
</html>`
}

const BRAND = `<span class="mark"></span>Oura Dashboard`

export function loginPage(error?: string): string {
  return shell(
    'Oura Dashboard — 登录',
    `<div class="login card">
  <div class="brand">${BRAND}</div>
  <p class="subtle center" style="margin-bottom:20px">输入管理密钥以继续</p>
  ${error ? `<p class="err" style="color:var(--red);text-align:center;font-size:13px">${esc(error)}</p>` : ''}
  <form method="post" action="/login">
    <input type="password" name="key" placeholder="ADMIN_KEY" required autofocus autocomplete="current-password">
    <button class="primary" style="width:100%;height:36px">登录</button>
  </form>
</div>`,
  )
}

export function connectedPage(email: string | undefined, id: string): string {
  return shell(
    '已连接 Oura',
    `<div class="wrap"><div class="login card" style="margin-top:10vh">
  <div class="brand">${BRAND}</div>
  <div class="divider"></div>
  <p class="center" style="font-size:15px;font-weight:600;margin-bottom:4px">✓ 连接成功</p>
  <p class="subtle center">Oura 账号 <span class="mono">${esc(email || id.slice(0, 8))}</span> 已接入服务，数据将由服务定时同步，本页面可以关闭。</p>
  <div class="center" style="margin-top:20px"><a class="btn" href="/">前往看板 →</a></div>
</div></div>`,
  )
}

export function errorPage(title: string, detail: string): string {
  return shell(
    'Oura Dashboard — 错误',
    `<div class="wrap"><div class="login card" style="margin-top:10vh">
  <div class="brand">${BRAND}</div>
  <div class="divider"></div>
  <p class="center" style="font-size:15px;font-weight:600;margin-bottom:4px">${esc(title)}</p>
  <p class="center" style="color:var(--red);font-size:13px">${esc(detail)}</p>
  <div class="center" style="margin-top:20px"><a class="btn" href="/">返回首页</a></div>
</div></div>`,
  )
}

export function dashboardPage(): string {
  return shell(
    'Oura Dashboard',
    `<div class="topbar"><div class="topbar-inner">
  <div class="brand">${BRAND}</div>
  <button class="icon-btn" id="themeBtn" title="切换深色/浅色主题" aria-label="切换主题">
    <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
    <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
  </button>
  <div class="menu-wrap" id="userMenuWrap">
    <button class="avatar-btn" id="userMenuBtn" aria-haspopup="menu">
      <span class="avatar" id="avatarInitial">–</span>
      <span class="avatar-name" id="avatarName"></span>
      <span class="caret">▾</span>
    </button>
    <div class="menu" id="userMenu">
      <div class="section">切换用户</div>
      <div id="menuUsers"></div>
      <div class="menu-divider"></div>
      <button class="menu-item" id="miSync">同步数据</button>
      <button class="menu-item" id="miSettings">设置</button>
      <button class="menu-item danger" id="miDisconnect">断开此用户</button>
      <div class="menu-divider"></div>
      <button class="menu-item" id="miLogout">登出</button>
    </div>
  </div>
</div></div>

<div class="wrap">
  <div id="empty" style="display:none" class="notice">
    <div class="glyph"></div>
    <h2>还没有用户连接</h2>
    <p>把下面的授权链接发给自己或他人，在 Oura 登录并同意授权后，账号即接入本服务。</p>
    <div class="row" style="justify-content:center"><span class="chip" id="invite"></span><button id="copy">复制</button></div>
  </div>

  <div id="app">
    <div class="toolbar">
      <div class="seg" id="rangeSeg">
        <button class="range" data-days="7">7 天</button>
        <button class="range" data-days="30">30 天</button>
        <button class="range" data-days="90">90 天</button>
      </div>
    </div>

    <div class="grid" id="stats"></div>

    <div class="charts">
      <div class="panel">
        <h2>睡眠 / 恢复度 / 活动</h2>
        <p class="desc">每日综合评分（0–100）· 滚轮缩放 · 拖动平移 · 双击复位</p>
        <div class="chart-box"><canvas id="c1"></canvas></div>
      </div>
      <div class="panel">
        <h2>静息心率 / HRV 平衡</h2>
        <p class="desc">来自恢复度贡献因子 · 滚轮缩放 · 拖动平移 · 双击复位</p>
        <div class="chart-box"><canvas id="c2"></canvas></div>
      </div>
    </div>

    <div class="panel" id="tablePanel" style="display:none">
      <h2>明细</h2>
      <p class="desc">最近 14 天</p>
      <div style="overflow:auto"><table id="tbl"></table></div>
      <p class="subtle" id="chartmsg" style="display:none;margin-top:12px">Chart.js CDN 不可用，仅显示明细表。</p>
    </div>

    <div class="panel">
      <h2>原始数据探索器</h2>
      <p class="desc">直接查询 Oura v2 任意端点 · 图表可缩放（滚轮/双指、拖动平移、双击复位）· 可切原始数据</p>
      <div class="row explorer-controls">
        <select id="ep"></select>
        <input type="date" id="d1">
        <input type="date" id="d2">
        <button id="explore" class="primary">查询</button>
      </div>
      <div class="row" id="expResultBar" style="display:none; margin-top:14px">
        <div class="seg" id="expViewSeg">
          <button id="expViewChart">图表</button>
          <button id="expViewRaw">原始数据</button>
        </div>
        <select id="expField" style="display:none"></select>
        <span class="subtle" id="expStats" style="font-size:12px"></span>
      </div>
      <div class="chart-box" id="expChartBox" style="display:none; margin-top:12px; height:260px">
        <canvas id="expChart"></canvas>
      </div>
      <pre id="out">选择端点后点击查询</pre>
    </div>
  </div>
</div>

<div class="modal-overlay" id="settingsModal">
  <div class="modal">
    <div class="modal-head">
      <h3>设置</h3>
      <button id="settingsClose">✕</button>
    </div>
    <div class="section-label">邀请用户授权</div>
    <p class="modal-desc">把下面的授权链接发给其他 Oura 用户，对方登录并同意授权后即接入本服务（未获 Oura 正式批准的应用最多 10 人）。</p>
    <div class="row">
      <input class="invite-input" id="inviteInput" readonly>
      <button id="copyInvite">复制</button>
    </div>
    <div class="section-label" style="margin-top:18px">MCP 接入</div>
    <p class="modal-desc">把本服务作为 MCP 工具接入 Claude 等 AI Agent，让 Agent 直接查询你的 Oura 数据。</p>
    <div class="row"><a class="btn" href="/mcp-docs">查看 MCP 文档 →</a></div>
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom@2.2.0/dist/chartjs-plugin-zoom.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-crosshair@2.0.0/dist/chartjs-plugin-crosshair.min.js"></script>
<script>
var $ = function (s) { return document.querySelector(s) }
var USERS = [], UID = '', DAYS = 30, C1 = null, C2 = null
var PALETTE = { sleep: '#0070f3', readiness: '#50e3c2', activity: '#f5a623', rhr: '#ee0000', hrv: '#7928ca' }

function api(url, opts) {
  return fetch(url, opts).then(function (r) {
    if (r.status === 401) { location.href = '/login'; throw new Error('unauthorized') }
    return r.json().then(function (j) {
      if (!r.ok) throw new Error(j && j.error ? j.error : 'HTTP ' + r.status)
      return j
    })
  })
}

function renderStats(rows) {
  var defs = [
    { key: 'sleep', label: '睡眠评分', color: PALETTE.sleep },
    { key: 'readiness', label: '恢复度', color: PALETTE.readiness },
    { key: 'activity', label: '活动', color: PALETTE.activity },
    { key: 'rhr', label: '静息心率', color: PALETTE.rhr },
    { key: 'hrv', label: 'HRV 平衡', color: PALETTE.hrv },
  ]
  var html = ''
  defs.forEach(function (d) {
    var last = null
    for (var i = rows.length - 1; i >= 0; i--) { if (rows[i][d.key] != null) { last = rows[i]; break } }
    html += '<div class="stat card"><div class="label"><span class="dot" style="background:' + d.color + '"></span>' + d.label + '</div><div class="value">' + (last ? last[d.key] : '—') + '</div><div class="sub">' + (last ? last.date : '暂无数据') + '</div></div>'
  })
  $('#stats').innerHTML = html
}

function renderTable(rows) {
  var t = rows.slice(-14)
  if (!t.length) return
  var keys = ['date', 'sleep', 'readiness', 'activity', 'rhr', 'hrv']
  var heads = { date: '日期', sleep: '睡眠', readiness: '恢复度', activity: '活动', rhr: '静息心率', hrv: 'HRV' }
  var html = '<tr>' + keys.map(function (k) { return '<th>' + heads[k] + '</th>' }).join('') + '</tr>'
  html += t.slice().reverse().map(function (r) {
    return '<tr>' + keys.map(function (k) { return '<td>' + (r[k] == null ? '—' : r[k]) + '</td>' }).join('') + '</tr>'
  }).join('')
  $('#tbl').innerHTML = html
  if (typeof Chart === 'undefined') $('#tablePanel').style.display = 'block'
}

function hexToRgba(hex, a) {
  var h = hex.replace('#', '')
  var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16)
  return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'
}

function areaFill(hex) {
  return function (context) {
    var area = context.chart.chartArea
    if (!area) return 'transparent'
    var g = context.chart.ctx.createLinearGradient(0, area.top, 0, area.bottom)
    g.addColorStop(0, hexToRgba(hex, 0.25))
    g.addColorStop(1, hexToRgba(hex, 0.02))
    return g
  }
}

function renderCharts(rows) {
  if (typeof Chart === 'undefined') { $('#chartmsg').style.display = 'block'; $('#tablePanel').style.display = 'block'; return }
  var labels = rows.map(function (r) { return r.date.slice(5) })
  var fullLabels = rows.map(function (r) { return r.date })
  var mk = function (key) { return rows.map(function (r) { return r[key] == null ? null : r[key] }) }
  var cs = getComputedStyle(document.documentElement)
  var gridColor = (cs.getPropertyValue('--chart-grid') || '#1c1c1c').trim()
  var tickColor = (cs.getPropertyValue('--chart-tick') || '#666').trim()
  var tipBg = (cs.getPropertyValue('--tip-bg') || '#111').trim()
  var tipBorder = (cs.getPropertyValue('--tip-border') || '#333').trim()
  var tipFg = (cs.getPropertyValue('--fg') || '#ededed').trim()
  var legendOpt = { legend: { labels: { color: (cs.getPropertyValue('--legend-text') || '#a1a1a1').trim(), boxWidth: 12, boxHeight: 2, font: { size: 11 } } } }
  var tip = { backgroundColor: tipBg, titleColor: tipFg, bodyColor: tipFg, borderColor: tipBorder, borderWidth: 1,
    padding: 10, cornerRadius: 8, displayColors: true, boxWidth: 8, boxHeight: 8, titleFont: { weight: '600' },
    callbacks: { title: function (items) { return fullLabels[items[0].dataIndex] || items[0].label } } }
  var interact = { mode: 'index', intersect: false }
  var zoomOpt = { pan: { enabled: true, mode: 'x' },
    zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' },
    limits: { x: { min: 'original', max: 'original' } } }
  var crossOpt = { line: { color: tickColor, width: 1, dashPattern: [3, 3] }, snap: { enabled: true },
    sync: { enabled: false }, zoom: { enabled: false } }
  var scales = function (yOpts) {
    return { x: { grid: { color: gridColor }, ticks: { color: tickColor, maxTicksLimit: 12, maxRotation: 0 } },
             y: Object.assign({ grid: { color: gridColor }, ticks: { color: tickColor } }, yOpts || {}) }
  }
  var ds = function (label, key, color) {
    return { label: label, data: mk(key), borderColor: color, backgroundColor: areaFill(color), fill: true,
      tension: 0.35, pointRadius: 0, pointHoverRadius: 4, spanGaps: true, borderWidth: 1.5 }
  }
  if (C1) C1.destroy()
  if (C2) C2.destroy()
  C1 = new Chart($('#c1'), {
    type: 'line',
    data: { labels: labels, datasets: [
      ds('睡眠', 'sleep', PALETTE.sleep),
      ds('恢复度', 'readiness', PALETTE.readiness),
      ds('活动', 'activity', PALETTE.activity),
    ] },
    options: { responsive: true, maintainAspectRatio: false, interaction: interact,
      scales: scales({ min: 0, max: 100 }),
      plugins: { legend: legendOpt.legend, tooltip: tip, zoom: zoomOpt, crosshair: crossOpt } },
  })
  C2 = new Chart($('#c2'), {
    type: 'line',
    data: { labels: labels, datasets: [
      ds('静息心率', 'rhr', PALETTE.rhr),
      ds('HRV 平衡', 'hrv', PALETTE.hrv),
    ] },
    options: { responsive: true, maintainAspectRatio: false, interaction: interact,
      scales: scales(),
      plugins: { legend: legendOpt.legend, tooltip: tip, zoom: zoomOpt, crosshair: crossOpt } },
  })
  $('#c1').ondblclick = function () { if (C1) C1.resetZoom() }
  $('#c2').ondblclick = function () { if (C2) C2.resetZoom() }
}

function loadAll() {
  api('/api/data/' + UID + '/summary?days=' + DAYS).then(function (d) {
    var rows = d.days || []
    renderStats(rows)
    renderCharts(rows)
    renderTable(rows)
  }).catch(function (e) {
    $('#stats').innerHTML = '<div class="card" style="color:var(--red)">加载失败: ' + e.message + '</div>'
  })
}

function init() {
  try { if (window.ChartZoom) Chart.register(window.ChartZoom) } catch (e) {}
  var menu = $('#userMenu')
  function closeMenu() { menu.classList.remove('open') }
  $('#userMenuBtn').onclick = function (e) { e.stopPropagation(); menu.classList.toggle('open') }
  document.addEventListener('click', function (e) { if (!menu.contains(e.target)) closeMenu() })
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeMenu(); closeSettings() } })

  var settingsModal = $('#settingsModal')
  function closeSettings() { settingsModal.classList.remove('open') }
  $('#miSettings').onclick = function () { closeMenu(); settingsModal.classList.add('open') }
  $('#settingsClose').onclick = closeSettings
  settingsModal.addEventListener('click', function (e) { if (e.target === settingsModal) closeSettings() })

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t)
    try { localStorage.setItem('oura_theme', t) } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.content = t === 'light' ? '#ffffff' : '#000000'
  }
  applyTheme(document.documentElement.getAttribute('data-theme') || 'dark')
  $('#themeBtn').onclick = function () {
    var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
    applyTheme(next)
    if (C1 || C2) loadAll()
  }

  function setCurrent(uid) {
    UID = uid
    var u = null
    for (var i = 0; i < USERS.length; i++) { if (USERS[i].id === uid) { u = USERS[i]; break } }
    var name = u ? (u.email || u.id.slice(0, 8)) : '—'
    $('#avatarName').textContent = name
    $('#avatarInitial').textContent = name.slice(0, 1).toUpperCase()
    Array.prototype.forEach.call(document.querySelectorAll('.menu-user'), function (b) {
      b.classList.toggle('active', b.getAttribute('data-id') === uid)
    })
  }

  function buildMenu() {
    var box = $('#menuUsers')
    box.innerHTML = ''
    USERS.forEach(function (u) {
      var b = document.createElement('button')
      b.className = 'menu-item menu-user'
      b.setAttribute('data-id', u.id)
      var label = document.createElement('span')
      label.className = 'label'
      label.textContent = u.email || u.id.slice(0, 8)
      var check = document.createElement('span')
      check.className = 'check'
      check.textContent = '✓'
      b.appendChild(label)
      b.appendChild(check)
      b.onclick = function () { setCurrent(u.id); loadAll(); closeMenu() }
      box.appendChild(b)
    })
  }

  api('/api/users').then(function (d) {
    USERS = d.users || []
    if (!USERS.length) { $('#userMenuWrap').style.display = 'none'; $('#empty').style.display = 'block'; $('#app').style.display = 'none'; return }
    UID = USERS[0].id
    buildMenu()
    setCurrent(UID)
    loadAll()
  })

  var inv = location.origin + '/auth/oura'
  $('#invite').textContent = inv
  $('#inviteInput').value = inv
  $('#copy').onclick = $('#copyInvite').onclick = function () {
    var t = this
    navigator.clipboard.writeText(inv).then(function () {
      var old = t.textContent
      t.textContent = '已复制 ✓'
      setTimeout(function () { t.textContent = old }, 1200)
    })
  }

  Array.prototype.forEach.call(document.querySelectorAll('.range'), function (b) {
    if (b.getAttribute('data-days') === String(DAYS)) b.classList.add('active')
    b.onclick = function () {
      DAYS = Number(b.getAttribute('data-days'))
      Array.prototype.forEach.call(document.querySelectorAll('.range'), function (x) { x.classList.remove('active') })
      b.classList.add('active')
      loadAll()
    }
  })

  var miSync = $('#miSync')
  miSync.onclick = function () {
    if (miSync.disabled) return
    miSync.disabled = true
    var old = miSync.textContent
    miSync.textContent = '同步中…'
    api('/api/sync/' + UID, { method: 'POST' }).then(function () {
      miSync.textContent = old
      miSync.disabled = false
      loadAll()
    }).catch(function (e) {
      miSync.textContent = old
      miSync.disabled = false
      alert('同步失败: ' + e.message)
    })
  }

  $('#miDisconnect').onclick = function () {
    if (!confirm('确定断开当前用户并删除其数据缓存？')) return
    api('/api/connections/' + UID + '/disconnect', { method: 'POST' }).then(function () { location.reload() })
  }

  $('#miLogout').onclick = function () {
    fetch('/logout', { method: 'POST' }).then(function () { location.href = '/login' })
  }

  var eps = [
    ['daily_sleep', '每日睡眠 (daily_sleep)'],
    ['daily_readiness', '每日恢复度 (daily_readiness)'],
    ['daily_activity', '每日活动 (daily_activity)'],
    ['daily_stress', '每日压力 (daily_stress)'],
    ['daily_resilience', '每日韧性 (daily_resilience)'],
    ['daily_spo2', '每日血氧 (daily_spo2)'],
    ['daily_cardiovascular_age', '每日心血管年龄 (daily_cardiovascular_age)'],
    ['vo2_max', '最大摄氧量 (vo2_max)'],
    ['sleep', '睡眠分期 (sleep)'],
    ['sleep_time', '睡眠时段 (sleep_time)'],
    ['heartrate', '心率 (heartrate)'],
    ['session', '会话记录 (session)'],
    ['workout', '锻炼 (workout)'],
    ['tag', '标签 (tag)'],
    ['enhanced_tag', '增强标签 (enhanced_tag)'],
    ['rest_mode_period', '休息模式 (rest_mode_period)'],
    ['ring_configuration', '戒指配置 (ring_configuration)'],
    ['personal_info', '个人信息 (personal_info)'],
  ]
  var epSel = $('#ep')
  eps.forEach(function (p) {
    var o = document.createElement('option')
    o.value = p[0]
    o.textContent = p[1]
    epSel.appendChild(o)
  })
  var d1 = new Date(Date.now() - 6 * 864e5)
  var d2 = new Date()
  $('#d1').value = d1.toISOString().slice(0, 10)
  $('#d2').value = d2.toISOString().slice(0, 10)
  var expChart = null
  var EXP = null

  function parseExplorerData(d) {
    var records = d && d.data ? d.data : (Array.isArray(d) ? d : null)
    if (!records || !records.length) return { records: [], xKey: null, numKeys: [] }
    var xCandidates = ['day', 'timestamp', 'start_timestamp', 'sleep_start', 'config_start_time', 'created_at']
    var xKey = null
    for (var i = 0; i < xCandidates.length; i++) { if (records[0][xCandidates[i]] != null) { xKey = xCandidates[i]; break } }
    var numKeys = []
    records.forEach(function (r) {
      Object.keys(r).forEach(function (k) {
        if (k === 'id' || k === xKey) return
        var v = r[k]
        if (typeof v === 'number') { if (numKeys.indexOf(k) < 0) numKeys.push(k) }
        else if (v && typeof v === 'object' && !Array.isArray(v)) {
          Object.keys(v).forEach(function (k2) {
            var full = k + '.' + k2
            if (typeof v[k2] === 'number' && numKeys.indexOf(full) < 0) numKeys.push(full)
          })
        }
      })
    })
    return { records: records, xKey: xKey, numKeys: numKeys }
  }

  function getVal(r, path) {
    var parts = path.split('.')
    var v = r
    for (var i = 0; i < parts.length; i++) { v = v == null ? undefined : v[parts[i]] }
    return typeof v === 'number' ? v : null
  }

  function buildExpField() {
    var sel = $('#expField')
    sel.innerHTML = ''
    var pref = ['score', 'bpm', 'value']
    var def = EXP.numKeys[0]
    for (var i = 0; i < pref.length; i++) { if (EXP.numKeys.indexOf(pref[i]) >= 0) { def = pref[i]; break } }
    EXP.numKeys.forEach(function (k) {
      var o = document.createElement('option')
      o.value = k
      o.textContent = k
      if (k === def) o.selected = true
      sel.appendChild(o)
    })
  }

  function renderExpChart() {
    if (!EXP || !EXP.xKey || !EXP.numKeys.length) return
    var recs = EXP.records
    var capped = false
    if (recs.length > 2000) { recs = recs.slice(-2000); capped = true }
    var field = $('#expField').value
    var labels = recs.map(function (r) {
      var v = r[EXP.xKey]
      if (typeof v !== 'string') return ''
      return v.length > 10 ? v.replace('T', ' ').slice(5, 16) : v
    })
    var fullLabels = recs.map(function (r) { return String(r[EXP.xKey]) })
    var vals = recs.map(function (r) { return getVal(r, field) })
    var n = 0, sum = 0, min = Infinity, max = -Infinity
    vals.forEach(function (v) { if (v != null) { n++; sum += v; if (v < min) min = v; if (v > max) max = v } })
    $('#expStats').textContent = n
      ? field + '：' + n + ' 点' + (capped ? '（仅绘最近 2000 点）' : '') + ' · 均值 ' + (sum / n).toFixed(1) + ' · 范围 ' + min + '–' + max
      : field + '：无数值点'
    if (expChart) expChart.destroy()
    var cs = getComputedStyle(document.documentElement)
    var gridColor = (cs.getPropertyValue('--chart-grid') || '#1c1c1c').trim()
    var tickColor = (cs.getPropertyValue('--chart-tick') || '#666').trim()
    expChart = new Chart($('#expChart'), {
      type: 'line',
      data: { labels: labels, datasets: [{ label: field, data: vals, borderColor: '#0070f3', backgroundColor: areaFill('#0070f3'), borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 4, tension: 0.3, spanGaps: true, fill: true }] },
      options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
        scales: { x: { grid: { color: gridColor }, ticks: { color: tickColor, maxTicksLimit: 12, maxRotation: 0 } },
                  y: { grid: { color: gridColor }, ticks: { color: tickColor } } },
        plugins: { legend: { display: false },
          tooltip: { backgroundColor: (cs.getPropertyValue('--tip-bg') || '#111').trim(), titleColor: (cs.getPropertyValue('--fg') || '#ededed').trim(), bodyColor: (cs.getPropertyValue('--fg') || '#ededed').trim(), borderColor: (cs.getPropertyValue('--tip-border') || '#333').trim(), borderWidth: 1, padding: 10, cornerRadius: 8, displayColors: false, titleFont: { weight: '600' }, callbacks: { title: function (items) { return fullLabels[items[0].dataIndex] || items[0].label } } },
          zoom: { pan: { enabled: true, mode: 'x' }, zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' }, limits: { x: { min: 'original', max: 'original' } } },
          crosshair: { line: { color: tickColor, width: 1, dashPattern: [3, 3] }, snap: { enabled: true }, sync: { enabled: false }, zoom: { enabled: false } } } },
    })
    $('#expChart').ondblclick = function () { if (expChart) expChart.resetZoom() }
  }

  function setExpView(v) {
    var chartable = EXP && EXP.records.length && EXP.xKey && EXP.numKeys.length
    var isC = v === 'chart' && chartable
    $('#expViewChart').classList.toggle('active', isC)
    $('#expViewRaw').classList.toggle('active', !isC)
    $('#expChartBox').style.display = isC ? 'block' : 'none'
    $('#expField').style.display = isC ? '' : 'none'
    $('#out').style.display = isC ? 'none' : 'block'
    if (isC) renderExpChart()
  }
  $('#expViewChart').onclick = function () { setExpView('chart') }
  $('#expViewRaw').onclick = function () { setExpView('raw') }
  $('#expField').onchange = function () { renderExpChart() }

  $('#explore').onclick = function () {
    var ep = epSel.value
    var q = []
    if ($('#d1').value) q.push('start_date=' + $('#d1').value)
    if ($('#d2').value) q.push('end_date=' + $('#d2').value)
    $('#out').textContent = '加载中…'
    $('#expResultBar').style.display = ''
    api('/api/data/' + UID + '/' + ep + (q.length ? '?' + q.join('&') : ''))
      .then(function (d) {
        $('#out').textContent = JSON.stringify(d, null, 2)
        EXP = parseExplorerData(d)
        buildExpField()
        setExpView(EXP.records.length && EXP.xKey && EXP.numKeys.length ? 'chart' : 'raw')
      })
      .catch(function (e) {
        EXP = null
        $('#out').textContent = '错误: ' + e.message
        setExpView('raw')
      })
  }
}
init()
</script>`,
  )
}
