type Item = { key: string; period: string; content: React.ReactNode };

/**
 * Vertical timeline: a glowing rail with one dot per entry. From 768 up the period sits
 * in a left column beside the rail; below that it sits above the card. The rail itself is
 * drawn by `.timeline::before` in styles/includes/_timeline.scss so it can follow the
 * dot column at each breakpoint.
 */
export function Timeline({ items }: { items: Item[] }) {
  return (
    <ol className="timeline relative flex flex-col gap-[18px] 768:gap-[22px]">
      {items.map((item) => (
        <li
          key={item.key}
          className="grid grid-cols-[20px_1fr] items-start gap-x-[14px] gap-y-[8px] 768:grid-cols-[132px_24px_1fr] 768:gap-x-[20px]"
        >
          <span className="timeline-dot col-start-1 row-start-1 mt-[4px] 768:col-start-2 768:mt-[26px]" aria-hidden="true" />
          <p className="col-start-2 row-start-1 font-mono text-[12px] tracking-[0.06em] text-muted 768:col-start-1 768:mt-[24px] 768:text-right">
            {item.period}
          </p>
          <div className="col-start-2 768:col-start-3 768:row-start-1">{item.content}</div>
        </li>
      ))}
    </ol>
  );
}
