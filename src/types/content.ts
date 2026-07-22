export type PublicChapterSummary = {
  id: string;
  title: string;
  order: number;
  publishedAt?: string;
};
export type PublicNovelSummary = {
  id: string;
  title: string;
  description: string;
  publishedAt?: string;
  chapterCount: number;
  inLibrary?: boolean;
};
export type PublicNovelDetail = PublicNovelSummary & {
  chapters: PublicChapterSummary[];
};
export type PublicChapter = PublicChapterSummary & {
  novelId: string;
  novelTitle: string;
  text: string;
  previousChapter?: PublicChapterSummary;
  nextChapter?: PublicChapterSummary;
};
