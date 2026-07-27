import Link from "next/link";

export default function BrandFooterBar() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center justify-between gap-2 bg-black/80 rounded-2xl p-2 w-[calc(100%-2rem)] max-w-sm">
      <span className="font-display italic text-lg text-white px-2">
        la pared
      </span>
      <Link
        href="/login"
        className="rounded-full bg-text border border-white/20 px-4 py-2 text-sm font-semibold text-white whitespace-nowrap"
      >
        Muestra tu arte
      </Link>
    </div>
  );
}
