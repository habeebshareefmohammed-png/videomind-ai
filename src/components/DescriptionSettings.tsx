import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp, Globe, Sparkles } from 'lucide-react';
import type { AnalysisOptions, DescriptionStyle, DescriptionLength } from '../types';

interface DescriptionSettingsProps {
  options: AnalysisOptions;
  onChange: (options: AnalysisOptions) => void;
  disabled?: boolean;
}

const STYLES: { id: DescriptionStyle; label: string; desc: string }[] = [
  { id: 'general', label: 'General', desc: 'Clear, balanced, and accessible for any audience.' },
  { id: 'detailed', label: 'Detailed', desc: 'Comprehensive frame-by-frame visual and temporal depth.' },
  { id: 'professional', label: 'Professional', desc: 'Structured, objective tone ideal for business and docs.' },
  { id: 'social', label: 'Social Media', desc: 'High-energy, engaging with hashtags and emojis.' },
  { id: 'accessibility', label: 'Accessibility', desc: 'Screen-reader friendly descriptive narration.' },
];

const LENGTHS: { id: DescriptionLength; label: string }[] = [
  { id: 'short', label: 'Short' },
  { id: 'medium', label: 'Medium' },
  { id: 'long', label: 'Long' },
];

const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Japanese',
  'Chinese (Mandarin)',
  'Hindi',
  'Arabic',
  'Portuguese',
  'Italian',
];

export const DescriptionSettings: React.FC<DescriptionSettingsProps> = ({
  options,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden transition-all">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50/70 transition-colors cursor-pointer disabled:opacity-60"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800">
                Analysis Options
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                {STYLES.find((s) => s.id === options.style)?.label} • {options.length} • {options.language}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Customize output tone, verbosity, and target language
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-xs hidden sm:inline">
            {isOpen ? 'Hide Options' : 'Customize'}
          </span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {/* Accordion Body */}
      {isOpen && (
        <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-5 bg-slate-50/40">
          {/* Style Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Description Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {STYLES.map((style) => {
                const isSelected = options.style === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange({ ...options, style: style.id })}
                    className={`flex flex-col text-left p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-1 ring-indigo-600'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-900 mb-1">
                      <span>{style.label}</span>
                      {isSelected && <Sparkles className="h-3 w-3 text-indigo-600" />}
                    </div>
                    <span className="text-[11px] text-slate-500 leading-snug">
                      {style.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Length & Language Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Length Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Output Length
              </label>
              <div className="flex rounded-lg border border-slate-200 bg-white p-1">
                {LENGTHS.map((len) => {
                  const isSelected = options.length === len.id;
                  return (
                    <button
                      key={len.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => onChange({ ...options, length: len.id })}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {len.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Language Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-slate-400" />
                <span>Output Language</span>
              </label>
              <select
                disabled={disabled}
                value={options.language}
                onChange={(e) => onChange({ ...options, language: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
