import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft, ArrowRight, BookOpen, BookText } from "lucide-react";
import { getPublishedNovelDetail } from "@/lib/published-content";
import { getCurrentUser } from "@/lib/auth";
import { isNovelInLibrary } from "@/lib/reader-library";
import { LibraryButton } from "@/components/LibraryButton";
import Button from "@/components/Button";

type Props = { params: Promise<{ novelId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connection();
  const { novelId } = await params;
  const novel = await getPublishedNovelDetail(novelId);
  return novel
    ? { title: novel.title, description: novel.description.slice(0, 160) }
    : { title: "Novel not found" };
}

export default async function NovelPage({ params }: Props) {
  await connection();
  const { novelId } = await params;
  const [novel, user] = await Promise.all([
    getPublishedNovelDetail(novelId),
    getCurrentUser(),
  ]);

  if (!novel) notFound();

  const saved = user ? await isNovelInLibrary(user.id, novelId) : false;

  return (
    <main className="py-10">
      {/* breadcrumbs */}
      <p className="px-10 font-inter text-sm font-extralight">
        <Link href="/novels">Novels</Link> / {novel.title}
      </p>

      <section className="mt-10 p-10 flex gap-10 bg-foreground/4 font-inter font-extralight">
        <div className="items-center hidden justify-center md:flex">
          <BookText size={104} strokeWidth={0.1} />
        </div>
        <div className="flex flex-col gap-4">
          <p className="items-center hidden justify-end md:flex text-xs uppercase tracking-[0.22em] font-extralight">
            {novel.chapterCount} translated chapters
          </p>
          <h1 className="font-lora text-3xl">{novel.title}</h1>
          <p className="font-inter">{novel.description}</p>
          <div className="flex gap-4 justify-end">
            <LibraryButton
              novelId={novel.id}
              initial={saved}
              authenticated={Boolean(user)}
            />
          </div>
        </div>
      </section>

      <section className="mt-10 p-4 md:p-10">
        <div className="flex gap-4">
          <h2 className="font-lora text-2xl px-2 md:px-0">Chapters</h2>
          <span className="md:hidden">{novel.chapterCount}</span>
        </div>
        {novel.chapters.length ? (
          <ol className="flex flex-col gap-1 mt-5 md:mt-10">
            {novel.chapters.map((chapter) => (
              <li key={chapter.id}>
                <Link
                  href={`/novels/${novel.id}/read/${chapter.id}`}
                  className="flex gap-6 items-center justify-between font-lora font-light tracking-wide p-4 bg-foreground/4"
                >
                  <strong className="text-sm line-clamp-1 md:text-lg">
                    {chapter.title}
                  </strong>
                  <span className="text-sm md:text-md min-w-fit">
                    {chapter.publishedAt
                      ? new Date(chapter.publishedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )
                      : "Unpublished"}
                  </span>
                  {/* <ArrowRight size={18} /> */}
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <div className="items-center justify-center font-inter flex flex-col gap-4 mt-40">
            <BookOpen size={64} strokeWidth={0.5} />
            <h2 className="font-lora text-xl">No chapters yet</h2>
          </div>
        )}
      </section>
    </main>
  );
}
