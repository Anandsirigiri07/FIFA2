import React, { memo, useCallback } from 'react';
import type { Language } from '../types';
import { Languages } from 'lucide-react';

/**
 * Props for LanguageSelector.
 */
export interface LanguageSelectorProps {
  readonly language: Language;
  readonly onChange: (lang: Language) => void;
}

interface LanguageItem {
  readonly code: Language;
  readonly label: string;
}

const LANGUAGES_LIST: readonly LanguageItem[] = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' },
  { code: 'ar', label: 'العربية' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '简体中文' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ko', label: '한국어' }
] as const;

/**
 * Renders language selection option dropdown list.
 * Uses React.memo and useMemo for maximum rendering performance.
 * @param props - Component options
 * @returns React.ReactElement
 */
export const LanguageSelector: React.FC<LanguageSelectorProps> = memo(({ language, onChange }): React.ReactElement => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
    onChange(e.target.value as Language);
  }, [onChange]);

  return (
    <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 focus-within:border-fifa-gold transition-colors">
      <Languages className="w-4 h-4 text-slate-400" aria-hidden="true" />
      <select
        value={language}
        onChange={handleChange}
        className="bg-transparent text-sm text-slate-200 outline-none border-none cursor-pointer pr-1"
        aria-label="Select target language"
      >
        {LANGUAGES_LIST.map((lang): React.ReactElement => (
          <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
});

LanguageSelector.displayName = 'LanguageSelector';
export default LanguageSelector;
