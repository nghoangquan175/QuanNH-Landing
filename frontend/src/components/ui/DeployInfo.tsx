"use client";

import { useEffect, useState } from "react";

// Baked in by the Docker build (see deploy.yml); absent in local dev, where nothing renders.
const BUILT_AT = process.env.NEXT_PUBLIC_BUILD_TIME;

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
 * "Updated 2 minutes ago", from the time the site was built. Server HTML carries the date
 * in a fixed zone so it never disagrees with the client; once mounted it switches to the
 * relative form, refreshed every minute.
 */
export function DeployInfo() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = window.setInterval(tick, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!BUILT_AT) return null;

  const builtAt = new Date(BUILT_AT);
  const date = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Ho_Chi_Minh", day: "numeric", month: "short", year: "numeric" }).format(builtAt);

  return (
    <p>
      Updated{" "}
      <time dateTime={BUILT_AT} title={date}>
        {now ? ago(builtAt, now) : `on ${date}`}
      </time>
    </p>
  );
}
