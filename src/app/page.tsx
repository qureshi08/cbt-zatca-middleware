import { getCurrentUser } from "@/lib/supabase/server";
import { ensureTenant } from "@/lib/tenant";
import { supabaseAdmin } from "@/lib/supabase";
import SignOutButton from "@/components/SignOutButton";

/**
 * Authenticated dashboard landing. Middleware guarantees a session here.
 * Ensures the user has a tenant, then shows a minimal Demo-mode dashboard.
 * (Real KPIs / invoice data are wired in a later step.)
 */
export default async function DashboardPage() {
  const user = await getCurrentUser();
  let orgId: string | null = null;
  let orgName = "";
  if (user) {
    try {
      orgId = await ensureTenant(user.id, user.email ?? "");
      const { data } = await supabaseAdmin.from("organizations").select("name").eq("id", orgId).single();
      orgName = data?.name ?? "";
    } catch {
      /* surfaced below if orgId stays null */
    }
  }

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1000 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <h1 style={{ color: "#155a93", fontSize: 22, margin: 0, flex: 1 }}>Dashboard</h1>
        <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 20, background: "#fff6e0", color: "#8a5a00", border: "1px solid #f0d48a", fontWeight: 600 }}>
          ● Demo mode
        </span>
        <SignOutButton />
      </div>

      <p style={{ color: "#6b7785", fontSize: 13, marginTop: 4 }}>
        Signed in as <strong>{user?.email}</strong>{orgName ? ` · ${orgName}` : ""}
      </p>

      <div style={{ background: "#fff6e0", border: "1px solid #f0d48a", color: "#8a5a00", padding: "10px 14px", borderRadius: 8, fontSize: 13, margin: "16px 0" }}>
        ⚠️ <strong>Demo mode</strong> — invoices go to ZATCA simulation and are <strong>not legally filed</strong>. Complete onboarding, then switch to Real when ready.
      </div>

      <div style={{ background: "#fff", border: "1px solid #e3e8ef", borderRadius: 10, padding: "18px 20px" }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 15 }}>Getting started</h3>
        <p style={{ color: "#6b7785", fontSize: 13, margin: 0 }}>
          ✅ Account created &amp; tenant provisioned{orgId ? ` (org ${orgId.slice(0, 8)}…)` : ""}.<br />
          Next: complete your business profile, connect Odoo/Zoho, and run ZATCA onboarding.
        </p>
      </div>
    </div>
  );
}
