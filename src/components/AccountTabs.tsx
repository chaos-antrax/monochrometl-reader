"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, BookOpen, Library } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import AccountPreferences from "@/components/AccountPreferences";
import type { ReaderSettings } from "@/types/reader";
import type { ReaderUser } from "@/types/user";

export default function AccountTabs({
  user,
  joined,
  settings,
}: {
  user: ReaderUser;
  joined: string | null;
  settings: ReaderSettings;
}) {
  const [tab, setTab] = useState<"profile" | "preferences">("profile");
  return (
    <>
      <div className="flex gap-8 border-b border-foreground/10 font-inter text-xs uppercase tracking-[0.18em] font-extralight">
        <button
          onClick={() => setTab("profile")}
          className={`pb-3 cursor-pointer ${tab === "profile" ? "border-b border-foreground" : ""}`}
        >
          Profile
        </button>
        <button
          onClick={() => setTab("preferences")}
          className={`pb-3 cursor-pointer ${tab === "preferences" ? "border-b border-foreground" : ""}`}
        >
          Preferences
        </button>
      </div>
      {tab === "profile" ? (
        <>
          <section className="motion-content grid md:grid-cols-[1.4fr_1fr] gap-12 md:gap-12 xl:gap-16 py-12 md:py-8">
            <div>
              <h2 className="font-lora text-2xl mb-8 md:mb-4">Profile</h2>
              <dl className="divide-y divide-foreground/10 border-y border-foreground/10">
                <div className="grid grid-cols-[7rem_1fr] py-5 md:py-3 gap-5">
                  <dt className="text-xs uppercase tracking-widest font-extralight items-center flex">
                    Email
                  </dt>
                  <dd className="text-sm break-all">{user.email}</dd>
                </div>
                <div className="grid grid-cols-[7rem_1fr] py-5 md:py-3 gap-5">
                  <dt className="text-xs uppercase tracking-widest font-extralight items-center flex">
                    Access
                  </dt>
                  <dd className="text-sm capitalize">{user.role}</dd>
                </div>
                {joined && (
                  <div className="grid grid-cols-[7rem_1fr] py-5 md:py-3 gap-5">
                    <dt className="text-xs uppercase tracking-widest font-extralight items-center flex">
                      Joined
                    </dt>
                    <dd className="text-sm">{joined}</dd>
                  </div>
                )}
              </dl>
            </div>
            <div>
              <h2 className="font-lora text-2xl mb-8 md:mb-4">Reading</h2>
              <div className="flex flex-col gap-2">
                <Link
                  href="/library"
                  className="group flex items-center justify-between bg-foreground/4 p-5 md:p-4"
                >
                  <span className="flex items-center gap-4">
                    <Library size={19} strokeWidth={1} />
                    <span className="text-sm font-light">Your library</span>
                  </span>
                  <ArrowUpRight
                    size={17}
                    className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                  />
                </Link>
                <Link
                  href="/novels"
                  className="group flex items-center justify-between bg-foreground/4 p-5 md:p-4"
                >
                  <span className="flex items-center gap-4">
                    <BookOpen size={19} strokeWidth={1} />
                    <span className="text-sm font-light">Browse novels</span>
                  </span>
                  <ArrowUpRight
                    size={17}
                    className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </section>
          <section className="max-w-md mt-4 md:mt-0 md:max-w-none md:flex md:items-end md:justify-between md:gap-12">
            <div>
              <h2 className="font-lora text-2xl mb-3">Session</h2>
              <p className="font-extralight text-sm mb-7 md:mb-0">
                Sign out from your account. Your library and preferences will be
                saved.
              </p>
            </div>
            <div className="md:w-72 md:shrink-0">
              <LogoutButton />
            </div>
          </section>
        </>
      ) : (
        <section className="motion-content py-10 md:py-5 max-w-4xl">
          <p className="font-inter text-xs uppercase tracking-[0.18em] font-extralight">
            Reading experience
          </p>
          <h2 className="font-lora text-3xl md:text-2xl mt-3 md:mt-2">
            Preferences
          </h2>
          <p className="font-inter text-sm font-extralight leading-6 mt-3 mb-8 md:mb-5">
            Adjust the application theme and the canvas used for every chapter.
          </p>
          <AccountPreferences initialSettings={settings} />
        </section>
      )}
    </>
  );
}
