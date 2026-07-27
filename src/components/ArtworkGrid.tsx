import Link from "next/link";
import type { Tables } from "@/lib/database.types";

type Artwork = Tables<"artworks">;

export default function ArtworkGrid({
  slug,
  artworks,
}: {
  slug: string;
  artworks: Artwork[];
}) {
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
        <h2 className="font-medium text-xl text-text">Archivo de obras</h2>
      </div>

      {artworks.length === 0 ? (
        <p className="text-text-dim text-sm py-16 text-center w-full">
          Todavía no hay nada aquí.
        </p>
      ) : (
        <div className="masonry w-full px-3">
          {artworks.map((artwork) => (
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
