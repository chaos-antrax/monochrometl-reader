'use client';
export default function ErrorPage({ error, unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return <main className='flex min-h-[65vh] items-center justify-center px-6'><section className='max-w-lg text-center'><p className='font-inter text-[10px] uppercase tracking-[0.22em] font-extralight'>Something went wrong</p><h1 className='mt-4 font-lora text-4xl'>The page could not be loaded.</h1><p className='mt-5 font-inter text-sm font-extralight leading-6'>{error.message || 'Please try again.'}</p><button onClick={unstable_retry} className='mt-8 border border-foreground/15 px-7 py-3 font-inter text-xs cursor-pointer'>Try again</button></section></main>;
}
