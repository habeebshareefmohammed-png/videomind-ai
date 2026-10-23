import express from 'express';
import cors from 'cors';
import { CONFIG } from './config.js';
import analyzeRouter from './routes/analyze.js';

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-gemini-api-key'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', analyzeRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'VideoMind AI Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Start listening on all network interfaces (public/LAN)
app.listen(CONFIG.PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(`🚀 VideoMind AI Backend running on port ${CONFIG.PORT}`);
  console.log(`📹 Max video size: ${CONFIG.MAX_FILE_SIZE_MB}MB`);
  console.log(`🔑 Gemini Key Configured: ${CONFIG.GEMINI_API_KEY ? 'YES (Live AI Active)' : 'NO (Demo Simulation Mode)'}`);
  console.log(`===============================================`);
});

export default app;
