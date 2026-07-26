'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Clock3, MessageCircle, Pencil, Send, X } from 'lucide-react';
import { authenticatedFetch, responseError } from '@/lib/client-api';
import { notify } from '@/lib/toast';

type RequestItem = {
  id: string;
  type: 'translation' | 'contribution';
  novelTitle: string;
  description: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
};
type MessageItem = {
  id: string;
  senderRole: 'reader' | 'admin';
  body: string;
  createdAt: string;
};

export default function ContributePanel() {
  const [items, setItems] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [type, setType] = useState<RequestItem['type']>('translation');
  const [novelTitle, setNovelTitle] = useState('');
  const [description, setDescription] = useState('');
  const [openRequest, setOpenRequest] = useState<RequestItem | null>(null);
  const [editingRequest, setEditingRequest] = useState<RequestItem | null>(null);
  const pendingCount = items.filter((item) => item.status === 'pending').length;
  const requestLimitReached = pendingCount >= 3;

  const load = useCallback(async () => {
    const response = await authenticatedFetch('/api/contributions');
    if (!response.ok) throw new Error(await responseError(response, 'Unable to load requests.'));
    const result = await response.json();
    setItems(result.items);
  }, []);

  useEffect(() => {
    load()
      .catch((error) => notify(error instanceof Error ? error.message : 'Unable to load requests.', 'error'))
      .finally(() => setLoading(false));
  }, [load]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      const response = await authenticatedFetch('/api/contributions', {
        method: editingRequest ? 'PATCH' : 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...(editingRequest ? { id: editingRequest.id } : {}),
          type,
          novelTitle,
          description,
        }),
      });
      if (!response.ok) throw new Error(await responseError(response, editingRequest ? 'Unable to update request.' : 'Unable to send request.'));
      const wasEditing = Boolean(editingRequest);
      setEditingRequest(null);
      setNovelTitle('');
      setDescription('');
      await load();
      notify(wasEditing ? 'Request updated.' : 'Request sent for admin review.', 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Unable to send request.', 'error');
    } finally {
      setPending(false);
    }
  }

  function editRequest(item: RequestItem) {
    setEditingRequest(item);
    setType(item.type);
    setNovelTitle(item.novelTitle);
    setDescription(item.description);
  }

  function cancelEdit() {
    setEditingRequest(null);
    setType('translation');
    setNovelTitle('');
    setDescription('');
  }

  return (
    <section className="motion-content py-8 md:py-5">
      <div className="grid gap-10 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="order-2">
          <form onSubmit={submit} className="relative">
            <fieldset disabled={pending || (requestLimitReached && !editingRequest)} className="space-y-5 disabled:opacity-35">
            {editingRequest && (
              <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
                <p className="text-xs uppercase tracking-wider">Editing request</p>
                <button type="button" onClick={cancelEdit} className="flex items-center gap-1.5 text-xs opacity-65">
                  <X size={13} /> Cancel
                </button>
              </div>
            )}
            <fieldset>
              <legend className="text-xs uppercase tracking-widest font-extralight">Request type</legend>
              <div className="mt-3 grid grid-cols-2 border border-foreground/15 p-1">
                {(['translation', 'contribution'] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setType(value)}
                    className={`px-3 py-2.5 text-xs capitalize ${type === value ? 'bg-foreground text-background' : ''}`}
                  >
                    {value === 'translation' ? 'Translation request' : 'Contribution'}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="block">
              <span className="text-xs uppercase tracking-widest font-extralight">Novel title</span>
              <input
                required
                minLength={2}
                maxLength={160}
                value={novelTitle}
                onChange={(event) => setNovelTitle(event.target.value)}
                placeholder="Enter the title"
                className="mt-3 w-full border-b border-foreground/20 bg-transparent px-1 py-3 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest font-extralight">Description</span>
              <textarea
                required
                minLength={10}
                maxLength={4000}
                rows={5}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Share the details of your request or contribution."
                className="mt-3 w-full resize-y border border-foreground/15 bg-transparent p-3 text-sm leading-6"
              />
            </label>
            <button
              disabled={pending || (requestLimitReached && !editingRequest)}
              className="flex w-full items-center justify-center gap-2 bg-foreground px-5 py-3 text-xs uppercase tracking-wider text-background disabled:opacity-45"
            >
              <Send size={14} />
              {pending ? 'Saving…' : editingRequest ? 'Save changes' : 'Send request'}
            </button>
            </fieldset>
            {requestLimitReached && !editingRequest && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/70 p-6 text-center backdrop-blur-[2px]">
                <div className="max-w-xs border border-foreground/15 bg-background px-6 py-5">
                  <Clock3 className="mx-auto" size={20} strokeWidth={1.25} />
                  <p className="mt-3 font-lora text-lg">Request limit reached</p>
                  <p className="mt-2 text-xs font-extralight leading-5 opacity-65">
                    You already have three pending requests. This form will reopen after an admin accepts or declines one.
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
        <div className="order-1">
          <p className="font-inter text-xs uppercase tracking-[0.18em] font-extralight">Work with us</p>
          <h2 className="mt-2 font-lora text-3xl md:text-2xl">Contribute</h2>
          <p className="mt-3 max-w-xl font-inter text-sm font-extralight leading-6 opacity-70">
            Request a translation or tell the team how you would like to contribute. An admin will review it before opening a private chat.
          </p>
          <h3 className="mt-8 font-lora text-xl">Your requests</h3>
          <div className="mt-5 space-y-2">
            {loading ? (
              <RequestSkeleton />
            ) : items.length ? (
              items.map((item) => (
                <article key={item.id} className="border border-foreground/10 bg-foreground/3 p-5">
                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.16em] opacity-55">{item.type}</p>
                      <h4 className="mt-1 truncate font-lora text-lg">{item.novelTitle}</h4>
                    </div>
                    <Status status={item.status} />
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm font-extralight leading-6 opacity-70">{item.description}</p>
                  <div className="mt-4 flex items-end justify-between gap-4 border-t border-foreground/10 pt-3">
                    <p className="text-[10px] uppercase tracking-wider opacity-45">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                    {item.status === 'accepted' ? (
                      <button
                        onClick={() => setOpenRequest(item)}
                        className="flex items-center gap-2 border border-foreground/20 px-4 py-2 text-xs"
                      >
                        <MessageCircle size={14} /> Open chat
                      </button>
                    ) : item.status === 'pending' ? (
                      <button
                        onClick={() => editRequest(item)}
                        className="flex items-center gap-2 border border-foreground/20 px-4 py-2 text-xs"
                      >
                        <Pencil size={13} /> Edit
                      </button>
                    ) : (
                      <p className="text-xs font-extralight opacity-60">
                        Request declined
                      </p>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <p className="border-y border-foreground/10 py-14 text-center text-sm font-extralight opacity-55">
                You have not submitted a request yet.
              </p>
            )}
          </div>
        </div>
      </div>
      {openRequest && <ContributionChat request={openRequest} onClose={() => setOpenRequest(null)} />}
    </section>
  );
}

function Status({ status }: { status: RequestItem['status'] }) {
  const Icon = status === 'accepted' ? Check : status === 'rejected' ? X : Clock3;
  return (
    <span className="flex shrink-0 items-center gap-1.5 border border-foreground/15 px-2.5 py-1 text-[10px] uppercase tracking-wider">
      <Icon size={12} />
      {status === 'accepted' ? 'Chat open' : status}
    </span>
  );
}

function ContributionChat({ request, onClose }: { request: RequestItem; onClose: () => void }) {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const cursorRef = useRef<{ createdAt: string; id: string } | null>(null);
  const pollingRef = useRef(false);

  const loadMessages = useCallback(async (incremental = false) => {
    if (pollingRef.current) return;
    pollingRef.current = true;
    const cursor = incremental ? cursorRef.current : null;
    const query = cursor
      ? `?after=${encodeURIComponent(cursor.createdAt)}&afterId=${encodeURIComponent(cursor.id)}`
      : '';
    try {
    const response = await authenticatedFetch(`/api/contributions/${request.id}/messages${query}`);
    if (!response.ok) throw new Error(await responseError(response, 'Unable to load chat.'));
    const result = await response.json();
    const incoming = result.items as MessageItem[];
    if (incoming.length) {
      const latest = incoming[incoming.length - 1];
      cursorRef.current = { createdAt: latest.createdAt, id: latest.id };
    }
    setMessages((current) => {
      if (!incremental) return incoming;
      const known = new Set(current.map((message) => message.id));
      return [...current, ...incoming.filter((message) => !known.has(message.id))];
    });
    if (!incremental) setLoading(false);
    } finally {
      pollingRef.current = false;
    }
  }, [request.id]);

  useEffect(() => {
    loadMessages().catch((error) => {
      setLoading(false);
      notify(error instanceof Error ? error.message : 'Unable to load chat.', 'error');
    });
    const timer = window.setInterval(() => {
      loadMessages(true).catch(() => undefined);
    }, 10000);
    return () => window.clearInterval(timer);
  }, [loadMessages]);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (!body.trim()) return;
    setPending(true);
    try {
      const response = await authenticatedFetch(`/api/contributions/${request.id}/messages`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ body }),
      });
      if (!response.ok) throw new Error(await responseError(response, 'Unable to send message.'));
      setBody('');
      await loadMessages(true);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Unable to send message.', 'error');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="motion-overlay fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 backdrop-blur-sm md:items-center md:p-6" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="motion-dialog flex h-[82vh] w-full max-w-2xl flex-col bg-background md:h-[min(720px,85vh)] md:border md:border-foreground/15">
        <header className="flex items-center justify-between border-b border-foreground/10 p-5">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider opacity-50">Admin chat</p>
            <h3 className="truncate font-lora text-xl">{request.novelTitle}</h3>
          </div>
          <button onClick={onClose} aria-label="Close chat" className="p-2"><X size={20} /></button>
        </header>
        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {loading ? <RequestSkeleton /> : messages.length ? messages.map((message) => (
            <div key={message.id} className={`flex ${message.senderRole === 'reader' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[82%] px-4 py-3 ${message.senderRole === 'reader' ? 'bg-foreground text-background' : 'bg-foreground/7'}`}>
                <p className="text-[10px] uppercase tracking-wider opacity-55">{message.senderRole === 'reader' ? 'You' : 'Admin'}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{message.body}</p>
                <time className="mt-2 block text-[9px] opacity-45">{new Date(message.createdAt).toLocaleString()}</time>
              </div>
            </div>
          )) : <p className="py-16 text-center text-sm font-extralight opacity-55">The chat is open. Send the first message.</p>}
        </div>
        <form onSubmit={send} className="flex gap-2 border-t border-foreground/10 p-4">
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            maxLength={2000}
            rows={2}
            placeholder="Write a message…"
            className="min-w-0 flex-1 resize-none border border-foreground/15 bg-transparent p-3 text-sm"
          />
          <button disabled={pending || !body.trim()} aria-label="Send message" className="bg-foreground px-5 text-background disabled:opacity-40">
            <Send size={17} />
          </button>
        </form>
      </section>
    </div>
  );
}

function RequestSkeleton() {
  return (
    <div className="space-y-2" aria-label="Loading requests">
      {[0, 1].map((item) => (
        <div key={item} className="animate-pulse border border-foreground/10 p-5">
          <div className="h-3 w-24 bg-foreground/10" />
          <div className="mt-3 h-5 w-1/2 bg-foreground/10" />
          <div className="mt-5 h-3 w-full bg-foreground/7" />
          <div className="mt-2 h-3 w-4/5 bg-foreground/7" />
        </div>
      ))}
    </div>
  );
}
