"use client";

import { useEffect, useState } from "react";

// Baked in by the Docker build (see deploy.yml); absent in local dev, where nothing renders.
const SHA = process.env.NEXT_PUBLIC_BUILD_SHA;
const BUILT_AT = process.env.NEXT_PUBLIC_BUILD_TIME;
const SOURCE_URL = process.env.NEXT_PUBLIC_SOURCE_URL;

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

function ago(from: Date, now: Date) {
  const seconds = (now.getTime() - from.getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, size] of UNITS) {
    if (seconds >= size) return rtf.format(-Math.floor(seconds / size), unit);
  }
  return "just now";
}

/**
 * "Deployed 3 hours ago · be0e773", the hash linking to its commit. Server HTML carries the
 * date in a fixed zone so it never disagrees with the client; once mounted it switches to
 * the relative form, refreshed every minute.
 */
export function DeployInfo() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = window.setInterval(tick, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!SHA || !BUILT_AT) return null;

  const builtAt = new Date(BUILT_AT);
  const date = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Ho_Chi_Minh", day: "numeric", month: "short", year: "numeric" }).format(builtAt);
  const short = SHA.slice(0, 7);

  return (
    <p>
      Deployed{" "}
      <time dateTime={BUILT_AT} title={date}>
        {now ? ago(builtAt, now) : `on ${date}`}
      </time>
      {" · "}
      {SOURCE_URL ? (
        <a href={`${SOURCE_URL}/commit/${SHA}`} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
          {short}
        </a>
      ) : (
        short
      )}
    </p>
  );
}
