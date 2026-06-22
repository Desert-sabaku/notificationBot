# 必要物

* [`bun`](https://bun.sh/)
* [`clasp`](https://github.com/google/clasp)

# 使い方

```shell
git clone https://github.com/Desert-sabaku/notificationBot.git # clone the repo
bun install # install dependencies
clasp create --title "ANY_NAME_YOU_LIKE"  --type standalone; # create the project on GAS
bun run deploy # build & upload
```

こののち，GASプロジェクトページにて，以下を設定する．

1. [スクリプト プロパティ](https://developers.google.com/apps-script/reference/properties?hl=ja)
2. トリガー

1で設定する変数は以下の通り．
* `CALENDAR_ID`: Google CalendarのID（必須）
* `QUOTE_URL`: Zen Quote APIを利用しているため，そのエンドポイント（推奨）
* `WEBHOOK_URL`: Discord Webhookのエンドポイント（必須）
* `TEST_WEBHOOK_URL`: Discord Webhookのテスト用エンドポイント（お好きに）
