class QuoteService {
    constructor() {
        this.defaultUrl = "https://zenquotes.io/api/random";
        this.maxRetries = 3;
        this.delayMills = 2000;
    }

    fetchQuote(url = PropertiesService.getScriptProperties().getProperty("QUOTE_URL") || this.defaultUrl) {
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                const response = UrlFetchApp.fetch(url);
                if (response.getResponseCode() !== 200) throw new Error(`Status: ${response.getResponseCode()}`);

                const data = JSON.parse(response.getContentText())[0];
                const quote = LanguageApp.translate(data.q, "en", "ja");
                const author = LanguageApp.translate(data.a, "en", "ja");
                return [quote, author];
            } catch (e) {
                console.warn(`[CalendarService] [試行 ${attempt}/${this.maxRetries}] 失敗: ${e.toString()}`);
                if (attempt < this.maxRetries) {
                    Utilities.sleep(this.delayMills);
                }
                console.error("[QuoteService] Error fetching quote:", e);
                return ["fetchの失敗ごとき些末なことよ", "真田悠希"];
            }

        }
    }
}
