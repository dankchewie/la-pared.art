import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ArtistHeader from "@/components/ArtistHeader";
import ArtworkGrid from "@/components/ArtworkGrid";
import type { ContactLink } from "@/lib/database.types";

export default async function ArtistWallPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: artist } = await supabase
    .from("artists")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!artist) {
    notFound();
  }

  const { data: artworks } = await supabase
    .from("artworks")
    .select("*")
    .eq("user_id", artist.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex-1 flex flex-col pb-8">
      <ArtistHeader
        slug={artist.slug}
        displayName={artist.display_name}
        artistId={artist.id}
        location={artist.location}
        bio={artist.bio}
        bioImageUrl={artist.bio_image_url}
        instagramUrl={artist.instagram_url}
        links={(artist.links as ContactLink[] | null) ?? []}
      />

      <ArtworkGrid
        slug={artist.slug}
        artistName={artist.display_name}
        artworks={artworks ?? []}
      />
    </div>
  );
}
