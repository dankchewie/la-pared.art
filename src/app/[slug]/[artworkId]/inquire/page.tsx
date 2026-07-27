import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import InquireForm from "@/components/InquireForm";
import { ChevronLeftIcon } from "@/components/icons";

export default async function InquirePage({
  params,
}: {
  params: Promise<{ slug: string; artworkId: string }>;
}) {
  const { slug, artworkId } = await params;
  const supabase = await createClient();

  const { data: artist } = await supabase
    .from("artists")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!artist) {
    notFound();
  }

  const { data: artwork } = await supabase
    .from("artworks")
    .select("*")
    .eq("id", artworkId)
    .eq("user_id", artist.id)
    .maybeSingle();

  if (!artwork) {
    notFound();
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <Link href={`/${slug}/${artwork.id}`} aria-label="Volver" className="text-text">
          <ChevronLeftIcon className="size-6" />
        </Link>
        <p className="font-medium text-xl text-text">Consultar</p>
        <div className="size-6" />
      </div>

      <div className="flex flex-col gap-6 items-start p-6">
        <div className="flex gap-4 items-center bg-surface border border-border rounded-2xl p-4 w-full">
          <div className="relative shrink-0 size-16 rounded-xl overflow-hidden bg-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artwork.image_url}
              alt={artwork.title}
              className="absolute inset-0 size-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <p className="font-display text-3xl leading-tight text-text truncate">
              {artwork.title}
            </p>
            {artwork.price && (
              <p className="font-semibold text-accent">{artwork.price}</p>
            )}
          </div>
        </div>

        <InquireForm artistId={artist.id} artworkId={artwork.id} />
      </div>
    </div>
  );
}
