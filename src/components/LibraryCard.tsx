import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BookText } from 'lucide-react';
import type { ReaderLibraryNovel } from '@/lib/reader-library';

export default function LibraryCard({novel,index}:{novel:ReaderLibraryNovel;index:number}){return <article className='group grid grid-cols-[2.5rem_1fr] md:grid-cols-[3rem_5rem_1fr_auto] items-center gap-4 md:gap-8 bg-foreground/4 px-5 py-6 md:px-8 md:py-7'>
  <span className='font-inter text-xs font-extralight text-foreground/45 tabular-nums'>{String(index+1).padStart(2,'0')}</span>
  <BookText className='hidden md:block' size={52} strokeWidth={0.35}/>
  <div className='min-w-0'><p className='font-inter text-[10px] uppercase tracking-[0.18em] font-extralight mb-2'>{novel.chapterCount} {novel.chapterCount===1?'chapter':'chapters'}</p><Link href={`/novels/${novel.id}`} className='inline-flex items-center gap-2'><h2 className='font-lora text-xl md:text-2xl line-clamp-1'>{novel.title}</h2><ArrowUpRight size={17} className='shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1'/></Link>{novel.progress?<p className='font-inter text-xs font-extralight text-foreground/60 line-clamp-1 mt-2'>Last read · Chapter {novel.progress.chapterOrder}: {novel.progress.chapterTitle}</p>:<p className='font-inter text-xs md:text-sm font-extralight text-foreground/65 line-clamp-2 mt-2'>{novel.description||'A published translation on Monochrome Translations.'}</p>}</div>
  <div className='col-start-2 md:col-start-auto mt-1 md:mt-0'>{novel.progress?<Link href={`/novels/${novel.id}/read/${novel.progress.chapterId}`} className='inline-flex items-center gap-3 border border-foreground/15 px-4 py-3 font-inter text-xs'>Continue <ArrowRight size={16}/></Link>:<Link href={`/novels/${novel.id}`} className='inline-flex items-center gap-3 border border-foreground/15 px-4 py-3 font-inter text-xs'>View novel <ArrowRight size={16}/></Link>}</div>
  </article>}
