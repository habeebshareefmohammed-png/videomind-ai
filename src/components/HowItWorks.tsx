import React from 'react';
import { UploadCloud, Cpu, Sparkles, CheckCircle } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: UploadCloud,
      title: 'Upload Any Video File',
      description:
        'Drag and drop your MP4, MOV, WebM, MKV, or AVI video. Our client validates size and container headers instantly with full local preview.',
    },
    {
      step: '02',
      icon: Cpu,
      title: 'Multimodal AI Vision & Audio',
      description:
        'The AI agent deconstructs visual frames, tracks chronological action flow, notes scene transitions, and extracts ambient audio cues.',
    },
    {
      step: '03',
      icon: Sparkles,
      title: 'Get Structured Results',
      description:
        'Receive a structured summary, chronological key moments with timestamps, identified subjects & objects, and social captions with 1-click export.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 border-t border-slate-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 font-mono">
            How It Works
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-heading">
            Three Simple Steps to Video Intelligence
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            No complicated prompt engineering or manual timestamps. Just upload and let the multimodal model do the heavy lifting.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 sm:p-8 flex flex-col justify-between hover:border-indigo-300 hover:bg-slate-50 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/70">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-2xl font-black text-slate-300">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-xs text-indigo-700 font-medium">
                  <CheckCircle className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Automated & Secure</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
