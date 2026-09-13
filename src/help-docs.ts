import { esc, shell } from './dashboard'

/** 使用文档页：侧边目录 + 滚动高亮、阅读进度、步骤条、提示块、FAQ 手风琴 */
export function helpPage(origin: string): string {
  const toc = [
    ['start', '🚀', '快速上手'],
    ['metrics', '📏', '指标说明'],
    ['charts', '📊', '图表与交互'],
    ['mobile', '📱', '移动端'],
    ['sync', '🔄', '数据同步'],
    ['settings', '⚙️', '设置与权限'],
    ['ai', '🤖', 'AI 助手（MCP）'],
    ['faq', '❓', '常见问题'],
  ]
  return shell(
    'Oura Dashboard — 使用文档',
    `<style>
/* ---- 文档页专属样式（配合 BASE_CSS 主题变量） ---- */
html { scroll-behavior: smooth; scroll-padding-top: 78px }
.hd-progress { position: fixed; top: 0; left: 0; height: 2px; width: 0;
  background: linear-gradient(90deg, var(--accent), #50e3c2); z-index: 60; transition: width .1s linear }
.hd-hero { padding: 34px 0 26px; border-bottom: 1px solid var(--border); margin-bottom: 26px }
.hd-hero h1 { font-size: 26px; margin: 0 0 8px; letter-spacing: -.02em }
.hd-hero p { margin: 0; color: var(--fg-muted); font-size: 14px; line-height: 1.8; max-width: 720px }
.hd-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px }
.hd-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px;
  border: 1px solid var(--border-strong); background: var(--surface-2); font-size: 12px; color: var(--fg-muted) }
.hd-badge b { color: var(--fg); font-weight: 600 }
.hd-layout { display: grid; grid-template-columns: 216px minmax(0, 1fr); gap: 30px; align-items: start }
.hd-toc { position: sticky; top: 78px; display: flex; flex-direction: column; gap: 2px }
.hd-toc a { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 8px;
  font-size: 13px; color: var(--fg-muted); border-left: 2px solid transparent; transition: all .15s }
.hd-toc a:hover { color: var(--fg); background: var(--surface-2) }
.hd-toc a.active { color: var(--fg); background: var(--surface-2); border-left-color: var(--accent); font-weight: 500 }
.hd-sec { margin-bottom: 26px }
.hd-sec > h2 { display: flex; align-items: center; gap: 10px; font-size: 17px; margin: 0 0 4px; letter-spacing: -.01em }
.hd-num { display: inline-flex; align-items: center; justify-content: center; min-width: 26px; height: 26px;
  padding: 0 7px; border-radius: 8px; background: var(--surface-2); border: 1px solid var(--border-strong);
  font-size: 12px; color: var(--fg-muted); font-family: ui-monospace,SFMono-Regular,Menlo,Consolas,monospace }
.hd-sec > .desc { margin-bottom: 16px }
.hd-table { border: 1px solid var(--border); border-radius: 12px; overflow: auto; background: var(--surface) }
.hd-table table { border: none; margin: 0 }
.hd-table th { position: sticky; top: 0; background: var(--surface-2); border-bottom: 1px solid var(--border-strong); white-space: nowrap }
.hd-table td { padding: 11px 12px; vertical-align: top; line-height: 1.7 }
.hd-table tbody tr { transition: background .12s }
.hd-table tbody tr:hover { background: var(--hover-bg) }
.hd-table td:first-child { font-weight: 500; white-space: nowrap }
.h-callout { display: flex; gap: 10px; border: 1px solid var(--border); border-left-width: 3px;
  border-radius: 12px; padding: 12px 16px; font-size: 13px; line-height: 1.75; margin-top: 14px }
.h-callout .ico { flex: none; font-size: 15px; line-height: 1.5 }
.h-callout b { font-weight: 600 }
.h-warn { border-left-color: var(--amber); background: rgba(245,166,35,.07) }
.h-tip { border-left-color: var(--accent); background: rgba(0,112,243,.06) }
.hd-steps { position: relative; margin: 0; padding: 0; list-style: none }
.hd-step { position: relative; display: flex; gap: 14px; padding-bottom: 22px }
.hd-step:last-child { padding-bottom: 0 }
.hd-step::before { content: ''; position: absolute; left: 14px; top: 30px; bottom: 2px; width: 2px;
  background: var(--border); }
.hd-step:last-child::before { display: none }
.hd-step-n { position: relative; z-index: 1; flex: none; width: 29px; height: 29px; border-radius: 50%;
  background: var(--surface-2); border: 1px solid var(--border-strong); color: var(--fg);
  display: inline-flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600;
  font-family: ui-monospace,SFMono-Regular,Menlo,Consolas,monospace }
.hd-step-body { min-width: 0; padding-top: 3px }
.hd-step-body b { font-size: 14px }
.hd-step-body p { margin: 4px 0 0; font-size: 13px; color: var(--fg-muted); line-height: 1.7 }
.hd-where { display: inline-flex; margin-top: 7px }
.hd-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px }
.hd-card { border: 1px solid var(--border); border-radius: 14px; padding: 15px 17px; background: var(--surface);
  transition: border-color .15s, transform .15s }
.hd-card:hover { border-color: var(--hover-border) }
.hd-card .mono { color: var(--accent); font-size: 12.5px; font-weight: 600 }
.hd-card p { margin: 7px 0 0; font-size: 13px; color: var(--fg-muted); line-height: 1.75 }
.hd-card p b { color: var(--fg); font-weight: 500 }
.hd-lvls { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px }
.hd-lvl { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 999px;
  font-size: 12px; border: 1px solid var(--border-strong); background: var(--surface-2) }
.hd-lvl i { width: 7px; height: 7px; border-radius: 50% }
details.hd-faq { border: 1px solid var(--border); border-radius: 12px; background: var(--surface);
  margin-bottom: 10px; overflow: hidden }
details.hd-faq summary { cursor: pointer; padding: 13px 16px; font-size: 13.5px; font-weight: 500;
  list-style: none; display: flex; align-items: center; gap: 10px }
details.hd-faq summary::-webkit-details-marker { display: none }
details.hd-faq summary::after { content: '+'; margin-left: auto; color: var(--fg-subtle); font-size: 16px;
  transition: transform .2s }
details.hd-faq[open] summary::after { transform: rotate(45deg) }
details.hd-faq[open] summary { border-bottom: 1px solid var(--border) }
details.hd-faq .faq-body { padding: 12px 16px 14px; font-size: 13px; color: var(--fg-muted); line-height: 1.8 }
.hd-top { position: fixed; right: 22px; bottom: 24px; width: 40px; height: 40px; border-radius: 50%;
  border: 1px solid var(--border-strong); background: var(--surface-2); color: var(--fg);
  display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 50;
  opacity: 0; pointer-events: none; transition: opacity .2s, transform .2s; box-shadow: var(--shadow-menu) }
.hd-top.show { opacity: 1; pointer-events: auto }
.hd-top:hover { transform: translateY(-2px); border-color: var(--hover-border) }
@media (max-width: 900px) {
  .hd-layout { display: block }
  .hd-toc { position: sticky; top: 56px; z-index: 5; flex-direction: row; overflow-x: auto;
    background: var(--bg); padding: 10px 0; margin-bottom: 8px; scrollbar-width: none;
    border-bottom: 1px solid var(--border) }
  .hd-toc::-webkit-scrollbar { display: none }
  .hd-toc a { flex: none; border-left: none; border: 1px solid var(--border-strong); padding: 6px 12px }
  .hd-toc a.active { border-color: var(--accent); color: var(--accent) }
  .hd-hero h1 { font-size: 22px }
}
</style>
<div class="hd-progress" id="hdProgress"></div>
<div class="topbar"><div class="topbar-inner">
  <div class="brand"><span class="mark"></span>使用文档</div>
  <button class="icon-btn" id="themeBtn" title="切换深色/浅色主题" aria-label="切换主题">
    <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
    <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
  </button>
  <a class="btn" href="/">← 返回看板</a>
</div></div>

<div class="wrap" style="padding-top:6px">
  <div class="hd-hero">
    <h1>Oura Ring 数据服务 · 使用文档</h1>
    <p>看板怎么看、指标怎么解读、数据什么时候同步、AI 怎么接入 —— 关于这套自托管服务的一切，都在这一页。</p>
    <div class="hd-badges">
      <span class="hd-badge">📖 <b>8</b> 个章节</span>
      <span class="hd-badge">⏱ 约 <b>10</b> 分钟读完</span>
      <span class="hd-badge">🔄 适用版本 <b>2026-09</b></span>
      <span class="hd-badge">🤖 <a href="/mcp-docs" target="_blank" rel="noopener">MCP 接入文档 →</a></span>
    </div>
  </div>

  <div class="hd-layout">
    <nav class="hd-toc" id="hdToc">${toc.map(
      ([id, ico, name]) => `<a href="#${id}" data-sec="${id}"><span>${ico}</span>${name}</a>`,
    ).join('')}</nav>

    <main>
      <section class="hd-sec" id="intro">
        <h2><span class="hd-num">00</span>这是什么</h2>
        <p class="desc" style="line-height:1.85">这是自托管的 <b>Oura Ring 戒指数据服务</b>：把你和家人的 Oura 戒指接入自己的 Cloudflare Worker，提供三样东西 —— ① 一个深浅双主题的<b>健康数据看板</b>（指标卡 + 睡眠结构 / 眠动图 / 压力恢复 / 睡眠节奏等图表）；② 一套<b>数据 API</b>（聚合概览 + Oura v2 全端点代理，带缓存）；③ 一个 <b>MCP 服务器</b>，让 Claude 等 AI 助手直接用自然语言查询你的健康数据。数据存在你自己的 KV 里，不经第三方。</p>
      </section>

      <section class="hd-sec" id="start">
        <h2><span class="hd-num">01</span>🚀 快速上手</h2>
        <p class="desc">从零到看到数据，一共 5 步</p>
        <ol class="hd-steps">
          <li class="hd-step"><span class="hd-step-n">1</span><div class="hd-step-body"><b>登录看板</b><p>输入部署时设置的 ADMIN_KEY 即可进入看板。</p><span class="hd-where"><span class="hd-badge">看板首页</span></span></div></li>
          <li class="hd-step"><span class="hd-step-n">2</span><div class="hd-step-body"><b>连接戒指</b><p>跳转 Oura 登录并同意授权，完成后戒指数据自动开始同步。</p><span class="hd-where"><a class="hd-badge" href="/auth/oura">/auth/oura</a></span></div></li>
          <li class="hd-step"><span class="hd-step-n">3</span><div class="hd-step-body"><b>查看看板</b><p>等第一次同步完成；也可以点右上角菜单 →「同步数据」立即拉取近 30 天数据。</p><span class="hd-where"><span class="hd-badge">看板首页</span></span></div></li>
          <li class="hd-step"><span class="hd-step-n">4</span><div class="hd-step-body"><b>邀请家人</b><p>把授权链接发给家人，用 TA 的 Oura 账号登录同意即可接入；在「设置」里给每个人起备注名（如「我」「老婆」）。</p><span class="hd-where"><span class="hd-badge">看板 → 设置</span></span></div></li>
          <li class="hd-step"><span class="hd-step-n">5</span><div class="hd-step-body"><b>接入 AI</b><p>把服务作为 MCP 服务器接入 Claude 等 AI 助手，之后直接用自然语言问数据。</p><span class="hd-where"><a class="hd-badge" href="/mcp-docs" target="_blank" rel="noopener">/mcp-docs</a></span></div></li>
        </ol>
        <div class="h-callout h-tip"><span class="ico">💡</span><span>Oura 未正式批准的应用最多接入 <b>10 个用户</b>；同步时机与「今天的数据为什么还没有」见下方<a href="#sync" style="color:var(--accent)">数据同步</a>一节。</span></div>
      </section>

      <section class="hd-sec" id="metrics">
        <h2><span class="hd-num">02</span>📏 指标说明</h2>
        <p class="desc">看板顶部有 9 张指标卡，每张显示最新值、7 天趋势和「较前 7 天」环比。箭头颜色代表变化是好是坏（比如静息心率下降是绿色）。悬停卡片标题有同样的提示。</p>
        <div class="hd-table">
        <table>
          <thead><tr><th>指标</th><th>含义</th><th>怎么解读</th></tr></thead>
          <tbody>
            <tr><td>🥱 睡眠评分</td><td>Oura 对昨晚睡眠质量的综合评分（深睡 / REM / 入睡延迟 / 时效等加权）</td><td>≥85 很好 · 70–85 不错 · &lt;60 需要注意</td></tr>
            <tr><td>🔋 恢复度</td><td>身体当前准备好承受压力的程度（HRV、静息心率、体温、睡眠等加权）</td><td>越高越适合训练与高强度日程；低 = 优先休息</td></tr>
            <tr><td>🏃 活动</td><td>达成每日活动目标的程度</td><td>越高越好，70+ 说明当日目标基本达成</td></tr>
            <tr><td>❤️ 静息心率</td><td>睡眠期间平均心率（与 Oura App 口径一致，BPM）</td><td>通常越低越好；连续升高常提示身体在对抗压力或疾病</td></tr>
            <tr><td>〰️ HRV 平衡</td><td>心率变异性与长期基线的比较（贡献分 1–100）</td><td>高于基线 = 恢复良好；持续偏低 = 疲劳 / 压力 / 饮酒等</td></tr>
            <tr><td>🫁 血氧 %</td><td>睡眠期间平均血氧饱和度（SpO2）</td><td>96%+ 常见；频繁偏低可关注呼吸暂停相关信号</td></tr>
            <tr><td>🛡️ 韧性</td><td>身体<b>承受压力并从中恢复的能力</b>（等级制），由睡眠恢复、日间恢复、压力反应三部分评估</td><td>五级：<span class="hd-lvls" style="margin:6px 0 0">
              <span class="hd-lvl"><i style="background:#f87171"></i>有限</span>
              <span class="hd-lvl"><i style="background:#fbbf24"></i>充足</span>
              <span class="hd-lvl"><i style="background:#2dd4bf"></i>稳固</span>
              <span class="hd-lvl"><i style="background:#4ade80"></i>强</span>
              <span class="hd-lvl"><i style="background:#a78bfa"></i>卓越</span></span>
              卡片上的等级条显示当前所处位置</td></tr>
            <tr><td>🩸 血管年龄</td><td>由血管弹性（脉搏波传导速度）估算的「血管相当于多少岁」</td><td><b>低于实际年龄为佳</b>；卡片会直接显示与实际年龄的差值</td></tr>
            <tr><td>🌬️ VO2 max</td><td>最大摄氧量（ml/kg/min）：有氧能力上限</td><td>越高越好，随有氧运动提升较慢但稳定</td></tr>
          </tbody>
        </table>
        </div>
      </section>

      <section class="hd-sec" id="charts">
        <h2><span class="hd-num">03</span>📊 图表与交互</h2>
        <p class="desc">所有折线 / 柱状图都支持：滚轮或双指<b>缩放</b>、按住<b>拖动平移</b>、<b>双击复位</b>、十字准线 + 悬浮明细。右侧「7 / 30 / 90 天」切换器作用于所有图表与指标卡。</p>
        <div class="hd-table">
        <table>
          <thead><tr><th>图表面板</th><th>看什么</th><th>特色交互</th></tr></thead>
          <tbody>
            <tr><td>睡眠 / 恢复度 / 活动</td><td>三大综合评分的每日走势对比</td><td>图例可点按隐藏 / 显示单条线</td></tr>
            <tr><td>静息心率</td><td>睡眠期间平均心率走势</td><td>—</td></tr>
            <tr><td>HRV 平衡</td><td>HRV 相对基线的恢复信号</td><td>—</td></tr>
            <tr><td>睡眠结构</td><td>每晚深睡 / REM / 浅睡 / 清醒的堆叠时长（小时）</td><td>悬浮显示各阶段 h:mm + 总睡眠 + 效率；<b>点击柱子</b>，下方眠动图切换到那一晚</td></tr>
            <tr><td>睡眠分期（眠动图）</td><td>单晚 5 分钟分辨率的分期瀑布图（深睡在底部）</td><td>标题行显示入睡 / 醒来时刻、总睡眠、效率、平均 HRV；默认显示最近一晚</td></tr>
            <tr><td>压力与恢复</td><td>每日高压力时长（红色向上）vs 高恢复时长（绿色向下）</td><td>tooltip 附当日总结：已恢复 / 正常 / 高压日</td></tr>
            <tr><td>睡眠节奏</td><td>每晚入睡→醒来窗口，横轴从正午到次日正午</td><td>一眼看出入睡时间漂移与作息规律</td></tr>
            <tr><td>最近锻炼</td><td>类型 / 时长 / 强度 / 消耗 / 距离</td><td>圆点颜色 = 强度（绿轻松 / 橙中等 / 红高强度）</td></tr>
          </tbody>
        </table>
        </div>
        <div class="h-callout h-tip"><span class="ico">🧭</span><span>底部还有「<b>原始数据探索器</b>」：选择任意 Oura 端点与日期范围，自动识别数值字段绘图，也可切换查看原始 JSON。</span></div>
      </section>

      <section class="hd-sec" id="mobile">
        <h2><span class="hd-num">04</span>📱 移动端</h2>
        <p class="desc">手机访问时看板自动切换为 App 式布局</p>
        <div class="hd-table">
        <table>
          <thead><tr><th>区域</th><th>说明</th></tr></thead>
          <tbody>
            <tr><td>圆形指标环</td><td>顶部横向滚动，9 个指标一目了然；点击某个环会展开对应卡片</td></tr>
            <tr><td>指标卡</td><td>点卡片头部展开详情：韧性显示等级说明与 30 天等级分布，其余显示统计叙述 + 逐日彩色柱状图</td></tr>
            <tr><td>底部导航</td><td>摘要（卡片）/ 趋势（全部图表）/ 探索（原始数据）三个页签</td></tr>
            <tr><td>体验细节</td><td>加载骨架屏、滚动防抖动、图表为窄屏优化刻度</td></tr>
          </tbody>
        </table>
        </div>
      </section>

      <section class="hd-sec" id="sync">
        <h2><span class="hd-num">05</span>🔄 数据同步</h2>
        <p class="desc">数据从 Oura 云端来，到你的 KV 缓存去 —— 三个同步时机</p>
        <div class="hd-table">
        <table>
          <thead><tr><th>时机</th><th>说明</th></tr></thead>
          <tbody>
            <tr><td>⏰ 每小时定时任务</td><td>自动刷新所有用户的 token，并预取昨日+今日概览（平时打开看板都是秒出的缓存数据）</td></tr>
            <tr><td>⚡ Oura Webhook 推送</td><td>Oura 侧有新数据时通知本服务标记「待刷新」，下次任务优先补齐（需订阅 webhook）</td></tr>
            <tr><td>👆 手动同步</td><td>看板 → 右上角菜单 →「同步数据」，立即拉取近 N 天全量概览</td></tr>
          </tbody>
        </table>
        </div>
        <div class="h-callout h-tip"><span class="ico">🛌</span><span><b>为什么「今天」的数据还没有？</b>睡眠 / 恢复度需要你打开 Oura App 让戒指同步后才会生成（通常在早晨）；活动与压力会在当天后台逐步更新。缓存分别保留 5–60 分钟，过期自动回源。</span></div>
        <div class="h-callout h-warn"><span class="ico">🔑</span><span><b>关于授权 scope（2026-09 变更）：</b>血氧为 <code>spo2</code>，韧性需要 <code>stress</code>，心血管年龄需要 <code>heart_health</code>。<b>旧用户重新走一次 <a href="/auth/oura">/auth/oura</a> 授权</b>即可点亮这三类数据；未重新授权时对应卡片显示「—」，其余功能不受影响。</span></div>
      </section>

      <section class="hd-sec" id="settings">
        <h2><span class="hd-num">06</span>⚙️ 设置与权限</h2>
        <p class="desc">看板 → 右上角菜单 →「设置」</p>
        <div class="hd-table">
        <table>
          <thead><tr><th>设置项</th><th>说明</th></tr></thead>
          <tbody>
            <tr><td>邀请用户授权</td><td>把授权链接发给家人，TA 登录 Oura 同意后即接入（最多 10 人）</td></tr>
            <tr><td>用户备注名</td><td>给每个人起名（如「我」「老婆」）。看板切换用户与 AI 查询时都用它定位 —— 设了备注名后对 AI 说「查老婆的数据」就能精准命中</td></tr>
            <tr><td>个人数据 Key</td><td>为某个用户生成独立 Key。用这个 Key（API 或 MCP）<b>只能查询 TA 自己的数据</b>、看不到别人也改不了设置 —— 适合直接交给对应的人</td></tr>
            <tr><td>断开用户</td><td>菜单 →「断开此用户」：删除 token 与全部缓存数据</td></tr>
          </tbody>
        </table>
        </div>
      </section>

      <section class="hd-sec" id="ai">
        <h2><span class="hd-num">07</span>🤖 AI 助手（MCP）</h2>
        <p class="desc">把本服务接入 Claude 等 AI 助手后，直接用大白话查数据，不用看图表。接入方式：<b><a href="/mcp-docs" target="_blank" rel="noopener">打开 MCP 接入文档 →</a></b>（含 Claude Code 一条命令、Claude Desktop JSON 配置、给 Agent 的一键复制 Prompt）。四个工具分别适合这些问题：</p>
        <div class="hd-cards">
          <div class="hd-card"><span class="mono">get_today_overview</span><p><b>「我今天的恢复度怎么样？现在心率多少？」</b>今日概览 + 实时心率，附昨日对照。</p></div>
          <div class="hd-card"><span class="mono">get_daily_summary</span><p><b>「对比一下我和老婆这周的睡眠」</b>全量每日概览：评分之外还有睡眠结构、眠动图、压力、血氧、韧性、血管年龄、VO2 max。</p></div>
          <div class="hd-card"><span class="mono">list_users</span><p><b>「家里都接入了谁？」</b>列出用户（备注名 / 邮箱），AI 用它精准定位要查的人。</p></div>
          <div class="hd-card"><span class="mono">get_oura_data</span><p><b>「把昨晚的原始心率曲线给我」</b>任意 Oura 端点的原始数据。</p></div>
        </div>
        <div class="h-callout h-tip"><span class="ico">💡</span><span>多人家庭务必先在设置里填好<b>备注名</b>；给 AI 用<b>个人数据 Key</b> 可以限定它只能看某一个人的数据。</span></div>
      </section>

      <section class="hd-sec" id="faq">
        <h2><span class="hd-num">08</span>❓ 常见问题</h2>
        <details class="hd-faq"><summary>卡片 / 图表一直是空的</summary><div class="faq-body">先完成 <a href="/auth/oura">/auth/oura</a> 授权；或 Oura 数据尚未生成（打开 App 同步戒指）；或点菜单「同步数据」强制拉取。</div></details>
        <details class="hd-faq"><summary>血氧 / 韧性 / 血管年龄显示「—」</summary><div class="faq-body">这三类需要 2026-09 的新 scope（spo2 / stress / heart_health），重新走一次 <a href="/auth/oura">/auth/oura</a> 授权即可，其余功能不受影响。</div></details>
        <details class="hd-faq"><summary>Oura 授权报 400 invalid_request</summary><div class="faq-body">Oura 后台配置的 Redirect URI 与实际回调地址不一致 —— 协议、域名、路径必须逐字一致，去 Oura 开发者后台核对。</div></details>
        <details class="hd-faq"><summary>API / MCP 返回 401 unauthorized</summary><div class="faq-body">ADMIN_KEY 或个人 Key 不对；Header 需为「Authorization: Bearer 密钥」格式。</div></details>
        <details class="hd-faq"><summary>数据会经过别人的服务器吗</summary><div class="faq-body">不会。数据只在 Oura 云与你自己的 Worker / KV 之间流转；AI 查询走你部署的 MCP 端点，用你自己的密钥鉴权。</div></details>
        <details class="hd-faq"><summary>想看更底层的接入细节</summary><div class="faq-body">见 <a href="/mcp-docs">MCP 接入文档</a> 与 GitHub 仓库的 README（含部署、API、缓存策略说明）。</div></details>
      </section>

      <p class="subtle center" style="margin-top:10px">${esc(origin)} · Oura Dashboard 使用文档</p>
    </main>
  </div>
</div>
<button class="hd-top" id="hdTop" title="回到顶部" aria-label="回到顶部">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
</button>
<script>
(function () {
  function apply(t) {
    document.documentElement.setAttribute('data-theme', t)
    try { localStorage.setItem('oura_theme', t) } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.content = t === 'light' ? '#ffffff' : '#000000'
  }
  var themeBtn = document.getElementById('themeBtn')
  if (themeBtn) themeBtn.onclick = function () {
    apply(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light')
  }
  // 阅读进度 + 返回顶部
  var bar = document.getElementById('hdProgress')
  var topBtn = document.getElementById('hdTop')
  function onScroll() {
    var h = document.documentElement
    var max = h.scrollHeight - h.clientHeight
    if (bar) bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%'
    if (topBtn) topBtn.classList.toggle('show', h.scrollTop > 500)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  if (topBtn) topBtn.onclick = function () { window.scrollTo({ top: 0, behavior: 'smooth' }) }
  // 目录滚动高亮（scroll-spy）
  var links = Array.prototype.slice.call(document.querySelectorAll('#hdToc a'))
  var byId = {}
  links.forEach(function (a) { byId[a.getAttribute('data-sec')] = a })
  function setActive(id) {
    links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-sec') === id) })
    var act = document.querySelector('#hdToc a.active')
    if (act && act.scrollIntoView) act.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }
  if ('IntersectionObserver' in window) {
    var current = ''
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { current = en.target.id }
      })
      if (current) setActive(current)
    }, { rootMargin: '-78px 0px -65% 0px', threshold: 0 })
    Array.prototype.forEach.call(document.querySelectorAll('section.hd-sec'), function (s) { io.observe(s) })
  }
})()
</script>`,
  )
}
