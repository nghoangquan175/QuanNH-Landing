"use client";

import { ArrowRight, ArrowUpRight, Check, Command, Copy, CornerDownLeft, Mail, SunMoon } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { switchTheme } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/cn";
import type { Portfolio } from "@/types/portfolio";

type Props = { nav: Portfolio["site"]["nav"]; contact: Portfolio["contact"] };

type Item = {
  id: string;
  group: "Go to" | "Actions" | "Links";
  label: string;
  icon: React.ReactNode;
  /** Return false to keep the palette open; the item then calls `close` itself. */
  run: (close: () => void) => void | false;
};

const iconClass = "size-[16px] shrink-0";

const noSubscribe = () => () => {};

/**
 * ⌘K / Ctrl+K command menu: jump to a section, copy the email, switch theme, open a
 * profile. Built on a modal <dialog>, so focus, Escape and the backdrop come from the
 * browser; type to filter, arrows to move, Enter to run.
 */
export function CommandPalette({ nav, contact }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  // Server and first paint assume a Mac; the real platform takes over after hydration.
  const isMac = useSyncExternalStore(
    noSubscribe,
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => true,
  );

  const close = () => dialogRef.current?.close();

  const open = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open || document.documentElement.dataset.intro === "play") return;
    setQuery("");
    setIndex(0);
    setCopied(false);
    dialog.showModal();
    inputRef.current?.focus();
  };

  useEffect(() => {
    // `code` is the physical key, so the shortcut survives non-Latin layouts and
    // Vietnamese input methods; capture phase so nothing on the page can swallow it first.
    // preventDefault keeps the browser's own Ctrl+K (focus the address bar) out of the way.
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return;
      if (event.code !== "KeyK" && event.key.toLowerCase() !== "k") return;
      event.preventDefault();
      if (dialogRef.current?.open) close();
      else open();
    };
    document.addEventListener("keydown", onKeyDown, { capture: true });
    return () => document.removeEventListener("keydown", onKeyDown, { capture: true });
  }, []);

  const items = useMemo<Item[]>(
    () => [
      ...nav.map((link) => ({
        id: link.href,
        group: "Go to" as const,
        label: link.label,
        icon: <ArrowRight className={iconClass} aria-hidden="true" />,
        // Scrolls (smoothly, via the page's scroll-behavior) even when the hash is already set.
        run: () => {
          document.getElementById(link.href.slice(1))?.scrollIntoView();
          history.replaceState(null, "", link.href);
        },
      })),
      {
        id: "copy-email",
        group: "Actions",
        label: copied ? "Email copied" : "Copy email",
        icon: copied ? <Check className={iconClass} aria-hidden="true" /> : <Copy className={iconClass} aria-hidden="true" />,
        run: (close) => {
          navigator.clipboard.writeText(contact.email).then(
            () => {
              setCopied(true);
              window.setTimeout(close, 700);
            },
            // Clipboard blocked: fall back to the mail client.
            () => {
              window.location.href = `mailto:${contact.email}`;
              close();
            },
          );
          return false;
        },
      },
      {
        id: "email",
        group: "Actions",
        label: "Write an email",
        icon: <Mail className={iconClass} aria-hidden="true" />,
        run: () => {
          window.location.href = `mailto:${contact.email}`;
        },
      },
      {
        id: "theme",
        group: "Actions",
        label: "Switch theme",
        icon: <SunMoon className={iconClass} aria-hidden="true" />,
        // After the dialog has closed, so the swap's snapshot doesn't catch it.
        run: () => {
          window.setTimeout(() => switchTheme(document.querySelector("[data-theme-toggle]")), 0);
        },
      },
      ...contact.links.map((link) => ({
        id: link.href,
        group: "Links" as const,
        label: link.label,
        icon: <ArrowUpRight className={iconClass} aria-hidden="true" />,
        run: () => {
          window.open(link.href, "_blank", "noopener,noreferrer");
        },
      })),
    ],
    [nav, contact, copied],
  );

  const needle = query.trim().toLowerCase();
  const visible = needle ? items.filter((item) => item.label.toLowerCase().includes(needle)) : items;
  const current = Math.min(index, visible.length - 1);

  const runItem = (item: Item) => {
    if (item.run(close) !== false) close();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setIndex((current + step + visible.length) % visible.length);
    } else if (event.key === "Enter" && visible[current]) {
      event.preventDefault();
      runItem(visible[current]);
    }
  };

  // Keep the highlighted row in view as the arrows move through a long list.
  useEffect(() => {
    dialogRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [current]);

  const shortcut = isMac ? "⌘K" : "Ctrl K";

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="Open quick menu"
        aria-keyshortcuts="Control+K Meta+K"
        title={`Quick menu (${shortcut})`}
        className="glow-ring grid h-[40px] min-w-[40px] place-items-center rounded-full border border-line px-[10px] text-[13px] text-muted 768:px-[14px] transition-[color,box-shadow] hover:text-text"
      >
        <Command className="size-[16px] 768:hidden" aria-hidden="true" />
        <span className="hidden 768:inline">Quick menu</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Command menu"
        className="palette m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-text"
        onClick={(event) => {
          // A click on the dialog itself (not its panel) is a click on the backdrop.
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="mx-auto mt-[14vh] w-[calc(100%-32px)] max-w-[560px] overflow-hidden rounded-[16px] border border-line bg-panel shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIndex(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Type a command or section…"
            // Not a form field: keep the browser's autofill and password managers out
            // (Bitwarden, 1Password, LastPass each have their own opt-out attribute).
            type="text"
            name="quick-menu"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            data-bwignore="true"
            data-1p-ignore="true"
            data-lpignore="true"
            data-form-type="other"
            aria-label="Search commands"
            aria-controls="palette-list"
            aria-activedescendant={visible[current] ? `palette-${visible[current].id}` : undefined}
            className="w-full border-0 border-b border-line bg-transparent px-[18px] py-[16px] text-[15px] text-text placeholder:text-muted focus:border-line focus:outline-none focus:ring-0"
          />

          <ul id="palette-list" role="listbox" aria-label="Commands" className="max-h-[min(440px,60vh)] overflow-y-auto p-[6px]">
            {visible.length === 0 && <li className="px-[12px] py-[18px] text-center text-[14px] text-muted">No matches</li>}
            {visible.map((item, i) => (
              <li key={item.id} role="presentation">
                {(i === 0 || visible[i - 1].group !== item.group) && (
                  <p className="px-[12px] pb-[4px] pt-[10px] font-mono text-[11px] tracking-[0.1em] text-muted" aria-hidden="true">
                    {item.group.toUpperCase()}
                  </p>
                )}
                <div
                  id={`palette-${item.id}`}
                  role="option"
                  aria-selected={i === current}
                  onPointerMove={() => setIndex(i)}
                  onClick={() => runItem(item)}
                  className={cn(
                    "flex cursor-pointer items-center gap-[12px] rounded-[10px] px-[12px] py-[10px] text-[14px] text-muted",
                    i === current && "bg-[var(--panel2)] text-text",
                    item.id === "copy-email" && copied && "text-accent",
                  )}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {i === current && <CornerDownLeft className="size-[14px] text-muted" aria-hidden="true" />}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </>
  );
}
