import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClickEffects } from "@/components/layout/ClickEffects";
import { CustomScrollbar } from "@/components/layout/CustomScrollbar";
import { Intro, introInitScript } from "@/components/layout/Intro";
import { themeInitScript } from "@/components/layout/ThemeToggle";
import "@/styles/globals.scss";

// next/font self-hosts these at build time, so the CSP's font-src 'self' still holds.
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "700", "800"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Nguyen Hoang Quan — Full-stack Developer",
  description: "Portfolio of Nguyen Hoang Quan, a full-stack developer in Hanoi building and looking after production websites for international clients.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-scroll-behavior: Next turns the smooth scrolling off while it jumps to the top of
    // a new page, so a route change doesn't glide down from where the last page was.
    <html lang="en" className={`${inter.variable} ${mono.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Theme first: the intro picks its variant from data-theme. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: introInitScript }} />
      </head>
      <body className="font-sans leading-[1.6] antialiased">
        <Intro />
        <ClickEffects />
        <CustomScrollbar />
        {children}
      </body>
    </html>
  );
}
