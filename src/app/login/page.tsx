"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async () => {
    setLoading(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f7fb" }}>
      <div style={{ width: 380, textAlign: "center", padding: "0 20px" }}>
        <h1 style={{ color: "#155a93", fontSize: 24, marginBottom: 6 }}>ZATCA Compliance Middleware</h1>
        <p style={{ color: "#6b7785", fontSize: 14, marginBottom: 24 }}>
          Become and stay ZATCA-compliant — without leaving the software you already use.
        </p>
        <div style={{ background: "#fff", border: "1px solid #e3e8ef", borderRadius: 12, padding: 28, boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
          <button
            onClick={signIn}
            disabled={loading}
            style={{ width: "100%", padding: "11px 16px", borderRadius: 8, border: "1px solid #cfd8e3", background: "#fff", cursor: loading ? "default" : "pointer", fontSize: 14, fontWeight: 500 }}
          >
            {loading ? "Redirecting…" : "Continue with Google"}
          </button>
          {error && <p style={{ color: "#c0392b", fontSize: 12, marginTop: 12 }}>{error}</p>}
          <p style={{ color: "#6b7785", fontSize: 12, marginTop: 14 }}>
            Signing in creates your account &amp; business profile automatically.
          </p>
        </div>
        <p style={{ color: "#8a97a6", fontSize: 11, marginTop: 18 }}>Free · KSA · Phase-2 e-invoicing</p>
      </div>
    </div>
  );
}
