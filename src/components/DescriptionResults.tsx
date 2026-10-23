import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  RotateCw,
  Edit3,
  Save,
  Undo2,
  Clock,
  Sparkles,
  Layers,
  Share2,
  Volume2,
  Info,
  ChevronDown,
  ChevronUp,
  Tag,
  PlusCircle,
  Eye,
} from 'lucide-react';
import type { VideoAnalysisResult } from '../types';

interface DescriptionResultsProps {
  result: VideoAnalysisResult;
  onRegenerate: () => void;
  onAnalyzeAnother: () => void;
  onSeekTimestamp?: (seconds: number) => void;
}

export const DescriptionResults: React.FC<DescriptionResultsProps> = ({
  result,
  onRegenerate,
  onAnalyzeAnother,
  onSeekTimestamp,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableDescription, setEditableDescription] = useState(result.detailedDescription);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    summary: true,
    detailed: true,
    moments: true,
    objects: true,
    caption: true,
    audio: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const copyToClipboard = async (text: string, sectionId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(sectionId);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleCopyFull = () => {
    const fullText = `=== VideoMind AI Analysis Report ===
File: ${result.fileName}
Date: ${new Date(result.createdAt).toLocaleString()}
Model: ${result.modelUsed}
Style: ${result.options.style} | Length: ${result.options.length} | Language: ${result.options.language}

[1. SUMMARY]
${result.summary}

[2. DETAILED DESCRIPTION]
${editableDescription}

[3. KEY MOMENTS]
${result.keyMoments.map((m) => `• [${m.timestamp}] ${m.title}: ${m.description}`).join('\n')}

[4. OBJECTS & ACTIVITIES]
• Objects: ${result.objectsAndActivities.objects.join(', ')}
• Subjects: ${result.objectsAndActivities.peopleAndSubjects.join(', ')}
• Activities: ${result.objectsAndActivities.actionsAndActivities.join(', ')}
• Environment: ${result.objectsAndActivities.environment.join(', ')}

[5. SUGGESTED CAPTION]
${result.suggestedCaption}

[6. AUDIO OBSERVATIONS]
${result.audioObservations || 'None detected'}
`;
    copyToClipboard(fullText, 'full');
  };

  const handleDownloadTxt = () => {
    const fullText = `=== VideoMind AI Analysis Report ===
File: ${result.fileName}
Analyzed: ${new Date(result.createdAt).toLocaleString()}
Engine: ${result.modelUsed} (${result.isSimulated ? 'Simulation Mode' : 'Live Vision'})

[VIDEO SUMMARY]
${result.summary}

[DETAILED DESCRIPTION]
${editableDescription}

[KEY MOMENTS]
${result.keyMoments.map((m) => `[${m.timestamp}] ${m.title}\n${m.description}`).join('\n\n')}

[OBJECTS AND ACTIVITIES]
- Objects: ${result.objectsAndActivities.objects.join(', ')}
- Subjects & People: ${result.objectsAndActivities.peopleAndSubjects.join(', ')}
- Actions & Activities: ${result.objectsAndActivities.actionsAndActivities.join(', ')}
- Environmental Setting: ${result.objectsAndActivities.environment.join(', ')}

[SUGGESTED SOCIAL CAPTION]
${result.suggestedCaption}

[AUDIO OBSERVATIONS]
${result.audioObservations || 'None'}
`;

    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.fileName.replace(/\.[^/.]+$/, '')}-description.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const parseTimestampSeconds = (ts: string): number => {
    // Parse "00:04" or "00:04 - 00:10"
    const match = ts.match(/(\d{1,2}):(\d{2})/);
    if (!match) return 0;
    const mins = parseInt(match[1], 10);
    const secs = parseInt(match[2], 10);
    return mins * 60 + secs;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Top Header / Meta Bar */}
      <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-100">
              <Sparkles className="h-3 w-3" />
              Analysis Completed
            </span>
            <span
              className={`rounded-md px-2 py-0.5 text-[11px] font-mono font-medium ${
                result.isSimulated
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {result.isSimulated ? 'Demo Simulation Mode' : 'Live Gemini Vision'}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-mono">
              {new Date(result.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Generated Video Analysis
          </h2>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Copy Full */}
          <button
            type="button"
            onClick={handleCopyFull}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
            title="Copy entire analysis"
          >
            {copiedSection === 'full' ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied Report</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Copy Full</span>
              </>
            )}
          </button>

          {/* Download TXT */}
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
            title="Download TXT file"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export TXT</span>
          </button>

          {/* Regenerate */}
          <button
            type="button"
            onClick={onRegenerate}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
            title="Regenerate with current settings"
          >
            <RotateCw className="h-3.5 w-3.5 text-slate-500" />
            <span>Regenerate</span>
          </button>

          {/* New Video */}
          <button
            type="button"
            onClick={onAnalyzeAnother}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 transition-colors shadow-2xs cursor-pointer"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>New Video</span>
          </button>
        </div>
      </div>

      {/* Simulation Banner Notice (if running demo adapter) */}
      {result.isSimulated && (
        <div className="bg-amber-50/70 border-b border-amber-200/80 px-5 py-2.5 flex items-start gap-2.5 text-xs text-amber-900">
          <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
          <div className="leading-snug">
            <span className="font-semibold">Demo Mode Notice:</span>{' '}
            {result.rawNotes || 'No GEMINI_API_KEY was provided on server or settings. The output above is generated by VideoMind\'s realistic simulation adapter.'}
          </div>
        </div>
      )}

      {/* Main Results Body */}
      <div className="p-5 sm:p-7 space-y-6">
        {/* SECTION 1: Video Summary */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <button
              onClick={() => toggleSection('summary')}
              className="flex items-center gap-2 text-left font-semibold text-sm text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <Eye className="h-4 w-4 text-indigo-600" />
              <span>1. Video Summary</span>
              {expandedSections.summary ? (
                <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              )}
            </button>
            <button
              type="button"
              onClick={() => copyToClipboard(result.summary, 'summary')}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              title="Copy Summary"
            >
              {copiedSection === 'summary' ? (
                <span className="text-emerald-600 flex items-center gap-1">
                  <Check className="h-3 w-3" /> Copied
                </span>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> Copy
                </>
              )}
            </button>
          </div>
          {expandedSections.summary && (
            <p className="mt-3 text-sm text-slate-700 leading-relaxed font-normal">
              {result.summary}
            </p>
          )}
        </div>

        {/* SECTION 2: Detailed Description (Editable) */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <button
              onClick={() => toggleSection('detailed')}
              className="flex items-center gap-2 text-left font-semibold text-sm text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <Layers className="h-4 w-4 text-indigo-600" />
              <span>2. Detailed Description</span>
              {expandedSections.detailed ? (
                <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              )}
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium cursor-pointer"
              >
                <Edit3 className="h-3 w-3" />
                {isEditing ? 'View Mode' : 'Edit Description'}
              </button>
              <button
                type="button"
                onClick={() => copyToClipboard(editableDescription, 'detailed')}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                title="Copy Detailed Description"
              >
                {copiedSection === 'detailed' ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <Check className="h-3 w-3" /> Copied
                  </span>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {expandedSections.detailed && (
            <div className="mt-3">
              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    rows={8}
                    value={editableDescription}
                    onChange={(e) => setEditableDescription(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none font-sans leading-relaxed"
                  />
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{editableDescription.length} characters</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditableDescription(result.detailedDescription);
                          setIsEditing(false);
                        }}
                        className="inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs border border-slate-200 hover:bg-slate-50 text-slate-600"
                      >
                        <Undo2 className="h-3 w-3" /> Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="inline-flex items-center gap-1 rounded bg-indigo-600 px-3 py-1 text-xs text-white hover:bg-indigo-700"
                      >
                        <Save className="h-3 w-3" /> Done
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {editableDescription}
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECTION 3: Key Moments */}
        {result.keyMoments && result.keyMoments.length > 0 && (
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                onClick={() => toggleSection('moments')}
                className="flex items-center gap-2 text-left font-semibold text-sm text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                <Clock className="h-4 w-4 text-indigo-600" />
                <span>3. Key Moments ({result.keyMoments.length})</span>
                {expandedSections.moments ? (
                  <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                )}
              </button>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(
                    result.keyMoments.map((m) => `[${m.timestamp}] ${m.title}: ${m.description}`).join('\n'),
                    'moments'
                  )
                }
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'moments' ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <Check className="h-3 w-3" /> Copied
                  </span>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copy
                  </>
                )}
              </button>
            </div>

            {expandedSections.moments && (
              <div className="mt-3 divide-y divide-slate-100">
                {result.keyMoments.map((moment, idx) => {
                  const seconds = parseTimestampSeconds(moment.timestamp);
                  return (
                    <div
                      key={idx}
                      className="py-3 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-start gap-2.5 sm:gap-4"
                    >
                      {/* Timestamp button that seeks player */}
                      <button
                        type="button"
                        onClick={() => onSeekTimestamp?.(seconds)}
                        title={`Jump to ${moment.timestamp} in video player`}
                        className="self-start inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 font-mono text-xs font-semibold text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 transition-colors cursor-pointer border border-indigo-200/60 shrink-0"
                      >
                        <Clock className="h-3 w-3" />
                        <span>{moment.timestamp}</span>
                      </button>

                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-slate-900">
                          {moment.title}
                        </h4>
                        <p className="mt-0.5 text-xs text-slate-600 leading-normal">
                          {moment.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SECTION 4: Objects and Activities */}
        {result.objectsAndActivities && (
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                onClick={() => toggleSection('objects')}
                className="flex items-center gap-2 text-left font-semibold text-sm text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                <Tag className="h-4 w-4 text-indigo-600" />
                <span>4. Objects & Activities</span>
                {expandedSections.objects ? (
                  <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                )}
              </button>
            </div>

            {expandedSections.objects && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Visible Objects */}
                <div className="rounded-lg bg-slate-50/70 p-3.5 border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                    Identified Objects
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.objectsAndActivities.objects.map((obj, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-xs text-slate-700"
                      >
                        {obj}
                      </span>
                    ))}
                  </div>
                </div>

                {/* People / Subjects */}
                <div className="rounded-lg bg-slate-50/70 p-3.5 border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                    Subjects & People
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.objectsAndActivities.peopleAndSubjects.map((sub, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-xs text-slate-700"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions & Activities */}
                <div className="rounded-lg bg-slate-50/70 p-3.5 border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                    Actions & Activities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.objectsAndActivities.actionsAndActivities.map((act, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-xs text-slate-700"
                      >
                        {act}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Environment */}
                <div className="rounded-lg bg-slate-50/70 p-3.5 border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                    Environmental Setting
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.objectsAndActivities.environment.map((env, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-xs text-slate-700"
                      >
                        {env}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 5: Suggested Caption */}
        {result.suggestedCaption && (
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                onClick={() => toggleSection('caption')}
                className="flex items-center gap-2 text-left font-semibold text-sm text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                <Share2 className="h-4 w-4 text-indigo-600" />
                <span>5. Suggested Caption</span>
                {expandedSections.caption ? (
                  <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                )}
              </button>
              <button
                type="button"
                onClick={() => copyToClipboard(result.suggestedCaption, 'caption')}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'caption' ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <Check className="h-3 w-3" /> Copied
                  </span>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copy
                  </>
                )}
              </button>
            </div>

            {expandedSections.caption && (
              <div className="mt-3 p-3.5 rounded-lg bg-indigo-50/40 border border-indigo-100/60 text-sm text-slate-800 font-medium">
                {result.suggestedCaption}
              </div>
            )}
          </div>
        )}

        {/* SECTION 6: Audio Observations */}
        {result.audioObservations && (
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                onClick={() => toggleSection('audio')}
                className="flex items-center gap-2 text-left font-semibold text-sm text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                <Volume2 className="h-4 w-4 text-indigo-600" />
                <span>6. Audio & Dialogue Analysis</span>
                {expandedSections.audio ? (
                  <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                )}
              </button>
            </div>

            {expandedSections.audio && (
              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                {result.audioObservations}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
