# PainRadar 项目说明

## 产品概述

PainRadar 是一款面向创业者、产品经理、独立开发者和行业研究者的痛点捕获与机会洞察工具。产品将用户日常遇到的抱怨、摩擦和不便沉淀为结构化痛点库，并通过行业趋势、周期性模式和 AI 洞察帮助用户识别潜在市场机会。

## 云端资源与技术栈

本次项目主要以 AWS 云端资源为主。主要技术栈参考 ProcessOn 架构图：https://www.processon.com/view/link/62e77f4f7d9c08072e6eea09

## 架构资源

本项目架构涉及以下 AWS 云端资源：

- IAM Identity Center：用于集中管理员工、开发者或运维人员的单点登录与账号访问权限。
- API Gateway：用于对外暴露后端 API，统一处理接口路由、鉴权、限流和请求转发。
- Amazon EventBridge：用于事件驱动架构，连接不同服务之间的异步事件流转。
- Key Management Service：用于创建和管理加密密钥，保护数据库、存储和应用中的敏感数据。
- Lightsail：用于快速部署轻量级服务器、数据库或小型应用环境。
- Secrets Manager：用于安全存储和轮换数据库密码、API Key 等敏感配置。
- Aurora and RDS：用于托管关系型数据库，承载业务数据、用户数据和痛点记录。
- EC2：用于运行自定义后端服务、任务进程或需要完整服务器控制权的工作负载。
- VPC：用于隔离和管理云上网络环境，配置子网、路由、安全组和私有访问。
- AWS Amplify：用于托管前端应用，并支持前端构建、部署和环境管理。
- IAM：用于管理 AWS 资源访问权限、角色和策略。
- CloudFront：用于 CDN 加速，提升静态资源和前端页面的全球访问速度。
- Route 53：用于域名解析、DNS 管理和流量路由。
- S3：用于存储静态资源、上传文件、备份数据或前端构建产物。
- Lambda：用于运行无服务器函数，处理轻量级后端逻辑、异步任务和事件响应。

---

# Ultracite Code Standards

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through automated formatting and linting.

## Quick Reference

- **Format code**: `pnpm dlx ultracite fix`
- **Check for issues**: `pnpm dlx ultracite check`
- **Diagnose setup**: `pnpm dlx ultracite doctor`

Biome (the underlying engine) provides robust linting and formatting. Most issues are automatically fixable.

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**Next.js:**

- Use Next.js `<Image>` component for images
- Use `next/head` or App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components

**React 19+:**

- Use ref as a prop instead of `React.forwardRef`

**Solid/Svelte/Vue/Qwik:**

- Use `class` and `for` attributes (not `className` or `htmlFor`)

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

## When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

Most formatting and common issues are automatically fixed by Biome. Run `pnpm dlx ultracite fix` before committing to ensure compliance.

## Environment Variables

开发时需要的参数（数据库连接、密钥、第三方服务配置等）直接写入 `.env` / `.env.example` 占位即可，不要因缺少真实值而阻塞开发；真实值由用户自行填写。新增变量同步到 `packages/env` 的 schema。

---

## 技术栈

- 语言：TypeScript（monorepo：Turborepo + pnpm workspaces，pnpm@10.12.1）
- 前端：React 19 + Vite + TanStack Router/Query + Tailwind CSS v4
- 后端：Hono + tRPC + Better Auth
- 数据库：Prisma 7 + PostgreSQL
- 文档站：Astro Starlight
- 部署：AWS SAM（`template.yaml` / `samconfig.toml`），前端配合 AWS 托管资源

## 常用命令

- 安装依赖：`pnpm install`
- 本地开发：`pnpm dev`（或 `pnpm dev:web` / `pnpm dev:server`）
- 构建：`pnpm build`
- Lint / 格式化：`pnpm check`（检查）、`pnpm fix`（自动修复，ultracite/Biome）
- 测试：暂未配置测试脚本

## 目录结构

```
pain-radar/
├── apps/
│   ├── web/        # 前端（React 19 + Vite + TanStack Router/Query）
│   ├── server/     # 后端（Hono + tRPC + Better Auth）
│   └── docs/       # 文档站（Astro Starlight）
├── packages/
│   ├── api/        # tRPC router / API 共享层
│   ├── auth/       # Better Auth 配置
│   ├── db/         # Prisma schema 与数据库客户端
│   ├── env/        # 环境变量 schema（新增 env 需同步这里）
│   ├── ui/         # 共享 UI 组件
│   └── config/     # 共享配置
├── specs/          # 需求 / 设计 / 任务规格
├── template.yaml   # AWS SAM 模板
└── turbo.json      # Turborepo 任务管道
```

## 模块规则（按需引入）

涉及对应模块开发时，先阅读相应规则文件：

- 前端（apps/web、packages/ui）：@rules/frontend.md
- 后端（apps/server、packages/api、packages/auth）：@rules/backend-api.md
- 数据库（packages/db、Prisma migration）：@rules/database.md
- 编码风格（全仓通用）：@rules/coding-style.md
- Git 工作流（分支/提交/PR）：@rules/git-workflow.md
- 测试（新增测试时）：@rules/testing.md
- 安全（密钥/鉴权/部署）：@rules/security.md

## 项目踩坑与教训

@AGENTS.md
