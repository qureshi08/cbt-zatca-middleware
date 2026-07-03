import { getActiveOrg } from "@/lib/org";
import { getCurrentUser } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase";
import { orgEmails } from "@/lib/notify";
import { inviteTeamMember, revokeInvite } from "@/lib/actions";
import { cbt, card, label, input, btn, pageTitle, pageSubtitle, successBanner, errorBanner, statusPill } from "@/lib/ui";

export default async function TeamPage({ searchParams }: { searchParams: Promise<{ sent?: string; err?: string }> }) {
  const sp = await searchParams;
  const org = await getActiveOrg();
  const me = await getCurrentUser();
  if (!org) return <div style={{ padding: 32 }}>Not authenticated.</div>;

  const members = await orgEmails(org.id);

  let invites: { id: string; email: string; status: string; created_at: string }[] = [];
  let tableMissing = false;
  try {
    const { data, error } = await supabaseAdmin
      .from("invitations")
      .select("id, email, status, created_at")
      .eq("organization_id", org.id)
      .neq("status", "revoked")
      .order("created_at", { ascending: false });
    if (error) tableMissing = true;
    else invites = (data ?? []) as typeof invites;
  } catch { tableMissing = true; }
  const pending = invites.filter((i) => i.status === "pending");

  return (
    <div style={{ padding: "28px 32px", maxWidth: 760 }}>
      <h1 style={pageTitle}>Team</h1>
      <p style={pageSubtitle}>Everyone who can access <b>{org.name}</b>. Invite colleagues by email — they sign up and join automatically.</p>

      {sp.sent && <div style={successBanner}>✅ Invitation sent.</div>}
      {sp.err && <div style={errorBanner}>❌ {sp.err}</div>}

      <div style={card}>
        <h3 style={{ margin: "0 0 6px" }}>Invite a colleague</h3>
        <form action={inviteTeamMember} style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <label style={label}>Their work email</label>
            <input style={input} name="email" type="email" placeholder="colleague@company.com" required />
          </div>
          <button type="submit" style={btn}>Send invite →</button>
        </form>
        {tableMissing && <p style={{ ...pageSubtitle, color: cbt.warn, marginTop: 8 }}>Team isn&apos;t initialized yet — run <code>supabase_team_and_notify.sql</code> in Supabase.</p>}
      </div>

      <div style={{ ...card, padding: 0 }}>
        <h3 style={{ margin: 0, padding: "16px 20px", borderBottom: `1px solid ${cbt.border}`, fontSize: 15 }}>Members ({members.length})</h3>
        {members.map((email) => (
          <div key={email} style={{ padding: "12px 20px", borderTop: `1px solid #f3f6f9`, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13.5 }}>{email}</span>
            {email === me?.email && <span style={statusPill("in_progress")}>you</span>}
          </div>
        ))}
      </div>

      {pending.length > 0 && (
        <div style={{ ...card, padding: 0 }}>
          <h3 style={{ margin: 0, padding: "16px 20px", borderBottom: `1px solid ${cbt.border}`, fontSize: 15 }}>Pending invitations ({pending.length})</h3>
          {pending.map((i) => (
            <div key={i.id} style={{ padding: "12px 20px", borderTop: `1px solid #f3f6f9`, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13.5 }}>{i.email}</span>
              <span style={statusPill("open")}>pending</span>
              <span style={{ marginLeft: "auto" }}>
                <form action={revokeInvite}>
                  <input type="hidden" name="id" value={i.id} />
                  <button type="submit" style={{ background: "#fff", color: cbt.error, border: `1px solid #e3b4ab`, padding: "5px 12px", borderRadius: 7, fontSize: 12, cursor: "pointer" }}>Revoke</button>
                </form>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
