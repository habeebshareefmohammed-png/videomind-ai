# VideoMind AI — Modern AI Video Description Generator

A modern, production-grade web application for an AI-powered agent that analyzes uploaded videos and automatically generates detailed, meaningful, structured descriptions of their visual and auditory contents.

Built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Node.js/Express**, featuring live multimodal **Google Gemini AI** integration with an intelligent fallback simulation adapter.

---

## 🌟 Key Features

### 1. Minimal, High-Aesthetic UI/UX
- Inspired by modern AI products (**ChatGPT**, **Linear**, **Vercel**).
- Soft neutral backgrounds, subtle borders, micro-animations, and clean typography (**Inter** & **Plus Jakarta Sans**).
- Fully responsive across desktop, tablet, and mobile devices.

### 2. Video Upload & Live Player Workspace
- **Drag-and-Drop & File Picker**: Supports `MP4`, `MOV`, `WebM`, `MKV`, and `AVI` (up to 150MB configurable limit).
- **Client & Server Validation**: Instant format and size verification with user-friendly error banners.
- **Embedded HTML5 Video Player**: Seamless local preview with interactive timestamp seeking.
- **Instant Demo Generators**: One-click synthetic video clips (*Product Demo*, *Spatial Motion*) for immediate testing without personal video files.
- **Privacy Notice**: Explicit statement on secure processing and automatic temporary file cleanup.

### 3. Customizable Analysis Preferences
- **Description Styles**: *General*, *Detailed*, *Professional*, *Social Media*, *Accessibility (Audio Description)*.
- **Output Length**: *Short*, *Medium*, *Long*.
- **Multilingual Support**: English, Spanish, French, German, Japanese, Chinese, Hindi, Arabic, Portuguese, Italian.
- **Collapsible "Analysis Options"**: Keeps the initial UI clean and focused for first-time visitors.

### 4. Real-Time AI Processing & Job Polling
- Displays video filename, file size, animated progress spinner, and actual processing phase.
- Live progress bar reflecting asynchronous backend job stages.
- **Cancel Support**: Abort button calls `/api/jobs/:id/cancel` and frees resources.

### 5. Structured AI Description Results
1. **Video Summary**: High-level synthesis of core subjects and actions.
2. **Detailed Description**: Chronological narrative with an in-place **Edit Mode** allowing users to modify text directly.
3. **Key Moments**: Time-coded scenes with interactive MM:SS pills — clicking any timestamp jumps the video preview player directly to that second!
4. **Objects & Activities**: Structured tag chips for *Objects*, *Subjects & People*, *Actions*, and *Environmental Setting*.
5. **Suggested Social Caption**: Ready-to-publish short copy with hashtags and emojis.
6. **Audio & Dialogue Observations**: Acoustic profile, speech detection, and environmental sounds.
7. **Export & Copy**: Copy full report, copy individual sections, or export as a clean `.txt` file.

### 6. Persistent Local History
- Previously generated analyses are saved in `localStorage` for immediate review, retrieval, and re-export.

### 7. Google Gemini AI & Dual-Mode Integration
- **Live Multimodal Vision**: When a `GEMINI_API_KEY` is provided, the backend uploads the video via the official Google AI File API and analyzes it using Gemini 1.5 Flash.
- **Demo Simulation Adapter**: When no API key is configured, the server executes a multi-step intelligent simulation adapter, clearly displaying a demo banner and simulation badge.
- **In-App Settings Modal**: Users can configure their own Google Gemini API key directly in the browser UI or set it in the `.env` file on the server.

---

## 🏗️ Project Architecture

```
├── server/
│   ├── index.ts               # Express server entry point, CORS, and middleware
│   ├── config.ts              # Configuration, environment variables, size limits
│   ├── routes/
│   │   └── analyze.ts         # /api/analyze-video, /api/jobs/:id, /api/jobs/:id/cancel, /api/system-status
│   ├── services/
│   │   ├── aiAgent.ts         # Job lifecycle management, progress updates, garbage collection
│   │   ├── geminiAdapter.ts   # Official Google Gemini 1.5 multimodal video analysis adapter
│   │   └── mockAdapter.ts     # Intelligent fallback simulation engine
│   └── types/
│       └── analysis.ts        # Structured response & job TypeScript types
├── src/
│   ├── components/
│   │   ├── Navbar.tsx         # Brand logo, nav links, live AI status pill, CTA
│   │   ├── HeroSection.tsx    # Value prop, headline, subtle split video/AI mockup
│   │   ├── VideoUploader.tsx  # Drag & drop upload zone with format validation & demo generator
│   │   ├── VideoPreview.tsx   # Video player with seek callback, replace & remove actions
│   │   ├── DescriptionSettings.tsx # Style, length, language selectors in collapsible accordion
│   │   ├── AnalysisProgress.tsx # Real-time animated progress bar & cancellation
│   │   ├── DescriptionResults.tsx # 6-section structured output, in-place editor, timestamp seeker
│   │   ├── RecentAnalyses.tsx # Saved analyses grid with 1-click preview
│   │   ├── HowItWorks.tsx     # 3-step pipeline walkthrough
│   │   ├── FeaturesSection.tsx # Key capabilities grid
│   │   ├── SettingsModal.tsx  # In-browser Gemini API key & server diagnostics
│   │   ├── ErrorMessage.tsx   # User-friendly error alert with retry button
│   │   └── Footer.tsx         # Minimal footer with privacy notice
│   ├── services/
│   │   └── api.ts             # API client methods with polling & localStorage helpers
│   ├── types/
│   │   └── index.ts           # Shared TypeScript interfaces
│   ├── App.tsx                # Main app state orchestrator
│   └── main.tsx               # React 19 root mounting
├── index.html                 # Modern typography & SEO meta tags
├── vite.config.ts             # Vite config with @tailwindcss/vite and API proxy to port 5000
├── package.json               # Full-stack dependencies and scripts
└── .env.example               # Environment variable reference
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v26)
- **npm** or **yarn**

### 2. Installation
```bash
npm install
```

### 3. Configure AI Provider (Optional)
To run with live Google Gemini 1.5 video understanding:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Get a free API key from [Google AI Studio](https://aistudio.google.com/).
3. Add your key to `.env`:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```
*(Alternatively, you can leave `.env` empty and enter your key directly inside the app's Settings modal in your browser!)*

### 4. Start the Application
Run both the Express API and Vite web dev server concurrently:
```bash
npm run dev
```

- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

### 5. Production Build
```bash
npm run build
```

---

## 📡 API Contract

### `POST /api/analyze-video`
- **Request**: `multipart/form-data`
  - `video`: Video binary file (`.mp4`, `.mov`, `.webm`, `.mkv`, `.avi`)
  - `style`: `general` | `detailed` | `professional` | `social` | `accessibility`
  - `length`: `short` | `medium` | `long`
  - `language`: Target language string (e.g. `English`, `Spanish`)
  - Header (Optional): `x-gemini-api-key: <key>`
- **Response**: `202 Accepted`
  ```json
  {
    "success": true,
    "jobId": "job-1792754524861-bt3t2",
    "fileName": "demo.mp4",
    "fileSizeBytes": 10485760
  }
  ```

### `GET /api/jobs/:id`
- **Response**: `200 OK`
  ```json
  {
    "id": "job-1792754524861-bt3t2",
    "status": "processing",
    "progressPercent": 65,
    "statusMessage": "Classifying visible subjects, actions, and environmental context...",
    "result": { ... }
  }
  ```

### `POST /api/jobs/:id/cancel`
- **Response**: `200 OK`
  ```json
  { "success": true, "message": "Analysis job cancelled." }
  ```

### `GET /api/system-status`
- **Response**: `200 OK`
  ```json
  {
    "status": "ok",
    "hasGeminiKey": false,
    "maxFileSizeMB": 150,
    "supportedFormats": [".mp4", ".mov", ".webm", ".mkv", ".avi"],
    "defaultModel": "gemini-1.5-flash"
  }
  ```
