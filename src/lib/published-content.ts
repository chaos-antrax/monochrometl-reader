import { getDatabase } from "@/lib/db";
import type { Filter } from "mongodb";
import type {
  PublicChapter,
  PublicChapterSummary,
  PublicNovelDetail,
  PublicNovelSummary,
} from "@/types/content";

type NovelDoc = {
  id: string;
  title: string;
  description: string;
  descriptionTranslated?: string;
  publishedAt?: string;
};
type ChapterDoc = {
  id: string;
  novelId: string;
  title: string;
  order: number;
  publishedVersion: number;
  publishedAt?: string;
};
const novelProjection = {
  _id: 0,
  id: 1,
  title: 1,
  description: 1,
  descriptionTranslated: 1,
  publishedAt: 1,
} as const;
const chapterProjection = {
  _id: 0,
  id: 1,
  novelId: 1,
  title: 1,
  order: 1,
  publishedVersion: 1,
  publishedAt: 1,
} as const;
const chapterFilter = {
  published: true,
  publishedVersion: { $type: "number" },
} as unknown as Filter<ChapterDoc>;
const description = (novel: NovelDoc) =>
  novel.descriptionTranslated || novel.description || "";
const chapterSummary = (chapter: ChapterDoc): PublicChapterSummary => ({
  id: chapter.id,
  title: chapter.title,
  order: chapter.order,
  publishedAt: chapter.publishedAt,
});

export async function getPublishedNovelSummaries(): Promise<
  PublicNovelSummary[]
> {
  const db = await getDatabase();
  const novels = await db
    .collection<NovelDoc>("novels")
    .find({ published: true }, { projection: novelProjection })
    .sort({ publishedAt: -1, updatedAt: -1 })
    .toArray();
  const counts = await db
    .collection("chapters")
    .aggregate<{ _id: string; count: number }>([
      { $match: chapterFilter },
      { $group: { _id: "$novelId", count: { $sum: 1 } } },
    ])
    .toArray();
  const byNovel = new Map(counts.map((item) => [item._id, item.count]));
  return novels.map((novel) => ({
    id: novel.id,
    title: novel.title,
    description: description(novel),
    publishedAt: novel.publishedAt,
    chapterCount: byNovel.get(novel.id) ?? 0,
  }));
}
export async function getPublishedNovelDetail(
  novelId: string,
): Promise<PublicNovelDetail | null> {
  const db = await getDatabase();
  const novel = await db
    .collection<NovelDoc>("novels")
    .findOne({ id: novelId, published: true }, { projection: novelProjection });
  if (!novel) return null;
  const chapters = await db
    .collection<ChapterDoc>("chapters")
    .find({ novelId, ...chapterFilter }, { projection: chapterProjection })
    .sort({ order: 1 })
    .toArray();
  return {
    id: novel.id,
    title: novel.title,
    description: description(novel),
    publishedAt: novel.publishedAt,
    chapterCount: chapters.length,
    chapters: chapters.map(chapterSummary),
  };
}
export async function getPublishedChapter(
  novelId: string,
  chapterId: string,
): Promise<PublicChapter | null> {
  const db = await getDatabase();
  const novel = await db
    .collection<NovelDoc>("novels")
    .findOne({ id: novelId, published: true }, { projection: novelProjection });
  if (!novel) return null;
  const chapters = await db
    .collection<ChapterDoc>("chapters")
    .find({ novelId, ...chapterFilter }, { projection: chapterProjection })
    .sort({ order: 1 })
    .toArray();
  const index = chapters.findIndex((item) => item.id === chapterId);
  if (index < 0) return null;
  const chapter = chapters[index];
  const translation = await db
    .collection<{ text: string }>("translationVersions")
    .findOne(
      { chapterId: chapter.id, version: chapter.publishedVersion },
      { projection: { _id: 0, text: 1 } },
    );
  if (!translation) return null;
  return {
    ...chapterSummary(chapter),
    novelId,
    novelTitle: novel.title,
    text: translation.text,
    previousChapter:
      index > 0 ? chapterSummary(chapters[index - 1]) : undefined,
    nextChapter:
      index < chapters.length - 1
        ? chapterSummary(chapters[index + 1])
        : undefined,
  };
}
export async function getPublishedChapterPaths() {
  const chapters = await (
    await getDatabase()
  )
    .collection<ChapterDoc>("chapters")
    .find(chapterFilter, { projection: { _id: 0, novelId: 1, id: 1 } })
    .toArray();
  return chapters.map(({ novelId, id }) => ({ novelId, chapterId: id }));
}
