"use client";
import { useState } from "react";
import { Bookmark } from "lucide-react";
import Button from "./Button";
export function LibraryButton({
  novelId,
  initial,
  authenticated,
}: {
  novelId: string;
  initial: boolean;
  authenticated: boolean;
}) {
  const [saved, setSaved] = useState(initial);
  const [pending, setPending] = useState(false);
  async function toggle() {
    if (!authenticated) {
      location.href = "/login";
      return;
    }
    setPending(true);
    const response = await fetch(
      saved ? `/api/library/${novelId}` : "/api/library",
      {
        method: saved ? "DELETE" : "POST",
        headers: { "content-type": "application/json" },
        body: saved ? undefined : JSON.stringify({ novelId }),
      },
    );
    if (response.ok) setSaved(!saved);
    setPending(false);
  }
  return (
    <Button
      btnType="block"
      className="flex items-center gap-2 text-sm max-w-fit"
      disabled={pending}
      onClick={toggle}
    >
      <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
      {pending ? "Saving…" : saved ? "In your library" : "Add to library"}
    </Button>
  );
}
