import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import type { Portfolio } from "@/types/portfolio";

export function Nav({ site }: { site: Portfolio["site"] }) {
  return (
    <nav className="sticky top-0 z-10 border-b border-line bg-[var(--nav)] backdrop-blur-[12px]">
      <Container className="flex h-[64px] items-center justify-between">
        <a href="#" className="font-mono font-semibold">
          {site.logo}
          <span className="text-accent">{site.logoAccent}</span>
        </a>
        <ul className="flex gap-[28px] text-[14px] text-muted">
          {site.nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="transition-colors hover:text-text">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-[10px]">
          <ThemeToggle />
          <Button href={site.navCta.href} variant="ghost">
            {site.navCta.label}
          </Button>
        </div>
      </Container>
    </nav>
  );
}
