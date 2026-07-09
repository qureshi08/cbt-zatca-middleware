import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, ORG_NAME } from "@/lib/site";
import { cbt } from "@/lib/ui";

const TITLE = "ZATCA Middleware — 5-Minute Setup for Odoo, Zoho, POS & Any Software";
const DESCRIPTION = "Set up in about 5 minutes, then never think about ZATCA compliance again. Connect Odoo, Zoho Books, or virtually any accounting, invoicing, or POS software — every invoice, credit note, and debit note is signed, cleared, and reported to ZATCA automatically. By Convergent Business Technologies.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: `${SITE_NAME} · ${ORG_NAME}`,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const FAQ = [
  {
    q: "What is ZATCA Phase 2 e-invoicing?",
    a: "ZATCA Phase 2 (the Integration Phase) requires businesses in Saudi Arabia to generate e-invoices in a structured XML format, have them cryptographically signed, and submit them to ZATCA in real time — cleared for B2B (standard) invoices, reported for B2C (simplified) invoices. ZATCA Middleware handles every step of this automatically for each invoice your business issues.",
  },
  {
    q: "Which accounting or POS software does it work with?",
    a: "Odoo and Zoho Books are supported out of the box, with guided one-click setup. Beyond those, our REST API is built to be flexible enough to connect virtually any accounting, invoicing, or point-of-sale software — including systems you've built yourself — with a live tester and a ready-made Postman collection.",
  },
  {
    q: "Do I need to change how I create invoices?",
    a: "No. You keep invoicing exactly as you do today, in whatever software you already use. ZATCA Middleware picks up each invoice automatically in the background and handles signing, clearance, and reporting for you.",
  },
  {
    q: "Do I need to log in and manage this regularly?",
    a: "No. Setup is a one-time, roughly 5-minute step. After that, every invoice is handled automatically in the background — you don't need to open this dashboard again unless you want to. We'll only reach out by email if an invoice ever needs your attention.",
  },
  {
    q: "Does it handle credit notes and debit notes too?",
    a: "Yes. All three ZATCA document types are supported — tax invoices (388), credit notes (381), and debit notes (383) — for both standard (B2B, clearance) and simplified (B2C, reporting) invoice types.",
  },
  {
    q: "Can I test it before going live?",
    a: "Yes. Every account starts in Demo mode, which runs against ZATCA's simulation environment so you can test your full setup risk-free before switching to real, legally-binding filing — no code changes required to go live.",
  },
  {
    q: "What happens if an invoice fails to clear?",
    a: "You're notified immediately by email with the exact reason ZATCA rejected it, and you can retry with one click once it's fixed — no need to resend it from your accounting software.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Accounting-software credentials and ZATCA signing keys are encrypted at rest, every integration authenticates with per-tenant API keys, and your team can invite colleagues with their own logins rather than sharing one account.",
  },
];

const FEATURES = [
  { t: "Set up once, in about 5 minutes", d: "A guided, one-click setup for Odoo and Zoho Books, or a simple API key for anything else. Most teams are fully running before their coffee gets cold." },
  { t: "Works with virtually any software", d: "Beyond our one-click Odoo and Zoho Books connectors, our API is built to be this flexible — any accounting, invoicing, or POS system that can make an HTTP request can integrate." },
  { t: "All ZATCA Phase 2 document types", d: "Standard (B2B) and simplified (B2C) invoices, credit notes, and debit notes — 388, 381, and 383 — handled the same way." },
  { t: "Real-time clearance & reporting", d: "Signed UBL 2.1 XML, a ZATCA QR code, and the clearance/reporting status come back in seconds, every time." },
  { t: "Set it and forget it", d: "Once you're connected, you don't need to log back in. We'll email you the instant an invoice needs attention — otherwise, it's fully hands-off." },
  { t: "Secure, multi-user by design", d: "Encrypted credentials and signing keys, per-tenant API keys, and team invitations so nobody shares a login." },
];

const STEPS = [
  { n: "1", t: "Connect in minutes", d: "Link Odoo or Zoho Books in one click, or call our open API from any accounting, invoicing, or POS software you already use." },
  { n: "2", t: "We handle compliance", d: "Every invoice is signed, cleared (B2B) or reported (B2C) with ZATCA automatically, the moment it's created." },
  { n: "3", t: "Forget about it", d: "Keep invoicing exactly as you do today. You don't need to open this dashboard again — we'll only reach out if something needs your attention." },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORG_NAME,
    url: "https://convergentbt.com",
    logo: `${SITE_URL}/cbt-logo-primary.png`,
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    description: DESCRIPTION,
    provider: { "@type": "Organization", name: ORG_NAME, url: "https://convergentbt.com" },
    featureList: FEATURES.map((f) => f.t),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
];

const container: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", padding: "0 24px" };
const section = (bg: string): React.CSSProperties => ({ background: bg, padding: "64px 0" });
const h2Style: React.CSSProperties = { fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", letterSpacing: "-0.02em", color: cbt.textHeading, margin: "0 0 12px" };
const eyebrowStyle: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: cbt.primary, marginBottom: 8 };
const btnPrimary: React.CSSProperties = { background: cbt.primary, color: "#fff", padding: "12px 26px", borderRadius: 6, fontSize: 14, fontWeight: 600, textDecoration: "none", display: "inline-block" };
const btnGhost: React.CSSProperties = { background: "transparent", color: cbt.primary, border: `2px solid ${cbt.primary}`, padding: "10px 24px", borderRadius: 6, fontSize: 14, fontWeight: 600, textDecoration: "none", display: "inline-block" };
const card: React.CSSProperties = { background: "#fff", border: `1px solid ${cbt.border}`, borderRadius: 12, padding: "22px 20px" };

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "var(--font-body)", color: cbt.textBody }}>
      {jsonLd.map((block, i) => (
        // eslint-disable-next-line react/no-danger
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }} />
      ))}

      {/* NAV */}
      <div style={{ borderBottom: `1px solid ${cbt.border}`, position: "sticky", top: 0, background: "#fff", zIndex: 10 }}>
        <div style={{ ...container, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/cbt-favicon-mark.png" alt="" style={{ width: 30, height: 30, borderRadius: 8 }} />
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 17, color: cbt.primaryDark }}>ZATCA Middleware</span>
          </Link>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href="/login" style={{ color: cbt.textBody, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Sign in</Link>
            <Link href="/register" style={btnPrimary}>Get started free</Link>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section style={section("#fff")}>
        <div style={{ ...container, textAlign: "center", maxWidth: 780 }}>
          <span style={eyebrowStyle}>ZATCA Phase 2 · E-Invoicing</span>
          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(2rem,5vw,3rem)", letterSpacing: "-0.02em", color: cbt.textHeading, margin: "0 0 18px", lineHeight: 1.15 }}>
            Stay ZATCA-compliant, <span style={{ fontStyle: "italic", color: cbt.primary }}>automatically</span>
          </h1>
          <p style={{ fontSize: 18, color: cbt.textMuted, lineHeight: 1.6, margin: "0 0 30px" }}>
            Set up in about 5 minutes. Connect Odoo, Zoho Books, or virtually any accounting, invoicing, or POS
            software you already use — every invoice, credit note, and debit note is signed, cleared, and reported
            to ZATCA automatically. Keep working exactly as you do today; we deal with your compliance.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" style={btnPrimary}>Get started free →</Link>
            <Link href="/login" style={btnGhost}>Sign in</Link>
          </div>
          <div style={{ marginTop: 30, display: "flex", gap: 22, justifyContent: "center", flexWrap: "wrap", fontSize: 12, color: cbt.textFaint, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <span>⏱ 5-minute setup</span>
            <span>🔌 Any accounting or POS software</span>
            <span>✓ Set once, forget it</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={section(cbt.surface)}>
        <div style={container}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={eyebrowStyle}>How it works</span>
            <h2 style={h2Style}>Three steps. Zero manual filing.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {STEPS.map((s) => (
              <div key={s.n} style={card}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: cbt.primaryMuted, color: cbt.primaryDark, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: 14 }}>{s.n}</div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 17, color: cbt.textHeading, margin: "0 0 6px" }}>{s.t}</h3>
                <p style={{ fontSize: 13.5, color: cbt.textMuted, margin: 0, lineHeight: 1.55 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={section("#fff")}>
        <div style={container}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={eyebrowStyle}>What you get</span>
            <h2 style={h2Style}>Everything compliance requires, none of the busywork</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {FEATURES.map((f) => (
              <div key={f.t} style={card}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 16, color: cbt.textHeading, margin: "0 0 6px" }}>{f.t}</h3>
                <p style={{ fontSize: 13.5, color: cbt.textMuted, margin: 0, lineHeight: 1.55 }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={section(cbt.surface)}>
        <div style={{ ...container, maxWidth: 780 }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <span style={eyebrowStyle}>Questions</span>
            <h2 style={h2Style}>Frequently asked questions</h2>
          </div>
          <div>
            {FAQ.map((f, i) => (
              <details key={f.q} className="faq-item" open={i === 0}>
                <summary>
                  <span>{f.q}</span>
                  <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <p className="faq-answer">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section style={{ ...section("linear-gradient(135deg,#007A3D 0%,#00994D 55%,#00C060 100%)"), textAlign: "center" }}>
        <div style={container}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(1.6rem,3vw,2.2rem)", color: "#fff", margin: "0 0 14px" }}>
            Ready to stop filing invoices by hand?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 15, margin: "0 0 26px" }}>
            Set up in about 5 minutes. Test everything free in Demo mode before you go live.
          </p>
          <Link href="/register" style={{ ...btnPrimary, background: "#fff", color: cbt.primaryDark }}>Get started free →</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#fff", padding: "32px 0", borderTop: `1px solid ${cbt.border}` }}>
        <div style={{ ...container, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/cbt-logo-primary.png" alt={ORG_NAME} style={{ height: 20, width: 55 }} />
          </div>
          <div style={{ display: "flex", gap: 18, fontSize: 13 }}>
            <Link href="/login" style={{ color: cbt.textMuted, textDecoration: "none" }}>Sign in</Link>
            <Link href="/register" style={{ color: cbt.textMuted, textDecoration: "none" }}>Get started</Link>
          </div>
          <p style={{ fontSize: 12, color: cbt.textFaint, margin: 0 }}>© {new Date().getFullYear()} {ORG_NAME}</p>
        </div>
      </footer>
    </div>
  );
}
