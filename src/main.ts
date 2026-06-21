import CalendarService from "./calendarService"
import QuoteService from "./quoteService"
import MessageBuilder from "./messageBuilder"
import DiscordNotifier from "./discordNotifier"

export function main(_: unknown, offset = 1) {
    const scriptProps = PropertiesService.getScriptProperties();
    const calendarId = scriptProps.getProperty("CALENDAR_ID");
    if (calendarId === null) {
        throw new Error("CALENDAR_ID is not set in script properties.");
    }
    const webhookUrls = [
        scriptProps.getProperty("WEBHOOK_URL"),
        scriptProps.getProperty("TEST_WEBHOOK_URL"),
    ].filter((url): url is string => !!url);

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
