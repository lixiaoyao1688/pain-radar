---
description: 后端 API 开发规范（Hono + tRPC + Better Auth，packages/api 与 apps/server）
globs:
  - packages/api/**
  - packages/auth/**
  - apps/server/**
---

# Backend API 规范

## 架构分层

- **`packages/api`**：tRPC 业务层。所有 procedure、router、context 定义都在这里，不放在 apps/server。
  - `src/index.ts`：tRPC 初始化，导出 `router`、`publicProcedure`、`protectedProcedure`。
  - `src/context.ts`：`createContext`，从 Hono 请求头解析 Better Auth session。
  - `src/routers/`：按领域拆分子 router（如 `todo.ts`），在 `routers/index.ts` 挂载到 `appRouter` 并导出 `AppRouter` 类型。
- **`apps/server`**：HTTP 壳层，只做 Hono app 组装（CORS、logger、auth handler、trpcServer 挂载），不写业务逻辑。
  - `src/app.ts`：Hono app 定义（框架无关，可被多入口复用）。
  - `src/index.ts`：本地 Node 入口（`@hono/node-server`，端口 3000）。
  - `src/lambda.ts`：AWS Lambda 入口（`hono/aws-lambda` 的 `handle`），配合 SAM（`template.yaml` / `samconfig.toml`）部署。
- **`packages/auth`**：Better Auth 配置，导出 `auth` 实例；HTTP 路由固定挂载在 `/api/auth/*`。
- **`packages/db`**：Prisma client，default export `prisma`，业务代码统一 `import prisma from "@pain-radar/db"`。

## 路由约定

- Hono 层只有三类路由：`/api/auth/*`（Better Auth）、`/trpc/*`（tRPC）、`/`（健康检查）。新增业务接口一律走 tRPC procedure，不直接加 Hono route；确需 REST/webhook 时才在 `app.ts` 添加并说明原因。
- 新领域 = 新建 `packages/api/src/routers/<domain>.ts`，导出 `<domain>Router`，再在 `routers/index.ts` 挂到 `appRouter` 对应 key 下。
- procedure 命名用动词：`getAll` / `getById` / `create` / `update` / `delete` / `toggle`；读操作用 `.query`，写操作用 `.mutation`。

## 鉴权

- 需要登录的 procedure 必须用 `protectedProcedure`（内部已校验 `ctx.session` 并收窄类型，handler 中可直接用 `ctx.session.user`）。
- 只有公开只读或匿名可用的接口才用 `publicProcedure`；默认倾向 protected。
- 不要在 handler 内手写 session 判空——统一靠 middleware。

## 输入校验与错误处理

- 所有带输入的 procedure 必须用 zod `.input()` 定义 schema，字段加约束（如 `z.string().min(1)`），不接受未校验的 `any`。
- 错误统一抛 `TRPCError`，选择正确的 `code`（`UNAUTHORIZED` / `NOT_FOUND` / `BAD_REQUEST` / `FORBIDDEN` / `CONFLICT` 等），带可读 `message`。
- 不要把 Prisma 原始错误直接抛给客户端；捕获后转换为语义化 `TRPCError`（参考 `todo.ts` 中 update/delete 的 NOT_FOUND 处理）。
- 错误 message 不包含敏感信息（密钥、SQL、内部路径）。

## 环境变量与配置

- 服务端环境变量一律通过 `@pain-radar/env/server` 的 `env` 读取，禁止直接 `process.env.X`。
- 新增变量：先在 `packages/env` 的 server schema 补充定义，再同步到 `.env` / `.env.example` 占位；缺真实值不阻塞开发。
- 密钥类配置（数据库密码、API Key）生产环境走 AWS Secrets Manager，不写死在代码或提交到仓库。

## CORS 与安全

- CORS origin 来自 `env.CORS_ORIGIN`，不要写 `*`；`credentials: true` 已开启，新增 header/method 需同步更新 `allowHeaders` / `allowMethods`。
- Better Auth 的 handler 只接收 `GET` / `POST`，不要扩大。

## 类型共享

- 前端通过 `AppRouter` 类型消费 API，`packages/api` 必须保持仅导出类型和 tRPC 定义所需内容，避免服务端专用依赖泄漏到 client bundle。
- 修改 procedure 的输入/输出结构属于破坏性变更，需同步检查 `apps/web` 中的调用点。

## 代码风格

- 遵循根 CLAUDE.md 的 Ultracite/Biome 规范；提交前运行 `pnpm check`（修复用 `pnpm fix`）。
- 生产代码不留 `console.log`（入口文件的启动日志除外）。
- 本地开发：`pnpm dev:server`（tsx watch，端口 3000）。
