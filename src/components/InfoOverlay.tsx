"use client";

export default function InfoOverlay({
  bio,
  bioImageUrl,
  onClose,
}: {
  bio: string | null;
  bioImageUrl: string | null;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-bg/95 overflow-y-auto" onClick={onClose}>
      <div
        className="min-h-full flex flex-col items-center px-4 py-8 sm:py-16"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="fixed top-4 right-4 text-text-dim hover:text-text font-utility text-sm z-10"
        >
          close
        </button>

        <div className="w-full max-w-md flex flex-col gap-6">
          {bioImageUrl && (
            <img
              src={bioImageUrl}
              alt="Artist"
              className="w-full max-h-[50vh] object-contain bg-surface"
            />
          )}
          {bio && (
            <p className="text-text-dim text-sm leading-relaxed whitespace-pre-line">
              {bio}
            </p>
          )}
          {!bio && !bioImageUrl && (
            <p className="text-text-dim text-sm text-center">
              Nothing here yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
