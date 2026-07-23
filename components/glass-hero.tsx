'use client';

import React, { useEffect, useRef } from 'react';

const DESKTOP_RADIUS = 180;
const MOBILE_RADIUS = 120;
const TOPMATE_URL = 'https://ig.me/m/imxrah._';

export default function GlassHero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const revealRef = useRef<HTMLDivElement | null>(null);

  // Animation and pointer state refs (zero React state updates to prevent re-renders)
  const rawPos = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const smoothedPos = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const currentRadius = useRef<number>(0);
  const targetRadius = useRef<number>(0);
  const isTouchDevice = useRef<boolean>(false);
  const animFrameId = useRef<number | null>(null);
  const prefersReducedMotion = useRef<boolean>(false);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mediaQuery.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionChange);
    }

    // Single rAF loop for smooth 60fps mask interpolation
    const tick = () => {
      if (prefersReducedMotion.current) {
        smoothedPos.current.x = rawPos.current.x;
        smoothedPos.current.y = rawPos.current.y;
        currentRadius.current = targetRadius.current;
      } else {
        // Interpolate position at 0.14 and radius at 0.12
        smoothedPos.current.x += (rawPos.current.x - smoothedPos.current.x) * 0.14;
        smoothedPos.current.y += (rawPos.current.y - smoothedPos.current.y) * 0.14;
        currentRadius.current += (targetRadius.current - currentRadius.current) * 0.12;
      }

      if (revealRef.current) {
        revealRef.current.style.setProperty('--reveal-x', `${smoothedPos.current.x.toFixed(2)}px`);
        revealRef.current.style.setProperty('--reveal-y', `${smoothedPos.current.y.toFixed(2)}px`);
        revealRef.current.style.setProperty('--reveal-radius', `${currentRadius.current.toFixed(2)}px`);
      }

      animFrameId.current = requestAnimationFrame(tick);
    };

    animFrameId.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameId.current !== null) {
        cancelAnimationFrame(animFrameId.current);
      }
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMotionChange);
      }
    };
  }, []);

  // Pointer event handlers
  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') {
      isTouchDevice.current = false;
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        rawPos.current = { x, y };
        if (targetRadius.current === 0) {
          smoothedPos.current = { x, y };
        }
      }
      targetRadius.current = DESKTOP_RADIUS;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      rawPos.current = { x, y };

      if (e.pointerType === 'touch') {
        isTouchDevice.current = true;
        targetRadius.current = MOBILE_RADIUS;
      } else if (e.pointerType === 'mouse') {
        isTouchDevice.current = false;
        targetRadius.current = DESKTOP_RADIUS;
      }
    }
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') {
      targetRadius.current = 0;
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isTouchDevice.current = true;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect && e.touches.length > 0) {
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      rawPos.current = { x, y };
      smoothedPos.current = { x, y };
      targetRadius.current = MOBILE_RADIUS;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect && e.touches.length > 0) {
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      rawPos.current = { x, y };
    }
  };

  const handleTouchEnd = () => {
    targetRadius.current = 0;
  };

  return (
    <div
      ref={containerRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className="relative w-full h-screen overflow-hidden select-none touch-none bg-[#dce7f0]"
    >
      {/* Dark bottom backdrop layer to cover ONLY the very bottom gesture bar strip */}
      <div className="absolute bottom-0 left-0 w-full h-[60px] bg-[#0d1520] pointer-events-none z-[1]" aria-hidden="true" />

      {/* LAYER 1: Base Portrait */}
      <div
        aria-hidden="true"
        className="absolute inset-0 w-full h-full bg-[position:74%_bottom] sm:bg-[position:72%_bottom] md:bg-center bg-[size:auto_76vh] sm:bg-[size:auto_80vh] md:bg-cover bg-no-repeat bg-[url('/images/base_image_desktop.png')] animate-hero-base"
      />

      {/* LAYER 2: Reveal Portrait with Organic Soft Mask (No Circle Border) */}
      <div
        ref={revealRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full bg-[position:74%_bottom] sm:bg-[position:72%_bottom] md:bg-center bg-[size:auto_76vh] sm:bg-[size:auto_80vh] md:bg-cover bg-no-repeat bg-[url('/images/reveal_image_desktop.png')] reveal-mask pointer-events-none"
        style={{
          '--reveal-x': '-999px',
          '--reveal-y': '-999px',
          '--reveal-radius': '0px',
        } as React.CSSProperties}
      />

      {/* LAYER 3: Technical Grid & Large Geometric Circle */}
      <div aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(13, 21, 32, 0.35) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(13, 21, 32, 0.35) 1px, transparent 1px)
            `,
            backgroundSize: '12vw 12vw',
          }}
        />

        {/* Large geometric arc circle */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="720"
            cy="450"
            r="420"
            stroke="currentColor"
            strokeWidth="1"
            className="text-[#0d1520]"
            strokeDasharray="4 4"
          />
          <circle
            cx="720"
            cy="450"
            r="580"
            stroke="currentColor"
            strokeWidth="0.75"
            className="text-[#0d1520]"
          />
        </svg>
      </div>

      {/* LAYER 4: Headline, Copy & Manifesto */}
      <section className="relative z-20 w-full h-full pointer-events-none flex flex-col justify-between">
        {/* Headline starting around 20% from top on mobile, 34% on desktop */}
        <h1
          className="absolute top-[20%] sm:top-[24%] md:top-[34%] left-[max(5.6vw,1.25rem)] text-[#0d1520] font-normal leading-[0.93] tracking-[-0.085em] select-none"
          style={{ fontSize: 'clamp(2.5rem, 9vw, 6.8rem)' }}
        >
          <span className="block animate-line-1">Building</span>
          <span className="block animate-line-2">Beyond</span>
          <span className="block animate-line-3">Possible.</span>
        </h1>

        {/* Small Fragment Mono manifesto on the right */}
        <div className="absolute right-[max(3vw,0.75rem)] top-[56%] sm:top-[52%] md:top-[50%] -translate-y-1/2 text-right animate-manifesto-up">
          <p className="font-['Fragment_Mono',monospace] text-[0.62rem] sm:text-xs md:text-sm uppercase tracking-wider text-[#0d1520]/75 sm:text-[#0d1520]/80 leading-tight font-medium drop-shadow-sm md:drop-shadow-none">
            BUILDING THE
            <br />
            NEXT VERSION
            <br />
            IN PUBLIC
          </p>
        </div>

        {/* Bottom-left Copy & Button with Clean Soft Drop Shadow */}
        <div className="absolute bottom-[max(4.5rem,calc(env(safe-area-inset-bottom)+2.5rem))] sm:bottom-[4rem] md:bottom-[4rem] left-[max(5.6vw,1.25rem)] right-[max(5.6vw,1.25rem)] sm:right-auto max-w-[310px] sm:max-w-[400px] md:max-w-[440px] animate-copy-up">
          <p className="text-[0.88rem] sm:text-[1.02rem] md:text-[1.12rem] font-normal leading-[1.38] text-white md:text-[#0d1520]/90 mb-4 sm:mb-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] md:drop-shadow-none">
            I build useful products, experiment with emerging technology, and turn the process into stories worth sharing.
          </p>
          <a
            href={TOPMATE_URL}
            target="_blank"
            rel="noreferrer"
            className="pointer-events-auto inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 py-3 rounded-full bg-[#dce7f0] text-[#0d1520] font-medium text-sm border border-white/60 shadow-[-5px_-5px_12px_#ffffff,5px_5px_12px_rgba(13,21,32,0.14)] hover:shadow-[-2px_-2px_6px_#ffffff,2px_2px_6px_rgba(13,21,32,0.18)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[inset_2px_2px_5px_rgba(13,21,32,0.15),inset_-2px_-2px_5px_#ffffff] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Explore my work
          </a>
        </div>
      </section>

      {/* LAYER 5: Navigation */}
      <header
        className="fixed top-0 left-0 w-full z-30 pointer-events-auto animate-nav-down"
        style={{
          paddingTop: 'max(1.5rem, env(safe-area-inset-top))',
          paddingLeft: 'max(5.6vw, 1.25rem)',
          paddingRight: 'max(5.6vw, 1.25rem)',
        }}
      >
        <nav className="flex items-center justify-between w-full max-w-[1720px] mx-auto">
          {/* Brand Mark & Name */}
          <a
            href="#"
            className="flex items-center gap-2.5 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black rounded-lg min-h-[44px] px-1"
          >
            {/* Original Angular Inline-SVG "I" Mark */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-[#0d1520] transition-transform duration-300 group-hover:scale-110"
              aria-hidden="true"
            >
              <path
                d="M4 2H16L20 6V22H8L4 18V2Z"
                fill="currentColor"
              />
              <path
                d="M9 6.5H14.5V17.5H9V6.5Z"
                fill="#dce7f0"
              />
            </svg>
            <span className="font-semibold text-lg sm:text-xl tracking-tight text-[#0d1520]">
              Imdad
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center gap-9">
            <li>
              <a
                href="#about"
                className="min-h-[44px] inline-flex items-center text-sm font-medium text-[#0d1520]/80 hover:text-[#0d1520] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black rounded px-2"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#work"
                className="min-h-[44px] inline-flex items-center text-sm font-medium text-[#0d1520]/80 hover:text-[#0d1520] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black rounded px-2"
              >
                Work
              </a>
            </li>
            <li>
              <a
                href="#process"
                className="min-h-[44px] inline-flex items-center text-sm font-medium text-[#0d1520]/80 hover:text-[#0d1520] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black rounded px-2"
              >
                Process
              </a>
            </li>
            <li>
              <a
                href="#experiments"
                className="min-h-[44px] inline-flex items-center text-sm font-medium text-[#0d1520]/80 hover:text-[#0d1520] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black rounded px-2"
              >
                Experiments
              </a>
            </li>
          </ul>

          {/* Right-Side CTA with Authentic Light Neumorphic Soft Dual-Shadow */}
          <a
            href={TOPMATE_URL}
            target="_blank"
            rel="noreferrer"
            className="min-h-[44px] min-w-[44px] px-5 sm:px-6 py-2.5 rounded-full bg-[#dce7f0] text-[#0d1520] font-medium text-sm flex items-center justify-center border border-white/60 shadow-[-5px_-5px_12px_#ffffff,5px_5px_12px_rgba(13,21,32,0.14)] hover:shadow-[-2px_-2px_6px_#ffffff,2px_2px_6px_rgba(13,21,32,0.18)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[inset_2px_2px_5px_rgba(13,21,32,0.15),inset_-2px_-2px_5px_#ffffff] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Let's talk
          </a>
        </nav>
      </header>
    </div>
  );
}
