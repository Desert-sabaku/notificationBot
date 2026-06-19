class DiscordNotifier {
    constructor(webhookUrl) {
        this.webhookUrl = webhookUrl;
    }

    post(content) {
        const payload = { content: content };
        const options = {
            method: "post",
            contentType: "application/json",
            payload: JSON.stringify(payload),
            muteHttpExceptions: true
        };
        const response = UrlFetchApp.fetch(this.webhookUrl, options);
        return response.getContentText();
    }
}
