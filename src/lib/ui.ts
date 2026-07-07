/**
 * Shared CBT-branded UI style kit. Single source of truth for the inline style
 * objects that were previously copy-pasted into every page. Import these instead
 * of re-declaring `card`/`btn`/`label`/… per file.
 */
import type { CSSProperties } from "react";

/**
 * CBT brand tokens — exact values from cbt-brand-kit/tokens/tokens.css (the
 * canonical, portable source of truth). Keep these in sync with that file if
 * the brand kit is ever updated.
 */
export const cbt = {
  primary: "#00994D",
  primaryDark: "#007A3D",
  primaryLight: "#00C060",
  primaryMuted: "#E6F5ED",
  surface: "#F7F8F7",
  border: "#E2E8E4",
  textHeading: "#0C1A10", // "Ink"
  textBody: "#374151",    // "Graphite"
  textMuted: "#6B7280",   // "Steel"
  textFaint: "#8a97a6",
  success: "#1f9d57",
  successBg: "#e9f8ef",
  successBorder: "#b6e4c6",
  warn: "#b9770e",
  warnBg: "#fff6e0",
  warnBorder: "#f0d48a",
  error: "#EF4444",
  errorBg: "#fdeee9",
  errorBorder: "#f0c0b3",
} as const;

/** Green-tinted elevation — a deliberate CBT signature (see brand kit §03). */
export const shadow = {
  soft: "0 1px 4px rgba(0,0,0,0.06)",
  premium: "0 12px 40px rgba(0,153,77,0.09)",
  deep: "0 12px 40px rgba(0,153,77,0.12)",
} as const;

export const pageTitle: CSSProperties = { fontFamily: "var(--font-heading)", color: cbt.primaryDark, fontSize: 22, margin: 0 };
export const pageSubtitle: CSSProperties = { color: cbt.textMuted, fontSize: 13, marginTop: 4 };

/** An accent word within a heading — italic serif + primary green (brand kit's ".italic-accent"). */
export const accentText: CSSProperties = { fontFamily: "var(--font-heading)", fontStyle: "italic", color: cbt.primary };
/** Small eyebrow label above a heading (brand kit's ".eyebrow" / ".section-tag"). */
export const eyebrow: CSSProperties = { display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: cbt.primary, marginBottom: 4 };

// Card sizing follows the brand kit's "compact card" variant (20px padding, 11px
// radius) rather than the marketing-site default (28px/12px) — this is a dense
// operational tool with many cards per screen, not an editorial marketing page.
export const card: CSSProperties = { background: "#fff", border: `1px solid ${cbt.border}`, borderRadius: 11, padding: "20px", marginBottom: 14, boxShadow: shadow.soft };
export const label: CSSProperties = { display: "block", fontSize: 12, color: cbt.textBody, margin: "12px 0 4px", fontWeight: 600 };
export const input: CSSProperties = { width: "100%", padding: "9px 11px", border: "1px solid #cfd8e3", borderRadius: 6, fontSize: 13, boxSizing: "border-box" };
export const hint: CSSProperties = { fontSize: 11.5, color: cbt.textFaint, margin: "0 0 4px" };

export const btn: CSSProperties = { background: cbt.primary, color: "#fff", border: "none", padding: "10px 22px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "none", display: "inline-block" };
export const ghostBtn: CSSProperties = { ...btn, background: "transparent", color: cbt.primary, border: `2px solid ${cbt.primary}`, padding: "8px 20px" };
export const grayBtn: CSSProperties = { ...btn, background: "#eef2f6", color: "#445" };

export const copybox: CSSProperties = { background: "#0d1f15", color: "#cfe3f5", padding: "9px 12px", borderRadius: 7, fontFamily: "var(--font-mono), Consolas, monospace", fontSize: 12, wordBreak: "break-all", margin: "6px 0" };
export const codeBox: CSSProperties = { background: "#0d1f15", color: "#a8e6c0", padding: "12px 14px", borderRadius: 8, fontFamily: "var(--font-mono), Consolas, monospace", fontSize: 11.5, whiteSpace: "pre", overflowX: "auto", margin: "6px 0", lineHeight: 1.5 };

/**
 * Message banner — styled as the brand kit's pull-quote/callout pattern: tinted
 * background, 3px accent left-border, rounded on three corners only (square on
 * the accented edge) — rather than a plain all-around-bordered box.
 */
export const banner = (bg: string, accentColor: string, fg: string): CSSProperties => ({
  background: bg,
  borderLeft: `3px solid ${accentColor}`,
  borderRadius: "0 8px 8px 0",
  color: fg,
  padding: "12px 16px",
  fontSize: 13,
  marginBottom: 14,
});
export const successBanner = banner(cbt.successBg, cbt.successBorder, "#166534");
export const errorBanner = banner(cbt.errorBg, cbt.error, cbt.error);
export const warnBanner = banner(cbt.warnBg, "#F59E0B", "#8a5a00");

/** Editorial pull-quote / callout (brand kit's ".editorial-quote" / ".cbt-quote"). */
export const editorialQuote: CSSProperties = { background: cbt.primaryMuted, borderLeft: `3px solid ${cbt.primary}`, borderRadius: "0 12px 12px 0", padding: 22 };

/** Status pill — uppercase, tracked-out text per the brand kit's ".status-badge" spec. */
export function statusPill(status: string): CSSProperties {
  const s = (status || "").toLowerCase();
  const map: Record<string, [string, string]> = {
    open: ["#fff3df", cbt.warn],
    in_progress: [cbt.primaryMuted, cbt.primary],
    resolved: ["#e6f6ec", cbt.success],
    cleared: ["#e6f6ec", cbt.success],
    reported: [cbt.primaryMuted, cbt.primary],
    rejected: [cbt.errorBg, cbt.error],
    failed: [cbt.errorBg, cbt.error],
  };
  const [bg, fg] = map[s] || ["#eef2f6", "#67788a"];
  return { background: bg, color: fg, fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", padding: "3px 9px", borderRadius: 999, textTransform: "uppercase" };
}
