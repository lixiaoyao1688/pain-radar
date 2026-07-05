---
description: PainRadar 安全规范：密钥管理、认证鉴权、输入校验、CORS、数据库与 AWS 部署安全
---

# 安全规范

## 密钥与环境变量

- 严禁将真实密钥、数据库连接串、API Key 提交到仓库；真实值只存在于本地 `.env`（已被 gitignore）与 AWS Secrets Manager / SAM 参数中。
- `.env.example` 只放占位值；新增环境变量必须同步到 `packages/env` 的 zod schema（服务端 `server`，前端加 `VITE_` 前缀走 `client`），禁止绕过 `@pain-radar/env` 直接读 `process.env` / `import.meta.env`。
- `BETTER_AUTH_SECRET` 至少 32 字符，生产环境必须随机生成，不复用开发值。
- 前端（`VITE_` 前缀）变量会被打包进产物，只能放非敏感配置；任何密钥不得加 `VITE_` 前缀。
- 生产环境敏感配置通过 Secrets Manager / KMS 管理，Lambda 只授予最小 IAM 权限。

## 认证与会话（Better Auth）

- 所有认证逻辑统一走 `packages/auth`（Better Auth + Prisma adapter），不要自行实现登录、密码哈希或 session 逻辑。
- 会话 Cookie 保持 `httpOnly: true`、`secure: true`；跨域场景 `sameSite: "none"` 必须与 HTTPS 配合，禁止关闭 `httpOnly`。
- `trustedOrigins` 只允许明确的前端来源（当前为 `CORS_ORIGIN`），不得加通配符。
- 密码最小长度不低于 6（建议提升到 8+）；不要在日志或错误信息中输出密码、token、session id。

## API 与 tRPC

- 需要登录的 procedure 必须使用受保护的 procedure（在 context 中校验 session），禁止在业务逻辑里靠前端隐藏来"鉴权"。
- 所有输入用 zod `.input()` 校验，不接受未校验的 `any`；对分页、排序字段做白名单校验。
- 资源级鉴权：查询/修改痛点记录等数据时必须校验 `userId` 归属，防止水平越权（IDOR）。
- Hono CORS 保持精确 origin（`env.CORS_ORIGIN`），`allowMethods` / `allowHeaders` 按需最小化，不使用 `*` 搭配 `credentials: true`。
- 错误响应不泄露堆栈、SQL、内部路径；生产环境统一返回通用错误信息。

## 数据库（Prisma + PostgreSQL）

- 只使用 Prisma Client 的参数化查询；如必须用 `$queryRaw`，只用 tagged template 形式，禁止字符串拼接 SQL（禁用 `$queryRawUnsafe` / `$executeRawUnsafe`）。
- `DATABASE_URL` 生产环境启用 TLS（`sslmode=require` 或以上）；数据库置于 VPC 私有子网，不暴露公网。
- 敏感字段（token、密钥）不落明文；删除用户数据时注意级联清理，避免残留 PII。
- migration 通过 Prisma migrate 管理，不手工改生产库结构。

## 前端（React 19 + Vite）

- 禁止 `dangerouslySetInnerHTML` 渲染用户内容；如确有富文本需求必须先消毒（sanitize）。
- 外链 `target="_blank"` 必须加 `rel="noopener"`。
- 不在 `localStorage` 存放 token / 敏感信息，认证依赖 httpOnly Cookie。
- 不使用 `eval`、`new Function`、直接写 `document.cookie`。

## AWS / 部署（SAM + Lambda）

- SAM 模板中的 IAM 角色遵循最小权限，不使用 `Action: "*"` / `Resource: "*"`。
- API Gateway 层配置限流；Lambda 环境变量中的敏感值引用 Secrets Manager，不硬编码在 `template.yaml` / `samconfig.toml`。
- GitHub Actions 部署凭证使用 OIDC 或最小权限 IAM 用户，密钥存 GitHub Secrets，绝不写入 workflow 文件。
- S3 桶默认私有，静态资源经 CloudFront 分发；开启桶级 Block Public Access。

## 日志与依赖

- 日志中不得输出密码、token、完整 Cookie、数据库连接串；提交前移除 `console.log` / `debugger`。
- 定期运行 `pnpm audit` 关注依赖漏洞；升级认证、ORM 等安全敏感依赖时阅读 changelog。
- 提交前运行 `pnpm check`（Biome/ultracite）确保静态检查通过。
