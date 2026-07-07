"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Tables } from "@/lib/database.types";
import MasonryGrid from "@/components/MasonryGrid";
import ArtworkDetail from "@/components/ArtworkDetail";

type Artwork = Tables<"artworks">;

export default function Wall({
  artworks,
  editable,
}: {
  artworks: Artwork[];
  editable: boolean;
}) {
  const [selected, setSelected] = useState<Artwork | null>(null);
  const router = useRouter();

  return (
    <>
      <MasonryGrid artworks={artworks} onSelect={setSelected} />

      {selected && (
        <ArtworkDetail
          artwork={selected}
          editable={editable}
          onClose={() => setSelected(null)}
          onDeleted={() => {
            setSelected(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
