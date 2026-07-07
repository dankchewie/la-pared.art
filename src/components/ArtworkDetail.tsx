"use client";

import { useState } from "react";
import type { Tables } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/client";

type Artwork = Tables<"artworks">;

export default function ArtworkDetail({
  artwork,
  editable,
  onClose,
  onDeleted,
}: {
  artwork: Artwork;
  editable: boolean;
  onClose: () => void;
  onDeleted?: () => void;
}) {
  const [deleting, setDeleting] = useState(false);

  const metaParts = [artwork.medium, artwork.size, artwork.year].filter(
    Boolean
  );

  async function handleDelete() {
    if (!confirm(`Delete "${artwork.title}"? This can't be undone.`)) return;
    setDeleting(true);

    const supabase = createClient();

    const path = artwork.image_url.split("/artworks/")[1];
    if (path) {
      await supabase.storage.from("artworks").remove([path]);
    }

    const { error } = await supabase
      .from("artworks")
      .delete()
      .eq("id", artwork.id);

    if (error) {
      alert(error.message);
      setDeleting(false);
      return;
    }

    onDeleted?.();
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-bg/95 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="min-h-full flex flex-col items-center px-4 py-8 sm:py-16"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="fixed top-4 right-4 text-text-dim hover:text-text font-utility text-sm z-10"
        >
          close
        </button>

        <img
          src={artwork.image_url}
          alt={artwork.title}
          className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
        />

        <div className="museum-label w-full max-w-md mt-6 bg-surface p-5">
          <h1 className="font-display font-bold text-xl">{artwork.title}</h1>
          {metaParts.length > 0 && (
            <p className="meta mt-1">{metaParts.join(" · ")}</p>
          )}
          <hr className="border-border my-3" />
          {artwork.statement && (
            <p className="text-text-dim text-sm leading-relaxed">
              {artwork.statement}
            </p>
          )}

          {editable && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="mt-5 text-xs font-utility uppercase tracking-wide text-accent-3 hover:opacity-80 disabled:opacity-50"
            >
              {deleting ? "deleting…" : "delete"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
