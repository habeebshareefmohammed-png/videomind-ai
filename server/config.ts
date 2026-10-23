import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

export const CONFIG = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  MAX_FILE_SIZE_BYTES: parseInt(process.env.MAX_VIDEO_SIZE_MB || '150', 10) * 1024 * 1024,
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_VIDEO_SIZE_MB || '150', 10),
  UPLOAD_DIR: path.join(process.cwd(), 'uploads'),
  SUPPORTED_MIME_TYPES: [
    'video/mp4',
    'video/quicktime',
    'video/webm',
    'video/x-matroska',
    'video/x-msvideo',
    'video/avi',
  ],
  SUPPORTED_EXTENSIONS: ['.mp4', '.mov', '.webm', '.mkv', '.avi'],
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  DEFAULT_GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
};
