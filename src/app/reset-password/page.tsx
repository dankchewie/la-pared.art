"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (!ready) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <p className="text-text-dim text-sm font-utility max-w-xs">
          Open this page from the password reset link in your email.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs flex flex-col gap-4"
      >
        <h1 className="font-display text-2xl font-semibold text-center mb-2">
          Set a new password
        </h1>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          className="bg-surface border border-border px-3 py-2 text-text placeholder:text-text-dim font-utility text-sm"
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          autoComplete="new-password"
          className="bg-surface border border-border px-3 py-2 text-text placeholder:text-text-dim font-utility text-sm"
        />

        {error && <p className="text-accent-3 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-accent text-bg font-utility uppercase text-sm tracking-wide py-3 disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save password"}
        </button>
      </form>
    </div>
  );
}
