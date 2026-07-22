import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowUpRight, BookMarked, BookOpen, BookText } from 'lucide-react';
import Button from '@/components/Button';
import { getCurrentUser } from '@/lib/auth';
import { getReaderLibrary } from '@/lib/reader-library';

export const metadata: Metadata = {
  title: 'Your Library | Monochrome Translations',
  description: 'Your saved novels on Monochrome Translations.',
};

export default async function LibraryPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin');
  const novels = await getReaderLibrary(user.id);

  return (
    <main className='pb-16 md:pb-24'>
      <header className='px-10 md:px-24 xl:px-36 pt-14 md:pt-20 pb-10 md:pb-12 border-b border-foreground/10'>
        <div className='flex items-end justify-between gap-8'>
          <div>
            <p className='font-inter text-xs uppercase tracking-[0.22em] font-extralight'>Saved for later</p>
            <h1 className='font-lora text-5xl md:text-7xl mt-4'>Your Library</h1>
            <p className='font-inter font-extralight text-sm mt-5'>The stories you want to keep close.</p>
          </div>
          <div className='hidden md:flex items-center gap-3 font-inter font-extralight text-sm'>
            <BookMarked size={19} strokeWidth={1}/>
            <span>{novels.length} {novels.length===1?'title':'titles'}</span>
          </div>
        </div>
      </header>

      {novels.length ? (
        <section className='px-4 md:px-10 xl:px-36 pt-8 md:pt-10'>
          <div className='flex flex-col gap-2'>
            {novels.map((novel,index)=>(
              <Link href={`/novels/${novel.id}`} key={novel.id} className='group grid grid-cols-[2.5rem_1fr_auto] md:grid-cols-[3rem_5rem_1fr_auto] items-center gap-4 md:gap-8 bg-foreground/4 px-5 py-6 md:px-8 md:py-7'>
                <span className='font-inter text-xs font-extralight text-foreground/45 tabular-nums'>{String(index+1).padStart(2,'0')}</span>
                <BookText className='hidden md:block' size={52} strokeWidth={0.35}/>
                <div className='min-w-0'>
                  <div className='flex items-center gap-3 mb-2'>
                    <span className='font-inter text-[10px] uppercase tracking-[0.18em] font-extralight'>{novel.chapterCount} {novel.chapterCount===1?'chapter':'chapters'}</span>
                  </div>
                  <h2 className='font-lora text-xl md:text-2xl line-clamp-1'>{novel.title}</h2>
                  <p className='font-inter text-xs md:text-sm font-extralight text-foreground/65 line-clamp-2 mt-2 max-w-3xl'>{novel.description||'A published translation on Monochrome Translations.'}</p>
                </div>
                <ArrowUpRight size={19} className='self-start md:self-center mt-1 md:mt-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1'/>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className='px-10 min-h-[52vh] flex items-center justify-center'>
          <div className='flex flex-col items-center text-center max-w-sm'>
            <BookOpen size={64} strokeWidth={0.45}/>
            <p className='font-inter text-[10px] uppercase tracking-[0.22em] font-extralight mt-8'>Nothing saved yet</p>
            <h2 className='font-lora text-3xl mt-3'>Your shelves are quiet</h2>
            <p className='font-inter text-sm font-extralight leading-6 mt-4 mb-8'>Browse the collection and save a novel to find it waiting here.</p>
            <Button href='/novels' btnType='block'>Browse Novels</Button>
          </div>
        </section>
      )}
    </main>
  );
}
