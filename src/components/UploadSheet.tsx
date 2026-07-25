"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { resizeImage } from "@/lib/resizeImage";

export default function UploadSheet({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [medium, setMedium] = useState("");
  const [size, setSize] = useState("");
  const [year, setYear] = useState("");
  const [statement, setStatement] = useState("");
  const [price, setPrice] = useState("");
  const [forSale, setForSale] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function reset() {
    setFile(null);
    setPreviewUrl(null);
    setTitle("");
    setMedium("");
    setSize("");
    setYear("");
    setStatement("");
    setPrice("");
    setForSale(false);
    setIsSelected(false);
    setError(null);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim()) return;
    setSaving(true);
    setError(null);

    try {
      const { blob, width, height } = await resizeImage(file);
      const supabase = createClient();

      const path = `${userId}/${crypto.randomUUID()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("artworks")
        .upload(path, blob, { contentType: "image/jpeg" });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("artworks").getPublicUrl(path);

      const { error: insertError } = await supabase.from("artworks").insert({
        user_id: userId,
        title: title.trim(),
        medium: medium.trim() || null,
        size: size.trim() || null,
        year: year.trim() || null,
        statement: statement.trim() || null,
        price: price.trim() || null,
        for_sale: forSale,
        is_selected: isSelected,
        image_url: publicUrl,
        image_width: width,
        image_height: height,
      });
      if (insertError) throw insertError;

      reset();
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Upload artwork"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-accent text-bg text-2xl leading-none flex items-center justify-center shadow-lg hover:opacity-90"
      >
        +
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-bg/95 overflow-y-auto">
          <div className="min-h-full flex flex-col items-center px-4 py-8">
            <button
              onClick={() => {
                setOpen(false);
                reset();
              }}
              className="fixed top-4 right-4 text-text-dim hover:text-text font-utility text-sm"
            >
              cancel
            </button>

            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md flex flex-col gap-4 mt-8"
            >
              <h2 className="font-display text-xl font-semibold">
                New artwork
              </h2>

              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full max-h-[40vh] object-contain bg-surface"
                  onClick={() => fileInputRef.current?.click()}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border border-dashed border-border text-text-dim text-sm"
                >
                  Choose image
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-surface border border-border px-3 py-2 text-text placeholder:text-text-dim font-utility text-sm"
              />
              <input
                type="text"
                placeholder="Medium"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                className="bg-surface border border-border px-3 py-2 text-text placeholder:text-text-dim font-utility text-sm"
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="flex-1 bg-surface border border-border px-3 py-2 text-text placeholder:text-text-dim font-utility text-sm"
                />
                <input
                  type="text"
                  placeholder="Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-24 bg-surface border border-border px-3 py-2 text-text placeholder:text-text-dim font-utility text-sm"
                />
              </div>
              <textarea
                placeholder="Statement"
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                rows={3}
                className="bg-surface border border-border px-3 py-2 text-text placeholder:text-text-dim font-utility text-sm resize-none"
              />
              <input
                type="text"
                placeholder="Price (e.g. 600 USD)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-surface border border-border px-3 py-2 text-text placeholder:text-text-dim font-utility text-sm"
              />
              <label className="flex items-center gap-2 text-text-dim font-utility text-sm">
                <input
                  type="checkbox"
                  checked={forSale}
                  onChange={(e) => setForSale(e.target.checked)}
                />
                For sale
              </label>
              <label className="flex items-center gap-2 text-text-dim font-utility text-sm">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => setIsSelected(e.target.checked)}
                />
                Selected
              </label>

              {error && <p className="text-accent-3 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={saving || !file || !title.trim()}
                className="bg-accent text-bg font-utility uppercase text-sm tracking-wide py-3 disabled:opacity-50"
              >
                {saving ? "Publishing…" : "Publish"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
