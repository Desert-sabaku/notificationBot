function main(_, offset = 1) {
    const scriptProps = PropertiesService.getScriptProperties();
    const calendarId = scriptProps.getProperty("CALENDAR_ID");
    const webhookUrls = [
        scriptProps.getProperty("WEBHOOK_URL"),
        scriptProps.getProperty("TEST_WEBHOOK_URL"),
    ].filter(url => url); // 空のプロパティを除外

    const calendarService = new CalendarService(calendarId);
    const quoteService = new QuoteService();

    const schedules = calendarService.fetchSchedule(offset);
    const quote = quoteService.fetchQuote();

    const content = MessageBuilder.build(schedules, quote, offset);

    webhookUrls.forEach(url => {
        const notifier = new DiscordNotifier(url);
        const result = notifier.post(content);
        console.log(`[Main] Posted to Discord. Result: ${result}`);
    });
}
