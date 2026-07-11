import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Loader2, PencilLine, Save } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

import { BottomNav } from "@/components/bottom-nav";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/_protected/")({
	component: CaptureScreen,
});

function CaptureScreen() {
	const [draft, setDraft] = useState("");
	const queryClient = useQueryClient();
	const createPainPoint = useMutation(
		trpc.painPoint.create.mutationOptions({
			onSuccess: async () => {
				setDraft("");
				await Promise.all([
					queryClient.invalidateQueries({
						queryKey: trpc.painPoint.list.queryKey(),
					}),
					queryClient.invalidateQueries({
						queryKey: trpc.painPoint.count.queryKey(),
					}),
				]);
				toast.success("已保存到你的痛点库");
			},
			onError: (error) => {
				toast.error(error.message || "保存失败，请稍后重试");
			},
		})
	);

	const savePainPoint = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const text = draft.trim();

		if (!text) {
			toast.warning("先写下一个让你烦恼的问题吧");
			return;
		}

		createPainPoint.mutate({ text });
	};

	return (
		<div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[#0a0a0b] p-5">
			<RadarBackdrop />

			<main className="z-10 -mt-16 flex w-full max-w-lg animate-fade-in-up flex-col items-center text-center">
				<h1 className="mb-8 px-4 font-bold text-[32px] leading-[38px] tracking-[-0.03em]">
					<span className="bg-gradient-to-br from-[#0035bd] via-primary to-secondary bg-clip-text text-transparent">
						每一个抱怨，
						<br />
						都是一个尚未被满足的市场机会。
					</span>
				</h1>

				<form className="w-full space-y-4 px-2" onSubmit={savePainPoint}>
					<div className="group relative">
						<textarea
							className="glass-card w-full resize-none rounded-xl p-4 pr-12 text-base text-on-surface shadow-2xl transition-all placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary"
							disabled={createPainPoint.isPending}
							maxLength={2000}
							onChange={(event) => setDraft(event.target.value)}
							placeholder="记录你今天遇到的一个烦人问题或抱怨..."
							rows={3}
							value={draft}
						/>
						<div className="absolute top-3 right-3 text-primary/30 transition-colors group-focus-within:text-primary">
							<PencilLine className="size-5" />
						</div>
					</div>

					<button
						className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-semibold text-2xl text-primary-foreground shadow-[0_0_20px_rgba(184,195,255,0.2)] transition-all duration-200 hover:bg-primary/90 active:scale-95"
						disabled={createPainPoint.isPending}
						type="submit"
					>
						{createPainPoint.isPending ? (
							<Loader2 className="size-6 animate-spin" />
						) : (
							<Save className="size-6" />
						)}
						{createPainPoint.isPending ? "保存中..." : "保存这个痛点"}
					</button>
				</form>

				<Link
					className="mt-8 flex items-center gap-2 text-on-surface-variant transition-colors duration-200 hover:text-primary active:scale-95"
					to="/library"
				>
					<span className="font-label text-xs uppercase tracking-[0.2em]">
						查看我的痛点库
					</span>
					<ChevronRight className="size-4" />
				</Link>
			</main>

			<BottomNav active="/" />
		</div>
	);
}

function RadarBackdrop() {
	return (
		<div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
			<div className="flex h-[500px] w-[500px] items-center justify-center rounded-full border border-primary/20">
				<div className="flex h-[350px] w-[350px] items-center justify-center rounded-full border border-primary/10">
					<div className="relative h-[200px] w-[200px] rounded-full border border-primary/5">
						<div className="absolute inset-0 origin-center animate-radar-scan">
							<div className="absolute top-1/2 left-1/2 h-px w-1/2 bg-gradient-to-r from-transparent to-primary" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
