class CalendarService {
    constructor(calendarId) {
        this.calendarId = calendarId;
        this.maxRetries = 3;
        this.delayMills = 2000;
    }

    fetchSchedule(offset = 1) {
        const [start, end] = this._getDayRange(offset);

        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                const calendar = CalendarApp.getCalendarById(this.calendarId);
                const events = calendar.getEvents(start, end);
                return this._formatEvents(events);
            } catch (e) {
                console.warn(`[CalendarService] [試行 ${attempt}/${this.maxRetries}] 失敗: ${e.toString()}`);
                if (attempt < this.maxRetries) {
                    Utilities.sleep(this.delayMills);
                } else {
                    console.error(`[CalendarService] すべてのリトライに失敗しました。`);
                    return [];
                }
            }
        }
    }

    _getDayRange(offset) {
        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() + offset);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setHours(23, 59, 59, 999);
        return [start, end];
    }

    _formatEvents(events) {
        const options = { hour: "2-digit", minute: "numeric", timeZone: "Asia/Tokyo" };
        return events.map(event => {
            const startTime = new Intl.DateTimeFormat("ja-JP", options).format(event.getStartTime());
            const endTime = new Intl.DateTimeFormat("ja-JP", options).format(event.getEndTime());
            const time = !(startTime === "00:00" && endTime === "00:00") ? `${startTime}~${endTime}` : "終日";

            const title = event.getTitle();
            const desc = event.getDescription() || null;
            const location = event.getLocation() || null;
            return `【${time}】${title} - ${desc} @${location}`;
        });
    }
}
