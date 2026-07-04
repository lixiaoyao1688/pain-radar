import { Link } from "@tanstack/react-router";
import { Database, Target } from "lucide-react";

const tabs = [
	{ to: "/", label: "捕获", icon: Target },
	{ to: "/library", label: "痛点库", icon: Database },
] as const;

export function BottomNav({ active }: { active: "/" | "/library" | null }) {
	return (
		<nav className="fixed bottom-0 z-50 flex h-20 w-full items-center justify-around rounded-t-xl border-white/10 border-t bg-surface-container/80 px-4 pb-[env(safe-area-inset-bottom)] shadow-lg backdrop-blur-3xl">
			{tabs.map(({ to, label, icon: Icon }) => {
				const isActive = active === to;
				return (
					<Link
						className={`flex flex-col items-center justify-center duration-200 active:scale-90 ${
							isActive
								? "font-bold text-primary"
								: "text-on-surface-variant transition-colors hover:text-primary"
						}`}
						key={to}
						to={to}
					>
						<Icon className="size-6" strokeWidth={isActive ? 2.5 : 2} />
						<span className="mt-1 font-label text-xs uppercase tracking-[0.1em]">
							{label}
						</span>
					</Link>
				);
			})}
		</nav>
	);
}
