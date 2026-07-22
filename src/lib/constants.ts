import type { ReaderSettings } from "@/types/reader";
export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  theme: "system",
  background: "paper",
  fontSize: 18,
  lineHeight: 1.7,
};
export const READER_SETTINGS_STORAGE_KEY = "monochrome-reader-settings";
