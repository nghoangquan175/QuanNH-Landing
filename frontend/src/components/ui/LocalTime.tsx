"use client";

import { useEffect, useState } from "react";

type Props = {
  timeZone: string;
  /** Append the UTC offset, e.g. "GMT+7". */
  showOffset?: boolean;
  /** Shown until mounted (and without JS). */
  fallback?: string;
};

/**
 * Current time in `timeZone`, refreshed every 20 s. Renders a placeholder until mounted so
 * the server-rendered HTML never disagrees with the visitor's clock.
 */
export function LocalTime({ timeZone, showOffset = true, fallback = "--:--" }: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = window.setInterval(tick, 20_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!now) return <span className="tabular-nums">{fallback}</span>;

  const time = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" }).format(now);
  const offset =
    showOffset &&
    new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "shortOffset" })
    .formatToParts(now)
    .find((part) => part.type === "timeZoneName")?.value;

  return (
    <span className="tabular-nums">
      {time}
      {offset && <span className="text-muted"> {offset}</span>}
    </span>
  );
}
