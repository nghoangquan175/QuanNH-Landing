import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { themeInitScript } from "@/components/layout/ThemeToggle";
import "@/styles/globals.scss";

// next/font self-hosts these at build time, so the CSP's font-src 'self' still holds.
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "700", "800"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Nguyen Hoang Quan — Full-stack Developer",
  description: "Portfolio of Nguyen Hoang Quan, full-stack developer building production websites with Next.js, Strapi, NestJS and AWS.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans leading-[1.6] antialiased">{children}</body>
    </html>
  );
}
