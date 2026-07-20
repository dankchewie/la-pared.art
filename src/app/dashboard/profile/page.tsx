import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProfileEditor from "@/components/ProfileEditor";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: artist } = await supabase
    .from("artists")
    .select("*")
    .eq("id", user!.id)
    .single();

  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-md w-full mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="font-display text-lg font-semibold">Profile</h1>
        <Link
          href="/dashboard"
          className="font-utility text-xs uppercase tracking-wide text-text-dim hover:text-text"
        >
          Back
        </Link>
      </header>

      <ProfileEditor artist={artist!} />
    </div>
  );
}
