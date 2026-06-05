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

## FAQページ作成・ナビゲーション更新

- [x] ドイツ語版FAQ.tsxを新規作成する（英語版と同じ内容をドイツ語訳）
- [x] App.tsxに/faqルートを追加する
- [x] SiteNavbar.tsxのFAQリンクを/faqへ変更し、KONTAKTの右に移動する
- [x] Home.tsxのFAQセクションを削除する
- [x] ビルド確認・チェックポイント保存

## ms/sv言語追加（マレーシア語・スウェーデン語）

- [x] Home.tsxのLANGUAGES配列にms（Malay）・sv（Swedish）を追加する
- [x] index.htmlのhreflangにms・svを追加する
- [x] Pricing.tsxのhreflangData（/priceページ用）にms・svを追加する
- [x] Pricing.tsxのhomepageHreflangs（復元用）にms・svを追加する
- [x] FAQ.tsxのhreflangData（/faqページ用）にms・svを追加する
- [x] FAQ.tsxのhomepageHreflangs（復元用）にms・svを追加する
- [x] ビルド確認・チェックポイント保存

## Informationプルダウン・記事ページ（2026年6月4日分）

- [x] SiteNavbar.tsxにINFORMATIONプルダウンを追加する（3カテゴリー・モバイルアコーディオン対応）
- [x] Home.tsxのNavbarにINFORMATIONプルダウンを追加する
- [x] App.tsxにArticleList・ArticleDetailのルートを追加する
- [x] client/src/data/articles.tsを作成する（3記事ドイツ語訳・公開日2026-06-04）
- [x] ArticleList.tsxをドイツ語版に書き換える（de-DEロケール・SiteNavbar使用）
- [x] ArticleDetail.tsxをドイツ語版に書き換える（de.srilanka-charter.com・ドイツ語UI）
- [x] index.cssに記事ページ用スタイルを追加する（article-list・article-detail・article-toc等）
- [x] index.cssのCSS重複・不完全ブロックを修正する
- [x] ビルド確認（エラー0件）

## 2026年6月5日公開 3記事追加

- [x] 「Was Ihr Tagessatz beinhaltet」ドイツ語版インフォグラフィックを生成する
- [x] 記事003: fahrermiete-sri-lanka-kosten-sicherheit-checkliste（Kosten & Buchungsratgeber）を追加する
- [x] 記事010: van-miete-fahrer-sri-lanka-familien-kleingruppen（Familien- & Gruppenreisen）を追加する
- [x] 記事mi-4n5d: sri-lanka-4-naechte-5-tage-reiseroute（Beispielreiserouten）を追加する
- [x] TypeScriptエラー0件・ビルド確認

## バグ修正（2026-06-05報告）

- [x] ①BEISPIELREISENプルダウンからfahrermiete記事へのリンクが機能しない問題を修正する
- [x] ③Van-Miete記事（010）のアイキャッチ画像を作成してcoverImageに設定する
- [x] ④記事カードの縦幅が見切れる問題とカード内画像が非表示になる問題を修正する

## バグ修正（2026-06-05報告②）

- [x] Van-Miete記事の「6つの利点」カードが右端で見切れる問題を修正する（縦積みレイアウトに変更）
