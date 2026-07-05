// better-auth 默认错误码文案为英文，这里映射为中文提示；
// 未在映射表中的错误码回退到 better-auth 原始 message/statusText。
const AUTH_ERROR_MESSAGES: Record<string, string> = {
	INVALID_EMAIL_OR_PASSWORD: "账号或密码错误",
	PASSWORD_TOO_SHORT: "密码至少 6 位",
	PASSWORD_TOO_LONG: "密码过长",
	USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "该账号已被注册，请更换账号",
	USER_ALREADY_EXISTS: "该账号已被注册，请更换账号",
	INVALID_EMAIL: "账号格式不合法",
	EMAIL_NOT_VERIFIED: "邮箱尚未验证",
};

type AuthClientError = Readonly<{
	code?: string | null;
	message?: string | null;
	statusText?: string | null;
}>;

export function getAuthErrorMessage(error: AuthClientError): string {
	if (error.code && AUTH_ERROR_MESSAGES[error.code]) {
		return AUTH_ERROR_MESSAGES[error.code];
	}
	return error.message || error.statusText || "操作失败，请重试";
}
