import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ReadMore from "@/components/ReadMore";
import ShareButton from "@/components/ShareButton";
import { ChevronLeftIcon } from "@/components/icons";

export default async function ArtworkPage({
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

  const details = [
    artwork.medium && { label: "Medium", value: artwork.medium },
    artwork.size && { label: "Size", value: artwork.size },
    artwork.year && { label: "Year", value: artwork.year },
  ].filter((row): row is { label: string; value: string } => Boolean(row));

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2">
        <Link href={`/${slug}`} aria-label="Back to wall" className="text-text">
          <ChevronLeftIcon className="size-6" />
        </Link>
        <ShareButton title={artwork.title} />
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={artwork.image_url}
        alt={artwork.title}
        className="w-full h-auto block bg-surface"
      />

      <div className="flex flex-col gap-3 items-start p-4">
        <div className="flex flex-col w-full">
          <h1 className="font-display text-4xl leading-tight text-text">
            {artwork.title}
          </h1>
          {artwork.for_sale && (
            <div className="flex gap-2 items-center">
              <p className="font-medium text-xl text-success">
                Available for sale
              </p>
              <p className="text-text-secondary">
                {artwork.price || "Inquire for price"}
              </p>
            </div>
          )}
        </div>

        {artwork.statement && (
          <div className="border border-border rounded px-4 py-5 w-full">
            <h2 className="font-medium text-xl text-text mb-2">About the work</h2>
            <ReadMore text={artwork.statement} />
          </div>
        )}

        {details.length > 0 && (
          <div className="flex flex-col text-sm w-full">
            {details.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between border-b border-border py-3"
              >
                <p className="flex-1 text-text-dim">{row.label}</p>
                <p className="flex-1 text-text-secondary text-right">
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        )}

        <Link
          href={`/${slug}/${artwork.id}/inquire`}
          className="w-full flex items-center justify-center rounded-full bg-text px-4 py-3 text-white font-semibold"
        >
          Inquire
        </Link>
      </div>
    </div>
  );
}
