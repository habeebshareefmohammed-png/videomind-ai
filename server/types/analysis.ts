export type DescriptionStyle = 'general' | 'detailed' | 'professional' | 'social' | 'accessibility';
export type DescriptionLength = 'short' | 'medium' | 'long';

export interface AnalysisOptions {
  style: DescriptionStyle;
  length: DescriptionLength;
  language: string;
}

export interface KeyMoment {
  timestamp: string; // e.g., "00:02 - 00:08"
  title: string;
  description: string;
}

export interface ObjectsAndActivities {
  objects: string[];
  peopleAndSubjects: string[];
  actionsAndActivities: string[];
  environment: string[];
}

export interface VideoAnalysisResult {
  id: string;
  fileName: string;
  fileSizeBytes: number;
  durationSeconds?: number;
  format: string;
  createdAt: string;
  provider: 'gemini' | 'openai' | 'simulation';
  isSimulated: boolean;
  modelUsed: string;
  options: AnalysisOptions;
  summary: string;
  detailedDescription: string;
  keyMoments: KeyMoment[];
  objectsAndActivities: ObjectsAndActivities;
  suggestedCaption: string;
  confidenceScore?: number;
  audioObservations?: string;
  rawNotes?: string;
}

export type JobStatus = 'queued' | 'uploading' | 'processing' | 'generating' | 'completed' | 'failed' | 'cancelled';

export interface AnalysisJob {
  id: string;
  status: JobStatus;
  progressPercent: number;
  statusMessage: string;
  fileName: string;
  fileSizeBytes: number;
  options: AnalysisOptions;
  error?: string;
  result?: VideoAnalysisResult;
  createdAt: number;
  updatedAt: number;
}
