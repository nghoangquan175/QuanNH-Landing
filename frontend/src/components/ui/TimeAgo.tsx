"use client";

import { useEffect, useState } from "react";

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
 * "2 minutes ago" for an ISO timestamp. Server HTML carries "on 27 Oct 2026" in a fixed
 * zone so it never disagrees with the client; once mounted it switches to the relative
 * form, refreshed every minute.
 */
export function TimeAgo({ iso }: { iso: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = window.setInterval(tick, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const at = new Date(iso);
  const date = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Ho_Chi_Minh", day: "numeric", month: "short", year: "numeric" }).format(at);

  return (
    <time dateTime={iso} title={date}>
      {now ? ago(at, now) : `on ${date}`}
    </time>
  );
}
