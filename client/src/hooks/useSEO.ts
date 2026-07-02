import { useEffect } from "react";

const BASE_URL = "https://de.srilanka-charter.com";

const HREFLANG_PATHS: Record<string, string> = {
  de: BASE_URL,
  en: "https://en.srilanka-charter.com",
  fr: "https://fr.srilanka-charter.com",
  es: "https://es.srilanka-charter.com",
  ru: "https://ru.srilanka-charter.com",
  nl: "https://nl.srilanka-charter.com",
  ja: "https://sltcs.srilanka-charter.com",
  ms: "https://ms.srilanka-charter.com",
  sv: "https://sv.srilanka-charter.com",
};

export interface SEOOptions {
  /** ページタイトル（<title>タグに設定） */
  title: string;
  /** メタディスクリプション（120〜160文字推奨） */
  description: string;
  /** このページのパス（例: "/price"）。省略時はホームページ "/" */
  path?: string;
  /** OGP画像URL */
  ogImage?: string;
  /** noindexが必要なページはtrueを設定（ThankYouPage等） */
  noindex?: boolean;
  /** JSON-LD構造化データの配列 */
  jsonLdList?: Record<string, unknown>[];
  /** JSON-LD <script>タグのid属性プレフィックス */
  jsonLdIdPrefix?: string;
  /** hreflangリンクを生成するかどうか（デフォルト: true） */
  hreflang?: boolean;
  /** カスタムhreflangマッピング（パスが各言語で異なる場合） */
  hreflangOverrides?: Record<string, string>;
}

/**
 * ページ固有のSEOメタタグを設定するフック。
 * document.titleを直接操作する useEffect の代わりに必ずこのフックを使うこと。
 */
export function useSEO({
  title,
  description,
  path = "/",
  ogImage,
  noindex = false,
  jsonLdList,
  jsonLdIdPrefix,
  hreflang: enableHreflang = true,
  hreflangOverrides,
}: SEOOptions): void {
  useEffect(() => {
    const canonicalUrl = `${BASE_URL}${path}`;

    // ─── title ───────────────────────────────────────────────────────────────
    const prevTitle = document.title;
    document.title = title;

    // ─── meta description ────────────────────────────────────────────────────
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDesc = metaDesc?.content ?? "";
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // ─── canonical ───────────────────────────────────────────────────────────
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const prevCanonical = canonical?.href ?? "";
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // ─── noindex ─────────────────────────────────────────────────────────────
    let robotsMeta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const prevRobots = robotsMeta?.content ?? "";
    if (noindex) {
      if (!robotsMeta) {
        robotsMeta = document.createElement("meta");
        robotsMeta.name = "robots";
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.content = "noindex, nofollow";
    } else {
      if (robotsMeta) {
        robotsMeta.content = "index, follow";
      }
    }

    // ─── OGP ─────────────────────────────────────────────────────────────────
    const setOg = (property: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    setOg("og:title", title);
    setOg("og:description", description);
    setOg("og:url", canonicalUrl);
    setOg("og:type", "website");
    setOg("og:locale", "de_DE");
    if (ogImage) {
      setOg("og:image", ogImage);
    }

    // ─── Twitter Card ─────────────────────────────────────────────────────────
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.name = name;
        document.head.appendChild(el);
      }
      el.content = content;
    };
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    if (ogImage) {
      setMeta("twitter:image", ogImage);
    }

    // ─── hreflang ────────────────────────────────────────────────────────────
    const addedHreflangEls: HTMLLinkElement[] = [];
    if (enableHreflang) {
      // Remove existing hreflang links (from index.html homepage defaults)
      const existingHreflangs = document.querySelectorAll<HTMLLinkElement>(
        'link[rel="alternate"][hreflang]'
      );
      existingHreflangs.forEach((el) => el.remove());

      // Add page-specific hreflang links
      Object.entries(HREFLANG_PATHS).forEach(([lang, baseHref]) => {
        const href = hreflangOverrides?.[lang] ?? `${baseHref}${path}`;
        const link = document.createElement("link");
        link.rel = "alternate";
        link.setAttribute("hreflang", lang);
        link.href = href;
        document.head.appendChild(link);
        addedHreflangEls.push(link);
      });

      // x-default
      const xDefault = document.createElement("link");
      xDefault.rel = "alternate";
      xDefault.setAttribute("hreflang", "x-default");
      xDefault.href = hreflangOverrides?.["x-default"] ??
        `${HREFLANG_PATHS["en"]}${path}`;
      document.head.appendChild(xDefault);
      addedHreflangEls.push(xDefault);
    }

    // ─── JSON-LD ─────────────────────────────────────────────────────────────
    const addedJsonLdEls: HTMLScriptElement[] = [];
    if (jsonLdList && jsonLdList.length > 0) {
      jsonLdList.forEach((schema, index) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.id = jsonLdIdPrefix
          ? `jsonld-${jsonLdIdPrefix}-${index}`
          : `jsonld-${index}`;
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
        addedJsonLdEls.push(script);
      });
    }

    // ─── cleanup ─────────────────────────────────────────────────────────────
    return () => {
      document.title = prevTitle;
      if (metaDesc) metaDesc.content = prevDesc;
      if (canonical) canonical.href = prevCanonical;
      if (robotsMeta) robotsMeta.content = prevRobots;

      // Remove added hreflang links and restore homepage defaults
      addedHreflangEls.forEach((el) => el.remove());
      if (enableHreflang) {
        const homepageHreflangs = [
          { hreflang: "de", href: "https://de.srilanka-charter.com/" },
          { hreflang: "en", href: "https://en.srilanka-charter.com/" },
          { hreflang: "fr", href: "https://fr.srilanka-charter.com/" },
          { hreflang: "es", href: "https://es.srilanka-charter.com/" },
          { hreflang: "ru", href: "https://ru.srilanka-charter.com/" },
          { hreflang: "nl", href: "https://nl.srilanka-charter.com/" },
          { hreflang: "ja", href: "https://sltcs.srilanka-charter.com/" },
          { hreflang: "ms", href: "https://ms.srilanka-charter.com/" },
          { hreflang: "sv", href: "https://sv.srilanka-charter.com/" },
          { hreflang: "x-default", href: "https://en.srilanka-charter.com/" },
        ];
        homepageHreflangs.forEach(({ hreflang, href }) => {
          const link = document.createElement("link");
          link.rel = "alternate";
          link.setAttribute("hreflang", hreflang);
          link.href = href;
          document.head.appendChild(link);
        });
      }

      // Remove added JSON-LD scripts
      addedJsonLdEls.forEach((el) => el.remove());
    };
  }, [title, description, path, ogImage, noindex, jsonLdList, jsonLdIdPrefix, enableHreflang, hreflangOverrides]);
}
