'use client';
import Link from 'next/link';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, CircleUserRound, Library, LogIn, Menu, UserPlus, X } from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';
import type { ReaderUser } from '@/types/user';
const subscribe = () => () => {};
export default function MobileNav({ user }: { user: ReaderUser | null }) {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const close = () => setOpen(false);
  useEffect(() => { if (!open) return; const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [open]);
  const links = user ? [
    { href: '/novels', label: 'Browse', icon: <BookOpen size={19} strokeWidth={1} /> },
    { href: '/library', label: 'Library', icon: <Library size={19} strokeWidth={1} /> },
    { href: '/account', label: 'Account', icon: <CircleUserRound size={19} strokeWidth={1} /> },
  ] : [
    { href: '/novels', label: 'Browse', icon: <BookOpen size={19} strokeWidth={1} /> },
    { href: '/signin', label: 'Sign In', icon: <LogIn size={19} strokeWidth={1} /> },
    { href: '/signup', label: 'Create Account', icon: <UserPlus size={19} strokeWidth={1} /> },
  ];
  const drawer = <><button aria-label='Close navigation menu' onClick={close} className='fixed inset-0 z-[60] bg-black/20 backdrop-blur-[2px] cursor-default' /><aside aria-label='Mobile navigation' className='fixed inset-y-0 right-0 z-[70] h-dvh w-[min(88vw,24rem)] bg-background/80 text-foreground shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden border-l border-foreground/10'><div className='flex items-center justify-between p-5 border-b border-foreground/10'><div><p className='font-inter text-[10px] uppercase tracking-[0.2em] font-extralight'>Navigation</p>{user && <p className='font-inter text-xs font-extralight mt-2 max-w-60 truncate'>{user.email}</p>}</div><button aria-label='Close navigation menu' onClick={close} className='size-10 grid place-items-center cursor-pointer'><X size={21} /></button></div><nav className='flex-1 overflow-y-auto p-4 font-lora'>{links.map((item) => <Link key={item.href} href={item.href} onClick={close} className='flex items-center justify-between border-b border-foreground/10 px-3 py-5 text-xl'><span>{item.label}</span>{item.icon}</Link>)}</nav>{user && <div className='p-4 border-t border-foreground/10'><LogoutButton variant='mobile' onLoggedOut={close} /></div>}</aside></>;
  return <div className='md:hidden'><button aria-label='Open navigation menu' aria-expanded={open} onClick={() => setOpen(true)} className='size-10 grid place-items-center cursor-pointer'><Menu size={22} /></button>{mounted && open ? createPortal(drawer, document.body) : null}</div>;
}
