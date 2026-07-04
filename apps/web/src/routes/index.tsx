import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, PencilLine, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { BottomNav } from "@/components/bottom-nav";

export const Route = createFileRoute("/")({
	component: CaptureScreen,
});

function CaptureScreen() {
	const [draft, setDraft] = useState("");

	const savePainPoint = () => {
		if (!draft.trim()) {
			toast.warning("先写下一个让你烦恼的问题吧");
			return;
		}
		setDraft("");
		toast.success("已保存到你的痛点库");
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

				<div className="w-full space-y-4 px-2">
					<div className="group relative">
						<textarea
							className="glass-card w-full resize-none rounded-xl p-4 pr-12 text-base text-on-surface shadow-2xl transition-all placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary"
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
						onClick={savePainPoint}
						type="button"
					>
						<Save className="size-6" />
						保存这个痛点
					</button>
				</div>

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
