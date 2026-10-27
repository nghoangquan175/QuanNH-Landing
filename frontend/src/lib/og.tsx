import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

// The site's own face. next/og takes TTF, not the WOFF2 that next/font serves, so these
// are copies kept for this; next.config.ts traces them into the standalone build.
const fontDir = join(process.cwd(), "src/assets/fonts");
const [regular, bold] = await Promise.all([readFile(join(fontDir, "Inter-400.ttf")), readFile(join(fontDir, "Inter-700.ttf"))]);

/**
 * The share card for every page: the site's dark palette, the wordmark, one eyebrow line,
 * a title and a line of supporting text. Rendered at build by next/og.
 */
export function ogImage({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#07080b",
          backgroundImage: "radial-gradient(circle at 78% 0%, rgba(124,245,196,0.16), rgba(7,8,11,0) 55%)",
          fontFamily: "Inter",
          color: "#e9ecf3",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
          QuanNH<span style={{ color: "#7cf5c4" }}>.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 24, letterSpacing: 4, color: "#7cf5c4" }}>{eyebrow}</div>
          <div style={{ marginTop: 18, fontSize: title.length > 28 ? 64 : 80, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }}>{title}</div>
          <div style={{ marginTop: 22, fontSize: 28, color: "#8a91a3", lineHeight: 1.4, maxWidth: 980 }}>{text}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#8a91a3" }}>
          <span>quannh.xyz</span>
          <span>Hanoi · GMT+7</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Inter", data: regular, weight: 400, style: "normal" },
        { name: "Inter", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
