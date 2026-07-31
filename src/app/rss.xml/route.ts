import { createHash } from "node:crypto";
import { getPublishedFeedChapters } from "@/lib/published-content";

const FEED_TITLE = "Monochrome Translations - Latest Chapters";
const FEED_DESCRIPTION =
  "The latest published novel translation chapters from Monochrome Translations.";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function validDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET(request: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const siteUrl = new URL(configuredUrl || new URL(request.url).origin);
  siteUrl.pathname = "/";
  siteUrl.search = "";
  siteUrl.hash = "";
  const siteUrlValue = siteUrl.toString();
  const origin = siteUrlValue.endsWith("/")
    ? siteUrlValue.slice(0, -1)
    : siteUrlValue;
  const feedUrl = `${origin}/rss.xml`;
  const chapters = (await getPublishedFeedChapters()).filter((chapter) =>
    validDate(chapter.publishedAt),
  );
  const latestDate = chapters[0]
    ? validDate(chapters[0].publishedAt)
    : null;

  const items = chapters
    .map((chapter) => {
      const chapterUrl =
        `${origin}/novels/${encodeURIComponent(chapter.novelId)}` +
        `/read/${encodeURIComponent(chapter.id)}`;
      const itemTitle =
        `${chapter.novelTitle} - Chapter ${chapter.order}: ${chapter.title}`;
      const publishedAt = validDate(chapter.publishedAt);

      return [
        "    <item>",
        `      <title>${escapeXml(itemTitle)}</title>`,
        `      <link>${escapeXml(chapterUrl)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(chapterUrl)}</guid>`,
        `      <description>${escapeXml(`Read chapter ${chapter.order} of ${chapter.novelTitle}.`)}</description>`,
        `      <pubDate>${publishedAt?.toUTCString()}</pubDate>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(FEED_TITLE)}</title>`,
    `    <link>${escapeXml(origin)}</link>`,
    `    <description>${escapeXml(FEED_DESCRIPTION)}</description>`,
    "    <language>en</language>",
    `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    `    <lastBuildDate>${(latestDate ?? new Date(0)).toUTCString()}</lastBuildDate>`,
    "    <generator>Monochrome Translations</generator>",
    "    <ttl>60</ttl>",
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
  const etag = `"${createHash("sha256").update(xml).digest("base64url")}"`;
  const headers = {
    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    "Content-Type": "application/rss+xml; charset=utf-8",
    ETag: etag,
  };

  if (request.headers.get("if-none-match") === etag) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(xml, { headers });
}
