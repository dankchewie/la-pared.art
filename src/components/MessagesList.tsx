"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/database.types";

export default function MessagesList({
  messages,
}: {
  messages: Tables<"messages">[];
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete(id: string) {
    setDeletingId(id);
    const supabase = createClient();
    await supabase.from("messages").delete().eq("id", id);
    router.refresh();
    setDeletingId(null);
  }

  if (messages.length === 0) {
    return (
      <p className="text-text-dim text-sm font-utility text-center py-12">
        No messages yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <div key={message.id} className="bg-surface border border-border p-4">
          <div className="flex items-center justify-between">
            <a
              href={`mailto:${message.email}`}
              className="font-utility text-xs uppercase tracking-wide text-accent hover:opacity-80"
            >
              {message.name ? `${message.name} · ${message.email}` : message.email}
            </a>
            <button
              onClick={() => handleDelete(message.id)}
              disabled={deletingId === message.id}
              className="text-text-dim hover:text-accent-3 text-xs font-utility disabled:opacity-50"
            >
              delete
            </button>
          </div>
          {message.phone && (
            <p className="text-text-dim text-xs font-utility mt-1">
              {message.phone}
            </p>
          )}
          <p className="text-text text-sm mt-2 whitespace-pre-line">
            {message.body}
          </p>
          <p className="text-text-dim text-xs font-utility mt-2">
            {new Date(message.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
