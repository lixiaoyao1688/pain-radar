import { createFileRoute, redirect } from "@tanstack/react-router";

import SignUpForm from "@/components/sign-up-form";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/register")({
	component: SignUpForm,
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (session.data) {
			throw redirect({ to: "/" });
		}
	},
});
