import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowRight,
	Banknote,
	Brain,
	ChartLine,
	CircleUserRound,
	Radar,
	Sparkles,
	TriangleAlert,
	Truck,
	Zap,
} from "lucide-react";
import { toast } from "sonner";

import { BottomNav } from "@/components/bottom-nav";

export const Route = createFileRoute("/insights")({
	component: InsightsScreen,
});

const sectors = [
	{
		name: "现代物流",
		count: "1,240 痛点标记",
		delta: "+18.4%",
		deltaTone: "text-tertiary",
		icon: Truck,
		iconTone: "text-primary",
		iconBg: "bg-primary-container/20",
	},
	{
		name: "金融科技",
		count: "856 痛点标记",
		delta: "+12.1%",
		deltaTone: "text-tertiary",
		icon: Banknote,
		iconTone: "text-secondary",
		iconBg: "bg-secondary/10",
	},
	{
		name: "能源管理",
		count: "642 痛点标记",
		delta: "+9.7%",
		deltaTone: "text-tertiary",
		icon: Zap,
		iconTone: "text-tertiary",
		iconBg: "bg-tertiary/10",
	},
	{
		name: "健康科技",
		count: "431 痛点标记",
		delta: "+4.2%",
		deltaTone: "text-on-surface-variant",
		icon: Brain,
		iconTone: "text-on-surface-variant",
		iconBg: "bg-surface-container-highest",
	},
] as const;

const frictionPatterns = [
	{
		text: "“配送时间预期”是本周排名第一的投诉关键词。",
		icon: TriangleAlert,
		tone: "text-destructive",
		bar: "bg-destructive",
		width: "w-4/5",
	},
	{
		text: "跨平台数据同步障碍，主要集中在 SaaS 工具之间。",
		icon: ChartLine,
		tone: "text-primary",
		bar: "bg-primary",
		width: "w-2/3",
	},
] as const;

const opportunities = [
	{
		name: "HyperLocal 配送引擎",
		description: "解决 30 分钟内城市物流调度痛点",
		score: "98 分",
		scoreTone: "bg-primary/10 text-primary",
		logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCH090atrhP9-wtnxPp9e1km9XYXeilw6E7kzy5mw6vdxW0Y7rPg6xGeakmZsuDDSxDdH9Y_xg2crOU1yiVQUdXpOwwSP3mDem193Ffm9QE-XgZYxVuQXDEtfJlExNJodJgHC_r1y1CqO4rc1gZv2ZkCJTNDmcR5Arj8HypdvgKxUw8DMPFDptFvKgT4xI4wX8Drfzgm1EbpmM0AUsRi36R_A0YWhRv-q00IMz2WSRkNzkgJqiNJQA6lpPAnkJztEM8Sw8NjBLOuYw",
	},
	{
		name: "No-Code 支付网关",
		description: "针对中小型电商的极简集成方案",
		score: "92 分",
		scoreTone: "bg-secondary/10 text-secondary",
		logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWHA5I9x9cXxccAbo58bLfoTY0juVxl-HcGzE3Q2TUd7gAMkKHZu_SQVcY3WnyUdYjAvh_X6lwjZC_b6UxQHTqu0C8Qa7y11t8s7KlgMtamavZAC1cisj-mN20mqekW-Vn_OEsvVh7mQwFocHPaj0Fah4Z-nfqSSNaCoBYLPoOfpQO-g6tbf-v04k678aVs8-OHnkHzEQ7clfNrTB2PK6JxrqvimSq1eqB5J3TcbDlMi8Cio-kGSDmn3I3l_QkbLE4Slh3S1N1Shs",
	},
] as const;

function InsightsScreen() {
	return (
		<div className="min-h-svh bg-[#0a0a0b] pb-24 text-foreground">
			<header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-white/10 border-b bg-background/80 px-5 backdrop-blur-xl">
				<div className="flex items-center gap-2">
					<Radar className="size-6 text-primary" />
					<h1 className="font-bold text-[28px] text-primary tracking-tight">
						PainRadar
					</h1>
				</div>
				<button
					aria-label="账户"
					className="text-on-surface-variant transition-opacity duration-200 hover:opacity-80 active:scale-95"
					type="button"
				>
					<CircleUserRound className="size-6" />
				</button>
			</header>

			<main className="mx-auto mt-4 w-full max-w-2xl space-y-8 px-5">
				<section className="glass-card relative flex h-64 flex-col justify-between overflow-hidden rounded-xl p-6 shadow-[0_0_50px_-10px_rgba(184,195,255,0.3)]">
					<div className="pointer-events-none absolute inset-0 opacity-20">
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="flex size-96 items-center justify-center rounded-full border border-primary/20">
								<div className="flex size-64 items-center justify-center rounded-full border border-primary/30">
									<div className="size-32 rounded-full border border-primary/40" />
								</div>
							</div>
						</div>
						<div className="absolute inset-0 animate-radar-scan rounded-full bg-[conic-gradient(from_0deg,transparent_0%,rgba(184,195,255,0.5)_10%,transparent_20%)]" />
					</div>
					<div className="relative z-10">
						<p className="mb-1 font-label text-primary text-xs uppercase tracking-[0.1em]">
							实时扫描中
						</p>
						<h2 className="font-semibold text-2xl text-on-surface">
							已发现 12 个市场缺口
						</h2>
					</div>
					<div className="relative z-10 flex gap-4">
						<div className="rounded-lg border border-white/5 bg-surface-container/50 px-3 py-1.5">
							<p className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.1em]">
								高潜力需求
							</p>
							<p className="font-medium text-sm text-tertiary tracking-[0.02em]">
								384 份报告
							</p>
						</div>
						<div className="rounded-lg border border-white/5 bg-surface-container/50 px-3 py-1.5">
							<p className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.1em]">
								趋势同步
							</p>
							<p className="font-medium text-secondary text-sm tracking-[0.02em]">
								前 5% 增长
							</p>
						</div>
					</div>
				</section>

				<section className="glass-card group relative overflow-hidden rounded-xl p-6 transition-colors hover:border-primary/40">
					<div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-30">
						<Sparkles className="size-16 text-primary" />
					</div>
					<div className="mb-4 flex items-center gap-2">
						<Sparkles className="size-4 text-primary" fill="currentColor" />
						<h3 className="font-label text-on-surface text-xs uppercase tracking-[0.1em]">
							AI 智能洞察
						</h3>
					</div>
					<p className="mb-4 font-semibold text-2xl leading-snug">
						建议关注“即时物流”中的“最后一公里延迟”痛点。
					</p>
					<p className="mb-6 text-base text-on-surface-variant">
						我们的分析显示，过去一周内该领域的负面情绪上升了
						22%。特别是在生鲜电商领域，配送延迟是排名第一的用户投诉。
					</p>
					<button
						className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 font-bold text-primary-foreground duration-200 active:scale-95"
						onClick={() => toast.info("领域探索即将上线")}
						type="button"
					>
						<span>深入探索该领域</span>
						<ArrowRight className="size-4" />
					</button>
				</section>

				<section className="space-y-4">
					<h3 className="font-label text-on-surface-variant text-xs uppercase tracking-[0.1em]">
						热门痛点行业
					</h3>
					<div className="grid grid-cols-2 gap-3">
						{sectors.map((sector) => (
							<div
								className="glass-card flex flex-col gap-3 rounded-xl p-4"
								key={sector.name}
							>
								<div className="flex items-start justify-between">
									<div
										className={`flex size-10 items-center justify-center rounded-lg ${sector.iconBg}`}
									>
										<sector.icon className={`size-5 ${sector.iconTone}`} />
									</div>
									<span
										className={`font-medium text-xs tracking-[0.02em] ${sector.deltaTone}`}
									>
										{sector.delta}
									</span>
								</div>
								<div>
									<p className="font-semibold text-lg text-on-surface">
										{sector.name}
									</p>
									<p className="mt-1 font-label text-[10px] text-on-surface-variant uppercase tracking-[0.1em]">
										{sector.count}
									</p>
								</div>
							</div>
						))}
					</div>
				</section>

				<section className="space-y-4">
					<h3 className="font-label text-on-surface-variant text-xs uppercase tracking-[0.1em]">
						周期性摩擦模式
					</h3>
					<div className="glass-card divide-y divide-white/5 rounded-xl">
						{frictionPatterns.map((pattern) => (
							<div className="flex items-start gap-4 p-4" key={pattern.text}>
								<div className="mt-1">
									<pattern.icon className={`size-4 ${pattern.tone}`} />
								</div>
								<div className="flex-1">
									<p className="text-base text-on-surface">{pattern.text}</p>
									<div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/5">
										<div className={`h-full ${pattern.bar} ${pattern.width}`} />
									</div>
								</div>
							</div>
						))}
					</div>
				</section>

				<section className="space-y-4">
					<div className="flex items-end justify-between">
						<h3 className="font-label text-on-surface-variant text-xs uppercase tracking-[0.1em]">
							高潜力创业机会草案
						</h3>
						<button
							className="text-primary text-xs transition-all hover:underline"
							onClick={() => toast.info("完整列表即将上线")}
							type="button"
						>
							查看全部
						</button>
					</div>
					<div className="space-y-3">
						{opportunities.map((opportunity) => (
							<div
								className="glass-card flex items-center justify-between rounded-xl p-5 transition-all hover:border-primary/50 hover:shadow-[0_0_15px_rgba(184,195,255,0.1)]"
								key={opportunity.name}
							>
								<div className="flex items-center gap-4">
									<div className="size-12 shrink-0 overflow-hidden rounded-full">
										<img
											alt={`${opportunity.name} 标识`}
											className="h-full w-full object-cover"
											height={48}
											src={opportunity.logo}
											width={48}
										/>
									</div>
									<div>
										<h4 className="font-semibold text-lg text-on-surface">
											{opportunity.name}
										</h4>
										<p className="text-on-surface-variant text-sm">
											{opportunity.description}
										</p>
									</div>
								</div>
								<div className="text-right">
									<div
										className={`mb-1 inline-block rounded px-2 py-0.5 font-bold text-[10px] ${opportunity.scoreTone}`}
									>
										{opportunity.score}
									</div>
									<p className="text-[10px] text-on-surface-variant tracking-[0.02em]">
										潜力估值
									</p>
								</div>
							</div>
						))}
					</div>
				</section>
			</main>

			<BottomNav active="/insights" />
		</div>
	);
}
