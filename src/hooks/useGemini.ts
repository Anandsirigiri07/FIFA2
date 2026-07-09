/**
 * Hook to manage chat operations with StadiumIQ Pro's GenAI interface.
 * Implements message sanitization, rate limiting, and word-by-word state streams.
 * @module useGemini
 */

import { useState } from 'react';
import type { ChatMessage, Persona, Language } from '../types';
import { streamGeminiResponse } from '../services/gemini';
import { sanitizeInput } from '../utils/sanitize';
import { rateLimits } from '../utils/rateLimiter';
import { logAnalyticsEvent } from '../services/analytics';

export interface UseGeminiResult {
  readonly messages: readonly ChatMessage[];
  readonly loading: boolean;
  readonly error: string | null;
  readonly sendMessage: (text: string) => Promise<void>;
  readonly clearChat: () => void;
}

/**
 * Handles communication history, rate limiting controls, input cleansing, and streaming.
 * @param persona - Current persona context (fan, staff, volunteer, organizer)
 * @param language - Language code for target response
 * @param uid - Active user identifier for rate tracking
 * @returns State properties and send query modifier
 */
export const useGemini = (
  persona: Persona,
  language: Language,
  uid: string = 'guest'
): UseGeminiResult => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Clears the active chat thread.
   * @returns void
   */
  const clearChat = (): void => {
    setMessages([]);
    setError(null);
  };

  /**
   * Validates and posts a user query to Gemini, streaming response chunks.
   * @param text - User raw prompt text
   * @returns Promise resolving to void
   */
  const sendMessage = async (text: string): Promise<void> => {
    if (!text.trim()) return;

    setError(null);

    const rateCheck = rateLimits.chat(uid);
    if (!rateCheck.allowed) {
      const secondsLeft = Math.ceil(rateCheck.waitMs / 1000);
      setError(`Rate limit exceeded. Please wait ${secondsLeft}s before sending another message.`);
      return;
    }

    const sanitizeResult = sanitizeInput(text);
    if (sanitizeResult.wasInjection) {
      logAnalyticsEvent('prompt_injection_detected', { userId: uid, text });
      setError('System warning: Request rejected due to potential prompt injection.');
      return;
    }

    const cleanInput = sanitizeResult.clean;

    const userMsgId = Math.random().toString(36).substring(7);
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: cleanInput,
      timestamp: new Date(),
      language,
      persona
    };

    setMessages((prev): ChatMessage[] => [...prev, userMsg]);
    setLoading(true);

    const assistantMsgId = Math.random().toString(36).substring(7);
    const assistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      language,
      persona
    };

    setMessages((prev): ChatMessage[] => [...prev, assistantMsg]);

    try {
      const responseStream = await streamGeminiResponse(cleanInput, persona, language);
      setLoading(false);

      for await (const chunk of responseStream.stream) {
        setMessages((prev): ChatMessage[] =>
          prev.map((msg): ChatMessage =>
            msg.id === assistantMsgId ? { ...msg, content: msg.content + chunk } : msg
          )
        );
      }

      logAnalyticsEvent('chat_message_sent', { persona, language });
    } catch (err) {
      console.error('Streaming chat failure: ', err);
      setError('Unable to fetch AI response. Please check your connection.');
      setLoading(false);
      setMessages((prev): ChatMessage[] => prev.filter((msg): boolean => msg.id !== assistantMsgId));
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearChat
  };
};
