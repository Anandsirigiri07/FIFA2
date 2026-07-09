import React, { useMemo, useCallback, memo } from 'react';
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
export const StaffView: React.FC<StaffViewProps> = memo(({ venueId, language }): React.ReactElement => {
  const { incidents, addIncident, updateIncidentStatus } = useAlerts(venueId);
  const { messages, loading, error, sendMessage } = useGemini('staff', language);

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
