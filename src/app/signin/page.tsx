import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";
export const metadata: Metadata = {
  title: "Sign in | Monochrome Translations",
};
export default async function SignIn() {
  if (await getCurrentUser()) redirect("/account");
  return (
    <main className="px-10 md:px-24 xl:px-36 pb-20">
      <p className="font-inter text-xs uppercase tracking-[0.22em] font-extralight mt-16 md:mt-24">
        Welcome back
      </p>
      <h1 className="text-6xl md:text-7xl font-lora mt-4">Sign In</h1>

      <AuthForm mode="login" />
    </main>
  );
}
