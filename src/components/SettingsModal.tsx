import React, { useState } from 'react';
import { X, Key, Shield, CheckCircle2, ExternalLink, Cpu } from 'lucide-react';
import type { SystemStatus } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemStatus: SystemStatus | null;
  userApiKey: string;
  onSaveUserApiKey: (key: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  systemStatus,
  userApiKey,
  onSaveUserApiKey,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState(userApiKey);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUserApiKey(apiKeyInput);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const hasEffectiveKey = Boolean(
    (apiKeyInput && apiKeyInput.trim().length > 5) || systemStatus?.hasGeminiKey
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                AI Provider & System Settings
              </h3>
              <p className="text-xs text-slate-500">
                Configure your multimodal video analysis backend
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status summary */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Active AI Mode:</span>
              <span
                className={`font-semibold flex items-center gap-1.5 ${
                  hasEffectiveKey ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    hasEffectiveKey ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                {hasEffectiveKey ? 'Live Google Gemini 1.5' : 'Intelligent Demo Simulation'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">Server Backend:</span>
              <span className="font-mono text-slate-800">
                {systemStatus ? 'Online (Port 5000)' : 'Connecting...'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">Max Video Size Limit:</span>
              <span className="font-medium text-slate-800">
                {systemStatus ? `${systemStatus.maxFileSizeMB} MB` : '150 MB'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">Server .env Key:</span>
              <span className="font-medium text-slate-800">
                {systemStatus?.hasGeminiKey ? 'Configured in .env' : 'Not set in .env'}
              </span>
            </div>
          </div>

          {/* User API Key configuration form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Custom Google Gemini API Key (Optional)</span>
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <span>Get Free Key</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 font-mono placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
              />

              <p className="mt-2 text-[11px] text-slate-500 leading-normal">
                If provided, this key is securely passed in request headers to communicate with Google Gemini.
                Leave blank to use server environment key or run in Demo Simulation Mode.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Shield className="h-3 w-3" /> Stored locally in your browser
              </span>

              <div className="flex items-center gap-2">
                {saveSuccess && (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Saved!
                  </span>
                )}
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
