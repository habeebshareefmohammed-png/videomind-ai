import React, { useState } from 'react';
import { Video, Sparkles, Settings, Menu, X, Cpu } from 'lucide-react';
import type { SystemStatus } from '../types';

interface NavbarProps {
  systemStatus: SystemStatus | null;
  onOpenSettings: () => void;
  onScrollToWorkspace: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  systemStatus,
  onOpenSettings,
  onScrollToWorkspace,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200 transition-transform group-hover:scale-105">
              <Video className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900 font-heading">
                  VideoMind
                </span>
                <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-100/80">
                  AI
                </span>
              </div>
            </div>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a
            href="#hero"
            className="transition-colors hover:text-slate-900"
          >
            Home
          </a>
          <button
            onClick={onScrollToWorkspace}
            className="transition-colors hover:text-slate-900 cursor-pointer"
          >
            Workspace
          </button>
          <a
            href="#how-it-works"
            className="transition-colors hover:text-slate-900"
          >
            How It Works
          </a>
          <a
            href="#features"
            className="transition-colors hover:text-slate-900"
          >
            Features
          </a>
        </nav>

        {/* Action Controls & AI Provider Status */}
        <div className="hidden md:flex items-center gap-3">
          {/* AI Mode indicator pill */}
          <button
            onClick={onOpenSettings}
            title="Configure AI Provider or API Key"
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                systemStatus?.hasGeminiKey
                  ? 'bg-emerald-500 animate-pulse'
                  : 'bg-amber-500'
              }`}
            />
            <Cpu className="h-3.5 w-3.5 text-slate-500" />
            <span>
              {systemStatus?.hasGeminiKey ? 'Gemini 1.5 Live' : 'Demo Simulation Mode'}
            </span>
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            title="Settings & API Key"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* Primary CTA */}
          <button
            onClick={onScrollToWorkspace}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 active:scale-98 transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Analyze Video</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-600 hover:text-slate-900"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <a
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-indigo-600"
          >
            Home
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollToWorkspace();
            }}
            className="block w-full text-left py-2 text-base font-medium text-slate-700 hover:text-indigo-600"
          >
            Workspace
          </button>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-indigo-600"
          >
            How It Works
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-indigo-600"
          >
            Features
          </a>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSettings();
              }}
              className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
            >
              <span>AI Provider Status</span>
              <span className="text-xs font-semibold text-indigo-600">
                {systemStatus?.hasGeminiKey ? 'Gemini Live' : 'Demo Mode'}
              </span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToWorkspace();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-sm"
            >
              <Sparkles className="h-4 w-4" />
              <span>Analyze Video Now</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
