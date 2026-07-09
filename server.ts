/**
 * Express API Proxy Server for StadiumIQ Pro.
 * Provides proxy endpoints for Gemini AI interaction.
 * @module server
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Handles chat queries by generating content via Gemini,
 * or returns a fallback mock response if the API key is missing.
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Promise resolving to void
 */
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  const { message, persona, language } = req.body;

  if (typeof message !== 'string') {
    res.status(400).json({ error: 'Message string is required' });
    return;
  }

  if (!genAI) {
    console.warn('GEMINI_API_KEY is not configured. Falling back to local mock response.');
    res.json({
      role: 'assistant',
      content: `[Mock AI - ${language || 'en'} - ${persona || 'fan'}]: This is a simulated response to your question: "${message}". Configure GEMINI_API_KEY in your environment for live connectivity.`
    });
    return;
  }

  try {
    const promptContext = `You are StadiumIQ AI, a smart helper for FIFA World Cup 2026. Respond in ${language || 'en'} under the persona of ${persona || 'fan'}. Message: ${message}`;
    const response = await genAI.models.generateContent({
      model: 'gemini-1.5-flash',
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
