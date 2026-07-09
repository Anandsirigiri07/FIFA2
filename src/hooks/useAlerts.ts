/**
 * Hook to manage active stadium alerts, incident reporting logs, and real-time warnings.
 * @module useAlerts
 */

import { useState, useEffect } from 'react';
import type { StadiumAlert, Incident, IncidentType } from '../types';

export interface UseAlertsResult {
  readonly alerts: readonly StadiumAlert[];
  readonly incidents: readonly Incident[];
  readonly addIncident: (
    type: IncidentType,
    title: string,
    description: string,
    location: string,
    severity: Incident['severity'],
    reportedBy: string
  ) => Promise<Incident>;
  readonly updateIncidentStatus: (id: string, status: Incident['status']) => void;
  readonly markAlertAsRead: (id: string) => void;
}

/**
 * Handles active alerts and incident logs for staff and organizer views.
 * @param venueId - Active venue identifier
 * @returns Alerts state list, active incidents, and action handlers
 */
export const useAlerts = (venueId: string): UseAlertsResult => {
  const [alerts, setAlerts] = useState<StadiumAlert[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect((): void => {
    const defaultAlerts: StadiumAlert[] = [
      {
        id: 'alert_heat',
        type: 'info',
        title: 'Stay Hydrated',
        message: 'Temperature inside the arena is 28°C. Drinking water stations are open at Sections 104 and 208.',
        timestamp: new Date(),
        isRead: false
      },
      {
        id: 'alert_metro',
        type: 'warning',
        title: 'Metro Transit Delay',
        message: 'Line 2 Metro is running 10 minutes behind schedule. Consider taking Shuttle Bus B from Gate C.',
        timestamp: new Date(),
        isRead: false
      }
    ];

    const defaultIncidents: Incident[] = [
      {
        id: 'inc_1',
        type: 'medical',
        title: 'Dehydration in Section 102',
        description: 'Spectator feeling dizzy and asking for water.',
        location: 'Section 102, Row M',
        severity: 'LOW',
        status: 'in_progress',
        reportedBy: 'volunteer_55',
        timestamp: new Date(Date.now() - 600000),
        aiResponse: 'Triage Recommendation: Dispatch Medical Unit 1 with a water flask. Direct helper to lay patient flat.'
      },
      {
        id: 'inc_2',
        type: 'crowd',
        title: 'Gate B Queue Spikes',
        description: 'Gate B turnstile queue has grown to 15 minutes due to reader error.',
        location: 'Gate B Entrance',
        severity: 'MEDIUM',
        status: 'open',
        reportedBy: 'staff_12',
        timestamp: new Date(Date.now() - 300000),
        aiResponse: 'Triage Recommendation: Direct entry traffic to Gate A (Accessible, 5 min queue). Dispatch technician to check card reader #3.'
      }
    ];

    setAlerts(defaultAlerts);
    setIncidents(defaultIncidents);
  }, [venueId]);

  /**
   * Marks a stadium alert as read.
   * @param id - Alert ID
   * @returns void
   */
  const markAlertAsRead = (id: string): void => {
    setAlerts((prev): StadiumAlert[] =>
      prev.map((x): StadiumAlert => (x.id === id ? { ...x, isRead: true } : x))
    );
  };

  /**
   * Submits a new incident report, automatically triggering a simulated AI triage suggestion.
   * @param type - Incident type
   * @param title - Title
   * @param description - Detailed description
   * @param location - Specific area/section
   * @param severity - Incident urgency
   * @param reportedBy - Actor reporting the incident
   * @returns Promise resolving to the newly created Incident
   */
  const addIncident = async (
    type: IncidentType,
    title: string,
    description: string,
    location: string,
    severity: Incident['severity'],
    reportedBy: string
  ): Promise<Incident> => {
    const severityAdvice = severity === 'CRITICAL' 
      ? 'IMMEDIATE EMERGENCY dispatch required. Notify stadium safety lead.' 
      : 'Monitor locally. Log status upon resolution.';
    
    const aiResponse = `[Gemini Triage Recommendation]: Type: ${type.toUpperCase()}. Location: ${location}. Severity: ${severity}. Suggested protocol: ${severityAdvice}`;

    const newIncident: Incident = {
      id: `inc_${Math.random().toString(36).substring(7)}`,
      type,
      title,
      description,
      location,
      severity,
      status: 'open',
      reportedBy,
      timestamp: new Date(),
      aiResponse
    };

    setIncidents((prev): Incident[] => [newIncident, ...prev]);
    return newIncident;
  };

  /**
   * Updates an incident status.
   * @param id - Incident ID
   * @param status - Target status
   * @returns void
   */
  const updateIncidentStatus = (id: string, status: Incident['status']): void => {
    setIncidents((prev): Incident[] =>
      prev.map((x): Incident => (x.id === id ? { ...x, status } : x))
    );
  };

  return {
    alerts,
    incidents,
    addIncident,
    updateIncidentStatus,
    markAlertAsRead
  };
};
