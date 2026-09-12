const BASE_CSS = `
:root {
  --bg: #000; --surface: #0a0a0a; --surface-2: #111;
  --fg: #ededed; --fg-muted: #a1a1a1; --fg-subtle: #666;
  --border: #262626; --border-strong: #333;
  --accent: #0070f3; --red: #ee0000; --green: #50e3c2; --amber: #f5a623; --purple: #7928ca;
}
* { box-sizing: border-box }
html { color-scheme: dark }
body { margin:0; background:var(--bg); color:var(--fg);
  font:14px/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Helvetica,"PingFang SC","Microsoft YaHei",sans-serif;
  letter-spacing:-0.01em; -webkit-font-smoothing:antialiased }
code, pre, .mono { font-family:ui-monospace,"Geist Mono",SFMono-Regular,Menlo,Consolas,monospace; letter-spacing:0 }
a { color:var(--fg); text-decoration:none }
a:hover { color:var(--fg-muted) }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; border-radius:4px }
::selection { background:#0070f3; color:#fff }
::-webkit-scrollbar { width:10px; height:10px }
::-webkit-scrollbar-thumb { background:#333; border-radius:5px; border:2px solid var(--bg) }
::-webkit-scrollbar-track { background:transparent }

/* ---- buttons & controls ---- */
button, .btn { display:inline-flex; align-items:center; justify-content:center; gap:6px;
  height:32px; padding:0 14px; border-radius:6px; font-size:13px; font-weight:500;
  background:var(--surface-2); border:1px solid var(--border-strong); color:var(--fg);
  cursor:pointer; transition:border-color .15s, background .15s, color .15s; text-decoration:none }
button:hover, .btn:hover { background:#1a1a1a; border-color:#444 }
button.primary { background:var(--fg); color:#000; border-color:var(--fg) }
button.primary:hover { background:#fff; border-color:#fff }
button.danger { color:var(--red) }
button.danger:hover { border-color:var(--red); background:rgba(238,0,0,.08) }
button:disabled { opacity:.45; cursor:not-allowed }
select, input { height:32px; padding:0 10px; border-radius:6px; font-size:13px;
  background:var(--surface); border:1px solid var(--border-strong); color:var(--fg);
  font-family:inherit; transition:border-color .15s }
select:hover, input:hover { border-color:#444 }
input[type=password] { height:40px; width:100%; margin:16px 0 12px; padding:0 12px; font-size:14px }
.seg { display:inline-flex; border:1px solid var(--border-strong); border-radius:6px; overflow:hidden }
.seg button { height:30px; border:none; border-radius:0; background:transparent; padding:0 12px }
.seg button + button { border-left:1px solid var(--border) }
.seg button:hover { background:var(--surface-2) }
.seg button.active { background:var(--border-strong); color:#fff }
.chip { display:inline-flex; align-items:center; gap:8px; padding:6px 10px; border-radius:6px;
  background:var(--surface-2); border:1px solid var(--border);
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; font-size:12px; color:var(--fg-muted);
  word-break:break-all; max-width:100% }

/* ---- layout ---- */
.topbar { position:sticky; top:0; z-index:10; backdrop-filter:blur(12px);
  background:rgba(0,0,0,.75); border-bottom:1px solid var(--border) }
.topbar-inner { max-width:1120px; margin:0 auto; padding:0 24px; height:56px;
  display:flex; flex-wrap:wrap; gap:10px; align-items:center }
.brand { display:flex; align-items:center; gap:10px; margin-right:auto; font-weight:600; font-size:15px }
.brand .mark { width:14px; height:14px; border:2.5px solid var(--fg); border-radius:50% }
.brand .env { font-size:11px; color:var(--fg-subtle); border:1px solid var(--border); border-radius:999px; padding:1px 8px; font-weight:400 }
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
`

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]!)
}

function shell(title: string, body: string): string {
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
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
  <div class="brand">${BRAND}<span class="env">oura-service</span></div>
  <select id="user"></select>
  <button id="sync">同步</button>
  <button id="del" class="danger">断开</button>
  <form action="/logout" method="post" style="display:inline"><button>登出</button></form>
</div></div>

<div class="wrap">
  <div id="empty" style="display:none" class="notice">
    <div class="glyph"></div>
    <h2>还没有用户连接</h2>
    <p>把下面的授权链接发给自己或他人，在 Oura 登录并同意授权后，账号即接入本服务。</p>
    <div class="row" style="justify-content:center"><span class="chip" id="invite"></span><button id="copy">复制</button></div>
  </div>

  <div id="app">
    <div class="panel row" style="padding:14px 20px">
      <span class="subtle" style="font-size:12px">邀请用户授权</span>
      <span class="chip" id="invite2"></span>
      <button id="copy2">复制</button>
      <span class="spacer"></span>
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
        <p class="desc">每日综合评分（0–100）</p>
        <canvas id="c1" height="120"></canvas>
      </div>
      <div class="panel">
        <h2>静息心率 / HRV 平衡</h2>
        <p class="desc">来自恢复度贡献因子</p>
        <canvas id="c2" height="120"></canvas>
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
      <p class="desc">直接查询 Oura v2 任意端点</p>
      <div class="row">
        <select id="ep"></select>
        <input type="date" id="d1">
        <input type="date" id="d2">
        <button id="explore" class="primary">查询</button>
      </div>
      <pre id="out">选择端点后点击查询</pre>
    </div>
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
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

function renderCharts(rows) {
  if (typeof Chart === 'undefined') { $('#chartmsg').style.display = 'block'; $('#tablePanel').style.display = 'block'; return }
  var labels = rows.map(function (r) { return r.date.slice(5) })
  var mk = function (key) { return rows.map(function (r) { return r[key] == null ? null : r[key] }) }
  var base = { fill: false, tension: 0.35, pointRadius: 0, pointHoverRadius: 4, spanGaps: true, borderWidth: 1.5 }
  var gridColor = '#1c1c1c', tickColor = '#666'
  var legendOpt = { legend: { labels: { color: '#a1a1a1', boxWidth: 12, boxHeight: 2, font: { size: 11 } } } }
  if (C1) C1.destroy()
  if (C2) C2.destroy()
  C1 = new Chart($('#c1'), {
    type: 'line',
    data: { labels: labels, datasets: [
      Object.assign({ label: '睡眠', data: mk('sleep'), borderColor: PALETTE.sleep }, base),
      Object.assign({ label: '恢复度', data: mk('readiness'), borderColor: PALETTE.readiness }, base),
      Object.assign({ label: '活动', data: mk('activity'), borderColor: PALETTE.activity }, base),
    ] },
    options: { responsive: true, interaction: { mode: 'index', intersect: false },
      scales: { x: { grid: { color: gridColor }, ticks: { color: tickColor } },
                y: { min: 0, max: 100, grid: { color: gridColor }, ticks: { color: tickColor } } },
      plugins: legendOpt },
  })
  C2 = new Chart($('#c2'), {
    type: 'line',
    data: { labels: labels, datasets: [
      Object.assign({ label: '静息心率', data: mk('rhr'), borderColor: PALETTE.rhr }, base),
      Object.assign({ label: 'HRV 平衡', data: mk('hrv'), borderColor: PALETTE.hrv }, base),
    ] },
    options: { responsive: true, interaction: { mode: 'index', intersect: false },
      scales: { x: { grid: { color: gridColor }, ticks: { color: tickColor } },
                y: { grid: { color: gridColor }, ticks: { color: tickColor } } },
      plugins: legendOpt },
  })
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
  api('/api/users').then(function (d) {
    USERS = d.users || []
    if (!USERS.length) { $('#empty').style.display = 'block'; $('#app').style.display = 'none'; return }
    var sel = $('#user')
    USERS.forEach(function (u) {
      var o = document.createElement('option')
      o.value = u.id
      o.textContent = (u.email || u.id.slice(0, 8)) + (u.lastSyncAt ? '' : '（未同步）')
      sel.appendChild(o)
    })
    UID = USERS[0].id
    sel.value = UID
    sel.onchange = function () { UID = sel.value; loadAll() }
    loadAll()
  })

  var inv = location.origin + '/auth/oura'
  $('#invite').textContent = inv
  $('#invite2').textContent = inv
  $('#copy').onclick = $('#copy2').onclick = function () {
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

  $('#sync').onclick = function () {
    var b = this
    b.disabled = true
    b.textContent = '同步中…'
    api('/api/sync/' + UID, { method: 'POST' }).then(function () {
      b.textContent = '同步'
      b.disabled = false
      loadAll()
    }).catch(function (e) {
      b.textContent = '同步'
      b.disabled = false
      alert('同步失败: ' + e.message)
    })
  }

  $('#del').onclick = function () {
    if (!confirm('确定断开当前用户并删除其数据缓存？')) return
    api('/api/connections/' + UID + '/disconnect', { method: 'POST' }).then(function () { location.reload() })
  }

  var eps = ['daily_sleep', 'daily_readiness', 'daily_activity', 'daily_stress', 'daily_resilience', 'daily_spo2', 'daily_cardiovascular_age', 'vo2_max', 'sleep', 'sleep_time', 'heartrate', 'session', 'workout', 'tag', 'enhanced_tag', 'rest_mode_period', 'ring_configuration', 'personal_info']
  var epSel = $('#ep')
  eps.forEach(function (e) {
    var o = document.createElement('option')
    o.value = e
    o.textContent = e
    epSel.appendChild(o)
  })
  var d1 = new Date(Date.now() - 6 * 864e5)
  var d2 = new Date()
  $('#d1').value = d1.toISOString().slice(0, 10)
  $('#d2').value = d2.toISOString().slice(0, 10)
  $('#explore').onclick = function () {
    var ep = epSel.value
    var q = []
    if ($('#d1').value) q.push('start_date=' + $('#d1').value)
    if ($('#d2').value) q.push('end_date=' + $('#d2').value)
    $('#out').textContent = '加载中…'
    api('/api/data/' + UID + '/' + ep + (q.length ? '?' + q.join('&') : ''))
      .then(function (d) { $('#out').textContent = JSON.stringify(d, null, 2) })
      .catch(function (e) { $('#out').textContent = '错误: ' + e.message })
  }
}
init()
</script>`,
  )
}
