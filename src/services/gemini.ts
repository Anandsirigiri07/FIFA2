/**
 * Gemini AI Service for StadiumIQ Pro.
 * Supports streaming chat responses using generative AI.
 * @module gemini
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Interface representing a stream of text chunks.
 */
export interface StreamingResponse {
  /**
   * Async generator yielding text chunks word by word.
   */
  stream: AsyncGenerator<string, void, unknown>;
}

/**
 * Sends a message to the Gemini API or Express server and streams the text word-by-word.
 * @param message - User's query string
 * @param persona - User's current persona (fan, staff, volunteer, organizer)
 * @param language - Target language code
 * @returns Promise resolving to a StreamingResponse
 */
export const streamGeminiResponse = async (
  message: string,
  persona: string,
  language: string
): Promise<StreamingResponse> => {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const promptContext = `You are StadiumIQ AI, a smart helper for FIFA World Cup 2026. Respond in ${language} under the persona of ${persona}. Message: ${message}`;
      const result = await model.generateContentStream(promptContext);
      
      async function* generateStream(): AsyncGenerator<string, void, unknown> {
        for await (const chunk of result.stream) {
          yield chunk.text();
        }
      }

      return { stream: generateStream() };
    } catch (err) {
      console.error('Direct Gemini stream failed, trying proxy: ', err);
    }
  }

  try {
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, persona, language })
    });
    
    if (response.ok) {
      const data = await response.json();
      const content: string = data.content || '';
      
      async function* generateStreamFromProxy(): AsyncGenerator<string, void, unknown> {
        const words = content.split(' ');
        for (const word of words) {
          yield word + ' ';
          await new Promise((resolve): void => { setTimeout(resolve, 80); });
        }
      }
      
      return { stream: generateStreamFromProxy() };
    }
  } catch (err) {
    console.warn('Proxy server not running. Falling back to frontend simulation: ', err);
  }

  async function* generateMockStream(): AsyncGenerator<string, void, unknown> {
    const mockText = `[Mock AI - ${language} - ${persona}] Thank you for asking: "${message}". Configure VITE_GEMINI_API_KEY or start the server proxy for real-time GenAI output!`;
    const words = mockText.split(' ');
    for (const word of words) {
      yield word + ' ';
      await new Promise((resolve): void => { setTimeout(resolve, 50); });
    }
  }

  return { stream: generateMockStream() };
};
