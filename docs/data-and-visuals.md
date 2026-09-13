# Oura API v2 数据盘点与可视化设计

> 依据 Oura 官方 OpenAPI 规范（https://api.ouraring.com/v2/docs，openapi-1.37.json）整理。
> 本文记录「API 里有哪些数据 → 哪些适合展示 → 用什么图表/交互」。

## 一、API 数据盘点（/v2/usercollection/*）

| 端点 | 关键字段 | 单位/取值 | 看板现状 |
| --- | --- | --- | --- |
| `daily_sleep` | score、contributors（deep_sleep / rem_sleep / efficiency / latency / restfulness / timing / total_sleep） | 0–100 贡献分 | ✅ 已展示评分 |
| `sleep`（睡眠分期） | bedtime_start/end、deep/rem/light_sleep_duration、awake_time、total_sleep_duration、time_in_bed、efficiency、latency、average_hrv、heart_rate{interval,items}、lowest_heart_rate、average_breath、restless_periods、**sleep_phase_5_min**、type | 秒；1=深睡 2=浅睡 3=REM 4=清醒 | ⚠️ 仅用其算静息心率 |
| `daily_readiness` | score、contributors（hrv_balance / resting_heart_rate / body_temperature / sleep_balance / activity_balance / …）、temperature_deviation | 0–100 | ✅ 已展示 |
| `daily_activity` | score、steps、active_calories、total_calories、target_calories、average_met_minutes、high/medium/low_activity_time、resting_time、inactivity_alerts、equivalent_walking_distance、contributors、class_5_min | 秒/千卡/MET | ⚠️ 仅评分 |
| `daily_stress` | stress_high、recovery_high、day_summary（restored/normal/stressful） | 秒；枚举 | ❌ 未展示 |
| `daily_resilience` | contributors（sleep_recovery / daytime_recovery / stress）、level（limited/adequate/solid/strong/exceptional） | 0–100；枚举（新版无总分字段） | ❌ 未展示 |
| `daily_spo2` | spo2_percentage.average、breathing_disturbance_index | %；0–100 | ❌ 未展示 |
| `daily_cardiovascular_age` | vascular_age、pulse_wave_velocity | 岁（18–100）；m/s | ❌ 未展示 |
| `vo2_max` | vo2_max | ml/kg/min | ❌ 未展示 |
| `heartrate` | bpm、source（awake/workout/rest/sleep/live/session） | 次/分 | ⚠️ 仅 MCP 实时心率 |
| `sleep_time` | optimal_bedtime{start_offset,end_offset}、recommendation、status | 相对午夜秒数 | ❌ 未展示 |
| `workout` | activity、intensity（easy/moderate/hard）、calories、distance、start/end_datetime、source | 千卡/米 | ❌ 未展示 |
| `session` | type、mood、start/end_datetime、heart_rate、heart_rate_variability | — | ❌ 未展示 |
| `personal_info` | age、weight、height、biological_sex、email | — | ⚠️ 仅 email |
| `ring_configuration` / `ring_battery_level` | 固件、电池 | — | ❌ |
| `tag` / `enhanced_tag` / `rest_mode_period` | 生活标签、休息模式 | — | ❌ |

> 注意：新版规范中 `daily_sleep` 只返回贡献因子分值，**睡眠分期时长都在 `sleep` 端点**（看板已在拉取）。

## 二、选型：适合展示的数据（按价值排序）

1. **睡眠结构**（深睡/REM/浅睡/清醒时长）——睡眠质量最直观的构成，看板已在拉取 `sleep`，零额外请求成本。
2. **眠动图（Hypnogram）**——单晚 5 分钟分辨率的分期瀑布图，Oura App 的招牌图，未被任何第三方看板广泛复刻。
3. **压力与恢复**（stress_high vs recovery_high + day_summary）——每天的「压力/恢复时间」对比是压力数据最易读的表达。
4. **睡眠节奏**（bedtime_start→end 的睡眠窗口）——判断作息规律性的关键，水平浮动条 + 正午到正午时间轴。
5. **新增指标卡**：血氧（SpO2 均值）、韧性（level）、血管年龄（vs 实际年龄，来自 personal_info.age）、VO2 max。
6. **最近锻炼列表**（类型/强度/时长/消耗/距离）——活动数据的落地呈现。
7. 暂不做（记录为候选）：活动/恢复度贡献因子雷达图、sleep_time 推荐就寝窗口叠加、session 冥想记录。

## 三、图表与交互设计

### 1. 睡眠结构（新增，柱状堆叠图）
- **图**：每天一根堆叠柱（深睡 indigo / REM cyan / 浅睡 淡蓝 / 清醒 灰），Y 轴小时；顶部细线标注总睡眠。
- **交互**：tooltip 显示各阶段 h:mm、睡眠时长、效率；**点击柱子 → 下方眠动图切换到那一晚**；hover 高亮选中夜。

### 2. 眠动图（新增，阶梯面积图）
- **图**：x = 入睡后时钟时间（HH:MM），y = 清醒/REM/浅睡/深睡（深睡在底部）；阶梯线按分期着色 + 轻填充。
- **信息**：面板头部显示「入睡 → 醒来 · 总睡眠 h:mm · 效率 % · 平均 HRV」。
- **交互**：默认显示最近一晚；点击睡眠结构柱切换；数据缺失时显示占位提示。

### 3. 压力与恢复（新增，双向柱状图）
- **图**：每日两根反向柱——向上红色 = 高压力时长（分钟），向下绿色 = 恢复时长（分钟）。
- **交互**：tooltip 显示分钟数与当日总结（已恢复/正常/高压日）。

### 4. 睡眠节奏（新增，水平浮动条）
- **图**：x 轴 = 正午 → 次日正午（12/15/18/21/0/3/6/9/12），y = 日期（最近在上）；每行一根浮动条 = 当晚入睡→醒来窗口。
- **交互**：tooltip 显示入睡/醒来时刻（按戒指自身时区解析，不受查看者时区影响）与时长；条高随天数自适应。

### 5. 指标卡扩展（4 张新卡）
- 血氧：spo2_percentage.average（%），7 天 sparkline。
- 韧性：level 中文化（有限/充足/稳固/强/卓越），sparkline 用等级序数 1–5。
- 血管年龄：vascular_age（岁），sub 行显示与实际年龄差（低为好，绿色）；需要 personal_info.age（走缓存）。
- VO2 max：最新值 + sparkline。
- 全部沿用现有 delta（较前 7 天）逻辑，方向按指标定义 good 方向（血管年龄/静息心率向下为好）。

### 6. 移动端
- 圆环行追加 4 个新指标（横向滚动已有）；新增 4 张可展开卡片（韧性卡片用等级序数画 pillbar，tooltip 展示等级名）。
- 趋势页自动包含全部新图表；锻炼列表放在趋势页底部。

### 7. 后端改动（/api/data/:userId/summary）
- `SUMMARY_ENDPOINTS` 增加 `daily_stress`、`daily_spo2`、`daily_resilience`、`daily_cardiovascular_age`、`vo2_max`（全部走 KV 缓存，cron 预取同步覆盖）。
- summary 行新增字段：`deep/rem/light/awake/efficiency`（睡眠，秒→前端格式化）、`bedStartH/bedEndH`（正午起算的小时数，按 ISO 自带时区偏移计算）、`stressHigh/recoveryHigh/stressSummary`、`spo2`、`resilienceLevel`、`vascularAge`、`vo2max`；响应新增 `profile.age`。
- MCP `get_daily_summary` / `get_today_overview` 透传新字段（附带 age 便于解读血管年龄）。

## 四、数据可靠性
- 全部新数据走既有 `fetchCachedPaged` 缓存通道；**summary 对单个端点失败做了容错**（`Promise.all` 内 try/catch → 跳过该端点），新 scope 未授权时看板其他功能不受影响。
- 眠动图数据（`sleep_phase_5_min`）已随 `sleep` 端点并入 summary 行（`hypno` 字段），前端点击切换零延迟。
- 血管年龄对照的 age 来自 `personal_info`（scope `personal` 已覆盖）。

## 五、实测发现（真实 token 验证 + 官方规范比对）

1. **Scope 变化**：Oura 现行 scope 为 `spo2`、`stress`（韧性 daily_resilience 需要）、`heart_health`（daily_cardiovascular_age 需要）；仓库原配置的 `spo2Daily` 已失效（实测 401 "Token is not authorized access spo2 scope"）。`daily_stress` 归属 `daily` scope（实测可用）。已把 DEFAULT_SCOPE / wrangler.toml 更新为 `personal daily heartrate workout session spo2 stress heart_health email`；**存量用户需重新授权** 才能拿到血氧/韧性/心血管年龄数据，未授权时看板对应卡片显示「—」。
2. **vo2_max 路径**：官方规范路径为 `/v2/usercollection/vO2_max`（大写 O），小写实测 404，已修正白名单映射。
3. **新版 daily_sleep 已精简**：只有 score + contributors（贡献分），分期时长/就寝窗口/眠动图都在 `sleep` 端点（实测确认：deep/rem/light_sleep_duration、bedtime_start/end、sleep_phase_5_min、efficiency、average_hrv 等齐全）。
4. **时区**：bedtime_start/end 自带 ISO 偏移（如 +08:00）；睡眠节奏图的小时数在后端按「时间戳自身时区 + 锚定日前一日正午」预计算（bedStartH/bedEndH），不受查看者浏览器时区影响。


## 六、实现状态（2026-09-13）

以上设计已全部落地并验证：

- 后端（commit `bb9956d`）：`SUMMARY_ENDPOINTS` 扩至 9 端点、逐端点容错合并、`profile.age`、`vO2_max` 路径修正、新默认 scope（`spo2 stress heart_health`）。
- 前端图表（commit `b4edb24`）：睡眠结构堆叠柱（点击切眠动图）、5 分钟眠动图（分段着色阶梯图 + 入睡/总睡眠/效率/HRV 摘要行）、压力与恢复双向柱、睡眠节奏通栏浮动条（正午→正午轴、最近在顶部）。
- 前端卡片与移动端（commit `3c57a97`）：9 张指标卡（韧性显示等级名与分布、血管年龄 delta 对比实际年龄）、移动端 9 圆环 + 全指标卡、最近锻炼列表（强度圆点）、明细表新增血氧/VO2/血管年龄列。
- 验证方式：真实 token 逐端点核对官方 OpenAPI 规范（v1.37）；浏览器（1280px 桌面 + 390px 移动）对真实 `dashboardPage()` 输出做交互验证（点击切换眠动图、tooltip、主题切换、tab 切换、范围切换）；本地 `wrangler dev` + KV 种子数据对真实 Worker 后端做 summary 端到端联调（字段、profile.age、容错）。
