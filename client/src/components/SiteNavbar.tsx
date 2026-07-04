import { useState, useEffect } from "react";

interface SiteNavbarProps {
  /** "home" uses smooth-scroll anchors; other pages use absolute links */
  mode?: "home" | "page";
}

export default function SiteNavbar({ mode = "page" }: SiteNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [mobileItineraryOpen, setMobileItineraryOpen] = useState(false);
  const [mobileInfoOpen, setMobileInfoOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);

  const LANGUAGES = [
    { label: "English",  url: "https://en.srilanka-charter.com/" },
    { label: "French",   url: "https://fr.srilanka-charter.com/" },
    { label: "Spanish",  url: "https://es.srilanka-charter.com/" },
    { label: "Dutch",    url: "https://nl.srilanka-charter.com/" },
    { label: "Russian",  url: "https://ru.srilanka-charter.com/" },
    { label: "Japanese", url: "https://sltcs.srilanka-charter.com/" },
    { label: "Malay",    url: "https://ms.srilanka-charter.com/" },
    { label: "Swedish",  url: "https://sv.srilanka-charter.com/" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    if (mode === "home") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <>
      <nav className={`sltcs-nav${scrolled ? " scrolled" : ""}`}>
        <a href="/" className="nav-logo">
          <span className="nav-logo-full">SLTCS｜Sri Lanka Mietwagen mit privatem Fahrer</span>
          <span className="nav-logo-short">SLTCS</span>
        </a>
        <ul className="nav-links">
          <li>
            <a href={mode === "home" ? "#plans" : "/#plans"}
              onClick={(e) => { e.preventDefault(); scrollTo("plans"); }}>
              PLÄNE
            </a>
          </li>
          <li className="nav-dropdown">
            <button>BEISPIELREISEN</button>
            <div className="nav-dropdown-menu">
              <a href="/information/beispielreiserouten/sri-lanka-4-naechte-5-tage-reiseroute">4 Nächte / 5 Tage</a>
              <a href="/information/beispielreiserouten/sri-lanka-5-naechte-6-tage-reiseroute">5 Nächte / 6 Tage</a>
              <a href="/information/beispielreiserouten/sri-lanka-6-naechte-7-tage-reiseroute">6 Nächte / 7 Tage</a>
              <a href="/information/beispielreiserouten/sri-lanka-5-7-tage-kulturdreieck-reiseroute">5–7 Tage – Kulturelles Dreieck</a>
              <a href="/information/beispielreiserouten/sri-lanka-10-tage-2-wochen-reiseroute">10 Tage bis 2 Wochen – Klassischer Plan</a>
            </div>
          </li>
          <li><a href="/price">PREIS</a></li>
          <li><a href="/voice">VOICE</a></li>
          <li className="nav-dropdown">
            <button>INFORMATION</button>
            <div className="nav-dropdown-menu">
              <a href="/information/privater-fahrer-ratgeber">Privater Fahrer – Ratgeber</a>
              <a href="/information/kosten-buchungsratgeber">Kosten &amp; Buchungsratgeber</a>
              <a href="/information/familien-gruppenreisen">Familien- &amp; Gruppenreisen</a>
              <a href="/information/reise-tipps-sicherheit">Reisetipps &amp; Sicherheit</a>
            </div>
          </li>
          <li>
            <a href={mode === "home" ? "#contact" : "/#contact"}
              onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>
              KONTAKT
            </a>
          </li>
          <li><a href="/faq">FAQ</a></li>
          <li className="nav-dropdown nav-lang-dropdown">
            <button style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              DE
            </button>
            <div className="nav-dropdown-menu">
              {LANGUAGES.map((lang) => (
                <a key={lang.label} href={lang.url}>{lang.label}</a>
              ))}
            </div>
          </li>
        </ul>
        <button className="hamburger" aria-label="Menü" onClick={() => setMobileOpen(!mobileOpen)}>
          <span /><span /><span />
        </button>
      </nav>
      {mobileOpen && (
        <div className="mobile-menu open">
          <a href="/#plans" onClick={(e) => { e.preventDefault(); scrollTo("plans"); }}>Pläne</a>
          {/* Beispielreisen accordion */}
          <div className="mobile-accordion">
            <button
              className="mobile-accordion-btn"
              onClick={() => setMobileItineraryOpen(o => !o)}
            >
              <span>Beispielreisen</span>
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ transform: mobileItineraryOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
              ><path d="M6 9l6 6 6-6" /></svg>
            </button>
            {mobileItineraryOpen && (
              <div className="mobile-accordion-body">
                <a href="/information/beispielreiserouten/sri-lanka-4-naechte-5-tage-reiseroute">4 Nächte / 5 Tage</a>
                <a href="/information/beispielreiserouten/sri-lanka-5-naechte-6-tage-reiseroute">5 Nächte / 6 Tage</a>
                <a href="/information/beispielreiserouten/sri-lanka-6-naechte-7-tage-reiseroute">6 Nächte / 7 Tage</a>
                <a href="/information/beispielreiserouten/sri-lanka-5-7-tage-kulturdreieck-reiseroute">5–7 Tage – Kulturelles Dreieck</a>
                <a href="/information/beispielreiserouten/sri-lanka-10-tage-2-wochen-reiseroute">10 Tage bis 2 Wochen – Klassisch</a>
              </div>
            )}
          </div>
          <a href="/price">Preis</a>
          <a href="/voice">Voice</a>
          {/* Information accordion */}
          <div className="mobile-accordion">
            <button
              className="mobile-accordion-btn"
              onClick={() => setMobileInfoOpen(o => !o)}
            >
              <span>Information</span>
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ transform: mobileInfoOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
              ><path d="M6 9l6 6 6-6" /></svg>
            </button>
            {mobileInfoOpen && (
              <div className="mobile-accordion-body">
                <a href="/information/privater-fahrer-ratgeber">Privater Fahrer – Ratgeber</a>
                <a href="/information/kosten-buchungsratgeber">Kosten &amp; Buchungsratgeber</a>
                <a href="/information/familien-gruppenreisen">Familien- &amp; Gruppenreisen</a>
                <a href="/information/reise-tipps-sicherheit">Reisetipps &amp; Sicherheit</a>
              </div>
            )}
          </div>
          <a href="/#contact" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>Kontakt</a>
          <a href="/faq">FAQ</a>
          <a href="/#contact" className="btn-nav-mobile" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>Kostenlose Anfrage</a>
          {/* Language accordion */}
          <div className="mobile-accordion">
            <button
              className="mobile-accordion-btn"
              onClick={() => setMobileLangOpen(o => !o)}
            >
              <span>Andere Sprachen</span>
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ transform: mobileLangOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
              ><path d="M6 9l6 6 6-6" /></svg>
            </button>
            {mobileLangOpen && (
              <div className="mobile-accordion-body">
                {LANGUAGES.map((lang) => (
                  <a key={lang.label} href={lang.url}>{lang.label}</a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
