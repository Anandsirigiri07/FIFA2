import React, { useMemo, memo } from 'react';
import type { SectionData } from '../types';
import { Users } from 'lucide-react';

/**
 * Props for CrowdHeatmap.
 */
export interface CrowdHeatmapProps {
  readonly sections: readonly SectionData[];
}

/** Memoized Section Card for Heatmap */
const SectionCard = memo(({
  section
}: {
  readonly section: SectionData;
}): React.ReactElement => {
  const statusColorClass = useMemo(() => {
    switch (section.status) {
      case 'critical':
        return 'bg-rose-950/60 border-rose-500/50 text-rose-200';
      case 'high':
        return 'bg-amber-950/60 border-amber-500/50 text-amber-200';
      case 'moderate':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200';
      default:
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200';
    }
  }, [section.status]);

  return (
    <div
      className={`border rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 ${statusColorClass}`}
      role="listitem"
      aria-label={`${section.name}: ${section.pct}% occupied, status level is ${section.status}`}
    >
      <span className="text-xs font-semibold uppercase tracking-wider opacity-85">{section.name}</span>
      <span className="text-2xl font-black font-outfit my-1.5">{section.pct}%</span>
      <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-black/20 uppercase tracking-wide">
        {section.status}
      </span>
    </div>
  );
});
SectionCard.displayName = 'SectionCard';

/**
 * Interactive SVG/Grid representation of stadium sections and congestion.
 * Uses React.memo and useMemo for efficient layout computations.
 * @param props - Section congestion details
 * @returns React.ReactElement
 */
export const CrowdHeatmap: React.FC<CrowdHeatmapProps> = memo(({ sections }): React.ReactElement => {
  return (
    <div className="glass-card rounded-xl p-5" role="region" aria-labelledby="heatmap-heading">
      <div className="flex items-center space-x-2.5 mb-4">
        <Users className="w-5 h-5 text-fifa-gold" aria-hidden="true" />
        <h3 id="heatmap-heading" className="text-base font-bold text-white font-outfit">Stands Occupancy Heatmap</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" role="list" aria-label="Stadium occupancy by section">
        {sections.map((section): React.ReactElement => (
          <SectionCard key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
});

CrowdHeatmap.displayName = 'CrowdHeatmap';
export default CrowdHeatmap;
