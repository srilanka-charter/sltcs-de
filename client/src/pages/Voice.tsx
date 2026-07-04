/**
 * Voice.tsx – Kundenstimmen / Gästebewertungen
 * Deutschsprachige Version der englischen VOICE-Seite
 * SEO: useSEO-Hook, H1, JSON-LD (ItemList + Review), noindex: false
 */

import { useMemo } from "react";
import { useSEO } from "@/hooks/useSEO";
import { VOICE_REVIEWS, VOICE_AGGREGATE } from "@/data/voiceReviews";
import SiteNavbar from "@/components/SiteNavbar";

// ─── Star renderer ────────────────────────────────────────────────────────────
function Stars({ score }: { score: number }) {
  const full = Math.floor(score);
  const half = score - full >= 0.5;
  return (
    <span className="voice-stars" aria-label={`${score} von 5 Sternen`}>
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return <span key={i} className="voice-star voice-star--full">★</span>;
        if (i === full && half) return <span key={i} className="voice-star voice-star--half">★</span>;
        return <span key={i} className="voice-star voice-star--empty">★</span>;
      })}
    </span>
  );
}

// ─── Score bar ────────────────────────────────────────────────────────────────
function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="voice-score-bar">
      <span className="voice-score-bar__label">{label}</span>
      <div className="voice-score-bar__track">
        <div
          className="voice-score-bar__fill"
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
      <span className="voice-score-bar__value">{score.toFixed(1)}</span>
    </div>
  );
}

// ─── Single review card ───────────────────────────────────────────────────────
function ReviewCard({ review }: { review: (typeof VOICE_REVIEWS)[0] }) {
  return (
    <article className="voice-review-card">
      {/* Photo */}
      {review.photoUrl && (
        <div className="voice-review-card__photo-wrap">
          <img
            src={review.photoUrl}
            alt={`${review.driverName} mit Gästen`}
            className="voice-review-card__photo"
            loading="lazy"
          />
          <div className="voice-review-card__photo-badge">★ {review.overallScore.toFixed(1)}</div>
        </div>
      )}
      <header className="voice-review-card__header">
        <div className="voice-review-card__driver-badge">
          <span className="voice-review-card__driver-icon">
            {review.driverName.charAt(0)}
          </span>
        </div>
        <div className="voice-review-card__meta">
          <p className="voice-review-card__driver-name">Fahrer: {review.driverName}</p>
          <p className="voice-review-card__guest">
            {review.guestLabel} &middot; {review.passengers}{" "}
            {review.passengers === 1 ? "Reisender" : "Reisende"} &middot; {review.date}
          </p>
          <p className="voice-review-card__route">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            {review.route}
          </p>
        </div>
        <div className="voice-review-card__overall-badge">
          <span>★</span>
          <strong>{review.overallScore.toFixed(1)}</strong>
        </div>
      </header>

      <blockquote className="voice-review-card__quote">
        &ldquo;{review.quote}&rdquo;
      </blockquote>

      <p className="voice-review-card__body">{review.body}</p>

      <footer className="voice-review-card__scores">
        <div className="voice-review-card__overall-row">
          <span className="voice-review-card__overall-label">GESAMT</span>
          <span className="voice-review-card__overall-score">{review.overallScore.toFixed(1)}</span>
          <Stars score={review.overallScore} />
        </div>
        <ScoreBar label="Fahrer" score={review.driverScore} />
        <ScoreBar label="Fahrzeug" score={review.vehicleScore} />
        <ScoreBar label="Betreiber" score={review.operatorScore} />
      </footer>
    </article>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Voice() {
  const jsonLdList = useMemo(() => {
    const reviewItems = VOICE_REVIEWS.map((r, i) => ({
      "@type": "Review",
      position: i + 1,
      author: { "@type": "Person", name: r.guestLabel },
      reviewBody: r.body,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.overallScore,
        bestRating: 5,
        worstRating: 1,
      },
      name: r.quote,
    }));

    return [
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "SLTCS Kundenstimmen – Sri Lanka Mietwagen mit privatem Fahrer",
        description:
          "Echte Bewertungen von Reisenden, die Sri Lanka mit SLTCS-Privatfahrern erkundet haben.",
        url: "https://de.srilanka-charter.com/voice",
        numberOfItems: VOICE_REVIEWS.length,
        itemListElement: reviewItems,
      },
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "SLTCS – Sri Lanka Mietwagen mit privatem Fahrer",
        url: "https://de.srilanka-charter.com/",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: VOICE_AGGREGATE.overall,
          bestRating: 5,
          ratingCount: VOICE_REVIEWS.length,
          reviewCount: VOICE_REVIEWS.length,
        },
      },
    ];
  }, []);

  useSEO({
    title: "Kundenstimmen – Sri Lanka Privatfahrer Bewertungen | SLTCS",
    description:
      "Echte Bewertungen von Reisenden, die Sri Lanka mit SLTCS-Privatfahrern erkundet haben. Gesamtbewertung 4,9 ★ – Fahrer, Fahrzeug und Service.",
    path: "/voice",
    jsonLdList,
    jsonLdIdPrefix: "voice",
  });

  const scrollToContact = () => {
    window.location.href = "/#contact";
  };

  return (
    <div className="voice-page">
      <SiteNavbar mode="page" />
      {/* ── Back link ── */}
      <a href="/" className="voice-back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Zurück zur Startseite
      </a>

      {/* ── Hero ── */}
      <section className="voice-hero">
        <p className="voice-hero__eyebrow">— VOICE —</p>
        <h1 className="voice-hero__title">Was unsere Gäste sagen</h1>
        <p className="voice-hero__subtitle">
          Echte Bewertungen von Reisenden, die Sri Lanka mit SLTCS-Privatfahrern erkundet haben.
        </p>

        {/* Aggregate scores */}
        <div className="voice-aggregate">
          <div className="voice-aggregate__overall">
            <span className="voice-aggregate__score">{VOICE_AGGREGATE.overall.toFixed(1)}</span>
            <span className="voice-aggregate__label">GESAMT</span>
          </div>
          <div className="voice-aggregate__divider" />
          <div className="voice-aggregate__sub">
            <div className="voice-aggregate__sub-item">
              <span className="voice-aggregate__sub-score">{VOICE_AGGREGATE.driver.toFixed(1)}</span>
              <span className="voice-aggregate__sub-label">FAHRER</span>
            </div>
            <div className="voice-aggregate__sub-item">
              <span className="voice-aggregate__sub-score">{VOICE_AGGREGATE.vehicle.toFixed(1)}</span>
              <span className="voice-aggregate__sub-label">FAHRZEUG</span>
            </div>
            <div className="voice-aggregate__sub-item">
              <span className="voice-aggregate__sub-score">{VOICE_AGGREGATE.operator.toFixed(1)}</span>
              <span className="voice-aggregate__sub-label">BETREIBER</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Review list ── */}
      <section className="voice-reviews" aria-label="Kundenbewertungen">
        {VOICE_REVIEWS.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </section>

      {/* ── CTA ── */}
      <section className="voice-cta">
        <h2 className="voice-cta__title">Bereit, Ihre eigene Geschichte zu schreiben?</h2>
        <p className="voice-cta__body">
          Schließen Sie sich Hunderten von Reisenden an, die Sri Lanka mit unseren Privatfahrern erkundet haben.
        </p>
        <button className="voice-cta__btn" onClick={scrollToContact}>
          KOSTENLOSE ANFRAGE
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className="voice-footer">
        <p>© 2025 SLTCS – Sri Lanka Mietwagen mit privatem Fahrer · de.srilanka-charter.com</p>
      </footer>
    </div>
  );
}
