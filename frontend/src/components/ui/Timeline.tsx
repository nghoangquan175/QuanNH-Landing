import { cn } from "@/lib/cn";

type Item = { key: string; period: string; content: React.ReactNode };

// Alternate layout (1024 up): rail in the middle, cards zig-zag. Even entries put the card
// on the left and the period on the right of the rail; odd entries mirror that. Full class
// strings so Tailwind's static scanner sees every one.
const SIDES = {
  left: {
    dot: "1024:col-start-2",
    period: "1024:col-start-3 1024:text-left",
    card: "1024:col-start-1 1024:[--reveal-x:-16px]",
  },
  right: {
    dot: "1024:col-start-2",
    period: "1024:col-start-1 1024:text-right",
    card: "1024:col-start-3 1024:[--reveal-x:16px]",
  },
};

/**
 * Vertical timeline: a glowing rail with one dot per entry. From 768 up the period sits
 * in a left column beside the rail; below that it sits above the card. With `alternate`,
 * from 1024 up the rail moves to the centre and entries alternate sides. The rail itself
 * is drawn by `.timeline::before` in styles/includes/_timeline.scss so it can follow the
 * dot column at each breakpoint; styles/includes/_scroll.scss draws it down as the page
 * scrolls, and with `alternate` the cards slide in from their own side.
 */
export function Timeline({ items, alternate = false }: { items: Item[]; alternate?: boolean }) {
  return (
    <ol
      className={cn(
        "timeline relative flex flex-col gap-[18px] 768:gap-[22px]",
        alternate && "timeline--alternate",
      )}
    >
      {items.map((item, i) => {
        const side = alternate ? SIDES[i % 2 === 0 ? "left" : "right"] : null;
        return (
          <li
            key={item.key}
            className={cn(
              "grid grid-cols-[20px_1fr] items-start gap-x-[14px] gap-y-[8px] 768:grid-cols-[132px_24px_1fr] 768:gap-x-[20px]",
              alternate && "1024:grid-cols-[1fr_24px_1fr] 1024:gap-x-[28px]",
            )}
          >
            <span
              className={cn("timeline-dot col-start-1 row-start-1 mt-[4px] 768:col-start-2 768:mt-[26px]", side?.dot)}
              aria-hidden="true"
            />
            <p
              className={cn(
                "scroll-reveal col-start-2 row-start-1 font-mono text-[12px] tracking-[0.06em] text-muted 768:col-start-1 768:mt-[24px] 768:text-right",
                side?.period,
              )}
            >
              {item.period}
            </p>
            <div className={cn("scroll-reveal col-start-2 768:col-start-3 768:row-start-1", side?.card)}>{item.content}</div>
          </li>
        );
      })}
    </ol>
  );
}
