import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { getCurrentUser } from '@/lib/auth';
export const metadata:Metadata={title:'Sign up | Monochrome Translations'};
export default async function SignUp(){if(await getCurrentUser())redirect('/account');return <main className='px-10 md:px-24 xl:px-36 pb-20'><p className='font-inter text-xs uppercase tracking-[0.22em] font-extralight mt-16 md:mt-24'>Your next story awaits</p><h1 className='text-6xl md:text-7xl font-lora mt-4'>Sign Up</h1><p className='font-inter font-extralight text-sm mt-5 max-w-md'>Create an account to build a library and keep your reading progress in sync.</p><AuthForm mode='signup'/></main>}
