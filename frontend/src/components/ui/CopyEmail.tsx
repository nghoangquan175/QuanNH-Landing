"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

/** The address as a mailto link, plus a quiet icon button that copies it and shows a tick for a moment. */
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
    <span className="flex flex-wrap items-center gap-x-[8px] gap-y-[4px]">
      <a href={`mailto:${email}`} className="break-all underline-offset-[4px] hover:text-accent hover:underline">
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Email copied" : "Copy email"}
        title={copied ? "Copied" : "Copy email"}
        className={cn("grid size-[28px] place-items-center rounded-full transition-colors hover:text-accent", copied ? "text-accent" : "text-muted")}
      >
        {copied ? <Check className="size-[15px]" aria-hidden="true" /> : <Copy className="size-[15px]" aria-hidden="true" />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email copied" : ""}
      </span>
    </span>
  );
}
