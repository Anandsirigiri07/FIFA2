import React, { memo, useCallback } from 'react';
import type { Language } from '../types';
import { FIFA_2026_VENUES } from '../utils/stadiumData';
import { LanguageSelector } from './LanguageSelector';
import { Trophy, HelpCircle } from 'lucide-react';

/**
 * Props for Navbar component.
 */
export interface NavbarProps {
  readonly activeVenueId: string;
  readonly onVenueChange: (venueId: string) => void;
  readonly activeLanguage: Language;
  readonly onLanguageChange: (lang: Language) => void;
  readonly onNavigateToAccessibility?: () => void;
}

/**
 * Accessible, responsive header navigation panel.
 * Uses React.memo and useCallback for optimal efficiency.
 * @param props - Header configuration data and setters
 * @returns React.ReactElement
 */
export const Navbar: React.FC<NavbarProps> = memo(({
  activeVenueId,
  onVenueChange,
  activeLanguage,
  onLanguageChange,
  onNavigateToAccessibility
}): React.ReactElement => {
  const handleVenueChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
    onVenueChange(e.target.value);
  }, [onVenueChange]);

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3.5" role="banner">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="bg-fifa-gold/15 p-2 rounded-lg border border-fifa-gold/30" aria-hidden="true">
            <Trophy className="w-6 h-6 text-fifa-gold" />
          </div>
          <div>
            <h1 className="text-xl font-outfit font-black text-white tracking-tight flex items-center gap-1.5">
              StadiumIQ <span className="text-fifa-gold text-sm px-1.5 py-0.5 bg-fifa-gold/10 border border-fifa-gold/20 rounded">PRO</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">GenAI Command Center • FIFA 2026</p>
          </div>
        </div>

        <div className="flex items-center flex-wrap justify-center gap-3" role="navigation" aria-label="Quick actions and configurations">
          <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 focus-within:border-fifa-gold transition-colors">
            <select
              value={activeVenueId}
              onChange={handleVenueChange}
              className="bg-transparent text-sm text-slate-200 outline-none border-none cursor-pointer pr-1"
              aria-label="Select Active FIFA Venue"
            >
              {FIFA_2026_VENUES.map((v): React.ReactElement => (
                <option key={v.id} value={v.id} className="bg-slate-900 text-slate-200">
                  {v.name} ({v.city})
                </option>
              ))}
            </select>
          </div>

          <LanguageSelector language={activeLanguage} onChange={onLanguageChange} />

          {onNavigateToAccessibility && (
            <button
              onClick={onNavigateToAccessibility}
              className="flex items-center justify-center p-2 text-slate-400 hover:text-fifa-gold bg-slate-800 hover:bg-slate-700/80 rounded-lg transition-colors border border-slate-700 focus:outline-none focus:ring-2 focus:ring-fifa-gold"
              aria-label="Access accessibility helper view"
            >
              <HelpCircle className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
});

Navbar.displayName = 'Navbar';
export default Navbar;
