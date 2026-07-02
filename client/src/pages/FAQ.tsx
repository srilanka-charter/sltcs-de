import { useState, useMemo } from "react";
import { Link } from "wouter";
import SiteNavbar from "@/components/SiteNavbar";
import { useSEO } from "@/hooks/useSEO";

// ─── SEO ─────────────────────────────────────────────────────────────────────
const PAGE_TITLE = "FAQ – Häufig gestellte Fragen | SLTCS Sri Lanka Mietwagen mit privatem Fahrer";
const PAGE_DESC =
  "Antworten auf häufige Fragen zu SLTCS (Sri Lanka Mietwagen mit privatem Fahrer): Trinkgeld, Aktivitäten, Zahlung, Stornierung, Fahrervorstellung und mehr.";

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
interface FaqItem {
  q: string;
  a: React.ReactNode;
  plainText: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Was für ein Service ist SLTCS (Sri Lanka Mietwagen mit privatem Fahrer)?",
    plainText:
      "SLTCS (Sri Lanka Mietwagen mit privatem Fahrer) ist ein Online-Bodentransport-Vermittlungsservice, der von Sri Lanka Taxi Charter Service International Limited, einem in Hongkong registrierten Unternehmen, betrieben wird. Es verbindet Reisende mit Tourismusfahrern, die bei der Sri Lanka Tourism Development Authority (SLTDA) registriert sind. Der Transportvertrag wird direkt zwischen dem Kunden und dem Fahrer abgeschlossen. SLTCS fungiert als Einführungs- und Kommunikationsvermittler und erbringt selbst keine Transportleistungen.",
    a: (
      <>
        <p>
          SLTCS (Sri Lanka Mietwagen mit privatem Fahrer) ist ein
          Online-Bodentransport-Vermittlungsservice, der von Sri Lanka Taxi
          Charter Service International Limited, einem in Hongkong registrierten
          Unternehmen, betrieben wird. Es verbindet Reisende mit
          Tourismusfahrern, die bei der Sri Lanka Tourism Development Authority
          (SLTDA) registriert sind.
        </p>
        <p className="mt-2">
          Der Transportvertrag wird direkt zwischen dem Kunden und dem Fahrer
          abgeschlossen. SLTCS fungiert als Einführungs- und
          Kommunikationsvermittler und erbringt selbst keine
          Transportleistungen.
        </p>
        <p className="mt-2 text-amber-700 bg-amber-50 rounded-lg px-3 py-2 text-xs">
          ※ Wichtig: Wir übernehmen keine Buchungen, Verkäufe oder Arrangements
          für Unterkunft, Sehenswürdigkeiten, Aktivitäten, Bahnreisen usw. Alle
          in diesem FAQ bereitgestellten Informationen dienen nur als Referenz.
          Alle Verträge für solche Dienstleistungen werden direkt zwischen dem
          Kunden und dem jeweiligen Anbieter abgeschlossen.
        </p>
      </>
    ),
  },
  {
    q: "Wie viel Trinkgeld sollte ich geben, und wann?",
    plainText:
      "Ein Richtwert für Trinkgeld ist LKR 2.000–4.000 pro Tag (ca. USD 6–12). Es ist üblich, es am Ende des Tagesplans zu übergeben. Ein Dankeschön trägt dazu bei, an den folgenden Tagen noch besseren Service zu erhalten. Trinkgeld ist völlig optional.",
    a: (
      <>
        <p>
          Ein Richtwert für Trinkgeld ist{" "}
          <strong>LKR 2.000–4.000 pro Tag (ca. USD 6–12)</strong>. Es ist
          üblich, es am Ende des Tagesplans zu übergeben. Ein Dankeschön trägt
          dazu bei, an den folgenden Tagen noch besseren Service zu erhalten.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          ※ Trinkgeld ist völlig optional.
        </p>
      </>
    ),
  },
  {
    q: "Kann ich auf Englisch über meine Reiseroute beraten werden oder Routenvorschläge erhalten?",
    plainText:
      "Ja. Wenn Sie uns Ihre gewünschte Reiseroute und Ziele mitteilen, können wir auf Basis lokaler Kenntnisse vorgeschlagene Reiserouten und geschätzte Reisezeiten bereitstellen (zu Referenzzwecken). Die endgültigen Entscheidungen über die Reiseroute liegen bei Ihnen.",
    a: (
      <p>
        Ja. Wenn Sie uns Ihre gewünschte Reiseroute und Ziele mitteilen, können
        wir auf Basis lokaler Kenntnisse{" "}
        <strong>vorgeschlagene Reiserouten und geschätzte Reisezeiten</strong>{" "}
        bereitstellen (zu Referenzzwecken). Die endgültigen Entscheidungen über
        die Reiseroute liegen bei Ihnen.
      </p>
    ),
  },
  {
    q: "Können Sie Aktivitäten wie Safaris oder Walbeobachtungen arrangieren?",
    plainText:
      "Wenn Sie den Silber-Plan oder höher haben, können Sie Safari (Jeep-Touren) und Walbeobachtungs-Arrangements über Ihren Fahrer anfragen (Kosten vor Ort zahlbar). Für andere Aktivitäten wie Ayurveda können Sie gerne Ihren Fahrer nach der Ankunft konsultieren, aber SLTCS übernimmt keine Buchungen oder Verkäufe in Ihrem Namen.",
    a: (
      <>
        <p>
          Wenn Sie den <strong>Silber-Plan oder höher</strong> haben, können Sie
          Safari (Jeep-Touren) und Walbeobachtungs-Arrangements über Ihren
          Fahrer anfragen (Kosten vor Ort zahlbar). Bitte beachten Sie, dass
          alle Buchungen, Zahlungen und Verträge direkt zwischen Ihnen und dem
          Fahrer abgeschlossen werden.
        </p>
        <p className="mt-2">
          Für andere Aktivitäten wie Ayurveda können Sie gerne Ihren Fahrer
          nach der Ankunft konsultieren, aber SLTCS übernimmt keine Buchungen
          oder Verkäufe in Ihrem Namen. Wenn Sie besorgt sind, empfehlen wir,
          online im Voraus zu buchen.
        </p>
      </>
    ),
  },
  {
    q: "Kann ich den Fahrfähigkeiten und der Pünktlichkeit des Fahrers vertrauen?",
    plainText:
      "Wir wählen Fahrer nach Qualifikation und Erfahrung aus und teilen im Voraus die Punkte mit, die unseren Gästen am wichtigsten sind – Pünktlichkeit, sicheres Fahren und Sauberkeit. Der Transport wird vom Fahrer erbracht; SLTCS übernimmt keine Garantie für die Transportqualität.",
    a: (
      <>
        <p>
          Wir wählen Fahrer nach Qualifikation und Erfahrung aus und teilen im
          Voraus die Punkte mit, die unseren Gästen am wichtigsten sind –
          Pünktlichkeit, sicheres Fahren und Sauberkeit.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          ※ Der Transport wird vom Fahrer erbracht; SLTCS übernimmt keine
          Garantie für die Transportqualität.
        </p>
      </>
    ),
  },
  {
    q: "Kann ein Baby- oder Kindersitz bereitgestellt werden?",
    plainText:
      "Wir können im Rahmen der verfügbaren Kapazitäten helfen (abhängig von Bestand und Region). Wenn Sie einen benötigen, kontaktieren Sie uns bitte im Voraus, damit wir die notwendigen Arrangements treffen können.",
    a: (
      <p>
        Wir können im Rahmen der verfügbaren Kapazitäten helfen (abhängig von
        Bestand und Region). Wenn Sie einen benötigen, kontaktieren Sie uns
        bitte{" "}
        <strong>im Voraus</strong>, damit wir die notwendigen Arrangements
        treffen können.
      </p>
    ),
  },
  {
    q: "Wird das Treffen mit dem Fahrer reibungslos verlaufen?",
    plainText:
      "Wir stellen Ihnen die Kontaktdaten des Fahrers vor Ihrer Abreise zur Verfügung, damit Sie vorher Kontakt aufnehmen können. Sollte ein Problem auftreten, unterstützen wir Sie auch per E-Mail und über unsere Kontaktkanäle. Wir können das Ergebnis der Treffpunktvereinbarung nicht garantieren.",
    a: (
      <>
        <p>
          Wir stellen Ihnen die Kontaktdaten des Fahrers vor Ihrer Abreise zur
          Verfügung, damit Sie vorher Kontakt aufnehmen können. Sollte ein
          Problem auftreten, unterstützen wir Sie auch per E-Mail und über
          unsere Kontaktkanäle.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          ※ Wir können das Ergebnis der Treffpunktvereinbarung nicht
          garantieren.
        </p>
      </>
    ),
  },
  {
    q: "Kann der Fahrer Kommentare und Führungen an Touristenattraktionen geben?",
    plainText:
      "In Sri Lanka gibt es zwei Fahrerkategorien: einen Touristenfahrer, der den Passagiertransport übernimmt, und einen höher qualifizierten Chauffeur-Guide-Fahrer, der auch Kommentare und Führungen an Sehenswürdigkeiten geben kann. Der Silber-Plan und höher werden von einem Touristenfahrer oder höher begleitet; der Gold-Plan wird von einem Chauffeur-Guide-Fahrer begleitet. Während der Hochsaison beim Silber-Plan wird an bestimmten Sehenswürdigkeiten ohne Aufpreis ein lokaler Guide arrangiert.",
    a: (
      <>
        <p>
          In Sri Lanka gibt es zwei Fahrerkategorien: einen „Touristenfahrer",
          der den Passagiertransport übernimmt, und einen höher qualifizierten
          „Chauffeur-Guide-Fahrer", der auch Kommentare und Führungen an
          Sehenswürdigkeiten geben kann.
        </p>
        <p className="mt-2">
          Der <strong>Silber-Plan und höher</strong> werden von einem
          Touristenfahrer oder höher begleitet; der{" "}
          <strong>Gold-Plan</strong> wird von einem Chauffeur-Guide-Fahrer
          begleitet. Fahrer ab Silber-Plan können Sie an Touristenattraktionen
          begleiten und Erklärungen geben.
        </p>
        <p className="mt-2">
          Während der Hochsaison beim Silber-Plan mit einem Touristenfahrer
          kann der Fahrer Sie möglicherweise nicht ins Innere von Sigiriya
          Rock, Anuradhapura oder Polonnaruwa begleiten. In solchen Fällen wird
          vor Ort ohne Aufpreis ein lokaler Guide arrangiert.
        </p>
        <p className="mt-2">
          Bitte beachten Sie, dass Fahrer keine Spezialführer sind. Für
          detailliertere Kommentare empfehlen wir, selbst einen professionellen
          Guide zu arrangieren.
        </p>
      </>
    ),
  },
  {
    q: "Welche Zahlungsmethoden werden akzeptiert?",
    plainText:
      "Es ist keine Vorauszahlung erforderlich. Wenn Sie Ihren Fahrer in Sri Lanka treffen, zahlen Sie die Servicegebühr per Kreditkarte. Die Transportgebühr des Fahrers wird direkt an den Fahrer in Ihrer gewählten Währung gezahlt – die Hälfte am ersten Tag und die verbleibende Hälfte am letzten Tag.",
    a: (
      <>
        <p>
          <strong>Es ist keine Vorauszahlung erforderlich.</strong> Wenn Sie
          Ihren Fahrer in Sri Lanka treffen, zahlen Sie die Servicegebühr per{" "}
          <strong>Kreditkarte</strong>. Die Transportgebühr des Fahrers wird
          direkt an den Fahrer in Ihrer gewählten Währung gezahlt –{" "}
          <strong>die Hälfte am ersten Tag</strong> und die{" "}
          <strong>verbleibende Hälfte am letzten Tag</strong>.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          ※ Bitte kontaktieren Sie uns bei Fragen zu Zahlungsmethoden.
        </p>
      </>
    ),
  },
  {
    q: "Was ist im Preis inbegriffen und was nicht?",
    plainText:
      "Inbegriffen: Fahrzeugkosten (japanisches Fahrzeug), Fahrergehalt, Mahlzeiten und Unterkunft, Fahrzeugversicherung, Autobahnmaut und Parkgebühren. Nicht inbegriffen: Trinkgeld (optional), Eintrittsgebühren für Touristenattraktionen, Safari-, Walbeobachtungs- und andere Aktivitätsgebühren.",
    a: (
      <>
        <p className="font-semibold">Inbegriffen:</p>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-1">
          <li>Fahrzeugkosten (japanisches Fahrzeug)</li>
          <li>Fahrergehalt, Mahlzeiten und Unterkunft</li>
          <li>Fahrzeugversicherung</li>
          <li>Autobahnmaut und Parkgebühren</li>
        </ul>
        <p className="font-semibold mt-3">Nicht inbegriffen:</p>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-1">
          <li>Trinkgeld (optional)</li>
          <li>Eintrittsgebühren für Touristenattraktionen</li>
          <li>Safari-, Walbeobachtungs- und andere Aktivitätsgebühren</li>
        </ul>
        <p className="mt-3 text-xs text-gray-500">
          ※ Transportbedingungen können sich aufgrund von kurzfristigen
          Reiserouten-Änderungen, zusätzlichen Anfragen oder Zeitüberschreitungen
          ändern (wird zwischen Ihnen und dem Fahrer besprochen).
        </p>
      </>
    ),
  },
  {
    q: "Was ist, wenn ich den Tee-Zug nicht buchen kann – können Sie das arrangieren?",
    plainText:
      "Wir bitten Sie, Bahnbuchungen selbst online vorzunehmen. Wir empfehlen die Nutzung von 12Go.Asia für Reservierungen. Wenn Sie keine Reservierung sichern können, können wir dennoch Referenzinformationen aus einer Transportperspektive bereitstellen. SLTCS übernimmt keine Bahn- oder andere Transportbuchungen oder Verkäufe.",
    a: (
      <>
        <p>
          Wir bitten Sie, Bahnbuchungen selbst online vorzunehmen. Wir
          empfehlen die Nutzung von <strong>12Go.Asia</strong> für
          Reservierungen.
        </p>
        <p className="mt-2">
          Wenn Sie keine Reservierung sichern können, können wir dennoch
          Referenzinformationen aus einer Transportperspektive bereitstellen –
          zum Beispiel Abschnitte, wo auch das Stehen angenehm ist.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          ※ SLTCS übernimmt keine Bahn- oder andere Transportbuchungen oder
          Verkäufe.
        </p>
      </>
    ),
  },
  {
    q: "Was passiert, wenn sich meine Reiseroute oder Pläne in letzter Minute ändern?",
    plainText:
      "Es ist keine Vorauszahlung vor Ihrer Ankunft in Sri Lanka erforderlich. Bis zu 7 Tage vor Reisebeginn: Keine Stornierungsgebühr. Bereits gezahlte Servicegebühren werden erstattet (abzüglich tatsächlicher Kosten wie Zahlungsabwicklungsgebühren). 2–6 Tage vor Reisebeginn: Keine Vorauszahlung erforderlich. Stornierung wird bis zu 7 Tage vor der Reise akzeptiert. Auch danach, wenn Ihr Flug aufgrund von Krieg, Wetter oder anderen Umständen außerhalb Ihrer Kontrolle storniert wird, akzeptieren wir ebenfalls Ihre Stornierung. Am Tag vor oder am Reisetag: Keine Erstattung aus irgendeinem Grund.",
    a: (
      <>
        <ul className="text-sm text-white space-y-2">
          <li>
            <strong>Bis zu 7 Tage vor Reisebeginn:</strong> Keine
            Stornierungsgebühr. Bereits gezahlte Servicegebühren werden
            erstattet (abzüglich tatsächlicher Kosten wie
            Zahlungsabwicklungsgebühren).
          </li>
          <li>
            <strong>2–6 Tage vor Reisebeginn:</strong> Es ist keine
            Vorauszahlung vor Ihrer Ankunft in Sri Lanka erforderlich.
            Stornierung wird bis zu 7 Tage vor der Reise akzeptiert. Auch
            danach, wenn Ihr Flug aufgrund von Krieg, Wetter oder anderen
            Umständen außerhalb Ihrer Kontrolle storniert wird, akzeptieren
            wir ebenfalls Ihre Stornierung.
          </li>
          <li>
            <strong>Am Tag vor oder am Reisetag:</strong> Keine Erstattung aus
            irgendeinem Grund.
          </li>
        </ul>
        <p className="mt-2 text-xs text-white/60">
          ※ Fahrer-Transportgebühren werden direkt vor Ort beglichen und liegen
          daher außerhalb des Erstattungsbereichs von SLTCS.
        </p>
      </>
    ),
  },
  {
    q: "Kann ich reisen, auch wenn ich am ersten Tag spät in der Nacht ankomme?",
    plainText:
      "Grundsätzlich ja – aber je nach Verfügbarkeit des Fahrers, Sicherheitsüberlegungen und Straßenverhältnissen ist dies nicht immer möglich. Wenn Sie einen Spätnahttransfer benötigen, konsultieren Sie uns bitte im Voraus. Wir werden unser Bestes tun, um Ihre Bedürfnisse flexibel zu erfüllen.",
    a: (
      <p>
        Grundsätzlich ja – aber je nach Verfügbarkeit des Fahrers,
        Sicherheitsüberlegungen und Straßenverhältnissen ist dies nicht immer
        möglich. Wenn Sie einen Spätnahttransfer benötigen,{" "}
        <strong>konsultieren Sie uns bitte im Voraus</strong>. Wir werden unser
        Bestes tun, um Ihre Bedürfnisse flexibel zu erfüllen.
      </p>
    ),
  },
  {
    q: "Bitte erzählen Sie mir mehr über die Fahrervorstellung.",
    plainText:
      "Für den Silber-Plan und höher stellen wir bei der SLTDA (Sri Lanka Tourism Development Authority) registrierte Tourismusfahrer vor. Wir werden unser Bestes tun, um Anfragen für englischsprachige Fahrer zu erfüllen, können die Verfügbarkeit jedoch aufgrund von Angebotsbedingungen nicht garantieren.",
    a: (
      <p>
        Für den <strong>Silber-Plan und höher</strong> stellen wir bei der
        SLTDA (Sri Lanka Tourism Development Authority) registrierte
        Tourismusfahrer vor. Wir werden unser Bestes tun, um Anfragen für
        englischsprachige Fahrer zu erfüllen, können die Verfügbarkeit jedoch
        aufgrund von Angebotsbedingungen nicht garantieren.
      </p>
    ),
  },
  {
    q: "Ist eine Reiseversicherung notwendig?",
    plainText:
      "Wir empfehlen dringend den Abschluss einer Reiseversicherung. Obwohl das sri-lankische Recht vorschreibt, dass alle Fahrzeuge eine Versicherung haben müssen, sind die Deckungsniveaus niedrig – selbst bei einem tödlichen Unfall beträgt die Entschädigung etwa USD 1.000. Den Abschluss einer eigenen Reiseversicherung ist die zuverlässigste Option.",
    a: (
      <>
        <p>
          <strong>Wir empfehlen dringend den Abschluss einer Reiseversicherung.</strong>{" "}
          Obwohl das sri-lankische Recht vorschreibt, dass alle Fahrzeuge eine
          Versicherung haben müssen, sind die Deckungsniveaus niedrig – selbst
          bei einem tödlichen Unfall beträgt die Entschädigung etwa USD 1.000.
        </p>
        <p className="mt-2">
          Um Krankheitskosten, Sachschäden und Haftpflicht während Ihrer Reise
          abzudecken, ist der Abschluss einer eigenen Reiseversicherung die
          zuverlässigste Option. Einige Kreditkarten beinhalten eine
          Reiseversicherung als Vorteil – bitte prüfen Sie die Bedingungen
          Ihrer Karte.
        </p>
      </>
    ),
  },
];

// ─── Accordion Item ───────────────────────────────────────────────────────────
function AccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: "100%",
          textAlign: "left",
          background: "none",
          border: "none",
          padding: "20px 24px",
          cursor: "pointer",
          display: "flex",
          alignItems: "flex-start",
          gap: "14px",
          color: "#fff",
        }}
      >
        <span
          style={{
            flexShrink: 0,
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "rgba(201,168,76,0.15)",
            border: "1px solid rgba(201,168,76,0.4)",
            color: "#c9a84c",
            fontSize: "0.8rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "1px",
          }}
        >
          Q
        </span>
        <span
          style={{
            flex: 1,
            fontSize: "0.95rem",
            fontWeight: 600,
            lineHeight: 1.5,
            color: isOpen ? "#c9a84c" : "#fff",
            transition: "color 0.2s",
          }}
        >
          {item.q}
        </span>
        <span
          style={{
            flexShrink: 0,
            color: "rgba(255,255,255,0.4)",
            fontSize: "1.2rem",
            transform: isOpen ? "rotate(90deg)" : "none",
            transition: "transform 0.2s",
            marginTop: "2px",
          }}
        >
          ›
        </span>
      </button>
      {isOpen && (
        <div
          style={{
            padding: "0 24px 24px",
            display: "flex",
            gap: "14px",
            alignItems: "flex-start",
          }}
        >
          <span
            style={{
              flexShrink: 0,
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.8rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "1px",
            }}
          >
            A
          </span>
          <div
            style={{
              flex: 1,
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.9rem",
              lineHeight: 1.75,
            }}
          >
            {item.a}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.plainText,
      },
    })),
  }), []);

  useSEO({
    title: PAGE_TITLE,
    description: PAGE_DESC,
    path: "/faq",
    jsonLdList: [faqJsonLd],
    jsonLdIdPrefix: "faq",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--dark, #0d1117)",
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <SiteNavbar mode="page" />

      {/* ── Hero ── */}
      <section
        style={{
          paddingTop: "120px",
          paddingBottom: "60px",
          textAlign: "center",
          background: "linear-gradient(180deg, rgba(201,168,76,0.06) 0%, transparent 100%)",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(201,168,76,0.12)",
            border: "1px solid rgba(201,168,76,0.3)",
            color: "#c9a84c",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.15em",
            padding: "6px 18px",
            borderRadius: "20px",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}
        >
          SLTCS – SRI LANKA MIETWAGEN MIT PRIVATEM FAHRER
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            margin: "0 auto 16px",
          }}
        >
          FAQ
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.65)",
            fontSize: "1rem",
            maxWidth: "560px",
            margin: "0 auto 20px",
            lineHeight: 1.7,
          }}
        >
          Häufig gestellte Fragen zu SLTCS (Sri Lanka Mietwagen mit privatem Fahrer)
        </p>
        <nav aria-label="Breadcrumb" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)" }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
            Startseite
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span>FAQ</span>
        </nav>
      </section>

      {/* ── Intro ── */}
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px 0" }}>
        <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, fontSize: "0.95rem" }}>
          Im Folgenden finden Sie Antworten auf häufig gestellte Fragen von Kunden, die SLTCS (Sri Lanka Mietwagen mit privatem Fahrer) in Betracht ziehen oder nutzen. Bei weiteren Fragen können Sie uns jederzeit kontaktieren.
        </p>
      </section>

      {/* ── Table of Contents ── */}
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px 0" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            padding: "28px 32px",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.1rem",
              color: "#c9a84c",
              marginBottom: "16px",
              fontWeight: 700,
            }}
          >
            Inhaltsverzeichnis
          </h2>
          <ol style={{ listStyle: "decimal", paddingLeft: "20px", margin: 0 }}>
            {FAQ_ITEMS.map((item, i) => (
              <li
                key={i}
                style={{
                  marginBottom: "8px",
                  fontSize: "0.88rem",
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.5,
                }}
              >
                <button
                  onClick={() => {
                    setOpenIndex(i);
                    setTimeout(() => {
                      document
                        .getElementById(`faq-item-${i}`)
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 50);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.65)",
                    cursor: "pointer",
                    fontSize: "0.88rem",
                    textAlign: "left",
                    padding: 0,
                    lineHeight: 1.5,
                    textDecoration: "underline",
                    textDecorationColor: "rgba(255,255,255,0.2)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a84c")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
                >
                  {item.q}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Accordion ── */}
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px 0" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {FAQ_ITEMS.map((item, i) => (
            <div id={`faq-item-${i}`} key={i}>
              <AccordionItem
                item={item}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          textAlign: "center",
          padding: "64px 24px 80px",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginBottom: "12px" }}>
          Wenn Ihre Frage hier nicht beantwortet wird
        </p>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.8rem",
            color: "#fff",
            marginBottom: "28px",
            fontWeight: 700,
          }}
        >
          Kontaktieren Sie uns gerne
        </h2>
        <button
          onClick={() => { window.location.href = "/#contact"; }}
          style={{
            background: "#c9a84c",
            color: "#000",
            border: "none",
            borderRadius: "4px",
            padding: "14px 36px",
            fontSize: "0.9rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            cursor: "pointer",
            textTransform: "uppercase",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          💬 Kostenlose Anfrage
        </button>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          background: "#080c10",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "48px 24px 24px",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "32px",
              marginBottom: "40px",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: "8px",
                }}
              >
                Sri Lanka Mietwagen mit privatem Fahrer
                <span
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    color: "#c9a84c",
                    letterSpacing: "0.1em",
                    marginTop: "4px",
                  }}
                >
                  SLTCS
                </span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", lineHeight: 1.6 }}>
                Ein vollständig privater Charterservice, der ganz Sri Lanka mit einem engagierten englischsprachigen Fahrer erkundet.
              </p>
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Navigation
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Link href="/#plans" style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem", textDecoration: "none" }}>Angebote</Link>
                <Link href="/price" style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem", textDecoration: "none" }}>Preise</Link>
                <Link href="/faq" style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem", textDecoration: "none" }}>FAQ</Link>
                <Link href="/#contact" style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem", textDecoration: "none" }}>Kontakt</Link>
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Kontakt
              </div>
              <button
                onClick={() => { window.location.href = "/#contact"; }}
                style={{
                  background: "rgba(201,168,76,0.15)",
                  border: "1px solid rgba(201,168,76,0.3)",
                  color: "#c9a84c",
                  borderRadius: "4px",
                  padding: "10px 20px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Kostenlose Anfrage
              </button>
            </div>
          </div>
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: "20px",
              textAlign: "center",
              color: "rgba(255,255,255,0.25)",
              fontSize: "0.78rem",
            }}
          >
            Copyright © Sri Lanka Mietwagen mit privatem Fahrer All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
