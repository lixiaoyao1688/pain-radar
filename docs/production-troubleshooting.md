# 线上故障排查

## Prisma P1010 / DatabaseAccessDenied

典型日志：

```text
PrismaClientKnownRequestError: Invalid `prisma.user.findFirst()` invocation:
User was denied access on the database `pain_radar_db`
code: 'P1010'
```

这表示 Lambda 已经运行到 Better Auth 的数据库查询，并且 Prisma 已经尝试连接 PostgreSQL。它不是前端表单、Better Auth 账号映射或路由问题。

在 AWS RDS/Aurora PostgreSQL 上，Prisma 7 + `@prisma/adapter-pg` 还可能把 TLS/证书问题包装成 `P1010` 或 `P1011`。线上必须同时满足：

- `DATABASE_URL` 带 `sslmode=require`。
- Lambda package 内包含 RDS CA bundle：`ap-northeast-1-bundle.pem`。
- Lambda 环境变量包含 `NODE_EXTRA_CA_CERTS=/var/task/ap-northeast-1-bundle.pem`。
- 线上数据库已经应用 Prisma migration，至少应存在 `"user"`、`"session"`、`"account"`、`"verification"` 表。

优先检查线上部署参数：

- `DatabaseUrl` 是否指向正确的 RDS/Aurora endpoint、端口和数据库名。
- `DatabaseUrl` 中的用户名和密码是否是目标数据库实例里的有效账号。
- `DatabaseUrl` 是否包含 `sslmode=require`。
- `NODE_EXTRA_CA_CERTS` 指向的证书文件是否实际存在于 Lambda artifact 中。
- 该账号是否拥有 `pain_radar_db` 的 `CONNECT` 权限。
- 该账号是否拥有 `public` schema 的 `USAGE` 权限，以及业务表的读写权限。
- 如果迁移由另一个管理员账号执行，运行时账号仍然需要被单独授权。

可用管理员账号连接数据库后执行以下授权示例，按真实用户名替换 `pain_radar_app`：

```sql
GRANT CONNECT ON DATABASE pain_radar_db TO pain_radar_app;
GRANT USAGE ON SCHEMA public TO pain_radar_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO pain_radar_app;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO pain_radar_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO pain_radar_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO pain_radar_app;
```

修复权限后，用同一个 `DATABASE_URL` 验证连接和表权限：

```bash
psql "$DATABASE_URL" -c 'select 1'
psql "$DATABASE_URL" -c 'select count(*) from "user"'
```

如果仍然失败，再检查 VPC、安全组和子网路由；但网络问题通常会表现为连接超时或连接拒绝，而不是 `DatabaseAccessDenied`。

本项目在 `apps/server/Makefile` 中会把 `apps/server/ap-northeast-1-bundle.pem` 复制进 Lambda artifact。更换 AWS region 时，需要同步替换对应区域的 RDS CA bundle，并更新 `template.yaml` 中的 `NODE_EXTRA_CA_CERTS` 路径。
