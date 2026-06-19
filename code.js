function fetchSchedule(calendarId, date_offset = 1) {
    const maxRetries = 3; // 最大リトライ回数
    const delayMills = 2000; // リトライ時の待機時間（2秒）

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const calendar = CalendarApp.getCalendarById(calendarId);
            const events = calendar.getEvents(...getDayRange(date_offset));

            const options = {
                hour: "2-digit",
                minute: "numeric",
                timeZone: "Asia/Tokyo"
            };

            const schedules = events.map(event => {
                const startTime = new Intl.DateTimeFormat("ja-JP", options).format(event.getStartTime());
                const endTime = new Intl.DateTimeFormat("ja-JP", options).format(event.getEndTime());
                const time = !(startTime === "00:00" && endTime === "00:00") ? `${startTime}~${endTime}` : "終日";
                console.log([startTime, endTime].join("\n"));
                const title = event.getTitle();
                const desc = event.getDescription() || null;
                const location = event.getLocation() || null;
                return `【${time}】${title} - ${desc} @${location}`;
            });

            console.log([`${schedules.length}件のスケジュールを取得しました。`, schedules].join("\n"));
            return schedules;
        } catch (e) {
            console.warn(`[試行 ${attempt}/${maxRetries}] スケジュール取得に失敗しました: ${e.toString()}`);

            if (attempt < maxRetries) {
                Utilities.sleep(delayMills);
            } else {
                // すべてのリトライが失敗した場合のみ、エラーログを出して空配列を返す
                console.error(`すべてのリトライ（${maxRetries}回）に失敗しました。処理をスキップします。`);
                return [];
            }
        }
    }
}

function getDayRange(offset) {
    const today = new Date();

    const start = new Date(today);
    start.setDate(today.getDate() + offset);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    return [start, end];
}

function buildContent(schedules, quote = null, date_offset = 1) {
    const quote_content = quote ? `> ${quote.join("―")}` : null; // quoteをいつでも消せるように…泣きたい
    const nextDay = getDayRange(date_offset)[0];
    const head_content = `${nextDay.getMonth() + 1}月${nextDay.getDate()}日の予定`;
    const schedule_content = schedules.length !== 0 ? schedules.join("\n") : "予定はありません";
    return [quote_content, head_content, schedule_content].filter((e) => e).join("\n");
}

function postToDiscord(webhookUrl, content) {
    const payload = {
        content: content,
    };

    const options = {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(webhookUrl, options);
    return response.getContentText();
}

function fetchQuote(url = PropertiesService.getScriptProperties().getProperty("QUOTE_URL")) {
    // このJSONの解析はzenquotesのjsonの構造に依存しているため、URLだけ外部から渡しても意味が薄い。
    // したがってURLは内部で定義する。

    const maxRetries = 3;
    const delayMills = 2000;

  try {
    const response = UrlFetchApp.fetch(url);
    if (response.getResponseCode() !== 200) {
      throw new Error(`Failed to fetch quote: ${response.getResponseCode()}`);
    }
}

function main(_, offset = 1) {
    const calendarId = PropertiesService.getScriptProperties().getProperty("CALENDAR_ID");
    const webhookUrls = [
        PropertiesService.getScriptProperties().getProperty("WEBHOOK_URL"),
        PropertiesService.getScriptProperties().getProperty("TEST_WEBHOOK_URL"),
    ];

    webhookUrls.forEach((url) => {
        const schedule = fetchSchedule(calendarId, offset);
        const quote = fetchQuote();
        const content = buildContent(schedule, quote, offset)
        console.log(postToDiscord(url, content));
    })
}
