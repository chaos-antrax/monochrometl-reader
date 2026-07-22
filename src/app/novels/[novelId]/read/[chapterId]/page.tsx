import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft, ArrowRight, ChevronLeft, List } from "lucide-react";
import { getPublishedChapter } from "@/lib/published-content";
import { getCurrentUser } from "@/lib/auth";
import Button from "@/components/Button";
import ChapterNav from "@/components/ChapterNav";

type Props = { params: Promise<{ novelId: string; chapterId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connection();

  const value = await params;
  const chapter = await getPublishedChapter(value.novelId, value.chapterId);

  return chapter
    ? {
        title: `${chapter.title} — ${chapter.novelTitle}`,
        description: `Read ${chapter.title} from ${chapter.novelTitle}.`,
      }
    : { title: "Chapter not found" };
}

export default async function ReaderPage({ params }: Props) {
  await connection();

  const value = await params;
  const [chapter, user] = await Promise.all([
    getPublishedChapter(value.novelId, value.chapterId),
    getCurrentUser(),
  ]);

  if (!chapter) notFound();

  return (
    <main className="p-10">
      {/* breadcrumbs */}
      <p className="font-inter text-sm font-extralight mb-10">
        <Link href="/novels">Novels</Link> /{" "}
        <Link href={`/novels/${chapter.novelId}`}>{chapter.novelTitle}</Link> /{" "}
        {chapter.title}
      </p>
      <ChapterNav chapter={chapter} />
      <header className="mt-10">
        <div>
          <p className="text-sm font-extralight font-lora">
            {chapter.novelTitle}
          </p>
          <h1 className="font-lora text-2xl">{chapter.title}</h1>
        </div>
      </header>

      {/* reader */}
      <div className="mt-10 font-lora text-lg">{chapter.text}</div>
      <ChapterNav chapter={chapter} />
    </main>
  );
}
