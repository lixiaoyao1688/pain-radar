---
description: Git 分支、提交、PR 与合并规范（Turborepo monorepo + SAM 自动部署）
---

# Git 工作流规范

## 分支策略

- `main` 为默认分支，也是**部署分支**：push 到 `main` 会触发 `.github/workflows/sam-deploy.yml` 自动执行 AWS SAM 部署。切勿把未验证的改动直接推到 main。
- 日常开发一律从 `main` 拉功能分支，通过 PR 合入：
  - `feat/<scope>-<简述>`：新功能（如 `feat/web-pain-list`）
  - `fix/<scope>-<简述>`：缺陷修复
  - `chore/<简述>`：构建、依赖、CI 等杂项
  - `docs/<简述>`：文档（apps/docs 或 specs/）
- `<scope>` 建议对应 monorepo 模块：`web`、`server`、`db`、`env`、`docs`、`infra`。

## 提交规范

- 提交信息使用 Conventional Commits 前缀：`feat:`、`fix:`、`chore:`、`docs:`、`refactor:`、`test:`、`ci:`；正文可用中文描述。
  - 示例：`feat(server): 新增痛点记录 tRPC procedure`
- 一个提交只做一件事；Prisma schema 变更与对应 migration 文件必须在同一个提交中。
- 不提交 `.env`（真实密钥）；新增环境变量时同步更新 `.env.example` 与 `packages/env` 的 schema，并一起提交。
- 不提交构建产物（`dist/`、`.turbo/`、`node_modules/`）与 `sam build` 输出（`.aws-sam/`）。
- 锁文件：依赖变更必须附带 `pnpm-lock.yaml`；只用 `pnpm`（10.12.1），禁止 npm/yarn 产生的锁文件。

## 提交前检查

按顺序执行，全部通过后再提交：

```bash
pnpm fix          # ultracite/Biome 自动修复格式与 lint
pnpm check        # lint 校验（CI 同标准）
pnpm check-types  # turbo 全仓 TypeScript 类型检查
pnpm build        # 涉及构建配置/跨包改动时执行
```

- 改动 `packages/db` 的 schema 后先 `pnpm db:generate`，确认生成的 client 与类型无误。
- 项目暂未配置测试脚本；如后续加入测试，提交前一并运行。

## PR 与合并

- PR 标题沿用 Conventional Commits 格式；描述中写明改动模块（frontend / backend / database）、影响面与验证方式。
- 涉及数据库 migration 的 PR 需单独标注，说明是否需要在部署前/后手动执行 `pnpm db:migrate`。
- 合并方式优先 squash merge，保持 main 历史线性、每个 PR 一个提交。
- 合并到 `main` 即触发 SAM 部署，合并前确认：
  - CI（若有）与本地 `pnpm check`、`pnpm check-types` 通过；
  - `template.yaml`/SAM 配置改动已在本地 `sam validate` 或 `sam build` 验证。

## 其他约定

- 不使用 `git push --force` 推 `main`；个人功能分支需要整理历史时用 `--force-with-lease`。
- 大型二进制、设计稿等资源不入库，放 S3 或外部链接。
- Claude Code 生成的提交遵循同样规范，禁止在提交信息中包含临时调试内容。
