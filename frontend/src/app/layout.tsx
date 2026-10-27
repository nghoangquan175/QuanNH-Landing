import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClickEffects } from "@/components/layout/ClickEffects";
import { CustomScrollbar } from "@/components/layout/CustomScrollbar";
import { Intro, introInitScript } from "@/components/layout/Intro";
import { themeInitScript } from "@/components/layout/ThemeToggle";
import { IS_INDEXABLE, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
import "@/styles/globals.scss";

// next/font self-hosts these at build time, so the CSP's font-src 'self' still holds.
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "700", "800"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US" },
  twitter: { card: "summary_large_image" },
  // robots.txt only stops crawling; this (and the X-Robots-Tag header) stops indexing.
  ...(IS_INDEXABLE ? {} : { robots: { index: false, follow: false } }),
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
