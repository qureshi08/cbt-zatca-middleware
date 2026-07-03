import { supabaseAdmin } from "@/lib/supabase";

/**
 * Email + notification helpers.
 *
 * Sending uses Resend (https://resend.com). If RESEND_API_KEY isn't set the
 * send is a safe no-op (logged) so the app works without email configured —
 * set RESEND_API_KEY (and optionally EMAIL_FROM) in the environment to enable.
 */
export async function sendEmail(to: string | string[], subject: string, html: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const recipients = (Array.isArray(to) ? to : [to]).filter(Boolean);
  if (!recipients.length) return;
  if (!key) {
    console.log(`[email] RESEND_API_KEY not set — would email ${recipients.join(", ")}: "${subject}"`);
    return;
  }
  const from = process.env.EMAIL_FROM || "ZATCA Middleware <onboarding@resend.dev>";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: recipients, subject, html }),
    });
    if (!res.ok) console.warn("[email] send failed:", await res.text());
  } catch (e: any) {
    console.warn("[email] send error:", e.message);
  }
}

/** All member email addresses for a tenant (its logged-in users). */
async function orgEmails(orgId: string): Promise<string[]> {
  const { data: members } = await supabaseAdmin.from("tenant_members").select("user_id").eq("organization_id", orgId);
  const emails: string[] = [];
  for (const m of members ?? []) {
    try {
      const { data } = await supabaseAdmin.auth.admin.getUserById(m.user_id as string);
      if (data?.user?.email) emails.push(data.user.email);
    } catch { /* skip */ }
  }
  return emails;
}

/**
 * Notify a tenant that an invoice failed to clear with ZATCA. Fire-and-forget —
 * never throws into the caller's response path.
 */
export async function notifyInvoiceFailure(orgId: string, invoiceNumber: string, error?: string): Promise<void> {
  try {
    const emails = await orgEmails(orgId);
    if (!emails.length) return;
    const subject = `⚠️ Invoice ${invoiceNumber} was not cleared with ZATCA`;
    const html = `
      <div style="font-family:Arial,sans-serif;color:#374151;max-width:520px">
        <h2 style="color:#c0392b;margin:0 0 8px">Invoice not cleared</h2>
        <p>Invoice <b>${invoiceNumber}</b> could not be cleared with ZATCA and needs your attention.</p>
        <p style="background:#fdeee9;border:1px solid #f0c0b3;color:#c0392b;padding:10px 12px;border-radius:8px;font-size:13px">
          ${(error || "Unknown error").replace(/</g, "&lt;")}
        </p>
        <p>Open your <b>Activity</b> page in the ZATCA Middleware to see the reason and retry.</p>
        <p style="color:#6B7280;font-size:12px">— Convergent Business Technologies · ZATCA Middleware</p>
      </div>`;
    await sendEmail(emails, subject, html);
  } catch (e: any) {
    console.warn("[notify] failure email skipped:", e.message);
  }
}
