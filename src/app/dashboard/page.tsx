import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Wall from "@/components/Wall";
import UploadSheet from "@/components/UploadSheet";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: artworks } = await supabase
    .from("artworks")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex-1 flex flex-col pb-24">
      <header className="flex items-center justify-between px-4 py-4">
        <h1 className="font-display text-lg font-semibold">Your wall</h1>
        <nav className="flex items-center gap-4 font-utility text-xs uppercase tracking-wide text-text-dim">
          <Link href="/dashboard/profile" className="hover:text-text">
            Profile
          </Link>
          <Link href="/dashboard/messages" className="hover:text-text">
            Messages
          </Link>
          <SignOutButton />
        </nav>
      </header>

      <Wall artworks={artworks ?? []} editable />

      <UploadSheet userId={user!.id} />
    </div>
  );
}
