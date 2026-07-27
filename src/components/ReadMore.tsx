"use client";

import { useState } from "react";

export default function ReadMore({
  text,
  className,
  clampClassName = "line-clamp-2",
}: {
  text: string;
  className?: string;
  clampClassName?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={className}>
      <p className={`text-sm text-text leading-relaxed ${expanded ? "" : clampClassName}`}>
        {text}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-1 text-xs font-semibold text-link hover:opacity-80"
      >
        {expanded ? "Leer menos" : "Leer más"}
      </button>
    </div>
  );
}
