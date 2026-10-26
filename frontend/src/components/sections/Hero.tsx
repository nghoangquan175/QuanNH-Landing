import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Portfolio, Stat } from "@/types/portfolio";

// From 768 up: nine columns stepping down toward a glowing core — three stats on each
// side, two empty "near" steps beside the core. Below 768 the six stats sit in two rows
// of three (left side descending, right side ascending) and the core steps are hidden.
const OUTER_HEIGHTS = ["h-[100%]", "h-[80%]", "h-[60%]"];

function StatStep({ stat, height }: { stat: Stat; height: string }) {
  return (
    <div className={`stair ${height} flex flex-col p-[12px] text-left 1024:p-[16px]`}>
      <b className="text-[22px] leading-[1.3] 1024:text-[28px]">{stat.value}</b>
      <small className="text-[11px] leading-[1.4] text-muted 1024:text-[12px]">{stat.label}</small>
    </div>
  );
}

export function Hero({ hero }: { hero: Portfolio["hero"] }) {
  const left = hero.stats.slice(0, 3);
  const right = hero.stats.slice(3, 6);

  return (
    <header className="hero-glow relative overflow-hidden pt-[72px] text-center 768:pt-[100px] 1024:pt-[120px]">
      <Container className="relative z-[1]">
        <p className="glow-text font-mono text-[11px] tracking-[0.1em] text-accent 768:text-[13px]">{hero.tag}</p>
        <h1 className="my-[16px] text-[32px] font-extrabold leading-[1.1] tracking-[-0.04em] 768:my-[18px] 768:text-[64px] 768:leading-none 1024:text-[96px]">
          {hero.titleLines[0]}
          <br />
          <span className="gradient-title">{hero.titleLines[1]}</span>
        </h1>
        <p className="mx-auto mb-[28px] max-w-[560px] text-[15px] text-muted 768:mb-[32px] 768:text-[16px]">
          {hero.description}
        </p>
        <div className="flex flex-wrap justify-center gap-[12px]">
          <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
          <Button href={hero.secondaryCta.href} variant="ghost">
            {hero.secondaryCta.label}
          </Button>
        </div>

        <div className="mt-[56px] grid grid-cols-3 grid-rows-[150px_150px] items-end gap-[6px] 768:mt-[80px] 768:h-[260px] 768:grid-cols-9 768:grid-rows-1">
          {left.map((stat, i) => (
            <StatStep key={stat.label} stat={stat} height={OUTER_HEIGHTS[i]} />
          ))}
          <div className="stair stair--near hidden h-[40%] 768:block" />
          <div className="stair stair--core hidden h-[22%] 768:block" />
          <div className="stair stair--near hidden h-[40%] 768:block" />
          {right.map((stat, i) => (
            <StatStep key={stat.label} stat={stat} height={OUTER_HEIGHTS[2 - i]} />
          ))}
        </div>
      </Container>
    </header>
  );
}
