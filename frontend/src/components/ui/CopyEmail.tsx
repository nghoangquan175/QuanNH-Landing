"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

/** The address as a mailto link, plus a quiet copy button that confirms for a moment. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked (insecure context, permissions) — the mailto link still works.
    }
  };

  return (
    <span className="flex flex-wrap items-center gap-x-[14px] gap-y-[4px]">
      <a href={`mailto:${email}`} className="break-all underline-offset-[4px] hover:text-accent hover:underline">
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-live="polite"
        className="inline-flex items-center gap-[5px] rounded-full border border-line px-[10px] py-[2px] font-mono text-[11px] text-muted transition-colors hover:border-accent hover:text-accent"
      >
        {copied ? <Check className="size-[12px]" aria-hidden="true" /> : <Copy className="size-[12px]" aria-hidden="true" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </span>
  );
}
