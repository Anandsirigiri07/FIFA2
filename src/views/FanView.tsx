import React, { useState, useMemo, useCallback, memo } from 'react';
import type { Language, TransportMode } from '../types';
import { getVenueById } from '../utils/stadiumData';
import { recommendGate } from '../utils/crowdCalc';
import { calculateCO2Saved } from '../utils/carbonCalc';
import { findAmenities } from '../utils/stadiumData';
import { GeminiChat } from '../components/GeminiChat';
import { useGemini } from '../hooks/useGemini';
import { Trophy, Leaf, Coffee, MapPin, Compass } from 'lucide-react';

/**
 * Props for FanView.
 */
export interface FanViewProps {
  readonly venueId: string;
  readonly language: Language;
}

/** Amenity filter types available in the facilities panel */
type AmenityType = 'food' | 'restroom' | 'medical';

/** Transport mode selector options */
const TRANSPORT_OPTIONS: ReadonlyArray<{ value: TransportMode; label: string }> = [
  { value: 'metro', label: 'Metro Link' },
  { value: 'bus', label: 'Shuttle Bus' },
  { value: 'shuttle', label: 'Carpool Shuttle' },
  { value: 'rideshare', label: 'Rideshare Alone' },
  { value: 'walk', label: 'Walking' },
  { value: 'bike', label: 'Bicycling' },
] as const;

/** Amenity type filter options */
const AMENITY_TYPES: ReadonlyArray<AmenityType> = ['food', 'restroom', 'medical'];

/**
 * Gate row item memoized to avoid unnecessary re-renders when parent updates.
 */
const GateRow = memo(({ gate }: { gate: { id: string; name: string; isAccessible: boolean; isOpen: boolean; queueMinutes: number } }): React.ReactElement => (
  <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800/80 rounded-lg">
    <div>
      <h4 className="text-sm font-semibold text-slate-200">{gate.name}</h4>
      <p className="text-2xs text-slate-500">{gate.isAccessible ? '♿ Step-free Access' : 'Standard Gate'}</p>
    </div>
    <span
      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
        gate.isOpen
          ? gate.queueMinutes > 10
            ? 'bg-amber-950 text-amber-300'
            : 'bg-emerald-950 text-emerald-300'
          : 'bg-slate-950 text-slate-500'
      }`}
      aria-label={gate.isOpen ? `${gate.queueMinutes} minute wait at ${gate.name}` : `${gate.name} is closed`}
    >
      {gate.isOpen ? `${gate.queueMinutes} Min wait` : 'Closed'}
    </span>
  </div>
));
GateRow.displayName = 'GateRow';

/**
 * Amenity row item memoized for stable rendering.
 */
const AmenityRow = memo(({ amenity }: { amenity: { id: string; name: string; section: string; waitMinutes: number } }): React.ReactElement => (
  <div className="flex justify-between items-center p-2.5 bg-slate-900/60 rounded-lg">
    <div>
      <h4 className="text-xs font-semibold text-slate-200">{amenity.name}</h4>
      <p className="text-3xs text-slate-500">{amenity.section}</p>
    </div>
    <span className="text-xs text-slate-400 font-medium" aria-label={`${amenity.waitMinutes} minute queue`}>
      Queue: {amenity.waitMinutes}m
    </span>
  </div>
));
AmenityRow.displayName = 'AmenityRow';

/**
 * Fan command center view detailing seating, queues, carbon metrics, and AI chat.
 * Uses React.memo, useMemo, and useCallback to avoid unnecessary re-renders.
 * @param props - Active venue and language options
 * @returns React.ReactElement
 */
export const FanView: React.FC<FanViewProps> = memo(({ venueId, language }): React.ReactElement => {
  const venue = useMemo(() => getVenueById(venueId), [venueId]);
  const { messages, loading, error, sendMessage } = useGemini('fan', language, venueId);

  const [distance, setDistance] = useState<number>(15);
  const [transportMode, setTransportMode] = useState<TransportMode>('metro');
  const [amenityType, setAmenityType] = useState<AmenityType>('food');

  const gateQueues = useMemo(
    () => venue?.gates.map((g): number => (g.isOpen ? g.queueMinutes : 999)) ?? [],
    [venue]
  );

  const bestGateIdx = useMemo(() => recommendGate(gateQueues), [gateQueues]);
  const bestGate = useMemo(() => venue?.gates[bestGateIdx], [venue, bestGateIdx]);
  const co2Saved = useMemo(() => calculateCO2Saved(transportMode, distance), [transportMode, distance]);
  const activeAmenities = useMemo(() => findAmenities(venueId, amenityType), [venueId, amenityType]);

  const handleDistanceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setDistance(Math.max(1, Number(e.target.value)));
  }, []);

  const handleTransportChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
    setTransportMode(e.target.value as TransportMode);
  }, []);

  const handleAmenityFilter = useCallback((type: AmenityType): void => {
    setAmenityType(type);
  }, []);

  if (!venue) {
    return (
      <div className="p-6 text-center text-slate-400" role="status" aria-label="Loading stadium information">
        <Compass className="w-12 h-12 mx-auto mb-4 animate-spin" aria-hidden="true" />
        <p className="text-sm font-semibold">Stadium information is currently loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Venue Header ── */}
      <section className="glass-card rounded-2xl p-6 relative overflow-hidden" aria-labelledby="venue-heading">
        <div className="absolute top-0 right-0 w-64 h-64 bg-fifa-gold/10 rounded-full blur-3xl -z-10" aria-hidden="true" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-2xs font-extrabold uppercase tracking-widest text-fifa-gold px-2 py-0.5 bg-fifa-gold/15 rounded-full border border-fifa-gold/25">
              Active Host Stadium
            </span>
            <h2 id="venue-heading" className="text-3xl font-black font-outfit text-white tracking-tight mt-2">{venue.name}</h2>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-fifa-gold" aria-hidden="true" />
              {venue.city}, {venue.country} • Capacity: {venue.capacity.toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* ── Gate Queues ── */}
          <section className="glass-card rounded-xl p-5" aria-labelledby="gate-heading">
            <div className="flex items-center space-x-2.5 mb-4">
              <Trophy className="w-5 h-5 text-fifa-gold" aria-hidden="true" />
              <h3 id="gate-heading" className="text-base font-bold text-white font-outfit">Entry Gate Queues</h3>
            </div>

            {bestGate?.isOpen && (
              <div
                className="mb-4 p-3.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 rounded-lg text-xs flex items-center space-x-2"
                role="alert"
                aria-live="polite"
              >
                <Leaf className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span>
                  <strong>Recommended Entry:</strong> {bestGate.name} has the shortest queue ({bestGate.queueMinutes} mins).
                </span>
              </div>
            )}

            <div className="space-y-2.5" role="list" aria-label="Gate queue times">
              {venue.gates.map((gate): React.ReactElement => (
                <div key={gate.id} role="listitem">
                  <GateRow gate={gate} />
                </div>
              ))}
            </div>
          </section>

          {/* ── Sustainable Travel Calculator ── */}
          <section className="glass-card rounded-xl p-5" aria-labelledby="travel-heading">
            <div className="flex items-center space-x-2.5 mb-4">
              <Leaf className="w-5 h-5 text-emerald-400" aria-hidden="true" />
              <h3 id="travel-heading" className="text-base font-bold text-white font-outfit">Sustainable Travel Calculator</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col space-y-1">
                <label htmlFor="mode-select" className="text-xs font-medium text-slate-400">Travel Mode</label>
                <select
                  id="mode-select"
                  value={transportMode}
                  onChange={handleTransportChange}
                  className="glass-input rounded-lg p-2 text-xs"
                  aria-label="Select mode of transport to calculate CO2 savings"
                >
                  {TRANSPORT_OPTIONS.map(({ value, label }): React.ReactElement => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col space-y-1">
                <label htmlFor="dist-input" className="text-xs font-medium text-slate-400">Distance (km)</label>
                <input
                  id="dist-input"
                  type="number"
                  value={distance}
                  onChange={handleDistanceChange}
                  className="glass-input rounded-lg p-2 text-xs"
                  aria-label="Input travel distance in kilometres"
                  aria-describedby="co2-result"
                  min="1"
                  max="500"
                />
              </div>
            </div>
            <div
              id="co2-result"
              className="p-3 bg-emerald-950/20 border border-emerald-500/25 rounded-lg flex items-center justify-between"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="text-xs text-slate-300">CO2 Emissions Saved vs Solo Driving:</span>
              <span className="text-sm font-black text-emerald-400 font-outfit" aria-label={`${co2Saved} kilograms of CO2 saved`}>
                {co2Saved} kg CO₂
              </span>
            </div>
          </section>

          {/* ── Nearest Facilities ── */}
          <section className="glass-card rounded-xl p-5" aria-labelledby="facilities-heading">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <Coffee className="w-5 h-5 text-fifa-gold" aria-hidden="true" />
                <h3 id="facilities-heading" className="text-base font-bold text-white font-outfit">Nearest Facilities</h3>
              </div>
              <div className="flex space-x-1.5" role="group" aria-label="Filter facility type">
                {AMENITY_TYPES.map((type): React.ReactElement => (
                  <button
                    key={type}
                    onClick={(): void => handleAmenityFilter(type)}
                    className={`px-2 py-0.5 text-3xs font-bold rounded uppercase tracking-wider transition-all ${
                      amenityType === type
                        ? 'bg-fifa-gold text-fifa-dark'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                    aria-label={`Show ${type} facilities`}
                    aria-pressed={amenityType === type}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2" role="list" aria-label={`${amenityType} facilities list`}>
              {activeAmenities.slice(0, 3).map((amenity): React.ReactElement => (
                <div key={amenity.id} role="listitem">
                  <AmenityRow amenity={amenity} />
                </div>
              ))}
              {activeAmenities.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-4">No open facilities of this type found.</p>
              )}
            </div>
          </section>
        </div>

        {/* ── AI Chat Panel ── */}
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
FanView.displayName = 'FanView';
export default FanView;
