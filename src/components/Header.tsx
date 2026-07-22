import Image from 'next/image';
import Button from './Button';
import { CircleUserRound } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';

const Header = async () => {
  const user=await getCurrentUser();
  return <nav className='flex justify-between items-center font-lora p-4 sticky top-0 z-50 backdrop-blur-3xl'>
    <Button href='/' className='flex gap-4 items-center'>
      <Image src='/logo-white.png' alt='Monochrome Translations Logo' width={50} height={50}/>
      <p className='mt-2 hidden sm:block'>Monochrome Translations</p>
    </Button>
    <div className='flex gap-6 md:gap-10 items-center text-sm px-2 md:px-4'>
      <Button href='/novels' className='hidden md:block'>Browse</Button>
      <Button href='/library' className='hidden md:block'>Library</Button>
      {user?<Button href='/account' className='flex items-center gap-2'><CircleUserRound size={20}/><span className='hidden sm:block'>Account</span></Button>:<Button href='/signin'>Sign In</Button>}
    </div>
  </nav>;
};
export default Header;
