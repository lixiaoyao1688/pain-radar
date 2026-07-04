# PainRadar

PainRadar 是一个面向创业者、产品经理、独立开发者和行业研究者的痛点捕获与机会洞察工具。它把日常生活和工作中的抱怨、摩擦、不便记录下来，沉淀为可浏览、可分析、可追踪的痛点库，并通过趋势、聚类和 AI 洞察帮助用户发现潜在市场机会。

当前前端以移动端体验为优先，核心路径是：

- **捕获痛点**：快速记录一个真实问题或抱怨。
- **管理痛点库**：浏览痛点记录、标签、状态、位置和详情。
- **发现机会洞察**：查看热门行业、周期性摩擦模式和高潜力创业机会草案。

更多产品需求请查看 [docs/PRD.md](./docs/PRD.md)。

本项目基于 [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack) 创建，使用 React、TanStack Router、Hono、tRPC 等现代 TypeScript 技术栈构建。

## 产品功能

- 移动端优先的痛点捕获页，支持轻量校验和 Toast 反馈。
- 个人痛点库，包含统计数据、分类标签、时间标记、详情入口和自动聚类卡片。
- 底部弹层详情页，展示雷达洞察、话题标签、关注人数、位置视觉、分享/收藏入口和方案草案按钮。
- 洞察仪表页，展示市场缺口扫描、AI 推荐、行业趋势、摩擦模式和机会草案卡片。
- 深色雷达风格 UI，结合玻璃拟态面板、底部导航和共享设计组件。

## 技术特性

- **TypeScript** - 提供类型安全和更好的开发体验
- **TanStack Router** - 基于文件的类型安全路由
- **TailwindCSS** - 工具类优先的 CSS，便于快速构建界面
- **共享 UI 包** - shadcn/ui 基础组件位于 `packages/ui`
- **Hono** - 轻量、高性能的服务端框架
- **tRPC** - 端到端类型安全 API
- **Node.js** - 运行时环境
- **Prisma** - TypeScript 优先的 ORM
- **PostgreSQL** - 数据库引擎
- **认证** - Better-Auth
- **Turborepo** - 面向 monorepo 的构建系统
- **Biome** - 代码检查和格式化
- **Starlight** - 基于 Astro 的文档站点

## 快速开始

先安装依赖：

```bash
pnpm install
```

## 数据库设置

本项目使用 PostgreSQL 和 Prisma。

1. 确保你已经准备好 PostgreSQL 数据库。
2. 在 `apps/server/.env` 中配置 PostgreSQL 连接信息。

3. 将 Prisma schema 应用到数据库：

```bash
pnpm run db:push
```

然后启动开发服务：

```bash
pnpm run dev
```

在浏览器打开 [http://localhost:3001](http://localhost:3001) 查看 Web 应用。
API 服务运行在 [http://localhost:3000](http://localhost:3000)。

## UI 自定义

本项目的 React Web 应用通过 `packages/ui` 共享 shadcn/ui 基础组件。

- 在 `packages/ui/src/styles/globals.css` 中修改设计令牌和全局样式。
- 在 `packages/ui/src/components/*` 中更新共享基础组件。
- 在 `packages/ui/components.json` 和 `apps/web/components.json` 中调整 shadcn 别名或样式配置。

### 添加更多共享组件

在项目根目录运行以下命令，将更多基础组件添加到共享 UI 包：

```bash
npx shadcn@latest add accordion dialog popover sheet table -c packages/ui
```

像这样导入共享组件：

```tsx
import { Button } from "@pain-radar/ui/components/button";
```

### 添加应用专属组件

如果要添加应用专属组件，而不是共享基础组件，请在 `apps/web` 中运行 shadcn CLI。

## Git Hooks 和格式化

- 运行检查：`pnpm run check`

## 项目结构

```
pain-radar/
├── apps/
│   ├── web/         # 前端应用（React + TanStack Router）
│   ├── docs/        # 文档站点（Astro Starlight）
│   └── server/      # 后端 API（Hono、tRPC）
├── packages/
│   ├── ui/          # 共享 shadcn/ui 组件和样式
│   ├── api/         # API 层和业务逻辑
│   ├── auth/        # 认证配置和逻辑
│   └── db/          # 数据库 schema 和查询
```

## 可用脚本

- `pnpm run dev`：以开发模式启动所有应用
- `pnpm run build`：构建所有应用
- `pnpm run dev:web`：只启动 Web 前端应用
- `pnpm run dev:server`：只启动后端服务
- `pnpm run check-types`：检查所有应用的 TypeScript 类型
- `pnpm run db:push`：将 schema 变更推送到数据库
- `pnpm run db:generate`：生成数据库客户端和类型
- `pnpm run db:migrate`：运行数据库迁移
- `pnpm run db:studio`：打开数据库 Studio 界面
- `pnpm run check`：运行 Biome 格式化和代码检查
- `cd apps/docs && pnpm run dev`：启动文档站点
- `cd apps/docs && pnpm run build`：构建文档站点
