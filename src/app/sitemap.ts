import type { MetadataRoute } from 'next';
import { getPublishedChapterPaths, getPublishedNovelSummaries } from '@/lib/published-content';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/novels`, changeFrequency: 'daily', priority: 0.9 },
  ];
  if (!process.env.MONGODB_URI) return base;
  const [novels, chapters] = await Promise.all([getPublishedNovelSummaries(), getPublishedChapterPaths()]);
  return [...base,
    ...novels.map((novel) => ({ url: `${siteUrl}/novels/${novel.id}`, lastModified: novel.publishedAt ? new Date(novel.publishedAt) : undefined, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...chapters.map(({ novelId, chapterId }) => ({ url: `${siteUrl}/novels/${novelId}/read/${chapterId}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ];
}
