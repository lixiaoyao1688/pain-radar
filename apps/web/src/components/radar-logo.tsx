import { Radar } from "lucide-react";

export function RadarLogo() {
	return (
		<div className="flex flex-col items-center space-y-4">
			<div className="relative flex size-24 items-center justify-center">
				<div className="absolute inset-0 rounded-full border border-primary/20" />
				<div className="absolute inset-2 rounded-full border border-primary/10" />
				<div className="absolute inset-4 rounded-full border border-primary/5" />
				<div className="absolute inset-0 animate-radar-scan">
					<div className="h-full w-1/2 origin-right rounded-l-full bg-gradient-to-t from-primary/30 to-transparent" />
				</div>
				<Radar className="z-20 size-10 text-primary" />
			</div>
			<h1 className="font-bold text-2xl text-primary tracking-tight">
				PainRadar
			</h1>
		</div>
	);
}
