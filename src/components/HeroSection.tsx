import React from 'react';
import { Sparkles, ArrowRight, Play, CheckCircle2, FileText } from 'lucide-react';

interface HeroSectionProps {
  onAnalyzeClick: () => void;
  onHowItWorksClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onAnalyzeClick,
  onHowItWorksClick,
}) => {
  return (
    <section id="hero" className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Subtle background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-100/50 via-sky-50/40 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/90 px-3.5 py-1.5 text-xs font-medium text-indigo-900 shadow-xs mb-6 backdrop-blur-xs">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          <span>Multimodal Video Intelligence Engine</span>
        </div>

        {/* Main Headline */}
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl font-heading leading-[1.12]">
          Turn Any Video Into a Clear,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-sky-600">
            Detailed Description.
          </span>
        </h1>

        {/* Supporting text */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed">
          Upload a video and let AI understand its content, identify important moments,
          and generate a description in seconds.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onAnalyzeClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700 active:scale-98 transition-all cursor-pointer"
          >
            <span>Analyze Your Video</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={onHowItWorksClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
          >
            <Play className="h-4 w-4 text-slate-500 fill-slate-500" />
            <span>See How It Works</span>
          </button>
        </div>

        {/* Feature quick tags */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Frame-by-frame scene analysis</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Chronological key moments</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Zero manual typing needed</span>
          </div>
        </div>

        {/* Interactive Subtle Visual Representation */}
        <div className="mt-12 mx-auto max-w-4xl rounded-2xl border border-slate-200/90 bg-white p-3 shadow-lg shadow-slate-200/50">
          <div className="rounded-xl border border-slate-100 bg-slate-900 text-left overflow-hidden">
            {/* Window bar */}
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5 bg-slate-950/60">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400">
                  videomind-ai // demo-stream.mp4
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Multimodal Vision Ready</span>
              </div>
            </div>

            {/* Split Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-800">
              {/* Left: Video Frame Simulation */}
              <div className="md:col-span-5 p-4 flex flex-col justify-between bg-slate-900/90">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center group">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10" />
                  
                  {/* Visual mockup frames */}
                  <div className="text-center p-4 z-20">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600/90 text-white shadow-md">
                      <Play className="h-5 w-5 ml-0.5 fill-white" />
                    </div>
                    <p className="mt-2 text-xs font-medium text-slate-300">
                      Sample Product Walkthrough
                    </p>
                    <span className="inline-block mt-1 font-mono text-[10px] text-slate-400">
                      00:24 / 01:15 • 1080p
                    </span>
                  </div>

                  {/* Bounding box mock indicator */}
                  <div className="absolute top-3 left-4 border border-indigo-400/80 bg-indigo-500/10 rounded px-1.5 py-0.5 text-[9px] font-mono text-indigo-300">
                    Subject: Presenter (98%)
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>MP4 • 24.5 MB</span>
                  <span className="text-indigo-400">Audio track active</span>
                </div>
              </div>

              {/* Right: AI Output Mockup */}
              <div className="md:col-span-7 p-4 bg-slate-900/60">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                    <FileText className="h-3.5 w-3.5 text-indigo-400" />
                    <span>AI Video Insights</span>
                  </div>
                  <span className="rounded bg-indigo-950 px-2 py-0.5 text-[10px] font-medium text-indigo-300 border border-indigo-800">
                    Confidence: 96%
                  </span>
                </div>

                <div className="mt-3 space-y-2.5 text-left text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Summary
                    </span>
                    <p className="mt-0.5 text-slate-300 line-clamp-2 leading-relaxed">
                      A software engineer introduces an AI robotics pipeline in a well-lit studio,
                      demonstrating real-time spatial navigation and user voice controls.
                    </p>
                  </div>

                  <div className="pt-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Key Moments
                    </span>
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center gap-2 text-[11px] text-slate-300">
                        <span className="font-mono text-indigo-400 bg-indigo-950/70 px-1 py-0.5 rounded text-[10px]">
                          00:00 - 00:08
                        </span>
                        <span className="truncate">Opening overview and hardware display</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-300">
                        <span className="font-mono text-indigo-400 bg-indigo-950/70 px-1 py-0.5 rounded text-[10px]">
                          00:09 - 00:21
                        </span>
                        <span className="truncate">Live spatial tracking demonstration</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                      #Robotics
                    </span>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                      #ComputerVision
                    </span>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                      #LiveDemo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
