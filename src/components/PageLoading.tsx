export default function PageLoading({ label = 'Loading' }: { label?: string }) {
  return <main className='flex min-h-[65vh] items-center justify-center px-6'><div className='text-center'><span className='mx-auto block size-8 animate-spin border border-foreground/20 border-t-foreground' /><p className='mt-5 font-inter text-[10px] uppercase tracking-[0.22em] font-extralight'>{label}</p></div></main>;
}
