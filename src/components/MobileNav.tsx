"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CircleUserRound,
  Library,
  LogIn,
  LogOut,
  Menu,
  UserPlus,
  X,
} from "lucide-react";
import type { ReaderUser } from "@/types/user";

export default function MobileNav({ user }: { user: ReaderUser | null }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  async function logout() {
    setPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setOpen(false);
      router.replace("/");
      router.refresh();
      setPending(false);
    }
  }
  const close = () => setOpen(false);
  return (
    <div className="md:hidden">
      <button
        aria-label="Open navigation menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="size-10 grid place-items-center cursor-pointer"
      >
        <Menu size={22} />
      </button>
      {open && (
        <>
          <button
            aria-label="Close navigation menu"
            onClick={close}
            className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm cursor-default"
          />
          <aside
            aria-label="Mobile navigation"
            className="fixed top-0 bottom-0 right-0 z-50 h-dvh min-h-dvh w-[min(88vw,24rem)] bg-background/90 text-foreground shadow-2xl backdrop-blur-3xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-foreground/10">
              <div>
                <p className="font-inter text-[10px] uppercase tracking-[0.2em] font-extralight">
                  Navigation
                </p>
                {user && (
                  <p className="font-inter text-xs font-extralight mt-2 max-w-60 truncate">
                    {user.email}
                  </p>
                )}
              </div>
              <button
                aria-label="Close navigation menu"
                onClick={close}
                className="size-10 grid place-items-center cursor-pointer"
              >
                <X size={21} />
              </button>
            </div>
            <nav className="flex-1 p-4 font-lora">
              <MobileLink
                href="/novels"
                icon={<BookOpen size={19} strokeWidth={1} />}
                onClick={close}
              >
                Browse
              </MobileLink>
              {user && (
                <MobileLink
                  href="/library"
                  icon={<Library size={19} strokeWidth={1} />}
                  onClick={close}
                >
                  Library
                </MobileLink>
              )}
              {user && (
                <MobileLink
                  href="/account"
                  icon={<CircleUserRound size={19} strokeWidth={1} />}
                  onClick={close}
                >
                  Account
                </MobileLink>
              )}
              {!user && (
                <MobileLink
                  href="/signin"
                  icon={<LogIn size={19} strokeWidth={1} />}
                  onClick={close}
                >
                  Sign In
                </MobileLink>
              )}
              {!user && (
                <MobileLink
                  href="/signup"
                  icon={<UserPlus size={19} strokeWidth={1} />}
                  onClick={close}
                >
                  Create Account
                </MobileLink>
              )}
            </nav>
            {user && (
              <div className="p-4 border-t border-foreground/10">
                <button
                  disabled={pending}
                  onClick={logout}
                  className="w-full flex items-center justify-between p-4 font-inter text-sm font-light cursor-pointer bg-foreground/[0.04] disabled:opacity-50"
                >
                  <span>{pending ? "Signing out…" : "Sign out"}</span>
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </aside>
        </>
      )}
    </div>
  );
}
function MobileLink({
  href,
  icon,
  onClick,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between border-b border-foreground/10 px-3 py-5 text-xl"
    >
      <span>{children}</span>
      {icon}
    </Link>
  );
}
