"use client";

import { OPEN_EVENT, useShortcutLabel } from "@/components/layout/CommandPalette";

/** "Press ⌘K for the quick menu", for keyboard-and-mouse visitors on wider screens; clicking it opens the menu too. */
export function QuickMenuHint() {
  const shortcut = useShortcutLabel();
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className="hidden transition-colors hover:text-text 768:[@media(hover:hover)_and_(pointer:fine)]:inline"
    >
      Press <kbd className="font-mono">{shortcut}</kbd> for the quick menu
    </button>
  );
}
