import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureTenant } from "@/lib/tenant";
import { isPlatformAdmin } from "@/lib/admin";

/**
 * OAuth callback: exchange the auth code for a session, ensure the user has a
 * tenant (create one on first login), then land on the dashboard.
 */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl;
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") || "/dashboard";
  // Only allow internal redirects (no open-redirect).
  const next = nextParam.startsWith("/") ? nextParam : "/dashboard";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      // Support staff aren't a customer tenant — don't create a junk org for them.
      if (!isPlatformAdmin(data.user.email)) {
        try {
          await ensureTenant(data.user.id, data.user.email ?? "");
        } catch (e) {
          console.error("tenant bootstrap failed:", e);
        }
      }
    }
  }
  // For OAuth login `next` defaults to /dashboard, which sends admins on to /admin.
  return NextResponse.redirect(`${origin}${next}`);
}
