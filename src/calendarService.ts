export default class CalendarService {
    constructor(
        private calendarId: string,
        private maxRetries: number = 3,
        private delayMills: number = 2000,
    ) { }

    public fetchSchedule(offset = 1): string[] {
        const [start, end] = this.getDayRange(offset);

        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                const calendar = CalendarApp.getCalendarById(this.calendarId);
                const events = calendar.getEvents(start, end);
                return this.formatEvents(events);
            } catch (e) {
                console.warn(
                    `[CalendarService] [試行 ${attempt}/${this.maxRetries}] 失敗: ${String(e)}`,
                );
                if (attempt < this.maxRetries) {
                    Utilities.sleep(this.delayMills);
                } else {
                    console.error(
                        `[CalendarService] すべてのリトライに失敗しました。`,
                    );
                }
            }
        }
        return [];
    }

    private getDayRange(offset: number) {
        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() + offset);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setHours(23, 59, 59, 999);
        return [start, end];
    }

    private formatEvents(
        events: GoogleAppsScript.Calendar.CalendarEvent[],
    ): string[] {
        const options: Intl.DateTimeFormatOptions = {
            hour: "2-digit",
            minute: "numeric",
            timeZone: "Asia/Tokyo",
        };
        return events.map(event => {
            const startTime = new Intl.DateTimeFormat("ja-JP", options).format(
                event.getStartTime() as Date,
            );
            const endTime = new Intl.DateTimeFormat("ja-JP", options).format(
                event.getEndTime() as Date,
            );
            const time = startTime === "00:00" && endTime === "00:00"
                ? "終日"
                : `${startTime}~${endTime}`;

            const title = event.getTitle();
            const desc = event.getDescription() || null;
            const location = event.getLocation() || null;
            return `【${time}】${title} - ${desc} @${location}`;
        });
    }
}
