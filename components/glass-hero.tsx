"use client";

import React, { useEffect, useRef } from "react";

const DESKTOP_RADIUS = 260;
const MOBILE_RADIUS = 165;
const TOPMATE_URL = "https://ig.me/m/imxrah._";

export default function GlassHero() {
  const containerRef = useRef<HTMLElement | null>(null);

  // Animation state refs (never invoke React state setters)
  const rawPos = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const smoothedPos = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const currentRadius = useRef<number>(0);
  const targetRadius = useRef<number>(0);
  const isTouchRef = useRef<boolean>(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Check prefers-reduced-motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const animate = () => {
      const reducedMotion = motionQuery.matches;
      const posLerpFactor = reducedMotion ? 1 : 0.14;
      const radiusLerpFactor = reducedMotion ? 1 : 0.12;

      // Interpolate position
      if (rawPos.current.x === -999) {
        smoothedPos.current.x = -999;
        smoothedPos.current.y = -999;
      } else {
        smoothedPos.current.x += (rawPos.current.x - smoothedPos.current.x) * posLerpFactor;
        smoothedPos.current.y += (rawPos.current.y - smoothedPos.current.y) * posLerpFactor;
      }

      // Interpolate radius
      currentRadius.current += (targetRadius.current - currentRadius.current) * radiusLerpFactor;

      // Update CSS variables directly on root element
      el.style.setProperty("--reveal-x", `${smoothedPos.current.x}px`);
      el.style.setProperty("--reveal-y", `${smoothedPos.current.y}px`);
      el.style.setProperty("--reveal-radius", `${currentRadius.current}px`);

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    // Event Handlers
    const handlePointerEnter = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        isTouchRef.current = true;
        return;
      }
      isTouchRef.current = false;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      rawPos.current = { x, y };
      smoothedPos.current = { x, y };
      targetRadius.current = DESKTOP_RADIUS;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        isTouchRef.current = true;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        rawPos.current = { x, y };
        targetRadius.current = MOBILE_RADIUS;
        return;
      }
      isTouchRef.current = false;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      rawPos.current = { x, y };
      targetRadius.current = DESKTOP_RADIUS;
    };

    const handlePointerLeave = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      targetRadius.current = 0;
    };

    const handleTouchStart = (e: TouchEvent) => {
      isTouchRef.current = true;
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = el.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        rawPos.current = { x, y };
        smoothedPos.current = { x, y };
        targetRadius.current = MOBILE_RADIUS;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      isTouchRef.current = true;
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = el.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        rawPos.current = { x, y };
        targetRadius.current = MOBILE_RADIUS;
      }
    };

    const handleTouchEnd = () => {
      targetRadius.current = 0;
    };

    el.addEventListener("pointerenter", handlePointerEnter);
    el.addEventListener("pointermove", handlePointerMove);
    el.addEventListener("pointerleave", handlePointerLeave);
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    el.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
      el.removeEventListener("pointerenter", handlePointerEnter);
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerleave", handlePointerLeave);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  return (
    <main
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden select-none touch-none bg-[#e8eef3]"
    >
      {/* LAYER 1: Base Portrait */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-no-repeat animate-hero-base z-0 bg-[position:75%_center] md:bg-center bg-cover"
        style={{
          backgroundImage: "url('/images/base_image_desktop.png')",
        }}
      />

      {/* LAYER 2: Reveal Portrait (with Feathered Radial Mask) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-no-repeat reveal-mask-layer z-10 pointer-events-none bg-[position:75%_center] md:bg-center bg-cover"
        style={{
          backgroundImage: "url('/images/reveal_image_desktop.png')",
        }}
      />


      {/* LAYER 3: Technical Grid and Large Circle */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-20 pointer-events-none"
      >
        {/* Fine background grid lines */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.25) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.25) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Outer technical circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[72vw] h-[72vw] max-w-[820px] max-h-[820px] rounded-full border border-black/10 opacity-40" />
      </div>

      {/* LAYER 5: Navigation */}
      <header
        className="absolute left-0 right-0 z-40 animate-fade-down flex items-center justify-between"
        style={{
          top: "max(2.5rem, env(safe-area-inset-top))",
          paddingLeft: "max(5.6vw, 1.5rem)",
          paddingRight: "max(5.6vw, 1.5rem)",
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          {/* Original Inline-SVG Angular I Mark */}
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shadow-md">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Imdad brand mark"
              className="text-white"
            >
              <path
                d="M5 4H19V7H14.5V17H19V20H5V17H9.5V7H5V4Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="font-sans text-xl font-bold tracking-tight text-slate-900">
            Imdad
          </span>
        </div>

        {/* Desktop Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium tracking-tight text-slate-800"
        >
          <a
            href="#about"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black rounded transition-colors"
          >
            About
          </a>
          <a
            href="#work"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black rounded transition-colors"
          >
            Work
          </a>
          <a
            href="#process"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black rounded transition-colors"
          >
            Process
          </a>
          <a
            href="#experiments"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black rounded transition-colors"
          >
            Experiments
          </a>
        </nav>

        {/* Right CTA */}
        <a
          href={TOPMATE_URL}
          target="_blank"
          rel="noreferrer"
          className="min-h-[44px] px-6 inline-flex items-center justify-center rounded-full bg-white text-slate-900 text-sm font-semibold shadow-sm hover:bg-slate-100 hover:shadow transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
        >
          Let's talk
        </a>
      </header>

      {/* LAYER 4: Headline and Copy */}
      <section className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between">
        {/* Large Editorial Headline */}
        <div
          className="absolute"
          style={{
            top: "clamp(18%, 22vh, 34%)",
            left: "max(5.6vw, 1.5rem)",
          }}
        >
          <h1 className="font-sans font-medium text-[#0f172a] leading-[0.91] tracking-[-0.085em] text-[clamp(2.75rem,6.8vw,6.8rem)]">
            <span className="block animate-heading-1">Building</span>
            <span className="block animate-heading-2">Beyond</span>
            <span className="block animate-heading-3">Possible.</span>
          </h1>
        </div>

        {/* Bottom Left Copy & CTA */}
        <div
          className="absolute max-w-[280px] sm:max-w-sm md:max-w-md animate-intro pointer-events-auto"
          style={{
            bottom: "max(2rem, env(safe-area-inset-bottom))",
            left: "max(5.6vw, 1.5rem)",
          }}
        >
          <p className="font-sans text-sm md:text-base text-slate-700 font-normal leading-relaxed mb-5">
            I build useful products, experiment with emerging technology, and turn
            the process into stories worth sharing.
          </p>
          <a
            href={TOPMATE_URL}
            target="_blank"
            rel="noreferrer"
            className="min-h-[44px] px-6 inline-flex items-center justify-center rounded-full bg-white text-slate-900 text-sm font-semibold shadow-sm hover:bg-slate-100 hover:shadow transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
          >
            Explore my work
          </a>
        </div>

        {/* Bottom Right Manifesto */}
        <div
          className="absolute hidden sm:block animate-manifesto"
          style={{
            bottom: "max(2.5rem, env(safe-area-inset-bottom))",
            right: "max(5.6vw, 2rem)",
          }}
        >
          <p className="font-mono text-xs text-slate-500 uppercase tracking-widest leading-loose text-right">
            BUILDING THE
            <br />
            NEXT VERSION
            <br />
            IN PUBLIC
          </p>
        </div>
      </section>
    </main>
  );
}
