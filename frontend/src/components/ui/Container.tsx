import { cn } from "@/lib/cn";

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto max-w-[1180px] px-[16px] 768:px-[24px]", className)}>{children}</div>;
}
