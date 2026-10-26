"use client";

import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const STEP = 0.5;

const clamp = (value: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));

/**
 * A trigger button plus a full-screen viewer for a scanned document. The image is only
 * rendered (and downloaded) once the viewer opens. Zoom with the buttons, the wheel, +/−
 * keys or a double click; drag to move when zoomed; Esc, × or a click on the backdrop
 * closes. The scan sits alone on a dark backdrop, away from the site's own UI.
 */
export function CertificateViewer({ image, alt, label }: { image: StaticImageData; alt: string; label: string }) {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startX: number; startY: number; panX: number; panY: number; moved: boolean } | null>(null);

  const zoomTo = useCallback((next: number) => {
    const z = clamp(next);
    setZoom(z);
    if (z === MIN_ZOOM) setPan({ x: 0, y: 0 });
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    triggerRef.current?.focus();
  }, []);

  // While open: lock page scroll, move focus into the dialog, wire the keyboard.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      else if (event.key === "+" || event.key === "=") setZoom((z) => clamp(z + STEP));
      else if (event.key === "-") {
        setZoom((z) => {
          const next = clamp(z - STEP);
          if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
          return next;
        });
      } else if (event.key === "0") zoomTo(1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, zoomTo]);

  // Wheel zoom needs a non-passive listener so the page behind does not scroll.
  useEffect(() => {
    const stage = stageRef.current;
    if (!open || !stage) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      setZoom((z) => {
        const next = clamp(z + (event.deltaY < 0 ? 0.25 : -0.25));
        if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
        return next;
      });
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [open]);

  const onPointerDown = (event: React.PointerEvent) => {
    drag.current = { startX: event.clientX, startY: event.clientY, panX: pan.x, panY: pan.y, moved: false };
    if (zoom > MIN_ZOOM) {
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
      setDragging(true);
    }
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const d = drag.current;
    if (!d || zoom === MIN_ZOOM) return;
    const dx = event.clientX - d.startX;
    const dy = event.clientY - d.startY;
    if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
    setPan({ x: d.panX + dx, y: d.panY + dy });
  };

  const onPointerUp = (event: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    setDragging(false);
    // A plain click on the dark backdrop (not the scan, not the end of a drag) closes.
    if (d && !d.moved && event.target === event.currentTarget) close();
  };

  const toolButton =
    "grid size-[36px] place-items-center rounded-full text-[18px] text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-[8px] rounded-full border border-line px-[18px] py-[10px] text-[14px] font-semibold transition-colors hover:border-accent hover:text-accent"
      >
        {label}
        <span aria-hidden="true">↗</span>
      </button>

      {open &&
        createPortal(
          <div role="dialog" aria-modal="true" aria-label={alt} className="viewer fixed inset-0 z-[120] bg-black/85 backdrop-blur-[2px]">
            <div
              ref={stageRef}
              className="absolute inset-0 grid touch-none select-none place-items-center overflow-hidden"
              style={{ cursor: zoom > MIN_ZOOM ? (dragging ? "grabbing" : "grab") : "zoom-out" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            >
              <div
                className="viewer-image transition-transform duration-200 ease-out"
                style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
                onDoubleClick={() => zoomTo(zoom > MIN_ZOOM ? 1 : 2)}
              >
                <Image
                  src={image}
                  alt={alt}
                  unoptimized
                  draggable={false}
                  className="h-auto max-h-[86vh] w-auto max-w-[92vw] cursor-zoom-in rounded-[4px] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                />
              </div>
            </div>

            <button ref={closeRef} type="button" onClick={close} aria-label="Close" className={`${toolButton} absolute right-[16px] top-[16px] bg-white/10`}>
              ×
            </button>

            <div className="absolute bottom-[20px] left-1/2 flex -translate-x-1/2 items-center gap-[4px] rounded-full bg-neutral-900/90 px-[8px] py-[6px] font-mono text-[12px] text-white/80 ring-1 ring-white/10">
              <button type="button" onClick={() => zoomTo(zoom - STEP)} disabled={zoom <= MIN_ZOOM} aria-label="Zoom out" className={toolButton}>
                −
              </button>
              <span className="w-[48px] text-center tabular-nums" aria-live="polite">
                {Math.round(zoom * 100)}%
              </span>
              <button type="button" onClick={() => zoomTo(zoom + STEP)} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in" className={toolButton}>
                +
              </button>
              <button type="button" onClick={() => zoomTo(1)} disabled={zoom === MIN_ZOOM} aria-label="Reset zoom" className={`${toolButton} text-[15px]`}>
                ⟲
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
