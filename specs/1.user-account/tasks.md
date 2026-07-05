# 个人模块 — 任务清单

## 任务版本

| 日期       | 版本 | 说明     |
| ---------- | ---- | -------- |
| 2026-07-04 | v1   | 初始任务 |

## 项目信息

- 项目名: pain-radar
- 架构类型: Turborepo monorepo
- specs 路径: specs/1.user-account/

## 任务列表

### 功能 1: 认证基础设施

- [x] T-001: 核验 DATABASE_URL 与 PostgreSQL 连通，执行 prisma migrate 应用 auth 模型 ~15min
- [x] T-002: 起 server+web，验证 better-auth 端点连通（signUp/signIn/signOut 走通一遍），修复暴露的问题 ~30min

### 功能 2: 注册与登录（F-001, F-002, F-003）

- [x] T-003: 注册/登录/退出全流程联调：账号映射、密码 6 位边界、错误提示文案核验（AC-001~AC-003） ~30min

### 功能 3: 路由守卫与个人信息（F-004, F-005）

- [x] T-004: 受保护路由守卫（/、/library、/profile 未登录重定向 /login；已登录访问 /login、/register 反向重定向 /） ~30min
- [ ] T-005: 「我的」页个人信息核验：用户名来自 session；捕获痛点统计保持占位并标注待 2.T-007 接入 ~15min

## 依赖关系

- T-002 依赖 T-001
- T-003 依赖 T-002
- T-004 依赖 T-002
- T-005 依赖 T-003

## 风险点

- 本地 PostgreSQL 未就绪会阻塞 T-001（整个计划的第一步）→ 提前确认 .env；无数据库时可先用 docker 起一个
- better-auth cookie 配置为 sameSite=none + secure，本地 http 环境可能导致 cookie 不生效 → 本地联调若遇会话丢失，调整 defaultCookieAttributes 为开发环境友好配置
- 登录/注册页 UI 已完成，联调中发现的 UI 问题按最小修改处理，不重做页面
