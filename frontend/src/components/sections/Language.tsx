import ieltsCertificate from "@/assets/images/certificates/ielts-trf.webp";
import { CertificateViewer } from "@/components/ui/CertificateViewer";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Portfolio } from "@/types/portfolio";

export function Language({ language }: { language: Portfolio["language"] }) {
  const cert = language.certificate;

  return (
    <section id="language" className="py-[48px] 768:py-[64px] 1024:py-[72px]">
      <Container>
        <SectionHeading eyebrow={language.eyebrow} title={language.title} />

        <div className="grid gap-[32px] 1024:grid-cols-[360px_1fr] 1024:gap-[64px]">
          {/* The certificate, summarised; the scan itself opens in the viewer. */}
          <div className="scroll-reveal self-start rounded-[16px] print:break-inside-avoid border border-line bg-panel p-[22px] 768:p-[26px]">
            <p className="font-mono text-[12px] tracking-[0.08em] text-muted">
              {cert.name.toUpperCase()} · {cert.date}
            </p>
            <div className="mt-[14px] flex items-end gap-[14px]">
              <span className="text-[56px] font-extrabold leading-none tracking-[-0.03em]">{cert.overall}</span>
              <span className="pb-[6px] text-[14px] text-muted">Overall band</span>
              <span className="mb-[8px] ml-auto rounded-full border border-line px-[10px] py-[3px] font-mono text-[11px] text-accent">
                CEFR {cert.cefr}
              </span>
            </div>

            <div className="mt-[20px] border-t border-line pt-[18px] print:hidden">
              <CertificateViewer image={ieltsCertificate} alt={cert.imageAlt} label="View certificate" />
            </div>
          </div>

          <div>
            <p className="scroll-reveal max-w-[560px] text-[16px] text-muted 768:text-[17px]">{language.text}</p>
            <dl className="mt-[24px] border-t border-line">
              {language.uses.map((use) => (
                <div
                  key={use.label}
                  className="scroll-reveal stack-row group grid grid-cols-1 gap-[6px] border-b border-line py-[16px] 768:grid-cols-[140px_1fr] 768:items-baseline 768:gap-[24px] 768:py-[18px]"
                >
                  <dt className="font-mono text-[12px] tracking-[0.08em] text-muted group-hover:text-accent">{use.label}</dt>
                  <dd className="text-[15px] 768:text-[16px]">{use.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
