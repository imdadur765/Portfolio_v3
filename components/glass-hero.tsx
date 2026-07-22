"use client";

import React, { useEffect, useRef } from "react";

const DESKTOP_RADIUS = 260;
const MOBILE_RADIUS = 165;
const TOPMATE_URL = "https://ig.me/m/imxrah._";

export default function GlassHero() {
  const containerRef = useRef<HTMLElement | null>(null);

  const rawPos = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const smoothedPos = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const currentRadius = useRef<number>(0);
  const targetRadius = useRef<number>(0);
  const isHoveredRef = useRef<boolean>(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const animate = () => {
      const reducedMotion = motionQuery.matches;
      const posLerpFactor = reducedMotion ? 1 : 0.14;
      const radiusLerpFactor = reducedMotion ? 1 : 0.12;

      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;

      if (scrollY > 10 && !isHoveredRef.current) {
        const progress = Math.min(scrollY / (windowHeight * 2), 1);
        const scrollTargetX = window.innerWidth * (0.55 + Math.sin(progress * Math.PI) * 0.15);
        const scrollTargetY = windowHeight * (0.35 + progress * 0.4);
        rawPos.current = { x: scrollTargetX, y: scrollTargetY };
        targetRadius.current = DESKTOP_RADIUS * (1 + progress * 0.35);
      }

      if (rawPos.current.x === -999) {
        smoothedPos.current.x = -999;
        smoothedPos.current.y = -999;
      } else {
        smoothedPos.current.x += (rawPos.current.x - smoothedPos.current.x) * posLerpFactor;
        smoothedPos.current.y += (rawPos.current.y - smoothedPos.current.y) * posLerpFactor;
      }

      currentRadius.current += (targetRadius.current - currentRadius.current) * radiusLerpFactor;

      el.style.setProperty("--reveal-x", `${smoothedPos.current.x}px`);
      el.style.setProperty("--reveal-y", `${smoothedPos.current.y}px`);
      el.style.setProperty("--reveal-radius", `${currentRadius.current}px`);

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    const handlePointerEnter = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      isHoveredRef.current = true;
      const rect = el.getBoundingClientRect();
      rawPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      smoothedPos.current = { ...rawPos.current };
      targetRadius.current = DESKTOP_RADIUS;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        isHoveredRef.current = true;
        const rect = el.getBoundingClientRect();
        rawPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        targetRadius.current = MOBILE_RADIUS;
        return;
      }
      isHoveredRef.current = true;
      const rect = el.getBoundingClientRect();
      rawPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      targetRadius.current = DESKTOP_RADIUS;
    };

    const handlePointerLeave = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      isHoveredRef.current = false;
      targetRadius.current = 0;
    };

    const handleTouchStart = (e: TouchEvent) => {
      isHoveredRef.current = true;
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = el.getBoundingClientRect();
        rawPos.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
        smoothedPos.current = { ...rawPos.current };
        targetRadius.current = MOBILE_RADIUS;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      isHoveredRef.current = true;
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = el.getBoundingClientRect();
        rawPos.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
        targetRadius.current = MOBILE_RADIUS;
      }
    };

    const handleTouchEnd = () => {
      isHoveredRef.current = false;
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
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      el.removeEventListener("pointerenter", handlePointerEnter);
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerleave", handlePointerLeave);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  // Intersection Observer for scroll-triggered reveals
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
        (el as HTMLElement).style.transform = "none";
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full bg-[#f5f4f0]">
      {/* Sticky Fullscreen Hero */}
      <main
        ref={containerRef}
        className="sticky top-0 w-full h-screen overflow-hidden select-none touch-none bg-[#e8eef3] z-0"
      >
        {/* LAYER 1: Base Portrait */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-center bg-no-repeat bg-cover animate-hero-base z-0"
          style={{ backgroundImage: "url('/images/base_image_desktop.png')" }}
        />

        {/* LAYER 2: Reveal Portrait */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-center bg-no-repeat bg-cover reveal-mask-layer z-10 pointer-events-none"
          style={{ backgroundImage: "url('/images/reveal_image_desktop.png')" }}
        />

        {/* LAYER 3: Technical Grid */}
        <div aria-hidden="true" className="absolute inset-0 z-20 pointer-events-none">
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[72vw] h-[72vw] max-w-[820px] max-h-[820px] rounded-full border border-black/10 opacity-40" />
        </div>

        {/* Navigation */}
        <header
          className="absolute left-0 right-0 z-40 animate-fade-down flex items-center justify-between"
          style={{
            top: "max(2.5rem, env(safe-area-inset-top))",
            paddingLeft: "max(5.6vw, 2rem)",
            paddingRight: "max(5.6vw, 2rem)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shadow-md">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-label="Imdad brand mark">
                <path d="M5 4H19V7H14.5V17H19V20H5V17H9.5V7H5V4Z" fill="currentColor" />
              </svg>
            </div>
            <span className="font-sans text-xl font-bold tracking-tight text-slate-900">Imdad</span>
          </div>

          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8 text-sm font-medium tracking-tight text-slate-800">
            {["About", "Work", "Process", "Experiments"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black rounded transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <a
            href={TOPMATE_URL}
            target="_blank"
            rel="noreferrer"
            className="min-h-[44px] px-6 inline-flex items-center justify-center rounded-full bg-white text-slate-900 text-sm font-semibold shadow-sm hover:bg-slate-100 hover:shadow transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
          >
            Let's talk
          </a>
        </header>

        {/* Headline & Copy */}
        <section className="absolute inset-0 z-30 pointer-events-none">
          <div className="absolute" style={{ top: "34%", left: "max(5.6vw, 2rem)" }}>
            <h1 className="font-sans font-medium text-[#0f172a] leading-[0.93] tracking-[-0.085em] text-[clamp(3.5rem,8vw,6.8rem)]">
              <span className="block animate-heading-1">Building</span>
              <span className="block animate-heading-2">Beyond</span>
              <span className="block animate-heading-3">Possible.</span>
            </h1>
          </div>

          <div
            className="absolute max-w-sm md:max-w-md animate-intro pointer-events-auto"
            style={{ bottom: "max(2.5rem, env(safe-area-inset-bottom))", left: "max(5.6vw, 2rem)" }}
          >
            <p className="font-sans text-sm md:text-base text-slate-700 font-normal leading-relaxed mb-5">
              I build useful products, experiment with emerging technology, and turn the process into stories worth sharing.
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

          <div
            className="absolute hidden sm:block animate-manifesto"
            style={{ bottom: "max(2.5rem, env(safe-area-inset-bottom))", right: "max(5.6vw, 2rem)" }}
          >
            <p className="font-mono text-xs text-slate-500 uppercase tracking-widest leading-loose text-right">
              BUILDING THE<br />NEXT VERSION<br />IN PUBLIC
            </p>
          </div>
        </section>
      </main>

      {/* ─── EDITORIAL MAGAZINE SECTIONS ─── */}

      {/* Section 01 — About */}
      <section id="about" className="relative w-full bg-[#f4f3ef] py-36 md:py-52 overflow-hidden">
        <span aria-hidden="true" className="absolute right-0 top-0 font-sans font-bold text-[clamp(10rem,22vw,22rem)] leading-none text-black/[0.03] select-none pointer-events-none translate-x-8">
          01
        </span>

        <div className="px-[max(5.6vw,2rem)] max-w-screen-xl mx-auto">
          {/* Chapter label row */}
          <div
            className="reveal-on-scroll flex items-center gap-5 mb-20"
            style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.75s ease, transform 0.75s ease" }}
          >
            <span className="font-mono text-[0.65rem] tracking-[0.3em] text-slate-400 uppercase">About</span>
            <span className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Top row: tagline + availability badge */}
          <div
            className="reveal-on-scroll flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16"
            style={{ opacity: 0, transform: "translateY(36px)", transition: "opacity 0.95s ease 0.05s, transform 0.95s ease 0.05s" }}
          >
            <h2 className="font-sans font-medium text-[#0d1117] leading-[0.9] tracking-[-0.06em] text-[clamp(3rem,7vw,7rem)] max-w-3xl">
              Builder.<br />
              <em className="not-italic text-slate-300">Experimenter.</em><br />
              Storyteller.
            </h2>
            {/* Availability badge */}
            <div className="flex-shrink-0 mb-2">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-mono text-[0.65rem] tracking-widest text-emerald-700 uppercase">Available for work</span>
              </div>
            </div>
          </div>

          {/* Thin rule */}
          <div
            className="reveal-on-scroll h-px bg-slate-200 mb-16"
            style={{ opacity: 0, transform: "scaleX(0)", transformOrigin: "left", transition: "opacity 0.7s ease 0.18s, transform 0.7s ease 0.18s" }}
          />

          {/* Bio + Skills grid */}
          <div
            className="reveal-on-scroll grid md:grid-cols-[3fr_2fr] gap-14 md:gap-24 mb-16"
            style={{ opacity: 0, transform: "translateY(28px)", transition: "opacity 0.9s ease 0.28s, transform 0.9s ease 0.28s" }}
          >
            {/* Left: bio + quote */}
            <div>
              <p className="font-sans text-lg md:text-xl text-slate-600 leading-relaxed mb-8">
                I'm Imdad — a product builder who blends design intuition with engineering depth. I build tools that matter, ship fast, and share everything along the way.
              </p>
              <blockquote className="border-l-2 border-slate-200 pl-5 font-sans text-base text-slate-400 leading-relaxed italic">
                "The best products feel inevitable in hindsight — that's the standard I build to."
              </blockquote>
            </div>

            {/* Right: skills */}
            <div>
              <p className="font-mono text-[0.65rem] tracking-[0.25em] text-slate-400 uppercase mb-5">Skills & tools</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Next.js", "React", "TypeScript", "Node.js",
                  "AI / LLMs", "Figma", "Product Design",
                  "Full-Stack", "Open Source", "Rapid Prototyping",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="inline-block px-3 py-1.5 rounded-full border border-slate-200 font-mono text-[0.65rem] tracking-wide text-slate-500 bg-white/60 hover:border-slate-400 hover:text-slate-700 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div
            className="reveal-on-scroll grid grid-cols-3 border-t border-slate-200 pt-10"
            style={{ opacity: 0, transform: "translateY(20px)", transition: "opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s" }}
          >
            {[
              { value: "3+", label: "Years building" },
              { value: "∞", label: "Experiments" },
              { value: "100%", label: "In public" },
            ].map((stat, i) => (
              <div key={stat.label} className={`flex flex-col gap-1.5 ${i > 0 ? "pl-8 border-l border-slate-200" : ""}`}>
                <span className="font-sans font-semibold text-[#0d1117] text-2xl md:text-3xl tracking-tight">{stat.value}</span>
                <span className="font-mono text-[0.6rem] text-slate-400 tracking-widest uppercase">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee strip — compact */}
      <div className="w-full bg-[#0d1117] py-3 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee inline-block">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="font-mono text-[0.6rem] tracking-[0.28em] text-white/20 uppercase mx-8">
              Building Beyond Possible &nbsp;·&nbsp; Full-Stack Engineering &nbsp;·&nbsp; AI Experiments &nbsp;·&nbsp; In Public &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Section 02 — Work */}
      <section id="work" className="relative w-full bg-[#f4f3ef] py-36 md:py-52 overflow-hidden">
        <span aria-hidden="true" className="absolute left-0 top-0 font-sans font-bold text-[clamp(10rem,22vw,22rem)] leading-none text-black/[0.035] select-none pointer-events-none -translate-x-8">
          02
        </span>

        <div className="px-[max(5.6vw,2rem)] max-w-screen-xl mx-auto">
          <div
            className="reveal-on-scroll flex items-center gap-5 mb-20"
            style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.75s ease, transform 0.75s ease" }}
          >
            <span className="font-mono text-[0.65rem] tracking-[0.3em] text-slate-400 uppercase">Selected Work</span>
            <span className="flex-1 h-px bg-slate-200" />
            <span className="font-mono text-[0.65rem] tracking-[0.2em] text-slate-300 uppercase">2024 – 2025</span>
          </div>

          <h2
            className="reveal-on-scroll font-sans font-medium text-[#0d1117] leading-[0.9] tracking-[-0.06em] text-[clamp(3rem,7vw,7rem)] mb-20"
            style={{ opacity: 0, transform: "translateY(48px)", transition: "opacity 1s ease 0.08s, transform 1s ease 0.08s" }}
          >
            Experiments in<br />
            emerging technology.
          </h2>

          {/* Project rows */}
          <div className="border-t border-slate-200">
            {[
              { num: "01", title: "AI-Powered Products", tag: "Full-Stack · AI", year: "2025", desc: "Intelligent tooling built for real human workflows." },
              { num: "02", title: "Digital Experiences", tag: "Design · Engineering", year: "2025", desc: "Interface-first thinking applied at product scale." },
              { num: "03", title: "Emerging Tech Experiments", tag: "Research · Prototype", year: "2024", desc: "Rapid prototypes at the edge of what's possible." },
            ].map((project, i) => (
              <div
                key={project.num}
                className="reveal-on-scroll group"
                style={{ opacity: 0, transform: "translateY(24px)", transition: `opacity 0.75s ease ${0.1 * i}s, transform 0.75s ease ${0.1 * i}s` }}
              >
                <div className="flex items-center justify-between py-8 border-b border-slate-200 cursor-pointer">
                  {/* Left */}
                  <div className="flex items-center gap-6 md:gap-10">
                    <span className="font-mono text-[0.65rem] text-slate-300 tracking-widest w-5">{project.num}</span>
                    <div>
                      <p className="font-sans font-medium text-[#0d1117] text-lg md:text-2xl tracking-tight group-hover:translate-x-2 transition-transform duration-500 ease-out">
                        {project.title}
                      </p>
                      <p className="font-sans text-sm text-slate-400 mt-1 hidden md:block">{project.desc}</p>
                    </div>
                  </div>
                  {/* Right */}
                  <div className="flex items-center gap-6 md:gap-10">
                    <span className="hidden md:block font-mono text-[0.65rem] text-slate-400 tracking-widest uppercase">{project.tag}</span>
                    <span className="font-mono text-[0.65rem] text-slate-300 hidden sm:block">{project.year}</span>
                    {/* Arrow */}
                    <div className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-[#0d1117] group-hover:border-[#0d1117] transition-all duration-300">
                      <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" viewBox="0 0 14 14" fill="none">
                        <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 03 — Contact (full dark) */}
      <section id="process" className="relative w-full bg-[#0d1117] py-36 md:py-52 overflow-hidden">
        {/* Subtle grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <span aria-hidden="true" className="absolute right-0 top-0 font-sans font-bold text-[clamp(10rem,22vw,22rem)] leading-none text-white/[0.03] select-none pointer-events-none translate-x-8">
          03
        </span>

        <div className="relative px-[max(5.6vw,2rem)] max-w-screen-xl mx-auto">
          <div
            className="reveal-on-scroll flex items-center gap-5 mb-20"
            style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.75s ease, transform 0.75s ease" }}
          >
            <span className="font-mono text-[0.65rem] tracking-[0.3em] text-white/30 uppercase">Let's Build</span>
            <span className="flex-1 h-px bg-white/10" />
          </div>

          <h2
            className="reveal-on-scroll font-sans font-medium text-white leading-[0.9] tracking-[-0.06em] text-[clamp(3rem,7vw,7rem)] mb-16"
            style={{ opacity: 0, transform: "translateY(48px)", transition: "opacity 1s ease 0.08s, transform 1s ease 0.08s" }}
          >
            Have an idea<br />
            worth building?
          </h2>

          <div
            className="reveal-on-scroll h-px bg-white/10 mb-16"
            style={{ opacity: 0, transform: "scaleX(0)", transformOrigin: "left", transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s" }}
          />

          <div
            className="reveal-on-scroll flex flex-col sm:flex-row items-start sm:items-center gap-8 md:gap-12"
            style={{ opacity: 0, transform: "translateY(28px)", transition: "opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s" }}
          >
            <a
              href={TOPMATE_URL}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-4 px-8 py-5 rounded-full bg-white text-[#0d1117] font-semibold text-sm hover:bg-slate-100 transition-all shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              Get in touch
              <span className="w-5 h-5 rounded-full bg-[#0d1117] text-white flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none">
                  <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </a>
            <p className="font-sans text-white/40 text-sm leading-relaxed max-w-xs">
              Open to projects, collabs, and conversations about things that matter.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#0d1117] border-t border-white/[0.06] py-8 px-[max(5.6vw,2rem)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 4H19V7H14.5V17H19V20H5V17H9.5V7H5V4Z" fill="white" opacity="0.6"/>
            </svg>
          </div>
          <span className="font-mono text-[0.65rem] text-white/25 tracking-widest uppercase">© 2025 Imdad</span>
        </div>
        <span className="font-mono text-[0.65rem] text-white/20 tracking-widest uppercase">Building In Public — Always</span>
      </footer>
    </div>
  );
}
