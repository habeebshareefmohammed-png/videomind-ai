import React from 'react';
import { Video, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 text-slate-500 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
          {/* Logo & Tagline */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Video className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                <span className="font-bold text-slate-900 font-heading">
                  VideoMind AI
                </span>
                <span className="text-[10px] rounded bg-slate-100 px-1.5 py-0.2 font-mono text-slate-600">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Modern AI video description, scene indexation & structured insight generator.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600 font-medium">
            <a href="#hero" className="hover:text-indigo-600 transition-colors">
              Home
            </a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-indigo-600 transition-colors">
              Features
            </a>
            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-600 transition-colors"
            >
              Google AI Studio
            </a>
          </div>
        </div>

        {/* Bottom Disclaimers */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 text-center sm:text-left">
          <p className="flex items-center gap-1 justify-center">
            <Shield className="h-3 w-3 text-slate-400" />
            <span>
              Secure processing. Temporary video files are automatically removed upon analysis completion.
            </span>
          </p>
          <p>
            © {new Date().getFullYear()} VideoMind AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
