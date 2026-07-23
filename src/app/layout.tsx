import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Lora } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ThemeProvider from "@/components/ThemeProvider";
import GlobalThemeToggle from "@/components/GlobalThemeToggle";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"] });
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Monochrome Translations", template: "%s | Monochrome Translations" },
  description: "Minimal platform dedicated for edited AI fan translations.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Monochrome Translations",
    title: "Monochrome Translations",
    description: "Minimal platform dedicated for edited AI fan translations.",
    url: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Header />
          {children}
          <GlobalThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
