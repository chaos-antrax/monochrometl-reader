export type ReaderTheme = "light" | "dark" | "system";
export type ReaderBackground =
  | "paper"
  | "white"
  | "warm"
  | "sepia"
  | "sage"
  | "mist"
  | "charcoal"
  | "black";
export type ReaderSettings = {
  theme: ReaderTheme;
  background: ReaderBackground;
  fontSize: number;
  lineHeight: number;
};
export type ReaderProgress = {
  userId: string;
  novelId: string;
  chapterId: string;
  chapterOrder: number;
  scrollProgress: number;
  updatedAt: Date;
};
