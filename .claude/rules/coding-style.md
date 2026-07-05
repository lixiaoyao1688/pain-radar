---
description: PainRadar 全仓编码风格规范（TypeScript / Biome / 命名 / 导入导出约定）
globs: "**/*.{ts,tsx,js,jsx,css}"
---

# Coding Style

## 格式化与 Lint（唯一权威：Ultracite / Biome）

- 格式化和 lint 由 Ultracite（Biome 2.x）统一负责，配置在根目录 `biome.json`，继承 `ultracite/biome/core` 和 `ultracite/biome/react`。
- 提交前必须运行 `pnpm check`，可自动修复的问题用 `pnpm fix`。不要手工调整 Biome 会重排的格式。
- 缩进使用 **Tab**（`formatter.indentStyle: "tab"`），字符串使用**双引号**。
- import 语句由 Biome `organizeImports` 自动排序，不要手动维护顺序。
- Tailwind class 由 `useSortedClasses` 自动排序（识别 `clsx` / `cva` / `cn` 函数），不要手动排序 class 字符串。
- 生成文件不参与 lint 和人工修改：`routeTree.gen.ts`（TanStack Router 生成）、`dist/`、`.turbo/`、Prisma 生成产物。
- `src/routes/**` 下文件名不受命名规范约束（TanStack Router 文件路由，允许 `$id.tsx`、`_layout.tsx` 等）；其余文件遵循 Biome 的 `useFilenamingConvention`（kebab-case）。

## TypeScript

- tsconfig 继承 `@pain-radar/config/tsconfig.base.json`：`strict`、`noUncheckedIndexedAccess`、`noUnusedLocals`、`noUnusedParameters`、`verbatimModuleSyntax`、`isolatedModules` 全部开启，代码必须在此约束下零报错（`pnpm check-types`）。
- `verbatimModuleSyntax` 开启：类型导入必须写 `import type { X } from "..."`，类型与值混合时用 `import { fn, type X }`。
- `noUncheckedIndexedAccess` 开启：索引访问结果视为可能 `undefined`，用可选链、`??` 或显式判空处理，禁止用 `!` 断言绕过。
- 禁用 `any`，未知类型用 `unknown` 再做类型收窄；避免类型断言（`as`），优先类型守卫。
- 不可变字面量用 `as const`；枚举成员必须显式初始化（`useEnumInitializers`），但优先用联合字面量类型代替 enum。
- 魔法数字提取为具名常量；参数不允许重新赋值（`noParameterAssign`）。
- 运行时校验统一用 **Zod**（catalog 版本），环境变量 schema 集中在 `packages/env`，新增环境变量必须同步 `packages/env` 的 schema 和 `.env.example`。

## 命名约定

- 文件与目录：kebab-case（`pain-record-form.tsx`）；路由文件除外（见上）。
- 变量/函数：camelCase；类型/接口/组件/类：PascalCase；常量：UPPER_SNAKE_CASE。
- workspace 包统一 `@pain-radar/*` 命名空间（apps 下的 `web` / `server` / `docs` 除外）。
- 布尔量用 `is` / `has` / `should` 前缀；事件处理函数用 `handleX`，回调 prop 用 `onX`。

## 语言习惯

- `const` 优先，`let` 仅在需要重赋值时使用，禁止 `var`；单条语句只声明一个变量（`useSingleVarDeclarator`）。
- 遍历用 `for...of`，不用 `.forEach()` 和索引 `for` 循环。
- 用可选链 `?.` 与空值合并 `??`；字符串拼接用模板字面量，无插值时用普通引号（`noUnusedTemplateLiteral`）。
- 用 `Number.parseInt` / `Number.isNaN` 等命名空间形式（`useNumberNamespace`）。
- 提前返回代替嵌套条件；`return` 之后不写多余 `else`（`noUselessElse`）；避免嵌套三元。
- 异步统一 `async/await`，async 函数中的 Promise 必须 `await`，错误用 try-catch 处理，不捕获后原样重抛。
- 抛出错误必须是 `Error` 实例并带描述信息；生产代码不留 `console.log` / `debugger`。
- 具名导入优先，避免命名空间导入和 barrel 文件（包对外入口 `src/index.ts` 除外）。

## React（apps/web、packages/ui）

- React 19：只写函数组件；ref 直接作为 prop 传递，不用 `forwardRef`。
- Hooks 只在顶层调用；依赖数组写全（`useExhaustiveDependencies` 为 info 级，但仍应遵守）。
- 列表 `key` 用稳定唯一 ID，不用数组索引；不在组件内部定义组件。
- JSX 无子元素时自闭合（`useSelfClosingElements`）。
- 通用 UI 组件放 `packages/ui`（shadcn 体系），业务组件放 `apps/web/src/components`；样式用 Tailwind v4，类名合并用 `cn`。
- 表单用 TanStack Form + `@hookform/resolvers` + Zod；服务端状态用 TanStack Query + tRPC client，不自建 fetch 层。
- 语义化 HTML 与可访问性：img 提供 alt、表单控件有 label、交互元素用 `<button>` / `<a>`，`target="_blank"` 加 `rel="noopener"`。

## 后端（apps/server、packages/api）

- HTTP 层用 Hono，业务 API 一律走 tRPC procedure（定义在 `packages/api/src/routers`），context 在 `packages/api/src/context.ts`。
- 输入校验在 procedure 的 `input(zodSchema)` 完成，不在 handler 内手写校验。
- 认证统一走 Better Auth（`packages/auth`），不要自行读写 session/cookie。
- 敏感配置只从经 `packages/env` 校验后的环境变量读取，禁止硬编码密钥。
- Lambda 入口为 `apps/server/src/lambda.ts`，本地入口 `index.ts`，共享应用逻辑放 `app.ts`，保持两个入口薄。

## 数据库（packages/db）

- Prisma 7 + PostgreSQL，schema 与 migration 全部在 `packages/db/prisma`；变更 schema 后运行 `pnpm db:generate`，正式变更走 `pnpm db:migrate`，本地原型可用 `pnpm db:push`。
- Prisma Client 只在 `packages/db` 内实例化并从其入口导出，其他包通过 `@pain-radar/db` 引用，不直接 `new PrismaClient()`。
- 模型命名 PascalCase 单数（`PainRecord`），字段 camelCase；多写操作用 `$transaction` 保证一致性。

## Monorepo 约定

- 包管理只用 pnpm（`pnpm@10.12.1`），依赖版本优先走 `pnpm-workspace.yaml` 的 catalog（写 `"catalog:"`），内部依赖写 `"workspace:*"`。
- 任务通过 Turborepo 运行：`pnpm dev` / `pnpm build` / `pnpm check-types`，单应用用 `-F` 过滤（如 `pnpm dev:web`）。
- 跨包共享代码放 `packages/*`，不允许 app 之间互相 import；新增包需带自己的 `package.json`、`tsconfig.json`（继承 `@pain-radar/config`）。
