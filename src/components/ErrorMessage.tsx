import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-4 sm:p-5 text-rose-900 shadow-xs">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-rose-900">Analysis Encountered an Error</h4>
          <p className="mt-1 text-xs text-rose-700 leading-relaxed">{message}</p>

          {onRetry && (
            <div className="mt-3">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700 transition-colors shadow-2xs cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Retry Analysis</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
