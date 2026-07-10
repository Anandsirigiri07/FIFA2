/**
 * Express API Proxy Server for StadiumIQ Pro.
 * Provides proxy endpoints for Gemini AI interaction.
 * @module server
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { rateLimit } from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173'
];

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void => {
    // If request has no Origin (like same-origin, curl, postman), allow it
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

const apiKey = (process.env.GEMINI_API_KEY || '').replace(/['"]/g, '');
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
 * Handles chat queries by generating content via Gemini,
 * or returns a fallback mock response if the API key is missing.
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Promise resolving to void
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

/**
 * Starts the Express server listening on the configured port.
 * @returns void
 */
app.listen(PORT, (): void => {
  console.warn(`StadiumIQ API proxy listening on port ${PORT}`);
});
