import type { Metadata } from "next";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "Nguyen Hoang Quan — Full-stack Developer",
  description: "Portfolio of Nguyen Hoang Quan, full-stack developer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
