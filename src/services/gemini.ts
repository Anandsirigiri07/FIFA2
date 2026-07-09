/**
 * Gemini AI Service for StadiumIQ Pro.
 * Provides secure proxy API calls to the Express server with intelligent fallback.
 * @module gemini
 */

import { getFallbackResponse } from './aiFallback';

/**
 * Local cache to optimize AI request latency and reduce redundant roundtrips.
 */
const responseCache = new Map<string, string>();

/**
 * Interface representing a stream of text chunks.
 */
export interface StreamingResponse {
  /**
   * Async generator yielding text chunks.
   */
  stream: AsyncGenerator<string, void, unknown>;
}

/**
 * Simulates word-by-word streaming from a complete response string.
 * Gives the appearance of real-time AI generation.
 * @param text - Full response text to stream
 * @returns AsyncGenerator yielding word chunks
 */
async function* streamWords(text: string): AsyncGenerator<string, void, unknown> {
  const chunks = text.split(/(?<=\s)/);
  for (const chunk of chunks) {
    yield chunk;
    await new Promise((resolve): void => { setTimeout(resolve, 18); });
  }
}

/**
 * Sends a message to the Gemini API via the secure Express Proxy,
 * falling back to the local intelligent fallback engine if unavailable.
 * @param message - User's query string
 * @param persona - User's current persona (fan, staff, volunteer, organizer)
 * @param language - Target language code
 * @param venueId - Selected active venue ID (e.g. metlife, sofi, att)
 * @returns Promise resolving to a StreamingResponse
 */
export const streamGeminiResponse = async (
  message: string,
  persona: string,
  language: string,
  venueId: string = 'metlife'
): Promise<StreamingResponse> => {
  const trimmedMsg = message.trim().toLowerCase();
  const cacheKey = `${venueId}_${persona}_${language}_${trimmedMsg}`;

  // Serve from cache if available
  if (responseCache.has(cacheKey)) {
    const cachedText = responseCache.get(cacheKey)!;
    return { stream: streamWords(cachedText) };
  }

  // Securely query via Express Proxy
  try {
    const proxyResponse = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, persona, language, venueId }),
      signal: AbortSignal.timeout(5000)
    });

    if (proxyResponse.ok) {
      const data = await proxyResponse.json() as { readonly content?: string };
      const content = data.content ?? '';
      // Only use if it looks like a real response (not mock)
      if (content && !content.startsWith('[Mock AI')) {
        responseCache.set(cacheKey, content);
        return { stream: streamWords(content) };
      }
    }
  } catch (err) {
    console.warn('Proxy not reachable or returned error. Falling back to local engine:', err);
  }

  // Final fallback: intelligent contextual response engine
  const fallbackText = getFallbackResponse(message, persona, language, venueId);
  responseCache.set(cacheKey, fallbackText);
  return { stream: streamWords(fallbackText) };
};
