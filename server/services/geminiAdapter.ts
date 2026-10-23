import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager, FileState } from '@google/generative-ai/server';
import { AnalysisOptions, VideoAnalysisResult } from '../types/analysis.js';
import { CONFIG } from '../config.js';

interface GeminiAdapterParams {
  filePath: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  options: AnalysisOptions;
  apiKey?: string;
  onProgress?: (progress: number, message: string) => void;
}

export async function analyzeVideoWithGemini({
  filePath,
  fileName,
  mimeType,
  fileSizeBytes,
  options,
  apiKey,
  onProgress,
}: GeminiAdapterParams): Promise<VideoAnalysisResult> {
  const activeKey = apiKey || CONFIG.GEMINI_API_KEY;
  if (!activeKey) {
    throw new Error('Google Gemini API Key is not configured. Please supply a valid key.');
  }

  const fileManager = new GoogleAIFileManager(activeKey);
  const genAI = new GoogleGenerativeAI(activeKey);

  onProgress?.(20, 'Uploading video to AI processing pipeline...');

  // Upload video via File API
  let uploadResponse;
  try {
    uploadResponse = await fileManager.uploadFile(filePath, {
      mimeType,
      displayName: fileName,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to upload video to Google AI: ${errorMsg}`);
  }

  const fileUri = uploadResponse.file.uri;
  const fileApiName = uploadResponse.file.name;

  try {
    onProgress?.(40, 'Processing video frames and scene indexes...');

    // Wait for the video file to become ACTIVE
    let file = await fileManager.getFile(fileApiName);
    let attempts = 0;
    const maxAttempts = 30; // ~60 seconds max wait

    while (file.state === FileState.PROCESSING && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      file = await fileManager.getFile(fileApiName);
      attempts++;
      onProgress?.(
        Math.min(70, 40 + Math.floor((attempts / maxAttempts) * 30)),
        `Analyzing video frames (${attempts * 2}s elapsed)...`
      );
    }

    if (file.state === FileState.FAILED) {
      throw new Error('Google Gemini video processing failed on the server.');
    }

    onProgress?.(75, 'Generating AI visual description and insights...');

    const modelName = CONFIG.DEFAULT_GEMINI_MODEL || 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const styleInstructions: Record<string, string> = {
      general: 'Balanced, clear, natural language suitable for general audiences.',
      detailed: 'Exhaustive and comprehensive breakdown of visual elements, lighting, camera motion, and micro-actions.',
      professional: 'Crisp, technical, corporate/editorial tone focusing on structure and production values.',
      social: 'Engaging, catchy, fast-paced tone optimized for social media captions and reels.',
      accessibility: 'High-contrast audio description style focusing on physical visual access, layout, colors, and subject positions for visually impaired audiences.',
    };

    const lengthInstructions: Record<string, string> = {
      short: 'Keep summaries and descriptions concise (1-2 short paragraphs).',
      medium: 'Standard detailed length (3-4 paragraphs with thorough coverage).',
      long: 'In-depth long-form analysis with granular chronological breakdown.',
    };

    const prompt = `You are VideoMind AI, an elite multimodal computer vision assistant.
Analyze this video thoroughly and produce an accurate, structured description.

SETTINGS:
- Output Style: ${options.style} (${styleInstructions[options.style] || 'standard'})
- Output Length: ${options.length} (${lengthInstructions[options.length] || 'standard'})
- Output Language: ${options.language} (Ensure the text values are written in ${options.language})

RULES:
1. Describe visible subjects, actions, environment, and temporal progression truthfully.
2. Provide chronological key moments with exact MM:SS timestamps.
3. List visible objects, people, actions, and environmental context.
4. Note audible speech, sound effects, or background music if audible.
5. Avoid assumptions; if anything is uncertain or ambiguous, explicitly state it.
6. Return ONLY valid JSON in this exact structure:

{
  "summary": "Concise high-level overview of the video's core subject and message",
  "detailedDescription": "Comprehensive description following the requested style and length",
  "keyMoments": [
    {
      "timestamp": "00:00 - 00:05",
      "title": "Scene or Event Title",
      "description": "Specific action or transition taking place"
    }
  ],
  "objectsAndActivities": {
    "objects": ["Specific identifiable objects"],
    "peopleAndSubjects": ["Key subjects or people observed"],
    "actionsAndActivities": ["Activities and physical movements"],
    "environment": ["Setting, background, atmosphere, lighting"]
  },
  "suggestedCaption": "Catchy, ready-to-share caption for social media or publication",
  "audioObservations": "Summary of audio, voiceover, music, or ambient sound detected",
  "confidenceScore": 0.94
}`;

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: fileUri,
        },
      },
      { text: prompt },
    ]);

    onProgress?.(95, 'Finalizing structured analysis...');
    const responseText = result.response.text();

    let parsedData: any;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      // Fallback regex extraction if wrapped in markdown
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('AI returned a non-JSON response.');
      }
    }

    return {
      id: `analysis-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      fileName,
      fileSizeBytes,
      format: mimeType,
      createdAt: new Date().toISOString(),
      provider: 'gemini',
      isSimulated: false,
      modelUsed: modelName,
      options,
      summary: parsedData.summary || 'Summary unavailable.',
      detailedDescription: parsedData.detailedDescription || 'Description unavailable.',
      keyMoments: Array.isArray(parsedData.keyMoments) ? parsedData.keyMoments : [],
      objectsAndActivities: {
        objects: parsedData.objectsAndActivities?.objects || [],
        peopleAndSubjects: parsedData.objectsAndActivities?.peopleAndSubjects || [],
        actionsAndActivities: parsedData.objectsAndActivities?.actionsAndActivities || [],
        environment: parsedData.objectsAndActivities?.environment || [],
      },
      suggestedCaption: parsedData.suggestedCaption || '',
      confidenceScore: typeof parsedData.confidenceScore === 'number' ? parsedData.confidenceScore : 0.95,
      audioObservations: parsedData.audioObservations || 'No discernible audio track detected.',
    };
  } finally {
    // Clean up uploaded file from Google File API to save quota
    try {
      await fileManager.deleteFile(fileApiName);
    } catch (cleanupErr) {
      console.warn('Could not delete file from Google File API:', cleanupErr);
    }
  }
}
