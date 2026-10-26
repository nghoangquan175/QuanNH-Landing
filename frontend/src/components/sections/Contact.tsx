import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Portfolio } from "@/types/portfolio";

export function Contact({ contact }: { contact: Portfolio["contact"] }) {
  return (
    <section id="contact" className="contact-glow relative overflow-hidden border-t border-line py-[110px] text-center">
      <Container className="relative">
        <p className="mb-[12px] font-mono text-[13px] text-accent">{contact.eyebrow}</p>
        <h2 className="mb-[40px] text-[80px] font-bold leading-[1.1] tracking-[-0.03em]">{contact.title}</h2>
        <div className="flex justify-center gap-[12px]">
          {contact.links.map((link) => (
            <Button key={link.href} href={link.href} variant={link.primary ? "primary" : "ghost"}>
              {link.label}
            </Button>
          ))}
        </div>
      </Container>
    </section>
  );
}
