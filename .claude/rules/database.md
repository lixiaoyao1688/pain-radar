---
description: 数据库领域规范：Prisma 7 + PostgreSQL，schema 组织、client 使用、migration 与查询约定
globs: packages/db/**
---

# Database 规范（Prisma 7 + PostgreSQL）

## 包结构

- 数据库统一收敛在 `packages/db`（包名 `@pain-radar/db`），其他包/应用只通过它访问数据库，禁止在 apps 内直接引入 `@prisma/client` 或 `pg`。
- Schema 采用多文件组织，放在 `packages/db/prisma/schema/` 下按领域拆分：
  - `schema.prisma`：仅保留 `generator` 与 `datasource`，不写 model。
  - `auth.prisma`：Better Auth 相关表（User/Session/Account/Verification），结构由 Better Auth 约定，勿随意改字段。
  - 新领域（如痛点记录、行业趋势）新建对应文件，例如 `pain-point.prisma`、`insight.prisma`。
- 生成产物输出到 `packages/db/prisma/generated/`（`provider = "prisma-client"`、ESM、nodejs runtime），不要手改 generated 目录。

## Client 使用

- 通过 `packages/db/src/index.ts` 的默认导出 `prisma` 使用，底层用 `@prisma/adapter-pg`（PrismaPg driver adapter）连接 PostgreSQL，连接串来自 `@pain-radar/env/server` 的 `DATABASE_URL`。
- 不要在业务代码中 `new PrismaClient()`；需要独立实例（如测试）时用 `createPrismaClient()`。
- 类型从 `@pain-radar/db` 或其生成的 models 中获取，避免手写重复类型。

## Schema 约定

- 表名用 `@@map("snake_case")` 映射为小写下划线（现有表：`user`、`session`、`account`、`verification`、`todo`），model 名用 PascalCase，字段名用 camelCase。
- 业务主键：现有简单表用 `Int @id @default(autoincrement())`；Better Auth 表为 `String @id`。新业务表优先 `String @id @default(cuid())`（或与团队确认后统一）。
- 业务表建议带 `createdAt DateTime @default(now())` 与 `updatedAt DateTime @updatedAt`。
- 关系字段必须显式声明 `onDelete` 行为；外键列加 `@@index`，唯一约束用 `@@unique`。
- 枚举值有限的状态字段优先用 Prisma `enum`，不要用裸字符串。

## Migration 流程

命令在 `packages/db` 内执行（或用 `pnpm --filter @pain-radar/db <script>`）：

- `db:generate` — `prisma generate`（`postinstall` 会自动跑）。
- `db:push` — `prisma db push`，仅限本地快速原型，不产生 migration 文件。
- `db:migrate` — `prisma migrate dev`，正式 schema 变更必须走 migration 并提交生成的 SQL。
- `db:studio` — `prisma studio` 本地查看数据。

规则：

- 修改任何 `.prisma` 文件后必须重新 `prisma generate`，确保类型同步。
- 不要手动编辑已提交的 migration 文件；需要修正时新增一条 migration。
- 破坏性变更（删列、改类型）需先确认线上数据兼容策略（生产库为 Aurora/RDS PostgreSQL）。

## 查询与事务

- 多表写入必须用 `prisma.$transaction`（优先交互式事务回调形式）。
- 列表查询显式 `select`/`include` 需要的字段，避免超量取数；分页用 cursor 或 `skip/take` 并配 `orderBy`。
- 避免在循环中逐条查询/写入（N+1），改用 `findMany` + `in`、`createMany`、`updateMany`。
- 用户输入进入查询前须经 zod 校验（项目已依赖 zod）；禁止拼接原生 SQL，确需原生查询时用 `$queryRaw` 的 tagged template 参数化形式。

## 环境变量

- 数据库相关变量只加在 `@pain-radar/env` 的 `server.ts` schema 中（如 `DATABASE_URL`），并同步 `.env.example` 占位；不要在代码中直接读 `process.env`。
- 真实连接串由用户自行填写，开发时缺真实值不阻塞（写占位即可）；生产敏感值走 AWS Secrets Manager。
