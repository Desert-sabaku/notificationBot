export function build(schedules: string[], quote: string[] | null = null, daysAhead = 1) {
    const quoteContent = quote && "> " + quote.join("―");

    const today = new Date();
    const targetDay = new Date(today);
    targetDay.setDate(today.getDate() + daysAhead);

    const headContent = `${targetDay.getMonth() + 1}月${targetDay.getDate()}日の予定`;
    const scheduleContent = schedules.length !== 0 ? schedules.join("\n") : "予定はありません";

    return [quoteContent, headContent, scheduleContent].filter(e => e).join("\n");
}
