import React, { useState } from 'react';
import type { IncidentType, Incident } from '../types';
import { AlertCircle, PlusCircle, CheckCircle } from 'lucide-react';

/**
 * Props for IncidentForm component.
 */
export interface IncidentFormProps {
  readonly onReport: (
    type: IncidentType,
    title: string,
    description: string,
    location: string,
    severity: Incident['severity'],
    reportedBy: string
  ) => Promise<Incident>;
  readonly reporterId: string;
}

/**
 * Accessible form for reporting stadium events, showing real-time AI recommendations.
 * @param props - Submit callback and reporter context details
 * @returns React.ReactElement
 */
export const IncidentForm: React.FC<IncidentFormProps> = ({ onReport, reporterId }): React.ReactElement => {
  const [type, setType] = useState<IncidentType>('medical');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('LOW');

  const [loading, setLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [triageResponse, setTriageResponse] = useState<string | null>(null);

  /**
   * Submits the form data and requests automated AI suggestions.
   * @param e - React FormEvent
   * @returns Promise resolving to void
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) {
      return;
    }

    setLoading(true);
    setSuccessMsg(null);
    setTriageResponse(null);

    try {
      const incident = await onReport(type, title, description, location, severity, reporterId);
      setSuccessMsg('Incident reported successfully.');
      if (incident.aiResponse) {
        setTriageResponse(incident.aiResponse);
      }
      setTitle('');
      setDescription('');
      setLocation('');
      setSeverity('LOW');
    } catch (err) {
      console.error('Incident report submission failed: ', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center space-x-2.5 mb-4">
        <PlusCircle className="w-5 h-5 text-fifa-gold" aria-hidden="true" />
        <h3 className="text-base font-bold text-white font-outfit">Report Active Incident</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="inc-type" className="text-xs font-semibold text-slate-400">Incident Category</label>
            <select
              id="inc-type"
              value={type}
              onChange={(e): void => setType(e.target.value as IncidentType)}
              className="glass-input rounded-lg p-2.5 text-sm"
              aria-label="Incident Category"
            >
              <option value="medical">Medical / First Aid</option>
              <option value="security">Security / Crowd safety</option>
              <option value="crowd">Crowd flow congestion</option>
              <option value="facility">Facility / Structural issue</option>
              <option value="fire">Fire / Hazards</option>
              <option value="technical">Technical / Network outage</option>
            </select>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label htmlFor="inc-severity" className="text-xs font-semibold text-slate-400">Urgency Level</label>
            <select
              id="inc-severity"
              value={severity}
              onChange={(e): void => setSeverity(e.target.value as Incident['severity'])}
              className="glass-input rounded-lg p-2.5 text-sm font-semibold"
              aria-label="Incident Severity Level"
            >
              <option value="LOW">LOW • Monitor locally</option>
              <option value="MEDIUM">MEDIUM • Response team alert</option>
              <option value="HIGH">HIGH • Rapid dispatch</option>
              <option value="CRITICAL">CRITICAL • Emergency alert</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="inc-title" className="text-xs font-semibold text-slate-400">Brief Title</label>
            <input
              id="inc-title"
              type="text"
              value={title}
              onChange={(e): void => setTitle(e.target.value)}
              placeholder="e.g. Broken turnstile reader"
              className="glass-input rounded-lg p-2.5 text-sm"
              required
              aria-label="Brief Title"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label htmlFor="inc-loc" className="text-xs font-semibold text-slate-400">Location / Stand</label>
            <input
              id="inc-loc"
              type="text"
              value={location}
              onChange={(e): void => setLocation(e.target.value)}
              placeholder="e.g. Concourse level 2 Gate A"
              className="glass-input rounded-lg p-2.5 text-sm"
              required
              aria-label="Location / Stand"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-1.5">
          <label htmlFor="inc-desc" className="text-xs font-semibold text-slate-400">Detailed Description</label>
          <textarea
            id="inc-desc"
            value={description}
            onChange={(e): void => setDescription(e.target.value)}
            placeholder="Provide context for dispatch safety officers..."
            className="glass-input rounded-lg p-2.5 text-sm min-h-[80px]"
            required
            aria-label="Detailed Description"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-fifa-gold hover:bg-opacity-90 text-fifa-dark py-2.5 rounded-lg font-bold text-sm tracking-wide transition-all shadow-md disabled:opacity-50"
          aria-label="Report stadium incident"
        >
          {loading ? 'Submitting & Generating AI Recommendations...' : 'Report Incident & Fetch AI Triage'}
        </button>
      </form>

      {successMsg && (
        <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 rounded-lg text-xs flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {triageResponse && (
        <div className="mt-4 p-4 bg-slate-900 border border-fifa-gold/30 rounded-lg text-xs">
          <h4 className="font-bold text-fifa-gold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-fifa-gold" />
            GenAI Real-Time Command Triage
          </h4>
          <p className="text-slate-300 leading-relaxed font-mono">{triageResponse}</p>
        </div>
      )}
    </div>
  );
};
export default IncidentForm;
