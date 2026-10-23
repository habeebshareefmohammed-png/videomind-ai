import fs from 'fs';
import { AnalysisJob, AnalysisOptions, VideoAnalysisResult } from '../types/analysis.js';
import { analyzeVideoWithGemini } from './geminiAdapter.js';
import { analyzeVideoWithMock } from './mockAdapter.js';
import { CONFIG } from '../config.js';

// In-memory job repository for async jobs
const jobs = new Map<string, AnalysisJob>();
const cancelledJobs = new Set<string>();

// Periodic garbage collection for old jobs (older than 1 hour)
setInterval(() => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [id, job] of jobs.entries()) {
    if (job.createdAt < oneHourAgo) {
      jobs.delete(id);
      cancelledJobs.delete(id);
    }
  }
}, 10 * 60 * 1000);

export function createJob(
  id: string,
  fileName: string,
  fileSizeBytes: number,
  options: AnalysisOptions
): AnalysisJob {
  const job: AnalysisJob = {
    id,
    status: 'queued',
    progressPercent: 5,
    statusMessage: 'Queued for AI video analysis...',
    fileName,
    fileSizeBytes,
    options,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  jobs.set(id, job);
  return job;
}

export function getJob(id: string): AnalysisJob | undefined {
  return jobs.get(id);
}

export function cancelJob(id: string): boolean {
  const job = jobs.get(id);
  if (!job) return false;
  if (job.status === 'completed' || job.status === 'failed') return false;

  cancelledJobs.add(id);
  job.status = 'cancelled';
  job.statusMessage = 'Job cancelled by user request.';
  job.updatedAt = Date.now();
  return true;
}

export async function processVideoJob({
  jobId,
  filePath,
  fileName,
  mimeType,
  fileSizeBytes,
  options,
  apiKey,
}: {
  jobId: string;
  filePath: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  options: AnalysisOptions;
  apiKey?: string;
}): Promise<VideoAnalysisResult> {
  const job = jobs.get(jobId);
  if (!job) {
    throw new Error(`Job ${jobId} not found`);
  }

  const effectiveApiKey = apiKey || CONFIG.GEMINI_API_KEY;
  const hasRealAiKey = Boolean(effectiveApiKey && effectiveApiKey.trim().length > 5);

  const updateProgress = (progressPercent: number, statusMessage: string) => {
    if (cancelledJobs.has(jobId)) {
      throw new Error('Analysis was cancelled by user.');
    }
    job.progressPercent = progressPercent;
    job.statusMessage = statusMessage;
    job.status = progressPercent >= 90 ? 'generating' : 'processing';
    job.updatedAt = Date.now();
  };

  try {
    let result: VideoAnalysisResult;

    if (hasRealAiKey) {
      console.log(`[AI Agent] Processing with live Google Gemini API for ${fileName}...`);
      result = await analyzeVideoWithGemini({
        filePath,
        fileName,
        mimeType,
        fileSizeBytes,
        options,
        apiKey: effectiveApiKey,
        onProgress: updateProgress,
      });
    } else {
      console.log(`[AI Agent] No Gemini API key detected. Using Simulation Adapter for ${fileName}...`);
      result = await analyzeVideoWithMock({
        fileName,
        mimeType,
        fileSizeBytes,
        options,
        onProgress: updateProgress,
        checkCancelled: () => cancelledJobs.has(jobId),
      });
    }

    job.status = 'completed';
    job.progressPercent = 100;
    job.statusMessage = 'Analysis successfully completed!';
    job.result = result;
    job.updatedAt = Date.now();

    return result;
  } catch (err: unknown) {
    if (cancelledJobs.has(jobId)) {
      job.status = 'cancelled';
      job.statusMessage = 'Analysis was cancelled by user.';
    } else {
      job.status = 'failed';
      const errorMessage = err instanceof Error ? err.message : String(err);
      job.error = errorMessage;
      job.statusMessage = `Analysis failed: ${errorMessage}`;
    }
    job.updatedAt = Date.now();
    throw err;
  } finally {
    // Clean up temporary uploaded file from server disk safely
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (cleanupErr) {
      console.warn('Failed to delete temporary video file:', cleanupErr);
    }
  }
}
