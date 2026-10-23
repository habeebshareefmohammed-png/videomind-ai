import React, { useState, useRef } from 'react';
import { UploadCloud, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface VideoUploaderProps {
  onVideoSelected: (file: File) => void;
  maxSizeBytes: number;
  supportedFormats: string[];
  disabled?: boolean;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  onVideoSelected,
  maxSizeBytes,
  supportedFormats,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxMb = Math.round(maxSizeBytes / (1024 * 1024));

  const validateAndSelect = (file: File) => {
    setValidationError(null);

    // Validate size
    if (file.size > maxSizeBytes) {
      setValidationError(`File exceeds maximum size of ${maxMb}MB. Please select a smaller video.`);
      return;
    }

    // Validate extension
    const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
    const isSupported = supportedFormats.includes(ext) || file.type.startsWith('video/');

    if (!isSupported) {
      setValidationError(
        `Unsupported format. Please select one of: ${supportedFormats.join(', ')}`
      );
      return;
    }

    onVideoSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSelect(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelect(e.target.files[0]);
    }
  };

  // Helper to create an instant lightweight sample video blob for instant testing!
  const handleLoadSampleVideo = async (sampleName: string) => {
    try {
      // Create a canvas-based sample WebM video on the fly!
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 360;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const stream = canvas.captureStream(25);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const sampleFile = new File([blob], `${sampleName.toLowerCase().replace(/\s+/g, '-')}-demo.webm`, {
          type: 'video/webm',
        });
        validateAndSelect(sampleFile);
      };

      recorder.start();

      // Animate 4 seconds of frames
      let frame = 0;
      const interval = setInterval(() => {
        frame++;
        // Draw background gradient
        const grad = ctx.createLinearGradient(0, 0, 640, 360);
        grad.addColorStop(0, '#1e1b4b');
        grad.addColorStop(1, '#312e81');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 640, 360);

        // Draw animated geometric element
        ctx.fillStyle = '#6366f1';
        const x = 120 + Math.sin(frame / 10) * 100;
        const y = 140 + Math.cos(frame / 10) * 50;
        ctx.beginPath();
        ctx.arc(x, y, 40, 0, Math.PI * 2);
        ctx.fill();

        // Secondary element
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(350 + Math.cos(frame / 15) * 80, 160, 60, 60);

        // Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Inter, sans-serif';
        ctx.fillText(`VideoMind AI Demo: ${sampleName}`, 50, 60);
        ctx.font = '16px Inter, sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(`Time: ${(frame * 0.04).toFixed(1)}s • Multimodal Vision Stream`, 50, 95);

        if (frame >= 75) {
          clearInterval(interval);
          recorder.stop();
        }
      }, 40);
    } catch {
      setValidationError('Could not initialize sample video generator.');
    }
  };

  return (
    <div className="w-full">
      {/* Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer ${
          disabled ? 'opacity-50 pointer-events-none' : ''
        } ${
          isDragging
            ? 'border-indigo-600 bg-indigo-50/60 ring-4 ring-indigo-100 scale-[1.005]'
            : 'border-slate-300/90 bg-white hover:border-indigo-400 hover:bg-slate-50/60 shadow-xs'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={supportedFormats.join(',') || 'video/*'}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Upload Icon */}
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-transform ${
            isDragging
              ? 'bg-indigo-600 text-white scale-110'
              : 'bg-indigo-50 text-indigo-600 group-hover:scale-105'
          }`}
        >
          <UploadCloud className="h-8 w-8" />
        </div>

        {/* Primary Instructions */}
        <div className="mt-4 space-y-1">
          <p className="text-base font-semibold text-slate-800">
            Drag and drop your video here
          </p>
          <p className="text-sm text-slate-500">
            or <span className="font-semibold text-indigo-600 underline">browse files</span> from your device
          </p>
        </div>

        {/* Supported Formats & Limits */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
          <span className="font-medium text-slate-600">Supported:</span>
          {supportedFormats.map((fmt) => (
            <span
              key={fmt}
              className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-medium text-slate-700 uppercase"
            >
              {fmt.replace('.', '')}
            </span>
          ))}
          <span className="text-slate-400">•</span>
          <span>Up to {maxMb}MB</span>
        </div>

        {/* Sample video quick chips */}
        <div
          className="mt-6 pt-5 border-t border-slate-100 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 mb-2.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>No video at hand? Try an instant demo:</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleLoadSampleVideo('Product Demo')}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors cursor-pointer"
            >
              🎬 Product Demo
            </button>
            <button
              type="button"
              onClick={() => handleLoadSampleVideo('Spatial Motion')}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors cursor-pointer"
            >
              🌌 Spatial Motion
            </button>
          </div>
        </div>
      </div>

      {/* Validation Error Alert */}
      {validationError && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
        <span>
          Your video is processed securely. Files are handled according to our configured retention policy.
        </span>
      </div>
    </div>
  );
};
