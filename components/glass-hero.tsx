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
      { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full bg-[#050a18] text-white">

      {/* ══════════════════════ HERO ══════════════════════ */}
      <main
        ref={containerRef}
        className="sticky top-0 w-full h-screen overflow-hidden select-none touch-none z-0 bg-[#050a18]"
      >
        {/* Blue/Red Dual Web Grid Overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] pointer-events-none sp-web-grid opacity-40"
        />

        {/* Dynamic Blue & Red Radial Gradient Spotlight */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background: "radial-gradient(circle at 80% 20%, rgba(4, 118, 208, 0.25) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(230, 36, 41, 0.25) 0%, transparent 50%)",
          }}
        />

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

        {/* LAYER 3: Technical Web Circle */}
        <div aria-hidden="true" className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[72vw] h-[72vw] max-w-[820px] max-h-[820px] rounded-full border border-[#0476d0]/20 opacity-40" />
        </div>

        {/* Navigation Header */}
        <header
          className="absolute left-0 right-0 z-40 animate-fade-down flex items-center justify-between"
          style={{
            top: "max(2.5rem, env(safe-area-inset-top))",
            paddingLeft: "max(5.6vw, 2rem)",
            paddingRight: "max(5.6vw, 2rem)",
          }}
        >
          {/* Brand Mark */}
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#e62429] to-[#0476d0] text-white flex items-center justify-center shadow-lg shadow-red-600/30">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-label="Imdad brand mark">
                <path d="M5 4H19V7H14.5V17H19V20H5V17H9.5V7H5V4Z" fill="currentColor" />
              </svg>
            </div>
            <span className="font-sans text-lg font-bold tracking-tight text-white drop-shadow-md">Imdad</span>
          </div>

          {/* Desktop Nav Links */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8 text-sm font-medium tracking-tight text-white/80">
            {["About", "Work", "Process", "Experiments"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center hover:text-[#e62429] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e62429] rounded transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Right CTA */}
          <a
            href={TOPMATE_URL}
            target="_blank"
            rel="noreferrer"
            className="min-h-[44px] px-6 inline-flex items-center justify-center rounded-full bg-[#e62429] text-white text-sm font-semibold shadow-lg shadow-red-600/30 hover:bg-[#0476d0] hover:shadow-blue-600/30 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            Let's talk
          </a>
        </header>

        {/* Headline & Copy */}
        <section className="absolute inset-0 z-30 pointer-events-none">
          <div className="absolute max-w-[55vw] sm:max-w-xl" style={{ top: "32%", left: "max(4vw, 1.2rem)" }}>
            <h1 className="font-spider font-normal leading-[1] sm:leading-[0.95] tracking-[0.02em] text-[1.4rem] xs:text-[1.65rem] sm:text-[clamp(2.5rem,4.5vw,4.5rem)]">
              <span className="block animate-heading-1 text-white text-outline-dark">Building</span>
              <span className="block animate-heading-2 text-[#0476d0] text-outline-dark">Beyond</span>
              <span className="block animate-heading-3 text-[#e62429] text-outline-dark">Possible.</span>
            </h1>
          </div>

          <div
            className="absolute max-w-[65vw] sm:max-w-md animate-intro pointer-events-auto"
            style={{ bottom: "max(2.5rem, env(safe-area-inset-bottom))", left: "max(4vw, 1.2rem)" }}
          >
            <p className="font-sans text-xs sm:text-base text-slate-900 font-semibold leading-relaxed mb-4 bg-white/70 backdrop-blur-md p-3 rounded-2xl border border-white/50 shadow-lg">
              I build useful products, experiment with emerging technology, and turn the process into stories worth sharing.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={TOPMATE_URL}
                target="_blank"
                rel="noreferrer"
                className="min-h-[44px] px-5 inline-flex items-center justify-center rounded-full bg-[#0476d0] text-white text-xs sm:text-sm font-semibold shadow-md hover:bg-[#e62429] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                Explore my work
              </a>
              <img
                src="/images/pngwing.com.png"
                alt="Spider Emblem"
                className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(230,36,41,0.5)] opacity-90"
              />
            </div>
          </div>

          <div
            className="absolute hidden sm:block animate-manifesto"
            style={{ bottom: "max(2.5rem, env(safe-area-inset-bottom))", right: "max(5.6vw, 2rem)" }}
          >
            <p className="font-mono text-xs text-[#0476d0] uppercase tracking-widest leading-loose text-right">
              BUILDING THE<br />NEXT VERSION<br />IN PUBLIC
            </p>
          </div>
        </section>
      </main>

      {/* ══════════════════════ SECTIONS ══════════════════════ */}

      {/* — Section 01: About — */}
      <section id="about" className="relative w-full py-36 md:py-52 overflow-hidden bg-[#0b132b]">
        {/* Background Web Grid */}
        <div aria-hidden="true" className="absolute inset-0 sp-web-grid opacity-30 pointer-events-none" />

        {/* Decorative Number */}
        <span aria-hidden="true" className="absolute right-0 top-0 font-sans font-bold text-[clamp(10rem,22vw,22rem)] leading-none select-none pointer-events-none translate-x-8 text-[#0476d0]/10">
          01
        </span>

        <div className="relative px-[max(5.6vw,2rem)] max-w-screen-xl mx-auto">
          {/* Section Header */}
          <div
            className="reveal-on-scroll flex items-center gap-5 mb-20"
            style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.75s ease, transform 0.75s ease" }}
          >
            <span className="font-mono text-[0.65rem] tracking-[0.3em] text-[#e62429] uppercase font-bold">01 / About</span>
            <span className="flex-1 h-px bg-gradient-to-r from-[#e62429]/40 to-[#0476d0]/40" />
          </div>

          {/* Heading + Status */}
          <div
            className="reveal-on-scroll flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16"
            style={{ opacity: 0, transform: "translateY(36px)", transition: "opacity 0.95s ease 0.05s, transform 0.95s ease 0.05s" }}
          >
            <h2 className="font-spider font-normal text-white leading-[0.95] tracking-[0.01em] text-[clamp(2.2rem,4.5vw,4.2rem)] max-w-3xl">
              Builder.<br />
              <span className="text-[#0476d0]">Experimenter.</span><br />
              <span className="text-[#e62429]">Storyteller.</span>
            </h2>
            <div className="flex-shrink-0 mb-2">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#e62429]/40 bg-[#e62429]/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e62429] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e62429]" />
                </span>
                <span className="font-mono text-[0.65rem] tracking-widest text-white uppercase">Available for work</span>
              </div>
            </div>
          </div>

          {/* Line Divider */}
          <div
            className="reveal-on-scroll h-px mb-16"
            style={{ opacity: 0, transform: "scaleX(0)", transformOrigin: "left", transition: "opacity 0.7s ease 0.18s, transform 0.7s ease 0.18s", background: "linear-gradient(to right, #e62429, #0476d0, transparent)" }}
          />

          {/* Bio + Skills */}
          <div
            className="reveal-on-scroll grid md:grid-cols-[3fr_2fr] gap-14 md:gap-24 mb-16"
            style={{ opacity: 0, transform: "translateY(28px)", transition: "opacity 0.9s ease 0.28s, transform 0.9s ease 0.28s" }}
          >
            <div>
              <p className="font-sans text-lg md:text-xl leading-relaxed mb-8 text-white/80">
                I'm Imdad — a product builder who blends design intuition with engineering depth. I build tools that matter, ship fast, and share everything along the way.
              </p>
              <blockquote className="border-l-2 border-[#0476d0] pl-5 font-comback text-lg md:text-xl leading-relaxed text-white/80 mb-8">
                "With great code comes great responsibility — building products that feel inevitable in hindsight."
              </blockquote>

              {/* Spider-Man Multiverse Fun Fact Box */}
              <div className="p-5 rounded-2xl border border-[#e62429]/30 bg-[#e62429]/10 backdrop-blur-md">
                <span className="font-mono text-[0.65rem] tracking-[0.25em] text-[#e62429] uppercase font-bold block mb-2">🕷️ Multiverse Cannon Fact</span>
                <p className="font-sans text-sm text-white/90 font-medium leading-relaxed">
                  "Call me Spider-Man, because I lost my Gwen in every universe... but in this universe, I convert canon event pain into high-impact code & stories."
                </p>
              </div>
            </div>

            <div>
              <p className="font-mono text-[0.65rem] tracking-[0.25em] uppercase mb-5 text-[#0476d0]">Skills & tools</p>
              <div className="flex flex-wrap gap-2">
                {["Next.js", "React", "TypeScript", "Node.js", "AI / LLMs", "Figma", "Product Design", "Full-Stack", "Open Source", "Rapid Prototyping"].map((skill, idx) => (
                  <span
                    key={skill}
                    className="inline-block px-3 py-1.5 rounded-full font-mono text-[0.65rem] tracking-wide cursor-default transition-all duration-200"
                    style={{
                      border: idx % 2 === 0 ? "1px solid rgba(230, 36, 41, 0.3)" : "1px solid rgba(4, 118, 208, 0.3)",
                      color: "#ffffff",
                      background: idx % 2 === 0 ? "rgba(230, 36, 41, 0.1)" : "rgba(4, 118, 208, 0.1)"
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div
            className="reveal-on-scroll grid grid-cols-3 pt-10"
            style={{ opacity: 0, transform: "translateY(20px)", transition: "opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s", borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            {[
              { value: "3+", label: "Years building" },
              { value: "∞", label: "Experiments" },
              { value: "100%", label: "In public" },
            ].map((stat, i) => (
              <div key={stat.label} className={`flex flex-col gap-1.5 ${i > 0 ? "pl-8" : ""}`} style={i > 0 ? { borderLeft: "1px solid rgba(255,255,255,0.1)" } : {}}>
                <span className="font-sans font-semibold text-white text-2xl md:text-3xl tracking-tight">{stat.value}</span>
                <span className="font-mono text-[0.6rem] tracking-widest uppercase text-[#0476d0]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* — Marquee Strip — */}
      <div className="w-full py-3.5 overflow-hidden bg-gradient-to-r from-[#e62429] via-[#0476d0] to-[#e62429]">
        <div className="whitespace-nowrap animate-marquee inline-block">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="font-mono text-[0.65rem] tracking-[0.28em] uppercase mx-8 text-white font-semibold">
              Building Beyond Possible &nbsp;·&nbsp; Classic Red & Blue &nbsp;·&nbsp; AI Experiments &nbsp;·&nbsp; In Public &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* — Section 02: Work — */}
      <section id="work" className="relative w-full py-36 md:py-52 overflow-hidden bg-[#050a18]">
        <div aria-hidden="true" className="absolute inset-0 sp-web-grid opacity-30 pointer-events-none" />
        <span aria-hidden="true" className="absolute left-0 top-0 font-sans font-bold text-[clamp(10rem,22vw,22rem)] leading-none select-none pointer-events-none -translate-x-8 text-[#e62429]/10">
          02
        </span>

        <div className="relative px-[max(5.6vw,2rem)] max-w-screen-xl mx-auto">
          <div
            className="reveal-on-scroll flex items-center gap-5 mb-20"
            style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.75s ease, transform 0.75s ease" }}
          >
            <span className="font-mono text-[0.65rem] tracking-[0.3em] text-[#0476d0] uppercase font-bold">02 / Selected Work</span>
            <span className="flex-1 h-px bg-gradient-to-r from-[#0476d0]/40 to-[#e62429]/40" />
            <span className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-white/40">2024 – 2025</span>
          </div>

          <h2
            className="reveal-on-scroll font-sans font-medium text-white leading-[0.9] tracking-[-0.06em] text-[clamp(3rem,7vw,7rem)] mb-20"
            style={{ opacity: 0, transform: "translateY(48px)", transition: "opacity 1s ease 0.08s, transform 1s ease 0.08s" }}
          >
            Experiments in<br />
            <span className="text-[#0476d0]">emerging</span> <span className="text-[#e62429]">technology.</span>
          </h2>

          <div className="border-t border-white/10">
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
                <div className="flex items-center justify-between py-8 cursor-pointer border-b border-white/10 hover:border-[#e62429]/50 transition-colors">
                  <div className="flex items-center gap-6 md:gap-10">
                    <span className="font-mono text-[0.65rem] tracking-widest w-5 text-[#e62429]">{project.num}</span>
                    <div>
                      <p className="font-sans font-medium text-white text-lg md:text-2xl tracking-tight group-hover:translate-x-2 group-hover:text-[#0476d0] transition-all duration-300">
                        {project.title}
                      </p>
                      <p className="font-sans text-sm mt-1 hidden md:block text-white/50">{project.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 md:gap-10">
                    <span className="hidden md:block font-mono text-[0.65rem] tracking-widest uppercase text-[#0476d0]">{project.tag}</span>
                    <span className="font-mono text-[0.65rem] hidden sm:block text-white/40">{project.year}</span>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center border border-white/20 group-hover:bg-[#e62429] group-hover:border-[#e62429] transition-all duration-300">
                      <svg className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" viewBox="0 0 14 14" fill="none">
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

      {/* — Section 03: Contact — */}
      <section id="process" className="relative w-full py-36 md:py-52 overflow-hidden bg-[#e62429]">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none sp-web-grid opacity-20" />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 20% 50%, rgba(4, 118, 208, 0.4) 0%, transparent 60%)" }} />

        <span aria-hidden="true" className="absolute right-0 top-0 font-sans font-bold text-[clamp(10rem,22vw,22rem)] leading-none select-none pointer-events-none translate-x-8 text-black/10">
          03
        </span>

        <div className="relative px-[max(5.6vw,2rem)] max-w-screen-xl mx-auto">
          <div
            className="reveal-on-scroll flex items-center gap-5 mb-20"
            style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.75s ease, transform 0.75s ease" }}
          >
            <span className="font-mono text-[0.65rem] tracking-[0.3em] text-white uppercase font-bold">03 / Let's Build</span>
            <span className="flex-1 h-px bg-white/30" />
          </div>

          <h2
            className="reveal-on-scroll font-sans font-medium text-white leading-[0.9] tracking-[-0.06em] text-[clamp(3rem,7vw,7rem)] mb-16"
            style={{ opacity: 0, transform: "translateY(48px)", transition: "opacity 1s ease 0.08s, transform 1s ease 0.08s" }}
          >
            Have an idea<br />
            worth building?
          </h2>

          <div
            className="reveal-on-scroll h-px bg-white/30 mb-16"
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
              className="group inline-flex items-center gap-4 px-8 py-5 rounded-full font-semibold text-sm transition-all shadow-2xl bg-[#0476d0] text-white hover:bg-white hover:text-[#e62429] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              Get in touch
              <span className="w-5 h-5 rounded-full bg-white text-[#0476d0] group-hover:bg-[#e62429] group-hover:text-white flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none">
                  <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
            <p className="font-sans text-sm leading-relaxed max-w-xs text-white/80">
              Open to projects, collabs, and conversations about things that matter.
            </p>
          </div>
        </div>
      </section>

      {/* — Footer — */}
      <footer className="w-full py-8 px-[max(5.6vw,2rem)] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#050a18] border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md flex items-center justify-center bg-gradient-to-r from-[#e62429] to-[#0476d0]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 4H19V7H14.5V17H19V20H5V17H9.5V7H5V4Z" fill="white" />
            </svg>
          </div>
          <span className="font-mono text-[0.65rem] tracking-widest uppercase text-white/60">© 2025 Imdad</span>
        </div>
        <span className="font-mono text-[0.65rem] tracking-widest uppercase text-[#0476d0]">Building In Public — Classic Red & Blue</span>
      </footer>
    </div>
  );
}
