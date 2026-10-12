import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { connectDatabase } from './server/config/db.ts';
import authRoutes from './server/routes/authRoutes.ts';
import documentRoutes from './server/routes/documentRoutes.ts';
import aiRoutes from './server/routes/aiRoutes.ts';
import quizRoutes from './server/routes/quizRoutes.ts';
import chatRoutes from './server/routes/chatRoutes.ts';

async function startServer() {
  await connectDatabase();

  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(cors());
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Health & API Status Route
  app.get('/api/health', (_req, res) => {
    const hasAiKey = !!(process.env.GEMINI_API_KEY || process.env.AI_API_KEY);
    res.json({
      status: 'ok',
      app: 'AI Study Assistant',
      aiConfigured: hasAiKey,
      model: process.env.AI_MODEL || 'gemini-flash-latest',
    });
  });

  // Mount REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/documents', documentRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/quizzes', quizRoutes);
  app.use('/api/chats', chatRoutes);

  // Dedicated source code download endpoint
  app.get('/api/download-zip', (_req, res) => {
    const publicZip = path.join(process.cwd(), 'public', 'ai-study-assistant-source.zip');
    const rootZip = path.join(process.cwd(), 'ai-study-assistant-source.zip');
    const distZip = path.join(process.cwd(), 'dist', 'ai-study-assistant-source.zip');
    const target = [publicZip, distZip, rootZip].find((p) => fs.existsSync(p));

    if (target) {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="ai-study-assistant-source.zip"');
      return res.sendFile(target);
    }
    return res.status(404).json({ error: 'Source archive not found' });
  });

  // Fallback 404 for any unmatched API route to always guarantee JSON response
  app.use('/api', (req, res) => {
    res.status(404).json({ error: `API route ${req.method} ${req.originalUrl} not found` });
  });

  // Global error handler middleware
  app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('[Server Error]', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  });

  const isProduction = process.env.NODE_ENV === 'production';
  const distPath = path.join(process.cwd(), 'dist');

  if (isProduction && fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.use((_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AI Study Assistant] Full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
