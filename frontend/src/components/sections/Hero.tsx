import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Portfolio, Stat } from "@/types/portfolio";

// Nine columns stepping down toward a glowing core: three stats on each side, two
// empty "near" steps beside the core.
const OUTER_HEIGHTS = ["h-[100%]", "h-[80%]", "h-[60%]"];

function StatStep({ stat, height }: { stat: Stat; height: string }) {
  return (
    <div className={`stair ${height} flex flex-col p-[16px] text-left`}>
      <b className="text-[28px] leading-[1.3]">{stat.value}</b>
      <small className="text-[12px] text-muted">{stat.label}</small>
    </div>
  );
}

export function Hero({ hero }: { hero: Portfolio["hero"] }) {
  const left = hero.stats.slice(0, 3);
  const right = hero.stats.slice(3, 6);

  return (
    <header className="hero-glow relative overflow-hidden pt-[120px] text-center">
      <Container className="relative z-[1]">
        <p className="glow-text font-mono text-[13px] tracking-[0.1em] text-accent">{hero.tag}</p>
        <h1 className="my-[18px] text-[96px] font-extrabold leading-none tracking-[-0.04em]">
          {hero.titleLines[0]}
          <br />
          <span className="gradient-title">{hero.titleLines[1]}</span>
        </h1>
        <p className="mx-auto mb-[32px] max-w-[560px] text-muted">{hero.description}</p>
        <div className="flex justify-center gap-[12px]">
          <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
          <Button href={hero.secondaryCta.href} variant="ghost">
            {hero.secondaryCta.label}
          </Button>
        </div>

        <div className="mt-[80px] grid h-[260px] grid-cols-9 items-end gap-[6px]">
          {left.map((stat, i) => (
            <StatStep key={stat.label} stat={stat} height={OUTER_HEIGHTS[i]} />
          ))}
          <div className="stair stair--near h-[40%]" />
          <div className="stair stair--core h-[22%]" />
          <div className="stair stair--near h-[40%]" />
          {right.map((stat, i) => (
            <StatStep key={stat.label} stat={stat} height={OUTER_HEIGHTS[2 - i]} />
          ))}
        </div>
      </Container>
    </header>
  );
}
