"use client";

import { useState } from "react";
import type { ContactLink } from "@/lib/database.types";
import ContactForm from "@/components/ContactForm";
import ReadMore from "@/components/ReadMore";
import { SendIcon, LocationIcon, YoutubeIcon, InstagramIcon } from "@/components/icons";
import { toAbsoluteUrl } from "@/lib/url";

export default function ArtistHeader({
  slug,
  displayName,
  artistId,
  location,
  bio,
  bioImageUrl,
  instagramUrl,
  links,
}: {
  slug: string;
  displayName: string;
  artistId: string;
  location: string | null;
  bio: string | null;
  bioImageUrl: string | null;
  instagramUrl: string | null;
  links: ContactLink[];
}) {
  const [showContact, setShowContact] = useState(false);

  const youtubeLink = links.find((l) => /youtube/i.test(l.label));

  return (
    <>
      <div className="flex items-center gap-2 p-5">
        <div className="relative shrink-0 size-20 rounded-full border-2 border-white shadow-md overflow-hidden bg-surface">
          {bioImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={bioImageUrl}
              alt={displayName}
              className="absolute inset-0 size-full object-cover"
            />
          )}
        </div>
        <div className="flex-1 flex flex-col justify-center p-2">
          <p className="font-medium text-xs tracking-[0.1em] uppercase text-text">
            @{slug}
          </p>
          <p className="font-display text-4xl leading-tight text-text">
            {displayName}
          </p>
          {location && (
            <div className="flex items-center gap-0.5 -ml-1">
              <LocationIcon className="size-6 text-text" />
              <p className="font-semibold text-text">{location}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4">
        <button
          onClick={() => setShowContact(true)}
          className="w-full flex items-center justify-center gap-1 rounded-full bg-text border border-border px-4 py-3 text-white font-semibold"
        >
          <SendIcon className="size-6" />
          Message
        </button>
        {youtubeLink && (
          <a
            href={toAbsoluteUrl(youtubeLink.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 rounded-full bg-bg border border-border p-3 text-sm text-text"
          >
            <YoutubeIcon className="size-5" />
            YouTube
          </a>
        )}
        {instagramUrl && (
          <a
            href={toAbsoluteUrl(instagramUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 rounded-full bg-bg border border-border p-3 text-sm text-text"
          >
            <InstagramIcon className="size-5" />
            Instagram
          </a>
        )}
      </div>

      {bio && (
        <div className="flex flex-col items-start px-4 py-5">
          <h2 className="font-medium text-xl text-text mb-2">About the artist</h2>
          <ReadMore text={bio} className="w-full" />
        </div>
      )}

      {showContact && (
        <ContactForm artistId={artistId} onClose={() => setShowContact(false)} />
      )}
    </>
  );
}
