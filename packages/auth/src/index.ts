import { createPrismaClient } from "@pain-radar/db";
import { env } from "@pain-radar/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export function createAuth() {
	const prisma = createPrismaClient();
	const isProduction = env.NODE_ENV === "production";

	return betterAuth({
		database: prismaAdapter(prisma, {
			provider: "postgresql",
		}),

		trustedOrigins: [env.CORS_ORIGIN],
		emailAndPassword: {
			enabled: true,
			minPasswordLength: 6,
		},
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL,
		advanced: {
			// 本地 http 联调下 secure + sameSite=none 会导致浏览器丢弃 cookie（会话失效）。
			// 生产环境（跨子域、https）保持 none + secure；开发环境降级为 lax + 非 secure。
			defaultCookieAttributes: {
				sameSite: isProduction ? "none" : "lax",
				secure: isProduction,
				httpOnly: true,
			},
		},
		plugins: [],
	});
}

export const auth = createAuth();
