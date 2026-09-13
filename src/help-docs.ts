import { esc, shell } from './dashboard'

export function helpPage(origin: string): string {
  return shell(
    'Oura Dashboard — 使用文档',
    `<div class="topbar"><div class="topbar-inner">
  <div class="brand"><span class="mark"></span>使用文档</div>
  <button class="icon-btn" id="themeBtn" title="切换深色/浅色主题" aria-label="切换主题">
    <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
    <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
  </button>
  <a class="btn" href="/">← 返回看板</a>
</div></div>

<div class="wrap">
  <div class="row" id="pageNav" style="margin-bottom:20px">
    <a class="chip" href="#start">🚀 快速上手</a>
    <a class="chip" href="#metrics">📏 指标说明</a>
    <a class="chip" href="#charts">📊 图表与交互</a>
    <a class="chip" href="#mobile">📱 移动端</a>
    <a class="chip" href="#sync">🔄 数据同步</a>
    <a class="chip" href="#settings">⚙️ 设置与权限</a>
    <a class="chip" href="#ai">🤖 AI 助手（MCP）</a>
    <a class="chip" href="#faq">❓ 常见问题</a>
  </div>

  <div class="panel">
    <h2>这是什么</h2>
    <p class="desc" style="font-size:13px;line-height:1.8">这是自托管的 <b>Oura Ring 戒指数据服务</b>：把你和家人的 Oura 戒指接入自己的 Cloudflare Worker，提供三样东西 —— ① 一个深浅双主题的<b>健康数据看板</b>（指标卡 + 睡眠结构/眠动图/压力恢复/睡眠节奏等图表）；② 一套<b>数据 API</b>（聚合概览 + Oura v2 全端点代理，带缓存）；③ 一个 <b>MCP 服务器</b>，让 Claude 等 AI 助手直接用自然语言查询你的健康数据。数据存在你自己的 KV 里，不经第三方。</p>
  </div>

  <div class="panel" id="start">
    <h2>🚀 快速上手</h2>
    <p class="desc">从零到看到数据，一共 5 步</p>
    <div style="overflow:auto">
    <table>
      <tr><th style="width:56px">步骤</th><th>做什么</th><th>在哪做</th></tr>
      <tr><td>1</td><td><b>登录看板</b>：输入部署时设置的 ADMIN_KEY</td><td>看板首页</td></tr>
      <tr><td>2</td><td><b>连接戒指</b>：跳转 Oura 登录并同意授权，完成后戒指数据自动开始同步</td><td><a href="/auth/oura">/auth/oura</a></td></tr>
      <tr><td>3</td><td><b>查看看板</b>：等第一次同步（或点右上角菜单 →「同步数据」立即拉取）</td><td>看板首页</td></tr>
      <tr><td>4</td><td><b>邀请家人</b>：把授权链接发给家人，用 TA 的 Oura 账号登录同意即可接入；在「设置」里给每个人起备注名（如「我」「老婆」）</td><td>看板 → 设置</td></tr>
      <tr><td>5</td><td><b>接入 AI</b>：把服务作为 MCP 服务器接入 Claude 等 AI 助手，之后直接用自然语言问数据</td><td><a href="/mcp-docs">/mcp-docs</a></td></tr>
    </table>
    </div>
    <p class="desc" style="margin:12px 0 0">💡 Oura 未正式批准的应用最多接入 <b>10 个用户</b>；数据同步的细节见下方<a href="#sync">「数据同步」</a>。</p>
  </div>

  <div class="panel" id="metrics">
    <h2>📏 指标说明</h2>
    <p class="desc">看板顶部有 9 张指标卡，每张显示最新值、7 天趋势和「较前 7 天」环比。箭头颜色代表变化是好是坏（比如静息心率下降是绿色）</p>
    <div style="overflow:auto">
    <table>
      <tr><th>指标</th><th>含义</th><th>怎么解读</th></tr>
      <tr><td><b>睡眠评分</b></td><td>Oura 对昨晚睡眠质量的综合评分（深睡/REM/入睡延迟/时效等加权）</td><td>≥85 很好 · 70–85 不错 · &lt;60 需要注意</td></tr>
      <tr><td><b>恢复度</b></td><td>身体当前准备好承受压力的程度（HRV、静息心率、体温、睡眠等加权）</td><td>越高越适合训练与高强度日程；低 = 优先休息</td></tr>
      <tr><td><b>活动</b></td><td>达成每日活动目标的程度</td><td>越高越好，70+ 说明当日目标基本达成</td></tr>
      <tr><td><b>静息心率</b></td><td>睡眠期间平均心率（与 Oura App 口径一致，BPM）</td><td>通常越低越好；连续升高常提示身体在对抗压力或疾病</td></tr>
      <tr><td><b>HRV 平衡</b></td><td>心率变异性与长期基线的比较（贡献分 1–100）</td><td>高于基线 = 恢复良好；持续偏低 = 疲劳/压力/饮酒等</td></tr>
      <tr><td><b>血氧 %</b></td><td>睡眠期间平均血氧饱和度（SpO2）</td><td>96%+ 常见；频繁偏低可关注呼吸暂停相关信号</td></tr>
      <tr><td><b>韧性</b></td><td>身体<b>承受压力并从中恢复的能力</b>（等级制）：由睡眠恢复、日间恢复、压力反应三部分评估</td><td>五级：有限 → 充足 → 稳固 → 强 → 卓越。卡片上的等级条显示当前所处位置；短期能靠规律睡眠与低压力慢慢提升</td></tr>
      <tr><td><b>血管年龄</b></td><td>由血管弹性（脉搏波传导速度）估算的「血管相当于多少岁」</td><td><b>低于实际年龄为佳</b>；卡片会直接显示与实际年龄的差值</td></tr>
      <tr><td><b>VO2 max</b></td><td>最大摄氧量（ml/kg/min）：有氧能力上限</td><td>越高越好，随有氧运动提升较慢但稳定</td></tr>
    </table>
    </div>
    <p class="desc" style="margin:12px 0 0">💡 把鼠标悬停在卡片标题上可以看到同样的提示；血氧 / 韧性 / 血管年龄需要 2026-09 的新 scope（见<a href="#sync">数据同步</a>一节的授权说明）。</p>
  </div>

  <div class="panel" id="charts">
    <h2>📊 图表与交互</h2>
    <p class="desc">所有折线/柱状图都支持：滚轮或双指<b>缩放</b>、按住<b>拖动平移</b>、<b>双击复位</b>、十字准线 + 悬浮明细。右侧「30 天」切换器作用于所有图表与指标卡</p>
    <div style="overflow:auto">
    <table>
      <tr><th>图表面板</th><th>看什么</th><th>特色交互</th></tr>
      <tr><td><b>睡眠 / 恢复度 / 活动</b></td><td>三大综合评分的每日走势对比</td><td>图例可点按隐藏/显示单条线</td></tr>
      <tr><td><b>静息心率</b></td><td>睡眠期间平均心率走势</td><td>—</td></tr>
      <tr><td><b>HRV 平衡</b></td><td>HRV 相对基线的恢复信号</td><td>—</td></tr>
      <tr><td><b>睡眠结构</b></td><td>每晚深睡 / REM / 浅睡 / 清醒的堆叠时长（小时）</td><td>悬浮显示各阶段 h:mm + 总睡眠 + 效率；<b>点击柱子</b>，下方眠动图切换到那一晚</td></tr>
      <tr><td><b>睡眠分期（眠动图）</b></td><td>单晚 5 分钟分辨率的分期瀑布图（深睡在底部）</td><td>标题行显示入睡/醒来时刻、总睡眠、效率、平均 HRV；默认显示最近一晚</td></tr>
      <tr><td><b>压力与恢复</b></td><td>每日高压力时长（红色向上）vs 高恢复时长（绿色向下）</td><td>tooltip 附当日总结：已恢复 / 正常 / 高压日</td></tr>
      <tr><td><b>睡眠节奏</b></td><td>每晚入睡→醒来窗口，横轴从正午到次日正午</td><td>一眼看出入睡时间漂移与作息规律</td></tr>
      <tr><td><b>最近锻炼</b></td><td>类型 / 时长 / 强度 / 消耗 / 距离</td><td>圆点颜色 = 强度（绿轻松 / 橙中等 / 红高强度）</td></tr>
    </table>
    </div>
    <p class="desc" style="margin:12px 0 0">底部还有「<b>原始数据探索器</b>」：选择任意 Oura 端点与日期范围，自动识别数值字段绘图，也可切换查看原始 JSON。</p>
  </div>

  <div class="panel" id="mobile">
    <h2>📱 移动端</h2>
    <p class="desc">手机访问时看板自动切换为 App 式布局</p>
    <div style="overflow:auto">
    <table>
      <tr><th>区域</th><th>说明</th></tr>
      <tr><td><b>圆形指标环</b></td><td>顶部横向滚动，9 个指标一目了然；点击某个环会展开对应卡片</td></tr>
      <tr><td><b>指标卡</b></td><td>点卡片头部展开详情：韧性显示等级说明与 30 天等级分布，其余显示统计叙述 + 逐日彩色柱状图</td></tr>
      <tr><td><b>底部导航</b></td><td>摘要（卡片）/ 趋势（全部图表）/ 探索（原始数据）三个页签</td></tr>
      <tr><td><b>体验细节</b></td><td>加载骨架屏、下拉防抖动、图表为窄屏优化刻度</td></tr>
    </table>
    </div>
  </div>

  <div class="panel" id="sync">
    <h2>🔄 数据同步</h2>
    <p class="desc">数据从 Oura 云端来，到你的 KV 缓存去 —— 三个同步时机</p>
    <div style="overflow:auto">
    <table>
      <tr><th>时机</th><th>说明</th></tr>
      <tr><td><b>每小时定时任务</b></td><td>自动刷新所有用户的 token，并预取昨日+今日概览（平时打开看板都是秒出的缓存数据）</td></tr>
      <tr><td><b>Oura Webhook 推送</b></td><td>Oura 侧有新数据时通知本服务标记「待刷新」，下次任务优先补齐（需在设置后订阅 webhook）</td></tr>
      <tr><td><b>手动同步</b></td><td>看板 → 右上角菜单 →「同步数据」，立即拉取近 N 天全量概览</td></tr>
    </table>
    </div>
    <p class="modal-desc" style="margin:14px 0 0"><b>为什么「今天」的数据还没有？</b>睡眠/恢复度需要你打开 Oura App 让戒指同步后才会生成，通常在早晨；活动与压力会在当天后台逐步更新。缓存分别保留 5–60 分钟，过期自动回源。</p>
    <p class="modal-desc"><b>关于授权 scope：</b>2026-09 起 Oura 调整了授权范围 —— 血氧为 <code>spo2</code>，韧性需要 <code>stress</code>，心血管年龄需要 <code>heart_health</code>。<b>旧用户重新走一次 <a href="/auth/oura">/auth/oura</a> 授权</b>即可点亮这三类数据；未重新授权时对应卡片显示「—」，其余功能不受影响。</p>
  </div>

  <div class="panel" id="settings">
    <h2>⚙️ 设置与权限</h2>
    <p class="desc">看板 → 右上角菜单 →「设置」</p>
    <div style="overflow:auto">
    <table>
      <tr><th>设置项</th><th>说明</th></tr>
      <tr><td><b>邀请用户授权</b></td><td>把授权链接发给家人，TA 登录 Oura 同意后即接入（最多 10 人）</td></tr>
      <tr><td><b>用户备注名</b></td><td>给每个人起名（如「我」「老婆」）。看板切换用户与 AI 查询时都用它定位，设了备注名后对 AI 说「查老婆的数据」就能精准命中</td></tr>
      <tr><td><b>个人数据 Key</b></td><td>为某个用户生成独立 Key。用这个 Key（API 或 MCP）<b>只能查询 TA 自己的数据</b>、看不到别人也改不了设置 —— 适合直接交给对应的人或接入只看一个人的自动化</td></tr>
      <tr><td><b>断开用户</b></td><td>菜单 →「断开此用户」：删除 token 与全部缓存数据</td></tr>
    </table>
    </div>
  </div>

  <div class="panel" id="ai">
    <h2>🤖 AI 助手（MCP）</h2>
    <p class="desc">把本服务接入 Claude 等 AI 助手后，直接用大白话查数据，不用看图表</p>
    <p class="modal-desc"><b>两种接入方式</b>：① Claude Code / CLI：一条命令注册 MCP 服务器；② Claude Desktop / 任意支持 MCP 的客户端：粘贴 JSON 配置。<b><a href="/mcp-docs" target="_blank" rel="noopener">打开 MCP 接入文档 →</a></b>（含一键复制的接入命令与给 Agent 的完整 Prompt）</p>
    <div style="overflow:auto">
    <table>
      <tr><th>工具</th><th>回答什么问题</th></tr>
      <tr><td class="mono">get_today_overview</td><td>「我今天的恢复度怎么样？现在心率多少？」—— 今日概览 + 实时心率，附昨日对照</td></tr>
      <tr><td class="mono">get_daily_summary</td><td>「对比一下我和老婆这周的睡眠」「最近 30 天我的静息心率趋势」—— 全量每日概览（含睡眠结构、眠动图、压力、血氧、韧性、血管年龄、VO2 max）</td></tr>
      <tr><td class="mono">list_users</td><td>AI 先用列出家里都有谁（备注名/邮箱）</td></tr>
      <tr><td class="mono">get_oura_data</td><td>「把昨晚的原始心率曲线给我」—— 任意 Oura 端点原始数据</td></tr>
    </table>
    </div>
    <p class="desc" style="margin:12px 0 0">💡 多人家庭务必先在设置里填好<b>备注名</b>；给 AI 用个人数据 Key 可以限定它只能看某一个人的数据。</p>
  </div>

  <div class="panel" id="faq">
    <h2>❓ 常见问题</h2>
    <div style="overflow:auto">
    <table>
      <tr><th>现象</th><th>处理</th></tr>
      <tr><td>卡片/图表一直是空的</td><td>先完成 <a href="/auth/oura">/auth/oura</a> 授权；或 Oura 数据尚未生成（打开 App 同步戒指）；或点菜单「同步数据」强制拉取</td></tr>
      <tr><td>血氧 / 韧性 / 血管年龄显示「—」</td><td>需要新 scope，重新授权一次（见<a href="#sync">数据同步</a>）</td></tr>
      <tr><td>Oura 授权报 400 invalid_request</td><td>Oura 后台的 Redirect URI 与实际回调地址不一致，逐字核对</td></tr>
      <tr><td>API/MCP 返回 401 unauthorized</td><td>ADMIN_KEY 或个人 Key 不对；Header 需为「Bearer 密钥」</td></tr>
      <tr><td>数据会经过别人的服务器吗</td><td>不会。数据只在 Oura 云与你自己的 Worker/KV 之间流转；AI 查询走你部署的 MCP 端点，用你的密钥鉴权</td></tr>
      <tr><td>想看更底层的接入细节</td><td>见 <a href="/mcp-docs">MCP 接入文档</a> 与 GitHub 仓库的 README</td></tr>
    </table>
    </div>
  </div>

  <p class="subtle center" style="margin-top:8px">${esc(origin)} · Oura Dashboard 使用文档</p>
</div>
<script>
(function () {
  var btn = document.getElementById('themeBtn')
  if (!btn) return
  function apply(t) {
    document.documentElement.setAttribute('data-theme', t)
    try { localStorage.setItem('oura_theme', t) } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.content = t === 'light' ? '#ffffff' : '#000000'
  }
  btn.onclick = function () {
    apply(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light')
  }
})()
</script>`,
  )
}
