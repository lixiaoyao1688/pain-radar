# 痛点模块 — 技术设计

## 设计版本

| 日期       | 版本 | 说明     |
| ---------- | ---- | -------- |
| 2026-07-04 | v1   | 初始设计 |

## 项目架构

- 架构类型: Turborepo monorepo
- 涉及层: 数据库（packages/db，Prisma + PostgreSQL）、API（packages/api，tRPC）、前端（apps/web，React + TanStack Router + @tanstack/react-query）

## 功能模块设计

### 模块 1: 痛点数据模型（packages/db）

新增 `packages/db/prisma/schema/pain-point.prisma`（沿用 todo.prisma 的分文件模式）：

```prisma
model PainPoint {
  id        Int      @id @default(autoincrement())
  text      String
  createdAt DateTime @default(now())

  @@map("pain_point")
}
```

- 本期不含 userId / 标签 / 强度字段（需求已确认仅文本+时间）
- 执行 `prisma migrate dev` 生成迁移与客户端

### 模块 2: 痛点 API（packages/api）

新增 `packages/api/src/routers/pain-point.ts`，在 `routers/index.ts` 注册为 `painPoint`。参考现有 todoRouter 范式，全部使用 `publicProcedure`：

- `painPoint.create`
  - input: `z.object({ text: z.string().trim().min(1).max(2000) })`
  - 行为: `prisma.painPoint.create`
- `painPoint.list`
  - input: `z.object({ search: z.string().trim().max(100).optional() })`
  - 行为: `prisma.painPoint.findMany`，`search` 非空时加 `where: { text: { contains: search, mode: "insensitive" } }`，`orderBy: { createdAt: "desc" }`

### 模块 3: 首页捕获接入（apps/web/src/routes/index.tsx）

- 用 `trpc.painPoint.create` 的 `useMutation`（现有 `utils/trpc` 客户端）替换目前的本地 mock 保存
- 成功：清空输入、`toast.success("已保存到你的痛点库")`；失败：`toast.error`
- 空白输入保持现有前置校验（`toast.warning`），不发请求
- 提交中禁用按钮，防重复提交

### 模块 4: 痛点库接入（apps/web/src/routes/library.tsx）

- 用 `trpc.painPoint.list` 的 `useQuery` 替换 `lib/pain-points.ts` 的 mock 列表
- 搜索框（「请输入」）受控，输入经 300ms 防抖后作为 `search` 参数触发查询
- 时间显示：将 `createdAt` 格式化为相对时间（如「2小时前」「昨天」，超过 7 天显示日期），实现为纯函数放 `apps/web/src/lib/`
- 卡片上标签、footer 标注为设计装饰，本期不依赖数据库字段：不再逐卡展示 mock 标签，仅展示文本 + 时间（保持卡片样式）
- 统计卡片「总记录」用 list 结果长度；「高影响」暂显示占位（无数据支撑），「自动聚类」卡片保留静态
- 空状态：无数据时显示引导文案 + 跳转首页记录的链接；加载中显示现有 Loader

## 接口契约

| 接口             | 类型     | 入参                          | 出参                                        |
| ---------------- | -------- | ----------------------------- | ------------------------------------------- |
| painPoint.create | mutation | `{ text: string }`            | `PainPoint`                                 |
| painPoint.list   | query    | `{ search?: string }`         | `PainPoint[]`（createdAt 倒序）             |

`PainPoint = { id: number; text: string; createdAt: Date }`

## 数据模型

见模块 1。单表 `pain_point`，无外键。

## 安全考虑

- 服务端 zod 校验文本长度（max 2000）与非空，防止超长/空数据入库
- search 参数经 Prisma 参数化查询，无注入风险
- 匿名公开接口，暂无鉴权要求（需求已确认）

## 技术决策

| 决策         | 选项                                   | 理由                                             |
| ------------ | -------------------------------------- | ------------------------------------------------ |
| 搜索实现     | Prisma `contains` + `insensitive`      | 数据量小，无需全文索引；后续可升级 pg trgm       |
| 搜索触发     | 前端防抖 300ms 后重查                  | 满足「实时过滤」验收标准且避免请求风暴           |
| 时间展示     | 前端相对时间纯函数                     | 不引入额外依赖，中文文案与设计稿一致             |
| mock 数据    | 移除 `lib/pain-points.ts` 列表 mock    | 列表接真实数据；聚类卡等纯装饰元素保留静态       |
