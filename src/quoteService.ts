export default class QuoteService {
    constructor(
        private defaultUrl: string = "https://zenquotes.io/api/random",
        private maxRetries: number = 3,
        private delayMills: number = 2000,
    ) {}

    public fetchQuote(url = this.defaultUrl): string[] {
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                const response = UrlFetchApp.fetch(url);
                if (response.getResponseCode() !== 200) {
                    throw new Error(`Status: ${response.getResponseCode()}`);
                }

                const data = JSON.parse(response.getContentText())[0];
                const quote = LanguageApp.translate(data.q, "en", "ja");
                const author = LanguageApp.translate(data.a, "en", "ja");
                return [quote, author];
            } catch (e) {
                console.warn(
                    `[QuoteService] [試行 ${attempt}/${this.maxRetries}] 失敗: ${String(e)}`,
                );
                if (attempt < this.maxRetries) {
                    Utilities.sleep(this.delayMills);
                } else {
                    console.error("[QuoteService] Error fetching quote:", e);
                }
            }
        }

        return ["fetchの失敗ごとき些末なことよ", "真田悠希"];
        // catchの中に書くとts(2366)エラーになる
    }
}
