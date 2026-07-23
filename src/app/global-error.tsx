'use client';
export default function GlobalError({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return <html lang='en'><body className='bg-background text-foreground'><main className='grid min-h-screen place-items-center px-6 text-center'><section><h1 className='font-serif text-4xl'>Monochrome is unavailable.</h1><p className='mt-4 font-sans text-sm'>A temporary error prevented the app from loading.</p><button onClick={unstable_retry} className='mt-8 border px-7 py-3 text-xs'>Try again</button></section></main></body></html>;
}
