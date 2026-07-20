"use client";

import { useState } from "react";
import Link from "next/link";
import type { ContactLink } from "@/lib/database.types";
import InfoOverlay from "@/components/InfoOverlay";
import ContactForm from "@/components/ContactForm";
import { toAbsoluteUrl } from "@/lib/url";

export default function PublicHeader({
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
  const [showInfo, setShowInfo] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <>
      <header className="grid grid-cols-3 items-center px-4 py-3 border-b border-border font-utility text-xs uppercase tracking-wide">
        <div className="justify-self-start">
          <Link href={`/${slug}`} className="hover:text-accent">
            {slug}
          </Link>
        </div>

        <div className="justify-self-center">
          <button onClick={() => setShowInfo(true)} className="hover:text-accent">
            Information
          </button>
        </div>

        <div className="justify-self-end flex gap-1 text-text-dim">
          <button onClick={() => setShowContact(true)} className="hover:text-accent">
            Email
          </button>
          {instagramUrl && (
            <>
              <span>,</span>
              <a
                href={toAbsoluteUrl(instagramUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent"
              >
                Instagram
              </a>
            </>
          )}
          {links.map((link, i) => (
            <span key={i} className="flex gap-1">
              <span>,</span>
              <a
                href={toAbsoluteUrl(link.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent"
              >
                {link.label}
              </a>
            </span>
          ))}
        </div>
      </header>

      <div className="px-4 py-6 text-center">
        <h1 className="font-display text-2xl font-semibold">{displayName}</h1>
        {location && (
          <p className="text-text-dim text-xs font-utility uppercase tracking-wide mt-1">
            {location}
          </p>
        )}
      </div>

      {showInfo && (
        <InfoOverlay
          bio={bio}
          bioImageUrl={bioImageUrl}
          onClose={() => setShowInfo(false)}
        />
      )}
      {showContact && (
        <ContactForm artistId={artistId} onClose={() => setShowContact(false)} />
      )}
    </>
  );
}
