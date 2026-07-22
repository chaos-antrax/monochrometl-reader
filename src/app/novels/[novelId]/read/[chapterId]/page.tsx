import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import ReaderCanvas from "@/components/ReaderCanvas";
import { getCurrentUser } from "@/lib/auth";
import { DEFAULT_READER_SETTINGS } from "@/lib/constants";
import {
  getPublishedChapter,
  getPublishedNovelDetail,
} from "@/lib/published-content";
import { getReaderSettings } from "@/lib/reader-settings";

type Props = { params: Promise<{ novelId: string; chapterId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connection();
  const { novelId, chapterId } = await params;
  const chapter = await getPublishedChapter(novelId, chapterId);
  return chapter
    ? {
        title: `${chapter.title} — ${chapter.novelTitle}`,
        description: `Read ${chapter.title} from ${chapter.novelTitle}.`,
      }
    : { title: "Chapter not found" };
}

export default async function ReaderPage({ params }: Props) {
  await connection();
  const { novelId, chapterId } = await params;
  const [chapter, novel, user] = await Promise.all([
    getPublishedChapter(novelId, chapterId),
    getPublishedNovelDetail(novelId),
    getCurrentUser(),
  ]);
  if (!chapter || !novel) notFound();
  const settings = user
    ? await getReaderSettings(user.id)
    : DEFAULT_READER_SETTINGS;
  return (
    <ReaderCanvas
      chapter={chapter}
      chapters={novel.chapters}
      initialSettings={settings}
      authenticated={Boolean(user)}
    />
  );
}
