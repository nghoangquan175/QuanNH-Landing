import { cn } from "@/lib/cn";

type Props = {
  href: string;
  variant?: "primary" | "ghost";
  className?: string;
  children: React.ReactNode;
};

export function Button({ href, variant = "primary", className, children }: Props) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "inline-block rounded-full px-[22px] py-[12px] text-[14px] font-semibold transition-shadow",
        variant === "primary" ? "glow-shadow bg-accent text-on-accent" : "border border-line",
        className,
      )}
    >
      {children}
    </a>
  );
}
