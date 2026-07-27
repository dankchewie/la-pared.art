import Link from "next/link";
import type { Tables } from "@/lib/database.types";
import { BagIcon } from "@/components/icons";

type Artwork = Tables<"artworks">;

export default function ArtworkGrid({
  slug,
  artistName,
  artworks,
}: {
  slug: string;
  artistName: string;
  artworks: Artwork[];
}) {
  return (
    <>
      <div className="px-4 pb-4">
        <div className="relative flex items-center gap-2 rounded-2xl bg-[#fdf4dd] px-4 py-6 overflow-hidden">
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            <div className="flex flex-col gap-2">
              <p className="font-medium text-xl leading-tight text-text">
                El mundo de {artistName} te espera
              </p>
              <p className="text-text text-base">
                Explora obras originales, impresiones y más.
              </p>
            </div>
            <a
              href="https://app.recurrente.com/s/kaiateycrea"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-xl bg-text border border-border px-4 py-3 text-white font-semibold"
            >
              Visita la tienda
            </a>
          </div>
          <BagIcon className="shrink-0 size-20 text-accent-2" />
        </div>
      </div>

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
