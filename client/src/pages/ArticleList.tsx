/**
 * ArticleList.tsx
 * Category article listing page
 * Route: /information/:category
 */

import { useParams, Link } from "wouter";
import { CATEGORIES, getArticlesByCategory, type ArticleCategory } from "@/data/articles";
import { useEffect } from "react";
import SiteNavbar from "@/components/SiteNavbar";

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

function Breadcrumb({ categoryLabel }: { categoryLabel: string }) {
  return (
    <nav className="article-breadcrumb" aria-label="Breadcrumb">
      <Link href="/">Startseite</Link>
      <span className="breadcrumb-sep">›</span>
      <Link href="/">Information</Link>
      <span className="breadcrumb-sep">›</span>
      <span className="breadcrumb-current">{categoryLabel}</span>
    </nav>
  );
}

// ─── Article Card ─────────────────────────────────────────────────────────────

function ArticleCard({
  slug,
  category,
  title,
  excerpt,
  coverImage,
  publishedAt,
  readingTime,
  categoryLabel,
}: {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  readingTime: number;
  categoryLabel: string;
}) {
  const formattedDate = new Date(publishedAt).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/information/${category}/${slug}`} className="article-card-link">
      <article className="article-card">
        <div className="article-card-image-wrap">
          <img
            src={coverImage}
            alt={title}
            className="article-card-image"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='240' viewBox='0 0 400 240'%3E%3Crect width='400' height='240' fill='%231a1a1a'/%3E%3Ctext x='200' y='120' text-anchor='middle' fill='%23c9a84c' font-family='serif' font-size='14'%3ESLTCS%3C/text%3E%3C/svg%3E";
            }}
          />
          <span className="article-card-category-badge">{categoryLabel}</span>
        </div>
        <div className="article-card-body">
          <h2 className="article-card-title">{title}</h2>
          <p className="article-card-excerpt">{excerpt}</p>
          <div className="article-card-meta">
            <span className="article-card-date">{formattedDate}</span>
            <span className="article-card-reading-time">{readingTime} Min. Lesezeit</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── Article List Page ────────────────────────────────────────────────────────

// ─── Category-to-hreflang mapping ────────────────────────────────────────────
const CATEGORY_HREFLANG: Record<string, Record<string, string>> = {
  "privater-fahrer-ratgeber": {
    de: "https://de.srilanka-charter.com/information/privater-fahrer-ratgeber",
    en: "https://en.srilanka-charter.com/information/private-driver-guide",
    fr: "https://fr.srilanka-charter.com/information/guide-chauffeur-prive",
    es: "https://es.srilanka-charter.com/information/guia-conductor-privado",
  },
  "kosten-buchungsratgeber": {
    de: "https://de.srilanka-charter.com/information/kosten-buchungsratgeber",
    en: "https://en.srilanka-charter.com/information/cost-booking-guide",
    fr: "https://fr.srilanka-charter.com/information/guide-cout-reservation",
    es: "https://es.srilanka-charter.com/information/guia-costes-reserva",
  },
  "familien-gruppenreisen": {
    de: "https://de.srilanka-charter.com/information/familien-gruppenreisen",
    en: "https://en.srilanka-charter.com/information/family-group-travel",
    fr: "https://fr.srilanka-charter.com/information/voyage-famille-groupe",
    es: "https://es.srilanka-charter.com/information/viajes-familia-grupos",
  },
  "reise-tipps-sicherheit": {
    de: "https://de.srilanka-charter.com/information/reise-tipps-sicherheit",
    en: "https://en.srilanka-charter.com/information/travel-tips-safety",
    fr: "https://fr.srilanka-charter.com/information/conseils-securite",
  },
  "beispielreiserouten": {
    de: "https://de.srilanka-charter.com/information/beispielreiserouten",
    en: "https://en.srilanka-charter.com/information/model-itinerary",
    fr: "https://fr.srilanka-charter.com/information/itineraires",
    es: "https://es.srilanka-charter.com/information/itinerarios",
  },
};

export default function ArticleList() {
  const params = useParams<{ category: string }>();
  const categorySlug = params.category as ArticleCategory;
  const categoryMeta = CATEGORIES[categorySlug];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [categorySlug]);

  // SEO head injection for category listing pages
  useEffect(() => {
    if (!categoryMeta) return;

    const categoryTitles: Record<string, string> = {
      "privater-fahrer-ratgeber": "Sri Lanka Privater Fahrer Ratgeber: Expertentipps (2026) | SLTCS",
      "kosten-buchungsratgeber": "Sri Lanka Fahrer Mietkosten & Buchungsratgeber (2026) | SLTCS",
      "familien-gruppenreisen": "Sri Lanka Familien- & Gruppenreisen mit Privatfahrer (2026) | SLTCS",
      "reise-tipps-sicherheit": "Sri Lanka Reise-Tipps & Sicherheitsratgeber (2026) | SLTCS",
      "beispielreiserouten": "Sri Lanka Privatfahrer Reiserouten: 4 Nächte bis 2 Wochen (2026) | SLTCS",
    };
    const categoryDescriptions: Record<string, string> = {
      "privater-fahrer-ratgeber": "Expertenratgeber für die Buchung eines Privatfahrers in Sri Lanka — Qualifikationen, Kosten und sichere Buchung.",
      "kosten-buchungsratgeber": "Transparente Preisübersichten und Buchungs-Checklisten für Privatfahrer in Sri Lanka. Bronze ab 270$, Silber ab 310$, Gold ab 350$ für 2 Tage.",
      "familien-gruppenreisen": "Praktische Tipps für Familien, Gruppen und Paare auf Reisen in Sri Lanka mit Privatfahrer.",
      "reise-tipps-sicherheit": "Ehrliche, praktische Tipps zur Straßensicherheit und Transportmöglichkeiten in Sri Lanka.",
      "beispielreiserouten": "Tagesweise Reiserouten mit Privatfahrer in Sri Lanka — von 4 Nächten bis 2 Wochen.",
    };

    const title = categoryTitles[categorySlug] || `${categoryMeta.label} | SLTCS`;
    const description = categoryDescriptions[categorySlug] || categoryMeta.description;
    const canonicalUrl = `https://de.srilanka-charter.com${categoryMeta.path}`;

    const prevTitle = document.title;
    document.title = title;

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.name = name; document.head.appendChild(el); }
      el.content = content;
    };

    const prevDesc = (document.querySelector('meta[name="description"]') as HTMLMetaElement)?.content || "";
    setMeta("description", description);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const prevCanonical = canonical?.href || "https://de.srilanka-charter.com/";
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = canonicalUrl;

    // ─ hreflang ──────────────────────────────────────────────────────────────────
    const hreflangMap = CATEGORY_HREFLANG[categorySlug] || {};
    const hreflangData = Object.entries(hreflangMap).map(([lang, href]) => ({ hreflang: lang, href }));
    if (hreflangData.length > 0) {
      hreflangData.push({ hreflang: "x-default", href: hreflangMap["en"] || canonicalUrl });
    }
    const existingHreflangs = document.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]');
    existingHreflangs.forEach((el) => el.remove());
    const addedHreflangs: HTMLLinkElement[] = [];
    hreflangData.forEach(({ hreflang, href }) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.setAttribute("hreflang", hreflang);
      link.href = href;
      document.head.appendChild(link);
      addedHreflangs.push(link);
    });

    return () => {
      document.title = prevTitle;
      (document.querySelector('meta[name="description"]') as HTMLMetaElement | null)?.setAttribute("content", prevDesc);
      canonical!.href = prevCanonical;
      addedHreflangs.forEach((el) => el.remove());
    };
  }, [categorySlug, categoryMeta]);

  if (!categoryMeta) {
    return (
      <div className="article-list-page">
        <SiteNavbar mode="page" />
        <div className="article-list-container" style={{ paddingTop: "100px" }}>
          <h1 style={{ color: "#fff" }}>Kategorie nicht gefunden</h1>
          <Link href="/" style={{ color: "#c9a84c" }}>Zurück zur Startseite</Link>
        </div>
      </div>
    );
  }

  const articles = getArticlesByCategory(categorySlug);

  return (
    <div className="article-list-page">
      <SiteNavbar mode="page" />

      {/* ── Page Header ── */}
      <header className="article-list-header">
        <div className="article-list-header-inner">
          <div className="article-list-header-text">
            <h1 className="article-list-title">
              {categoryMeta.label}
              <span className="article-list-title-sub"> — Kategorie —</span>
            </h1>
            <div className="article-list-title-bar" />
          </div>
          <Breadcrumb categoryLabel={categoryMeta.label} />
          <p className="article-list-description">{categoryMeta.description}</p>
        </div>
      </header>

      {/* ── Article Grid ── */}
      <main className="article-list-container">
        {articles.length === 0 ? (
          <div className="article-list-empty">
            <p>Noch keine Artikel in dieser Kategorie. Schauen Sie bald wieder vorbei.</p>
            <Link href="/" className="article-back-link">
              Zurück zur Startseite
            </Link>
          </div>
        ) : (
          <div className="article-grid">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                slug={article.slug}
                category={article.category}
                title={article.title}
                excerpt={article.excerpt}
                coverImage={article.coverImage}
                publishedAt={article.publishedAt}
                readingTime={article.readingTime}
                categoryLabel={categoryMeta.label}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Back to Home ── */}
      <div className="article-list-footer">
        <Link href="/" className="article-back-home">
          ← Zurück zur Startseite
        </Link>
      </div>
    </div>
  );
}
