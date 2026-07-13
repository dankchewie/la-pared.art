"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const REMEMBER_ME_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function setRememberMeCookie(remember: boolean) {
  const parts = ["remember-me=1", "path=/", "SameSite=Lax"];
  if (remember) {
    parts.push(`max-age=${REMEMBER_ME_MAX_AGE}`);
  }
  if (window.location.protocol === "https:") {
    parts.push("Secure");
  }
  document.cookie = parts.join("; ");
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setRememberMeCookie(rememberMe);

    router.push("/dashboard");
    router.refresh();
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError("Enter your email above first");
      return;
    }
    setError(null);
    setInfo(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setInfo("Check your email for a reset link.");
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs flex flex-col gap-4"
      >
        <h1 className="font-display text-2xl font-semibold text-center mb-2">
          La Pared
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="bg-surface border border-border px-3 py-2 text-text placeholder:text-text-dim font-utility text-sm"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="bg-surface border border-border px-3 py-2 text-text placeholder:text-text-dim font-utility text-sm"
        />

        <label className="flex items-center gap-2 text-text-dim font-utility text-xs uppercase tracking-wide">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="accent-accent"
          />
          Remember me for 30 days
        </label>

        {error && <p className="text-accent-3 text-sm">{error}</p>}
        {info && <p className="text-accent text-sm">{info}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-accent text-bg font-utility uppercase text-sm tracking-wide py-3 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-text-dim hover:text-text font-utility text-xs uppercase tracking-wide text-center"
        >
          Forgot password?
        </button>
      </form>
    </div>
  );
}
