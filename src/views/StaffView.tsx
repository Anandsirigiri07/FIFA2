import React, { useState, useMemo, useCallback, memo } from 'react';
import type { Language, IncidentType } from '../types';
import { useAlerts } from '../hooks/useAlerts';
import { IncidentForm } from '../components/IncidentForm';
import { MetricsCard } from '../components/MetricsCard';
import { GeminiChat } from '../components/GeminiChat';
import { useGemini } from '../hooks/useGemini';
import { Shield, ShieldAlert, Users, Award, Radio } from 'lucide-react';

/**
 * Props for StaffView.
 */
export interface StaffViewProps {
  readonly venueId: string;
  readonly language: Language;
}

/** Memoized single incident item for efficient lists rendering */
const IncidentRow = memo(({
  inc,
  onResolve,
  onTriage
}: {
  readonly inc: {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    readonly status: 'open' | 'in_progress' | 'resolved';
    readonly location: string;
    readonly timestamp: Date;
  };
  readonly onResolve: (id: string) => void;
  readonly onTriage: (id: string) => void;
}): React.ReactElement => {
  const severityBadgeClass = useMemo(() => {
    return inc.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300' : 'bg-slate-800 text-slate-300';
  }, [inc.severity]);

  const timestampString = useMemo(() => {
    return new Date(inc.timestamp).toLocaleTimeString();
  }, [inc.timestamp]);

  return (
    <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg flex flex-col space-y-2" role="listitem">
      <div className="flex items-center justify-between">
        <span className={`text-2xs font-extrabold uppercase tracking-wide px-2 py-0.5 rounded ${severityBadgeClass}`}>
          {inc.severity} Severity
        </span>
        <span className="text-3xs text-slate-500">{timestampString}</span>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-200">{inc.title}</h4>
        <p className="text-xs text-slate-400 mt-0.5">{inc.description}</p>
        <p className="text-2xs text-slate-500 mt-1 italic">Location: {inc.location}</p>
      </div>
      <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 mt-2">
        <span className="text-2xs text-slate-500">Status: <strong className="capitalize text-slate-300">{inc.status}</strong></span>
        <div className="flex space-x-1.5">
          {inc.status !== 'resolved' && (
            <button
              onClick={(): void => onResolve(inc.id)}
              className="px-2 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-3xs font-semibold rounded uppercase tracking-wider transition-colors"
              aria-label={`Mark incident ${inc.title} as resolved`}
            >
              Resolve
            </button>
          )}
          {inc.status === 'open' && (
            <button
              onClick={(): void => onTriage(inc.id)}
              className="px-2 py-1 bg-amber-950 hover:bg-amber-900 text-amber-300 text-3xs font-semibold rounded uppercase tracking-wider transition-colors"
              aria-label={`Mark incident ${inc.title} as in progress`}
            >
              Triage
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
IncidentRow.displayName = 'IncidentRow';

/**
 * Stadium staff console with incident lists, operation metrics and coordinator chat.
 * Uses React.memo, useMemo, and useCallback to avoid redundant re-renders.
 * @param props - Venue and language configuration
 * @returns React.ReactElement
 */

/** Emergency response protocol definition */
interface Protocol {
  readonly trigger: string;
  readonly actions: readonly string[];
  readonly escalate: string;
}

/** Pre-defined response protocols for common incidents */
const PROTOCOLS: Readonly<Record<string, Protocol>> = {
  overcrowding: {
    trigger: 'Section exceeds 90% capacity',
    actions: [
      'Open overflow zones in adjacent sections immediately',
      'Deploy 2 extra staff to affected gates',
      'PA announcement: suggest alternative sections to fans',
      'Open emergency access corridors and side entrances',
    ],
    escalate: 'Contact Operations Command if any section hits 95%+',
  },
  medical: {
    trigger: 'Medical emergency reported by any team member',
    actions: [
      'Dispatch nearest first-aid team to location NOW',
      'Clear 3-meter radius — keep bystanders back',
      'Guide paramedics via radio with exact section/row',
      'Log incident immediately with GPS timestamp',
    ],
    escalate: 'Call ambulance if no improvement within 3 minutes',
  },
  security: {
    trigger: 'Security threat or suspicious behavior identified',
    actions: [
      'Alert Security Command on radio channel 3 immediately',
      'Do NOT approach the threat alone under any circumstances',
      'Begin calm, quiet evacuation of the nearest 2 rows',
      'Do not announce over PA — avoid panic',
    ],
    escalate: 'Trigger full evacuation protocol if weapon is confirmed',
  },
  bottleneck: {
    trigger: 'Gate entry queue exceeds 15 minutes wait time',
    actions: [
      'Open the adjacent gate if available and staffed',
      'Deploy queue management volunteers to the affected gate',
      'PA announcement: direct fans to alternative entry points',
      'Switch to group scanning mode to increase throughput',
    ],
    escalate: 'Escalate to Gate Operations Manager after 20 minutes',
  },
};

/** Real-time AI decision support panel for stadium staff */
const DecisionSupport = memo((): React.ReactElement => {
  const [selected, setSelected] = useState<string>('overcrowding');
  const protocol = PROTOCOLS[selected];

  return (
    <section
      className="glass-card rounded-xl p-5"
      aria-labelledby="decision-heading"
      aria-live="polite"
    >
      <div className="flex items-center space-x-2.5 mb-4">
        <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" aria-hidden="true" />
        <h3 id="decision-heading" className="text-base font-bold text-white font-outfit">
          Real-Time Decision Support
        </h3>
      </div>
      <div
        className="grid grid-cols-2 gap-2 mb-4"
        role="group"
        aria-label="Select incident type for response protocol"
      >
        {Object.keys(PROTOCOLS).map((k): React.ReactElement => (
          <button
            key={k}
            onClick={(): void => setSelected(k)}
            aria-pressed={selected === k}
            aria-label={`Show ${k} response protocol`}
            className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${
              selected === k
                ? 'bg-red-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {k}
          </button>
        ))}
      </div>
      {protocol && (
        <div>
          <p className="text-yellow-400 text-xs mb-3 font-medium">
            🚨 TRIGGER: {protocol.trigger}
          </p>
          <ol className="space-y-2 mb-4" aria-label="Response steps">
            {protocol.actions.map((action, i): React.ReactElement => (
              <li key={i} className="flex gap-2 text-xs text-white">
                <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                {action}
              </li>
            ))}
          </ol>
          <div
            className="bg-red-900/30 border border-red-700/50 rounded-lg p-3"
            role="note"
            aria-label="Escalation condition"
          >
            <p className="text-red-400 text-xs font-bold">⬆️ ESCALATE IF:</p>
            <p className="text-red-200 text-xs mt-1">{protocol.escalate}</p>
          </div>
        </div>
      )}
    </section>
  );
});
DecisionSupport.displayName = 'DecisionSupport';

export const StaffView: React.FC<StaffViewProps> = memo(({ venueId, language }): React.ReactElement => {
  const { incidents, addIncident, updateIncidentStatus } = useAlerts(venueId);
  const { messages, loading, error, sendMessage } = useGemini('staff', language, venueId);

  const openIncidentsCount = useMemo(
    () => incidents.filter((i): boolean => i.status !== 'resolved').length,
    [incidents]
  );

  const handleResolve = useCallback((id: string): void => {
    updateIncidentStatus(id, 'resolved');
  }, [updateIncidentStatus]);

  const handleTriage = useCallback((id: string): void => {
    updateIncidentStatus(id, 'in_progress');
  }, [updateIncidentStatus]);

  const handleReport = useCallback((
    type: IncidentType,
    title: string,
    desc: string,
    loc: string,
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  ): Promise<import('../types').Incident> => {
    return addIncident(type, title, desc, loc, severity, 'staff_command_center');
  }, [addIncident]);

  return (
    <div className="space-y-6">
      {/* ── Key Performance Indicators ── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Incident and Staff Metrics">
        <MetricsCard
          title="Staff On Duty"
          value={342}
          subtitle="All sectors active"
          icon={<Shield className="w-4 h-4" aria-hidden="true" />}
        />
        <MetricsCard
          title="Active Volunteers"
          value={180}
          subtitle="96% shift attendance"
          icon={<Users className="w-4 h-4" aria-hidden="true" />}
        />
        <MetricsCard
          title="Open Incidents"
          value={openIncidentsCount}
          subtitle="Avg triage: 3 mins"
          icon={<ShieldAlert className="w-4 h-4" aria-hidden="true" />}
        />
        <MetricsCard
          title="Satisfaction Score"
          value="4.8/5"
          subtitle="Checked from 1200 reviews"
          icon={<Award className="w-4 h-4" aria-hidden="true" />}
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <IncidentForm onReport={handleReport} reporterId="staff_command_center" />

          <DecisionSupport />

          {/* ── Incidents Log Panel ── */}
          <section className="glass-card rounded-xl p-5" aria-labelledby="incidents-heading">
            <div className="flex items-center space-x-2.5 mb-4">
              <Radio className="w-5 h-5 text-fifa-gold animate-pulse" aria-hidden="true" />
              <h3 id="incidents-heading" className="text-base font-bold text-white font-outfit">Active Incidents Log</h3>
            </div>

            <div
              className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1"
              role="list"
              aria-label="Incident logs feed"
            >
              {incidents.map((inc): React.ReactElement => (
                <IncidentRow
                  key={inc.id}
                  inc={inc}
                  onResolve={handleResolve}
                  onTriage={handleTriage}
                />
              ))}
              {incidents.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-6">All clear. No active incidents reported.</p>
              )}
            </div>
          </section>
        </div>

        <GeminiChat
          messages={messages}
          loading={loading}
          error={error}
          onSendMessage={sendMessage}
          currentPersona="staff"
          currentLanguage={language}
        />
      </div>
    </div>
  );
});

StaffView.displayName = 'StaffView';
export default StaffView;
