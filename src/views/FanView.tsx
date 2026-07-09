import React, { useState } from 'react';
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

/**
 * Fan command center view detailing seating, queues, carbon metrics, and chat.
 * @param props - Active venue and language options
 * @returns React.ReactElement
 */
export const FanView: React.FC<FanViewProps> = ({ venueId, language }): React.ReactElement => {
  const venue = getVenueById(venueId);
  const { messages, loading, error, sendMessage } = useGemini('fan', language);

  const [distance, setDistance] = useState<number>(15);
  const [transportMode, setTransportMode] = useState<TransportMode>('metro');
  const [amenityType, setAmenityType] = useState<'food' | 'restroom' | 'medical'>('food');

  if (!venue) {
    return (
      <div className="p-6 text-center text-slate-400">
        <Compass className="w-12 h-12 mx-auto mb-4 animate-spin" />
        <p className="text-sm font-semibold">Stadium information is currently loading...</p>
      </div>
    );
  }

  const gateQueues = venue.gates.map((g): number => (g.isOpen ? g.queueMinutes : 999));
  const bestGateIdx = recommendGate(gateQueues);
  const bestGate = venue.gates[bestGateIdx];
  const co2Saved = calculateCO2Saved(transportMode, distance);
  const activeAmenities = findAmenities(venueId, amenityType);

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-fifa-gold/10 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-2xs font-extrabold uppercase tracking-widest text-fifa-gold px-2 py-0.5 bg-fifa-gold/15 rounded-full border border-fifa-gold/25">
              Active Host Stadium
            </span>
            <h2 className="text-3xl font-black font-outfit text-white tracking-tight mt-2">{venue.name}</h2>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-fifa-gold" />
              {venue.city}, {venue.country} • Capacity: {venue.capacity.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center space-x-2.5 mb-4">
              <Trophy className="w-5 h-5 text-fifa-gold" />
              <h3 className="text-base font-bold text-white font-outfit">Entry Gate Queues</h3>
            </div>
            
            {bestGate && bestGate.isOpen && (
              <div className="mb-4 p-3.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 rounded-lg text-xs flex items-center space-x-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span>
                  <strong>Recommended Entry:</strong> {bestGate.name} has the shortest queue ({bestGate.queueMinutes} mins).
                </span>
              </div>
            )}

            <div className="space-y-2.5">
              {venue.gates.map((gate): React.ReactElement => (
                <div key={gate.id} className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800/80 rounded-lg">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{gate.name}</h4>
                    <p className="text-2xs text-slate-500">{gate.isAccessible ? '♿ Step-free Access' : 'Standard Gate'}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    gate.isOpen 
                      ? gate.queueMinutes > 10 
                        ? 'bg-amber-950 text-amber-300' 
                        : 'bg-emerald-950 text-emerald-300' 
                      : 'bg-slate-950 text-slate-500'
                  }`}>
                    {gate.isOpen ? `${gate.queueMinutes} Min wait` : 'Closed'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center space-x-2.5 mb-4">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white font-outfit">Sustainable Travel Calculator</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col space-y-1">
                <label htmlFor="mode-select" className="text-xs font-medium text-slate-400">Travel Mode</label>
                <select
                  id="mode-select"
                  value={transportMode}
                  onChange={(e): void => setTransportMode(e.target.value as TransportMode)}
                  className="glass-input rounded-lg p-2 text-xs"
                  aria-label="Select mode of transport"
                >
                  <option value="metro">Metro Link</option>
                  <option value="bus">Shuttle Bus</option>
                  <option value="shuttle">Carpool Shuttle</option>
                  <option value="rideshare">Rideshare Alone</option>
                  <option value="walk">Walking</option>
                  <option value="bike">Bicycling</option>
                </select>
              </div>
              <div className="flex flex-col space-y-1">
                <label htmlFor="dist-input" className="text-xs font-medium text-slate-400">Distance (km)</label>
                <input
                  id="dist-input"
                  type="number"
                  value={distance}
                  onChange={(e): void => setDistance(Math.max(1, Number(e.target.value)))}
                  className="glass-input rounded-lg p-2 text-xs"
                  aria-label="Input travel distance"
                  min="1"
                />
              </div>
            </div>
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/25 rounded-lg flex items-center justify-between">
              <span className="text-xs text-slate-300">CO2 Emissions Saved vs Solo Driving:</span>
              <span className="text-sm font-black text-emerald-400 font-outfit">{co2Saved} kg CO₂</span>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <Coffee className="w-5 h-5 text-fifa-gold" />
                <h3 className="text-base font-bold text-white font-outfit">Nearest Facilities</h3>
              </div>
              <div className="flex space-x-1.5">
                {(['food', 'restroom', 'medical'] as const).map((type): React.ReactElement => (
                  <button
                    key={type}
                    onClick={(): void => setAmenityType(type)}
                    className={`px-2 py-0.5 text-3xs font-bold rounded uppercase tracking-wider transition-all ${
                      amenityType === type 
                        ? 'bg-fifa-gold text-fifa-dark' 
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                    aria-label={`Show ${type}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              {activeAmenities.slice(0, 3).map((amenity): React.ReactElement => (
                <div key={amenity.id} className="flex justify-between items-center p-2.5 bg-slate-900/60 rounded-lg">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{amenity.name}</h4>
                    <p className="text-3xs text-slate-500">{amenity.section}</p>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    Queue: {amenity.waitMinutes}m
                  </span>
                </div>
              ))}
              {activeAmenities.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-4">No open facilities of this type found.</p>
              )}
            </div>
          </div>
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
};
export default FanView;
