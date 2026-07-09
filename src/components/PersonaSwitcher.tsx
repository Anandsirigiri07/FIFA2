import React from 'react';
import type { Persona } from '../types';
import { User, Shield, HelpCircle, Briefcase } from 'lucide-react';

/**
 * Props for PersonaSwitcher.
 */
export interface PersonaSwitcherProps {
  readonly currentPersona: Persona;
  readonly onChange: (persona: Persona) => void;
}

/**
 * Renders interactive switcher between the 4 stadium user personas.
 * @param props - Switches handlers and state values
 * @returns React.ReactElement
 */
export const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({ currentPersona, onChange }): React.ReactElement => {
  const personas: { id: Persona; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
    { id: 'fan', label: 'Fan', icon: User, color: 'border-fifa-gold text-fifa-gold bg-fifa-gold/10' },
    { id: 'staff', label: 'Stadium Staff', icon: Shield, color: 'border-blue-500 text-blue-400 bg-blue-500/10' },
    { id: 'volunteer', label: 'Volunteer', icon: HelpCircle, color: 'border-emerald-500 text-emerald-400 bg-emerald-500/10' },
    { id: 'organizer', label: 'Organizer', icon: Briefcase, color: 'border-purple-500 text-purple-400 bg-purple-500/10' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6" role="radiogroup" aria-label="Choose user mode">
      {personas.map((p): React.ReactElement => {
        const Icon = p.icon;
        const isActive = currentPersona === p.id;
        const activeClass = isActive 
          ? `${p.color} ring-2 ring-opacity-50 ring-white`
          : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200 bg-slate-900/50';

        return (
          <button
            key={p.id}
            onClick={(): void => onChange(p.id)}
            role="radio"
            aria-checked={isActive}
            className={`flex items-center justify-center space-x-2.5 p-3.5 border rounded-xl font-semibold transition-all duration-200 outline-none ${activeClass}`}
            aria-label={`Switch to ${p.label} Persona`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{p.label}</span>
          </button>
        );
      })}
    </div>
  );
};
export default PersonaSwitcher;
