import type { Metadata } from "next";
import { connection } from "next/server";
import { ArrowUpRight, BookOpen, BookText } from "lucide-react";
import { getPublishedNovelSummaries } from "@/lib/published-content";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Browse novels",
  description: "Browse available translations on Monochrome Translations.",
};

export default async function Novels() {
  await connection();
  const novels = await getPublishedNovelSummaries();
  return (
    <>
      <div className="p-10">
        <h1 className="text-4xl font-lora"> Browse Novels</h1>
        <p className="font-inter mt-1"> See what the community has to offer.</p>
      </div>
      {novels.length ? (
        <div className="flex flex-col gap-2">
          {novels.map((novel) => (
            <Link
              key={novel.id}
              href={`/novels/${novel.id}`}
              className="bg-foreground/4 relative gap-10 flex items-center justify-center p-10"
            >
              <div className="hidden md:block">
                <BookText size={84} strokeWidth={0.1} />
              </div>
              <div className="flex flex-col gap-4">
                <p className="font-inter hidden text absolute items-center justify-center lg:flex gap-4 right-10 font-extralight">
                  {novel.chapterCount}{" "}
                  {novel.chapterCount === 1 ? "chapter" : "chapters"}
                  <ArrowUpRight className="right-10 top-10" size={20} />
                </p>
                <h2 className="font-lora line-clamp-2 md:line-clamp-1 text-2xl">
                  {novel.title}{" "}
                  <p className="hidden lg:block">
                    {novel.chapterCount > 0 && `(${novel.chapterCount})`}
                  </p>
                </h2>
                <p className="font-inter text-sm font-extralight line-clamp-5">
                  {novel.description ||
                    "A published translation on Monochrome Reader."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="items-center justify-center flex flex-col gap-4 text-center mt-64 md:mt-40">
          <BookText size={64} strokeWidth={0.5} />
          <h2 className="text-2xl font-lora">No published novels yet</h2>
        </div>
      )}
    </>
  );
}
