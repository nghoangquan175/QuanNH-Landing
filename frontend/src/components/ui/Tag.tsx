/** Small outlined label beside a title: a project's role, or its status. */
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="whitespace-nowrap rounded-full border border-line px-[10px] py-[3px] font-mono text-[11px] text-muted">{children}</span>
  );
}
