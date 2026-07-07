"use client";

import type { Tables } from "@/lib/database.types";

type Artwork = Tables<"artworks">;

export default function MasonryGrid({
  artworks,
  onSelect,
}: {
  artworks: Artwork[];
  onSelect: (artwork: Artwork) => void;
}) {
  if (artworks.length === 0) {
    return (
      <p className="text-text-dim text-sm py-16 text-center">
        Nothing on the wall yet.
      </p>
    );
  }

  return (
    <div className="masonry px-3">
      {artworks.map((artwork) => (
        <button
          key={artwork.id}
          onClick={() => onSelect(artwork)}
          className="masonry-item block w-full text-left cursor-pointer"
        >
          <img
            src={artwork.image_url}
            alt={artwork.title}
            width={artwork.image_width ?? undefined}
            height={artwork.image_height ?? undefined}
            className="w-full h-auto block bg-surface"
            style={
              artwork.image_width && artwork.image_height
                ? { aspectRatio: `${artwork.image_width} / ${artwork.image_height}` }
                : undefined
            }
            loading="lazy"
          />
        </button>
      ))}
    </div>
  );
}
