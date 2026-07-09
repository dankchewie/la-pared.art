import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 text-center gap-6">
      <div>
        <h1 className="font-display text-4xl font-semibold">La Pared</h1>
        <p className="text-text-dim font-utility text-sm uppercase tracking-wide mt-2">
          A studio wall.
        </p>
      </div>

      <Link
        href="/login"
        className="bg-accent text-bg font-utility uppercase text-sm tracking-wide py-3 px-8"
      >
        Log in
      </Link>
    </div>
  );
}
