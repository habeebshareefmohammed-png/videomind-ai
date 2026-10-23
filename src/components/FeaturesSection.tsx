import React from 'react';
import {
  Eye,
  Clock,
  Tag,
  Sliders,
  Globe,
  Download,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Eye,
      title: 'Multimodal Video Understanding',
      description:
        'Analyzes visual objects, people, spatial context, camera movement, and audio tracks in chronological synchrony.',
    },
    {
      icon: Clock,
      title: 'Key Moments with Timestamps',
      description:
        'Identifies major scene shifts and meaningful actions with precise MM:SS timestamps you can click to seek.',
    },
    {
      icon: Tag,
      title: 'Objects, People & Environment',
      description:
        'Extracts categorical pills of visible tools, subjects, activities, and ambient lighting conditions.',
    },
    {
      icon: Sliders,
      title: 'Tailored Tone & Style Presets',
      description:
        'Choose between General, Detailed, Professional, Social Media captions, or Accessibility audio description styles.',
    },
    {
      icon: Globe,
      title: 'Multilingual Output',
      description:
        'Generate descriptions in English, Spanish, French, German, Japanese, Chinese, Hindi, Arabic, or Portuguese.',
    },
    {
      icon: Download,
      title: 'One-Click Copy & Export',
      description:
        'Download clean TXT analysis dossiers or copy individual sections directly to your clipboard.',
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 border-t border-slate-200/80 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 font-mono">
            Features & Capabilities
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-heading">
            Engineered for Modern Video Workflows
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Everything content creators, marketers, educators, and software teams need to document and index video.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4 border border-indigo-100/60">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
