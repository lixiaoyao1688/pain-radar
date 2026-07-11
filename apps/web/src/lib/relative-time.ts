const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const HOUR_IN_MILLISECONDS = 60 * 60 * 1000;
const MINUTE_IN_MILLISECONDS = 60 * 1000;

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
	month: "numeric",
	day: "numeric",
});

export const formatRelativeTime = (
	date: Date | string,
	now = new Date()
): string => {
	const timestamp = new Date(date).getTime();
	const elapsed = Math.max(0, now.getTime() - timestamp);

	if (elapsed < MINUTE_IN_MILLISECONDS) {
		return "刚刚";
	}

	if (elapsed < HOUR_IN_MILLISECONDS) {
		return `${Math.floor(elapsed / MINUTE_IN_MILLISECONDS)}分钟前`;
	}

	if (elapsed < DAY_IN_MILLISECONDS) {
		return `${Math.floor(elapsed / HOUR_IN_MILLISECONDS)}小时前`;
	}

	if (elapsed < 2 * DAY_IN_MILLISECONDS) {
		return "昨天";
	}

	if (elapsed < 7 * DAY_IN_MILLISECONDS) {
		return `${Math.floor(elapsed / DAY_IN_MILLISECONDS)}天前`;
	}

	return dateFormatter.format(new Date(timestamp));
};
