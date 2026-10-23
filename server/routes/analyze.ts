import { Router, Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { CONFIG } from '../config.js';
import { AnalysisOptions } from '../types/analysis.js';
import { createJob, getJob, cancelJob, processVideoJob } from '../services/aiAgent.js';

const router = Router();

// Ensure upload folder exists
if (!fs.existsSync(CONFIG.UPLOAD_DIR)) {
  fs.mkdirSync(CONFIG.UPLOAD_DIR, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, CONFIG.UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    cb(null, `video-${uniqueSuffix}${ext}`);
  },
});

// File filter validation
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isExtSupported = CONFIG.SUPPORTED_EXTENSIONS.includes(ext);
  const isMimeSupported = CONFIG.SUPPORTED_MIME_TYPES.some((m) =>
    file.mimetype.toLowerCase().startsWith('video/') || file.mimetype.toLowerCase() === m
  );

  if (isExtSupported || isMimeSupported) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported video format (${ext || file.mimetype}). Supported formats: ${CONFIG.SUPPORTED_EXTENSIONS.join(
          ', '
        )}`
      )
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: CONFIG.MAX_FILE_SIZE_BYTES,
  },
  fileFilter,
});

// System Status endpoint
router.get('/system-status', (_req: Request, res: Response) => {
  const hasGeminiKey = Boolean(CONFIG.GEMINI_API_KEY && CONFIG.GEMINI_API_KEY.trim().length > 5);
  res.json({
    status: 'ok',
    hasGeminiKey,
    maxFileSizeMB: CONFIG.MAX_FILE_SIZE_MB,
    supportedFormats: CONFIG.SUPPORTED_EXTENSIONS,
    defaultModel: CONFIG.DEFAULT_GEMINI_MODEL,
    serverTime: new Date().toISOString(),
  });
});

// Video Analysis endpoint
router.post(
  '/analyze-video',
  (req: Request, res: Response, next) => {
    upload.single('video')(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            error: `File is too large. Maximum allowed size is ${CONFIG.MAX_FILE_SIZE_MB}MB.`,
          });
        }
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No video file provided.' });
      }

      const style = (req.body.style || 'general') as AnalysisOptions['style'];
      const length = (req.body.length || 'medium') as AnalysisOptions['length'];
      const language = (req.body.language || 'English') as string;
      const customApiKey = (req.headers['x-gemini-api-key'] as string) || '';

      const options: AnalysisOptions = {
        style,
        length,
        language,
      };

      const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      createJob(jobId, req.file.originalname, req.file.size, options);

      // Asynchronously trigger the AI analysis job
      processVideoJob({
        jobId,
        filePath: req.file.path,
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        fileSizeBytes: req.file.size,
        options,
        apiKey: customApiKey,
      }).catch((err) => {
        console.error(`[Job ${jobId}] Execution failed:`, err);
      });

      return res.status(202).json({
        success: true,
        jobId,
        message: 'Video analysis job initiated successfully.',
        fileName: req.file.originalname,
        fileSizeBytes: req.file.size,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Internal server error';
      return res.status(500).json({ error: errorMessage });
    }
  }
);

// Job Polling Status endpoint
router.get('/jobs/:id', (req: Request, res: Response) => {
  const jobId = req.params.id;
  const job = getJob(jobId);

  if (!job) {
    return res.status(404).json({ error: 'Analysis job not found.' });
  }

  res.json({
    id: job.id,
    status: job.status,
    progressPercent: job.progressPercent,
    statusMessage: job.statusMessage,
    fileName: job.fileName,
    fileSizeBytes: job.fileSizeBytes,
    error: job.error,
    result: job.result,
    updatedAt: job.updatedAt,
  });
});

// Job Cancellation endpoint
router.post('/jobs/:id/cancel', (req: Request, res: Response) => {
  const jobId = req.params.id;
  const cancelled = cancelJob(jobId);

  if (!cancelled) {
    return res.status(400).json({
      error: 'Job could not be cancelled (it may have already completed, failed, or does not exist).',
    });
  }

  res.json({ success: true, message: 'Analysis job cancelled.' });
});

export default router;
