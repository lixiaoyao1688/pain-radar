import { createAuthClient } from "better-auth/react";

import { serverUrl } from "@/lib/server-url";

export const authClient = createAuthClient({
	baseURL: serverUrl,
});
