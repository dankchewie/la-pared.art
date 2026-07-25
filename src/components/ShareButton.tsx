"use client";

import { useState } from "react";
import { ShareIcon } from "@/components/icons";

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled the share sheet
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleShare}
      aria-label="Share this artwork"
      className="size-6 text-text"
    >
      <ShareIcon className="size-6" />
      {copied && (
        <span className="sr-only" role="status">
          Link copied
        </span>
      )}
    </button>
  );
}
