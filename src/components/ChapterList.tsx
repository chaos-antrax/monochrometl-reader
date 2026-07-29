"use client";

import Link from "next/link";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useMemo, useState } from "react";
import type { PublicChapterSummary } from "@/types/content";

export default function ChapterList({
  novelId,
  chapters,
}: {
  novelId: string;
  chapters: PublicChapterSummary[];
}) {
  const [direction, setDirection] = useState<"descending" | "ascending">(
    "descending",
  );
  const sortedChapters = useMemo(
    () =>
      [...chapters].sort((a, b) =>
        direction === "descending" ? b.order - a.order : a.order - b.order,
      ),
    [chapters, direction],
  );
  const descending = direction === "descending";

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="px-2 font-lora text-2xl md:px-0">Chapters</h2>
          <span className="md:hidden">{chapters.length}</span>
        </div>
        <button
          type="button"
          aria-label={`Sort chapters ${descending ? "ascending" : "descending"}`}
          aria-pressed={descending}
          onClick={() =>
            setDirection(descending ? "ascending" : "descending")
          }
          className="flex items-center gap-2 border border-foreground/15 px-3 py-2 font-inter text-[10px] uppercase tracking-[0.14em] md:px-4 md:text-xs"
        >
          {descending ? (
            <ArrowDown size={14} strokeWidth={1.25} />
          ) : (
            <ArrowUp size={14} strokeWidth={1.25} />
          )}
          <span>{descending ? "Latest first" : "Earliest first"}</span>
        </button>
      </div>
      <ol className="mt-5 flex flex-col gap-1 md:mt-10">
        {sortedChapters.map((chapter) => (
          <li key={chapter.id}>
            <Link
              href={`/novels/${novelId}/read/${chapter.id}`}
              className="flex items-center justify-between gap-6 bg-foreground/4 p-4 font-lora font-light tracking-wide"
            >
              <strong className="line-clamp-1 text-sm md:text-lg">
                {chapter.title}
              </strong>
              <span className="min-w-fit text-sm md:text-md">
                {chapter.publishedAt
                  ? new Date(chapter.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Unpublished"}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
