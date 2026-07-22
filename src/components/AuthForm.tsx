"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Button from "./Button";
import Link from "next/link";

const AuthForm = ({ mode }: { mode: "login" | "signup" }) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(data)),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? "Something went wrong.");
      setPending(false);
      return;
    }
    router.push("/account");
    router.refresh();
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col space-y-10 mt-20 font-lora max-w-sm"
    >
      <div className="flex flex-col space-y-4">
        <label>Email</label>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="border-white/10 border-b focus:outline-none"
        />
      </div>
      <div className="flex flex-col space-y-4">
        <label>Password</label>{" "}
        <input
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={8}
          required
          className="border-white/10 border-b focus:outline-none tracking-widest"
        />
      </div>

      {mode === "signup" && (
        <div className="flex flex-col space-y-4">
          <label>Confirm password</label>
          <input
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            className="border-white/10 border-b focus:outline-none tracking-widest"
          />
        </div>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <Button btnType="block" disabled={pending}>
        {pending
          ? "Please wait…"
          : mode === "login"
            ? "Sign in"
            : "Create account"}
      </Button>
      <>
        {mode === "login" ? (
          <div className="flex flex-col max-w-fit">
            <p> New here?</p>
            <Link href="/signup" className="underline">
              Sign Up
            </Link>
          </div>
        ) : (
          <>
            Already registered?{" "}
            <Link href="/signin" className="underline">
              Sign in
            </Link>
          </>
        )}
      </>
    </form>
  );
};

export default AuthForm;
