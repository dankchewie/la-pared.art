"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Tables } from "@/lib/database.types";

type Artwork = Tables<"artworks">;
type Filter = "all" | "selected";

export default function ArtworkGrid({
  slug,
  artworks,
}: {
  slug: string;
  artworks: Artwork[];
}) {
  const [filter, setFilter] = useState<Filter>("all");

  const selected = useMemo(() => artworks.filter((a) => a.is_selected), [artworks]);

  const visible = filter === "selected" ? selected : artworks;

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: artworks.length },
    { key: "selected", label: "Selected", count: selected.length },
  ];

  return (
    <>
      <a
        href="https://app.recurrente.com/s/kaiateycrea"
        target="_blank"
        rel="noopener noreferrer"
        className="mx-4 mb-3 flex items-center justify-between rounded-xl bg-accent/10 border border-accent/30 px-4 py-3 text-sm font-semibold text-accent"
      >
        Tienda
        <span aria-hidden="true">&rarr;</span>
      </a>

      <div className="flex items-center px-4 pb-2">
        <h2 className="font-medium text-xl text-text">Artworks</h2>
      </div>

      <div className="flex items-center gap-0 px-4 py-2">
        <div className="flex items-center rounded-full w-full">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 px-5 py-3 rounded-full text-sm whitespace-nowrap ${
                filter === tab.key
                  ? "bg-text text-white font-bold"
                  : "text-text"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="text-text-dim text-sm py-16 text-center w-full">
          Nothing here yet.
        </p>
      ) : (
        <div className="masonry w-full px-3">
          {visible.map((artwork) => (
            <Link
              key={artwork.id}
              href={`/${slug}/${artwork.id}`}
              className="masonry-item block w-full text-left"
            >
              <div className="border-2 border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={artwork.image_url}
                  alt={artwork.title}
                  width={artwork.image_width ?? undefined}
                  height={artwork.image_height ?? undefined}
                  className="w-full h-auto block bg-surface"
                  style={
                    artwork.image_width && artwork.image_height
                      ? {
                          aspectRatio: `${artwork.image_width} / ${artwork.image_height}`,
                        }
                      : undefined
                  }
                  loading="lazy"
                />
              </div>
              <div className="pt-1">
                <p className="text-text-secondary text-base font-medium truncate">
                  {artwork.title}
                </p>
                {(artwork.price || artwork.medium) && (
                  <p className="text-text-secondary text-sm">
                    {artwork.price || artwork.medium}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
