# 痛点模块 — 技术设计

## 设计版本

| 日期       | 版本 | 说明     |
| ---------- | ---- | -------- |
| 2026-07-04 | v1   | 初始设计 |

## 项目架构

- 架构类型: Turborepo monorepo
- 涉及层: 数据库（packages/db）、API（packages/api，tRPC）、前端（apps/web）

## 现状说明

首页捕获页与痛点库页 UI 已按 Stitch 设计稿完成（`routes/index.tsx`、`routes/library.tsx`），当前使用 `lib/pain-points.ts` 的 mock 数据，本 feature 将其切换为真实接口。

## 功能模块设计

### 模块 1: 痛点数据模型（packages/db）

新增 `packages/db/prisma/schema/pain-point.prisma`（沿用分文件模式）：

```prisma
model PainPoint {
  id        Int      @id @default(autoincrement())
  text      String
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@index([userId, createdAt])
  @@map("pain_point")
}
```

- User 模型侧补充 `painPoints PainPoint[]` 反向关系
- 复合索引支撑「按用户 + 时间倒序」的主查询

### 模块 2: 痛点 API（packages/api）

新增 `packages/api/src/routers/pain-point.ts`，在 `routers/index.ts` 注册为 `painPoint`。**全部使用 `protectedProcedure`**（已有实现，ctx.session 保证非空）：

- `painPoint.create`
  - input: `z.object({ text: z.string().trim().min(1).max(2000) })`
  - 行为: `prisma.painPoint.create({ data: { text, userId: ctx.session.user.id } })`
- `painPoint.list`
  - input: `z.object({ search: z.string().trim().max(100).optional() })`
  - 行为: `findMany`，`where: { userId, ...(search ? { text: { contains: search, mode: "insensitive" } } : {}) }`，`orderBy: { createdAt: "desc" }`
- `painPoint.count`
  - input: 无
  - 行为: `prisma.painPoint.count({ where: { userId } })`，供「我的」页统计

### 模块 3: 首页捕获接入（apps/web/src/routes/index.tsx）

- `trpc.painPoint.create` useMutation 替换本地 mock 保存
- 成功：清空输入 + toast；失败：toast.error；提交中禁用按钮
- 空白输入保留现有前置校验

### 模块 4: 痛点库接入（apps/web/src/routes/library.tsx）

- `trpc.painPoint.list` useQuery 替换 mock 列表
- 搜索框受控 + 300ms 防抖后触发 `search` 参数重查
- `createdAt` 前端格式化为相对时间（「2小时前」「昨天」，>7 天显示日期），纯函数放 `apps/web/src/lib/`
- 卡片标签/footer 标注为设计装饰：真实数据卡片仅展示文本+时间；「自动聚类」卡片保留静态
- 统计卡「总记录」= list 长度或 count；「高影响」保留占位
- 空状态：引导文案 + 去首页记录链接；加载中用现有 Loader

### 模块 5: 「我的」页统计接入（apps/web/src/routes/profile.tsx）

- `trpc.painPoint.count` useQuery 替换占位 124

## 接口契约

| 接口             | 类型     | 鉴权 | 入参                  | 出参                            |
| ---------------- | -------- | ---- | --------------------- | ------------------------------- |
| painPoint.create | mutation | 需要 | `{ text: string }`    | `PainPoint`                     |
| painPoint.list   | query    | 需要 | `{ search?: string }` | `PainPoint[]`（createdAt 倒序） |
| painPoint.count  | query    | 需要 | -                     | `number`                        |

`PainPoint = { id: number; text: string; userId: string; createdAt: Date }`

## 数据模型

见模块 1。`pain_point` 表外键关联 `user`，级联删除。

## 安全考虑

- 所有接口 protectedProcedure，userId 一律取自 ctx.session，**绝不接受客户端传入的 userId**
- 文本长度服务端上限 2000；search 上限 100，经 Prisma 参数化查询无注入风险

## 技术决策

| 决策       | 选项                              | 理由                                       |
| ---------- | --------------------------------- | ------------------------------------------ |
| 搜索实现   | Prisma `contains` + `insensitive` | 数据量小无需全文索引，后续可升级 pg_trgm   |
| 搜索触发   | 前端 300ms 防抖重查               | 满足实时过滤且避免请求风暴                 |
| 统计接口   | 独立 `painPoint.count`            | 「我的」页无需拉全量列表                   |
| 时间展示   | 前端相对时间纯函数                | 不引入额外依赖，中文文案与设计稿一致       |
