import React, { memo, useMemo, useCallback } from 'react';
import type { Persona } from '../types';
import { User, Shield, HelpCircle, Briefcase } from 'lucide-react';

/**
 * Props for PersonaSwitcher.
 */
export interface PersonaSwitcherProps {
  readonly currentPersona: Persona;
  readonly onChange: (persona: Persona) => void;
}

interface PersonaItem {
  readonly id: Persona;
  readonly label: string;
  readonly icon: React.ComponentType<{ readonly className?: string }>;
  readonly color: string;
}

const PERSONAS_LIST: readonly PersonaItem[] = [
  { id: 'fan', label: 'Fan', icon: User, color: 'border-fifa-gold text-fifa-gold bg-fifa-gold/10' },
  { id: 'staff', label: 'Stadium Staff', icon: Shield, color: 'border-blue-500 text-blue-400 bg-blue-500/10' },
  { id: 'volunteer', label: 'Volunteer', icon: HelpCircle, color: 'border-emerald-500 text-emerald-400 bg-emerald-500/10' },
  { id: 'organizer', label: 'Organizer', icon: Briefcase, color: 'border-purple-500 text-purple-400 bg-purple-500/10' }
] as const;

/** Memoized Button for Persona switcher item */
const PersonaButton = memo(({
  item,
  isActive,
  onClick
}: {
  readonly item: PersonaItem;
  readonly isActive: boolean;
  readonly onClick: (id: Persona) => void;
}): React.ReactElement => {
  const Icon = item.icon;
  const activeClass = useMemo(() => {
    return isActive 
      ? `${item.color} ring-2 ring-opacity-50 ring-white`
      : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200 bg-slate-900/50';
  }, [isActive, item.color]);

  const handleClick = useCallback(() => {
    onClick(item.id);
  }, [item.id, onClick]);

  return (
    <button
      onClick={handleClick}
      role="radio"
      aria-checked={isActive}
      className={`flex items-center justify-center space-x-2.5 p-3.5 border rounded-xl font-semibold transition-all duration-200 outline-none ${activeClass}`}
      aria-label={`Switch to ${item.label} Persona`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
      <span className="text-sm">{item.label}</span>
    </button>
  );
});
PersonaButton.displayName = 'PersonaButton';

/**
 * Renders interactive switcher between the 4 stadium user personas.
 * Uses React.memo and useMemo for performance.
 * @param props - Switches handlers and state values
 * @returns React.ReactElement
 */
export const PersonaSwitcher: React.FC<PersonaSwitcherProps> = memo(({ currentPersona, onChange }): React.ReactElement => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6" role="radiogroup" aria-label="Choose user mode">
      {PERSONAS_LIST.map((p): React.ReactElement => (
        <PersonaButton
          key={p.id}
          item={p}
          isActive={currentPersona === p.id}
          onClick={onChange}
        />
      ))}
    </div>
  );
});

PersonaSwitcher.displayName = 'PersonaSwitcher';
export default PersonaSwitcher;
