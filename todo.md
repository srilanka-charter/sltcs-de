# SLTCS-DE Project TODO

## ドイツ語サイト構築

- [x] Home.tsx を英語版ベースにドイツ語テキストで実装する
- [x] Thanks.tsx をドイツ語で実装する
- [x] index.html に canonical・hreflang（全5言語）を設定する
- [x] カスタム日付ピッカーの月名・曜日名をドイツ語にローカライズする
- [x] お問い合わせフォームの tRPC バックエンドを設定する（メール送信）
- [x] App.tsx に Thanks ページのルートを追加する
- [x] 全17枚の画像をwebdev-static-assetsにアップロードしてURLを更新する
- [x] sitemap.xmlをドイツ語用に作成する
- [x] Gmail認証情報（GMAIL_USER, GMAIL_APP_PASSWORD）を設定する
- [x] vitestテストを作成・実行して全テスト通過を確認する
- [x] TypeScriptエラーを全て解消する
- [x] ビルドを確認してエラーがないことを検証する
- [x] チェックポイントを保存してデプロイする

## 既存サイトの hreflang 更新

- [x] sltcs-en の index.html にドイツ語 hreflang を追加して GitHub を更新する
- [x] srilanka-charter-fr の index.html にドイツ語 hreflang を追加して GitHub を更新する
- [x] srilanka-charter-es の index.html にドイツ語 hreflang を追加して GitHub を更新する
- [x] srilanka-charter-ru の index.html にドイツ語 hreflang を追加して GitHub を更新する

## hreflang追加（nl/ja）

- [x] sltcs-de の index.html に nl/ja hreflang を追加する
- [x] sltcs-en の index.html に nl/ja hreflang を追加して GitHub にプッシュする
- [x] srilanka-charter-fr の index.html に nl/ja hreflang を追加して GitHub にプッシュする
- [x] srilanka-charter-es の index.html に nl/ja hreflang を追加して GitHub にプッシュする
- [x] srilanka-charter-ru の index.html に nl/ja hreflang を追加して GitHub にプッシュする

## 言語切り替えプルダウン

- [x] ヘッダーのKONTAKTの横に言語切り替えプルダウンを追加する（英語表記、7言語リンク）

## /priceページ作成・ヘッダー更新

- [x] 英語サイトの/priceページのソースコードを確認する
- [x] /priceページをドイツ語訳してsltcs-deに実装する（Pricing.tsx）
- [x] App.tsxに/priceルートを追加する
- [x] ヘッダーナビゲーションにPREISリンクを追加する
- [x] Home.tsxにPricingPreviewセクション（Pauschalpreisliste）をドイツ語版で追加する
- [x] ビルド確認・チェックポイント保存

## /priceページ SEO最適化

- [x] Pricing.tsxのdocument.titleをSEO最適化する（キーワード重視）
- [x] Pricing.tsxのmeta descriptionを最適化する（50～160文字、ドイツ語キーワード重視）
- [x] Pricing.tsxにcanonicalタグの動的設定を追加する（/priceページ用URL）
- [x] Pricing.tsxにhreflangの動的設定を追加する（/priceページ用７言語URL）
- [x] ビルド確認・チェックポイント保存
