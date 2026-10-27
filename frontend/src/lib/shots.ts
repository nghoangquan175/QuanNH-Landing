import type { StaticImageData } from "next/image";
import flipTheVape from "@/assets/images/work/flip-the-vape.webp";
import hatchQuarter from "@/assets/images/work/hatch-quarter.webp";
import houseNine from "@/assets/images/work/house-nine.webp";
import johnHolland from "@/assets/images/work/john-holland.webp";
import nineAndFound from "@/assets/images/work/nine-and-found.webp";

type Shot = { image: StaticImageData; alt: string };

// Captures of each project's live site, by project slug. They are bundled rather than
// CMS uploads so next/image knows their size and blur placeholder at build time.
export const SHOTS: Record<string, Shot[]> = {
  "john-holland": [{ image: johnHolland, alt: "Home page of johnholland.com.au" }],
  "house-nine": [
    { image: houseNine, alt: "Home page of housenine.co.uk" },
    { image: nineAndFound, alt: "Home page of nineandfound.com" },
  ],
  "flip-the-vape": [{ image: flipTheVape, alt: "Home page of flipthevape.com" }],
  "hatch-quarter": [{ image: hatchQuarter, alt: "Home page of hatchquarter.com.au" }],
};

export function hasShots(slug: string) {
  return slug in SHOTS;
}
