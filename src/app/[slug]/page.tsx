import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Wall from "@/components/Wall";

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
    <div className="flex-1 flex flex-col pb-16">
      <header className="px-4 py-6 text-center">
        <h1 className="font-display text-2xl font-semibold">
          {artist.display_name}
        </h1>
        {artist.location && (
          <p className="text-text-dim text-xs font-utility uppercase tracking-wide mt-1">
            {artist.location}
          </p>
        )}
      </header>

      <Wall artworks={artworks ?? []} editable={false} />
    </div>
  );
}
