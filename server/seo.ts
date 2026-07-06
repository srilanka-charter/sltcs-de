/**
 * server/seo.ts
 * Server-side SEO meta tag injection for Googlebot crawlability.
 * Injects route-specific <title>, <meta description>, <link canonical>,
 * <meta robots>, and <script type="application/ld+json"> into the HTML shell
 * before it is sent to the client.
 */

const BASE_URL = "https://de.srilanka-charter.com";

interface RouteMeta {
  title: string;
  description: string;
  canonical: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>[];
  /** ページ固有のhreflangタグ。未指定時はホームページのデフォルトを使用 */
  hreflangLinks?: Array<{ hreflang: string; href: string }>;
}

// ─── Static route definitions ─────────────────────────────────────────────────
const STATIC_ROUTES: Record<string, RouteMeta> = {
  "/": {
    title: "Sri Lanka Mietwagen mit privatem Fahrer | SLTCS",
    description:
      "Sri Lanka Mietwagen mit privatem Fahrer – Pauschaltarife ohne versteckte Kosten. Englischsprachiger Fahrer, Limousine, Van & Großer Van. Jetzt kostenlos anfragen.",
    canonical: `${BASE_URL}/`,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "SLTCS – Sri Lanka Mietwagen mit privatem Fahrer",
        description:
          "Privater Mietwagenservice in Sri Lanka mit englischsprachigem Fahrer.",
        url: `${BASE_URL}/`,
        address: { "@type": "PostalAddress", addressCountry: "LK" },
        priceRange: "$$$",
      },
    ],
  },
  "/price": {
    title: "Sri Lanka Mietwagen mit Fahrer – Preise & Pauschaltarife | SLTCS",
    description:
      "Sri Lanka Mietwagen mit Fahrer – Pauschaltarife ohne versteckte Kosten. Bronze, Silber & Gold ab $270. Limousine, Van & Großer Van. Jetzt kostenlos anfragen.",
    canonical: `${BASE_URL}/price`,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Sri Lanka Mietwagen mit privatem Fahrer",
        description:
          "Vollständig privater Mietwagenservice in Sri Lanka. Drei Pläne: Bronze, Silber, Gold.",
        url: `${BASE_URL}/price`,
        brand: { "@type": "Brand", name: "SLTCS" },
        offers: [
          {
            "@type": "Offer",
            name: "Bronze-Plan",
            price: "270",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            name: "Silber-Plan",
            price: "310",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            name: "Gold-Plan",
            price: "350",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
        ],
      },
    ],
  },
  "/faq": {
    title:
      "FAQ – Häufig gestellte Fragen | SLTCS Sri Lanka Mietwagen mit privatem Fahrer",
    description:
      "Antworten auf häufige Fragen zu SLTCS: Trinkgeld, Aktivitäten, Zahlung, Stornierung, Fahrervorstellung und mehr.",
    canonical: `${BASE_URL}/faq`,
  },
  "/voice": {
    title: "Kundenstimmen – Sri Lanka Privatfahrer Bewertungen | SLTCS",
    description:
      "Echte Bewertungen von Reisenden, die Sri Lanka mit SLTCS-Privatfahrern erkundet haben. Gesamtbewertung 4,9 ★ – Fahrer, Fahrzeug und Service.",
    canonical: `${BASE_URL}/voice`,
    hreflangLinks: [
      { hreflang: "de", href: "https://de.srilanka-charter.com/voice" },
      { hreflang: "en", href: "https://en.srilanka-charter.com/voice" },
      { hreflang: "fr", href: "https://fr.srilanka-charter.com/voice" },
      { hreflang: "es", href: "https://es.srilanka-charter.com/voice" },
      { hreflang: "nl", href: "https://nl.srilanka-charter.com/voice" },
      { hreflang: "x-default", href: "https://en.srilanka-charter.com/voice" },
    ],
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "SLTCS – Sri Lanka Mietwagen mit privatem Fahrer",
        url: `${BASE_URL}/`,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: 4.9,
          bestRating: 5,
          ratingCount: 22,
          reviewCount: 22,
        },
      },
    ],
  },
  "/thanks": {
    title: "Vielen Dank für Ihre Anfrage | SLTCS",
    description:
      "Ihre Anfrage wurde erfolgreich übermittelt. Wir melden uns innerhalb von 24 Stunden.",
    canonical: `${BASE_URL}/thanks`,
    noindex: true,
  },
  "/information/privater-fahrer-ratgeber": {
    title:
      "Sri Lanka Privater Fahrer Ratgeber: Expertentipps (2026) | SLTCS",
    description:
      "Expertenratgeber für die Buchung eines Privatfahrers in Sri Lanka — Qualifikationen, Kosten und sichere Buchung.",
    canonical: `${BASE_URL}/information/privater-fahrer-ratgeber`,
  },
  "/information/kosten-buchungsratgeber": {
    title:
      "Sri Lanka Fahrer Mietkosten & Buchungsratgeber (2026) | SLTCS",
    description:
      "Transparente Preisübersichten und Buchungs-Checklisten für Privatfahrer in Sri Lanka.",
    canonical: `${BASE_URL}/information/kosten-buchungsratgeber`,
  },
  "/information/familien-gruppenreisen": {
    title:
      "Sri Lanka Familien- & Gruppenreisen mit Privatfahrer (2026) | SLTCS",
    description:
      "Praktische Tipps für Familien, Gruppen und Paare auf Reisen in Sri Lanka mit Privatfahrer.",
    canonical: `${BASE_URL}/information/familien-gruppenreisen`,
  },
  "/information/reise-tipps-sicherheit": {
    title: "Sri Lanka Reise-Tipps & Sicherheitsratgeber (2026) | SLTCS",
    description:
      "Ehrliche, praktische Tipps zur Straßensicherheit und Transportmöglichkeiten in Sri Lanka.",
    canonical: `${BASE_URL}/information/reise-tipps-sicherheit`,
  },
  "/information/beispielreiserouten": {
    title:
      "Sri Lanka Privatfahrer Reiserouten: 4 Nächte bis 2 Wochen (2026) | SLTCS",
    description:
      "Tagesweise Reiserouten mit Privatfahrer in Sri Lanka — von 4 Nächten bis 2 Wochen.",
    canonical: `${BASE_URL}/information/beispielreiserouten`,
  },
};

// ─── Article slug → meta mapping ─────────────────────────────────────────────
// These are the known article slugs. For dynamic articles, we fall back to
// the category meta if the slug is not found.
const ARTICLE_META: Record<
  string,
  { title: string; description: string; category: string }
> = {
  "sri-lanka-privater-fahrer-wie-buchen": {
    title:
      "Sri Lanka Privater Fahrer buchen: Schritt-für-Schritt Anleitung | SLTCS",
    description:
      "Wie bucht man einen privaten Fahrer in Sri Lanka? Vollständige Anleitung zu Buchungsplattformen, Preisen und Sicherheitstipps.",
    category: "privater-fahrer-ratgeber",
  },
  "sri-lanka-mietwagen-mit-fahrer-vollstaendiger-ratgeber": {
    title:
      "Sri Lanka Mietwagen mit Fahrer: Vollständiger Ratgeber 2026 | SLTCS",
    description:
      "Alles, was Sie über die Anmietung eines Mietwagens mit Fahrer in Sri Lanka wissen müssen — Kosten, Fahrzeuge und Buchungstipps.",
    category: "privater-fahrer-ratgeber",
  },
  "chauffeur-guide-sri-lanka-fahrer-vs-reisefuehrer": {
    title:
      "Chauffeur-Guide Sri Lanka: Fahrer vs. Reiseführer – Was ist besser? | SLTCS",
    description:
      "Vergleich zwischen privatem Fahrer und Reiseführer in Sri Lanka. Wann lohnt sich ein Chauffeur-Guide?",
    category: "privater-fahrer-ratgeber",
  },
  "fahrermiete-sri-lanka-kosten-sicherheit-checkliste": {
    title:
      "Fahrermiete Sri Lanka: Kosten, Sicherheit & Buchungs-Checkliste | SLTCS",
    description:
      "Transparente Kosten für die Fahrermiete in Sri Lanka. Sicherheitstipps und Buchungs-Checkliste für Ihren Urlaub.",
    category: "kosten-buchungsratgeber",
  },
  "van-miete-fahrer-sri-lanka-familien-kleingruppen": {
    title:
      "Van-Miete mit Fahrer Sri Lanka: Für Familien & Kleingruppen | SLTCS",
    description:
      "Van-Miete mit privatem Fahrer in Sri Lanka für Familien und Kleingruppen. Preise, Fahrzeuge und Buchungstipps.",
    category: "familien-gruppenreisen",
  },
  "sri-lanka-4-naechte-5-tage-reiseroute": {
    title: "Sri Lanka 4 Nächte / 5 Tage Reiseroute mit Privatfahrer | SLTCS",
    description:
      "Detaillierte 5-Tage-Reiseroute durch Sri Lanka mit privatem Fahrer. Highlights, Unterkünfte und Tipps.",
    category: "beispielreiserouten",
  },
  "sri-lanka-5-naechte-6-tage-reiseroute": {
    title: "Sri Lanka 5 Nächte / 6 Tage Reiseroute mit Privatfahrer | SLTCS",
    description:
      "6-Tage-Reiseroute durch Sri Lanka mit privatem Fahrer — Kulturdreieck, Küste und Bergland.",
    category: "beispielreiserouten",
  },
  "sri-lanka-6-naechte-7-tage-reiseroute": {
    title: "Sri Lanka 6 Nächte / 7 Tage Reiseroute mit Privatfahrer | SLTCS",
    description:
      "7-Tage-Reiseroute durch Sri Lanka mit privatem Fahrer. Tempel, Nationalparks und Strandaufenthalte.",
    category: "beispielreiserouten",
  },
  "sri-lanka-5-7-tage-kulturdreieck-reiseroute": {
    title:
      "Sri Lanka Kulturdreieck Reiseroute: 5–7 Tage mit Privatfahrer | SLTCS",
    description:
      "Das Kulturdreieck Sri Lankas in 5–7 Tagen mit privatem Fahrer entdecken. Sigiriya, Polonnaruwa, Anuradhapura.",
    category: "beispielreiserouten",
  },
  "sri-lanka-10-tage-2-wochen-reiseroute": {
    title:
      "Sri Lanka 10 Tage bis 2 Wochen Reiseroute mit Privatfahrer | SLTCS",
    description:
      "Umfassende 10-Tage- bis 2-Wochen-Reiseroute durch Sri Lanka mit privatem Fahrer. Alle Highlights.",
    category: "beispielreiserouten",
  },
  "beste-reisezeit-sri-lanka": {
    title: "Beste Reisezeit Sri Lanka: Wann reisen? | SLTCS",
    description:
      "Wann ist die beste Reisezeit für Sri Lanka? Klimaübersicht, Monsunzeiten und Reisetipps für jeden Monat.",
    category: "reise-tipps-sicherheit",
  },
};

// ─── Helper: inject meta tags into HTML ───────────────────────────────────────
export function injectSEOMeta(html: string, pathname: string): string {
  // Normalize pathname (remove trailing slash except for root)
  const path =
    pathname === "/" ? "/" : pathname.replace(/\/$/, "").split("?")[0];

  let meta: RouteMeta | null = STATIC_ROUTES[path] || null;

  // Dynamic article pages: /information/:category/:slug
  if (!meta && path.startsWith("/information/")) {
    const parts = path.split("/").filter(Boolean);
    if (parts.length === 3) {
      // /information/:category/:slug
      const slug = parts[2];
      const articleMeta = ARTICLE_META[slug];
      if (articleMeta) {
        meta = {
          title: articleMeta.title,
          description: articleMeta.description,
          canonical: `${BASE_URL}${path}`,
          jsonLd: [
            {
              "@context": "https://schema.org",
              "@type": "Article",
              headline: articleMeta.title,
              description: articleMeta.description,
              url: `${BASE_URL}${path}`,
              author: {
                "@type": "Organization",
                name: "SLTCS – Sri Lanka Mietwagen mit privatem Fahrer",
                url: `${BASE_URL}/`,
              },
              publisher: {
                "@type": "Organization",
                name: "SLTCS – Sri Lanka Mietwagen mit privatem Fahrer",
                url: `${BASE_URL}/`,
              },
            },
          ],
        };
      }
    }
  }

  // Fallback: use homepage meta
  if (!meta) {
    meta = STATIC_ROUTES["/"];
  }

  // Build the injection string
  const titleTag = `<title>${escapeHtml(meta.title)}</title>`;
  const descTag = `<meta name="description" content="${escapeHtml(meta.description)}" />`;
  const canonicalTag = `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`;
  const robotsTag = meta.noindex
    ? `<meta name="robots" content="noindex, nofollow" />`
    : `<meta name="robots" content="index, follow" />`;
  const ogTitleTag = `<meta property="og:title" content="${escapeHtml(meta.title)}" />`;
  const ogDescTag = `<meta property="og:description" content="${escapeHtml(meta.description)}" />`;
  const ogUrlTag = `<meta property="og:url" content="${escapeHtml(meta.canonical)}" />`;

  const jsonLdTags = (meta.jsonLd || [])
    .map(
      (schema, i) =>
        `<script type="application/ld+json" id="ssr-jsonld-${i}">${JSON.stringify(schema)}</script>`
    )
    .join("\n    ");

  // Replace the default <title> tag
  let result = html.replace(
    /<title>[^<]*<\/title>/,
    titleTag
  );

  // Replace or inject meta description
  if (result.includes('name="description"')) {
    result = result.replace(
      /<meta name="description"[^>]*>/,
      descTag
    );
  } else {
    result = result.replace("</head>", `  ${descTag}\n  </head>`);
  }

  // Replace canonical
  if (result.includes('rel="canonical"')) {
    result = result.replace(
      /<link rel="canonical"[^>]*>/,
      canonicalTag
    );
  } else {
    result = result.replace("</head>", `  ${canonicalTag}\n  </head>`);
  }

  // Build hreflang tags
  const hreflangTags = (meta.hreflangLinks || [])
    .map(
      ({ hreflang, href }) =>
        `<link rel="alternate" hreflang="${escapeHtml(hreflang)}" href="${escapeHtml(href)}" />`
    )
    .join("\n    ");

  // If page has custom hreflang, replace existing hreflang links in the HTML
  if (meta.hreflangLinks && meta.hreflangLinks.length > 0) {
    // Remove all existing hreflang alternate links
    result = result.replace(
      /<link\s+rel="alternate"\s+hreflang="[^"]*"\s+href="[^"]*"\s*\/?>/g,
      ""
    );
  }

  // Inject robots meta + hreflang
  result = result.replace(
    "</head>",
    `  ${robotsTag}\n  ${ogTitleTag}\n  ${ogDescTag}\n  ${ogUrlTag}\n  ${hreflangTags ? hreflangTags + "\n  " : ""}${jsonLdTags ? jsonLdTags + "\n  " : ""}</head>`
  );

  return result;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
