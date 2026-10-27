"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import flipTheVape from "@/assets/images/work/flip-the-vape.webp";
import hatchQuarter from "@/assets/images/work/hatch-quarter.webp";
import houseNine from "@/assets/images/work/house-nine.webp";
import johnHolland from "@/assets/images/work/john-holland.webp";
import nineAndFound from "@/assets/images/work/nine-and-found.webp";
import { useExpandableOpen } from "@/components/ui/Expandable";
import { cn } from "@/lib/cn";
import type { Project } from "@/types/portfolio";

// portfolio.json names a capture by key; the files are bundled so next/image can size them.
const IMAGES: Record<string, StaticImageData> = {
  "flip-the-vape": flipTheVape,
  "hatch-quarter": hatchQuarter,
  "house-nine": houseNine,
  "john-holland": johnHolland,
  "nine-and-found": nineAndFound,
};

/**
 * Home-page captures inside a Selected Work card. Nothing is requested until the card is
 * first opened (or straight away when `eager`, on a case study page); after that they stay mounted. The intrinsic size keeps the space reserved
 * and the blur placeholder fills it, so the panel doesn't jump when the file arrives.
 */
export function ProjectShots({ shots, eager = false }: { shots: NonNullable<Project["screenshots"]>; eager?: boolean }) {
  const open = useExpandableOpen() || eager;
  const [opened, setOpened] = useState(open);
  if (open && !opened) setOpened(true);

  const known = shots.filter((shot) => IMAGES[shot.image]);
  if (known.length === 0) return null;

  return (
    <div className={cn("mb-[16px] grid gap-[10px]", known.length > 1 && "768:grid-cols-2")}>
      {known.map((shot) => {
        const image = IMAGES[shot.image];
        return (
          <div
            key={shot.image}
            className="overflow-hidden rounded-[10px] border border-line bg-[var(--panel2)]"
            style={{ aspectRatio: `${image.width} / ${image.height}` }}
          >
            {opened && (
              <Image
                src={image}
                alt={shot.alt}
                placeholder="blur"
                sizes={known.length > 1 ? "(min-width: 1280px) 430px, (min-width: 768px) 45vw, 90vw" : "(min-width: 1280px) 880px, 90vw"}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
