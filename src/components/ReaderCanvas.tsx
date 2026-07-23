"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  List,
  Settings2,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import type { PublicChapter, PublicChapterSummary } from "@/types/content";
import type {
  ReaderBackground,
  ReaderSettings,
  ReaderTheme,
} from "@/types/reader";
import { READER_SETTINGS_STORAGE_KEY } from "@/lib/constants";
import useAnimatedPresence from "@/hooks/useAnimatedPresence";

const backgrounds: {
  id: ReaderBackground;
  label: string;
  light: string;
  dark: string;
}[] = [
  { id: "paper", label: "Paper", light: "#f7f4ed", dark: "#1d1c1a" },
  { id: "white", label: "White", light: "#ffffff", dark: "#111111" },
  { id: "warm", label: "Warm", light: "#fbf1df", dark: "#211b14" },
  { id: "sepia", label: "Sepia", light: "#efe0c8", dark: "#251d15" },
  { id: "sage", label: "Sage", light: "#eef3ea", dark: "#151d16" },
  { id: "mist", label: "Mist", light: "#eef2f5", dark: "#14181c" },
  { id: "charcoal", label: "Charcoal", light: "#e9e9e6", dark: "#202020" },
  { id: "black", label: "Black", light: "#f4f4f4", dark: "#050505" },
];
const fontSizes = [15, 16, 17, 18, 19, 20, 22, 24, 26];
const lineHeights = [1.4, 1.55, 1.7, 1.85, 2];

function ChapterNavigation({ chapter }: { chapter: PublicChapter }) {
  return (
    <nav
      aria-label="Chapter navigation"
      className="flex justify-end sm:justify-between items-center gap-2 py-5"
    >
      {chapter.previousChapter ? (
        <Link
          aria-label={`Previous chapter: ${chapter.previousChapter.title}`}
          href={`/novels/${chapter.novelId}/read/${chapter.previousChapter.id}`}
          className="inline-flex min-h-10 items-center gap-3 border border-current/15 px-3 sm:px-4 font-inter text-xs font-light"
        >
          <ChevronLeft size={18} />
          <span className="hidden sm:inline max-w-56 truncate">
            {chapter.previousChapter.title}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {chapter.nextChapter ? (
        <Link
          aria-label={`Next chapter: ${chapter.nextChapter.title}`}
          href={`/novels/${chapter.novelId}/read/${chapter.nextChapter.id}`}
          className="inline-flex min-h-10 items-center gap-3 border border-current/15 px-3 sm:px-4 font-inter text-xs font-light"
        >
          <span className="hidden sm:inline max-w-56 truncate">
            {chapter.nextChapter.title}
          </span>
          <ChevronRight size={18} />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

type Props = {
  chapter: PublicChapter;
  chapters: PublicChapterSummary[];
  initialSettings: ReaderSettings;
  authenticated: boolean;
  initialScrollProgress: number;
};

export default function ReaderCanvas({
  chapter,
  chapters,
  initialSettings,
  authenticated,
  initialScrollProgress,
}: Props) {
  const [settings, setSettings] = useState<ReaderSettings>(initialSettings);
  const [localReady, setLocalReady] = useState(authenticated);
  const [panel, setPanel] = useState<"settings" | "chapters" | null>(null);
  const panelPresence = useAnimatedPresence(panel);
  const hydrated = useRef(false);
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const palette =
    backgrounds.find((item) => item.id === settings.background) ??
    backgrounds[0];
  const canvasBackground = dark ? palette.dark : palette.light;
  const canvasText = dark ? "#edeae3" : "#211f1b";

  useEffect(() => {
    if (authenticated) return;
    const timer = setTimeout(() => {
      const saved = localStorage.getItem(READER_SETTINGS_STORAGE_KEY);
      if (saved)
        try {
          setSettings(JSON.parse(saved));
        } catch {}
      setLocalReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, [authenticated]);
  useEffect(() => {
    const sync = (event: Event) => {
      const theme = (event as CustomEvent<ReaderTheme>).detail;
      if (theme) setSettings((current) => ({ ...current, theme }));
    };
    window.addEventListener("monochrome-theme-change", sync);
    return () => window.removeEventListener("monochrome-theme-change", sync);
  }, []);
  useEffect(() => {
    setTheme(settings.theme);
  }, [settings.theme, setTheme]);
  useEffect(() => {
    if (!localReady) return;
    localStorage.setItem(READER_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    if (!authenticated) return;
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    const timer = setTimeout(() => {
      fetch("/api/settings", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(settings),
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [settings, authenticated, localReady]);
  useEffect(() => {
    if (initialScrollProgress <= 0) return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => {
        const height = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo({ top: height * initialScrollProgress, behavior: 'instant' });
      });
    });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [initialScrollProgress]);
  useEffect(() => {
    if (!authenticated) return;
    let timer: ReturnType<typeof setTimeout>;
    const send = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = height > 0 ? window.scrollY / height : 1;
      fetch(`/api/progress/${chapter.novelId}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ chapterId: chapter.id, chapterOrder: chapter.order, scrollProgress }), keepalive: true });
    };
    const schedule = () => { clearTimeout(timer); timer = setTimeout(send, 700); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('pagehide', send);
    schedule();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('pagehide', send);
      clearTimeout(timer);
      send();
    };
  }, [authenticated, chapter.id, chapter.novelId, chapter.order]);
  const update = <K extends keyof ReaderSettings>(
    key: K,
    value: ReaderSettings[K],
  ) => setSettings((current) => ({ ...current, [key]: value }));
  const paragraphs = chapter.text
    .split(/\n\s*\n/)
    .filter((item) => item.trim());

  return (
    <main
      className="relative min-h-screen transition-colors duration-300"
      style={{ background: canvasBackground, color: canvasText }}
    >
      <div className="mx-auto max-w-4xl px-5 sm:px-10 pb-20">
        {/* <div className="flex items-center justify-between pt-6 font-inter text-xs font-light opacity-65">
          <Link
            href={`/novels/${chapter.novelId}`}
            className="inline-flex items-center gap-2"
          >
            <BookOpen size={15} />
            <span className="hidden sm:inline">{chapter.novelTitle}</span>
          </Link>
          <span>Chapter {chapter.order}</span>
        </div> */}
        <ChapterNavigation chapter={chapter} />
        <header className="border-y border-current/10 py-10 sm:py-14 text-center">
          <p className="font-inter text-[10px] uppercase tracking-[0.22em] font-light opacity-55">
            {chapter.novelTitle}
          </p>
          <h1 className="font-lora text-3xl sm:text-4xl mt-4 leading-tight">
            {chapter.title}
          </h1>
        </header>
        <article
          className="font-lora mx-auto max-w-3xl py-12 sm:py-16 whitespace-pre-wrap"
          style={{
            fontSize: settings.fontSize,
            lineHeight: settings.lineHeight,
          }}
        >
          {paragraphs.map((paragraph, index) => (
            <p className="mb-[1.25em] last:mb-0" key={index}>
              {paragraph.trim()}
            </p>
          ))}
        </article>
        <div className="border-t border-current/10">
          <ChapterNavigation chapter={chapter} />
        </div>
      </div>

      <div className="fixed right-4 sm:right-7 bottom-5 sm:bottom-7 z-40 flex flex-col gap-2">
        <button
          aria-label="Choose chapter"
          title="Choose chapter"
          onClick={() => setPanel(panel === "chapters" ? null : "chapters")}
          className="size-11 grid place-items-center border border-current/15 bg-inherit shadow-lg backdrop-blur cursor-pointer"
        >
          <List size={19} />
        </button>
        <button
          aria-label="Reader settings"
          title="Reader settings"
          onClick={() => setPanel(panel === "settings" ? null : "settings")}
          className="size-11 grid place-items-center border border-current/15 bg-inherit shadow-lg backdrop-blur cursor-pointer"
        >
          <Settings2 size={19} />
        </button>
      </div>

      {panelPresence.mounted && (
        <button
          data-motion-state={panelPresence.state}
          aria-label="Close reader panel"
          onClick={() => setPanel(null)}
          className="motion-overlay fixed inset-0 z-40 bg-black/30 cursor-default"
        />
      )}
      {panelPresence.value === "chapters" && (
        <aside
          data-motion-state={panelPresence.state}
          aria-label="Chapter selector"
          className="motion-drawer fixed z-50 inset-y-0 right-0 w-[min(92vw,26rem)] shadow-2xl flex flex-col"
          style={{ background: canvasBackground, color: canvasText }}
        >
          <div className="flex items-start justify-between p-6 border-b border-current/10">
            <div>
              <p className="font-inter text-[10px] uppercase tracking-[0.2em] opacity-55">
                Jump to
              </p>
              <h2 className="font-lora text-2xl mt-2">Chapters</h2>
            </div>
            <button
              aria-label="Close chapter selector"
              onClick={() => setPanel(null)}
              className="p-2 cursor-pointer"
            >
              <X size={19} />
            </button>
          </div>
          <div className="overflow-y-auto p-3">
            {chapters.map((item) => (
              <Link
                key={item.id}
                href={`/novels/${chapter.novelId}/read/${item.id}`}
                onClick={() => setPanel(null)}
                className={`grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 px-3 py-4 border-b border-current/8 font-inter text-sm ${item.id === chapter.id ? "bg-current/8" : ""}`}
              >
                <span className="text-xs opacity-45 tabular-nums">
                  {String(item.order).padStart(2, "0")}
                </span>
                <span className="truncate font-light">{item.title}</span>
                {item.id === chapter.id && <Check size={15} />}
              </Link>
            ))}
          </div>
        </aside>
      )}
      {panelPresence.value === "settings" && (
        <aside
          data-motion-state={panelPresence.state}
          aria-label="Reader settings"
          className="motion-drawer fixed z-50 inset-y-0 right-0 w-[min(92vw,26rem)] shadow-2xl overflow-y-auto"
          style={{ background: canvasBackground, color: canvasText }}
        >
          <div className="flex items-start justify-between p-6 border-b border-current/10">
            <div>
              <p className="font-inter text-[10px] uppercase tracking-[0.2em] opacity-55">
                Reading canvas
              </p>
              <h2 className="font-lora text-2xl mt-2">Preferences</h2>
            </div>
            <button
              aria-label="Close reader settings"
              onClick={() => setPanel(null)}
              className="p-2 cursor-pointer"
            >
              <X size={19} />
            </button>
          </div>
          <div className="p-6 space-y-8 font-inter">
            <SettingGroup label="Theme">
              <div className="grid grid-cols-3 gap-1 border border-current/15 p-1">
                {(["light", "dark", "system"] as ReaderTheme[]).map((value) => (
                  <button
                    key={value}
                    onClick={() => update("theme", value)}
                    className="py-2 text-xs capitalize cursor-pointer"
                    style={
                      settings.theme === value
                        ? { background: canvasText, color: canvasBackground }
                        : undefined
                    }
                  >
                    {value}
                  </button>
                ))}
              </div>
            </SettingGroup>
            <SettingGroup label="Background">
              <div className="grid grid-cols-4 gap-3">
                {backgrounds.map((item) => (
                  <button
                    key={item.id}
                    title={item.label}
                    aria-label={item.label}
                    onClick={() => update("background", item.id)}
                    className="cursor-pointer"
                  >
                    <span
                      className={`block h-10 border ${settings.background === item.id ? "ring-1 ring-current ring-offset-2" : ""}`}
                      style={{ background: dark ? item.dark : item.light }}
                    />
                    <span className="block text-[10px] mt-2">{item.label}</span>
                  </button>
                ))}
              </div>
            </SettingGroup>
            <SettingGroup label={`Type size · ${settings.fontSize}px`}>
              <div className="flex flex-wrap gap-2">
                {fontSizes.map((value) => (
                  <button
                    key={value}
                    onClick={() => update("fontSize", value)}
                    className="size-9 border border-current/15 text-xs cursor-pointer"
                    style={
                      settings.fontSize === value
                        ? { background: canvasText, color: canvasBackground }
                        : undefined
                    }
                  >
                    {value}
                  </button>
                ))}
              </div>
            </SettingGroup>
            <SettingGroup label={`Line spacing · ${settings.lineHeight}`}>
              <div className="grid grid-cols-5 gap-2">
                {lineHeights.map((value) => (
                  <button
                    key={value}
                    onClick={() => update("lineHeight", value)}
                    className="h-9 border border-current/15 text-xs cursor-pointer"
                    style={
                      settings.lineHeight === value
                        ? { background: canvasText, color: canvasBackground }
                        : undefined
                    }
                  >
                    {value}
                  </button>
                ))}
              </div>
            </SettingGroup>
            <p className="text-[11px] leading-5 opacity-55">
              {authenticated
                ? "Preferences save automatically to your account."
                : "Preferences are saved on this device. Sign in to sync them."}
            </p>
          </div>
        </aside>
      )}
    </main>
  );
}

function SettingGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-xs uppercase tracking-[0.16em] font-light mb-4">
        {label}
      </h3>
      {children}
    </section>
  );
}
