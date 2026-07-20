"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { resizeImage } from "@/lib/resizeImage";
import type { ContactLink, Tables } from "@/lib/database.types";

export default function ProfileEditor({
  artist,
}: {
  artist: Tables<"artists">;
}) {
  const [bio, setBio] = useState(artist.bio ?? "");
  const [instagramUrl, setInstagramUrl] = useState(artist.instagram_url ?? "");
  const [links, setLinks] = useState<ContactLink[]>(
    (artist.links as ContactLink[] | null) ?? []
  );
  const [bioImageFile, setBioImageFile] = useState<File | null>(null);
  const [bioImagePreview, setBioImagePreview] = useState<string | null>(
    artist.bio_image_url
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBioImageFile(file);
    setBioImagePreview(URL.createObjectURL(file));
  }

  function updateLink(index: number, field: keyof ContactLink, value: string) {
    setLinks((prev) =>
      prev.map((link, i) => (i === index ? { ...link, [field]: value } : link))
    );
  }

  function addLink() {
    setLinks((prev) => [...prev, { label: "", url: "" }]);
  }

  function removeLink(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const supabase = createClient();
      let bioImageUrl = artist.bio_image_url;

      if (bioImageFile) {
        const { blob } = await resizeImage(bioImageFile);
        const path = `${artist.id}/profile/${crypto.randomUUID()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("artworks")
          .upload(path, blob, { contentType: "image/jpeg" });
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("artworks").getPublicUrl(path);
        bioImageUrl = publicUrl;
      }

      const cleanLinks = links.filter((l) => l.label.trim() && l.url.trim());

      const { error: updateError } = await supabase
        .from("artists")
        .update({
          bio: bio.trim() || null,
          instagram_url: instagramUrl.trim() || null,
          bio_image_url: bioImageUrl,
          links: cleanLinks,
        })
        .eq("id", artist.id);

      if (updateError) throw updateError;

      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="font-utility text-xs uppercase tracking-wide text-text-dim">
          Bio picture
        </label>
        {bioImagePreview ? (
          <img
            src={bioImagePreview}
            alt="Bio"
            onClick={() => document.getElementById("bio-image-input")?.click()}
            className="w-full max-h-64 object-contain bg-surface cursor-pointer"
          />
        ) : (
          <button
            type="button"
            onClick={() => document.getElementById("bio-image-input")?.click()}
            className="w-full h-40 border border-dashed border-border text-text-dim text-sm"
          >
            Choose image
          </button>
        )}
        <input
          id="bio-image-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-utility text-xs uppercase tracking-wide text-text-dim">
          Information text
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={5}
          className="bg-surface border border-border px-3 py-2 text-text placeholder:text-text-dim font-utility text-sm resize-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-utility text-xs uppercase tracking-wide text-text-dim">
          Instagram URL
        </label>
        <input
          type="url"
          placeholder="https://instagram.com/yourname"
          value={instagramUrl}
          onChange={(e) => setInstagramUrl(e.target.value)}
          className="bg-surface border border-border px-3 py-2 text-text placeholder:text-text-dim font-utility text-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-utility text-xs uppercase tracking-wide text-text-dim">
          Other contacts
        </label>
        {links.map((link, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              placeholder="Label"
              value={link.label}
              onChange={(e) => updateLink(i, "label", e.target.value)}
              className="w-1/3 bg-surface border border-border px-3 py-2 text-text placeholder:text-text-dim font-utility text-sm"
            />
            <input
              type="url"
              placeholder="URL"
              value={link.url}
              onChange={(e) => updateLink(i, "url", e.target.value)}
              className="flex-1 bg-surface border border-border px-3 py-2 text-text placeholder:text-text-dim font-utility text-sm"
            />
            <button
              type="button"
              onClick={() => removeLink(i)}
              className="text-text-dim hover:text-accent-3 text-xs font-utility"
            >
              remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addLink}
          className="text-xs font-utility uppercase tracking-wide text-text-dim hover:text-text text-left"
        >
          + add contact
        </button>
      </div>

      {error && <p className="text-accent-3 text-sm">{error}</p>}
      {saved && <p className="text-accent text-sm">Saved.</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-accent text-bg font-utility uppercase text-sm tracking-wide py-3 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}
