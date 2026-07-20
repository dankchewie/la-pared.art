import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import MessagesList from "@/components/MessagesList";

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("artist_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-md w-full mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="font-display text-lg font-semibold">Messages</h1>
        <Link
          href="/dashboard"
          className="font-utility text-xs uppercase tracking-wide text-text-dim hover:text-text"
        >
          Back
        </Link>
      </header>

      <MessagesList messages={messages ?? []} />
    </div>
  );
}
