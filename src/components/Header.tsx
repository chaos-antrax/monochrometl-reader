import Link from "next/link";
import { CircleUserRound } from "lucide-react";
import Button from "@/components/Button";
import MobileNav from "@/components/MobileNav";
import ThemeLogo from "@/components/ThemeLogo";
import { getCurrentUser } from "@/lib/auth";
const Header = async () => {
  const user = await getCurrentUser();
  return (
    <header className="sticky top-0 z-50 border-b border-foreground/[0.06] bg-background/75 backdrop-blur-3xl">
      <nav className="flex justify-between items-center font-lora p-4">
        <Link href="/" className="flex gap-4 items-center">
          <ThemeLogo />
          <p className="mt-1 hidden sm:block">Monochrome Translations</p>
        </Link>
        <div className="hidden md:flex gap-10 items-center text-sm px-4">
          <Button href="/novels">Browse</Button>
          {user && <Button href="/library">Library</Button>}
          {user ? (
            <Button href="/account" className="flex items-center gap-2">
              <CircleUserRound size={20} />
              <span>Account</span>
            </Button>
          ) : (
            <Button href="/signin">Sign In</Button>
          )}
        </div>
        <MobileNav user={user} />
      </nav>
    </header>
  );
};
export default Header;
