"use client";

import { useEffect, useRef } from "react";

const MIN_THUMB = 40;
const IDLE_MS = 1200;

/**
 * A thin themed scrollbar drawn over the page. The native one is hidden for mouse users
 * (styles/includes/_scrollbar.scss) so it never takes width from the layout — which also
 * means nothing shifts when the intro's scroll lock lifts. Touch devices keep their
 * native overlay scrollbar and never see this one.
 */
export function CustomScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    const root = document.documentElement;
    let frame = 0;
    let idleTimer = 0;
    let thumbHeight = 0;
    let drag: { startY: number; startScroll: number } | null = null;

    const metrics = () => {
      const viewport = window.innerHeight;
      const content = root.scrollHeight;
      return { viewport, content, maxScroll: Math.max(content - viewport, 0) };
    };

    const render = () => {
      frame = 0;
      const { viewport, content, maxScroll } = metrics();
      track.hidden = maxScroll <= 0;
      if (track.hidden) return;
      thumbHeight = Math.max((viewport * viewport) / content, MIN_THUMB);
      const top = (window.scrollY / maxScroll) * (viewport - thumbHeight);
      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translateY(${top}px)`;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const markActive = () => {
      track.classList.add("is-active");
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        if (!drag) track.classList.remove("is-active");
      }, IDLE_MS);
    };

    const onScroll = () => {
      schedule();
      markActive();
    };

    const onThumbDown = (event: PointerEvent) => {
      event.preventDefault();
      event.stopPropagation();
      drag = { startY: event.clientY, startScroll: window.scrollY };
      thumb.setPointerCapture(event.pointerId);
      track.classList.add("is-dragging");
    };

    const onThumbMove = (event: PointerEvent) => {
      if (!drag) return;
      const { viewport, maxScroll } = metrics();
      const ratio = maxScroll / Math.max(viewport - thumbHeight, 1);
      window.scrollTo({ top: drag.startScroll + (event.clientY - drag.startY) * ratio, behavior: "instant" });
    };

    const onThumbUp = (event: PointerEvent) => {
      if (!drag) return;
      drag = null;
      thumb.releasePointerCapture(event.pointerId);
      track.classList.remove("is-dragging");
      markActive();
    };

    // Clicking the bare track pages up or down, like a native scrollbar.
    const onTrackDown = (event: PointerEvent) => {
      if (event.target !== track) return;
      const thumbTop = thumb.getBoundingClientRect().top;
      const direction = event.clientY < thumbTop ? -1 : 1;
      window.scrollBy({ top: direction * window.innerHeight * 0.9, behavior: "smooth" });
    };

    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(document.body);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    thumb.addEventListener("pointerdown", onThumbDown);
    thumb.addEventListener("pointermove", onThumbMove);
    thumb.addEventListener("pointerup", onThumbUp);
    thumb.addEventListener("pointercancel", onThumbUp);
    track.addEventListener("pointerdown", onTrackDown);
    render();

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(idleTimer);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      thumb.removeEventListener("pointerdown", onThumbDown);
      thumb.removeEventListener("pointermove", onThumbMove);
      thumb.removeEventListener("pointerup", onThumbUp);
      thumb.removeEventListener("pointercancel", onThumbUp);
      track.removeEventListener("pointerdown", onTrackDown);
    };
  }, []);

  return (
    <div ref={trackRef} className="scrollbar" aria-hidden="true">
      <div ref={thumbRef} className="scrollbar__thumb" />
    </div>
  );
}
