'use client';

import React from 'react';

export default function WorkHero() {
  return (
    <header className="relative w-full pt-28 pb-12 sm:pt-36 sm:pb-16 px-[max(5.6vw,1.25rem)] border-b border-[#0d1520]/10">
      <div className="max-w-[1720px] mx-auto">
        {/* Top Tag & Counter */}
        <div className="flex items-center gap-3 mb-6 animate-nav-down">
          <span className="font-['Fragment_Mono',monospace] text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-[#0d1520]/5 text-[#0d1520]/80 font-medium border border-[#0d1520]/10">
            SHOWCASE // 04 PROJECTS
          </span>
          <span className="h-px w-12 bg-[#0d1520]/20" />
        </div>

        {/* Hero Title & Intro Subtext */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <h1
              className="text-[#0d1520] font-normal leading-[0.92] tracking-[-0.075em] select-none"
              style={{ fontSize: 'clamp(2.8rem, 8.5vw, 6.5rem)' }}
            >
              Selected
              <br />
              <span className="italic font-serif font-light text-[#0d1520]/90">
                Works.
              </span>
            </h1>
          </div>

          <div className="lg:col-span-4 lg:pb-2">
            <p className="font-['Albert_Sans',sans-serif] text-base sm:text-lg text-[#0d1520]/80 leading-relaxed max-w-lg">
              A curated collection of web applications, dev tools, e-commerce storefronts, and digital publishing platforms built with Next.js, React, and TypeScript.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
