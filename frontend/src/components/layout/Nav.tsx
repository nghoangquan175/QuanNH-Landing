import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { NavLinks } from "@/components/layout/NavLinks";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import type { Portfolio } from "@/types/portfolio";

export function Nav({ site, contact }: { site: Portfolio["site"]; contact: Portfolio["contact"] }) {
  return (
    <nav className="reveal sticky top-0 z-10 border-b border-line bg-[var(--nav)] backdrop-blur-[12px]">
      <Container className="flex h-[64px] items-center justify-between">
        <a href="#" aria-label={`${site.logo} — back to top`} className="text-[22px] font-bold tracking-[-0.03em]">
          {site.logo}
          <span className="text-accent">{site.logoAccent}</span>
        </a>
        <NavLinks items={site.nav} />
        <div className="flex items-center gap-[10px]">
          <CommandPalette nav={site.nav} contact={contact} />
          <ThemeToggle />
          <Button href={site.navCta.href} variant="ghost">
            {site.navCta.label}
          </Button>
        </div>
      </Container>
    </nav>
  );
}
