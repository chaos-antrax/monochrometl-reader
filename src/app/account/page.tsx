import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { UserRound } from 'lucide-react';
import AccountTabs from '@/components/AccountTabs';
import { getCurrentUser } from '@/lib/auth';
import { getReaderSettings } from '@/lib/reader-settings';
export const metadata:Metadata={title:'Account | Monochrome Translations'};
export default async function AccountPage(){const user=await getCurrentUser();if(!user)redirect('/signin');const[joined,settings]=await Promise.all([Promise.resolve(user.createdAt?new Intl.DateTimeFormat('en',{month:'long',year:'numeric'}).format(new Date(user.createdAt)):null),getReaderSettings(user.id)]);return <main className='px-10 md:px-24 xl:px-36 py-14 md:py-10 xl:py-8 font-inter'>
  <div className='flex items-start justify-between gap-8 pb-12 md:pb-7'><div><p className='text-xs uppercase tracking-[0.22em] font-extralight'>Your space</p><h1 className='font-lora text-5xl md:text-6xl mt-4 md:mt-2'>Account</h1><p className='font-extralight mt-5 md:mt-3 text-sm'>A quiet corner for your reading life.</p></div><UserRound className='hidden md:block' size={56} strokeWidth={0.5}/></div>
  <AccountTabs user={user} joined={joined} settings={settings}/>
  </main>}
