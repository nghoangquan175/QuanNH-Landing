import { getPortfolio } from "@/lib/api/portfolio";
import { OG_SIZE, ogImage } from "@/lib/og";
import { SITE_TITLE } from "@/lib/site";

export const alt = SITE_TITLE;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const { hero } = await getPortfolio();
  return ogImage({ eyebrow: "FULL-STACK DEVELOPER · HANOI", title: "Nguyen Hoang Quan", text: hero.description });
}
