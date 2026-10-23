import { AnalysisOptions, VideoAnalysisResult } from '../types/analysis.js';

interface MockAdapterParams {
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  options: AnalysisOptions;
  onProgress?: (progress: number, message: string) => void;
  checkCancelled?: () => boolean;
}

export async function analyzeVideoWithMock({
  fileName,
  mimeType,
  fileSizeBytes,
  options,
  onProgress,
  checkCancelled,
}: MockAdapterParams): Promise<VideoAnalysisResult> {
  const steps = [
    { progress: 15, msg: 'Inspecting container headers and decoding audio/video streams...' },
    { progress: 35, msg: 'Sampling keyframes and computing temporal optical flow...' },
    { progress: 60, msg: 'Classifying visible subjects, actions, and environmental context...' },
    { progress: 85, msg: 'Assembling chronological narrative and key moment timestamps...' },
    { progress: 98, msg: 'Formatting structured insights according to selected style...' },
  ];

  for (const step of steps) {
    if (checkCancelled && checkCancelled()) {
      throw new Error('Analysis was cancelled by the user.');
    }
    onProgress?.(step.progress, step.msg);
    // Short realistic asynchronous delay
    await new Promise((resolve) => setTimeout(resolve, 800));
  }

  // Derive contextual video characteristics from file name or format
  const baseName = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  const sizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(1);

  // Style-specific templates
  const stylePrefixes: Record<string, string> = {
    general: 'This video presents a clear visual sequence focusing on',
    detailed: 'A meticulous visual recording capturing continuous temporal actions of',
    professional: 'A professionally produced visual presentation highlighting',
    social: 'An eye-catching, high-energy clip showcasing',
    accessibility: '[Visual Description for Accessibility] The camera opens on a high-visibility frame featuring',
  };

  const prefix = stylePrefixes[options.style] || stylePrefixes.general;

  const isLong = options.length === 'long';
  const isShort = options.length === 'short';

  let detailedText = `${prefix} ${baseName}. The footage opens with an establishing frame displaying balanced natural lighting and steady camera stabilization. As the sequence unfolds, key subjects interact within their environment with clear spatial transitions. 

In the primary segment, continuous movement is observed across the central foreground, transitioning smoothly through different vantage points. The background demonstrates realistic depth of field, highlighting subtle ambient textures and environmental characteristics. 

The concluding moments stabilize the sequence, showing resolution of the ongoing activity and a natural visual conclusion before fading out.`;

  if (isLong) {
    detailedText += `\n\nFurthermore, frame-by-frame temporal inspection indicates uniform lighting temperatures without abrupt flicker or artifacts. Subject trajectory remains consistent with natural physical momentum. The visual palette emphasizes organic tones, maintaining high contrast between focal subjects and the ambient backdrop.`;
  } else if (isShort) {
    detailedText = `${prefix} ${baseName}. The video tracks the focal subject through a smooth sequence of actions with steady framing, clear ambient illumination, and a coherent conclusion.`;
  }

  return {
    id: `sim-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    fileName,
    fileSizeBytes,
    format: mimeType || 'video/mp4',
    createdAt: new Date().toISOString(),
    provider: 'simulation',
    isSimulated: true,
    modelUsed: 'VideoMind Intelligent Simulation Engine v1.0 (Demo Adapter)',
    options,
    summary: `A ${options.length} ${options.style} breakdown of "${fileName}" (${sizeMB} MB) capturing dynamic subject interactions, scene evolution, and ambient environmental context.`,
    detailedDescription: detailedText,
    keyMoments: [
      {
        timestamp: '00:00 - 00:04',
        title: 'Initial Scene Setup & Focus',
        description: `Opening scene introducing the primary focal subjects and establishing ambient environmental lighting.`,
      },
      {
        timestamp: '00:05 - 00:12',
        title: 'Primary Action & Subject Movement',
        description: `Central sequence demonstrating fluid motion and direct interaction with the surrounding physical space.`,
      },
      {
        timestamp: '00:13 - 00:18',
        title: 'Perspective Transition & Dynamic Shift',
        description: `Subtle camera pan revealing secondary background details and changing depth-of-field focus.`,
      },
      {
        timestamp: '00:19 - 00:24',
        title: 'Sequence Conclusion & Resolution',
        description: `Subject completes the primary activity, stabilizing into the final frame composition.`,
      },
    ],
    objectsAndActivities: {
      objects: ['Focal Subject Device/Props', 'Surface Elements', 'Ambient Light Sources', 'Architectural Structures'],
      peopleAndSubjects: ['Primary Subject / Individual', 'Secondary Observer (Background)'],
      actionsAndActivities: ['Continuous Motion', 'Direct Hand Manipulation', 'Spatial Traversal', 'Visual Orientation Shift'],
      environment: ['Evenly Diffused Ambient Light', 'Indoor / Semi-Outdoor Spatial Setting', 'Natural Depth-of-Field Falloff'],
    },
    suggestedCaption: options.style === 'social' 
      ? `Check out the visual highlights from ${baseName}! ✨ Smooth action and dynamic details. #VideoAI #ContentCreation #Moments`
      : `Visual recap and breakdown of ${baseName}: dynamic scene sequence, subject interactions, and continuous environmental motion.`,
    confidenceScore: 0.98,
    audioObservations: 'Ambient environmental room acoustic profile with balanced mid-frequency activity; consistent sound envelope throughout playback.',
    rawNotes: 'Demo Mode: Running on the VideoMind Intelligent Simulation Adapter. Connect your GEMINI_API_KEY to activate live Google Gemini multimodal video vision.',
  };
}
