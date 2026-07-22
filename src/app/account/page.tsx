import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowUpRight, BookOpen, Library, UserRound } from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';
import { getCurrentUser } from '@/lib/auth';
export const metadata:Metadata={title:'Account | Monochrome Translations'};
export default async function AccountPage(){const user=await getCurrentUser();if(!user)redirect('/signin');const joined=user.createdAt?new Intl.DateTimeFormat('en',{month:'long',year:'numeric'}).format(new Date(user.createdAt)):null;return <main className='px-10 md:px-24 xl:px-36 py-14 md:py-10 xl:py-8 font-inter'>
  <div className='flex items-start justify-between gap-8 border-b border-foreground/10 pb-12 md:pb-7'>
    <div><p className='text-xs uppercase tracking-[0.22em] font-extralight'>Your space</p><h1 className='font-lora text-5xl md:text-6xl mt-4 md:mt-2'>Account</h1><p className='font-extralight mt-5 md:mt-3 text-sm'>A quiet corner for your reading life.</p></div>
    <UserRound className='hidden md:block' size={56} strokeWidth={0.5}/>
  </div>
  <section className='grid md:grid-cols-[1.4fr_1fr] gap-12 md:gap-12 xl:gap-16 py-12 md:py-8'>
    <div><h2 className='font-lora text-2xl mb-8 md:mb-4'>Profile</h2><dl className='divide-y divide-foreground/10 border-y border-foreground/10'>
      <div className='grid grid-cols-[7rem_1fr] py-5 md:py-3 gap-5'><dt className='text-xs uppercase tracking-widest font-extralight'>Email</dt><dd className='text-sm break-all'>{user.email}</dd></div>
      <div className='grid grid-cols-[7rem_1fr] py-5 md:py-3 gap-5'><dt className='text-xs uppercase tracking-widest font-extralight'>Access</dt><dd className='text-sm capitalize'>{user.role}</dd></div>
      {joined&&<div className='grid grid-cols-[7rem_1fr] py-5 md:py-3 gap-5'><dt className='text-xs uppercase tracking-widest font-extralight'>Joined</dt><dd className='text-sm'>{joined}</dd></div>}
    </dl></div>
    <div><h2 className='font-lora text-2xl mb-8 md:mb-4'>Reading</h2><div className='flex flex-col gap-2'>
      <Link href='/library' className='group flex items-center justify-between bg-foreground/4 p-5 md:p-4'><span className='flex items-center gap-4'><Library size={19} strokeWidth={1}/><span className='text-sm font-light'>Your library</span></span><ArrowUpRight size={17} className='group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform'/></Link>
      <Link href='/novels' className='group flex items-center justify-between bg-foreground/4 p-5 md:p-4'><span className='flex items-center gap-4'><BookOpen size={19} strokeWidth={1}/><span className='text-sm font-light'>Browse novels</span></span><ArrowUpRight size={17} className='group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform'/></Link>
    </div></div>
  </section>
  <section className='max-w-md mt-4 md:mt-0 md:max-w-none md:flex md:items-end md:justify-between md:gap-12'><div><h2 className='font-lora text-2xl mb-3'>Session</h2><p className='font-extralight text-sm mb-7 md:mb-0'>Signing out removes this reader session from the current device.</p></div><div className='md:w-72 md:shrink-0'><LogoutButton/></div></section>
  </main>}
