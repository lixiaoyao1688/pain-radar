import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Sparkles, Target } from "lucide-react";
import { useEffect, useState } from "react";

import { BottomNav } from "@/components/bottom-nav";
import Loader from "@/components/loader";
import { clusterCard } from "@/lib/pain-points";
import { formatRelativeTime } from "@/lib/relative-time";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/_protected/library")({
	component: LibraryScreen,
});

const SEARCH_DEBOUNCE_MILLISECONDS = 300;

interface PainPointCardData {
	createdAt: Date | string;
	id: number;
	text: string;
}

function LibraryScreen() {
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");

	useEffect(() => {
		const timeout = window.setTimeout(() => {
			setDebouncedSearch(search.trim());
		}, SEARCH_DEBOUNCE_MILLISECONDS);

		return () => window.clearTimeout(timeout);
	}, [search]);

	const painPoints = useQuery(
		trpc.painPoint.list.queryOptions({
			search: debouncedSearch || undefined,
		})
	);
	const painPointCount = useQuery(trpc.painPoint.count.queryOptions());
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
						<div className="glass-card flex flex-1 flex-col rounded-xl px-4 py-3">
							<span className="mb-1 font-label text-[10px] text-on-surface-variant uppercase tracking-[0.1em]">
								总记录
							</span>
							<span className="font-semibold text-2xl text-primary">
								{painPointCount.isLoading ? "--" : (painPointCount.data ?? 0)}
							</span>
						</div>
						<div className="glass-card flex flex-1 flex-col rounded-xl px-4 py-3">
							<span className="mb-1 font-label text-[10px] text-on-surface-variant uppercase tracking-[0.1em]">
								高影响
							</span>
							<span className="font-semibold text-2xl text-tertiary">--</span>
						</div>
					</div>
				</section>

				<div className="flex items-center gap-3">
					<label className="flex flex-1 items-center gap-2 rounded-full border border-white/5 bg-surface-container-low px-4 py-2">
						<Search className="size-4 text-on-surface-variant" />
						<span className="sr-only">搜索痛点</span>
						<input
							className="w-full bg-transparent text-on-surface text-sm placeholder:text-on-surface-variant focus:outline-none"
							maxLength={100}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="搜索痛点"
							type="search"
							value={search}
						/>
					</label>
				</div>

				<LibraryContent
					isLoading={painPoints.isLoading}
					isSearching={Boolean(debouncedSearch)}
					painPoints={painPoints.data}
				/>

				<div className="h-24" />
			</main>

			<BottomNav active="/library" />
		</div>
	);
}

function LibraryContent({
	isLoading,
	isSearching,
	painPoints,
}: {
	isLoading: boolean;
	isSearching: boolean;
	painPoints: PainPointCardData[] | undefined;
}) {
	if (isLoading) {
		return <Loader />;
	}

	if (!painPoints?.length) {
		return <EmptyState isSearching={isSearching} />;
	}

	return (
		<section className="space-y-3">
			{painPoints.map((point, index) => (
				<div key={point.id}>
					<PainPointCard point={point} />
					{index === 2 ? <ClusterCard /> : null}
				</div>
			))}
		</section>
	);
}

function PainPointCard({ point }: { point: PainPointCardData }) {
	return (
		<article className="glass-card group flex flex-col gap-3 rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30">
			<div className="flex items-start justify-end">
				<time
					className="font-label text-[10px] text-on-surface-variant opacity-60"
					dateTime={new Date(point.createdAt).toISOString()}
				>
					{formatRelativeTime(point.createdAt)}
				</time>
			</div>
			<p className="whitespace-pre-wrap text-base text-on-surface leading-relaxed">
				{point.text}
			</p>
		</article>
	);
}

function ClusterCard() {
	return (
		<article className="glass-card group relative mt-3 overflow-hidden rounded-xl">
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
	);
}

function EmptyState({ isSearching }: { isSearching: boolean }) {
	return (
		<section className="glass-card flex flex-col items-center gap-3 rounded-xl px-6 py-12 text-center">
			<Target className="size-8 text-primary" />
			<h2 className="font-semibold text-lg text-on-surface">
				{isSearching ? "没有找到匹配的痛点" : "你的痛点库还是空的"}
			</h2>
			<p className="text-on-surface-variant text-sm">
				{isSearching
					? "换个关键词试试，或清空搜索查看全部记录。"
					: "记录日常遇到的抱怨和不便，慢慢积累属于你的机会线索。"}
			</p>
			{isSearching ? null : (
				<Link
					className="mt-2 rounded-full bg-primary px-5 py-2 font-semibold text-primary-foreground text-sm"
					to="/"
				>
					去记录第一个痛点
				</Link>
			)}
		</section>
	);
}
