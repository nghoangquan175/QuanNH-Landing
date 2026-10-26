"use client";

import { useEffect, useState } from "react";

/**
 * Current time in `timeZone`, refreshed every 20 s. Renders a placeholder until mounted so
 * the server-rendered HTML never disagrees with the visitor's clock.
 */
export function LocalTime({ timeZone }: { timeZone: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = window.setInterval(tick, 20_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!now) return <span className="tabular-nums">--:--</span>;

  const time = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" }).format(now);
  const offset = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "shortOffset" })
    .formatToParts(now)
    .find((part) => part.type === "timeZoneName")?.value;

  return (
    <span className="tabular-nums">
      {time}
      {offset && <span className="text-muted"> {offset}</span>}
    </span>
  );
}
