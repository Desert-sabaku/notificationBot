export default class DiscordNotifier {
    constructor(private webhookUrl: string) {}

    public post(content: string) {
        const payload = { content: content };
        const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
            method: "post",
            contentType: "application/json",
            payload: JSON.stringify(payload),
            muteHttpExceptions: true,
        };
        const response = UrlFetchApp.fetch(this.webhookUrl, options);
        return response.getContentText();
    }
}
