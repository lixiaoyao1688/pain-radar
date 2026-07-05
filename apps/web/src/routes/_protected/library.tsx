import { createFileRoute } from "@tanstack/react-router";
import {
	CircleAlert,
	History,
	Lightbulb,
	MapPin,
	Search,
	Sparkles,
	Target,
} from "lucide-react";

import { BottomNav } from "@/components/bottom-nav";
import { clusterCard, type PainPoint, painPoints } from "@/lib/pain-points";

export const Route = createFileRoute("/_protected/library")({
	component: LibraryScreen,
});

const stats = [
	{ label: "总记录", value: "128", tone: "text-primary" },
	{ label: "高影响", value: "14", tone: "text-tertiary" },
] as const;

const tagTone: Record<PainPoint["tags"][number]["tone"], string> = {
	primary: "text-primary",
	secondary: "text-secondary",
	tertiary: "text-tertiary",
	muted: "text-on-surface-variant",
};

const footerIcons = {
	history: History,
	priority: CircleAlert,
	lightbulb: Lightbulb,
	location: MapPin,
} as const;

function LibraryScreen() {
	return (
		<div className="flex min-h-svh flex-col bg-background text-foreground">
			<header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-white/10 border-b bg-background/80 px-5 backdrop-blur-xl">
				<div className="flex items-center gap-3">
					<Target className="size-6 text-primary" />
					<h1 className="font-semibold text-2xl text-primary tracking-tight">
						痛点库
					</h1>
				</div>
			</header>

			<main className="mx-auto w-full max-w-2xl flex-1 space-y-6 px-5 py-8">
				<section className="space-y-2">
					<div className="mt-4 flex flex-wrap gap-4 pb-2">
						{stats.map((stat) => (
							<div
								className="glass-card flex flex-1 flex-col rounded-xl px-4 py-3"
								key={stat.label}
							>
								<span className="mb-1 font-label text-[10px] text-on-surface-variant uppercase tracking-[0.1em]">
									{stat.label}
								</span>
								<span className={`font-semibold text-2xl ${stat.tone}`}>
									{stat.value}
								</span>
							</div>
						))}
					</div>
				</section>

				<div className="flex items-center gap-3">
					<div className="flex flex-1 items-center gap-2 rounded-full border border-white/5 bg-surface-container-low px-4 py-2">
						<Search className="size-4 text-on-surface-variant" />
						<input
							className="w-full bg-transparent text-on-surface text-sm placeholder:text-on-surface-variant focus:outline-none"
							placeholder="请输入"
							type="search"
						/>
					</div>
				</div>

				<section className="space-y-3">
					{painPoints.slice(0, 3).map((point) => (
						<PainPointCard key={point.id} point={point} />
					))}

					<article className="glass-card group relative overflow-hidden rounded-xl">
						<div
							aria-label="数据节点聚类可视化"
							className="h-32 w-full bg-center bg-cover"
							role="img"
							style={{ backgroundImage: `url('${clusterCard.image}')` }}
						/>
						<div className="relative mx-3 -mt-4 mb-3 rounded-lg border border-white/10 bg-surface-container-low p-4">
							<div className="mb-2 flex items-center justify-between">
								<span className="font-label text-[10px] text-primary uppercase tracking-[0.1em]">
									自动聚类
								</span>
								<Sparkles className="size-4 text-primary" />
							</div>
							<p className="text-base text-on-surface">{clusterCard.text}</p>
						</div>
					</article>

					{painPoints.slice(3).map((point) => (
						<PainPointCard key={point.id} point={point} />
					))}
				</section>

				<div className="h-24" />
			</main>

			<BottomNav active="/library" />
		</div>
	);
}

function PainPointCard({ point }: { point: PainPoint }) {
	const FooterIcon = footerIcons[point.footer.icon];

	return (
		<article className="glass-card group flex flex-col gap-3 rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30">
			<div className="flex items-start justify-between">
				<div className="flex gap-2">
					{point.tags.map((tag) => (
						<span
							className={`rounded-full bg-surface-container-highest px-2 py-0.5 font-label text-[10px] uppercase tracking-[0.1em] ${tagTone[tag.tone]}`}
							key={tag.label}
						>
							{tag.label}
						</span>
					))}
				</div>
				<span className="font-label text-[10px] text-on-surface-variant opacity-60">
					{point.time}
				</span>
			</div>
			<p className="text-base text-on-surface leading-relaxed">
				{point.summary}
			</p>
			<div className="mt-1 flex items-center justify-between border-white/5 border-t pt-2">
				<div className="flex items-center gap-1 text-on-surface-variant">
					<FooterIcon className="size-3.5" />
					<span className="font-label text-[10px] uppercase tracking-[0.1em]">
						{point.footer.label}
					</span>
				</div>
			</div>
		</article>
	);
}
