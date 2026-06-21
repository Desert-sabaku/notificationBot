export default class MessageBuilder {
    static build(schedules: string[], quote: string[] | null = null, offset = 1) {
        const quoteContent = quote && "> " + quote.join("―");

        const today = new Date();
        const targetDay = new Date(today);
        targetDay.setDate(today.getDate() + offset);

        const headContent = `${targetDay.getMonth() + 1}月${targetDay.getDate()}日の予定`;
        const scheduleContent = schedules.length !== 0 ? schedules.join("\n") : "予定はありません";

        return [quoteContent, headContent, scheduleContent].filter(e => e).join("\n");
    }
}
