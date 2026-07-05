# 个人模块 — 技术设计

## 设计版本

| 日期       | 版本 | 说明     |
| ---------- | ---- | -------- |
| 2026-07-04 | v1   | 初始设计 |

## 项目架构

- 架构类型: Turborepo monorepo
- 涉及层: 数据库（packages/db）、认证服务（packages/auth，better-auth）、前端（apps/web）

## 现状说明（重要）

以下内容**已实现**，本 feature 的任务以「打通与验证」为主：

- 登录页 `apps/web/src/routes/login.tsx` + `components/sign-in-form.tsx`（设计稿风格，账号/密码 + 图标 + 密码可见性切换）
- 注册页 `apps/web/src/routes/register.tsx` + `components/sign-up-form.tsx`
- 我的页 `apps/web/src/routes/profile.tsx`（头像 `public/avatar-detective.jpg`、用户名、捕获痛点统计占位 124、退出登录）
- 账号规则 `apps/web/src/lib/account.ts`（zod 校验 + 账号→内部邮箱映射）
- 服务端 `packages/auth`：email+password 开启，`minPasswordLength: 6`

## 功能模块设计

### 模块 1: 账号映射（已实现，需联调验证）

better-auth 当前仅支持邮箱登录，前端将纯英文账号映射为内部邮箱：

- `toAccountEmail(username)` → `{username 小写}@painradar.local`
- 注册时 `name` 字段直接存账号原文，用于「我的」页展示
- 前端校验规则：`/^[A-Za-z][A-Za-z0-9]*$/`，3-30 位；密码 ≥6 位

**涉及层**：仅前端（apps/web/src/lib/account.ts），服务端零改动。

### 模块 2: 认证数据层

auth.prisma 已包含 User/Session/Account/Verification 模型，但数据库迁移尚未执行。需要：

- 确认 `DATABASE_URL`（packages/env）可用
- 执行 `prisma migrate dev` 应用 schema

**涉及层**：数据库。

### 模块 3: 路由守卫

TanStack Router 层面做保护：受保护路由（`/`、`/library`、`/profile`）在 `beforeLoad` 中检查会话，未登录 `redirect({ to: "/login" })`。

- 会话检查用 `authClient.getSession()`（避免每个组件内各自判断）
- 可将受保护路由收敛到一个 layout route（如 `_protected.tsx`）统一守卫，具体以实现时最小改动为准
- 登录/注册页在已登录状态下访问时反向重定向到 `/`

**涉及层**：前端。

### 模块 4: 个人信息展示

「我的」页已用 `authClient.useSession()` 渲染用户名与退出按钮。捕获痛点统计当前为占位 124，由 `2.T-007` 接入真实 count（跨 feature 依赖）。

**涉及层**：前端。

## 接口契约

均为 better-auth 内置端点（`/api/auth/*`），经 `authClient` 调用：

| 操作     | 客户端调用                          | 备注                        |
| -------- | ----------------------------------- | --------------------------- |
| 注册     | `authClient.signUp.email`           | email 为映射后的内部邮箱    |
| 登录     | `authClient.signIn.email`           | 同上                        |
| 退出     | `authClient.signOut`                |                             |
| 会话查询 | `authClient.useSession/getSession`  | 守卫与个人信息展示共用      |

## 数据模型

沿用 better-auth 生成的 User/Session/Account/Verification（packages/db/prisma/schema/auth.prisma），无新增模型。

## 安全考虑

- 密码长度双重校验（前端 zod + 服务端 minPasswordLength）
- 会话 cookie：httpOnly + secure + sameSite=none（packages/auth 已配置）
- 内部邮箱域 `painradar.local` 不可路由，无真实邮件发送风险

## 技术决策

| 决策         | 选项                             | 理由                                                         |
| ------------ | -------------------------------- | ------------------------------------------------------------ |
| 纯英文账号   | 前端映射为内部邮箱               | 服务端零改动、最快落地；后续可迁移 better-auth username 插件 |
| 路由守卫位置 | TanStack Router beforeLoad       | 路由层统一拦截，避免组件内散落判断                           |
| 密码策略     | 最少 6 位                        | 用户已确认（2026-07-04）                                     |
