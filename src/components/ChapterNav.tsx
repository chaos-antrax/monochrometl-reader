import Button from "./Button";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { PublicChapterSummary } from "@/types/content";

interface ChapterNavProps {
  chapter: {
    previousChapter?: PublicChapterSummary;
    novelId: string;
    title: string;
    nextChapter?: PublicChapterSummary;
  };
}

const ChapterNav = ({ chapter }: ChapterNavProps) => {
  return (
    <nav className="flex items-center justify-between mt-6">
      {chapter.previousChapter ? (
        <Button
          btnType="block"
          href={`/novels/${chapter.novelId}/read/${chapter.previousChapter.id}`}
          className="flex gap-4 items-center max-w-md"
        >
          <ChevronLeft size={18} />
          <span>{chapter.previousChapter.title}</span>
        </Button>
      ) : (
        <span />
      )}
      {chapter.nextChapter && (
        <Button
          btnType="block"
          className="flex gap-4 items-center max-w-md"
          href={`/novels/${chapter.novelId}/read/${chapter.nextChapter.id}`}
        >
          <span>
            Next
            {chapter.nextChapter.title}
          </span>
          <ArrowRight size={18} />
        </Button>
      )}
    </nav>
  );
};

export default ChapterNav;
