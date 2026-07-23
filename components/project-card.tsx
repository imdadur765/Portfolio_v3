'use client';

import React from 'react';
import { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const isEven = index % 2 === 0;

  return (
    <article className="group relative w-full rounded-2xl sm:rounded-3xl bg-[#e8f2fa]/70 border border-white/80 p-6 sm:p-10 md:p-12 shadow-[-8px_-8px_24px_rgba(255,255,255,0.9),8px_8px_24px_rgba(13,21,32,0.08)] hover:shadow-[-12px_-12px_32px_rgba(255,255,255,1),12px_12px_32px_rgba(13,21,32,0.12)] transition-all duration-500 backdrop-blur-md">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Project Info Block */}
        <div
          className={`lg:col-span-6 flex flex-col justify-between h-full ${
            isEven ? 'lg:order-1' : 'lg:order-2'
          }`}
        >
          <div>
            {/* Index & Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-['Fragment_Mono',monospace] text-xs font-semibold text-[#0d1520]/50 tracking-wider">
                0{index + 1} //
              </span>
              <span className="font-['Fragment_Mono',monospace] text-[0.7rem] uppercase tracking-widest px-3 py-1 rounded-full bg-white/80 text-[#0d1520] font-semibold border border-white shadow-sm">
                {project.badge}
              </span>
            </div>

            {/* Title & Tagline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#0d1520] tracking-tight mb-2 group-hover:text-[#0d1520] transition-colors">
              {project.title}
            </h2>
            <p className="font-['Fragment_Mono',monospace] text-xs sm:text-sm text-[#0d1520]/70 mb-4 font-medium">
              {project.tagline}
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#0d1520]/80 leading-relaxed mb-6">
              {project.description}
            </p>

            {/* Key Features Bullet List */}
            <ul className="space-y-2 mb-8">
              {project.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2.5 text-xs sm:text-sm text-[#0d1520]/90"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0d1520]/60 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-[0.75rem] font-medium px-3 py-1 rounded-md bg-white/60 text-[#0d1520]/80 border border-white/80 shadow-xs"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Neumorphic Action Button */}
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-[#dce7f0] text-[#0d1520] font-semibold text-sm border border-white/80 shadow-[-5px_-5px_12px_#ffffff,5px_5px_12px_rgba(13,21,32,0.14)] hover:shadow-[-2px_-2px_6px_#ffffff,2px_2px_6px_rgba(13,21,32,0.18)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[inset_2px_2px_5px_rgba(13,21,32,0.15),inset_-2px_-2px_5px_#ffffff] transition-all duration-300 w-full sm:w-auto"
            >
              <span>Visit Live Website</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Project Visual Showcase Preview Box */}
        <div
          className={`lg:col-span-6 ${
            isEven ? 'lg:order-2' : 'lg:order-1'
          }`}
        >
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="block relative w-full aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden border border-white/60 bg-gradient-to-br from-[#dce7f0] to-[#c8d9e6] p-6 sm:p-8 shadow-inner group-hover:border-white transition-all duration-500"
          >
            {/* Interactive Device Mockup Window Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#0d1520]/10 mb-6">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <span className="font-['Fragment_Mono',monospace] text-[0.65rem] text-[#0d1520]/60 truncate max-w-[200px]">
                {project.liveUrl.replace('https://', '')}
              </span>
            </div>

            {/* Inner Content Card Preview */}
            <div className="relative h-full flex flex-col justify-center items-center text-center p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/50 group-hover:bg-white/60 transition-all duration-300">
              <span className="font-['Fragment_Mono',monospace] text-xs uppercase tracking-widest text-[#0d1520]/60 mb-2">
                {project.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0d1520] mb-3">
                {project.title}
              </h3>
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#0d1520] px-4 py-2 rounded-full bg-white shadow-sm border border-white/80 group-hover:scale-105 transition-transform duration-300">
                <span>Explore Project</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </a>
        </div>
      </div>
    </article>
  );
}
