import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import type { Portfolio } from "@/types/portfolio";

type Props = {
  footer: Portfolio["footer"];
  site: Portfolio["site"];
  contact: Portfolio["contact"];
};

function Heading({ children }: { children: React.ReactNode }) {
  return <p className="mb-[14px] font-mono text-[11px] tracking-[0.1em] text-muted">{children}</p>;
}

const linkClass = "text-[14px] text-text opacity-80 transition-colors hover:text-accent hover:opacity-100";

export function Footer({ footer, site, contact }: Props) {
  return (
    <footer className="border-t border-line pt-[48px] 768:pt-[64px]">
      <Container>
        <div className="grid gap-[36px] 768:grid-cols-[2fr_1fr_1fr] 768:gap-[48px]">
          <div>
            <a href="#" className="inline-flex items-center gap-[10px] font-mono font-semibold">
              <Logo />
              <span>
                {site.logo}
                <span className="text-accent">{site.logoAccent}</span>
              </span>
            </a>
            <p className="mt-[16px] max-w-[340px] text-[14px] text-muted">{footer.tagline}</p>
            <p className="mt-[10px] font-mono text-[12px] text-muted">{footer.location}</p>
          </div>

          <nav aria-label="Footer">
            <Heading>NAVIGATE</Heading>
            <ul className="space-y-[8px]">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={linkClass}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <Heading>ELSEWHERE</Heading>
            <ul className="space-y-[8px]">
              <li>
                <a href={`mailto:${contact.email}`} className={linkClass}>
                  Email
                </a>
              </li>
              {contact.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {link.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-[48px] flex flex-col gap-[10px] border-t border-line py-[22px] font-mono text-[12px] text-muted 768:mt-[56px] 768:flex-row 768:items-center 768:justify-between">
          <p>© 2026 {footer.name}</p>
          <p>{footer.credit}</p>
          <a href="#" className="transition-colors hover:text-accent">
            Back to top ↑
          </a>
        </div>
      </Container>
    </footer>
  );
}
