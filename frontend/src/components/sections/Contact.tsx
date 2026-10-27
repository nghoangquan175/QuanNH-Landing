import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { LocalTime } from "@/components/ui/LocalTime";
import type { Portfolio } from "@/types/portfolio";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-[4px] border-b border-line py-[16px] 768:grid-cols-[120px_1fr] 768:items-baseline 768:gap-[20px]">
      <dt className="font-mono text-[12px] tracking-[0.08em] text-muted">{label}</dt>
      <dd className="min-w-0 text-[16px] 768:text-[17px]">{children}</dd>
    </div>
  );
}

export function Contact({ contact }: { contact: Portfolio["contact"] }) {
  return (
    <section
      id="contact"
      className="contact-glow relative overflow-hidden pb-[88px] pt-[48px] 768:pb-[110px] 768:pt-[64px] 1024:pb-[120px] 1024:pt-[72px]"
    >
      <Container className="relative grid gap-[40px] 1024:grid-cols-[1.1fr_1fr] 1024:gap-[72px]">
        <div>
          <p className="mb-[12px] font-mono text-[13px] text-accent">{contact.eyebrow}</p>
          <h2 className="text-[40px] font-bold leading-[1.05] tracking-[-0.03em] 768:text-[56px] 1024:text-[64px]">
            {contact.title}
          </h2>
          <p className="mt-[18px] max-w-[440px] text-[16px] text-muted">{contact.text}</p>
          <div className="mt-[28px]">
            <Button href={`mailto:${contact.email}`}>Email me</Button>
          </div>
        </div>

        <dl className="self-end border-t border-line">
          <Row label="EMAIL">
            <CopyEmail email={contact.email} />
          </Row>
          {contact.links.map((link) => (
            <Row key={link.href} label={link.label.toUpperCase()}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[4px] underline-offset-[4px] hover:text-accent hover:underline"
              >
                {link.value}
                <ArrowUpRight className="size-[15px]" aria-hidden="true" />
              </a>
            </Row>
          ))}
          <Row label="LOCATION">
            {contact.location} · <LocalTime timeZone={contact.timeZone} />
          </Row>
        </dl>
      </Container>
    </section>
  );
}
