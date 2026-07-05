---
description: PainRadar 测试规范：测试框架选型、目录组织、命名约定与各层（前端/后端/数据库）测试要求
globs: "**/*.{test,spec}.{ts,tsx}"
---

# 测试规范

## 当前状态

项目目前**未配置测试脚本**（根 package.json 无 `test` script，turbo.json 无 test task）。新增测试时按本文件约定搭建，并同步：

1. 在对应 app/package 的 `package.json` 添加 `"test": "vitest run"`；
2. 在根 `package.json` 添加 `"test": "turbo run test"`，并在 `turbo.json` 注册 `test` task（`dependsOn: ["^build"]`，无持久化输出）。

## 框架选型

| 层 | 位置 | 框架 |
| --- | --- | --- |
| 前端单元/组件 | `apps/web` | Vitest + @testing-library/react + jsdom（与 Vite 共用配置） |
| 后端单元/集成 | `apps/server` | Vitest；Hono 路由用 `app.request()` 直接测试，tRPC procedure 用 `createCaller` 测试 |
| 数据库 | `packages/db` | Vitest + 独立测试数据库（PostgreSQL），禁止连开发/生产库 |
| E2E | 根 `e2e/` 或 `apps/web/e2e/` | Playwright |

不引入 Jest（与 Vite/ESM 生态冲突，项目为 `"type": "module"`）。

## 目录与命名

- 测试文件与被测代码同目录放置（co-location）：`foo.ts` → `foo.test.ts`；组件 `Foo.tsx` → `Foo.test.tsx`。
- E2E 测试用 `*.spec.ts`，放在独立 `e2e/` 目录，不与单元测试混放。
- 测试工具/fixture 放 `src/test-utils/` 或包内 `tests/helpers/`，不放在 `src` 业务目录。

## 编写约定（遵循 Ultracite/Biome 规则）

- 断言必须写在 `it()` / `test()` 块内。
- 异步测试用 `async/await`，禁止 done 回调。
- 禁止提交 `.only` / `.skip`。
- `describe` 嵌套保持扁平（不超过 2 层）。
- 测试命名描述行为而非实现：`it("rejects unauthenticated requests")` 而非 `it("returns 401")`。

## 各层要求

### 前端（apps/web）

- 组件测试聚焦用户可见行为：用 `getByRole` / `getByLabelText` 查询，避免 `getByTestId` 兜底。
- TanStack Query 相关测试需包裹 `QueryClientProvider`，为每个测试创建新的 `QueryClient`（关闭 retry）。
- TanStack Router 相关组件用 memory history 构造测试路由，不 mock 路由 hook。
- 网络请求统一用 MSW mock，禁止在测试中直接打真实后端。

### 后端（apps/server）

- tRPC procedure 测试通过 `router.createCaller(ctx)` 构造受控 context（含模拟 session），覆盖已认证/未认证两条路径。
- Better Auth 相关逻辑 mock session/context，不在单测中跑真实认证流程；真实流程留给 E2E。
- Hono 中间件与路由用内置 `app.request(path, init)` 测试，不需启动端口。

### 数据库（packages/db）

- Prisma 相关测试使用独立的 `DATABASE_URL`（写入 `.env.example` 占位，如 `DATABASE_URL_TEST`），schema 变量同步到 `packages/env`。
- 每个测试用例保证数据隔离：用事务回滚或 truncate，测试间不共享状态。
- 纯查询构造逻辑优先抽成可单测的函数，减少依赖真实库的测试数量。

### E2E（Playwright）

- 关键用户旅程优先：注册/登录（Better Auth）、痛点录入、痛点列表/洞察查看。
- 选择器优先级：`getByRole` > `getByLabel` > `getByText` > `data-testid`。
- 使用 `webServer` 配置自动拉起 `pnpm dev:web` + `pnpm dev:server`，不假设服务已运行。

## 运行

- 单包：`pnpm -F web test` / `pnpm -F server test`（配置后）。
- 全仓库：`pnpm test`（经 turbo，可利用缓存与 `--affected`）。
- 提交前顺序：`pnpm check` → `pnpm check-types` → `pnpm test`。
