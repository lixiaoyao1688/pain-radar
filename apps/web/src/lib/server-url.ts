import { env } from "@pain-radar/env/web";

const TRAILING_SLASHES_PATTERN = /\/+$/;

export const serverUrl = env.VITE_SERVER_URL.replace(
	TRAILING_SLASHES_PATTERN,
	""
);
