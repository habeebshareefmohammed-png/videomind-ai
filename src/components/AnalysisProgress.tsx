import React from 'react';
import { Loader2, XCircle, FileVideo, Sparkles } from 'lucide-react';
import type { AnalysisJob } from '../types';

interface AnalysisProgressProps {
  job: AnalysisJob;
  onCancel: () => void;
  cancelling?: boolean;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  job,
  onCancel,
  cancelling = false,
}) => {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <FileVideo className="h-6 w-6" />
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xs">
              <Sparkles className="h-3 w-3" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
              {job.fileName}
            </h3>
            <p className="text-xs text-slate-500">
              {formatBytes(job.fileSizeBytes)} • Multimodal AI Pipeline Active
            </p>
          </div>
        </div>

        {/* Cancel button */}
        <button
          type="button"
          onClick={onCancel}
          disabled={cancelling}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-50"
        >
          <XCircle className="h-3.5 w-3.5 text-slate-400" />
          <span>{cancelling ? 'Cancelling...' : 'Cancel Analysis'}</span>
        </button>
      </div>

      {/* Animated Status Area */}
      <div className="mt-8 text-center max-w-lg mx-auto">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-indigo-50/80 mb-4 ring-8 ring-indigo-50/40">
          <Loader2 className="h-7 w-7 text-indigo-600 animate-spin" />
        </div>

        <h4 className="text-base font-semibold text-slate-900">
          {job.statusMessage || 'Analyzing video content...'}
        </h4>
        <p className="mt-1 text-xs text-slate-500">
          Our AI agent is deconstructing frames, detecting scenes, and synthesizing structured notes.
        </p>

        {/* Real Progress Bar */}
        <div className="mt-6 w-full">
          <div className="flex justify-between items-center text-xs font-mono text-slate-500 mb-1.5">
            <span>Progress</span>
            <span className="font-semibold text-indigo-600">{job.progressPercent}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-sky-500 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${Math.max(5, Math.min(100, job.progressPercent))}%` }}
            />
          </div>
        </div>

        {/* Processing step indicators */}
        <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-400">
          <div className={`p-2 rounded-lg ${job.progressPercent >= 20 ? 'bg-indigo-50 text-indigo-700 font-medium' : 'bg-slate-50'}`}>
            1. Decode Frames
          </div>
          <div className={`p-2 rounded-lg ${job.progressPercent >= 60 ? 'bg-indigo-50 text-indigo-700 font-medium' : 'bg-slate-50'}`}>
            2. Scene & Audio Vision
          </div>
          <div className={`p-2 rounded-lg ${job.progressPercent >= 90 ? 'bg-indigo-50 text-indigo-700 font-medium' : 'bg-slate-50'}`}>
            3. Synthesize Insights
          </div>
        </div>
      </div>
    </div>
  );
};
