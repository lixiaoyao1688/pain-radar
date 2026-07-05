import z from "zod";

const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 30;
const USERNAME_PATTERN = /^[A-Za-z][A-Za-z0-9]*$/;

export const usernameSchema = z
	.string()
	.min(MIN_USERNAME_LENGTH, `账号至少 ${MIN_USERNAME_LENGTH} 个字符`)
	.max(MAX_USERNAME_LENGTH, `账号最多 ${MAX_USERNAME_LENGTH} 个字符`)
	.regex(USERNAME_PATTERN, "账号只能使用英文字母和数字，且以字母开头");

// better-auth 当前仅支持邮箱登录，前端将纯英文账号映射为内部邮箱，服务端无需改动
export function toAccountEmail(username: string): string {
	return `${username.toLowerCase()}@painradar.local`;
}
