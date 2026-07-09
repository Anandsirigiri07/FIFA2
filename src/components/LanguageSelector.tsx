import React from 'react';
import type { Language } from '../types';
import { Languages } from 'lucide-react';

/**
 * Props for LanguageSelector.
 */
export interface LanguageSelectorProps {
  readonly language: Language;
  readonly onChange: (lang: Language) => void;
}

/**
 * Renders language selection option dropdown list.
 * @param props - Component options
 * @returns React.ReactElement
 */
export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onChange }): React.ReactElement => {
  const languagesList: { code: Language; label: string }[] = [
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
  ];

  return (
    <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 focus-within:border-fifa-gold transition-colors">
      <Languages className="w-4 h-4 text-slate-400" aria-hidden="true" />
      <select
        value={language}
        onChange={(e): void => onChange(e.target.value as Language)}
        className="bg-transparent text-sm text-slate-200 outline-none border-none cursor-pointer pr-1"
        aria-label="Select target language"
      >
        {languagesList.map((lang): React.ReactElement => (
          <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};
export default LanguageSelector;
