"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ContactForm({
  artistId,
  onClose,
}: {
  artistId: string;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.from("messages").insert({
      artist_id: artistId,
      email: email.trim(),
      body: body.trim(),
    });

    if (error) {
      setError(error.message);
      setSending(false);
      return;
    }

    setSent(true);
    setSending(false);
  }

  return (
    <div className="fixed inset-0 z-50 bg-bg/95 overflow-y-auto" onClick={onClose}>
      <div
        className="min-h-full flex flex-col items-center justify-center px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="fixed top-4 right-4 text-text-dim hover:text-text font-utility text-sm"
        >
          close
        </button>

        {sent ? (
          <p className="text-text font-utility text-sm text-center max-w-xs">
            Sent. Thank you.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xs flex flex-col gap-4"
          >
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-surface border border-border px-3 py-2 text-text placeholder:text-text-dim font-utility text-sm"
            />
            <textarea
              placeholder="Text here"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={4}
              className="bg-surface border border-border px-3 py-2 text-text placeholder:text-text-dim font-utility text-sm resize-none"
            />

            {error && <p className="text-accent-3 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={sending}
              className="bg-accent text-bg font-utility uppercase text-sm tracking-wide py-3 disabled:opacity-50"
            >
              {sending ? "Sending…" : "Send"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
