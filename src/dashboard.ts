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
  --accent: #0070f3; --red: #ee0000; --green: #3fb950; --amber: #f5a623; --purple: #7928ca;
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
  --green: #1a7f37; --red: #cf222e;
  --scroll-thumb: #ccc;
  color-scheme: light;
}
* { box-sizing: border-box }
html { background: var(--bg) }
body { margin:0; background:var(--bg); color:var(--fg); transition:background-color .3s ease, color .3s ease;
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
  cursor:pointer; transition:border-color .15s, background .15s, color .15s, transform .1s; text-decoration:none }
button:hover, .btn:hover { background:var(--hover-bg); border-color:var(--hover-border) }
button:active { transform:scale(.97) }
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
  align-items:flex-start; justify-content:center; padding:12vh 16px 16px;
  overflow-y:auto; -webkit-overflow-scrolling:touch; overscroll-behavior:contain }
.modal-overlay.open { display:flex }
.modal { width:100%; max-width:520px; background:var(--surface); border:1px solid var(--border-strong);
  border-radius:12px; padding:20px; box-shadow:var(--shadow-modal);
  max-height:calc(100vh - 32px); max-height:calc(100dvh - 32px);
  overflow-y:auto; -webkit-overflow-scrolling:touch; overscroll-behavior:contain }
.modal-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;
  position:sticky; top:-20px; z-index:1; background:var(--surface); margin:-20px -20px 12px; padding:14px 20px 10px }
.modal-head h3 { font-size:15px; margin:0 }
.section-label { font-size:11px; text-transform:uppercase; letter-spacing:.06em; color:var(--fg-subtle); margin:10px 0 6px }
.modal-desc { font-size:13px; color:var(--fg-muted); margin:0 0 12px }
.invite-input { flex:1; min-width:0; font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; font-size:12px;
  color:var(--fg-muted) }

/* ---- 移动端 App 式布局 ---- */
#mobHome { display:none }
.circle-row { display:flex; gap:16px; overflow-x:auto; padding:2px 2px 14px; scrollbar-width:none;
  overscroll-behavior-x:contain; touch-action:pan-x }
.circle-row::-webkit-scrollbar { display:none }
.circle-item { flex:none; display:flex; flex-direction:column; align-items:center; gap:8px; cursor:pointer }
.circle { width:76px; height:76px; border-radius:50%; border:2px solid var(--border-strong); background:var(--surface);
  display:flex; align-items:center; justify-content:center; transition:transform .15s }
.circle-item:active .circle { transform:scale(.94) }
.cval { font-size:24px; font-weight:600; font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  font-variant-numeric:tabular-nums }
.clabel { font-size:12px; color:var(--fg-muted) }
.mcard { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:14px 16px;
  margin-bottom:12px; cursor:pointer; scroll-margin-top:64px }
.mcard-head { display:flex; align-items:center; gap:8px }
.mcard-name { font-weight:600; font-size:14px }
.mcard-date { margin-left:auto; color:var(--fg-subtle); font-size:12px }
.mcard .chev { color:var(--fg-subtle); transition:transform .2s; font-size:16px }
.mcard.open .chev { transform:rotate(90deg) }
.mcard-body { display:flex; align-items:flex-end; justify-content:space-between; margin-top:10px; gap:12px }
.mcard-val .sub { font-size:12px; color:var(--fg-subtle) }
.mcard-val .big { font-size:36px; font-weight:600; line-height:1.15;
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; font-variant-numeric:tabular-nums }
.mcard-detail { display:none; margin-top:14px; border-top:1px solid var(--border); padding-top:12px }
.mcard.open .mcard-detail { display:block }
.narrative { font-size:13px; color:var(--fg-muted); margin:0 0 14px; line-height:1.7 }
.pillbars { display:flex; align-items:flex-end; gap:3px; height:150px; overflow-x:auto; padding-bottom:2px;
  scrollbar-width:none }
.pillbars::-webkit-scrollbar { display:none }
.pillbar { flex:1 0 6px; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:flex-end;
  gap:6px; min-width:0 }
.pillbar .bar { width:100%; max-width:12px; min-width:3px; border-radius:999px; background:var(--fg); opacity:.92 }
.pillbar.empty .bar { background:var(--border-strong); opacity:1 }
.pillbar .lbl { font-size:11px; color:var(--fg-subtle) }
.tabbar { display:none; position:fixed; bottom:14px; left:0; right:0; margin:0 auto; width:max-content; z-index:60;
  background:var(--surface-2); border:1px solid var(--border-strong); border-radius:999px; padding:6px; gap:4px;
  box-shadow:var(--shadow-menu) }
.tab-ind { position:absolute; top:6px; bottom:6px; left:6px; width:60px; border-radius:999px;
  background:var(--border-strong);
  transition:transform .28s cubic-bezier(.4,0,.2,1), width .28s cubic-bezier(.4,0,.2,1) }
.tabbar button { position:relative; z-index:1; border:none; background:transparent; border-radius:999px;
  padding:8px 16px; font-size:13px; color:var(--fg-muted); white-space:nowrap; flex:1;
  transition:color .2s; touch-action:manipulation }
.tabbar button.active { color:var(--fg) }

/* ---- 骨架屏 ---- */
.skel { display:inline-block; background:var(--border-strong); opacity:.45; border-radius:6px;
  animation:skelPulse 1.3s ease-in-out infinite }
@keyframes skelPulse { 0%,100% { opacity:.45 } 50% { opacity:.18 } }
.skel-circle { background:var(--surface-2); border:2px solid var(--border) }

/* ---- 交互动效 ---- */
@keyframes fadeInUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }
@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
@keyframes modalIn { from { opacity:0; transform:translateY(10px) scale(.97) } to { opacity:1; transform:none } }
@keyframes menuIn { from { opacity:0; transform:translateY(-6px) scale(.98) } to { opacity:1; transform:none } }
@keyframes growBar { from { transform:scaleY(0) } }
@media (min-width: 721px) {
  #app > * { animation:fadeInUp .45s ease backwards }
  #app > *:nth-child(2) { animation-delay:.05s }
  #app > *:nth-child(3) { animation-delay:.1s }
  #app > *:nth-child(4) { animation-delay:.15s }
  #app > *:nth-child(5) { animation-delay:.2s }
  .grid .card:hover { transform:translateY(-2px); border-color:var(--hover-border) }
}
.grid .card { transition:transform .2s ease, border-color .2s ease, background-color .3s ease }
.panel, .topbar, .chip, pre, select, input, .mcard { transition:background-color .3s ease, border-color .3s ease, color .3s ease }
.circle-item .circle { transition:transform .15s ease, border-color .3s ease }
@media (hover: hover) { .circle-item:hover .circle { transform:translateY(-2px) } }
@media (hover: hover) { .mcard:hover { border-color:var(--hover-border) } }
.login { animation:fadeInUp .5s ease }
.menu.open { animation:menuIn .18s cubic-bezier(.2,0,.2,1); transform-origin:top right }
.modal-overlay.open { animation:fadeIn .2s ease }
.modal-overlay.open .modal { animation:modalIn .25s cubic-bezier(.2,0,.2,1) }
.pillbar .bar { transform-origin:bottom }
.mcard.open .pillbar .bar { animation:growBar .45s cubic-bezier(.2,0,.2,1) backwards; animation-delay:calc(var(--i, 0) * 8ms) }
@keyframes tabIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:none } }
.tab-anim { animation:tabIn .28s cubic-bezier(.2,0,.2,1) }
@media (prefers-reduced-motion: reduce) {
  .tab-anim { animation:none }
  .tab-ind { transition:none }
  #app > *, .menu.open, .modal-overlay.open, .modal-overlay.open .modal, .mcard.open .pillbar .bar, .login { animation:none }
  *, *::before, *::after { transition-duration:.01ms !important; animation-duration:.01ms !important }
}
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
.stat-body { display:flex; align-items:flex-end; justify-content:space-between; gap:8px; margin-top:8px; min-height:40px }
.stat .spark { flex:none; line-height:0 }
.stat .delta { margin-top:6px; font-size:11.5px; font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  font-variant-numeric:tabular-nums }
.delta.up { color:var(--green) }
.delta.down { color:var(--red) }
.delta.flat { color:var(--fg-subtle) }
.grid .card { animation:fadeInUp .4s ease backwards; animation-delay:calc(var(--i, 0) * 45ms) }
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

/* ---- 指标 icon 与韧性等级条 ---- */
.mic { display:inline-flex; width:14px; height:14px; flex:none }
.mic svg { width:100%; height:100%; display:block }
.mcard-head .mic { width:15px; height:15px }
.lvlbar { display:flex; gap:3px; min-width:0 }
.lvlbar i { height:5px; flex:1; border-radius:3px; background:var(--border-strong) }
.lvlbar i.on { background:currentColor; opacity:.34 }
.lvlbar i.cur { opacity:1 }
.lvlbar.mini { width:34px; gap:2px }
.lvlbar.mini i { height:4px }
.stat .delta-row { display:flex; align-items:center; gap:8px; margin-top:8px }
.stat .delta-row .lvlbar { width:72px; flex:none }
.stat .delta-row .lvltxt { font-size:11.5px; color:var(--fg-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis }

/* ---- 锻炼列表 ---- */
.wrow { display:flex; align-items:center; gap:10px; padding:9px 2px; border-bottom:1px solid var(--border); font-size:13px }
.wrow:last-child { border-bottom:none }
.wdot { width:8px; height:8px; border-radius:50%; flex:none }
.wname { font-weight:500; flex:none }
.wmeta { color:var(--fg-muted); flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap }
.wdate { color:var(--fg-subtle); font-size:12px; font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace }

/* ---- 图表容器：固定高度，避免窄屏下按比例压扁 ---- */
.chart-box { position:relative; height:230px }
/* 睡眠节奏：横向逐日条数多，通栏展示更易读 */
#rhythmPanel { grid-column: 1 / -1 }

/* ---- 移动端 ---- */
@media (max-width: 720px) {
  .topbar { backdrop-filter:none; background:var(--bg) }
  .wrap { padding:16px 12px 110px }
  .grid { display:none }
  #mobHome { display:block }
  .tabbar { display:flex }
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
  .modal-overlay { padding:16px 12px 96px }
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
  <div class="center" style="margin-top:20px"><a class="btn" href="/">前往看板 →</a> <a class="btn" href="/help" target="_blank" rel="noopener">📖 使用文档</a></div>
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
      <button class="menu-item" id="miHelp">使用文档</button>
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
    <div id="mobHome">
      <div class="circle-row" id="circleRow">
        <div class="circle-item"><div class="circle skel-circle skel"></div><div class="skel" style="width:52px;height:12px"></div></div>
        <div class="circle-item"><div class="circle skel-circle skel"></div><div class="skel" style="width:52px;height:12px"></div></div>
        <div class="circle-item"><div class="circle skel-circle skel"></div><div class="skel" style="width:52px;height:12px"></div></div>
        <div class="circle-item"><div class="circle skel-circle skel"></div><div class="skel" style="width:52px;height:12px"></div></div>
        <div class="circle-item"><div class="circle skel-circle skel"></div><div class="skel" style="width:52px;height:12px"></div></div>
      </div>
      <div id="mobCards">
        <div class="mcard" style="cursor:default">
          <div class="mcard-head"><span class="skel" style="width:10px;height:10px;border-radius:50%"></span><span class="skel" style="width:88px;height:14px"></span><span style="flex:1"></span><span class="skel" style="width:40px;height:12px"></span></div>
          <div class="mcard-body"><div><span class="skel" style="width:30px;height:11px;display:block;margin-bottom:8px"></span><span class="skel" style="width:60px;height:32px;display:block"></span></div><span class="skel" style="width:90px;height:36px"></span></div>
        </div>
        <div class="mcard" style="cursor:default">
          <div class="mcard-head"><span class="skel" style="width:10px;height:10px;border-radius:50%"></span><span class="skel" style="width:72px;height:14px"></span><span style="flex:1"></span><span class="skel" style="width:40px;height:12px"></span></div>
          <div class="mcard-body"><div><span class="skel" style="width:30px;height:11px;display:block;margin-bottom:8px"></span><span class="skel" style="width:52px;height:32px;display:block"></span></div><span class="skel" style="width:90px;height:36px"></span></div>
        </div>
        <div class="mcard" style="cursor:default">
          <div class="mcard-head"><span class="skel" style="width:10px;height:10px;border-radius:50%"></span><span class="skel" style="width:96px;height:14px"></span><span style="flex:1"></span><span class="skel" style="width:40px;height:12px"></span></div>
          <div class="mcard-body"><div><span class="skel" style="width:30px;height:11px;display:block;margin-bottom:8px"></span><span class="skel" style="width:68px;height:32px;display:block"></span></div><span class="skel" style="width:90px;height:36px"></span></div>
        </div>
      </div>
    </div>
    <div class="toolbar">
      <div class="seg" id="rangeSeg">
        <button class="range" data-days="7">7 天</button>
        <button class="range" data-days="30">30 天</button>
        <button class="range" data-days="90">90 天</button>
      </div>
    </div>

    <div class="grid" id="stats">
      <div class="stat card" style="--i:0"><div class="label"><span class="skel" style="width:10px;height:10px;border-radius:50%"></span><span class="skel" style="width:64px;height:12px"></span></div><div class="stat-body"><div class="stat-main"><div class="skel" style="width:70px;height:30px;display:block;margin-bottom:8px"></div><div class="skel" style="width:48px;height:11px;display:block"></div></div><span class="skel" style="width:90px;height:36px"></span></div></div>
      <div class="stat card" style="--i:1"><div class="label"><span class="skel" style="width:10px;height:10px;border-radius:50%"></span><span class="skel" style="width:56px;height:12px"></span></div><div class="stat-body"><div class="stat-main"><div class="skel" style="width:64px;height:30px;display:block;margin-bottom:8px"></div><div class="skel" style="width:48px;height:11px;display:block"></div></div><span class="skel" style="width:90px;height:36px"></span></div></div>
      <div class="stat card" style="--i:2"><div class="label"><span class="skel" style="width:10px;height:10px;border-radius:50%"></span><span class="skel" style="width:44px;height:12px"></span></div><div class="stat-body"><div class="stat-main"><div class="skel" style="width:58px;height:30px;display:block;margin-bottom:8px"></div><div class="skel" style="width:48px;height:11px;display:block"></div></div><span class="skel" style="width:90px;height:36px"></span></div></div>
      <div class="stat card" style="--i:3"><div class="label"><span class="skel" style="width:10px;height:10px;border-radius:50%"></span><span class="skel" style="width:60px;height:12px"></span></div><div class="stat-body"><div class="stat-main"><div class="skel" style="width:66px;height:30px;display:block;margin-bottom:8px"></div><div class="skel" style="width:48px;height:11px;display:block"></div></div><span class="skel" style="width:90px;height:36px"></span></div></div>
      <div class="stat card" style="--i:4"><div class="label"><span class="skel" style="width:10px;height:10px;border-radius:50%"></span><span class="skel" style="width:68px;height:12px"></span></div><div class="stat-body"><div class="stat-main"><div class="skel" style="width:54px;height:30px;display:block;margin-bottom:8px"></div><div class="skel" style="width:48px;height:11px;display:block"></div></div><span class="skel" style="width:90px;height:36px"></span></div></div>
    </div>

    <div class="charts" id="chartsWrap">
      <div class="panel">
        <h2>睡眠 / 恢复度 / 活动</h2>
        <p class="desc">每日综合评分（0–100）· 滚轮缩放 · 拖动平移 · 双击复位</p>
        <div class="chart-box"><canvas id="c1"></canvas></div>
      </div>
      <div class="panel">
        <h2>静息心率</h2>
        <p class="desc">睡眠期间平均心率（次/分）· 滚轮缩放 · 拖动平移 · 双击复位</p>
        <div class="chart-box"><canvas id="c2"></canvas></div>
      </div>
      <div class="panel">
        <h2>HRV 平衡</h2>
        <p class="desc">来自恢复度贡献因子（1–100）· 滚轮缩放 · 拖动平移 · 双击复位</p>
        <div class="chart-box"><canvas id="c3"></canvas></div>
      </div>
      <div class="panel">
        <h2>睡眠结构</h2>
        <p class="desc">深睡 / REM / 浅睡 / 清醒（小时）· 点击柱子查看当晚眠动图 · 滚轮缩放 · 拖动平移</p>
        <div class="chart-box"><canvas id="c4"></canvas></div>
      </div>
      <div class="panel">
        <h2>睡眠分期（眠动图）</h2>
        <p class="desc" id="hypnoDesc">加载中…</p>
        <div class="chart-box"><canvas id="c5"></canvas></div>
      </div>
      <div class="panel">
        <h2>压力与恢复</h2>
        <p class="desc">每日高压力（上，分钟）与恢复（下，分钟）· 滚轮缩放 · 拖动平移 · 双击复位</p>
        <div class="chart-box"><canvas id="c6"></canvas></div>
      </div>
      <div class="panel" id="rhythmPanel">
        <h2>睡眠节奏</h2>
        <p class="desc">每晚入睡 → 醒来窗口 · 横轴从正午到次日正午 · 拖动平移</p>
        <div class="chart-box" id="rhythmBox"><canvas id="c7"></canvas></div>
      </div>
    </div>

    <div class="panel" id="workoutPanel" style="display:none">
      <h2>最近锻炼</h2>
      <p class="desc" id="workoutDesc">加载中…</p>
      <div id="workoutList"></div>
    </div>

    <div class="panel" id="tablePanel" style="display:none">
      <h2>明细</h2>
      <p class="desc">最近 14 天</p>
      <div style="overflow:auto"><table id="tbl"></table></div>
      <p class="subtle" id="chartmsg" style="display:none;margin-top:12px">Chart.js CDN 不可用，仅显示明细表。</p>
    </div>

    <div class="panel" id="explorerPanel">
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

<nav class="tabbar" id="tabbar">
  <div class="tab-ind"></div>
  <button class="active" data-tab="home">摘要</button>
  <button data-tab="trend">趋势</button>
  <button data-tab="explore">探索</button>
</nav>
<div class="modal-overlay" id="settingsModal">
  <div class="modal">
    <div class="modal-head">
      <h3>设置</h3>
      <button id="settingsClose">✕</button>
    </div>
    <div class="section-label">帮助与文档</div>
    <p class="modal-desc">指标含义、图表操作、数据同步与 AI 接入说明，新窗口打开。</p>
    <div class="row">
      <a class="btn" href="/help" target="_blank" rel="noopener">📖 使用文档 →</a>
      <a class="btn" href="/mcp-docs" target="_blank" rel="noopener">MCP 接入文档 →</a>
    </div>
    <div class="section-label" style="margin-top:18px">邀请用户授权</div>
    <p class="modal-desc">把下面的授权链接发给其他 Oura 用户，对方登录并同意授权后即接入本服务（未获 Oura 正式批准的应用最多 10 人）。</p>
    <div class="row">
      <input class="invite-input" id="inviteInput" readonly>
      <button id="copyInvite">复制</button>
    </div>
    <div class="section-label" style="margin-top:18px">用户备注名</div>
    <p class="modal-desc">给每个用户起个名字（如「我」「老婆」），MCP 查询时可用 alias 参数定位到具体的人。</p>
    <div id="aliasList"></div>
    <div class="section-label" style="margin-top:18px">个人数据 Key</div>
    <p class="modal-desc">为用户生成独立 Key：用它（Bearer 或 ?key=）调用 API / MCP 只能查询此人的数据，无法查看其他人或修改设置。重新生成后旧 Key 立即失效。</p>
    <div id="userKeyList"></div>
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
var USERS = [], UID = '', DAYS = 30, C1 = null, C2 = null, C3 = null, C4 = null, C6 = null, C7 = null, HY = null
var HYPNO_DATE = ''
var PALETTE = { sleep: '#0070f3', readiness: '#50e3c2', activity: '#f5a623', rhr: '#ee0000', hrv: '#7928ca',
  deep: '#3b5bdb', rem: '#22d3ee', lightslp: '#74c0fc', awakeslp: '#868e96', recover: '#3fb950' }
var STAGE_NAMES = ['深睡', '浅睡', 'REM', '清醒']

function api(url, opts) {
  return fetch(url, opts).then(function (r) {
    if (r.status === 401) { location.href = '/login'; throw new Error('unauthorized') }
    return r.json().then(function (j) {
      if (!r.ok) throw new Error(j && j.error ? j.error : 'HTTP ' + r.status)
      return j
    })
  })
}

function chartTheme() {
  var cs = getComputedStyle(document.documentElement)
  return {
    grid: (cs.getPropertyValue('--chart-grid') || '#1c1c1c').trim(),
    tick: (cs.getPropertyValue('--chart-tick') || '#666').trim(),
    tipBg: (cs.getPropertyValue('--tip-bg') || '#111').trim(),
    tipBorder: (cs.getPropertyValue('--tip-border') || '#333').trim(),
    tipFg: (cs.getPropertyValue('--fg') || '#ededed').trim(),
    legend: (cs.getPropertyValue('--legend-text') || '#a1a1a1').trim(),
  }
}

/** 秒 → "8h20m" */
function fmtHM(sec) {
  if (sec == null || !isFinite(sec)) return '—'
  var m = Math.round(sec / 60)
  return Math.floor(m / 60) + 'h' + (m % 60 < 10 ? '0' : '') + (m % 60) + 'm'
}

/** 正午起算的小时数 → "HH:MM"（12 → 00:00） */
function fmtClock(hSinceNoon) {
  if (hSinceNoon == null || !isFinite(hSinceNoon)) return '—'
  var t = ((hSinceNoon + 12) % 24 + 24) % 24
  var hh = Math.floor(t), mm = Math.round((t - hh) * 60)
  if (mm === 60) { mm = 0; hh = (hh + 1) % 24 }
  return (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm
}

function renderStats(rows) {
  var html = ''
  METRICS.forEach(function (m, idx) {
    var last = null, i
    for (i = rows.length - 1; i >= 0; i--) { if (numOf(rows[i], m) != null) { last = rows[i]; break } }
    var delta = ''
    if (m.cat) {
      // 韧性：delta 行改为「等级条 + 等级说明」
      if (last) {
        delta = '<div class="delta-row">' + lvlBarHTML(last[m.key]) +
          '<span class="lvltxt">' + (RESILIENCE_DESC_SHORT[last[m.key]] || '') + '</span></div>'
      }
    } else if (m.key === 'vascularAge') {
      // 血管年龄：delta 行直接对比实际年龄（低为好）
      var ageNum = Number(window.__PROFILE && window.__PROFILE.age)
      if (Number.isFinite(ageNum) && last) {
        var ageDiff = last.vascularAge - ageNum
        var cls2 = ageDiff <= 0 ? 'up' : 'down'
        var sign = ageDiff > 0 ? '+' : ''
        delta = '<div class="delta ' + cls2 + '">' + sign + ageDiff + ' 岁<span class="muted"> 较实际年龄</span></div>'
      }
    } else {
      var curArr = rows.slice(-7).map(function (r) { return numOf(r, m) }).filter(function (v) { return v != null })
      var prevArr = rows.slice(-14, -7).map(function (r) { return numOf(r, m) }).filter(function (v) { return v != null })
      var cur = curArr.length ? curArr.reduce(function (a, b) { return a + b }, 0) / curArr.length : null
      var prev = prevArr.length ? prevArr.reduce(function (a, b) { return a + b }, 0) / prevArr.length : null
      if (cur != null && prev != null) {
        var diff = cur - prev
        var goodUp = m.good !== 'down'
        var cls = Math.abs(diff) < 0.05 ? 'flat' : ((diff > 0) === goodUp ? 'up' : 'down')
        var arrow = diff > 0 ? '↑' : (diff < 0 ? '↓' : '·')
        delta = '<div class="delta ' + cls + '">' + arrow + ' ' + Math.abs(diff).toFixed(1) + '<span class="muted"> 较前7天</span></div>'
      }
    }
    var sparkVals = rows.slice(-7).map(function (r) { return numOf(r, m) })
    var spark = m.cat ? '' : sparkSVG(sparkVals, m.color, m.spark)
    var sub
    if (!last) sub = '暂无数据'
    else if (m.key === 'vascularAge') sub = '岁'
    else sub = last.date.slice(5)
    var val = last ? displayOf(last, m) : '—'
    if (m.cat && last) val = '<span style="color:' + (RESILIENCE_COLOR[last[m.key]] || 'inherit') + '">' + val + '</span>'
    var icon = ICONS[m.key]
      ? '<span class="mic" style="color:' + m.color + '">' + ICONS[m.key] + '</span>'
      : '<span class="dot" style="background:' + m.color + '"></span>'
    html += '<div class="stat card" style="--i:' + idx + '"><div class="label"' + (m.tip ? ' title="' + m.tip + '"' : '') + '>' + icon + m.name + '</div>' +
      '<div class="stat-body"><div class="stat-main"><div class="value">' + val + '</div><div class="sub">' + sub + '</div></div>' +
      (spark ? '<div class="spark">' + spark + '</div>' : '') +
      '</div>' + delta + '</div>'
  })
  $('#stats').innerHTML = html
}

function renderTable(rows) {
  var t = rows.slice(-14)
  if (!t.length) return
  var keys = ['date', 'sleep', 'readiness', 'activity', 'rhr', 'hrv', 'spo2', 'vo2max', 'vascularAge']
  var heads = { date: '日期', sleep: '睡眠', readiness: '恢复度', activity: '活动', rhr: '静息心率', hrv: 'HRV', spo2: '血氧 %', vo2max: 'VO2', vascularAge: '血管年龄' }
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

function areaFill(hex, alphaTop) {
  return function (context) {
    var area = context.chart.chartArea
    if (!area) return 'transparent'
    var g = context.chart.ctx.createLinearGradient(0, area.top, 0, area.bottom)
    g.addColorStop(0, hexToRgba(hex, alphaTop || 0.12))
    g.addColorStop(1, hexToRgba(hex, 0.01))
    return g
  }
}

/** 窄屏下 x 轴最多容纳的刻度数 */
function tickLimit() {
  return window.matchMedia('(max-width: 720px)').matches ? 5 : 12
}

function renderCharts(rows) {
  if (typeof Chart === 'undefined') { $('#chartmsg').style.display = 'block'; $('#tablePanel').style.display = 'block'; return }
  if (!rows.length) return
  var labels = rows.map(function (r) { return r.date.slice(5) })
  var fullLabels = rows.map(function (r) { return r.date })
  var mk = function (key) { return rows.map(function (r) { return r[key] == null ? null : r[key] }) }
  var T = chartTheme()
  var legendOpt = { legend: { labels: { color: T.legend, boxWidth: 12, boxHeight: 2, font: { size: 11 } } } }
  var tip = { backgroundColor: T.tipBg, titleColor: T.tipFg, bodyColor: T.tipFg, borderColor: T.tipBorder, borderWidth: 1,
    padding: 10, cornerRadius: 8, displayColors: true, boxWidth: 8, boxHeight: 8, titleFont: { weight: '600' },
    callbacks: { title: function (items) { return fullLabels[items[0].dataIndex] || items[0].label } } }
  var interact = { mode: 'index', intersect: false }
  var zoomOpt = { pan: { enabled: true, mode: 'x' },
    zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' },
    limits: { x: { min: 'original', max: 'original' } } }
  var crossOpt = { line: { color: T.tick, width: 1, dashPattern: [3, 3] }, snap: { enabled: true },
    sync: { enabled: false }, zoom: { enabled: false } }
  var scales = function (yOpts) {
    return { x: { grid: { color: T.grid }, ticks: { color: T.tick, maxTicksLimit: tickLimit(), maxRotation: 0 } },
             y: Object.assign({ grid: { color: T.grid }, ticks: { color: T.tick } }, yOpts || {}) }
  }
  var ds = function (label, key, color) {
    return { label: label, data: mk(key), borderColor: color, backgroundColor: areaFill(color, 0.1), fill: true,
      tension: 0.35, pointRadius: 0, pointHoverRadius: 4, spanGaps: true, borderWidth: 1.5 }
  }
  if (C1) C1.destroy()
  if (C2) C2.destroy()
  if (C3) C3.destroy()
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
      ds('静息心率 (次/分)', 'rhr', PALETTE.rhr),
    ] },
    options: { responsive: true, maintainAspectRatio: false, interaction: interact,
      scales: scales({ suggestedMin: 40 }),
      plugins: { legend: legendOpt.legend, tooltip: tip, zoom: zoomOpt, crosshair: crossOpt } },
  })
  C3 = new Chart($('#c3'), {
    type: 'line',
    data: { labels: labels, datasets: [
      ds('HRV 平衡', 'hrv', PALETTE.hrv),
    ] },
    options: { responsive: true, maintainAspectRatio: false, interaction: interact,
      scales: scales({ min: 0, max: 100 }),
      plugins: { legend: legendOpt.legend, tooltip: tip, zoom: zoomOpt, crosshair: crossOpt } },
  })
  $('#c1').ondblclick = function () { if (C1) C1.resetZoom() }
  $('#c2').ondblclick = function () { if (C2) C2.resetZoom() }
  $('#c3').ondblclick = function () { if (C3) C3.resetZoom() }

  // ---- 睡眠结构：堆叠柱（深睡/REM/浅睡/清醒，小时），点击柱子切换眠动图 ----
  var sec2h = function (v) { return v == null ? null : Math.max(0, Math.round(v / 360)) / 10 }
  var barStack = function (label, key, color) {
    return { label: label, data: rows.map(function (r) { return sec2h(r[key]) }), backgroundColor: color, stack: 's',
      borderWidth: 0, barPercentage: 0.82, categoryPercentage: 0.9, maxBarThickness: 18 }
  }
  if (C4) C4.destroy()
  C4 = new Chart($('#c4'), {
    type: 'bar',
    data: { labels: labels, datasets: [
      barStack('深睡', 'deep', PALETTE.deep),
      barStack('REM', 'rem', PALETTE.rem),
      barStack('浅睡', 'light', PALETTE.lightslp),
      barStack('清醒', 'awake', PALETTE.awakeslp),
    ] },
    options: { responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      onClick: function (e) {
        var els = C4.getElementsAtEventForMode(e, 'index', { intersect: false }, true)
        if (!els.length) return
        var hit = rows[els[0].index]
        renderHypno(hit ? hit.date : null)
      },
      scales: { x: { stacked: true, grid: { color: T.grid }, ticks: { color: T.tick, maxTicksLimit: tickLimit(), maxRotation: 0 } },
                y: { stacked: true, grid: { color: T.grid }, ticks: { color: T.tick, callback: function (v) { return v + 'h' } }, suggestedMax: 9 } },
      plugins: { legend: legendOpt.legend,
        tooltip: Object.assign({}, tip, {
          callbacks: {
            title: function (items) { return fullLabels[items[0].dataIndex] || items[0].label },
            label: function (ctx) { return ctx.dataset.label + ' ' + fmtHM((ctx.parsed.y || 0) * 3600) },
            footer: function (items) {
              var r = rows[items[0].dataIndex]
              if (!r || r.deep == null) return ''
              return '总睡眠 ' + fmtHM(r.deep + r.rem + r.light) + (r.efficiency != null ? ' · 效率 ' + r.efficiency + '%' : '')
            },
          },
        }),
        zoom: zoomOpt } },
  })
  $('#c4').ondblclick = function () { if (C4) C4.resetZoom() }

  // ---- 压力与恢复：双向柱（上=高压力分钟，下=恢复分钟） ----
  var SUMMARY_CN = { restored: '已恢复', normal: '正常', stressful: '高压日' }
  var minOrNull = function (v, neg) {
    return v == null ? null : (neg ? -1 : 1) * Math.round(v / 60)
  }
  if (C6) C6.destroy()
  C6 = new Chart($('#c6'), {
    type: 'bar',
    data: { labels: labels, datasets: [
      { label: '高压力', data: rows.map(function (r) { return minOrNull(r.stressHigh, false) }),
        backgroundColor: PALETTE.rhr, stack: 's', borderWidth: 0, barPercentage: 0.82, maxBarThickness: 18 },
      { label: '恢复', data: rows.map(function (r) { return minOrNull(r.recoveryHigh, true) }),
        backgroundColor: PALETTE.recover, stack: 's', borderWidth: 0, barPercentage: 0.82, maxBarThickness: 18 },
    ] },
    options: { responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: { x: { stacked: true, grid: { color: T.grid }, ticks: { color: T.tick, maxTicksLimit: tickLimit(), maxRotation: 0 } },
                y: { stacked: true, grid: { color: T.grid }, ticks: { color: T.tick, callback: function (v) { return Math.abs(v) + 'm' } } } },
      plugins: { legend: legendOpt.legend,
        tooltip: Object.assign({}, tip, { displayColors: true,
          callbacks: {
            title: function (items) { return fullLabels[items[0].dataIndex] || items[0].label },
            label: function (ctx) {
              var v = ctx.parsed.y
              return ctx.dataset.label + ' ' + Math.abs(Math.round(v)) + ' 分钟'
            },
            afterBody: function (items) {
              var r = rows[items[0].dataIndex]
              return r && r.stressSummary ? '当日总结：' + (SUMMARY_CN[r.stressSummary] || r.stressSummary) : ''
            },
          },
        }),
        zoom: zoomOpt } },
  })
  $('#c6').ondblclick = function () { if (C6) C6.resetZoom() }

  // ---- 睡眠节奏：水平浮动条（入睡→醒来），横轴正午→次日正午 ----
  var rhythmRows = rows.filter(function (r) { return r.bedStartH != null && r.bedEndH != null })
  if (C7) C7.destroy()
  $('#rhythmPanel').style.display = rhythmRows.length ? '' : 'none'
  if (rhythmRows.length) {
    $('#rhythmBox').style.height = Math.min(Math.max(rhythmRows.length * 13 + 42, 190), 420) + 'px'
    C7 = new Chart($('#c7'), {
      type: 'bar',
      data: { labels: rhythmRows.map(function (r) { return r.date.slice(5) }),
        datasets: [{ label: '睡眠窗口',
          data: rhythmRows.map(function (r) { return [r.bedStartH, r.bedEndH] }),
          backgroundColor: 'rgba(0,112,243,.55)', hoverBackgroundColor: 'rgba(0,112,243,.85)',
          borderRadius: 3, borderSkipped: false, barPercentage: 0.72 }] },
      options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        scales: {
          x: { min: 0, max: 24, grid: { color: T.grid },
            ticks: { color: T.tick, stepSize: 3, callback: function (v) { return fmtClock(v) } } },
          y: { reverse: true, grid: { display: false }, ticks: { color: T.tick, autoSkip: true, maxTicksLimit: 16 } } },
        plugins: { legend: { display: false },
          tooltip: Object.assign({}, tip, { displayColors: false,
            callbacks: {
              title: function (items) {
                var r = rhythmRows[items[0].dataIndex]
                return r ? r.date : ''
              },
              label: function (ctx) {
                var v = ctx.raw
                if (!v || v.length !== 2) return ''
                return fmtClock(v[0]) + ' 入睡 → ' + fmtClock(v[1]) + ' 醒来 · ' + fmtHM((v[1] - v[0]) * 3600)
              },
            },
          }),
          zoom: { pan: { enabled: true, mode: 'x' }, zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' },
            limits: { x: { min: 0, max: 24 } } } } },
    })
  }
  renderHypno(null)
}

/** 眩动图：date 指定夜晚（null = 默认最近一晚有分期数据的） */
function renderHypno(date) {
  var desc = $('#hypnoDesc')
  if (!desc) return
  if (typeof Chart === 'undefined') return
  var rows = window.__SUMMARY_ROWS || []
  var row = null, i
  if (date) {
    for (i = rows.length - 1; i >= 0; i--) { if (rows[i].date === date) { row = rows[i]; break } }
  } else {
    for (i = rows.length - 1; i >= 0; i--) { if (rows[i].hypno) { row = rows[i]; break } }
  }
  if (HY) { HY.destroy(); HY = null }
  if (!row || !row.hypno) {
    desc.textContent = date ? (date + ' 暂无睡眠分期数据') : '暂无睡眠分期数据'
    return
  }
  HYPNO_DATE = row.date
  var vals = row.hypno.split('').map(function (ch) {
    var v = Number(ch)
    return v >= 1 && v <= 4 ? v - 1 : null
  })
  var stageColors = [PALETTE.deep, PALETTE.lightslp, PALETTE.rem, PALETTE.awakeslp]
  var times = vals.map(function (_, idx) { return fmtClock(row.bedStartH != null ? row.bedStartH + idx * 5 / 60 : null) })
  var T = chartTheme()
  desc.textContent = row.date + ' · ' + fmtClock(row.bedStartH) + ' 入睡 → ' + fmtClock(row.bedEndH) + ' 醒来' +
    (row.deep != null ? ' · 总睡眠 ' + fmtHM(row.deep + row.rem + row.light) : '') +
    (row.efficiency != null ? ' · 效率 ' + row.efficiency + '%' : '') +
    (row.sleepHrv != null ? ' · 平均 HRV ' + row.sleepHrv : '')
  HY = new Chart($('#c5'), {
    type: 'line',
    data: { labels: times, datasets: [{
      label: '睡眠分期', data: vals, stepped: true, fill: true,
      borderColor: PALETTE.lightslp, backgroundColor: 'rgba(80,150,255,.07)',
      borderWidth: 2, pointRadius: 0, pointHoverRadius: 3,
      segment: { borderColor: function (ctx) { return stageColors[vals[ctx.p0DataIndex]] || PALETTE.lightslp } },
    }] },
    options: { responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: { grid: { color: T.grid }, ticks: { color: T.tick, maxTicksLimit: tickLimit(), maxRotation: 0, autoSkip: true } },
        y: { min: -0.4, max: 3.4, grid: { color: T.grid }, border: { display: false },
          ticks: { color: T.tick, stepSize: 1, callback: function (v) { return STAGE_NAMES[v] || '' } } } },
      plugins: { legend: { display: false },
        tooltip: { backgroundColor: T.tipBg, titleColor: T.tipFg, bodyColor: T.tipFg, borderColor: T.tipBorder,
          borderWidth: 1, padding: 10, cornerRadius: 8, displayColors: false, titleFont: { weight: '600' },
          callbacks: {
            title: function (items) { return row.date + ' ' + (times[items[0].dataIndex] || '') },
            label: function (ctx) { return '阶段：' + (STAGE_NAMES[ctx.parsed.y] || '—') },
          } } } },
  })
}

var RESILIENCE_CN = { limited: '有限', adequate: '充足', solid: '稳固', strong: '强', exceptional: '卓越' }
var RESILIENCE_ORD = { limited: 1, adequate: 2, solid: 3, strong: 4, exceptional: 5 }
var RESILIENCE_COLOR = { limited: '#f87171', adequate: '#fbbf24', solid: '#2dd4bf', strong: '#4ade80', exceptional: '#a78bfa' }
var RESILIENCE_DESC = { limited: '恢复能力较弱，注意休息', adequate: '恢复能力一般', solid: '恢复能力良好', strong: '恢复能力很强', exceptional: '恢复能力极佳' }
var RESILIENCE_DESC_SHORT = { limited: '恢复较弱', adequate: '恢复一般', solid: '恢复良好', strong: '恢复很强', exceptional: '恢复极佳' }
var RESILIENCE_TIP = '韧性（Resilience）：身体承受压力并从中恢复的能力，由睡眠恢复、日间恢复与压力反应共同评估'

/** 指标 icon（线性风格，stroke 用 currentColor 随主题/指标色变化） */
var SVGO = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
var ICONS = {
  sleep: SVGO + '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
  readiness: SVGO + '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>',
  activity: SVGO + '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
  rhr: SVGO + '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>',
  hrv: SVGO + '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
  spo2: SVGO + '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>',
  resilience: SVGO + '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
  vascularAge: SVGO + '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M8 2v4"/><path d="M16 2v4"/><path d="M3 10h18"/></svg>',
  vo2max: SVGO + '<path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/></svg>',
}
var METRICS = [
  { key: 'sleep', name: '睡眠评分', color: PALETTE.sleep, spark: 'line' },
  { key: 'readiness', name: '恢复度', color: PALETTE.readiness, spark: 'bar' },
  { key: 'activity', name: '活动', color: PALETTE.activity, spark: 'line' },
  { key: 'rhr', name: '静息心率', color: PALETTE.rhr, good: 'down', spark: 'line' },
  { key: 'hrv', name: 'HRV 平衡', color: PALETTE.hrv, spark: 'bar' },
  { key: 'spo2', name: '血氧 %', color: '#0ea5e9', spark: 'bar' },
  { key: 'resilience', name: '韧性', color: '#d946ef', cat: true, tip: RESILIENCE_TIP },
  { key: 'vascularAge', name: '血管年龄', color: '#f43f5e', good: 'down', spark: 'bar', tip: '估算的血管健康年龄，低于实际年龄为佳' },
  { key: 'vo2max', name: 'VO2 max', color: '#84cc16', spark: 'line', tip: '最大摄氧量：身体利用氧气的上限能力（ml/kg/min）' },
]

/** 韧性等级条 HTML（当前等级高亮） */
function lvlBarHTML(level, cls) {
  var ord = RESILIENCE_ORD[level] || 0
  var color = RESILIENCE_COLOR[level] || 'var(--fg-muted)'
  var segs = ''
  for (var i = 1; i <= 5; i++) segs += '<i class="' + (i < ord ? 'on' : i === ord ? 'on cur' : '') + '"></i>'
  return '<span class="lvlbar ' + (cls || '') + '" style="color:' + color + '">' + segs + '</span>'
}

/** 指标的数值形式（韧性映射为等级序数 1–5，用于均值/sparkline） */
function numOf(r, m) {
  var v = r[m.key]
  if (v == null) return null
  if (m.cat) return RESILIENCE_ORD[v] || null
  return typeof v === 'number' ? v : null
}

/** 指标的展示形式（韧性显示等级名） */
function displayOf(r, m) {
  var v = r[m.key]
  if (v == null) return '—'
  if (m.cat) return RESILIENCE_CN[v] || '—'
  return String(v)
}

function weekdayCN(iso) {
  var d = new Date(iso + 'T00:00:00Z')
  return isNaN(d) ? '' : '日一二三四五六'.charAt(d.getUTCDay())
}

/** 迷你趋势图：kind='line' 折线+渐变面积+末端圆点；kind='bar' 圆头渐变柱 */
var sparkUid = 0
function sparkSVG(vals, color, kind) {
  var i, v
  var min = Infinity, max = -Infinity
  for (i = 0; i < vals.length; i++) { v = vals[i]; if (v == null) continue; if (v < min) min = v; if (v > max) max = v }
  if (!isFinite(min)) return ''
  if (min === max) { min -= 0.5; max += 0.5 }
  var W = 90, H = 36
  var pts = []
  for (i = 0; i < vals.length; i++) {
    v = vals[i]
    if (v == null) continue
    pts.push([2 + (i / (vals.length - 1 || 1)) * (W - 6), H - 4 - ((v - min) / (max - min)) * (H - 12)])
  }
  if (!pts.length) return ''
  sparkUid++
  var gid = 'sg' + sparkUid
  var defs = '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="' + color + '" stop-opacity=".9"/>' +
    '<stop offset="1" stop-color="' + color + '" stop-opacity=".22"/></linearGradient>' +
    '<linearGradient id="' + gid + 'f" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="' + color + '" stop-opacity=".26"/>' +
    '<stop offset="1" stop-color="' + color + '" stop-opacity="0"/></linearGradient></defs>'
  var svg = '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">' + defs

  if (kind === 'bar') {
    var step = (W - 4) / vals.length
    var bw = Math.max(4, Math.min(11, step - 3))
    for (i = 0; i < pts.length; i++) {
      var h = Math.max(7, H - 4 - pts[i][1])
      var isLast = i === pts.length - 1
      svg += '<rect x="' + (pts[i][0] - bw / 2).toFixed(1) + '" y="' + (H - 3 - h).toFixed(1) +
        '" width="' + bw.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="' + (bw / 2).toFixed(1) +
        '" fill="url(#' + gid + ')"' + (isLast ? '' : ' opacity=".55"') + '/>'
    }
    svg += '</svg>'
    return svg
  }

  // 折线：经过中点的二次贝塞尔平滑
  var d = 'M' + pts[0][0].toFixed(1) + ',' + pts[0][1].toFixed(1)
  if (pts.length === 2) {
    d += ' L' + pts[1][0].toFixed(1) + ',' + pts[1][1].toFixed(1)
  } else {
    for (i = 1; i < pts.length - 1; i++) {
      var mx = (pts[i][0] + pts[i + 1][0]) / 2
      var my = (pts[i][1] + pts[i + 1][1]) / 2
      d += ' Q' + pts[i][0].toFixed(1) + ',' + pts[i][1].toFixed(1) + ' ' + mx.toFixed(1) + ',' + my.toFixed(1)
    }
    var lp = pts[pts.length - 1]
    d += ' L' + lp[0].toFixed(1) + ',' + lp[1].toFixed(1)
  }
  var area = d + ' L' + pts[pts.length - 1][0].toFixed(1) + ',' + (H - 1) + ' L' + pts[0][0].toFixed(1) + ',' + (H - 1) + ' Z'
  var last = pts[pts.length - 1]
  svg += '<path d="' + area + '" fill="url(#' + gid + 'f)"/>' +
    '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="5.5" fill="' + color + '" opacity=".22"/>' +
    '<circle cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="2.8" fill="' + color + '"/></svg>'
  return svg
}

function makeUserLabel(u) {
  var wrap = document.createElement('div')
  wrap.style.cssText = 'flex:0 0 170px;min-width:0'
  var email = document.createElement('div')
  email.style.cssText = 'font-size:12px;color:var(--fg);overflow:hidden;text-overflow:ellipsis;white-space:nowrap'
  email.textContent = u.email || u.id.slice(0, 8)
  wrap.appendChild(email)
  if (u.alias) {
    var al = document.createElement('div')
    al.style.cssText = 'font-size:12px;color:var(--fg-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap'
    al.textContent = '备注: ' + u.alias
    wrap.appendChild(al)
  }
  return wrap
}

function toggleCard(card, forceOpen) {
  var open = forceOpen === true ? true : !card.classList.contains('open')
  Array.prototype.forEach.call(document.querySelectorAll('.mcard'), function (c) { c.classList.remove('open') })
  if (open) {
    card.classList.add('open')
    if (window.matchMedia('(max-width: 720px)').matches) {
      window.setTimeout(function () { card.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, 80)
    }
  }
}

function renderMobile(rows) {
  var home = $('#mobHome')
  if (!home) return
  var circles = ''
  var cards = ''
  METRICS.forEach(function (m) {
    var lastRow = null, i, r
    for (i = rows.length - 1; i >= 0; i--) { if (numOf(rows[i], m) != null) { lastRow = rows[i]; break } }
    var latest = lastRow ? displayOf(lastRow, m) : '—'
    var icon = ICONS[m.key]
      ? '<span class="mic" style="color:' + m.color + '">' + ICONS[m.key] + '</span>'
      : '<span class="dot" style="background:' + m.color + '"></span>'
    // 圆环内容：韧性显示「等级名 + 迷你等级条」
    var circleInner
    if (m.cat && lastRow) {
      var lv = lastRow[m.key]
      circleInner = '<div style="display:flex;flex-direction:column;align-items:center;gap:4px">' +
        '<span class="cval" style="font-size:15px;color:' + RESILIENCE_COLOR[lv] + '">' + latest + '</span>' +
        lvlBarHTML(lv, 'mini') + '</div>'
    } else {
      circleInner = '<span class="cval">' + latest + '</span>'
    }
    circles += '<div class="circle-item" data-key="' + m.key + '"><div class="circle" style="border-color:' + m.color + '">' + circleInner + '</div><div class="clabel">' + m.name + '</div></div>'
    var sparkVals = rows.slice(-7).map(function (r) { return numOf(r, m) })
    var inRange = rows.filter(function (r) { return numOf(r, m) != null })
    var explain = ''
    var narrative
    if (m.cat) {
      if (lastRow) {
        explain = '韧性衡量身体承受压力并从中恢复的能力，由睡眠恢复、日间恢复与压力反应共同评估。当前等级 <b style="color:' +
          RESILIENCE_COLOR[lastRow[m.key]] + '">' + latest + '</b>（' + (RESILIENCE_DESC[lastRow[m.key]] || '') + '）。'
      }
      var counts = {}
      inRange.forEach(function (r) { var l = r[m.key]; if (l) counts[l] = (counts[l] || 0) + 1 })
      narrative = inRange.length
        ? '近 ' + inRange.length + ' 天等级分布：' + Object.keys(RESILIENCE_ORD).filter(function (l) { return counts[l] })
            .map(function (l) { return '<span style="color:' + RESILIENCE_COLOR[l] + '">' + RESILIENCE_CN[l] + '</span>×' + counts[l] }).join('，') + '。'
        : '暂无数据。'
    } else {
      var avg = 0, mx = -Infinity, mn = Infinity, mxD = '', mnD = ''
      inRange.forEach(function (r) {
        var v = numOf(r, m)
        avg += v
        if (v > mx) { mx = v; mxD = r.date }
        if (v < mn) { mn = v; mnD = r.date }
      })
      avg = inRange.length ? (avg / inRange.length).toFixed(1) : '—'
      narrative = inRange.length
        ? '最近 ' + inRange.length + ' 天平均 ' + avg + '，最高 ' + mx + '（' + mxD.slice(5) + '）、最低 ' + mn + '（' + mnD.slice(5) + '）。'
        : '暂无数据。'
    }
    var bmin = Infinity, bmax = -Infinity
    inRange.forEach(function (r) { var v = numOf(r, m); if (v < bmin) bmin = v; if (v > bmax) bmax = v })
    var bars = ''
    rows.forEach(function (r, idx) {
      var v = numOf(r, m)
      var h = v == null ? 4 : Math.max(6, Math.round(((v - bmin) / ((bmax - bmin) || 1)) * 100))
      var tip = r.date + (v == null ? '' : '：' + displayOf(r, m))
      var barColor = m.cat && v != null ? ';background:' + RESILIENCE_COLOR[r[m.key]] : ''
      bars += '<div class="pillbar' + (v == null ? ' empty' : '') + '" title="' + tip + '"><div class="bar" style="height:' + h + '%;--i:' + idx + barColor + '"></div><div class="lbl">' + weekdayCN(r.date) + '</div></div>'
    })
    var bigVal = latest
    if (m.cat && lastRow) bigVal = '<span style="font-size:30px;color:' + RESILIENCE_COLOR[lastRow[m.key]] + '">' + latest + '</span>'
    cards += '<div class="mcard" data-key="' + m.key + '">' +
      '<div class="mcard-head">' + icon + '<span class="mcard-name">' + m.name + '</span><span class="mcard-date">' + (lastRow ? lastRow.date.slice(5) : '') + '</span><span class="chev">›</span></div>' +
      '<div class="mcard-body"><div class="mcard-val"><div class="sub">最新</div><div class="big">' + bigVal + '</div></div>' + (sparkSVG(sparkVals, m.color, m.spark) || '') + '</div>' +
      '<div class="mcard-detail">' + (explain ? '<p class="narrative">' + explain + '</p>' : '') + '<p class="narrative">' + narrative + '</p><div class="pillbars">' + bars + '</div></div>' +
      '</div>'
  })
  $('#circleRow').innerHTML = circles
  $('#mobCards').innerHTML = cards
  Array.prototype.forEach.call(document.querySelectorAll('.mcard'), function (card) {
    card.querySelector('.mcard-head').onclick = function () { toggleCard(card) }
  })
  Array.prototype.forEach.call(document.querySelectorAll('.circle-item'), function (c) {
    c.onclick = function () {
      var card = document.querySelector('.mcard[data-key="' + c.getAttribute('data-key') + '"]')
      if (!card) return
      toggleCard(card, true)
    }
  })
}

var WORKOUT_CN = { running: '跑步', trail_running: '越野跑', walking: '步行', cycling: '骑行', swim: '游泳', rowing: '划船', yoga: '瑜伽', workout: '通用训练', strength_training: '力量训练', functional_training: '功能训练', tennis: '网球', basketball: '篮球', soccer: '足球', hiking: '徒步', elliptical: '椭圆机', stair_climbing: '爬楼' }
var INTENSITY_CN = { easy: '轻松', moderate: '中等', hard: '高强度' }
var INTENSITY_COLOR = { easy: '#3fb950', moderate: '#f5a623', hard: '#ee0000' }

function isoDayLocal(offsetDays) {
  var d = new Date(Date.now() + offsetDays * 864e5)
  return d.toISOString().slice(0, 10)
}

function loadWorkouts() {
  var panel = $('#workoutPanel'), list = $('#workoutList')
  if (!panel || !list) return
  panel.style.display = 'none'
  api('/api/data/' + UID + '/workout?start_date=' + isoDayLocal(-(DAYS - 1)) + '&end_date=' + isoDayLocal(0))
    .then(function (d) {
      var items = (d && d.data ? d.data : []).slice().reverse()
      if (!items.length) return
      var html = ''
      items.forEach(function (w) {
        var mins = null
        if (w.start_datetime && w.end_datetime) {
          mins = Math.round((new Date(w.end_datetime) - new Date(w.start_datetime)) / 60000)
          if (!(mins > 0)) mins = null
        }
        var meta = []
        if (mins != null) meta.push(mins + ' 分钟')
        if (w.intensity && INTENSITY_CN[w.intensity]) meta.push(INTENSITY_CN[w.intensity])
        if (typeof w.calories === 'number') meta.push(Math.round(w.calories) + ' 千卡')
        if (typeof w.distance === 'number' && w.distance > 0) meta.push((w.distance / 1000).toFixed(1) + ' 公里')
        var name = WORKOUT_CN[w.activity] || String(w.activity || '锻炼').replace(/_/g, ' ')
        var color = INTENSITY_COLOR[w.intensity] || 'var(--fg-subtle)'
        var day = (w.day || (w.start_datetime || '').slice(0, 10) || '').slice(5)
        html += '<div class="wrow"><span class="wdot" style="background:' + color + '"></span>' +
          '<span class="wname">' + name + '</span>' +
          '<span class="wmeta">' + (meta.join(' · ') || '—') + '</span>' +
          '<span class="wdate">' + day + '</span></div>'
      })
      list.innerHTML = html
      $('#workoutDesc').textContent = '近 ' + DAYS + ' 天共 ' + items.length + ' 次 · 圆点颜色代表强度（绿=轻松 / 橙=中等 / 红=高强度）'
      panel.style.display = ''
      // 移动端当前不在趋势页时重新套用 tab 显隐（桌面端 no-op）
      try { if (window.__applyMobTab) window.__applyMobTab(window.__mobTab || 'home', { silent: true }) } catch (e) {}
    })
    .catch(function () {
      // 无 workout 权限或网络失败：安静地隐藏面板
      panel.style.display = 'none'
    })
}

function loadAll() {
  api('/api/data/' + UID + '/summary?days=' + DAYS).then(function (d) {
    var rows = d.days || []
    window.__SUMMARY_ROWS = rows
    window.__PROFILE = d.profile || {}
    renderStats(rows)
    renderCharts(rows)
    renderTable(rows)
    renderMobile(rows)
    loadWorkouts()
  }).catch(function (e) {
    $('#stats').innerHTML = '<div class="card" style="color:var(--red)">加载失败: ' + e.message + '</div>'
    var cc = $('#circleRow'), mc = $('#mobCards')
    if (cc) cc.innerHTML = ''
    if (mc) mc.innerHTML = '<div class="card" style="color:var(--red)">数据加载失败：' + e.message + '　<button class="btn" id="mobRetry">重试</button></div>'
    var rb = $('#mobRetry')
    if (rb) rb.onclick = function () { loadAll() }
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
  $('#miSettings').onclick = function () { closeMenu(); settingsModal.classList.add('open'); renderAliases(); renderUserKeys() }
  $('#miHelp').onclick = function () { closeMenu(); window.open('/help', '_blank', 'noopener') }
  $('#settingsClose').onclick = closeSettings
  settingsModal.addEventListener('click', function (e) { if (e.target === settingsModal) closeSettings() })

  function renderUserKeys() {
    var box = $('#userKeyList')
    if (!box) return
    api('/api/users').then(function (d) {
      box.innerHTML = ''
      var users = d.users || []
      if (!users.length) { box.innerHTML = '<p class="subtle" style="font-size:12px;margin:0">暂无已接入用户</p>'; return }
      users.forEach(function (u) {
        var row = document.createElement('div')
        row.className = 'row'
        row.style.marginBottom = '8px'
        var label = makeUserLabel(u)
        var input = document.createElement('input')
        input.className = 'invite-input'
        input.readOnly = true
        input.value = u.userKey || '未生成'
        var copy = document.createElement('button')
        copy.textContent = '复制'
        copy.disabled = !u.userKey
        copy.onclick = function () {
          navigator.clipboard.writeText(u.userKey).then(function () {
            var old = copy.textContent
            copy.textContent = '已复制 ✓'
            setTimeout(function () { copy.textContent = old }, 1200)
          })
        }
        var gen = document.createElement('button')
        gen.textContent = u.userKey ? '重新生成' : '生成'
        gen.onclick = function () {
          if (u.userKey && !confirm('重新生成后旧 Key 立即失效，确定？')) return
          gen.disabled = true
          api('/api/connections/' + u.id + '/key', { method: 'POST' }).then(function (r) {
            u.userKey = r.userKey
            input.value = r.userKey
            copy.disabled = false
            gen.textContent = '重新生成'
            gen.disabled = false
          }).catch(function (e) {
            gen.disabled = false
            alert('生成失败: ' + e.message)
          })
        }
        row.appendChild(label)
        row.appendChild(input)
        row.appendChild(copy)
        row.appendChild(gen)
        box.appendChild(row)
      })
    })
  }

  function renderAliases() {
    var box = $('#aliasList')
    if (!box) return
    api('/api/users').then(function (d) {
      box.innerHTML = ''
      var users = d.users || []
      if (!users.length) { box.innerHTML = '<p class="subtle" style="font-size:12px;margin:0">暂无已接入用户</p>'; return }
      users.forEach(function (u) {
        var row = document.createElement('div')
        row.className = 'row'
        row.style.marginBottom = '8px'
        var label = makeUserLabel(u)
        var input = document.createElement('input')
        input.className = 'invite-input'
        input.placeholder = '备注名，如：我 / 老婆'
        input.maxLength = 24
        input.value = u.alias || ''
        var btn = document.createElement('button')
        btn.textContent = '保存'
        btn.onclick = function () {
          btn.disabled = true
          api('/api/connections/' + u.id + '/alias', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ alias: input.value }),
          }).then(function (r) {
            btn.textContent = '已保存 ✓'
            USERS.forEach(function (x) { if (x.id === u.id) x.alias = r.alias || undefined })
            setCurrent(UID)
            setTimeout(function () { btn.textContent = '保存'; btn.disabled = false }, 1200)
          }).catch(function (e) {
            btn.textContent = '保存'
            btn.disabled = false
            alert('保存失败: ' + e.message)
          })
        }
        row.appendChild(label)
        row.appendChild(input)
        row.appendChild(btn)
        box.appendChild(row)
      })
    })
  }

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
    if (C1 || C2 || C3 || C4 || C6 || C7 || HY) loadAll()
  }

  var mobTab = 'home'
  function moveInd() {
    var ind = document.querySelector('.tab-ind')
    var bar = document.getElementById('tabbar')
    var btn = document.querySelector('#tabbar button.active')
    if (!ind || !bar || !btn) return
    var br = bar.getBoundingClientRect(), b = btn.getBoundingClientRect()
    if (!b.width) return
    ind.style.width = b.width + 'px'
    ind.style.transform = 'translateX(' + (b.left - br.left - 7) + 'px)'
  }
  function applyMobTab(t, opts) {
    var switching = !(opts && opts.silent)
    mobTab = t
    window.__mobTab = t
    var mobile = window.matchMedia('(max-width: 720px)').matches
    var home = $('#mobHome'), chartsW = $('#chartsWrap'), explorer = $('#explorerPanel'), toolbar = document.querySelector('.toolbar')
    var workoutP = $('#workoutPanel')
    if (!mobile) {
      if (home) home.style.display = ''
      if (chartsW) chartsW.style.display = ''
      if (explorer) explorer.style.display = ''
      if (toolbar) toolbar.style.display = ''
      // workoutPanel 的显隐由 loadWorkouts 按数据有无决定，桌面端不在这里干预
      return
    }
    // 移动端滚动会使浏览器收缩/展开地址栏并触发 resize：
    // 由 resize 触发时（silent）绝不能 scrollTo 或重放入场动画，否则页面一滚动就被拉回顶部造成抖动
    if (switching) window.scrollTo(0, 0)
    if (home) home.style.display = t === 'home' ? '' : 'none'
    if (chartsW) chartsW.style.display = t === 'trend' ? '' : 'none'
    if (toolbar) toolbar.style.display = t === 'trend' ? '' : 'none'
    if (explorer) explorer.style.display = t === 'explore' ? '' : 'none'
    if (workoutP) workoutP.style.display = t === 'trend' ? '' : 'none'
    var el = t === 'home' ? home : (t === 'trend' ? chartsW : explorer)
    if (switching && el) { el.classList.remove('tab-anim'); void el.offsetWidth; el.classList.add('tab-anim') }
    moveInd()
    if (t === 'trend') {
      setTimeout(function () {
        ;[C1, C2, C3, C4, C6, C7, HY].forEach(function (c) { try { if (c) c.resize() } catch (e) {} })
      }, 60)
    }
  }
  Array.prototype.forEach.call(document.querySelectorAll('#tabbar button'), function (b) {
    b.onclick = function () {
      Array.prototype.forEach.call(document.querySelectorAll('#tabbar button'), function (x) { x.classList.remove('active') })
      b.classList.add('active')
      applyMobTab(b.getAttribute('data-tab'))
    }
  })
  window.__applyMobTab = applyMobTab
  window.addEventListener('resize', function () { applyMobTab(mobTab, { silent: true }) })
  applyMobTab('home')

  function setCurrent(uid) {
    UID = uid
    var u = null
    for (var i = 0; i < USERS.length; i++) { if (USERS[i].id === uid) { u = USERS[i]; break } }
    var name = u ? (u.alias || u.email || u.id.slice(0, 8)) : '—'
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
      label.textContent = u.alias || u.email || u.id.slice(0, 8)
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
      data: { labels: labels, datasets: [{ label: field, data: vals, borderColor: '#0070f3', backgroundColor: areaFill('#0070f3', 0.22), borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 4, tension: 0.3, spanGaps: true, fill: true }] },
      options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
        scales: { x: { grid: { color: gridColor }, ticks: { color: tickColor, maxTicksLimit: tickLimit(), maxRotation: 0 } },
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
