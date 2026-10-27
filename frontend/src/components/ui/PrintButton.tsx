"use client";

import { Printer } from "lucide-react";

/** Opens the print dialog; styles/includes/_print.scss turns the page into a plain CV. */
export function PrintButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      Print as CV
      <Printer className="size-[14px]" aria-hidden="true" />
    </button>
  );
}
