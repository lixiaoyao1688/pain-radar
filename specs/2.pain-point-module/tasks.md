# 痛点模块 — 任务清单

## 任务版本

| 日期       | 版本 | 说明     |
| ---------- | ---- | -------- |
| 2026-07-04 | v1   | 初始任务 |

## 项目信息

- 项目名: pain-radar
- 架构类型: Turborepo monorepo
- specs 路径: specs/2.pain-point-module/

## 任务列表

### 功能 1: 痛点录入（F-001, F-002）

- [ ] T-001: PainPoint Prisma 模型（text/userId/createdAt + 复合索引 + User 反向关系）并执行 migration ~15min
- [ ] T-002: tRPC `painPoint.create` protectedProcedure，zod 非空/2000 上限校验，userId 取自 session ~15min
- [ ] T-003: 首页捕获表单接入 create mutation（成功清空+toast、失败提示、提交中禁用） ~30min

### 功能 2: 浏览与搜索（F-003, F-004）

- [ ] T-004: tRPC `painPoint.list` protectedProcedure（按 userId 过滤 + 可选 search + 时间倒序） ~15min
- [ ] T-005: 痛点库接入真实数据（相对时间格式化、空状态、加载态、统计卡「总记录」） ~30min
- [ ] T-006: 搜索框受控 + 300ms 防抖联动 list 查询 ~15min

### 功能 3: 统计（F-005）

- [ ] T-007: tRPC `painPoint.count` + 「我的」页统计接入替换占位 ~15min

### 集成与测试

- [ ] T-008: 全链路联调：双账号验证数据隔离（AC-003）、未登录调用返回未授权（AC-006），核对 AC-001~AC-006 ~30min

## 依赖关系

- 本 feature 整体依赖 1.T-002（认证与数据库就绪）、1.T-004（路由守卫）
- T-002 依赖 T-001
- T-003 依赖 T-002
- T-004 依赖 T-001
- T-005 依赖 T-004
- T-006 依赖 T-005
- T-007 依赖 T-001
- T-008 依赖 T-003、T-006、T-007

## 风险点

- 移除 mock 数据时 `lib/pain-points.ts` 的 `clusterCard` 仍被引用，需保留避免编译失败
- protectedProcedure 的会话在本地 http 环境可能受 cookie sameSite=none+secure 影响（见 1.tasks 风险点），联调时优先排查
- 相对时间函数使用本地时区即可，无跨时区需求
