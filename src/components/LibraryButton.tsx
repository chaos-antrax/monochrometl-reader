'use client';
import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import Button from './Button';
import { authenticatedFetch, responseError } from '@/lib/client-api';
import { notify } from '@/lib/toast';
export function LibraryButton({ novelId, initial, authenticated }: { novelId: string; initial: boolean; authenticated: boolean }) {
  const [saved, setSaved] = useState(initial); const [pending, setPending] = useState(false);
  async function toggle() {
    if (!authenticated) { location.href = `/signin?next=${encodeURIComponent(location.pathname)}`; return; }
    setPending(true);
    try {
      const next = !saved;
      const response = await authenticatedFetch(saved ? `/api/library/${novelId}` : '/api/library', { method: saved ? 'DELETE' : 'POST', headers: { 'content-type': 'application/json' }, body: saved ? undefined : JSON.stringify({ novelId }) });
      if (!response.ok) throw new Error(await responseError(response, 'Unable to update your library.'));
      setSaved(next); notify(next ? 'Added to your library.' : 'Removed from your library.', 'success');
    } catch (error) { notify(error instanceof Error ? error.message : 'Unable to update your library.', 'error'); }
    finally { setPending(false); }
  }
  return <Button btnType='block' className='flex items-center gap-2 text-sm max-w-fit' disabled={pending} onClick={toggle}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} />{pending ? 'Saving…' : saved ? 'In your library' : 'Add to library'}</Button>;
}
