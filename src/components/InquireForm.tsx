"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { InfoIcon } from "@/components/icons";

export default function InquireForm({
  artistId,
  artworkId,
}: {
  artistId: string;
  artworkId: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
      artwork_id: artworkId,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
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

  if (sent) {
    return (
      <p className="text-text text-sm text-center py-12 w-full">
        Enviado. El artista se pondrá en contacto contigo.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2 w-full">
        <label className="font-semibold text-text">Nombre completo</label>
        <input
          type="text"
          placeholder="Nombre y apellido"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-dim text-sm"
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <label className="font-semibold text-text">Correo electrónico</label>
        <input
          type="email"
          placeholder="nombre@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-dim text-sm"
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <label className="font-semibold text-text">Número de teléfono (opcional)</label>
        <input
          type="tel"
          placeholder="+502 0000 0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-dim text-sm"
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <label className="font-semibold text-text">Mensaje adicional</label>
        <textarea
          placeholder="Me interesa esta obra y me gustaría más información..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={3}
          className="bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-dim text-sm resize-none"
        />
      </div>

      <div className="flex gap-2 items-start">
        <InfoIcon className="size-4 text-text-dim shrink-0 mt-0.5" />
        <p className="text-text-dim text-sm">
          Tu consulta se enviará de forma segura directamente al artista.
        </p>
      </div>

      {error && <p className="text-accent text-sm">{error}</p>}

      <button
        type="submit"
        disabled={sending}
        className="w-full rounded-full bg-text px-4 py-3 text-white font-semibold disabled:opacity-50"
      >
        {sending ? "Enviando…" : "Enviar consulta"}
      </button>
    </form>
  );
}
