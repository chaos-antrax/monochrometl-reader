'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut } from 'lucide-react';
export default function LogoutButton(){const router=useRouter();const[pending,setPending]=useState(false);async function logout(){setPending(true);try{await fetch('/api/auth/logout',{method:'POST'})}finally{router.replace('/');router.refresh()}}return <button onClick={logout} disabled={pending} className='flex w-full items-center justify-between border border-foreground/10 px-5 py-4 font-inter text-sm font-light cursor-pointer disabled:opacity-50'><span>{pending?'Signing out…':'Sign out'}</span><LogOut size={18}/></button>}
