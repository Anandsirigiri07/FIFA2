import * as functions from 'firebase-functions';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import { rateLimit } from 'express-rate-limit';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173'
];

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void => {
    if (!origin) {
      callback(null, true);
      return;
    }

    const isAllowed = allowedOrigins.includes(origin) ||
      /^https:\/\/[a-zA-Z0-9-.]+\.web\.app$/.test(origin) ||
      /^https:\/\/[a-zA-Z0-9-.]+\.firebaseapp\.com$/.test(origin);

    if (isAllowed) {
      callback(null, true);
    } else {
      const error = new Error('Not allowed by CORS') as Error & { status?: number; statusCode?: number };
      error.status = 403;
      error.statusCode = 403;
      callback(error);
    }
  }
}));

app.use(express.json());

const apiKey = (
  process.env.GEMINI_API_KEY ||
  (functions.config().gemini?.key as string) ||
  ''
).replace(/['"]/g, '').trim();

const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

const chatRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // 30 requests per windowMs
  statusCode: 429,
  message: { error: 'Rate limit exceeded. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Health check endpoint.
 */
app.get('/api/health', (_req: Request, res: Response): void => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Main chat endpoint — proxies to Gemini securely.
 */
app.post('/api/chat', chatRateLimiter, async (req: Request, res: Response): Promise<void> => {
  const { message, persona, language } = req.body as {
    message?: unknown;
    persona?: unknown;
    language?: unknown;
  };

  if (typeof message !== 'string') {
    res.status(400).json({ error: 'Message string is required' });
    return;
  }

  const validPersona = typeof persona === 'string' && persona.trim() ? persona.trim() : 'fan';
  const validLanguage = typeof language === 'string' && language.trim() ? language.trim() : 'en';

  if (!genAI) {
    console.warn('GEMINI_API_KEY is not configured. Falling back to local mock response.');
    res.json({
      role: 'assistant',
      content: `[Mock AI - ${validLanguage} - ${validPersona}]: This is a simulated response to your question: "${message}". Configure GEMINI_API_KEY in your environment for live connectivity.`
    });
    return;
  }

  try {
    const promptContext = `You are StadiumIQ AI, a smart helper for FIFA World Cup 2026. Respond in ${validLanguage} under the persona of ${validPersona}. Message: ${message}`;
    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: promptContext
    });
    res.json({
      role: 'assistant',
      content: response.text || ''
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to communicate with Gemini API' });
  }
});

export const api = functions
  .runWith({ timeoutSeconds: 60, memory: '512MB' })
  .https.onRequest(app);
