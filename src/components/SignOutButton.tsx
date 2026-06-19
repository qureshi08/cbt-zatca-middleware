"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  const signOut = async () => {
    await createSupabaseBrowserClient().auth.signOut();
    router.push("/login");
    router.refresh();
  };
  return (
    <button
      onClick={signOut}
      style={{ padding: "7px 14px", borderRadius: 7, border: "1px solid #cfd8e3", background: "#fff", cursor: "pointer", fontSize: 13 }}
    >
      Sign out
    </button>
  );
}
