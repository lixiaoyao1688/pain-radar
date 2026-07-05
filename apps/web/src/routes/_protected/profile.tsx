import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Radar } from "lucide-react";
import { toast } from "sonner";

import { BottomNav } from "@/components/bottom-nav";
import Loader from "@/components/loader";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_protected/profile")({
	component: ProfileScreen,
});

function ProfileScreen() {
	const navigate = useNavigate({ from: "/profile" });
	const { data: session, isPending } = authClient.useSession();

	const signOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					toast.success("已退出登录");
					navigate({ to: "/login" });
				},
				onError: (error) => {
					toast.error(error.error.message || error.error.statusText);
				},
			},
		});
	};

	if (isPending) {
		return <Loader />;
	}

	if (!session) {
		navigate({ to: "/login" });
		return null;
	}

	return (
		<div className="min-h-svh bg-background pb-24 text-on-surface">
			<header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-white/10 border-b bg-background/80 px-5 backdrop-blur-xl">
				<div className="flex items-center gap-2">
					<Radar className="size-6 text-primary" />
					<h1 className="font-bold text-2xl text-primary tracking-tight">
						PainRadar
					</h1>
				</div>
			</header>

			<main className="mx-auto max-w-lg space-y-8 px-5 pt-20">
				<section className="flex flex-col items-center py-6 text-center">
					<div className="relative mb-4">
						<div className="absolute -inset-4 animate-radar-scan rounded-full border border-primary/20" />
						<div className="absolute -inset-2 rounded-full border border-primary/40" />
						<div className="relative z-10 size-24 overflow-hidden rounded-full border-2 border-primary shadow-[0_0_20px_rgba(184,195,255,0.3)]">
							<img
								alt="用户头像"
								className="h-full w-full object-cover"
								height={96}
								src="/avatar-detective.jpg"
								width={96}
							/>
						</div>
					</div>
					<h2 className="font-semibold text-2xl text-on-surface">
						{session.user.name || session.user.email}
					</h2>
				</section>

				<div className="grid gap-3">
					<div className="glass-card flex flex-col items-center gap-1 rounded-xl p-4">
						<span className="font-label text-on-surface-variant text-xs uppercase tracking-[0.1em]">
							捕获痛点
						</span>
						<span className="font-bold text-[32px] text-primary">124</span>
					</div>
				</div>

				<div className="pt-4">
					<button
						className="glass-card group flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-error transition-all hover:bg-error/10 active:scale-[0.98]"
						onClick={signOut}
						type="button"
					>
						<LogOut className="size-5" />
						<span className="font-bold">退出登录</span>
					</button>
				</div>
			</main>

			<BottomNav active="/profile" />
		</div>
	);
}
