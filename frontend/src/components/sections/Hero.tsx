import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Portfolio, Stat } from "@/types/portfolio";

// From 1024 up: nine columns — four stats stepping down on each side of a glowing core.
// Below that the eight stats sit in two rows of four (each row a shallow V) and the core
// is hidden, so text values like "Node.js" keep room to breathe. From 1280 up the hero fills
// the viewport below the nav and the stairs flex to fit, so their base sits on the fold.
const HEIGHTS = ["h-[100%]", "h-[82%]", "h-[64%]", "h-[46%]"];

function StatStep({ stat, height }: { stat: Stat; height: string }) {
  return (
    <div className={`stair ${height} flex min-w-0 flex-col p-[10px] text-left 1024:p-[14px]`}>
      <b className="text-[17px] leading-[1.25] tracking-[-0.01em] 768:text-[20px] 1024:text-[22px]">{stat.value}</b>
      <small className="mt-[2px] text-[10.5px] leading-[1.35] text-muted 768:text-[11px] 1024:text-[12px]">{stat.label}</small>
    </div>
  );
}

export function Hero({ hero }: { hero: Portfolio["hero"] }) {
  const left = hero.stats.slice(0, 4);
  const right = hero.stats.slice(4, 8);

  return (
    <header className="hero-glow relative overflow-hidden pt-[72px] text-center 768:pt-[100px] 1024:pt-[120px] 1280:flex 1280:h-[calc(100svh-65px)] 1280:min-h-[680px] 1280:flex-col 1280:pt-[clamp(48px,7vh,120px)]">
      <Container className="relative z-[1] 1280:flex 1280:min-h-0 1280:w-full 1280:flex-1 1280:flex-col">
        <p style={{ "--reveal-i": 0 } as React.CSSProperties} className="reveal glow-text font-mono text-[11px] tracking-[0.1em] text-accent 768:text-[13px]">{hero.tag}</p>
        <h1 style={{ "--reveal-i": 1 } as React.CSSProperties} className="reveal my-[16px] text-[32px] font-extrabold leading-[1.1] tracking-[-0.04em] 768:my-[18px] 768:text-[64px] 768:leading-none 1024:text-[96px]">
          {hero.titleLines[0]}
          <br />
          <span className="gradient-title">{hero.titleLines[1]}</span>
        </h1>
        <p style={{ "--reveal-i": 2 } as React.CSSProperties} className="reveal mx-auto mb-[28px] max-w-[560px] text-[15px] text-muted 768:mb-[32px] 768:text-[16px]">
          {hero.description}
        </p>
        <div style={{ "--reveal-i": 3 } as React.CSSProperties} className="reveal flex flex-wrap justify-center gap-[12px] 1280:mb-[clamp(40px,6vh,80px)]">
          <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
          <Button href={hero.secondaryCta.href} variant="ghost">
            {hero.secondaryCta.label}
          </Button>
        </div>

        <div style={{ "--reveal-i": 4 } as React.CSSProperties} className="reveal mt-[56px] grid grid-cols-4 grid-rows-[140px_140px] items-end gap-[6px] 768:mt-[72px] 768:grid-rows-[160px_160px] 1024:mt-[80px] 1024:h-[260px] 1024:grid-cols-9 1024:grid-rows-1 1280:mt-auto 1280:h-auto 1280:max-h-[380px] 1280:min-h-[180px] 1280:flex-1">
          {left.map((stat, i) => (
            <StatStep key={stat.label} stat={stat} height={HEIGHTS[i]} />
          ))}
          <div className="stair stair--core hidden h-[22%] 1024:block" />
          {right.map((stat, i) => (
            <StatStep key={stat.label} stat={stat} height={HEIGHTS[3 - i]} />
          ))}
        </div>
      </Container>
    </header>
  );
}
