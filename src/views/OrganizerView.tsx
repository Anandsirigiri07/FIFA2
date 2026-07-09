import React, { useMemo, memo } from 'react';
import type { Language, CarbonMetrics } from '../types';
import { useCrowd } from '../hooks/useCrowd';
import { calculateRiskScore } from '../utils/crowdCalc';
import { calculateSustainabilityRating } from '../utils/carbonCalc';
import { CrowdHeatmap } from '../components/CrowdHeatmap';
import { MetricsCard } from '../components/MetricsCard';
import { GeminiChat } from '../components/GeminiChat';
import { useGemini } from '../hooks/useGemini';
import { BarChart3, Landmark, Compass, Award, ShieldAlert } from 'lucide-react';

/**
 * Props for OrganizerView.
 */
export interface OrganizerViewProps {
  readonly venueId: string;
  readonly language: Language;
}

/**
 * Match Director overview console detailing crowd safety, green indexes and analytics.
 * Uses React.memo and useMemo to optimize component rendering and metric derivations.
 * @param props - Venue and language state properties
 * @returns React.ReactElement
 */
export const OrganizerView: React.FC<OrganizerViewProps> = memo(({ venueId, language }): React.ReactElement => {
  const { crowdData } = useCrowd(venueId);
  const { messages, loading, error, sendMessage } = useGemini('organizer', language);

  const mockCarbonMetrics: CarbonMetrics = useMemo(() => ({
    venueId,
    solarPct: 45,
    energyMwh: 120,
    wasteRecycledPct: 78,
    transportCo2Saved: 1450,
    offsetCredits: 120,
    rating: 'B'
  }), [venueId]);

  const dynamicRating = useMemo(() => calculateSustainabilityRating({
    solarPct: mockCarbonMetrics.solarPct,
    energyMwh: mockCarbonMetrics.energyMwh,
    wasteRecycledPct: mockCarbonMetrics.wasteRecycledPct,
    transportCo2Saved: mockCarbonMetrics.transportCo2Saved,
    offsetCredits: mockCarbonMetrics.offsetCredits
  }), [mockCarbonMetrics]);

  const riskScore = useMemo(
    () => (crowdData ? calculateRiskScore(crowdData.sections) : 0),
    [crowdData]
  );

  const riskStatusText = useMemo(() => (riskScore > 60 ? 'HIGH RISK' : 'LOW RISK'), [riskScore]);

  if (!crowdData) {
    return (
      <div className="p-6 text-center text-slate-400" role="status" aria-label="Generating venue metrics dashboard">
        <Compass className="w-12 h-12 mx-auto mb-4 animate-spin" aria-hidden="true" />
        <p className="text-sm font-semibold">Generating venue metrics dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Metrics Cards Grid ── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Key Performance Indicators">
        <MetricsCard
          title="Overall Attendance"
          value={crowdData.totalCount.toLocaleString()}
          subtitle={`${crowdData.occupancyPct}% of capacity`}
          icon={<Landmark className="w-4 h-4" aria-hidden="true" />}
        />
        <MetricsCard
          title="Green Energy Rating"
          value={`Grade ${dynamicRating}`}
          subtitle={`${mockCarbonMetrics.solarPct}% Solar offsets`}
          icon={<Award className="w-4 h-4" aria-hidden="true" />}
        />
        <MetricsCard
          title="Crowd Risk Index"
          value={`${riskScore}/100`}
          subtitle={riskStatusText}
          icon={<ShieldAlert className="w-4 h-4" aria-hidden="true" />}
        />
        <MetricsCard
          title="Transport Offsets"
          value={`${mockCarbonMetrics.transportCo2Saved} kg`}
          subtitle="Saved emissions"
          icon={<BarChart3 className="w-4 h-4" aria-hidden="true" />}
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* ── High Risk Alert Banner ── */}
          {riskScore > 65 && (
            <div
              className="p-4 bg-rose-950/40 border border-rose-500/30 text-rose-200 rounded-lg text-xs flex items-center space-x-3"
              role="alert"
              aria-live="assertive"
            >
              <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0" aria-hidden="true" />
              <div>
                <h4 className="font-bold">Match Director Crowd Alert</h4>
                <p className="mt-1">
                  Crowd Risk score has spiked above 65. Stand access gates D1 and D2 concourses are bottlenecked. Recommend staff deployment.
                </p>
              </div>
            </div>
          )}

          {/* ── Heatmap Panel ── */}
          <section aria-label="Venue Heatmap Visualizer">
            <CrowdHeatmap sections={crowdData.sections} />
          </section>
        </div>

        <GeminiChat
          messages={messages}
          loading={loading}
          error={error}
          onSendMessage={sendMessage}
          currentPersona="organizer"
          currentLanguage={language}
        />
      </div>
    </div>
  );
});

OrganizerView.displayName = 'OrganizerView';
export default OrganizerView;
