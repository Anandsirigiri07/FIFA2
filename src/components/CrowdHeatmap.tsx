import React from 'react';
import type { SectionData } from '../types';
import { Users } from 'lucide-react';

/**
 * Props for CrowdHeatmap.
 */
export interface CrowdHeatmapProps {
  readonly sections: SectionData[];
}

/**
 * Interactive SVG/Grid representation of stadium sections and congestion.
 * @param props - Section congestion details
 * @returns React.ReactElement
 */
export const CrowdHeatmap: React.FC<CrowdHeatmapProps> = ({ sections }): React.ReactElement => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'critical': 
        return 'bg-rose-950/60 border-rose-500/50 text-rose-200';
      case 'high': 
        return 'bg-amber-950/60 border-amber-500/50 text-amber-200';
      case 'moderate': 
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200';
      default: 
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200';
    }
  };

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center space-x-2.5 mb-4">
        <Users className="w-5 h-5 text-fifa-gold" aria-hidden="true" />
        <h3 className="text-base font-bold text-white font-outfit">Stands Occupancy Heatmap</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sections.map((section): React.ReactElement => (
          <div
            key={section.id}
            className={`border rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 ${getStatusColor(section.status)}`}
            aria-label={`${section.name}: ${section.pct}% occupied, status level is ${section.status}`}
          >
            <span className="text-xs font-semibold uppercase tracking-wider opacity-85">{section.name}</span>
            <span className="text-2xl font-black font-outfit my-1.5">{section.pct}%</span>
            <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-black/20 uppercase tracking-wide">
              {section.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CrowdHeatmap;
