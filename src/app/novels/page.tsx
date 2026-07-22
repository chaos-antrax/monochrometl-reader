import type { Metadata } from "next";
import { connection } from "next/server";
import { ArrowUpRight, BookOpen, BookText } from "lucide-react";
import { getPublishedNovelSummaries } from "@/lib/published-content";
import Link from "next/link";
import NovelCard from "@/components/NovelCard";

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
        <p className="font-inter text-xs uppercase tracking-[0.22em] font-extralight">
          what's on the table
        </p>
        <h1 className="text-4xl font-lora mt-4"> Browse Novels</h1>
        {/* <p className="font-inter mt-1"> See what's on the table.</p> */}
      </div>
      {novels.length ? (
        <div className="flex flex-col gap-2">
          {novels.map((novel) => (
            <NovelCard key={novel.id} novel={novel} />
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
