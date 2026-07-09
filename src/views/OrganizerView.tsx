import React from 'react';
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
 * @param props - Venue and language state properties
 * @returns React.ReactElement
 */
export const OrganizerView: React.FC<OrganizerViewProps> = ({ venueId, language }): React.ReactElement => {
  const { crowdData } = useCrowd(venueId);
  const { messages, loading, error, sendMessage } = useGemini('organizer', language);

  const mockCarbonMetrics: CarbonMetrics = {
    venueId,
    solarPct: 45,
    energyMwh: 120,
    wasteRecycledPct: 78,
    transportCo2Saved: 1450,
    offsetCredits: 120,
    rating: 'B'
  };

  const dynamicRating = calculateSustainabilityRating({
    solarPct: mockCarbonMetrics.solarPct,
    energyMwh: mockCarbonMetrics.energyMwh,
    wasteRecycledPct: mockCarbonMetrics.wasteRecycledPct,
    transportCo2Saved: mockCarbonMetrics.transportCo2Saved,
    offsetCredits: mockCarbonMetrics.offsetCredits
  });

  if (!crowdData) {
    return (
      <div className="p-6 text-center text-slate-400">
        <Compass className="w-12 h-12 mx-auto mb-4 animate-spin" />
        <p className="text-sm font-semibold">Generating venue metrics dashboard...</p>
      </div>
    );
  }

  const riskScore = calculateRiskScore(crowdData.sections);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard
          title="Overall Attendance"
          value={crowdData.totalCount.toLocaleString()}
          subtitle={`${crowdData.occupancyPct}% of capacity`}
          icon={<Landmark className="w-4 h-4" />}
        />
        <MetricsCard
          title="Green Energy Rating"
          value={`Grade ${dynamicRating}`}
          subtitle={`${mockCarbonMetrics.solarPct}% Solar offsets`}
          icon={<Award className="w-4 h-4" />}
        />
        <MetricsCard
          title="Crowd Risk Index"
          value={`${riskScore}/100`}
          subtitle={riskScore > 60 ? 'HIGH RISK' : 'LOW RISK'}
          icon={<ShieldAlert className="w-4 h-4" />}
        />
        <MetricsCard
          title="Transport Offsets"
          value={`${mockCarbonMetrics.transportCo2Saved} kg`}
          subtitle="Saved emissions"
          icon={<BarChart3 className="w-4 h-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {riskScore > 65 && (
            <div className="p-4 bg-rose-950/40 border border-rose-500/30 text-rose-200 rounded-lg text-xs flex items-center space-x-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <div>
                <h4 className="font-bold">Match Director Crowd Alert</h4>
                <p className="mt-1">
                  Crowd Risk score has spiked above 65. Stand access gates D1 and D2 concourses are bottlenecked. Recommend staff deployment.
                </p>
              </div>
            </div>
          )}

          <CrowdHeatmap sections={crowdData.sections} />
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
};
export default OrganizerView;
