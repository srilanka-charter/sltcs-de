/**
 * SLTCS – Sri Lanka Car Hire with Private Driver
 * Design: Dark luxury travel aesthetic
 * - Playfair Display (serif) for headings
 * - Inter for body text
 * - Gold (#c9a84c) accent on deep dark background
 * - Full-bleed hero slideshow, tabbed itineraries, contact form
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSEO } from "@/hooks/useSEO";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

// ─── Custom Date Picker (English locale, OS-independent) ──────────────────────
const MONTHS_EN = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const DAYS_EN = ["So","Mo","Di","Mi","Do","Fr","Sa"];

function DatePicker({ id, name, value, onChange, required }: {
  id: string; name: string; value: string;
  onChange: (v: string) => void; required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => value ? parseInt(value.split("-")[0]) : new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => value ? parseInt(value.split("-")[1]) - 1 : new Date().getMonth());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayValue = value
    ? (() => { const [y,m,d] = value.split("-"); return `${d} ${MONTHS_EN[parseInt(m)-1]} ${y}`; })()
    : "TT / MMM / JJJJ";

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const selectDate = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${viewYear}-${m}-${d}`);
    setOpen(false);
  };

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y-1); } else setViewMonth(m => m-1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y+1); } else setViewMonth(m => m+1); };

  const selectedDay = value ? parseInt(value.split("-")[2]) : null;
  const selectedMonth = value ? parseInt(value.split("-")[1]) - 1 : null;
  const selectedYear = value ? parseInt(value.split("-")[0]) : null;

  return (
    <div className="datepicker-wrap" ref={ref}>
      <input type="hidden" id={id} name={name} value={value} required={required} />
      <button type="button" className="datepicker-trigger" onClick={() => setOpen(o => !o)}>
        <span className="datepicker-icon">📅</span>
        <span className={value ? "datepicker-val" : "datepicker-placeholder"}>{displayValue}</span>
      </button>
      {open && (
        <div className="datepicker-popup">
          <div className="datepicker-header">            <button type="button" className="datepicker-nav" onClick={prevMonth}>‹</button>
            <span className="datepicker-month-year">{MONTHS_EN[viewMonth]} {viewYear}</span>
            <button type="button" className="datepicker-nav" onClick={nextMonth}>›</button>
          </div>
          <div className="datepicker-grid">
            {DAYS_EN.map(d => <div key={d} className="datepicker-dayname">{d}</div>)}
            {Array.from({length: firstDay}).map((_,i) => <div key={`e${i}`} />)}
            {Array.from({length: daysInMonth}).map((_,i) => {
              const day = i + 1;
              const isSelected = day === selectedDay && viewMonth === selectedMonth && viewYear === selectedYear;
              const isToday = day === new Date().getDate() && viewMonth === new Date().getMonth() && viewYear === new Date().getFullYear();
              return (
                <button
                  key={day}
                  type="button"
                  className={`datepicker-day${isSelected ? " selected" : ""}${isToday && !isSelected ? " today" : ""}`}
                  onClick={() => selectDate(day)}
                >{day}</button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Image URLs (uploaded to manus-storage) ───────────────────────────────────
const IMAGES = {
  hero1: "/manus-storage/hero_van_srilanka_706f8966_2a749275.jpg",
  hero2: "/manus-storage/slide2_sigiriya_b8468f12_8739fc53.jpg",
  hero3: "/manus-storage/slide3_tea_train_e100395a_e0555fa0.jpg",
  hero4: "/manus-storage/slide4_kandy_19bf406f_381c6e65.jpg",
  hero5: "/manus-storage/slide5_galle_8aced38c_56158157.jpg",
  destYala: "/manus-storage/dest_yala_0e498c0a_294da75a.jpg",
  destElla: "/manus-storage/dest_ella_bd8060fc_2b0f6a42.jpg",
  destNuwara: "/manus-storage/dest_nuwara_57f4e54f_7597099e.jpg",
};

const SLIDES = [
  { src: IMAGES.hero1, alt: "Weißer Van fährt bei Sonnenuntergang auf einer Straße in Sri Lanka" },
  { src: IMAGES.hero2, alt: "Luftaufnahme der Felsenfestung Sigiriya" },
  { src: IMAGES.hero3, alt: "Malersiche Zugfahrt durch Teeplantagen in Sri Lanka" },
  { src: IMAGES.hero4, alt: "Kandy Tempel des Zahns in Sri Lanka" },
  { src: IMAGES.hero5, alt: "Galle Fort Niederländische Kolonialbefestigungen" },
];
// Note: hero1 = van image (first slide), hero2 = Sigiriya (second slide)

// ─── Navbar ───────────────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: "de", label: "German", url: "https://de.srilanka-charter.com/" },
  { code: "en", label: "English", url: "https://en.srilanka-charter.com/" },
  { code: "fr", label: "French", url: "https://fr.srilanka-charter.com/" },
  { code: "es", label: "Spanish", url: "https://es.srilanka-charter.com/" },
  { code: "nl", label: "Dutch", url: "https://nl.srilanka-charter.com/" },
  { code: "ru", label: "Russian", url: "https://ru.srilanka-charter.com/" },
  { code: "ja", label: "Japanese", url: "https://sltcs.srilanka-charter.com/" },
  { code: "ms", label: "Malay", url: "https://ms.srilanka-charter.com/" },
  { code: "sv", label: "Swedish", url: "https://sv.srilanka-charter.com/" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileItineraryOpen, setMobileItineraryOpen] = useState(false);
  const [mobileInfoOpen, setMobileInfoOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      <nav className={`sltcs-nav${scrolled ? " scrolled" : ""}`}>
        <a href="#hero" className="nav-logo" onClick={(e) => { e.preventDefault(); scrollTo("hero"); }}>
          <span className="nav-logo-full">SLTCS｜Sri Lanka Mietwagen mit privatem Fahrer</span>
          <span className="nav-logo-short">SLTCS</span>
        </a>
        <ul className="nav-links">
          <li><a href="#plans" onClick={(e) => { e.preventDefault(); scrollTo("plans"); }}>ANGEBOTE</a></li>
          <li className="nav-dropdown" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
            <button>BEISPIELREISEN</button>
            {dropdownOpen && (
              <div className="nav-dropdown-menu">
                <a href="/information/beispielreiserouten/sri-lanka-4-naechte-5-tage-reiseroute">4 Nächte / 5 Tage</a>
                <a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>5 Nächte / 6 Tage</a>
                <a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>6 Nächte / 7 Tage</a>
                <a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>5 bis 7 Tage – Kulturelles Dreieck</a>
                <a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>10 Tage bis 2 Wochen – Klassischer Plan</a>
              </div>
            )}
          </li>
          <li><a href="#vehicles" onClick={(e) => { e.preventDefault(); scrollTo("vehicles"); }}>FAHRZEUGE</a></li>
          <li><a href="/price">PREIS</a></li>
          <li><a href="/voice">VOICE</a></li>
          <li className="nav-dropdown" onMouseEnter={() => setInfoOpen(true)} onMouseLeave={() => setInfoOpen(false)}>
            <button>INFORMATION</button>
            {infoOpen && (
              <div className="nav-dropdown-menu">
                <a href="/information/privater-fahrer-ratgeber">Privater Fahrer – Ratgeber</a>
                <a href="/information/kosten-buchungsratgeber">Kosten &amp; Buchungsratgeber</a>
                <a href="/information/familien-gruppenreisen">Familien- &amp; Gruppenreisen</a>
                <a href="/information/reise-tipps-sicherheit">Reisetipps &amp; Sicherheit</a>
              </div>
            )}
          </li>
          <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>KONTAKT</a></li>
          <li><a href="/faq">FAQ</a></li>
          <li className="nav-dropdown nav-lang-dropdown" onMouseEnter={() => setLangOpen(true)} onMouseLeave={() => setLangOpen(false)}>
            <button style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              DE
            </button>
            {langOpen && (
              <div className="nav-dropdown-menu">
                {LANGUAGES.filter(l => l.code !== "de").map((lang) => (
                  <a key={lang.code} href={lang.url}>{lang.label}</a>
                ))}
              </div>
            )}
          </li>
        </ul>
        <button className="hamburger" aria-label="Menü" onClick={() => setMobileOpen(!mobileOpen)}>
          <span /><span /><span />
        </button>
      </nav>
      {mobileOpen && (
        <div className="mobile-menu open">
          <a href="#plans" onClick={(e) => { e.preventDefault(); scrollTo("plans"); }}>Angebote</a>
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
                <a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>5 Nächte / 6 Tage</a>
                <a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>6 Nächte / 7 Tage</a>
                <a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>5–7 Tage – Kulturelles Dreieck</a>
                <a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>10 Tage bis 2 Wochen – Klassisch</a>
              </div>
            )}
          </div>
          <a href="#vehicles" onClick={(e) => { e.preventDefault(); scrollTo("vehicles"); }}>Fahrzeuge</a>
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
          <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>Kontakt</a>
          <a href="/faq">FAQ</a>
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
                {LANGUAGES.filter(l => l.code !== "de").map((lang) => (
                  <a key={lang.code} href={lang.url}>{lang.label}</a>
                ))}
              </div>
            )}
          </div>
          <a href="#contact" className="btn-nav-mobile" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>Kostenlose Anfrage</a>
        </div>
      )}
    </>
  );
}

// ─── Hero Slideshow ───────────────────────────────────────────────────────────
function Hero() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((n: number) => {
    setCurrent(n);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, 5000);    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-slider">
        {SLIDES.map((slide, i) => (
          <div key={i} className={`hero-slide${i === current ? " active" : ""}`}>
            <img src={slide.src} alt={slide.alt} />
          </div>
        ))}
      </div>
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-eyebrow">SRI LANKA PRIVATER CHARTERSERVICE</div>
        <div className="hero-badge">MIETWAGEN MIT FAHRER</div>
        <h1>Sri Lanka <em>Mietwagen</em><br />mit privatem Fahrer</h1>
        <p className="hero-sub">
          Entdecken Sie Sri Lanka in Ihrem eigenen Tempo mit einem engagierten privaten Fahrer.
          Voll flexibel, komplett privat — die beste Art, die Perle des Indischen Ozeans zu entdecken.
        </p>
        <div className="hero-tags">
          <span className="hero-tag">Englischsprachiger Support</span>
          <span className="hero-tag">Vollständig privater Charter</span>
          <span className="hero-tag">Regierungszertifizierter Fahrer</span>
        </div>
        <a href="#contact" className="btn-primary" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>
          Kostenlose Anfrage
        </a>
      </div>
      <div className="hero-location">
        <div className="hero-location-label">Standort</div>
        <div className="hero-location-value">Ganz Sri Lanka</div>
      </div>
      <div className="hero-dots">
        {SLIDES.map((_, i) => (
          <button key={i} className={`hero-dot${i === current ? " active" : ""}`} onClick={() => goTo(i)} />
        ))}
      </div>
      <div className="hero-scroll">
        <span>Scrollen</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}

// ─── Stats Counter ────────────────────────────────────────────────────────────
function Stats() {
  const [counts, setCounts] = useState({ charters: 0, satisfaction: 0, drivers: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 2000;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCounts({
              charters: Math.floor(400 * eased),
              satisfaction: parseFloat((4.9 * eased).toFixed(1)),
              drivers: Math.floor(30 * eased),
            });
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="stats" ref={ref}>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-number">{counts.charters}+</div>
          <div className="stat-label">Gesamtzahl der Charterfahrten</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{counts.satisfaction.toFixed(1)}</div>
          <div className="stat-label">Durchschnittliche Zufriedenheit</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{counts.drivers}+</div>
          <div className="stat-label">Zertifizierte Fahrer</div>
        </div>
      </div>
    </div>
  );
}

// ─── Contact + Why SLTCS (2-column layout) ──────────────────────────────────
function ContactAndWhy() {
  const [country, setCountry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [, setLocation] = useLocation();

  const submitMutation = trpc.enquiry.submit.useMutation({
    onSuccess: () => { setLocation("/thanks"); },
    onError: (err) => {
      setSubmitError(err.message || "Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    submitMutation.mutate({
      name: (data.get("name") as string) || "",
      country: (data.get("country") as string) || "",
      countryOther: (data.get("countryOther") as string) || undefined,
      email: (data.get("email") as string) || "",
      phone: (data.get("phone") as string) || undefined,
      startDate: startDate,
      endDate: endDate,
      pickup: (data.get("pickup") as string) || "",
      adults: (data.get("adults") as string) || "",
      children: (data.get("children") as string) || "0",
      vehicle: (data.get("vehicle") as string) || "",
      currency: (data.get("currency") as string) || undefined,
      notes: (data.get("notes") as string) || undefined,
    });
  };

  const reasons = [
    {
      num: "01",
      title: "Von der Regierung zertifizierte Fahrer",
      desc: "Alle unsere Fahrer besitzen offizielle Lizenzen als Sri Lanka Tourist Driver oder Chauffeur Guide Driver. Professionell geschult, sicherheitsorientiert und von früheren Kunden hoch bewertet.",
      svgPath: "M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2zm0 4l6 3.27V12c0 3.79-2.58 7.33-6 8.93-3.42-1.6-6-5.14-6-8.93V9.27L12 6z",
    },
    {
      num: "02",
      title: "Vollständige englische Unterstützung",
      desc: "Von der ersten Anfrage bis zum letzten Absetzen steht Ihnen unser englischsprachiges Team zur Verfügung. Keine Sprachbarrieren – nur nahtlose Kommunikation während Ihrer gesamten Reise.",
      svgPath: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z",
    },
    {
      num: "03",
      title: "Völlig private Charter",
      desc: "Im Gegensatz zu Gruppentouren sind Ihr Fahrzeug und Fahrer ausschließlich für Sie reserviert. Legen Sie Ihren eigenen Zeitplan fest, wählen Sie Ihre Stopps und reisen Sie ganz nach Ihren Wünschen.",
      svgPath: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z",
    },
    {
      num: "04",
      title: "Expertenwissen vor Ort",
      desc: "Unsere Chauffeur Guide Fahrer sind leidenschaftlich an Sri Lankas Geschichte, Kultur und Küche interessiert. Sie führen Sie über den Reiseführer hinaus zu versteckten Schätzen und authentischen Erlebnissen.",
      svgPath: "M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z",
    },
    {
      num: "05",
      title: "Das richtige Fahrzeug für jede Gruppe",
      desc: "Von Paaren bis zu großen Familiengruppen von 10 Personen – wir wählen das perfekte Fahrzeug für Ihre Gruppengröße aus und sorgen so für Komfort, selbst auf langen Fahrten über die Insel.",
      svgPath: "M17 5H3c-1.1 0-2 .9-2 2v9h2c0 1.65 1.34 3 3 3s3-1.35 3-3h5.5c0 1.65 1.34 3 3 3s3-1.35 3-3H23v-5l-6-6zM3 11V7h4v4H3zm3 6.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm7-6.5H9V7h4v4zm4.5 6.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM15 11V7h1l4 4h-5z",
    },
    {
      num: "06",
      title: "Vertraut von europäischen Reisenden",
      desc: "Mit über 400 abgeschlossenen Charterfahrten und einer durchschnittlichen Zufriedenheitsbewertung von 4,9 ist SLTCS die bevorzugte Wahl für Besucher aus Großbritannien und Europa, die Sri Lanka erkunden.",
      svgPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
    },
  ];

  return (
    <section id="contact" style={{ background: "#faf7f2", padding: "100px 0" }}>
      <div className="container">
        <div className="contact-why-grid">

          {/* ── LEFT: Contact Form ─────────────────────────────────────────── */}
          <div>
            <div className="section-eyebrow" style={{ color: "#c9a84c" }}>KONTAKT</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2, margin: "0 0 16px" }}>
              Beginnen Sie mit der Planung<br />Ihres Sri Lanka<br />Abenteuers
            </h2>
            <p style={{ color: "#4a4a4a", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "8px" }}>
              Teilen Sie uns Ihre Reisedaten, Gruppengröße und Vorlieben mit — wir antworten Ihnen innerhalb von 24 Stunden mit einem maßgeschneiderten Reiseplan und Angebot.
            </p>
            <p style={{ color: "#4a4a4a", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "24px" }}>
              Füllen Sie das Formular aus und senden Sie es ab. Wir antworten in der Regel innerhalb von 24 Stunden.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="form-grid">
                <div className="form-group full">
                  <label htmlFor="name">VOLLSTÄNDIGER NAME *</label>
                  <input type="text" id="name" name="name" placeholder="z.B. James Smith" required />
                </div>
                <div className="form-group full">
                  <label htmlFor="country">LAND *</label>
                  <select id="country" name="country" required value={country} onChange={(e) => setCountry(e.target.value)}>
                    <option value="">— Wählen Sie Ihr Land —</option>
                    <option value="United Kingdom">Vereinigtes Königreich</option>
                    <option value="United States">Vereinigte Staaten</option>
                    <option value="France">Frankreich</option>
                    <option value="Germany">Deutschland</option>
                    <option value="Netherlands">Niederlande</option>
                    <option value="Spain">Spanien</option>
                    <option value="Italy">Italien</option>
                    <option value="Australia">Australien</option>
                    <option value="China">China</option>
                    <option value="India">Indien</option>
                    <option value="Other">Andere</option>
                  </select>
                </div>
                {country === "Other" && (
                  <div className="form-group full">
                    <label htmlFor="countryOther">BITTE GEBEN SIE IHR LAND AN *</label>
                    <input type="text" id="countryOther" name="countryOther" placeholder="Geben Sie Ihr Land ein" required />
                  </div>
                )}
                <div className="form-group full">
                  <label htmlFor="email">E-MAIL-ADRESSE *</label>
                  <input type="email" id="email" name="email" placeholder="ihre@email.com" required />
                </div>
                <div className="form-group full">
                  <label htmlFor="phone">TELEFONNUMMER</label>
                  <input type="tel" id="phone" name="phone" placeholder="+44 7700 000000" />
                </div>
                <div className="form-group">
                  <label htmlFor="startDate">STARTDATUM *</label>
                  <DatePicker id="startDate" name="startDate" value={startDate} onChange={setStartDate} required />
                </div>
                <div className="form-group">
                  <label htmlFor="endDate">ENDDATUM *</label>
                  <DatePicker id="endDate" name="endDate" value={endDate} onChange={setEndDate} required />
                </div>
                <div className="form-group full">
                  <label htmlFor="pickup">STARTORT DER CHARTERFAHRT *</label>
                  <select id="pickup" name="pickup" required>
                    <option value="">— Ort auswählen —</option>
                    <option value="Colombo Airport (BIA)">Flughafen Colombo (BIA)</option>
                    <option value="Colombo City">Stadt Colombo</option>
                    <option value="Negombo">Negombo</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Sigiriya">Sigiriya</option>
                    <option value="Nuwara Eliya">Nuwara Eliya</option>
                    <option value="Galle">Galle</option>
                    <option value="Other (please specify in notes)">Andere (bitte im Bemerkungsfeld angeben)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="adults">ANZAHL ERWACHSENER *</label>
                  <select id="adults" name="adults" required>
                    <option value="">Auswählen</option>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                    <option value="7+">7 oder mehr</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="children">ANZAHL KINDER</label>
                  <select id="children" name="children">
                    <option value="0">0</option>
                    {[1,2,3].map(n => <option key={n} value={n}>{n}</option>)}
                    <option value="4+">4 oder mehr</option>
                  </select>
                </div>
                <div className="form-group full">
                  <label htmlFor="vehicle">FAHRZEUGTYP *</label>
                  <select id="vehicle" name="vehicle" required>
                    <option value="">— Fahrzeug auswählen —</option>
                    <option value="Sedan (up to 3 pax)">Limousine (bis zu 3 Personen)</option>
                    <option value="Van (up to 6 pax)">Van (bis zu 6 Personen)</option>
                    <option value="Large Van (up to 10 pax)">Großer Van (bis zu 10 Personen)</option>
                    <option value="Let us recommend">Lassen Sie uns empfehlen</option>
                  </select>
                </div>
                <div className="form-group full">
                  <label htmlFor="currency">BEVORZUGTE WÄHRUNG</label>
                  <select id="currency" name="currency">
                    <option value="">— Währung auswählen —</option>
                    <option value="GBP">GBP (£ Britisches Pfund)</option>
                    <option value="EUR">EUR (€ Euro)</option>
                    <option value="USD">USD ($ US-Dollar)</option>
                    <option value="AUD">AUD (A$ Australischer Dollar)</option>
                  </select>
                </div>
                <div className="form-group full">
                  <label htmlFor="notes">REISEZIELE / REISEVERLAUF-HINWEISE</label>
                  <textarea id="notes" name="notes" placeholder="Bitte listen Sie alle Reiseziele, Sehenswürdigkeiten oder besondere Wünsche auf, die Sie im Sinn haben." />
                </div>
              </div>
              {submitError && (
                <div className="form-error" style={{ color: "#e55", marginBottom: "12px", padding: "10px 14px", background: "rgba(220,50,50,0.1)", borderRadius: "6px", border: "1px solid rgba(220,50,50,0.3)" }}>
                  {submitError}
                </div>
              )}
              <button
                type="submit"
                className={`form-submit-btn${isSubmitting ? " loading" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Senden…" : "Anfrage senden"}
              </button>
              <p className="form-note">
                Mit dem Absenden dieses Formulars stimmen Sie unserer{" "}
                <a href="#" onClick={(e) => e.preventDefault()}>Datenschutzerklärung</a> zu.
                Keine Verpflichtung erforderlich.
              </p>
            </form>
          </div>

          {/* ── RIGHT: Why SLTCS ──────────────────────────────────────────── */}
          <div id="why">
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "12px" }}>
                <div style={{ width: "40px", height: "1px", background: "#c9a84c" }} />
                <span style={{ color: "#c9a84c", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" }}>WARUM SLTCS</span>
                <div style={{ width: "40px", height: "1px", background: "#c9a84c" }} />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#c9a84c"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2, margin: 0 }}>
                6 Gründe, warum Reisende<br /><span style={{ color: "#c9a84c" }}>SLTCS</span> wählen
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {reasons.map((r) => (
                <div
                  key={r.num}
                  style={{
                    display: "flex",
                    alignItems: "stretch",
                    background: "#f9f5ee",
                    border: "1px solid rgba(201,168,76,0.25)",
                    borderRadius: "10px",
                    overflow: "hidden",
                    transition: "box-shadow 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(201,168,76,0.15)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.5)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.25)"; }}
                >
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", padding: "18px 16px", minWidth: "76px", borderRight: "1px solid rgba(201,168,76,0.15)" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#f0e8d0", border: "1px solid rgba(201,168,76,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a3a1a"><path d={r.svgPath} /></svg>
                    </div>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#c9a84c", lineHeight: 1 }}>{r.num}</span>
                  </div>
                  <div style={{ padding: "18px 20px", flex: 1 }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 700, color: "#1a1a1a", margin: "0 0 6px", lineHeight: 1.3 }}>{r.title}</h3>
                    <p style={{ fontSize: "0.8rem", color: "#4a4a4a", lineHeight: 1.65, margin: 0 }}>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── Concerns ─────────────────────────────────────────────────────────────────
function Concerns() {
  const concerns = [
    { label: "Sprachbarrieren", svgPath: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" },
    { label: "Unabhängig unterwegs sein", svgPath: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" },
    { label: "Überteuerte Preise", svgPath: "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" },
    { label: "Sicherheitsbedenken bei Taxis", svgPath: "M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2zm0 4l6 3.27V12c0 3.79-2.58 7.33-6 8.93-3.42-1.6-6-5.14-6-8.93V9.27L12 6z" },
    { label: "Die richtigen Orte finden", svgPath: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" },
    { label: "Den Zeitplan einhalten", svgPath: "M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" },
    { label: "Reisen mit Kindern oder älteren Menschen", svgPath: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" },
    { label: "Die lokale Kultur verstehen", svgPath: "M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" },
  ];
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <section id="concerns" style={{ background: "#0d0f13", padding: "100px 0" }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "56px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "32px", height: "1px", background: "#c9a84c" }} />
            <span style={{ color: "#c9a84c", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" }}>IHRE SORGEN</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#fff", lineHeight: 1.15, margin: 0 }}>
            Besorgt wegen Reisen<br />in <span style={{ color: "#c9a84c" }}>Sri Lanka?</span>
          </h2>
        </div>
        {/* Concern tiles */}
        <div className="concerns-inline-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "40px" }}>
          {concerns.map((c) => (
            <div
              key={c.label}
              style={{ display: "flex", alignItems: "center", gap: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "4px", padding: "18px 20px", transition: "border-color 0.2s, background 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.3)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(201,168,76,0.04)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#c9a84c" style={{ flexShrink: 0, opacity: 0.8 }}><path d={c.svgPath} /></svg>
              <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.4 }}>{c.label}</span>
            </div>
          ))}
        </div>
        {/* CTA bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "32px", background: "linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.04) 100%)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "4px", padding: "36px 48px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
            <div style={{ flexShrink: 0, width: "48px", height: "48px", borderRadius: "50%", border: "1px solid rgba(201,168,76,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#c9a84c"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2zm0 4l6 3.27V12c0 3.79-2.58 7.33-6 8.93-3.42-1.6-6-5.14-6-8.93V9.27L12 6z" /></svg>
            </div>
            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>SLTCS löst all diese Sorgen</h3>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0, maxWidth: "560px" }}>Ihr persönlicher privater Fahrer kümmert sich um alles – Navigation, Kommunikation, Zeitplanung und lokales Fachwissen. Sie müssen sich nur zurücklehnen und die Reise genießen.</p>
            </div>
          </div>
          <button
            onClick={() => scrollTo("contact")}
            style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: "10px", background: "#c9a84c", border: "none", color: "#0a0c0f", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "16px 36px", borderRadius: "3px", cursor: "pointer", transition: "opacity 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            Jetzt anfragen – Kostenlos
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Plans ────────────────────────────────────────────────────────────────────
function Plans() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <section id="plans">
      <div className="container">
        <div className="section-eyebrow">UNSERE ANGEBOTE</div>
        <h2 className="section-title">Wählen Sie den Plan,<br />der am besten zu Ihnen passt</h2>
        <p className="section-sub">Egal, ob Sie mit kleinem Budget reisen oder ein Premium-Erlebnis suchen – wir haben einen Plan, der auf Ihre Bedürfnisse zugeschnitten ist.</p>        <div className="plans-grid">
          <div className="plan-card">
            <div className="plan-tier">BRONZE</div>
            <h3>Bronze-Plan</h3>
            <p>Für preisbewusste Reisende, die zuverlässigen Transport benötigen.</p>
            <ul className="plan-features">
              <li>Fahreranwärter-Vereinbarung</li>
              <li>Flughafentransfers &amp; Punkt-zu-Punkt-Transfers</li>
              <li>Englischsprachiger lokaler Koordinator</li>
              <li>Sauberes, klimatisiertes Fahrzeug</li>
            </ul>
            <a href="#contact" className="plan-cta" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>Details ansehen</a>
          </div>
          <div className="plan-card featured">
            <div className="plan-badge-popular">Am beliebtesten</div>
            <div className="plan-tier">SILBER</div>
            <h3>Silber-Plan</h3>
            <p>Das beste Verhältnis von Preis und Qualität — unsere beliebteste Wahl.</p>
            <ul className="plan-features">
              <li>Regierungszertifizierter Touristfahrer oder höher</li>
              <li>Begleitung &amp; Erläuterungen an Sehenswürdigkeiten</li>
              <li>Englischsprachiger lokaler Koordinator</li>
              <li>Safari- &amp; Aktivitätsbuchungen organisiert</li>
              <li>Führerdienste ohne Aufpreis inklusive</li>
            </ul>
            <a href="#contact" className="plan-cta" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>Details ansehen</a>
          </div>
          <div className="plan-card">
            <div className="plan-tier">GOLD</div>
            <h3>Gold-Plan</h3>
            <p>Für Reisende, die das beste Sri Lanka Erlebnis verlangen.</p>
            <ul className="plan-features">
              <li>Garantierter Top-bewerteter Chauffeur-Guide-Fahrer</li>
              <li>Ganztägige Begleitung &amp; fachkundige Erläuterungen</li>
              <li>Englischsprachiger lokaler Koordinator</li>
              <li>Duale Unterstützungsstruktur für vollständige Sicherheit</li>
              <li>Premium Concierge-Service</li>
            </ul>
            <a href="#contact" className="plan-cta" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>Details ansehen</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing Preview ─────────────────────────────────────────────────────────
type CurrencyKeyHP = "USD" | "GBP" | "EUR" | "AUD";
type TierKeyHP = "bronze" | "silver" | "gold";
type VehicleKeyHP = "sedan" | "van" | "bigvan";

const CURRENCY_SYMBOLS_HP: Record<CurrencyKeyHP, string> = { USD: "$", GBP: "£", EUR: "€", AUD: "A$" };

const PRICES_HP: Record<CurrencyKeyHP, Record<TierKeyHP, Record<VehicleKeyHP, number[]>>> = {
  USD: {
    bronze: { sedan: [290,370,460,550,610,670,730,830,920,1020,1110,1210,1300,1400,1490,1590,1680,1780,1870], van: [350,450,560,660,730,800,870,990,1090,1210,1320,1430,1540,1650,1750,1860,1960,2070,2170], bigvan: [410,530,660,770,850,920,1000,1140,1260,1400,1520,1650,1770,1900,2010,2140,2260,2390,2510] },
    silver: { sedan: [340,440,550,660,730,800,870,990,1090,1210,1320,1440,1550,1670,1780,1900,2010,2130,2240], van: [410,530,660,780,860,940,1030,1170,1290,1430,1560,1700,1830,1970,2090,2230,2360,2500,2630], bigvan: [480,620,770,900,990,1070,1170,1330,1470,1630,1770,1930,2080,2240,2380,2540,2690,2850,2990] },
    gold:   { sedan: [390,510,640,770,860,950,1040,1180,1310,1450,1590,1730,1870,2010,2140,2280,2420,2560,2700], van: [470,610,760,900,1000,1100,1200,1360,1510,1680,1830,2000,2160,2330,2490,2660,2820,2990,3150], bigvan: [540,700,870,1030,1150,1250,1370,1550,1720,1910,2080,2270,2450,2640,2820,3010,3200,3390,3580] },
  },
  GBP: {
    bronze: { sedan: [230,290,360,430,480,520,570,650,720,800,870,950,1020,1100,1170,1250,1320,1400,1470], van: [270,350,440,520,570,630,680,780,860,950,1040,1130,1210,1300,1380,1460,1540,1630,1710], bigvan: [320,410,520,610,670,730,790,900,990,1100,1200,1300,1390,1500,1590,1690,1780,1880,1980] },
    silver: { sedan: [270,340,430,520,570,630,680,780,860,950,1040,1130,1220,1310,1400,1490,1580,1670,1760], van: [320,410,520,610,680,740,810,920,1020,1130,1230,1340,1440,1550,1650,1760,1860,1970,2070], bigvan: [370,480,600,700,780,840,920,1040,1150,1280,1390,1520,1630,1760,1870,2000,2120,2250,2360] },
    gold:   { sedan: [300,400,500,600,670,740,810,920,1020,1130,1240,1350,1460,1570,1680,1790,1900,2010,2120], van: [360,470,590,700,780,860,940,1070,1190,1320,1440,1570,1690,1830,1950,2090,2210,2350,2470], bigvan: [420,550,680,800,900,980,1070,1210,1340,1490,1630,1780,1920,2070,2210,2360,2510,2660,2810] },
  },
  EUR: {
    bronze: { sedan: [270,340,430,510,570,620,680,770,860,950,1040,1130,1220,1310,1400,1490,1580,1670,1760], van: [330,420,530,630,690,760,830,940,1040,1160,1260,1370,1480,1590,1690,1800,1900,2010,2110], bigvan: [390,500,620,730,800,880,950,1080,1200,1330,1450,1580,1700,1830,1940,2070,2190,2320,2440] },
    silver: { sedan: [320,410,510,610,680,740,810,920,1020,1130,1240,1350,1460,1570,1680,1790,1900,2010,2120], van: [390,500,620,730,810,880,960,1090,1210,1350,1470,1610,1730,1870,1990,2130,2260,2400,2530], bigvan: [450,580,720,840,930,1010,1100,1250,1390,1550,1690,1840,1980,2140,2280,2440,2590,2750,2890] },
    gold:   { sedan: [360,480,600,720,810,890,980,1110,1240,1380,1510,1650,1790,1930,2060,2200,2340,2480,2620], van: [440,580,720,860,960,1060,1160,1320,1470,1640,1800,1970,2130,2310,2470,2650,2820,3010,3170], bigvan: [510,660,820,980,1100,1200,1320,1500,1670,1860,2040,2230,2420,2620,2810,3010,3210,3420,3620] },
  },
  AUD: {
    bronze: { sedan: [440,560,700,830,920,1010,1100,1250,1390,1540,1680,1830,1970,2120,2260,2410,2550,2700,2840], van: [530,680,840,990,1090,1200,1310,1490,1650,1830,2000,2170,2340,2510,2670,2840,3000,3170,3330], bigvan: [620,790,980,1160,1280,1400,1530,1740,1930,2140,2330,2530,2730,2930,3120,3330,3520,3720,3920] },
    silver: { sedan: [520,660,820,980,1080,1180,1290,1470,1630,1810,1980,2160,2330,2510,2680,2860,3030,3210,3380], van: [610,780,970,1140,1260,1380,1510,1720,1910,2120,2310,2520,2720,2930,3120,3340,3540,3750,3950], bigvan: [710,910,1120,1320,1460,1580,1730,1970,2190,2440,2660,2900,3130,3380,3610,3860,4100,4350,4580] },
    gold:   { sedan: [580,770,960,1150,1290,1420,1560,1780,1980,2200,2410,2630,2850,3080,3300,3530,3760,3990,4220], van: [690,900,1120,1330,1490,1640,1800,2060,2290,2550,2790,3050,3310,3580,3840,4110,4380,4660,4930], bigvan: [790,1030,1270,1510,1690,1840,2020,2310,2570,2860,3130,3430,3730,4040,4340,4650,4970,5290,5610] },
  },
};

const DAYS_HP = Array.from({ length: 19 }, (_, i) => i + 2);
const TIERS_HP: { key: TierKeyHP; label: string; badge?: string; color: string }[] = [
  { key: "bronze", label: "Bronze-Plan", color: "#cd7f32" },
  { key: "silver", label: "Silber-Plan", badge: "Beliebteste Wahl", color: "#c9a84c" },
  { key: "gold",   label: "Gold-Plan",   color: "#d4af37" },
];
const VEHICLES_HP: { key: VehicleKeyHP; label: string; capacity: string }[] = [
  { key: "sedan",  label: "Sedan",   capacity: "1–3 Personen" },
  { key: "van",    label: "Van",     capacity: "3–6 Personen" },
  { key: "bigvan", label: "Großer Van", capacity: "6–9 Personen" },
];
function PriceCard({ tier, currency }: { tier: (typeof TIERS_HP)[number]; currency: CurrencyKeyHP }) {
  const [vehicle, setVehicle] = useState<VehicleKeyHP>("sedan");
  const sym = CURRENCY_SYMBOLS_HP[currency];
  const prices = PRICES_HP[currency][tier.key][vehicle];
  return (
    <div style={{ background: "#ffffff", border: `1.5px solid ${tier.color}50`, borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <div style={{ background: `linear-gradient(135deg, ${tier.color}22, ${tier.color}08)`, borderBottom: `1px solid ${tier.color}30`, padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <span style={{ background: tier.color, color: "#000", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", padding: "2px 8px", borderRadius: "20px", textTransform: "uppercase" }}>{tier.key.toUpperCase()}</span>
          {tier.badge && <span style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)", color: "#c9a84c", fontSize: "0.6rem", fontWeight: 600, padding: "2px 7px", borderRadius: "20px", textTransform: "uppercase" }}>{tier.badge}</span>}
        </div>
        <h3 style={{ color: "#1a1a1a", fontSize: "1rem", fontWeight: 700, margin: 0 }}>{tier.label}</h3>
      </div>
      <div style={{ display: "flex", borderBottom: "1px solid #e8e2d8", background: "#f9f5ee" }}>
        {VEHICLES_HP.map((v) => (
          <button key={v.key} onClick={() => setVehicle(v.key)} style={{ flex: 1, padding: "8px 4px", background: "none", border: "none", borderBottom: vehicle === v.key ? `2px solid ${tier.color}` : "2px solid transparent", color: vehicle === v.key ? tier.color : "#888", fontSize: "0.7rem", fontWeight: vehicle === v.key ? 600 : 400, cursor: "pointer", transition: "all 0.2s", textAlign: "center", lineHeight: 1.3 }}>
            <div>{v.label}</div>
            <div style={{ fontSize: "0.6rem", opacity: 0.7 }}>{v.capacity}</div>
          </button>
        ))}
      </div>
      <div style={{ flex: 1 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "8px 14px", textAlign: "left", color: "#888", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", background: "#f4f0e8" }}>Tage</th>
              <th style={{ padding: "8px 14px", textAlign: "right", color: "#888", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", background: "#f4f0e8" }}>Preis (inkl. Steuer)</th>
            </tr>
          </thead>
          <tbody>
            {DAYS_HP.map((day, idx) => (
              <tr key={day} style={{ borderBottom: "1px solid #ede8e0", background: idx % 2 === 0 ? "transparent" : "#faf7f2" }}>
                <td style={{ padding: "8px 14px", color: "#4a4a4a", fontSize: "0.82rem" }}>{day} Tage</td>
                <td style={{ padding: "8px 14px", textAlign: "right", color: "#1a1a1a", fontSize: "0.9rem", fontWeight: 600 }}>{sym}{prices[idx].toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function PricingPreview() {
  const [currency, setCurrency] = useState<CurrencyKeyHP>("EUR");
  return (
    <section id="pricing" style={{ background: "#faf7f2", padding: "80px 0" }}>
      <div className="container">
        <div className="section-eyebrow">TRANSPARENTE PREISE</div>
        <h2 className="section-title">Pauschalpreisliste</h2>
        <p className="section-sub" style={{ marginBottom: "32px" }}>Alle Preise sind inklusive Steuern und gelten für englischsprachige Fahrer. Wählen Sie Ihre bevorzugte Währung und Fahrzeugtyp.</p>
        <div style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
          {(["USD", "GBP", "EUR", "AUD"] as CurrencyKeyHP[]).map((c) => (
            <button key={c} onClick={() => setCurrency(c)} style={{ padding: "8px 20px", background: currency === c ? "rgba(201,168,76,0.15)" : "#ffffff", border: currency === c ? "1.5px solid rgba(201,168,76,0.6)" : "1.5px solid #d1ccc4", borderRadius: "6px", color: currency === c ? "#c9a84c" : "#4a4a4a", fontSize: "0.85rem", fontWeight: currency === c ? 700 : 400, cursor: "pointer", transition: "all 0.2s" }}>
              {CURRENCY_SYMBOLS_HP[c]} {c}
            </button>
          ))}
        </div>
        <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "8px", padding: "12px 18px", marginBottom: "28px" }}>
          <p style={{ color: "#4a4a4a", fontSize: "0.85rem", lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: "#c9a84c" }}>Hinweis:</strong> Zusätzliche Gebühren können anfallen, wenn die Gesamtentfernung die Standardschätzung überschreitet oder wenn der Abhol-/Absetzpunkt außerhalb des Flughafenbereichs liegt.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {TIERS_HP.map((tier) => <PriceCard key={tier.key} tier={tier} currency={currency} />)}
        </div>
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <a href="/price" className="btn-outline" style={{ display: "inline-block" }}>Vollständige Preisseite ansehen →</a>
        </div>
      </div>
    </section>
  );
}

// ─── Reiserouten ──────────────────────────────────────────────────────────────
type DayItem = { day: string; title: string; desc: string };
type Itinerary = {
  id: string;
  label: string;
  title: string;
  duration: string;
  focus: string;
  highlights: string;
  idealFor: string;
  days: DayItem[];
};

const ITINERARIES: Itinerary[] = [
  {
    id: "4n5d",
    label: "4N/5T",
    title: "4 Nächte / 5 Tage",
    duration: "5 Tage",
    focus: "Kulturelle Höhepunkte",
    highlights: "Sigiriya, Kandy, Nuwara Eliya, Galle",
    idealFor: "Erstbesucher mit engem Zeitplan",
    days: [      { day: "Tag 1", title: "Ankunft → Sigiriya", desc: "Ankunft am Flughafen Colombo. Fahrt nach Sigiriya über den Dambulla-Höhlentempel (UNESCO). Check-in in Ihrem Hotel in der Gegend von Sigiriya." },
      { day: "Tag 2", title: "Felsenfestung Sigiriya", desc: "Frühmorgendlicher Aufstieg auf den Sigiriya-Felsen (UNESCO). Nachmittag zur freien Verfügung oder optionale Jeep-Safari im Minneriya-Nationalpark." },
      { day: "Tag 3", title: "Kandy — Zahntempel", desc: "Fahrt nach Kandy über einen Gewürzgarten in Matale. Besuch des Tempels der Heiligen Zahnreliquie (UNESCO). Abends Kandyan-Tanzvorführung." },
      { day: "Tag 4", title: "Nuwara Eliya → Galle", desc: "Landschaftlich reizvolle Fahrt durch sanfte Teeplantagen. Tee-Pflückerlebnis. Weiterfahrt zur Festung Galle (UNESCO) an der Südküste." },
      { day: "Tag 5", title: "Festung Galle → Abreise", desc: "Morgendliche Erkundung der holländischen Kolonialbefestigungen von Galle, Boutiquen und Meerblick. Transfer zum Flughafen Colombo." },
    ],
  },
  {
    id: "5n6d",
    label: "5N/6D",
    title: "5 Nächte / 6 Tage",
    duration: "6 Tage",
    focus: "Kultur + Natur",
    highlights: "Sigiriya, Kandy, Ella, Galle",
    idealFor: "Paare & kleine Gruppen",
    days: [
      { day: "Tag 1", title: "Ankunft → Sigiriya", desc: "Ankunft am Flughafen Colombo. Fahrt nach Sigiriya über den Dambulla-Höhlentempel. Übernachtung in der Gegend von Sigiriya." },
      { day: "Tag 2", title: "Sigiriya-Felsen & Safari", desc: "Morgendlicher Aufstieg auf den Sigiriya-Felsen. Nachmittags Wildtiersafari im Minneriya- oder Kaudulla-Nationalpark." },
      { day: "Tag 3", title: "Besichtigung in Kandy", desc: "Reise nach Kandy über den Gewürzgarten in Matale. Besuch des Zahntempels und der Botanischen Gärten von Peradeniya." },
      { day: "Tag 4", title: "Nuwara Eliya & Ella", desc: "Fahrt durch atemberaubende Teehochländer. Besuch einer Teefabrik, dann Weiterfahrt nach Ella zum berühmten Neun-Bögen-Brücke." },
      { day: "Tag 5", title: "Safari im Yala-Nationalpark", desc: "Ganztägige Jeep-Safari im Yala-Nationalpark — Heimat von Leoparden, Elefanten und exotischen Vögeln." },
      { day: "Tag 6", title: "Festung Galle → Abreise", desc: "Morgendlicher Besuch der Festung Galle (UNESCO). Transfer zum Flughafen Colombo für die Abreise." },
    ],
  },
  {
    id: "6n7d",
    label: "6N/7D",
    title: "6 Nächte / 7 Tage",
    duration: "7 Tage",
    focus: "Vollständiges Inselerlebnis",
    highlights: "Sigiriya, Kandy, Teezug, Yala, Galle",
    idealFor: "Familien & gründliche Entdecker",
    days: [
      { day: "Tag 1", title: "Ankunft → Kulturelles Dreieck", desc: "Ankunft am BIA. Fahrt nach Norden über den Dambulla-Höhlentempel in die Gegend von Sigiriya / Kandalama." },
      { day: "Tag 2", title: "Sigiriya & Polonnaruwa", desc: "Aufstieg auf den Sigiriya-Felsen. Nachmittags Besuch der antiken Stadt Polonnaruwa (UNESCO-Weltkulturerbe)." },
      { day: "Tag 3", title: "Kandy", desc: "Fahrt nach Kandy über einen Gewürzgarten. Besuch des Zahntempels und Genuss einer traditionellen Kandyan-Tanzvorführung." },      { day: "Tag 4", title: "Nuwara Eliya — Tee-Hochland", desc: "Landschaftlich reizvolle Fahrt durch das Teegebiet. Tee-Pflück-Erlebnis und High Tea in einem Plantagenhotel aus der Kolonialzeit." },
      { day: "Tag 5", title: "Ella & Neun-Bögen-Brücke", desc: "Fahrt mit dem ikonischen Tee-Zug. Besuch der Neun-Bögen-Brücke und des Little Adam's Peak in Ella." },
      { day: "Tag 6", title: "Yala-Nationalpark", desc: "Ganztägige Jeep-Safari im Yala – Sri Lankas erstklassigem Wildreservat. Leoparden, Elefanten, Krokodile und mehr." },
      { day: "Tag 7", title: "Galle Fort → Abreise", desc: "Morgen im Galle Fort (UNESCO). Transfer zum Flughafen Colombo über den Strand von Mirissa (optionaler Stopp)." },
    ],
  },
  {
    id: "5to7d",
    label: "5–7 Tage Kultur",
    title: "5 bis 7 Tage\nFokus auf das Kulturelle Dreieck",
    duration: "5–7 Tage",
    focus: "UNESCO-Welterbestätten & Safari",
    highlights: "Sigiriya, Anuradhapura, Polonnaruwa, Kandy",
    idealFor: "Geschichts- und Kulturinteressierte",
    days: [
      { day: "Tag 1", title: "Flughafen → Dambulla-Höhlentempel → Sigiriya-Gegend", desc: "Abfahrt vom Flughafen Colombo (ca. 3–4 Stunden Fahrt). Unterwegs Besuch des Dambulla-Höhlentempels – eine beeindruckende UNESCO-Welterbestätte, die in einen Felsen gehauen ist. Check-in im Heritance Kandalama, einem architektonischen Meisterwerk von Geoffrey Bawa." },
      { day: "Tag 2", title: "Sigiriya-Felsenfestung & Minneriya-Safari", desc: "Frühmorgendlicher Aufstieg auf den Sigiriya-Felsen (UNESCO) – rechnen Sie mit 2,5–3 Stunden für Hin- und Rückweg. Nachmittags Jeep-Safari im Minneriya-Nationalpark, bekannt für seine Elefantenherden. Rückkehr zum Hotel." },
      { day: "Tag 3", title: "Alte Hauptstadt Anuradhapura", desc: "Erkunden Sie die weitläufigen, UNESCO-gelisteten Ruinen von Anuradhapura – Sri Lankas erste antike Hauptstadt. Besuch des heiligen Bodhi-Baums, der Ruwanwelisaya-Stupa und weiterer bemerkenswerter Monumente. Planen Sie einen ganzen Tag für diese weitläufige Stätte ein." },
      { day: "Tag 4", title: "Polonnaruwa & Pidurangala-Felsen", desc: "Optionaler morgendlicher Aufstieg auf den Pidurangala-Felsen für spektakuläre Ausblicke auf Sigiriya. Anschließend Erkundung der mittelalterlichen Stadt Polonnaruwa (UNESCO) – gut erhaltene Tempel, Paläste und riesige Buddha-Statuen." },
      { day: "Tag 5", title: "Kandy über Gewürzgarten", desc: "Fahrt nach Kandy über einen traditionellen Gewürzgarten in Matale. Besuch des Tempels der Heiligen Zahnreliquie (UNESCO). Abends genießen Sie eine kulturelle Tanzvorführung aus Kandy." },
      { day: "Tag 6", title: "Colombo-Stadtrundfahrt & Ayurveda (optional)", desc: "Erkunden Sie Colombos koloniale Architektur, lebhafte Märkte und die Uferpromenade. Optional: Check-in in einem Ayurveda-Hotel in Negombo zum Entspannen vor der Abreise." },
      { day: "Tag 7", title: "Transfer zum Flughafen", desc: "Letzter Morgen zur freien Verfügung. Transfer zum Flughafen Colombo (BIA) für Ihren Heimflug." },
    ],
  },
  {
    id: "10to14d",
    label: "10 Tage–2 Wochen",
    title: "10 Tage bis 2 Wochen\nKlassischer Plan für Erstbesucher",
    duration: "10–14 Tage",
    focus: "Komplettes Inselerlebnis",    highlights: "Sigiriya, Kandy, Teezug, Yala, Galle, Strand",
    idealFor: "Erstbesucher, die das volle Sri Lanka Erlebnis wollen",
    days: [
      { day: "Tag 1", title: "Flughafen → Dambulla Höhlentempel → Sigiriya", desc: "Abfahrt vom Flughafen Colombo oder Negombo. Fahrt zum Kultur-Dreieck (ca. 3 Std.). Stopp am Dambulla Höhlentempel zum Mittagessen und Sightseeing. Check-in im Heritance Kandalama — ein berühmtes Geoffrey Bawa Hotel, eingebettet in Wald und See." },
      { day: "Tag 2", title: "Sigiriya Felsen & Anuradhapura", desc: "Morgendlicher Aufstieg zur Sigiriya Felsenfestung (UNESCO). Transfer zur antiken Hauptstadt Anuradhapura (1,5–2 Std.). Erkundung des heiligen Bodhi-Baums, der Stupas und antiker Ruinen. Rückkehr zum Hotel." },
      { day: "Tag 3", title: "Kandy — Gewürzgarten & Tempel", desc: "Fahrt nach Kandy über einen Gewürzgarten in Matale (ca. 3 Std.). Besuch der Geragama Tee-Fabrik und des Tempels der Heiligen Zahnreliquie (UNESCO). Abends Kandyan Tanzvorführung." },
      { day: "Tag 4", title: "Nuwara Eliya — Teehochland", desc: "Landschaftlich reizvolle Bergfahrt nach Nuwara Eliya durch sanfte Teeplantagen. Tee-Pflückerlebnis und High Tea in einem kolonialen Plantagenhotel. Erkundung der charmanten 'Little England' Stadt." },
      { day: "Tag 5", title: "Malersicher Teezug — Neun-Bögen-Brücke", desc: "Einsteigen in den ikonischen Teeland-Zug für eine atemberaubende Fahrt durch neblige Berge. Fotografieren der berühmten Neun-Bögen-Brücke. Ankunft in Ella." },
      { day: "Tag 6", title: "Ella Besichtigung → Yala", desc: "Morgendliche Wanderung zum Little Adam's Peak und Ella Rock mit Panoramablick. Nachmittags Transfer in die Yala-Region (ca. 2 Std.). Check-in in einer Safari-Lodge." },
      { day: "Tag 7", title: "Yala Nationalpark Safari → Mirissa Strand", desc: "Frühmorgendliche Jeep-Safari im Yala — Sri Lankas bekanntestem Wildpark mit der weltweit höchsten Leoparden-Dichte. Nachmittags Transfer zum Strandresort Mirissa." },
      { day: "Tag 8", title: "Galle Fort & Strandtag", desc: "Morgendlicher Besuch des UNESCO-geschützten Galle Fort — niederländische Kolonialbefestigungen, Boutiquen und Meerblick. Nachmittags Freizeit am Mirissa Strand. Optional Walbeobachtung (saisonal)." },
      { day: "Tag 9", title: "Negombo — Ayurveda & Erholung", desc: "Transfer nach Negombo an der Westküste (ca. 3–4 Std.). Check-in in einem Ayurveda-Hotel für traditionelle Behandlungen und Entspannung vor der Abreise." },
      { day: "Tag 10", title: "Colombo Besichtigung → Flughafen", desc: "Morgendliche Erkundung von Colombo — Gangaramaya Tempel, Pettah Markt und das lebhafte Galle Face Green. Transfer zum Flughafen Colombo (BIA) für Ihren Abflug." },
    ],
  },
];

function Itineraries() {
  const [activeTab, setActiveTab] = useState("4n5d");
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const active = ITINERARIES.find((it) => it.id === activeTab)!;

  return (
    <section id="courses">
      <div className="container">        <div className="section-eyebrow">MODELL-REISEROUTEN</div>
        <h2 className="section-title">Vorgeschlagene Reiserouten</h2>
        <p className="section-sub">Sie sind unsicher, wo Sie anfangen sollen? Durchstöbern Sie unsere sorgfältig ausgewählten Beispielrouten und lassen Sie sich für Ihre perfekte Sri Lanka-Reise inspirieren.</p>
        <div className="course-tabs">
          {ITINERARIES.map((it) => (
            <button key={it.id} className={`course-tab${activeTab === it.id ? " active" : ""}`} onClick={() => setActiveTab(it.id)}>
              {it.label}
            </button>
          ))}
        </div>
        <div className="course-panel active">
          <div className="course-overview">
            <div className="course-meta">
              <h3 style={{ whiteSpace: "pre-line" }}>{active.title}</h3>
              <div className="course-meta-item"><span className="course-meta-label">Dauer</span><span className="course-meta-value">{active.duration}</span></div>
              <div className="course-meta-item"><span className="course-meta-label">Schwerpunkt</span><span className="course-meta-value">{active.focus}</span></div>
              <div className="course-meta-item"><span className="course-meta-label">Highlights</span><span className="course-meta-value">{active.highlights}</span></div>
              <div className="course-meta-item"><span className="course-meta-label">Ideal für</span><span className="course-meta-value">{active.idealFor}</span></div>
            </div>
            <div className="course-timeline">
              <h4>Tag-für-Tag Übersicht</h4>
              {active.days.map((d, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-left">
                    <div className="timeline-day">{d.day}</div>
                    {i < active.days.length - 1 && <div className="timeline-line" />}
                  </div>
                  <div className="timeline-content">
                    <h5>{d.title}</h5>
                    <p>{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="courses-cta">
          <a href="#contact" className="btn-outline" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>
            Alle Pläne ansehen &amp; ein Angebot erhalten
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Destinations ─────────────────────────────────────────────────────────────
function Destinations() {
  const dests = [
    { img: IMAGES.hero2, badge: "UNESCO-Weltkulturerbe", title: "Felsenfestung Sigiriya", desc: "Ein antiker Himmelspalast auf einem 200 m hohen Vulkangestein – das ikonischste Wahrzeichen Sri Lankas." },
    { img: IMAGES.hero4, badge: "UNESCO-Weltkulturerbe", title: "Kandy – Zahntempel", desc: "Der heilige Tempel, der die Reliquie des Zahns Buddhas beherbergt, gelegen an einem ruhigen See." },    { img: IMAGES.destNuwara, badge: "Teegebiet", title: "Nuwara Eliya — Teehochland", desc: "Sanft geschwungene smaragdgrüne Teeplantagen in großer Höhe. Erleben Sie Teepflücken, Fabrikbesichtigungen und koloniale Plantagenhotels." },
    { img: IMAGES.hero5, badge: "UNESCO-Weltkulturerbe", title: "Galle Fort", desc: "Eine perfekt erhaltene niederländische Kolonialfestung an der Südküste, voller Boutiquen und Cafés." },
    { img: IMAGES.destYala, badge: "Wildlife-Safari", title: "Yala Nationalpark", desc: "Heimat der weltweit höchsten Leoparden-Dichte. Außerdem können Sie Elefanten, Krokodile und hunderte Vogelarten beobachten." },
    { img: IMAGES.destElla, badge: "Malersche Eisenbahn", title: "Ella — Nine Arches Bridge", desc: "Das ikonische Eisenbahnviadukt aus der Kolonialzeit, umgeben von üppigem Dschungel und Teeplantagen. Ein Muss für Fotografen." },
  ];
  return (
    <section id="destinations">
      <div className="container">
        <div className="section-eyebrow">REISEZIELE</div>
        <h2 className="section-title">Sri Lankas<br />berühmteste Reiseziele</h2>
        <p className="section-sub">Von UNESCO-Weltkulturerbestätten bis zu unberührten Stränden bietet Sri Lanka eine außergewöhnliche Vielfalt an Erlebnissen auf einer kompakten Insel.</p>
        <div className="destinations-grid">
          {dests.map((d, i) => (
            <div key={i} className="dest-card">
              <img src={d.img} alt={d.title} />
              <div className="dest-card-overlay">
                <div className="dest-card-badge">{d.badge}</div>
                <h3>{d.title}</h3>
                <p>{d.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Bewertungen ───────────────────────────────────────────────────────────────
function Reviews() {
  const [slide, setSlide] = useState(0);
  const reviews = [
    {
      photo: "/manus-storage/review1_r_family_eranga_a3545b4c_71ec5260.png",
      photoPosition: "center center",
      name: "Die Familie R",
      pax: "4 Reisende",
      period: "August 2025",
      driver: "Eranga",
      quote: "Professioneller Service von der ersten Anfrage bis zur finalen Abholung – wir fühlten uns jederzeit rundum wohl.",
      body: "Vom Vorbuchen bis zum Reisetag reagierte das Team schnell und klar. Preise und Reiseplanung wurden so erklärt, dass keine Unsicherheiten blieben. Am Tag selbst fuhr Eranga umsichtig und gelassen, umfuhr Staus nahtlos und hielt uns im Zeitplan. Sein tiefes Wissen über Anuradhapura, Dambulla, Sigiriya und Polonnaruwa gab uns eine reiche historische Grundlage, um dieses bemerkenswerte Land zu verstehen. Wir schätzen uns glücklich, ihn als Fahrer und Guide gehabt zu haben.",
    },
    {
      photo: "/manus-storage/review2_r_family_aruna_3473eef8_61caeab4.png",
      name: "Die Familie R",
      pax: "4 Reisende",
      period: "März 2026",
      driver: "Aruna",      quote: "Aruna war unendlich geduldig mit unseren Kindern und machte jeden Moment der Reise mühelos.",
      body: "Aruna bei uns zu haben, war wirklich ein Glücksfall. Seine warme Art mit den Kindern brachte uns alle zur Ruhe, und sein klares Englisch sorgte dafür, dass nichts verloren ging in der Übersetzung. Pünktlich, voller durchdachter Vorschläge für Sehenswürdigkeiten und lokale Restaurants und stets ruhig am Steuer – er war alles, was wir uns wünschen konnten. (Die Straße zwischen Passikudah und Sigiriya überspringen wir beim nächsten Mal wohl lieber!) Wir empfehlen ihn ohne Zögern: aufmerksam, kenntnisreich und absolut vertrauenswürdig. Wenn du jemals in Europa bist, Aruna – die erste Runde geht auf uns.",
    },
    {
      photo: "/manus-storage/review_ranjana_new_2b654dea_4e72f803.png",
      name: "Das H-Paar",
      pax: "2 Passagiere",
      period: "November 2025",
      driver: "Ranjana",
      quote: "Ranjana verwandelte unsere Sri Lanka-Reise in etwas weit mehr als gewöhnliches Sightseeing.",
      body: "Wir buchten einen privaten Charter für zwei Personen und wurden mit Ranjana zusammengebracht – eine Entscheidung, die wir nicht glücklicher hätten treffen können. Er brachte eine ruhige Zuversicht in jede Fahrt und navigierte mit gleicher Leichtigkeit über Bergstraßen und durch belebte Stadtzentren. Besonders auffallend war seine echte Begeisterung: Er schlug ein Wildwasser-Rafting vor, das wir nicht geplant hatten, und es wurde zu einem der Höhepunkte der Reise. Sein lokales Wissen über versteckte Aussichtspunkte, authentische Restaurants und kulturelle Bräuche bereicherte jeden Tag. Ranjana ist der Typ Guide, der einen wie einen Gast des Landes fühlen lässt, nicht nur wie einen vorbeiziehenden Touristen.",
    },
    {
      photo: "/manus-storage/review4_as_priyanth_2aeb5d81_dd25dbac.png",
      name: "Das A&S",
      pax: "2 Passagiere",
      period: "August 2025",
      driver: "Priyanth",
      quote: "Priyanth ließ sechs Tage wie eine Reise mit einem vertrauten Freund wirken, nicht wie mit einem gemieteten Fahrer.",
      body: "Vom Flughafen Colombo aus führte uns Priyanth über sechs Tage durch Sigiriya, Kandy, Nuwara Eliya und Galle. Er war pünktlich und fuhr stets vorsichtig, wobei er immer wieder nachfragte, wie es uns ging – etwas, das wir auf längeren Strecken wirklich schätzten. Seine fröhliche Gesellschaft machte jede Fahrt angenehm, und seine Einblicke in die Geschichte und Kultur Sri Lankas verliehen dem Gesehenen echte Tiefe. Außerdem brachte er uns zu einem atemberaubenden Aussichtspunkt, der nicht in unserem ursprünglichen Plan war, und stellte uns lokale Restaurants vor, die einfach herausragend waren. Wir würden gerne bei unserem nächsten Besuch in Sri Lanka wieder mit ihm reisen.",
    },
    {
      photo: "/manus-storage/review5_t_couple_indika_519f1510_33162179.png",
      name: "Das T-Paar",
      pax: "2 Passagiere",
      period: "Oktober 2025",
      driver: "Indika",
      quote: "Dank Indika wurde unsere Reise nicht nur Sightseeing – sie wurde zu einer reich farbenfrohen, unvergesslichen Reise.",
      body: "Wir reisten als Paar von Negombo über Sigiriya, Kandy, Nuwara Eliya und Mirissa in fünf Tagen. Am allerersten Morgen – der zufällig ein Geburtstag war – erschien zum Frühstück eine Torte, die Indika still und heimlich über das Hotel organisiert hatte. Er schenkte uns auch eine kleine Elefantenfigur. Wir waren wirklich gerührt. Während der gesamten Reise war er eine verlässliche, beruhigende Präsenz: Er informierte uns vor jeder Sehenswürdigkeit, meisterte frühe Starts ohne Klagen, empfahl Restaurants, die er persönlich besucht (und jedes einzelne war ausgezeichnet), und fuhr sogar mit uns im Zug mit, um uns in den Menschenmengen zu schützen. Wenn etwas überteuert schien, sagte er einfach: ‚Lass uns das überspringen‘ – diese Ehrlichkeit ließ uns ihm vollkommen vertrauen. Indika zu treffen war ohne Zweifel ein Teil dessen, was diese Reise perfekt machte.",
    },
    {
      photo: "/manus-storage/review_dfamily_chamil_9214e24c_0da61c66.png",
      name: "Die D Familie",
      pax: "5 Passagiere",
      period: "Dezember 2025",
      driver: "Chamil",
      quote: "Obwohl wir unsere Reiseroute nach einem Zyklon komplett umplanen mussten, machte Chamil daraus die Reise unseres Lebens.",
      body: "Wir reisten als drei Generationen – Großeltern, Eltern und ein Kind – kurz nachdem ein Zyklon die Insel durcheinandergebracht hatte. Chamil sammelte ständig die neuesten Informationen zu Straßenverhältnissen und Sicherheit und schlug immer die besten verfügbaren Routen unter Berücksichtigung unserer Vorlieben vor. Als wir Hotels und Zugbuchungen stornieren und kurzfristig neue arrangieren mussten, war er jederzeit zur Stelle und half uns bei jedem Schritt. Er begleitete uns beim Aufstieg zum Sigiriya-Felsen und auf der Safari, was uns enorm beruhigte. Seine Fürsorge für unser Kind war besonders berührend – wenn die Müdigkeit zu einem ungünstigen Zeitpunkt einsetzte, fühlten wir uns völlig wohl dabei, unser Kind in seine Obhut zu geben. Er brachte uns auch zu lokalen Restaurants, die nur Einheimische kennen, und jede einzelne Mahlzeit war eine Offenbarung. Chamils Herzlichkeit, schnelles Denken und natürliche Rücksichtnahme gewannen jedes Familienmitglied – Kinder wie Erwachsene. Wir freuen uns schon auf unsere nächste Reise nach Sri Lanka und werden auf jeden Fall wieder nach Chamil fragen.",
    },
  ];

  // Group reviews into pairs for 2-per-slide display
  const totalSlides = Math.ceil(reviews.length / 2);
  const prevSlide = () => setSlide((s) => (s - 1 + totalSlides) % totalSlides);
  const nextSlide = () => setSlide((s) => (s + 1) % totalSlides);

  const visibleReviews = reviews.slice(slide * 2, slide * 2 + 2);

  return (
    <section id="reviews" style={{ background: "var(--dark2)" }}>
      <div className="container">
        <div className="section-eyebrow">KUNDENSTIMMEN</div>
        <h2 className="section-title">Was unsere Gäste sagen</h2>
        <p className="section-sub">Echte Bewertungen von Reisenden, die Sri Lanka mit SLTCS erkundet haben.</p>
        <div className="reviews-slider">
          <div className="reviews-slide-row">
            {visibleReviews.map((r, i) => (              <div key={slide * 2 + i} className="review-card-v2">
                <div className="review-photo-wrap">
                  <img src={r.photo} alt={r.name} className="review-photo" style={r.photoPosition ? { objectPosition: r.photoPosition } : undefined} />
                </div>
                <div className="review-card-body">
                  <div className="review-stars">★★★★★</div>
                  <div className="review-quote-v2">"{r.quote}"</div>
                  <div className="review-body-v2">{r.body}</div>
                  <div className="review-meta-row">
                    <div className="review-name-v2">{r.name}</div>
                    <div className="review-tags">
                      <span className="review-tag-item">{r.pax}</span>
                      <span className="review-tag-item">{r.period}</span>
                      <span className="review-tag-item">Fahrer: {r.driver}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="reviews-controls">
            <button className="reviews-nav" onClick={prevSlide} aria-label="Vorherige">‹</button>
            <div className="reviews-dots">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  className={`reviews-dot${i === slide ? " active" : ""}`}
                  onClick={() => setSlide(i)}
                  aria-label={`Folie ${i + 1}`}
                />
              ))}
            </div>
            <button className="reviews-nav" onClick={nextSlide} aria-label="Nächste">›</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { icon: "💬", title: "1. Anfrage senden", desc: "Füllen Sie das Kontaktformular mit Ihren Reisedaten, der Gruppengröße und Ihren Vorlieben aus." },
    { icon: "📋", title: "2. Angebot erhalten", desc: "Wir senden Ihnen innerhalb von 24 Stunden eine maßgeschneiderte Reiseroute und ein Angebot." },
    { icon: "💳", title: "3. Bestätigen", desc: "Sind Sie mit dem Plan zufrieden? Bestätigen Sie einfach Ihre Buchung. Es ist keine Vorauszahlung erforderlich – Sie zahlen erst bei Ankunft in Sri Lanka." },
    { icon: "🕐", title: "4. Vorab-Briefing", desc: "Vor der Abreise bestätigen wir Ihre Fahrerdetails, den Treffpunkt und die endgültige Reiseroute." },
    { icon: "🏝️", title: "5. Genießen Sie Sri Lanka!", desc: "Ihr privater Fahrer begleitet Sie auf jedem Schritt. Entspannen Sie sich und entdecken Sie." },
  ];
  return (
    <section id="how">
      <div className="container">
        <div className="section-eyebrow">SO FUNKTIONIERT ES</div>
        <h2 className="section-title">Buchen Sie Ihren privaten Fahrer in Sri Lanka<br />in 5 Schritten</h2>
        <div className="how-steps">
          {steps.map((s, i) => (
            <div key={i} className="how-step">
              <div className="how-step-num">{s.icon}</div>              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Vehicles ─────────────────────────────────────────────────────────────────
function Vehicles() {
  return (
    <section id="vehicles" style={{ background: "var(--dark3)" }}>
      <div className="container">
        <div className="section-eyebrow">FAHRZEUGE</div>
        <h2 className="section-title">Unsere Flotte</h2>
        <p className="section-sub">Alle Fahrzeuge sind klimatisiert, sauber und werden regelmäßig gewartet, um Ihren Komfort und Ihre Sicherheit zu gewährleisten.</p>
        <div className="vehicles-grid">
          <div className="vehicle-card">
            <div className="vehicle-img-wrap">
              <img src="/manus-storage/vehicle_sedan_b6b21042_68471b64.png" alt="Sedan" className="vehicle-img" />
            </div>
            <h3>Sedan</h3>
            <div className="vehicle-capacity">Bis zu 3 Passagiere</div>
            <p>Ideal für Alleinreisende und Paare. Komfortabel und wirtschaftlich für Touren durch Sri Lanka.</p>
          </div>
          <div className="vehicle-card featured">
            <div className="vehicle-img-wrap">
              <img src="/manus-storage/vehicle_van_70a807f8_14a836f7.png" alt="Van" className="vehicle-img" />
            </div>
            <h3>Van</h3>
            <div className="vehicle-capacity">Bis zu 6 Passagiere</div>
            <p>Unsere beliebteste Wahl. Geräumig und komfortabel für Familien und kleine Gruppen.</p>
          </div>
          <div className="vehicle-card">
            <div className="vehicle-img-wrap">
              <img src="/manus-storage/vehicle_large_van_61632670_acbc5694.png" alt="Large Van" className="vehicle-img" />
            </div>
            <h3>Großer Van</h3>
            <div className="vehicle-capacity">Bis zu 10 Passagiere</div>
            <p>Perfekt für große Gruppen und Familien. Maximaler Komfort für Langstreckenfahrten über die Insel.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Company ──────────────────────────────────────────────────────────────────
function Company() {
  return (
    <section id="company" style={{ background: "var(--dark2)" }}>
      <div className="container">
        <div className="section-eyebrow">UNTERNEHMEN</div>
        <h2 className="section-title">Über SLTCS</h2>
        <table className="company-table">
          <tbody>
            <tr><th>Service Name</th><td>SLTCS｜Sri Lanka Car Hire mit privatem Fahrer</td></tr>
            <tr><th>Vollständiger Name</th><td>Sri Lanka Taxi Charter Service (SLTCS)<br /><small style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>Eingetragenes Warenzeichen Nr. 7034996</small></td></tr>
            <tr><th>Geschäftsfeld</th><td>Online-Vermittlungsdienst für Bodentransporte</td></tr>            <tr><th>Abdeckungsgebiet</th><td>Ganz Sri Lanka — Colombo, Negombo, Kandy, Sigiriya, Nuwara Eliya, Galle, Yala und darüber hinaus</td></tr>
            <tr><th>Sprachen</th><td>Englisch</td></tr>
            <tr><th>Öffnungszeiten</th><td>24/7 — Anfragen jederzeit möglich</td></tr>
            <tr><th>Kontakt</th><td>Bitte verwenden Sie das Anfrageformular auf dieser Seite</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">SLTCS</div>
            <p>Sri Lanka Autovermietung mit privatem Fahrer. Vollständig privat, vollständig flexibler Charterservice, der ganz Sri Lanka abdeckt — vertraut von europäischen und britischen Reisenden.</p>
          </div>
          <div className="footer-col">
            <h4>Navigation</h4>
            <ul>
              <li><a href="#plans" onClick={(e) => { e.preventDefault(); scrollTo("plans"); }}>Pläne</a></li>
              <li><a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>Beispielrouten</a></li>
              <li><a href="#vehicles" onClick={(e) => { e.preventDefault(); scrollTo("vehicles"); }}>Fahrzeuge</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>Kontakt</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Reiserouten</h4>
            <ul>
              <li><a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>4 Nächte / 5 Tage</a></li>
              <li><a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>5 Nächte / 6 Tage</a></li>
              <li><a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>6 Nächte / 7 Tage</a></li>
              <li><a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>5–7 Tage Kultur</a></li>
              <li><a href="#courses" onClick={(e) => { e.preventDefault(); scrollTo("courses"); }}>10 Tage – 2 Wochen</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Rechtliches</h4>
            <ul>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Datenschutzrichtlinie</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Allgemeine Geschäftsbedingungen</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Copyright © SLTCS｜Sri Lanka Autovermietung mit privatem Fahrer. Alle Rechte vorbehalten.</p>
          <div className="footer-bottom-links">            <a href="#" onClick={(e) => e.preventDefault()}>Datenschutzerklärung</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Allgemeine Geschäftsbedingungen</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Floating CTA ─────────────────────────────────────────────────────────────
function FloatingCTA() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <div className="floating-cta">
      <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>
        Kostenlose Anfrage
      </a>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────────────────────
export default function Home() {
  const homeJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "SLTCS – Sri Lanka Mietwagen mit privatem Fahrer",
    description: "Privater Mietwagenservice in Sri Lanka mit englischsprachigem Fahrer. Transparente Pauschaltarife, keine versteckten Kosten.",
    url: "https://de.srilanka-charter.com/",
    address: {
      "@type": "PostalAddress",
      addressCountry: "LK",
    },
    priceRange: "$$$",
    image: "https://de.srilanka-charter.com/favicon-192.png",
  }), []);

  useSEO({
    title: "Sri Lanka Mietwagen mit privatem Fahrer | SLTCS",
    description: "Sri Lanka Mietwagen mit privatem Fahrer – Pauschaltarife ohne versteckte Kosten. Englischsprachiger Fahrer, Limousine, Van & Großer Van. Jetzt kostenlos anfragen.",
    path: "/",
    jsonLdList: [homeJsonLd],
    jsonLdIdPrefix: "home",
  });

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Navbar />
      <Hero />
      <Stats />
      <ContactAndWhy />
      <Concerns />
      <Plans />
      <PricingPreview />
      <Itineraries />
      <Destinations />
      <Reviews />
      <HowItWorks />
      <Vehicles />
      <Company />
      <Footer />
      <FloatingCTA />
    </div>
  );
}