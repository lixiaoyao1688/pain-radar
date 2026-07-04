export interface PainPoint {
	footer: {
		icon: "history" | "priority" | "lightbulb" | "location";
		label: string;
	};
	id: string;
	summary: string;
	tags: {
		label: string;
		tone: "primary" | "secondary" | "tertiary" | "muted";
	}[];
	time: string;
}

export const painPoints: PainPoint[] = [
	{
		id: "delivery-time",
		tags: [
			{ label: "物流", tone: "primary" },
			{ label: "居家生活", tone: "muted" },
		],
		time: "2小时前",
		summary:
			"附近的超市配送时间总是很不稳定，影响做饭计划，导致食材新鲜度也难以保证。",
		footer: { icon: "history", label: "已发生 3 次" },
	},
	{
		id: "coworking-network",
		tags: [{ label: "办公空间", tone: "secondary" }],
		time: "昨天",
		summary:
			"共享办公空间的网络在高峰时段会有明显的延迟，尤其是进行视频会议时，严重干扰工作流。",
		footer: { icon: "priority", label: "高摩擦感" },
	},
	{
		id: "bank-billing",
		tags: [
			{ label: "金融", tone: "tertiary" },
			{ label: "UI/UX", tone: "muted" },
		],
		time: "10月24日",
		summary: "手机银行的账单分类逻辑非常混乱，很难快速找到特定类别的支出明细。",
		footer: { icon: "lightbulb", label: "洞察就绪" },
	},
	{
		id: "metro-signage",
		tags: [{ label: "交通出行", tone: "muted" }],
		time: "10月22日",
		summary: "地铁换乘站的指示牌设计不合理，在人流密集时极易误导方向。",
		footer: { icon: "location", label: "公共交通" },
	},
];

export const clusterCard = {
	image:
		"https://lh3.googleusercontent.com/aida-public/AB6AXuBUwNl6elIOxcnyhBfQMcSD-WRwZZpGubI7PIxrkKZuBiOu4vPxNzRWMWw4wb1HNvr1KYuj1ixAEZnoEoHZaeHrX5C40hyyxL_vSxmiOXE6_nUujW81Xgt_YK6x-O3iMBX7x5ab2aUifhfNDud8_5PXKtjtOkiSlol8xv7gzo_tYCwkW-tB8V8DPW00tUSmlHBKTsPIxhRk9e5eiU-WoKYxt8O1jdOv-u3-X_adBtNm1Nl3dgAAeKd6N8BZSFGQkfZHeyybqOsrI2E",
	text: "在 5 条记录中检测到关于配送投诉的周期性模式。",
};
