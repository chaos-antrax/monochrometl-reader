import Image from 'next/image';

export default function ThemeLogo(){return <span className='relative block size-[50px] shrink-0' role='img' aria-label='Monochrome Translations'><Image src='/logo-black.png' alt='' width={50} height={50} priority className='theme-logo-light absolute inset-0'/><Image src='/logo-white.png' alt='' width={50} height={50} priority className='theme-logo-dark absolute inset-0'/></span>}
