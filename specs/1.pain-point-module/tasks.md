# 痛点模块 — 任务清单

## 任务版本

| 日期       | 版本 | 说明     |
| ---------- | ---- | -------- |
| 2026-07-04 | v1   | 初始任务 |

## 项目信息

- 项目名: pain-radar
- 架构类型: Turborepo monorepo
- specs 路径: specs/1.pain-point-module/

## 任务列表

### 功能 1: 痛点录入（F-001, F-002）

- [ ] T-001: 新增 PainPoint Prisma 模型（text + createdAt）并执行 migration ~15min
- [ ] T-002: tRPC `painPoint.create` mutation，含 zod 非空/长度校验 ~15min
- [ ] T-003: 首页捕获表单接入 create mutation（成功清空+toast、失败提示、提交中禁用按钮） ~30min

### 功能 2: 痛点浏览与搜索（F-003, F-004）

- [ ] T-004: tRPC `painPoint.list` query，支持可选 search 模糊匹配、时间倒序 ~15min
- [ ] T-005: 痛点库列表接入真实数据（相对时间格式化、空状态、加载态、统计卡「总记录」） ~30min
- [ ] T-006: 搜索框受控 + 300ms 防抖联动 list 查询 ~15min

### 集成与测试

- [ ] T-007: 联调验证：起 server+web，走通「录入 → 库中可见 → 搜索过滤 → 清空恢复」全链路，核对 AC-001~AC-005 ~15min

## 依赖关系

- T-002 依赖 T-001
- T-003 依赖 T-002
- T-004 依赖 T-001
- T-005 依赖 T-004
- T-006 依赖 T-005
- T-007 依赖 T-003、T-006

## 风险点

- 本地 PostgreSQL 未启动或 DATABASE_URL 未配置会阻塞 T-001 迁移 → 先检查 packages/env 与 .env，必要时提示用户提供数据库
- 前端移除 mock 后，`lib/pain-points.ts` 中仍被引用的 `clusterCard` 需保留，避免误删导致编译失败
- 相对时间函数注意时区（使用本地时区即可，展示层无跨时区需求）
