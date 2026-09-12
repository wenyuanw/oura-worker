const BASE_CSS = `
:root { --bg:#0d1117; --panel:#161b22; --border:#21262d; --text:#e6edf3; --muted:#8b949e; --accent:#58a6ff; --good:#3fb950; --warn:#d29922; --bad:#f85149; --purple:#bc8cff }
* { box-sizing: border-box }
body { margin:0; background:var(--bg); color:var(--text); font:14px/1.6 -apple-system,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",sans-serif }
a { color: var(--accent); text-decoration: none }
code { background:#0d1117; border:1px solid var(--border); border-radius:6px; padding:2px 8px; font-size:12px; word-break:break-all }
.wrap { max-width:1080px; margin:0 auto; padding:24px 16px 64px }
.muted { color: var(--muted) }
.err { color: var(--bad) }
.card { background:var(--panel); border:1px solid var(--border); border-radius:10px; padding:16px 20px }
.panel { background:var(--panel); border:1px solid var(--border); border-radius:10px; padding:16px 20px; margin-bottom:16px }
.panel h2 { font-size:14px; margin:0 0 12px }
.login { max-width:380px; margin:12vh auto }
.login input { width:100%; margin:12px 0; padding:10px 12px; background:#0d1117; border:1px solid var(--border); border-radius:8px; color:var(--text); font-size:14px }
button, .btn { background:#21262d; border:1px solid #30363d; color:var(--text); border-radius:8px; padding:7px 14px; font-size:13px; cursor:pointer; display:inline-block }
button:hover, .btn:hover { border-color:var(--accent) }
button.primary { background:#1f6feb; border-color:#1f6feb; color:#fff }
button.danger { color:var(--bad) }
button:disabled { opacity:.5; cursor:default }
.topbar { display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin-bottom:20px }
.topbar h1 { font-size:18px; margin:0 auto 0 0 }
.grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:12px; margin-bottom:16px }
.stat .label { color:var(--muted); font-size:12px }
.stat .value { font-size:30px; font-weight:600; line-height:1.25 }
.stat .sub { color:var(--muted); font-size:12px }
.charts { display:grid; grid-template-columns:1fr; gap:16px }
@media (min-width: 860px) { .charts { grid-template-columns:1fr 1fr } }
select, input[type=date] { background:#0d1117; color:var(--text); border:1px solid var(--border); border-radius:8px; padding:6px 10px; font-size:13px }
table { width:100%; border-collapse:collapse; font-size:13px }
th, td { text-align:left; padding:6px 8px; border-bottom:1px solid var(--border) }
th { color:var(--muted); font-weight:500 }
pre { background:#0d1117; border:1px solid var(--border); border-radius:8px; padding:12px; max-height:420px; overflow:auto; font-size:12px; margin:12px 0 0 }
.row { display:flex; flex-wrap:wrap; gap:10px; align-items:center }
.spacer { flex:1 }
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
<title>${esc(title)}</title>
<style>${BASE_CSS}</style>
</head>
<body>${body}</body>
</html>`
}

export function loginPage(error?: string): string {
  return shell(
    'Oura 看板 - 登录',
    `<div class="login card">
  <h2>Oura 数据看板</h2>
  <p class="muted">请输入管理密钥（ADMIN_KEY）</p>
  ${error ? `<p class="err">${esc(error)}</p>` : ''}
  <form method="post" action="/login">
    <input type="password" name="key" placeholder="管理密钥" required autofocus>
    <button class="primary" style="width:100%">登录</button>
  </form>
</div>`,
  )
}

export function connectedPage(email: string | undefined, id: string): string {
  return shell(
    '已连接 Oura',
    `<div class="login card">
  <h2>✓ 连接成功</h2>
  <p>Oura 账号 <b>${esc(email || id.slice(0, 8))}</b> 已接入服务。</p>
  <p class="muted">数据将由服务定时同步，本页面可以关闭。</p>
  <p><a class="btn" href="/">前往看板 →</a></p>
</div>`,
  )
}

export function errorPage(title: string, detail: string): string {
  return shell(
    'Oura 服务 - 错误',
    `<div class="login card">
  <h2>${esc(title)}</h2>
  <p class="err">${esc(detail)}</p>
  <p><a class="btn" href="/">返回首页</a></p>
</div>`,
  )
}

export function dashboardPage(): string {
  return shell(
    'Oura 数据看板',
    `<div class="wrap">
  <div class="topbar">
    <h1>Oura 数据看板</h1>
    <select id="user"></select>
    <button id="sync">同步</button>
    <button id="del" class="danger">断开</button>
    <form action="/logout" method="post" style="display:inline"><button>登出</button></form>
  </div>

  <div id="empty" style="display:none" class="panel">
    <h2>还没有用户连接</h2>
    <p>把下面的授权链接发给自己或他人，在 Oura 登录并同意授权后，账号即接入本服务：</p>
    <p class="row"><code id="invite"></code> <button id="copy">复制</button></p>
  </div>

  <div id="app">
    <div class="panel row">
      <span class="muted">邀请用户授权：</span><code id="invite2"></code><button id="copy2">复制</button>
      <span class="spacer"></span>
      <span class="muted">范围</span>
      <button class="range" data-days="7">7 天</button>
      <button class="range" data-days="30">30 天</button>
      <button class="range" data-days="90">90 天</button>
    </div>

    <div class="grid" id="stats"></div>

    <div class="charts">
      <div class="panel">
        <h2>睡眠 / 恢复度 / 活动 评分</h2>
        <canvas id="c1" height="120"></canvas>
      </div>
      <div class="panel">
        <h2>静息心率 / HRV 平衡</h2>
        <canvas id="c2" height="120"></canvas>
      </div>
    </div>

    <div class="panel" id="tablePanel" style="display:none">
      <h2>明细（最近 14 天）</h2>
      <div style="overflow:auto"><table id="tbl"></table></div>
      <p class="muted" id="chartmsg" style="display:none">Chart.js CDN 不可用，仅显示明细表。</p>
    </div>

    <div class="panel">
      <h2>原始数据探索器</h2>
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
    { key: 'sleep', label: '睡眠评分', color: 'var(--accent)' },
    { key: 'readiness', label: '恢复度', color: 'var(--good)' },
    { key: 'activity', label: '活动', color: 'var(--warn)' },
    { key: 'rhr', label: '静息心率', color: 'var(--bad)' },
    { key: 'hrv', label: 'HRV 平衡', color: 'var(--purple)' },
  ]
  var html = ''
  defs.forEach(function (d) {
    var last = null
    for (var i = rows.length - 1; i >= 0; i--) { if (rows[i][d.key] != null) { last = rows[i]; break } }
    html += '<div class="stat card"><div class="label">' + d.label + '</div><div class="value" style="color:' + d.color + '">' + (last ? last[d.key] : '—') + '</div><div class="sub">' + (last ? last.date : '暂无数据') + '</div></div>'
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
  var base = { fill: false, tension: 0.3, pointRadius: 2, spanGaps: true }
  if (C1) C1.destroy()
  if (C2) C2.destroy()
  C1 = new Chart($('#c1'), {
    type: 'line',
    data: { labels: labels, datasets: [
      Object.assign({ label: '睡眠', data: mk('sleep'), borderColor: '#58a6ff' }, base),
      Object.assign({ label: '恢复度', data: mk('readiness'), borderColor: '#3fb950' }, base),
      Object.assign({ label: '活动', data: mk('activity'), borderColor: '#d29922' }, base),
    ] },
    options: { responsive: true, scales: { y: { min: 0, max: 100 } }, plugins: { legend: { labels: { color: '#8b949e' } } } },
  })
  C2 = new Chart($('#c2'), {
    type: 'line',
    data: { labels: labels, datasets: [
      Object.assign({ label: '静息心率', data: mk('rhr'), borderColor: '#f85149' }, base),
      Object.assign({ label: 'HRV 平衡', data: mk('hrv'), borderColor: '#bc8cff' }, base),
    ] },
    options: { responsive: true, plugins: { legend: { labels: { color: '#8b949e' } } } },
  })
}

function loadAll() {
  api('/api/data/' + UID + '/summary?days=' + DAYS).then(function (d) {
    var rows = d.days || []
    renderStats(rows)
    renderCharts(rows)
    renderTable(rows)
  }).catch(function (e) {
    $('#stats').innerHTML = '<div class="card err">加载失败: ' + e.message + '</div>'
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
      t.textContent = '已复制'
      setTimeout(function () { t.textContent = old }, 1200)
    })
  }

  Array.prototype.forEach.call(document.querySelectorAll('.range'), function (b) {
    if (b.getAttribute('data-days') === String(DAYS)) b.classList.add('primary')
    b.onclick = function () {
      DAYS = Number(b.getAttribute('data-days'))
      Array.prototype.forEach.call(document.querySelectorAll('.range'), function (x) { x.classList.remove('primary') })
      b.classList.add('primary')
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
