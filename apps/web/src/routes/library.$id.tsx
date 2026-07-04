import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { Bookmark, Lightbulb, MapPin, Share2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

import { insightAvatars, mapImage, painPoints } from "@/lib/pain-points";

export const Route = createFileRoute("/library/$id")({
	component: InsightDetailSheet,
	loader: ({ params }) => {
		const point = painPoints.find((item) => item.id === params.id);
		if (!point) {
			throw notFound();
		}
		return { point };
	},
});

function InsightDetailSheet() {
	const { point } = Route.useLoaderData();
	const navigate = useNavigate();
	const primaryTag = point.tags[0];

	const close = () => {
		navigate({ to: "/library" });
	};

	return (
		<div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm">
			<div className="glass-sheet relative flex h-[85svh] w-full max-w-2xl animate-sheet-in flex-col overflow-hidden rounded-t-[32px]">
				<div className="flex w-full justify-center pt-4 pb-2">
					<div className="h-1.5 w-12 rounded-full bg-on-surface-variant/30" />
				</div>

				<div className="flex items-center justify-between px-6 py-4">
					<button
						aria-label="关闭"
						className="flex size-10 items-center justify-center rounded-full bg-white/5 transition-transform active:scale-95"
						onClick={close}
						type="button"
					>
						<X className="size-5 text-on-surface" />
					</button>
					<div className="flex gap-4">
						<button
							aria-label="分享"
							className="flex size-10 items-center justify-center rounded-full bg-white/5 transition-transform active:scale-95"
							type="button"
						>
							<Share2 className="size-5 text-on-surface" />
						</button>
						<button
							aria-label="收藏"
							className="flex size-10 items-center justify-center rounded-full bg-white/5 transition-transform active:scale-95"
							type="button"
						>
							<Bookmark
								className="size-5 text-on-surface"
								fill="currentColor"
							/>
						</button>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto px-6 pb-24">
					<div className="mb-4 flex items-center gap-2">
						{primaryTag ? (
							<span className="rounded-full bg-primary/10 px-2.5 py-1 font-label text-primary text-xs uppercase tracking-[0.1em]">
								{primaryTag.label}
							</span>
						) : null}
						<span className="text-on-surface-variant text-sm tracking-[0.02em]">
							{point.time}检测到
						</span>
					</div>

					<div className="mb-8">
						<h2 className="mb-4 font-semibold text-2xl text-on-surface leading-tight">
							{point.detailTitle}
						</h2>
						<p className="text-lg text-on-surface-variant leading-7 opacity-80">
							{point.detailBody}
						</p>
					</div>

					<div className="mb-8 flex flex-wrap gap-2">
						{point.hashtags.map((tag) => (
							<div
								className="rounded-lg border border-white/5 bg-surface-container-highest px-3 py-1.5 font-label text-on-surface-variant text-xs uppercase tracking-[0.1em]"
								key={tag}
							>
								{tag}
							</div>
						))}
					</div>

					<div className="relative mb-8 overflow-hidden rounded-2xl border border-primary/20 bg-primary-container/10 p-6 transition-colors hover:border-primary/50">
						<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(184,195,255,0.1)_0%,transparent_60%)]" />
						<div className="mb-4 flex items-center gap-3">
							<div className="flex size-8 items-center justify-center rounded-full bg-primary">
								<Lightbulb className="size-[18px] text-primary-foreground" />
							</div>
							<span className="font-label text-primary text-xs uppercase tracking-[0.2em]">
								雷达洞察
							</span>
						</div>
						<p className="font-semibold text-2xl text-on-primary-container leading-snug">
							{point.insight}
						</p>
						<div className="mt-6 border-primary/10 border-t pt-6">
							<div className="flex items-center gap-4">
								<div className="flex -space-x-2">
									{insightAvatars.map((avatar) => (
										<div
											className="size-8 overflow-hidden rounded-full border-2 border-surface-container-lowest bg-surface-container"
											key={avatar}
										>
											<img
												alt="创业者头像"
												className="h-full w-full object-cover"
												height={32}
												src={avatar}
												width={32}
											/>
										</div>
									))}
								</div>
								<span className="text-on-surface-variant text-sm tracking-[0.02em]">
									{point.watchers}位创业者正在关注
								</span>
							</div>
						</div>
					</div>

					<div className="relative mb-8 h-48 overflow-hidden rounded-2xl border border-white/5">
						<div
							aria-label="位置地图"
							className="absolute inset-0 bg-center bg-cover"
							role="img"
							style={{ backgroundImage: `url('${mapImage}')` }}
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
						<div className="absolute bottom-4 left-4 flex items-center gap-2">
							<MapPin className="size-4 text-primary" />
							<span className="font-label text-white text-xs uppercase tracking-[0.1em]">
								{point.location}
							</span>
						</div>
					</div>
				</div>

				<div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-surface-container-lowest to-transparent p-6 backdrop-blur-sm">
					<button
						className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-[18px] text-primary-foreground shadow-[0_0_20px_rgba(184,195,255,0.15)] transition-all active:scale-[0.98]"
						onClick={() => toast.info("方案草案生成即将上线")}
						type="button"
					>
						<span>生成方案草案</span>
						<Sparkles className="size-5" />
					</button>
				</div>
			</div>
		</div>
	);
}
