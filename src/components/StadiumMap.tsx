import React, { useState, useCallback, useMemo, memo } from 'react';
import type { Gate, Amenity } from '../types';
import { MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

/**
 * Props for StadiumMap component.
 */
export interface StadiumMapProps {
  readonly gates: readonly Gate[];
  readonly amenities: readonly Amenity[];
}

/** Memoized Gate Item for Stadium Map */
const MapGateItem = memo(({ gate }: { readonly gate: Gate }): React.ReactElement => (
  <div
    className={`p-3.5 border rounded-xl flex items-center justify-between transition-colors ${
      gate.isOpen 
        ? 'bg-slate-900 border-slate-800 hover:border-fifa-gold/30' 
        : 'bg-slate-950 border-slate-900 opacity-60'
    }`}
  >
    <div>
      <h4 className="text-sm font-semibold text-white">{gate.name}</h4>
      <p className="text-2xs text-slate-400 mt-0.5">
        Queue: {gate.isOpen ? `${gate.queueMinutes}m` : 'Closed'} • {gate.isAccessible ? '♿ Accessible' : 'Standard'}
      </p>
    </div>
    <div>
      {gate.isOpen ? (
        <CheckCircle className="w-4 h-4 text-emerald-400" aria-label="Gate is open" />
      ) : (
        <XCircle className="w-4 h-4 text-rose-500" aria-label="Gate is closed" />
      )}
    </div>
  </div>
));
MapGateItem.displayName = 'MapGateItem';

/** Memoized Amenity Item for Stadium Map */
const MapAmenityItem = memo(({ amenity }: { readonly amenity: Amenity }): React.ReactElement => (
  <div
    className={`p-3.5 border rounded-xl flex items-center justify-between transition-colors ${
      amenity.isOpen 
        ? 'bg-slate-900 border-slate-800 hover:border-fifa-gold/30' 
        : 'bg-slate-950 border-slate-900 opacity-60'
    }`}
  >
    <div>
      <h4 className="text-sm font-semibold text-white">{amenity.name}</h4>
      <p className="text-2xs text-slate-400 mt-0.5">
        Type: {amenity.type} • Sect: {amenity.section} • Wait: {amenity.isOpen ? `${amenity.waitMinutes}m` : 'Closed'}
      </p>
    </div>
    <div>
      <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
        {amenity.type}
      </span>
    </div>
  </div>
));
MapAmenityItem.displayName = 'MapAmenityItem';

/** Filter option items constant */
const FILTER_OPTIONS = ['all', 'gates', 'amenities'] as const;

/**
 * Interactive map component highlighting gates, restrooms, food courts and medical bays.
 * Uses React.memo, useMemo, and useCallback for optimal efficiency.
 * @param props - Map elements (gates & amenities)
 * @returns React.ReactElement
 */
export const StadiumMap: React.FC<StadiumMapProps> = memo(({ gates, amenities }): React.ReactElement => {
  const [filterType, setFilterType] = useState<'all' | 'gates' | 'amenities'>('all');

  const handleSetFilter = useCallback((type: 'all' | 'gates' | 'amenities'): void => {
    setFilterType(type);
  }, []);

  const showGates = useMemo(() => filterType === 'all' || filterType === 'gates', [filterType]);
  const showAmenities = useMemo(() => filterType === 'all' || filterType === 'amenities', [filterType]);

  return (
    <div className="glass-card rounded-xl p-5" role="region" aria-labelledby="map-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center space-x-2.5">
          <MapPin className="w-5 h-5 text-fifa-gold" aria-hidden="true" />
          <h3 id="map-heading" className="text-base font-bold text-white font-outfit">Interactive Venue Map</h3>
        </div>
        <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700" role="radiogroup" aria-label="Filter Map Markers">
          {FILTER_OPTIONS.map((type): React.ReactElement => (
            <button
              key={type}
              onClick={(): void => handleSetFilter(type)}
              role="radio"
              aria-checked={filterType === type}
              className={`px-3 py-1 text-xs font-semibold rounded-md uppercase tracking-wider transition-all focus:outline-none focus:ring-1 focus:ring-fifa-gold ${
                filterType === type 
                  ? 'bg-fifa-gold text-fifa-dark' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label={`Filter map by ${type}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="relative border border-slate-800 rounded-xl bg-slate-950 p-6 flex flex-col md:flex-row items-center justify-center min-h-[300px] mb-4 gap-6">
        <div className="w-full md:w-2/3 grid grid-cols-2 gap-4" role="list" aria-label="Stands and Amenities">
          {showGates && gates.map((gate): React.ReactElement => (
            <div key={gate.id} role="listitem">
              <MapGateItem gate={gate} />
            </div>
          ))}

          {showAmenities && amenities.map((amenity): React.ReactElement => (
            <div key={amenity.id} role="listitem">
              <MapAmenityItem amenity={amenity} />
            </div>
          ))}
        </div>

        <div className="w-full md:w-1/3 glass-panel rounded-xl p-4 self-stretch flex flex-col justify-between" role="complementary" aria-label="Map Legend Detail">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">Map Legend</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span className="text-slate-300">Operational & Open</span>
              </div>
              <div className="flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-rose-500" aria-hidden="true" />
                <span className="text-slate-300">Closed / Standby</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300" aria-hidden="true">food</span>
                <span className="text-slate-300">Catering / Concession</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-300" aria-hidden="true">♿</span>
                <span className="text-slate-300">Step-free Seating & Gates</span>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800/80 pt-3 mt-3 flex items-center space-x-2 text-2xs text-slate-400">
            <AlertCircle className="w-3 h-3 text-fifa-gold flex-shrink-0" aria-hidden="true" />
            <span>Map indices are refreshed live from gate sensors.</span>
          </div>
        </div>
      </div>
    </div>
  );
});

StadiumMap.displayName = 'StadiumMap';
export default StadiumMap;
