import { ArrowUpRight, BookText } from "lucide-react";
import Link from "next/link";

interface NovelCardProps {
  novel: {
    id: string;
    title: string;
    description: string;
    chapterCount: number;
  };
}

const NovelCard = ({ novel }: NovelCardProps) => {
  return (
    <Link
      key={novel.id}
      href={`/novels/${novel.id}`}
      className="bg-foreground/4 relative gap-10 flex items-center justify-center p-10"
    >
      <div className="hidden md:block">
        <BookText size={84} strokeWidth={0.1} />
      </div>
      <div className="flex flex-col gap-4">
        <p className="font-inter hidden text absolute items-center justify-center lg:flex gap-4 right-10 font-extralight">
          {novel.chapterCount}{" "}
          {novel.chapterCount === 1 ? "chapter" : "chapters"}
          <ArrowUpRight className="right-10 top-10" size={20} />
        </p>
        <h2 className="font-lora line-clamp-2 md:line-clamp-1 text-2xl">
          {novel.title}{" "}
          {/* <p className="hidden lg:block">
            {novel.chapterCount > 0 && `(${novel.chapterCount})`}
          </p> */}
        </h2>
        <p className="font-inter text-sm font-extralight line-clamp-5">
          {novel.description || "A published translation on Monochrome Reader."}
        </p>
      </div>
    </Link>
  );
};

export default NovelCard;
