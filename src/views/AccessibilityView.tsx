import React, { useMemo, useCallback, memo } from 'react';
import type { Language, AccessibilityNeed } from '../types';
import { getVenueById } from '../utils/stadiumData';
import { GeminiChat } from '../components/GeminiChat';
import { useGemini } from '../hooks/useGemini';
import { Eye, HelpCircle } from 'lucide-react';

/**
 * Props for AccessibilityView.
 */
export interface AccessibilityViewProps {
  readonly venueId: string;
  readonly language: Language;
  readonly accessibilityNeeds: AccessibilityNeed[];
  readonly onToggleNeed: (need: AccessibilityNeed) => void;
}

/** Static needs list configured outside component to maintain static reference */
interface NeedItem {
  readonly id: AccessibilityNeed;
  readonly label: string;
}

const NEEDS_LIST: readonly NeedItem[] = [
  { id: 'wheelchair', label: 'Wheelchair / Step-free access' },
  { id: 'visual', label: 'Screen Magnifier / Audio Description' },
  { id: 'hearing', label: 'Assistive Listening / Closed Captions' },
  { id: 'cognitive', label: 'Sensory Room Seating / Quiet Areas' },
  { id: 'medical_device', label: 'Medical Device Charging Points' },
] as const;

/** Memoized Gate Row specifically for step-free gates */
const AccessibleGateRow = memo(({ gateName }: { readonly gateName: string }): React.ReactElement => (
  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
    <div>
      <h4 className="text-xs font-bold text-slate-200">{gateName}</h4>
      <p className="text-3xs text-slate-500">Accessible entryway and elevator adjacent</p>
    </div>
    <span className="text-2xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded" aria-label="Step-free accessibility verified">
      ♿ 100% Step-Free
    </span>
  </div>
));
AccessibleGateRow.displayName = 'AccessibleGateRow';

/**
 * Focuses on screen readers, high-contrast listings, and accessible gates/restrooms.
 * Uses React.memo, useMemo, and useCallback for optimal efficiency.
 * @param props - State parameters and toggles
 * @returns React.ReactElement
 */
export const AccessibilityView: React.FC<AccessibilityViewProps> = memo(({
  venueId,
  language,
  accessibilityNeeds,
  onToggleNeed
}): React.ReactElement => {
  const venue = useMemo(() => getVenueById(venueId), [venueId]);
  const { messages, loading, error, sendMessage } = useGemini('fan', language, venueId);

  const accessibleGates = useMemo(
    () => venue?.gates.filter((g): boolean => g.isAccessible) ?? [],
    [venue]
  );

  const handleToggle = useCallback((id: AccessibilityNeed) => {
    onToggleNeed(id);
  }, [onToggleNeed]);

  if (!venue) {
    return (
      <div className="p-6 text-center text-slate-400" role="status" aria-label="Loading accessibility profiles">
        <HelpCircle className="w-12 h-12 mx-auto mb-4 animate-pulse" aria-hidden="true" />
        <p className="text-sm font-semibold">Loading accessibility profiles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Banner/Header ── */}
      <section className="glass-card rounded-2xl p-6 relative overflow-hidden" aria-labelledby="accessibility-title">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 id="accessibility-title" className="text-2xl font-black font-outfit text-white tracking-tight flex items-center gap-2">
              <Eye className="w-6 h-6 text-fifa-gold" aria-hidden="true" />
              FIFA Accessibility Command Center
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Configure assistance options and access specialized services at {venue.name}.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* ── Configuration Toggles ── */}
          <section className="glass-card rounded-xl p-5" aria-labelledby="needs-heading">
            <h3 id="needs-heading" className="text-base font-bold text-white font-outfit mb-3">Configure Assistance Options</h3>
            <div className="space-y-2.5" role="group" aria-label="Accessibility options list">
              {NEEDS_LIST.map((need): React.ReactElement => {
                const isActive = accessibilityNeeds.includes(need.id);
                return (
                  <button
                    key={need.id}
                    onClick={(): void => handleToggle(need.id)}
                    className={`w-full flex items-center justify-between p-3 border rounded-xl text-left transition-all outline-none focus:ring-2 focus:ring-fifa-gold ${
                      isActive 
                        ? 'bg-fifa-gold/15 border-fifa-gold/30 text-white' 
                        : 'bg-slate-900 border-slate-800/80 text-slate-300 hover:border-slate-850'
                    }`}
                    aria-label={`Toggle ${need.label}. Status is currently ${isActive ? 'enabled' : 'disabled'}`}
                    aria-pressed={isActive}
                  >
                    <span className="text-xs font-semibold">{need.label}</span>
                    <span className={`text-2xs font-extrabold px-2.5 py-0.5 rounded ${
                      isActive ? 'bg-fifa-gold text-fifa-dark' : 'bg-slate-800 text-slate-500'
                    }`} aria-hidden="true">
                      {isActive ? 'Active' : 'Disabled'}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── Accessible Gates ── */}
          <section className="glass-card rounded-xl p-5" aria-labelledby="gates-heading">
            <h3 id="gates-heading" className="text-base font-bold text-white font-outfit mb-3">Step-Free Entry Gates</h3>
            <div className="space-y-2" role="list" aria-label="Step-free entry gates list">
              {accessibleGates.map((gate): React.ReactElement => (
                <div key={gate.id} role="listitem">
                  <AccessibleGateRow gateName={gate.name} />
                </div>
              ))}
            </div>
          </section>
        </div>

        <GeminiChat
          messages={messages}
          loading={loading}
          error={error}
          onSendMessage={sendMessage}
          currentPersona="fan"
          currentLanguage={language}
        />
      </div>
    </div>
  );
});

AccessibilityView.displayName = 'AccessibilityView';
export default AccessibilityView;
