---
description: 前端开发规范（apps/web：React 19 + Vite + TanStack Router/Query + tRPC + Tailwind v4 + shadcn/ui）
globs: apps/web/**,packages/ui/**
---

# 前端规范

## 技术栈与目录

- 前端应用位于 `apps/web`，React 19 + Vite 8 + TypeScript，包管理用 pnpm（`pnpm dev:web` 启动，`pnpm build` 构建，`pnpm check` / `pnpm fix` 做 lint）。
- 目录约定：
  - `src/routes/` — TanStack Router 文件式路由（`__root.tsx` 为根布局，`_auth/` 为需登录的布局分组）。
  - `src/components/` — 应用级组件（kebab-case 文件名，如 `sign-in-form.tsx`）。
  - `src/lib/` — 业务数据/客户端逻辑（如 `auth-client.ts`、`pain-points.ts`）。
  - `src/utils/trpc.ts` — tRPC + React Query 客户端单例。
  - `src/routeTree.gen.ts` 是路由插件生成文件，禁止手改、禁止 review 其 diff。

## 路由（TanStack Router）

- 新页面通过在 `src/routes/` 新建文件实现，使用 `createFileRoute` 导出 `Route`；路由树由 `@tanstack/router-plugin` 自动生成。
- 需要鉴权的页面放入 `_auth/` 布局分组，复用其鉴权守卫，不要在每个页面里手写重定向逻辑。
- 路由跳转用 `<Link>` / `useNavigate`，不要用 `window.location`。

## 数据获取（tRPC + TanStack Query）

- 一律通过 `src/utils/trpc.ts` 导出的 `trpc`（`createTRPCOptionsProxy`）与共享 `queryClient` 访问后端，例如 `useQuery(trpc.xxx.queryOptions(...))`；不要另建 tRPC/QueryClient 实例。
- 后端类型从 `@pain-radar/api` workspace 包导入（`AppRouter`），前后端类型必须端到端打通，禁止手写重复的响应类型。
- 请求默认 `credentials: "include"`（cookie 会话），新增 link 时保持该行为。
- 全局错误已在 `QueryCache.onError` 用 sonner toast 处理；组件内只处理需要特殊 UI 的错误，不要重复 toast。
- 变更（mutation）成功后用 `queryClient.invalidateQueries` 使相关查询失效，而非手动改缓存。

## UI 与样式

- 共享 UI 组件在 `packages/ui`（shadcn/ui，style: base-lyra，图标库 lucide-react）；新增 shadcn 组件用 CLI 添加到 `@pain-radar/ui`，通过 `@pain-radar/ui/components/*` 导入，工具函数用 `@pain-radar/ui/lib/utils` 的 `cn`。
- 仅本应用使用的组件放 `apps/web/src/components/`，可复用的沉淀到 `packages/ui`。
- Tailwind v4（`@tailwindcss/vite` 插件，无 tailwind.config），全局样式与 CSS 变量在 `packages/ui/src/styles/globals.css`；颜色用语义 token（CSS variables），不要硬编码色值。
- 深浅色主题用 `next-themes` + `theme-provider.tsx` / `mode-toggle.tsx`，新组件需同时适配 light/dark。
- 通知统一用 `sonner` 的 `toast`，不要引入其他 toast 库或使用 `alert`。

## 表单与校验

- 表单用 `@tanstack/react-form`，校验 schema 用 `zod`；校验 schema 尽量与后端共享，避免前后端规则漂移。
- 表单输入必须有关联 label，错误信息展示在对应字段旁。

## 认证

- 认证走 Better Auth：客户端统一使用 `src/lib/auth-client.ts` 导出的实例（`signIn` / `signUp` / `useSession` 等），不要直接 fetch 认证接口。

## 环境变量

- 前端环境变量以 `VITE_` 前缀，通过 `@pain-radar/env/web` 的 `env` 对象读取，禁止直接用 `import.meta.env`；新增变量同步到 `packages/env` 的 schema 和 `.env.example`。

## 代码质量

- 遵循 Ultracite/Biome 规范（见根 CLAUDE.md）：函数组件 + hooks、`for...of`、可选链、`const` 优先、无 `console.log`；提交前跑 `pnpm check`（修复用 `pnpm fix`）。
- 组件文件名 kebab-case，组件名 PascalCase；不要在组件内部定义组件；列表渲染 key 用稳定 ID 而非索引。
- 图片、外链等遵循无障碍与安全规范（alt 文本、`rel="noopener"`）。
