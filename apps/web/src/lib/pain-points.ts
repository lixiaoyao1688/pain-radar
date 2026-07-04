export interface PainPoint {
	detailBody: string;
	detailTitle: string;
	footer: {
		icon: "history" | "priority" | "lightbulb" | "location";
		label: string;
	};
	hashtags: string[];
	id: string;
	insight: string;
	location: string;
	summary: string;
	tags: {
		label: string;
		tone: "primary" | "secondary" | "tertiary" | "muted";
	}[];
	time: string;
	watchers: number;
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
		detailTitle:
			"附近的超市配送时间总是很不稳定，有时候半小时到，有时候要等两个小时。",
		detailBody:
			"用户反映当地超市的配送时间存在明显波动，从30分钟到120分钟不等。这种不可预测性给日常生活规划和备餐带来了不便。",
		hashtags: ["#超市", "#最后一公里", "#效率"],
		insight: "如果这种问题持续存在，它可能代表一个真实的商业机会。",
		watchers: 12,
		location: "上海市 中心城区",
		footer: { icon: "history", label: "已发生 3 次" },
	},
	{
		id: "coworking-network",
		tags: [{ label: "办公空间", tone: "secondary" }],
		time: "昨天",
		summary:
			"共享办公空间的网络在高峰时段会有明显的延迟，尤其是进行视频会议时，严重干扰工作流。",
		detailTitle: "共享办公空间的网络在高峰时段会有明显的延迟。",
		detailBody:
			"多位用户反映在工作日 10 点到 12 点之间，视频会议出现卡顿与掉线，严重影响远程协作效率。",
		hashtags: ["#共享办公", "#网络", "#远程协作"],
		insight: "高峰期网络质量保障可能是共享办公差异化的切入点。",
		watchers: 8,
		location: "上海市 中心城区",
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
		detailTitle: "手机银行的账单分类逻辑非常混乱。",
		detailBody:
			"用户很难快速找到特定类别的支出明细，账单分类与个人心智模型不匹配，需要多次点击才能完成一次简单查询。",
		hashtags: ["#手机银行", "#账单", "#信息架构"],
		insight: "个人财务的自动分类与检索体验仍有明显改进空间。",
		watchers: 5,
		location: "上海市 中心城区",
		footer: { icon: "lightbulb", label: "洞察就绪" },
	},
	{
		id: "metro-signage",
		tags: [{ label: "交通出行", tone: "muted" }],
		time: "10月22日",
		summary: "地铁换乘站的指示牌设计不合理，在人流密集时极易误导方向。",
		detailTitle: "地铁换乘站的指示牌设计不合理。",
		detailBody:
			"在人流密集时段，换乘指示的位置与信息层级容易误导方向，导致乘客绕路与拥堵加剧。",
		hashtags: ["#地铁", "#导视系统", "#公共空间"],
		insight: "高密度公共空间的动态导视是一个被低估的改进方向。",
		watchers: 3,
		location: "上海市 中心城区",
		footer: { icon: "location", label: "公共交通" },
	},
];

export const clusterCard = {
	image:
		"https://lh3.googleusercontent.com/aida-public/AB6AXuBUwNl6elIOxcnyhBfQMcSD-WRwZZpGubI7PIxrkKZuBiOu4vPxNzRWMWw4wb1HNvr1KYuj1ixAEZnoEoHZaeHrX5C40hyyxL_vSxmiOXE6_nUujW81Xgt_YK6x-O3iMBX7x5ab2aUifhfNDud8_5PXKtjtOkiSlol8xv7gzo_tYCwkW-tB8V8DPW00tUSmlHBKTsPIxhRk9e5eiU-WoKYxt8O1jdOv-u3-X_adBtNm1Nl3dgAAeKd6N8BZSFGQkfZHeyybqOsrI2E",
	text: "在 5 条记录中检测到关于配送投诉的周期性模式。",
};

export const insightAvatars = [
	"https://lh3.googleusercontent.com/aida-public/AB6AXuD2vtbuQ1m3TdTYEGD_2kaoaeRbbZxMh5Glat8RnjDvzfUdtKvRFTYIr8r3To2i_WpUO_blAuKtzT640vpWyDATknqyFVu-GgtUyIfdrbJ8YSDDUT3u2fIUnh8rLyV_GkS1jDUIchwqp4LzAHVTtLM6CYjjyh-yK6-PIobu4-AXvyYDQvURiF9mJmz0ka5_XelQ5Si0KXKt8mmdiPd4ByUUryo5X5NYlTR9IEIQGFZBgDaTUKZbAidEpAZ0yc-sSdKfSqKvW4XnBG4",
	"https://lh3.googleusercontent.com/aida-public/AB6AXuApYnyB3TYqFLK2knDhRE0vj37NvM7ZjoItlcrbkU_vRgYe_HqUUV0jl7xVB9BsyiansFSRdV7JrrNLBMWuIruGxfE1m4bZ9PO_iihCbMpvHRWRq10p6dhpk5S0udHS17ZYJ1E_dOCvNcn9TtaUxoIx-fqxQ5XUOdnvMERTPjp_V-d0FSOChBaxJS9SUqDn6vGh8Gdj_njCvuf5nlF4RO2hfWZCx5jHWmlJAjLVa-bq3q7PPM7l9juoq3_vb7v2XfsKP2mceMhUZ7U",
];

export const mapImage =
	"https://lh3.googleusercontent.com/aida-public/AB6AXuDgo-XY8-DjGlM05JD_tRECBxC6_YMEUWG1TgjtpwZ7eOjcdTlKvVJnpFiQciNnkMEZacNXX_fgxipcpvcq7GemwqlQxduYOf3SCHfsSYvDYKiglJz2xl8vxxtWTAlVGSR8mWs8jVPs5vVbK1WmmZfUStWY6IYSu35wv2s09EWB5r-l14-YPkQmqw8v1AGb6qt8seMB-gHb9AzyrFtqgsRu2HSo44J7JoANDOJYsedKS9NsigOYyhr14KVVhTrHbLLX7nxmPv9qpEg";
