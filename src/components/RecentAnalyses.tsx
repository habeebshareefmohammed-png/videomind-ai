import React, { useState } from 'react';
import { History, FileVideo, Clock, Trash2, ArrowUpRight, Copy } from 'lucide-react';
import type { VideoAnalysisResult } from '../types';

interface RecentAnalysesProps {
  items: VideoAnalysisResult[];
  onSelect: (result: VideoAnalysisResult) => void;
  onDelete: (id: string) => void;
}

export const RecentAnalyses: React.FC<RecentAnalysesProps> = ({
  items,
  onSelect,
  onDelete,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (items.length === 0) return null;

  const handleCopySummary = (e: React.MouseEvent, result: VideoAnalysisResult) => {
    e.stopPropagation();
    navigator.clipboard.writeText(result.summary);
    setCopiedId(result.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <section className="mt-12 pt-8 border-t border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-slate-500" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Recent Analyses
          </h3>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
            {items.length} saved
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className="group relative flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer text-left"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <FileVideo className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 truncate" title={item.fileName}>
                    {item.fileName}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleDeleteItem(e, item.id)}
                  className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                  title="Remove from history"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                {item.summary}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="h-3 w-3" />
                {new Date(item.createdAt).toLocaleDateString()}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleCopySummary(e, item)}
                  className="hover:text-slate-700 flex items-center gap-0.5"
                  title="Copy summary"
                >
                  {copiedId === item.id ? (
                    <span className="text-emerald-600 font-medium">Copied!</span>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copy
                    </>
                  )}
                </button>
                <span className="text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center">
                  View <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
