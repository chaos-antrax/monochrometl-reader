import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { BookMarked, BookOpen } from 'lucide-react';
import Button from '@/components/Button';
import LibraryCard from '@/components/LibraryCard';
import { getCurrentUser } from '@/lib/auth';
import { getReaderLibrary } from '@/lib/reader-library';

export const metadata:Metadata={title:'Your Library',description:'Your saved novels on Monochrome Translations.',robots:{index:false,follow:false}};

export default async function LibraryPage(){const user=await getCurrentUser();if(!user)redirect('/signin');const novels=await getReaderLibrary(user.id);return <main className='pb-16 md:pb-24'>
  <header className='px-10 md:px-24 xl:px-36 pt-14 md:pt-20 pb-10 md:pb-12'><div className='flex items-end justify-between gap-8'><div><p className='font-inter text-xs uppercase tracking-[0.22em] font-extralight'>Saved for later</p><h1 className='font-lora text-5xl md:text-4xl mt-4'>Your Library</h1></div><div className='hidden md:flex items-center gap-3 font-inter font-extralight text-sm'><BookMarked size={19} strokeWidth={1}/><span>{novels.length} {novels.length===1?'title':'titles'}</span></div></div></header>
  {novels.length?<section className='px-4 md:px-10 xl:px-36 pt-8 md:pt-10'><div className='flex flex-col gap-2'>{novels.map((novel,index)=><LibraryCard novel={novel} index={index} key={novel.id}/>)}</div></section>:<section className='px-10 min-h-[52vh] flex items-center justify-center'><div className='flex flex-col items-center text-center max-w-sm'><BookOpen size={64} strokeWidth={0.45}/><p className='font-inter text-[10px] uppercase tracking-[0.22em] font-extralight mt-8'>Nothing saved yet</p><h2 className='font-lora text-3xl mt-3'>Your shelves are quiet</h2><p className='font-inter text-sm font-extralight leading-6 mt-4 mb-8'>Browse the collection and save a novel to find it waiting here.</p><Button href='/novels' btnType='block'>Browse Novels</Button></div></section>}
  </main>}
