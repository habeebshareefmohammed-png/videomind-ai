import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { VideoUploader } from './components/VideoUploader';
import { VideoPreview } from './components/VideoPreview';
import { DescriptionSettings } from './components/DescriptionSettings';
import { AnalysisProgress } from './components/AnalysisProgress';
import { DescriptionResults } from './components/DescriptionResults';
import { RecentAnalyses } from './components/RecentAnalyses';
import { ErrorMessage } from './components/ErrorMessage';
import { SettingsModal } from './components/SettingsModal';
import { HowItWorks } from './components/HowItWorks';
import { FeaturesSection } from './components/FeaturesSection';
import { Footer } from './components/Footer';
import type {
  AnalysisOptions,
  AnalysisJob,
  SystemStatus,
  VideoAnalysisResult,
} from './types';
import {
  getSystemStatus,
  startVideoAnalysis,
  pollJobStatus,
  cancelAnalysisJob,
  getSavedAnalyses,
  saveAnalysis,
  deleteSavedAnalysis,
  getStoredUserApiKey,
  setStoredUserApiKey,
} from './services/api';
import { Sparkles, ArrowRight } from 'lucide-react';

export function App() {
  // System and Settings State
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [userApiKey, setUserApiKey] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Video State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const fileInputHiddenRef = useRef<HTMLInputElement>(null);

  // Analysis Configuration
  const [options, setOptions] = useState<AnalysisOptions>({
    style: 'general',
    length: 'medium',
    language: 'English',
  });

  // Processing State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeJob, setActiveJob] = useState<AnalysisJob | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Results & History State
  const [currentResult, setCurrentResult] = useState<VideoAnalysisResult | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<VideoAnalysisResult[]>([]);

  // Workspace DOM ref for smooth scrolling
  const workspaceRef = useRef<HTMLDivElement>(null);

  // Load initial status, stored API key, and recent history
  useEffect(() => {
    getSystemStatus()
      .then((status) => setSystemStatus(status))
      .catch((err) => {
        console.warn('Could not fetch server status:', err);
        // Fallback default status if offline
        setSystemStatus({
          status: 'offline',
          hasGeminiKey: false,
          maxFileSizeMB: 150,
          supportedFormats: ['.mp4', '.mov', '.webm', '.mkv', '.avi'],
          defaultModel: 'gemini-1.5-flash',
        });
      });

    setUserApiKey(getStoredUserApiKey());
    setRecentAnalyses(getSavedAnalyses());
  }, []);

  // Clean up object URL when file changes
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setVideoPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setVideoPreviewUrl(null);
    }
  }, [selectedFile]);

  const handleScrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSaveApiKey = (key: string) => {
    setStoredUserApiKey(key);
    setUserApiKey(key);
  };

  const handleVideoSelected = (file: File) => {
    setSelectedFile(file);
    setError(null);
    setCurrentResult(null);
  };

  const handleRemoveVideo = () => {
    setSelectedFile(null);
    setCurrentResult(null);
    setActiveJob(null);
    setIsAnalyzing(false);
    setError(null);
  };

  const handleReplaceVideo = () => {
    fileInputHiddenRef.current?.click();
  };

  const handleHiddenFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleVideoSelected(e.target.files[0]);
    }
  };

  // Start Video Analysis Workflow
  const handleStartAnalysis = async () => {
    if (!selectedFile) return;

    setError(null);
    setIsAnalyzing(true);
    setCurrentResult(null);

    // Initial placeholder job while server is spinning up
    const placeholderJob: AnalysisJob = {
      id: 'init',
      status: 'uploading',
      progressPercent: 10,
      statusMessage: 'Uploading video to analysis endpoint...',
      fileName: selectedFile.name,
      fileSizeBytes: selectedFile.size,
      updatedAt: Date.now(),
    };
    setActiveJob(placeholderJob);

    try {
      // 1. Send file and options to server
      const { jobId } = await startVideoAnalysis(selectedFile, options, userApiKey);

      // 2. Poll job status until complete or failed
      const pollInterval = setInterval(async () => {
        try {
          const job = await pollJobStatus(jobId);
          setActiveJob(job);

          if (job.status === 'completed' && job.result) {
            clearInterval(pollInterval);
            setIsAnalyzing(false);
            setCurrentResult(job.result);
            saveAnalysis(job.result);
            setRecentAnalyses(getSavedAnalyses());
          } else if (job.status === 'failed') {
            clearInterval(pollInterval);
            setIsAnalyzing(false);
            setError(job.error || 'Video analysis failed. Please try again.');
          } else if (job.status === 'cancelled') {
            clearInterval(pollInterval);
            setIsAnalyzing(false);
            setActiveJob(null);
          }
        } catch (pollErr: unknown) {
          console.warn('Polling error:', pollErr);
        }
      }, 1000);
    } catch (err: unknown) {
      setIsAnalyzing(false);
      setActiveJob(null);
      const errMsg = err instanceof Error ? err.message : 'Upload failed';
      setError(errMsg);
    }
  };

  const handleCancelAnalysis = async () => {
    if (!activeJob) return;
    setIsCancelling(true);
    try {
      await cancelAnalysisJob(activeJob.id);
      setIsAnalyzing(false);
      setActiveJob(null);
    } catch (err) {
      console.warn('Failed to cancel job:', err);
      setIsAnalyzing(false);
      setActiveJob(null);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSeekTimestamp = (seconds: number) => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.currentTime = seconds;
      videoPlayerRef.current.play().catch(() => {
        // Autoplay may be restricted by browser until user gesture
      });
      // Smooth scroll back to video player so user can watch that moment
      videoPlayerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = deleteSavedAnalysis(id);
    setRecentAnalyses(updated);
    if (currentResult?.id === id) {
      setCurrentResult(null);
    }
  };

  const handleSelectHistoryItem = (result: VideoAnalysisResult) => {
    setCurrentResult(result);
    // Scroll down to results card
    setTimeout(() => {
      window.scrollTo({
        top: workspaceRef.current ? workspaceRef.current.offsetTop + 100 : 400,
        behavior: 'smooth',
      });
    }, 100);
  };

  const maxBytes = (systemStatus?.maxFileSizeMB || 150) * 1024 * 1024;
  const supportedFormats = systemStatus?.supportedFormats || ['.mp4', '.mov', '.webm', '.mkv', '.avi'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-600 selection:text-white">
      {/* Hidden file input for Replace action */}
      <input
        ref={fileInputHiddenRef}
        type="file"
        accept={supportedFormats.join(',') || 'video/*'}
        onChange={handleHiddenFileInputChange}
        className="hidden"
      />

      {/* Navigation */}
      <Navbar
        systemStatus={systemStatus}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onScrollToWorkspace={handleScrollToWorkspace}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onAnalyzeClick={handleScrollToWorkspace}
          onHowItWorksClick={() => {
            const el = document.getElementById('how-it-works');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* WORKSPACE SECTION (Primary Focus) */}
        <section
          ref={workspaceRef}
          id="workspace"
          className="scroll-mt-20 py-12 md:py-16 bg-slate-100/60 border-y border-slate-200/80"
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 font-mono">
                Workspace
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-heading">
                AI Video Analysis Studio
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600">
                Upload your video, configure your description preferences, and let the AI agent do the rest.
              </p>
            </div>

            {/* Error Message Alert (if any) */}
            {error && (
              <div className="mb-6">
                <ErrorMessage
                  message={error}
                  onRetry={selectedFile ? handleStartAnalysis : undefined}
                />
              </div>
            )}

            {/* Central Workspace Card */}
            <div className="space-y-6">
              {/* State 1: Upload or Video Preview */}
              {!selectedFile ? (
                <VideoUploader
                  onVideoSelected={handleVideoSelected}
                  maxSizeBytes={maxBytes}
                  supportedFormats={supportedFormats}
                  disabled={isAnalyzing}
                />
              ) : (
                <div className="space-y-5">
                  {/* Video Preview Card */}
                  <VideoPreview
                    ref={videoPlayerRef}
                    videoFile={selectedFile}
                    videoUrl={videoPreviewUrl || ''}
                    onReplace={handleReplaceVideo}
                    onRemove={handleRemoveVideo}
                    disabled={isAnalyzing}
                  />

                  {/* Settings Accordion (only while not analyzing) */}
                  {!isAnalyzing && !currentResult && (
                    <DescriptionSettings
                      options={options}
                      onChange={setOptions}
                      disabled={isAnalyzing}
                    />
                  )}

                  {/* Prominent "Generate Description" CTA button */}
                  {!isAnalyzing && !currentResult && (
                    <div className="flex justify-center pt-2">
                      <button
                        type="button"
                        onClick={handleStartAnalysis}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-98 transition-all cursor-pointer"
                      >
                        <Sparkles className="h-5 w-5 text-indigo-200" />
                        <span>Generate Description</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* State 2: AI Processing State */}
              {isAnalyzing && activeJob && (
                <AnalysisProgress
                  job={activeJob}
                  onCancel={handleCancelAnalysis}
                  cancelling={isCancelling}
                />
              )}

              {/* State 3: Generated Description Results */}
              {currentResult && (
                <div className="space-y-6 pt-2">
                  <DescriptionResults
                    result={currentResult}
                    onRegenerate={handleStartAnalysis}
                    onAnalyzeAnother={handleRemoveVideo}
                    onSeekTimestamp={handleSeekTimestamp}
                  />
                </div>
              )}

              {/* Persistent Recent Analyses History */}
              <RecentAnalyses
                items={recentAnalyses}
                onSelect={handleSelectHistoryItem}
                onDelete={handleDeleteHistoryItem}
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorks />

        {/* Features Grid */}
        <FeaturesSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* API Key & System Status Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        systemStatus={systemStatus}
        userApiKey={userApiKey}
        onSaveUserApiKey={handleSaveApiKey}
      />
    </div>
  );
}

export default App;
