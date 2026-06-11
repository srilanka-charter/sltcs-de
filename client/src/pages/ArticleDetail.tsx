/**
 * ArticleDetail.tsx
 * Individual article page with SEO meta tags, structured content, and auto-generated Table of Contents
 * Route: /information/:category/:slug
 */

import { useParams, Link } from "wouter";
import { getArticleBySlug, CATEGORIES, getArticlesByCategory, type ArticleCategory } from "@/data/articles";
import { useEffect, useMemo } from "react";
import SiteNavbar from "@/components/SiteNavbar";

// ─── TOC Utilities ────────────────────────────────────────────────────────────

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function extractToc(html: string): { toc: TocItem[]; htmlWithIds: string } {
  const toc: TocItem[] = [];
  const idCount: Record<string, number> = {};

  const htmlWithIds = html.replace(/<(h[23])([^>]*)>([\s\S]*?)<\/h[23]>/gi, (match, tag, attrs, inner) => {
    const level = parseInt(tag[1], 10) as 2 | 3;
    const text = inner.replace(/<[^>]+>/g, "").trim();
    if (!text) return match;

    const existingIdMatch = attrs.match(/id="([^"]+)"/);
    if (existingIdMatch) {
      toc.push({ id: existingIdMatch[1], text, level });
      return match;
    }

    const baseId = slugifyHeading(text);
    if (!baseId) return match;

    const count = idCount[baseId] ?? 0;
    idCount[baseId] = count + 1;
    const id = count === 0 ? baseId : `${baseId}-${count}`;

    toc.push({ id, text, level });
    return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
  });

  return { toc, htmlWithIds };
}

// ─── TableOfContents Component ────────────────────────────────────────────────

function TableOfContents({ toc }: { toc: TocItem[] }) {
  if (toc.length < 2) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav className="article-toc" aria-label="Inhaltsverzeichnis">
      <p className="article-toc-title">Inhaltsverzeichnis</p>
      <ol className="article-toc-list">
        {toc.map((item) => (
          <li
            key={item.id}
            style={item.level === 3 ? { paddingLeft: "1.2rem", listStyleType: "none" } : undefined}
          >
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
            >
              {item.level === 3 ? "↳ " : ""}{item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ─── Related Article Card (small) ────────────────────────────────────────────

function RelatedCard({
  slug,
  category,
  title,
  coverImage,
  publishedAt,
}: {
  slug: string;
  category: string;
  title: string;
  coverImage: string;
  publishedAt: string;
}) {
  const formattedDate = new Date(publishedAt).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <Link href={`/information/${category}/${slug}`} className="related-card-link">
      <div className="related-card">
        <div className="related-card-image-wrap">
          <img
            src={coverImage}
            alt={title}
            className="related-card-image"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120' viewBox='0 0 200 120'%3E%3Crect width='200' height='120' fill='%231a1a1a'/%3E%3Ctext x='100' y='60' text-anchor='middle' fill='%23c9a84c' font-family='serif' font-size='12'%3ESLTCS%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>
        <div className="related-card-body">
          <p className="related-card-title">{title}</p>
          <span className="related-card-date">{formattedDate}</span>
        </div>
      </div>
    </Link>
  );
}

// ─── Article Detail Page ──────────────────────────────────────────────────────

export default function ArticleDetail() {
  const params = useParams<{ category: string; slug: string }>();
  const article = getArticleBySlug(params.slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [params.slug]);

  // Update document title and meta for SEO
  useEffect(() => {
    if (!article) return;
    document.title = article.seo.metaTitle;

    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = article.seo.metaDescription;

    let metaKw = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null;
    if (!metaKw) {
      metaKw = document.createElement("meta");
      metaKw.name = "keywords";
      document.head.appendChild(metaKw);
    }
    metaKw.content = article.seo.keywords.join(", ");

    const setOg = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    setOg("og:title", article.seo.metaTitle);
    setOg("og:description", article.seo.metaDescription);
    setOg("og:image", article.coverImage);
    setOg("og:type", "article");
    setOg("og:url", `https://de.srilanka-charter.com/information/${article.category}/${article.slug}`);
    setOg("og:site_name", "SLTCS | Sri Lanka Mietwagen mit privatem Fahrer");
    setOg("og:locale", "de_DE");
    setOg("og:image:width", "1200");
    setOg("og:image:height", "630");

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.name = name;
        document.head.appendChild(el);
      }
      el.content = content;
    };
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", article.seo.metaTitle);
    setMeta("twitter:description", article.seo.metaDescription);
    setMeta("twitter:image", article.coverImage);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const prevCanonical = canonical?.href || "https://de.srilanka-charter.com/";
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `https://de.srilanka-charter.com/information/${article.category}/${article.slug}`;

    // hreflang alternate links
    const existingHreflang = document.querySelectorAll('link[hreflang]');
    existingHreflang.forEach(el => el.remove());
    // de (self)
    const hreflangDe = document.createElement('link');
    hreflangDe.rel = 'alternate';
    hreflangDe.setAttribute('hreflang', 'de');
    hreflangDe.href = `https://de.srilanka-charter.com/information/${article.category}/${article.slug}`;
    document.head.appendChild(hreflangDe);
    // en / fr / es cross-links
    const hreflangLangs: Array<'en' | 'fr' | 'es'> = ['en', 'fr', 'es'];
    hreflangLangs.forEach((lang) => {
      const url = (article.hreflang as Record<string, string> | undefined)?.[lang];
      if (url) {
        const link = document.createElement('link');
        link.rel = 'alternate';
        link.setAttribute('hreflang', lang);
        link.href = url;
        document.head.appendChild(link);
      }
    });

    // Article JSON-LD
    const articleJsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.seo.metaDescription,
      image: article.coverImage,
      datePublished: article.publishedAt,
      dateModified: article.publishedAt,
      author: {
        "@type": "Organization",
        name: "SLTCS – Sri Lanka Mietwagen mit privatem Fahrer",
        url: "https://de.srilanka-charter.com/",
      },
      publisher: {
        "@type": "Organization",
        name: "SLTCS – Sri Lanka Mietwagen mit privatem Fahrer",
        url: "https://de.srilanka-charter.com/",
        logo: {
          "@type": "ImageObject",
          url: "https://de.srilanka-charter.com/favicon-192.png",
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://de.srilanka-charter.com/information/${article.category}/${article.slug}`,
      },
      keywords: article.seo.keywords.join(", "),
    };
    const articleScript = document.createElement("script");
    articleScript.type = "application/ld+json";
    articleScript.id = "article-jsonld";
    articleScript.textContent = JSON.stringify(articleJsonLd);
    document.head.appendChild(articleScript);

    return () => {
      document.querySelectorAll('link[hreflang]').forEach(el => el.remove());
      document.title = "SLTCS｜Sri Lanka Mietwagen mit privatem Fahrer";
      canonical!.href = prevCanonical;
      document.getElementById("article-jsonld")?.remove();
    };
  }, [article]);

  const { toc, htmlWithIds } = useMemo(() => {
    if (!article) return { toc: [], htmlWithIds: "" };
    return extractToc(article.content);
  }, [article]);

  if (!article) {
    return (
      <div className="article-detail-page">
        <SiteNavbar mode="page" />
        <div className="article-detail-layout">
          <h1 style={{ color: "#fff", marginTop: "80px" }}>Artikel nicht gefunden</h1>
          <Link href="/information/privater-fahrer-ratgeber" style={{ color: "#c9a84c" }}>Zurück zum Privater Fahrer Ratgeber</Link>
        </div>
      </div>
    );
  }

  const categoryMeta = CATEGORIES[article.category as ArticleCategory];
  const relatedArticles = getArticlesByCategory(article.category as ArticleCategory).filter(
    (a) => a.slug !== article.slug
  );

  const formattedDate = new Date(article.publishedAt).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://de.srilanka-charter.com/" },
      { "@type": "ListItem", position: 2, name: "Information", item: `https://de.srilanka-charter.com${categoryMeta.path}` },
      { "@type": "ListItem", position: 3, name: categoryMeta.label, item: `https://de.srilanka-charter.com${categoryMeta.path}` },
      { "@type": "ListItem", position: 4, name: article.title, item: `https://de.srilanka-charter.com/information/${article.category}/${article.slug}` },
    ],
  };

  return (
    <div className="article-detail-page">
      <SiteNavbar mode="page" />

      {/* ── JSON-LD BreadcrumbList ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ── Hero Image ── */}
      <div className="article-detail-hero">
        <img
          src={article.coverImage}
          alt={article.title}
          className="article-detail-hero-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='480' viewBox='0 0 1200 480'%3E%3Crect width='1200' height='480' fill='%230d0d0d'/%3E%3Ctext x='600' y='240' text-anchor='middle' fill='%23c9a84c' font-family='serif' font-size='24'%3ESLTCS%3C/text%3E%3C/svg%3E";
          }}
        />
        <div className="article-detail-hero-overlay" />
        <div className="article-detail-hero-content">
          <span className="article-detail-category-badge">{categoryMeta.label}</span>
          <h1 className="article-detail-title">{article.title}</h1>
          <div className="article-detail-meta">
            <span>{formattedDate}</span>
            <span className="article-detail-meta-sep">·</span>
            <span>{article.readingTime} Min. Lesezeit</span>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="article-detail-layout">
        {/* Breadcrumb */}
        <nav className="article-breadcrumb" aria-label="Breadcrumb">
          <ol className="breadcrumb-list">
            <li className="breadcrumb-item">
              <Link href="/">Startseite</Link>
            </li>
            <li className="breadcrumb-sep" aria-hidden="true">›</li>
            <li className="breadcrumb-item">
              <Link href={categoryMeta.path}>Information</Link>
            </li>
            <li className="breadcrumb-sep" aria-hidden="true">›</li>
            <li className="breadcrumb-item">
              <Link href={categoryMeta.path}>{categoryMeta.label}</Link>
            </li>
            <li className="breadcrumb-sep" aria-hidden="true">›</li>
            <li className="breadcrumb-item breadcrumb-current" aria-current="page">
              <span>{article.title}</span>
            </li>
          </ol>
        </nav>

        <div className="article-detail-content-wrap">
          {/* Article Body */}
          <main className="article-detail-main">
            {/* Tags */}
            <div className="article-tags">
              {article.tags.map((tag) => (
                <span key={tag} className="article-tag">
                  {tag}
                </span>
              ))}
            </div>

            {/* ── Table of Contents (auto-generated) ── */}
            <TableOfContents toc={toc} />

            {/* Content */}
            <div
              className="article-detail-body"
              dangerouslySetInnerHTML={{ __html: htmlWithIds }}
            />
          </main>

          {/* Sidebar */}
          <aside className="article-detail-sidebar">
            {/* Back to category */}
            <div className="sidebar-section">
              <Link href={categoryMeta.path} className="sidebar-back-link">
                ← {categoryMeta.label}
              </Link>
            </div>

            {/* Related articles */}
            {relatedArticles.length > 0 && (
              <div className="sidebar-section">
                <h3 className="sidebar-section-title">Ähnliche Artikel</h3>
                <div className="related-articles-list">
                  {relatedArticles.slice(0, 4).map((rel) => (
                    <RelatedCard
                      key={rel.id}
                      slug={rel.slug}
                      category={rel.category}
                      title={rel.title}
                      coverImage={rel.coverImage}
                      publishedAt={rel.publishedAt}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="sidebar-cta">
              <p className="sidebar-cta-text">
                Bereit, Ihre Sri-Lanka-Reise zu planen? Erhalten Sie ein kostenloses, unverbindliches Angebot.
              </p>
              <a href="/#contact" className="sidebar-cta-btn">
                Kostenlose Anfrage
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
