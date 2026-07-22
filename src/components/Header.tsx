import Image from "next/image";
import React from "react";
import Button from "./Button";
import { Sun, Moon } from "lucide-react";

const Header = () => {
  return (
    <nav className="flex justify-between items-center font-lora p-4">
      <div>
        <Button href="/" className="flex gap-4 items-center text">
          <Image
            src="/logo-white.png"
            alt="Monochrome Translations Logo"
            width={50}
            height={50}
          />
          <p className="mt-2">Monochrome Translations</p>
        </Button>
      </div>
      <div className="flex gap-10 text-sm px-4">
        <Button href="/novels" className="hidden md:block">
          Browse
        </Button>
        <Button href="/library" className="hidden md:block">
          Library
        </Button>
        <Button>
          <Sun size={20} />
        </Button>
      </div>
    </nav>
  );
};

export default Header;
