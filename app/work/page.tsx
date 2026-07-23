'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import WorkHero from '@/components/work-hero';
import ProjectCard from '@/components/project-card';
import { PROJECTS } from '@/data/projects';

const CATEGORIES = ['All', 'E-Commerce', 'DevTools', 'SaaS', 'Publishing'] as const;

export default function WorkPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredProjects =
    selectedCategory === 'All'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === selectedCategory);

  return (
    <main className="relative min-h-screen w-full bg-[#dce7f0] text-[#0d1520] selection:bg-[#0d1520] selection:text-white">
      {/* Background Subtle Grid Lines */}
      <div
        className="fixed inset-0 opacity-[0.14] pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(13, 21, 32, 0.35) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(13, 21, 32, 0.35) 1px, transparent 1px)
          `,
          backgroundSize: '12vw 12vw',
        }}
      />

      {/* Header Navigation */}
      <header
        className="fixed top-0 left-0 w-full z-40 pointer-events-auto bg-[#dce7f0]/80 backdrop-blur-md border-b border-[#0d1520]/5"
        style={{
          paddingTop: 'max(1.2rem, env(safe-area-inset-top))',
          paddingBottom: '1.2rem',
          paddingLeft: 'max(5.6vw, 1.25rem)',
          paddingRight: 'max(5.6vw, 1.25rem)',
        }}
      >
        <nav className="flex items-center justify-between w-full max-w-[1720px] mx-auto">
          {/* Brand Logo Image */}
          <Link
            href="/"
            className="flex items-center gap-2 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black rounded-lg min-h-[44px]"
          >
            <img
              src="/images/imdad_logo.png"
              alt="Imdad"
              className="h-10 sm:h-12 w-auto object-contain brightness-0 transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Right Action: Back to Home Neumorphic Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#dce7f0] text-[#0d1520] font-medium text-sm border border-white/60 shadow-[-5px_-5px_12px_#ffffff,5px_5px_12px_rgba(13,21,32,0.14)] hover:shadow-[-2px_-2px_6px_#ffffff,2px_2px_6px_rgba(13,21,32,0.18)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[inset_2px_2px_5px_rgba(13,21,32,0.15),inset_-2px_-2px_5px_#ffffff] transition-all duration-200"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
            >
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Back to Home</span>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <div className="relative z-10">
        <WorkHero />

        {/* Category Filter Tabs Section */}
        <section className="w-full px-[max(5.6vw,1.25rem)] py-8 max-w-[1720px] mx-auto">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-['Fragment_Mono',monospace] text-xs text-[#0d1520]/60 uppercase tracking-widest mr-2">
              Filter:
            </span>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#0d1520] text-white shadow-md'
                      : 'bg-white/60 text-[#0d1520]/80 hover:bg-white border border-white/80'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* Projects Cards Grid */}
        <section className="w-full px-[max(5.6vw,1.25rem)] pb-24 max-w-[1720px] mx-auto space-y-12 sm:space-y-16">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </section>

        {/* Footer */}
        <footer className="w-full py-12 px-[max(5.6vw,1.25rem)] border-t border-[#0d1520]/10 text-center">
          <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-['Fragment_Mono',monospace] text-xs text-[#0d1520]/60">
              © {new Date().getFullYear()} IMDAD — BUILDING BEYOND POSSIBLE
            </p>
            <Link
              href="/"
              className="text-xs font-semibold text-[#0d1520] hover:underline"
            >
              Return to Top ↑
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
