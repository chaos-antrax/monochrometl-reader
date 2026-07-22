import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BookMarked, ArrowUpRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getReaderLibrary } from "@/lib/reader-library";

export const metadata: Metadata = { title: "Your library" };

export default async function LibraryPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin');
  const novels = await getReaderLibrary(user.id);
  return (
    <main className="page shell">
      <div className="page-heading">
        <p className="kicker">Saved for later</p>
        <h1>Your library</h1>
        <p>The stories you want to keep close.</p>
      </div>
      {novels.length ? (
        <div className="library-list">
          {novels.map((novel) => (
            <Link href={`/novels/${novel.id}`} key={novel.id}>
              <div>
                <span>{novel.chapterCount} chapters</span>
                <h2>{novel.title}</h2>
                <p>{novel.description}</p>
              </div>
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <BookMarked size={30} />
          <h2>Your shelves are empty</h2>
          <p>Browse the collection and save a novel to find it here.</p>
          <Link className="button primary" href="/novels">
            Browse novels
          </Link>
        </div>
      )}
    </main>
  );
}
