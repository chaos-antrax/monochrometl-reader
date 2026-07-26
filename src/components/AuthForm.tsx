"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import Button from "./Button";
import { notify } from "@/lib/toast";

export default function AuthForm({
  mode,
  redirectTo = "/account",
  notice,
}: {
  mode: "login" | "signup";
  redirectTo?: string;
  notice?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const data = new FormData(event.currentTarget);
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      notify(
        mode === "login" ? "Welcome back." : "Your account is ready.",
        "success",
      );
      router.replace(redirectTo);
      router.refresh();
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setPending(false);
    }
  }
  return (
    <form
      onSubmit={submit}
      className="flex flex-col space-y-10 mt-20 font-lora max-w-sm"
    >
      {notice && (
        <p
          className="font-inter text-sm border-l border-foreground/30 pl-4"
          role="status"
        >
          {notice}
        </p>
      )}
      <div className="flex flex-col space-y-4">
        <label htmlFor={`${mode}-email`}>Email</label>
        <input
          id={`${mode}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          className="border-foreground/10 border-b bg-transparent focus:outline-none"
        />
      </div>
      <div className="flex flex-col space-y-4">
        <label htmlFor={`${mode}-password`}>Password</label>
        <input
          id={`${mode}-password`}
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={8}
          maxLength={128}
          required
          className="border-foreground/10 border-b bg-transparent focus:outline-none tracking-widest"
        />
      </div>
      {mode === "signup" && (
        <div className="flex flex-col space-y-4">
          <label htmlFor="confirm-password">Confirm password</label>
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            required
            className="border-foreground/10 border-b bg-transparent focus:outline-none tracking-widest"
          />
        </div>
      )}
      {error && (
        <p
          className="font-inter text-sm border-l border-red-500 pl-4 text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
      <Button btnType="block" type="submit" disabled={pending}>
        {pending
          ? "Please wait…"
          : mode === "login"
            ? "Sign in"
            : "Create account"}
      </Button>
      <p className="font-inter text-sm font-extralight">
        {mode === "login" ? (
          <>
            New here?{" "}
            <Link href="/signup" className="underline underline-offset-4">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already registered?{" "}
            <Link href="/signin" className="underline underline-offset-4">
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
