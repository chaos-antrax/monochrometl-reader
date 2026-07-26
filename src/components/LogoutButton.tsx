'use client';
import { useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import useAnimatedPresence from '@/hooks/useAnimatedPresence';
import { authenticatedFetch, responseError } from '@/lib/client-api';
import { notify } from '@/lib/toast';

const subscribe = () => () => {};
type Props = { variant?: 'account' | 'mobile'; onLoggedOut?: () => void };
export default function LogoutButton({ variant = 'account', onLoggedOut }: Props) {
  const router = useRouter();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const presence = useAnimatedPresence(confirming ? true : null);
  async function logout() {
    setPending(true);
    try {
      const response = await authenticatedFetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) throw new Error(await responseError(response, 'Unable to sign out.'));
      setConfirming(false);
      onLoggedOut?.();
      router.replace('/');
      router.refresh();
    } catch (error) { notify(error instanceof Error ? error.message : 'Unable to sign out.', 'error'); }
    finally { setPending(false); }
  }
  const trigger = <button onClick={() => setConfirming(true)} className={variant === 'mobile' ? 'w-full flex items-center justify-between p-4 font-inter text-sm font-light cursor-pointer bg-foreground/[0.05]' : 'flex w-full items-center justify-between border border-foreground/10 px-5 py-4 font-inter text-sm font-light cursor-pointer'}><span>Sign out</span><LogOut size={18} /></button>;
  const dialog = <div className='fixed inset-0 z-[100] grid place-items-center px-5'><button data-motion-state={presence.state} aria-label='Cancel sign out' onClick={() => !pending && setConfirming(false)} className='motion-overlay absolute inset-0 bg-black/45 backdrop-blur-sm cursor-default' /><section data-motion-state={presence.state} role='alertdialog' aria-modal='true' aria-labelledby='logout-title' aria-describedby='logout-description' className='motion-dialog relative z-10 w-full max-w-sm border border-foreground/15 bg-background text-foreground p-7 shadow-2xl'><p className='font-inter text-[10px] uppercase tracking-[0.2em] font-extralight'>Confirm action</p><h2 id='logout-title' className='font-lora text-3xl mt-3'>Sign out?</h2><p id='logout-description' className='font-inter text-sm font-extralight leading-6 mt-4'>You will need to sign in again to access your library and synchronized reading progress.</p><div className='grid grid-cols-2 gap-2 mt-8'><button autoFocus disabled={pending} onClick={() => setConfirming(false)} className='h-11 border border-foreground/15 font-inter text-xs cursor-pointer disabled:opacity-50'>Cancel</button><button disabled={pending} onClick={logout} className='h-11 bg-foreground text-background font-inter text-xs cursor-pointer disabled:opacity-50'>{pending ? 'Signing out…' : 'Sign out'}</button></div></section></div>;
  return <>{trigger}{mounted && presence.mounted ? createPortal(dialog, document.body) : null}</>;
}
