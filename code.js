function fetchSchedule(calendarId, date_offset = 1) {
  const calendar = CalendarApp.getCalendarById(calendarId);
  const events = calendar.getEvents(...getDayRange(date_offset));

  if (events.length === 0) return;

  const schedules = events.map(event => {
    const options = {
      hour: "2-digit",
      minute: "numeric",
    };
 
    const startTime = new Intl.DateTimeFormat("ja-JP", options).format(event.getStartTime());
    const endTime = new Intl.DateTimeFormat("ja-JP", options).format(event.getEndTime());
    const title = event.getTitle();
    const desc = event.getDescription() || null;
    const location = event.getLocation() || null;
    return `【${startTime}~${endTime}】${title} - ${desc} @${location}`;
  });

  return schedules;
}

function getDayRange(offset) {
  const today = new Date();

  const nextDayStart = new Date(today);
  nextDayStart.setDate(today.getDate() + offset);
  nextDayStart.setHours(0, 0, 0, 0);

  const nextDayEnd = new Date(today);
  nextDayEnd.setDate(today.getDate() + offset);
  nextDayEnd.setHours(23, 59, 59, 999);

  return [nextDayStart, nextDayEnd];
}

function buildContent(schedules, quote, date_offset = 1) {
  const quote_content = `> ${quote.join("―")}`;
  const nextDay = getDayRange(date_offset)[0];
  const head_content = `${nextDay.getMonth()}月${nextDay.getDate()}日の予定`;
  const schedule_content = schedules.join("\n");
  return [quote_content, head_content, schedule_content].join("\n");
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
  console.log(response);
  return response.getContentText();
}

function fetchQuote(url = PropertiesService.getScriptProperties().getProperty("QUOTE_URL")) {
  // このJSONの解析はzenquotesに依存しているため、URLだけ外部から渡しても意味が薄い。
  // したがってURLは内部で定義する。

  try {
    const response = UrlFetchApp.fetch(url);
    if (response.getResponseCode() !== 200) {
      throw new Error(`Failed to fetch quote: ${response.getResponseCode()}`);
    }
    const data = JSON.parse(response.getContentText())[0]; // 配列の形式になっているため。
    const quote = LanguageApp.translate(data.q, "en", "ja");
    const author = LanguageApp.translate(data.a, "en", "ja");
    return [quote, author];
  } catch (e) {
    console.error("Error fetching quote:", e);
    return ["fetchの失敗ごとき些末なことよ", "真田悠希"];
  }
}

function main() {
  const calendarId = PropertiesService.getScriptProperties().getProperty("CALENDAR_ID");
  const webhookUrl = PropertiesService.getScriptProperties().getProperty("WEBHOOK_URL");
  const schedule = fetchSchedule(calendarId);
  const quote = fetchQuote();
  console.log(postToDiscord(webhookUrl, buildContent(schedule, quote)));
}
