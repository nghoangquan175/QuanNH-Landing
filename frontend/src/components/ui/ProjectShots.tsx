"use client";

import Image from "next/image";
import { useState } from "react";
import { useExpandableOpen } from "@/components/ui/Expandable";
import { cn } from "@/lib/cn";
import { SHOTS } from "@/lib/shots";

/**
 * Home-page captures inside a Selected Work card. Nothing is requested until the card is
 * first opened (or straight away when `eager`, on a case study page); after that they stay mounted. The intrinsic size keeps the space reserved
 * and the blur placeholder fills it, so the panel doesn't jump when the file arrives.
 */
export function ProjectShots({ slug, eager = false }: { slug: string; eager?: boolean }) {
  const open = useExpandableOpen() || eager;
  const [opened, setOpened] = useState(open);
  if (open && !opened) setOpened(true);

  const known = SHOTS[slug] ?? [];
  if (known.length === 0) return null;

  return (
    <div className={cn("mb-[16px] grid gap-[10px]", known.length > 1 && "768:grid-cols-2")}>
      {known.map(({ image, alt }) => {
        return (
          <div
            key={image.src}
            className="overflow-hidden rounded-[10px] border border-line bg-[var(--panel2)]"
            style={{ aspectRatio: `${image.width} / ${image.height}` }}
          >
            {opened && (
              <Image
                src={image}
                alt={alt}
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
