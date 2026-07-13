"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    document.cookie = "remember-me=; path=/; max-age=0";
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-text-dim hover:text-text font-utility text-xs uppercase tracking-wide"
    >
      sign out
    </button>
  );
}
