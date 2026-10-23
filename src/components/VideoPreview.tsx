import { forwardRef } from 'react';
import { Film, Trash2, RefreshCw, FileVideo, CheckCircle2 } from 'lucide-react';

interface VideoPreviewProps {
  videoFile: File;
  videoUrl: string;
  onReplace: () => void;
  onRemove: () => void;
  disabled?: boolean;
}

export const VideoPreview = forwardRef<HTMLVideoElement, VideoPreviewProps>(
  ({ videoFile, videoUrl, onReplace, onRemove, disabled = false }, ref) => {
    const formatBytes = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    return (
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/60">
              <FileVideo className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 truncate" title={videoFile.name}>
                {videoFile.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{formatBytes(videoFile.size)}</span>
                <span>•</span>
                <span className="uppercase text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                  {videoFile.type || videoFile.name.split('.').pop() || 'Video'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="h-3 w-3" /> Ready
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              disabled={disabled}
              onClick={onReplace}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Replace</span>
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={onRemove}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50/50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100/70 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>

        {/* Video Player Box */}
        <div className="mt-4 relative rounded-xl overflow-hidden bg-slate-950 aspect-video max-h-[380px] w-full flex items-center justify-center shadow-inner">
          <video
            ref={ref}
            src={videoUrl}
            controls
            playsInline
            className="w-full h-full object-contain max-h-[380px]"
          />
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Film className="h-3 w-3 text-slate-400" />
            Click timestamps in the analysis below to seek playback
          </span>
          <span>HTML5 Video Canvas</span>
        </div>
      </div>
    );
  }
);

VideoPreview.displayName = 'VideoPreview';
