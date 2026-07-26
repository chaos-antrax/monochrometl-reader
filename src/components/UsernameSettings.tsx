"use client";
import { useState } from "react";
import { authenticatedFetch, responseError } from "@/lib/client-api";
import { notify } from "@/lib/toast";
export default function UsernameSettings({
  initialUsername,
}: {
  initialUsername?: string;
}) {
  const [username, setUsername] = useState(initialUsername || "");
  const [pending, setPending] = useState(false);
  async function save(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      const response = await authenticatedFetch("/api/profile/username", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username }),
      });
      if (!response.ok)
        throw new Error(
          await responseError(response, "Unable to update username."),
        );
      const result = await response.json();
      setUsername(result.username);
      notify("Username updated.", "success");
    } catch (error) {
      notify(
        error instanceof Error ? error.message : "Unable to update username.",
        "error",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <form onSubmit={save} className="mt-4">
      <label
        htmlFor="account-username"
        className="text-xs uppercase tracking-widest font-extralight"
      >
        Username
      </label>
      <div className="mt-3 flex gap-2">
        <input
          id="account-username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          minLength={3}
          maxLength={24}
          pattern="[A-Za-z0-9_]+"
          placeholder="Choose a username"
          className="min-w-0 flex-1 border-b border-foreground/20 bg-transparent px-1 py-2 text-sm"
        />
        <button
          disabled={pending || username === initialUsername}
          className="border border-foreground/15 px-4 font-inter text-xs disabled:opacity-40"
        >
          {pending ? "Saving" : "Save"}
        </button>
      </div>
      <p className="mt-2 text-[11px] font-extralight opacity-55">
        Letters, numbers, and underscores only.
      </p>
    </form>
  );
}
