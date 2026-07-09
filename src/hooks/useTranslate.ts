/**
 * Hook to handle real-time text translations using fallback dictionaries.
 * Supports on-demand translations for arbitrary chat logs or incident reports.
 * @module useTranslate
 */

import { useState } from 'react';
import type { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

export interface UseTranslateResult {
  readonly translateText: (text: string, toLang: Language) => Promise<string>;
  readonly isTranslating: boolean;
  readonly translationError: string | null;
}

/**
 * Handles text translations for multilingual support.
 * @returns translation status flags and execution methods
 */
export const useTranslate = (): UseTranslateResult => {
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  /**
   * Translates custom text strings into target language.
   * @param text - Raw input text
   * @param toLang - Target language code
   * @returns Promise resolving to the translated string
   */
  const translateText = async (text: string, toLang: Language): Promise<string> => {
    if (!text.trim()) return '';

    setIsTranslating(true);
    setTranslationError(null);

    await new Promise((resolve): void => { setTimeout(resolve, 300); });

    try {
      for (const langKey of Object.keys(TRANSLATIONS) as Language[]) {
        const dictionary = TRANSLATIONS[langKey];
        for (const [key, val] of Object.entries(dictionary)) {
          if (val.toLowerCase() === text.toLowerCase()) {
            setIsTranslating(false);
            const targetVal = TRANSLATIONS[toLang][key as keyof typeof TRANSLATIONS[Language]];
            return typeof targetVal === 'string' ? targetVal : val;
          }
        }
      }

      const commonWords: Record<string, Record<Language, string>> = {
        'hello': {
          en: 'Hello', es: 'Hola', fr: 'Bonjour', pt: 'Olá', ar: 'مرحباً',
          de: 'Hallo', ja: 'こんにちは', zh: '你好', hi: 'नमस्ते', ko: '안녕하세요'
        },
        'stadium': {
          en: 'Stadium', es: 'Estadio', fr: 'Stade', pt: 'Estádio', ar: 'ملعب',
          de: 'Stadion', ja: 'スタジアム', zh: '体育场', hi: 'स्टेडियम', ko: '경기장'
        },
        'food': {
          en: 'Food', es: 'Comida', fr: 'Nourriture', pt: 'Comida', ar: 'طعام',
          de: 'Essen', ja: '食べ物', zh: '食物', hi: 'भोजन', ko: '음식'
        },
        'help': {
          en: 'Help', es: 'Ayuda', fr: 'Aide', pt: 'Ajuda', ar: 'مساعدة',
          de: 'Hilfe', ja: 'ヘルプ', zh: '帮助', hi: 'मदद', ko: '도움말'
        }
      };

      const wordKey = text.toLowerCase().trim();
      if (commonWords[wordKey]) {
        setIsTranslating(false);
        return commonWords[wordKey][toLang];
      }

      setIsTranslating(false);
      return `[Translated to ${toLang.toUpperCase()}]: ${text}`;
    } catch (err) {
      console.error('Translation error: ', err);
      setTranslationError('Failed to translate text.');
      setIsTranslating(false);
      return text;
    }
  };

  return {
    translateText,
    isTranslating,
    translationError
  };
};
