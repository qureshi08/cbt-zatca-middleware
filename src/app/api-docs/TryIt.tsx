"use client";

import { useState } from "react";
import { cbt, btn, hint } from "@/lib/ui";

const codeArea: React.CSSProperties = { width: "100%", minHeight: 220, fontFamily: "var(--font-mono),Consolas,monospace", fontSize: 12, lineHeight: 1.5, padding: 12, border: `1px solid ${cbt.border}`, borderRadius: 8, background: "#0d1f15", color: "#a8e6c0", boxSizing: "border-box", resize: "vertical" };
const tab = (active: boolean): React.CSSProperties => ({ padding: "6px 12px", borderRadius: 7, fontSize: 12.5, cursor: "pointer", border: `1px solid ${active ? cbt.primary : cbt.border}`, background: active ? cbt.primaryMuted : "#fff", color: active ? cbt.primaryDark : cbt.textMuted, fontWeight: active ? 700 : 500 });

type Customer = "b2b" | "b2c";
type Doc = "388" | "381" | "383";

const B2B_BUYER = {
  partyIdentification: { id: "310175397400003", schemeID: "TXID" },
  postalAddress: { streetName: "King Fahd Road", buildingNumber: "1000", citySubdivisionName: "Al Olaya", cityName: "Riyadh", postalZone: "11564", country: "SA" },
  partyTaxScheme: { companyID: "310175397400003" },
  partyLegalEntity: { registrationName: "Al-Faisal Trading Co." },
};

/** Build a sample payload for any cell of the 2×3 document matrix. */
function sample(customer: Customer, doc: Doc): Record<string, unknown> {
  const type = customer === "b2b" ? "standard" : "simplified";
  const tag = customer.toUpperCase();
  const body: Record<string, unknown> = {
    type,
    documentType: doc,
    invoiceId: `API-${tag}-${doc}-001`,
    ...(customer === "b2b" ? { buyer: B2B_BUYER } : {}), // B2C (simplified) needs no buyer
    items: [{ name: "Consulting services", quantity: 1, unitPrice: 1000, vatCategory: "S", vatRate: 15 }],
  };
  if (doc !== "388") {
    body.originalInvoiceId = `API-${tag}-388-001`;
    body.creditReason = doc === "381" ? "Return of goods" : "Additional charges";
  }
  return body;
}

const DOC_LABEL: Record<Doc, string> = { "388": "Invoice", "381": "Credit note", "383": "Debit note" };

export default function TryIt() {
  const [customer, setCustomer] = useState<Customer>("b2c");
  const [doc, setDoc] = useState<Doc>("388");
  const [payload, setPayload] = useState(JSON.stringify(sample("b2c", "388"), null, 2));
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<{ status: number; body: any } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const regen = (c: Customer, d: Doc) => { setCustomer(c); setDoc(d); setPayload(JSON.stringify(sample(c, d), null, 2)); setResp(null); setErr(null); };

  const send = async () => {
    setErr(null); setResp(null);
    let parsed: unknown;
    try { parsed = JSON.parse(payload); } catch { setErr("Payload isn't valid JSON — fix it and try again."); return; }
    setLoading(true);
    try {
      const r = await fetch("/api/playground", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed) });
      setResp({ status: r.status, body: await r.json() });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const ok = resp && resp.status >= 200 && resp.status < 300;
  const qr: string | undefined = resp?.body?.qrCode;

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ ...hint, margin: 0, minWidth: 70 }}>Customer:</span>
        <span onClick={() => regen("b2b", doc)} style={tab(customer === "b2b")}>B2B (standard → clearance)</span>
        <span onClick={() => regen("b2c", doc)} style={tab(customer === "b2c")}>B2C (simplified → reporting)</span>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ ...hint, margin: 0, minWidth: 70 }}>Document:</span>
        {(["388", "381", "383"] as Doc[]).map((d) => (
          <span key={d} onClick={() => regen(customer, d)} style={tab(doc === d)}>{DOC_LABEL[d]} ({d})</span>
        ))}
      </div>
      <textarea style={codeArea} value={payload} onChange={(e) => setPayload(e.target.value)} spellCheck={false} />
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10, flexWrap: "wrap" }}>
        <button onClick={send} disabled={loading} style={{ ...btn, opacity: loading ? 0.6 : 1 }}>{loading ? "Sending…" : "▶ Send test request"}</button>
        <span style={hint}>Runs the real pipeline for your business. Doesn&apos;t save to your invoices.</span>
      </div>

      {err && <div style={{ marginTop: 12, background: cbt.errorBg, border: `1px solid ${cbt.errorBorder}`, color: cbt.error, fontSize: 12.5, padding: "9px 11px", borderRadius: 8 }}>{err}</div>}

      {resp && (
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 13 }}>Response</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: ok ? cbt.successBg : cbt.errorBg, color: ok ? cbt.success : cbt.error }}>
              HTTP {resp.status} · {ok ? (resp.body?.zatcaStatus || "OK") : "Error"}
            </span>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-start" }}>
            <pre style={{ ...codeArea, minHeight: 0, flex: 1, minWidth: 320, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{JSON.stringify(resp.body, null, 2)}</pre>
            {ok && qr && (
              <div style={{ textAlign: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr} alt="ZATCA QR" width={130} height={130} style={{ border: `1px solid ${cbt.border}`, borderRadius: 8, background: "#fff", padding: 6 }} />
                <div style={{ ...hint, marginTop: 4 }}>ZATCA QR</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
