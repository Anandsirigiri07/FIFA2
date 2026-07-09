/**
 * Hook to manage real-time simulated crowd analytics for any venue.
 * Generates and updates section occupancy, inflow/outflow, and alerts dynamically.
 * @module useCrowd
 */

import { useState, useEffect } from 'react';
import type { CrowdData, SectionData, StadiumAlert } from '../types';
import { getVenueById } from '../utils/stadiumData';
import { getCrowdStatus } from '../utils/crowdCalc';

export interface UseCrowdResult {
  readonly crowdData: CrowdData | null;
  readonly refreshCrowdData: () => void;
}

/**
 * Returns dynamic crowd simulation data for a specified venue.
 * @param venueId - Active venue ID
 * @returns Crowd data object and manual refresh function
 */
export const useCrowd = (venueId: string): UseCrowdResult => {
  const [crowdData, setCrowdData] = useState<CrowdData | null>(null);

  /**
   * Helper that builds standard simulated data.
   * @returns CrowdData record or null if venue is invalid
   */
  const generateSimulatedData = (): CrowdData | null => {
    const venue = getVenueById(venueId);
    if (!venue) return null;

    const basePct = 65 + Math.floor(Math.random() * 20);
    const totalCount = Math.round((venue.capacity * basePct) / 100);
    const inflow = 150 + Math.floor(Math.random() * 100);
    const outflow = 80 + Math.floor(Math.random() * 50);

    const sections: SectionData[] = [
      { id: 'sec_north', name: 'North Stand', count: Math.round(totalCount * 0.25), pct: basePct + 5, status: getCrowdStatus(basePct + 5) },
      { id: 'sec_south', name: 'South Stand', count: Math.round(totalCount * 0.3), pct: basePct + 8, status: getCrowdStatus(basePct + 8) },
      { id: 'sec_east', name: 'East Stand', count: Math.round(totalCount * 0.2), pct: basePct - 5, status: getCrowdStatus(basePct - 5) },
      { id: 'sec_west', name: 'West Stand', count: Math.round(totalCount * 0.25), pct: basePct - 3, status: getCrowdStatus(basePct - 3) },
    ];

    const alerts: StadiumAlert[] = [];
    if (basePct > 80) {
      alerts.push({
        id: 'alert_crowd_high',
        type: 'warning',
        title: 'High Congestion Alert',
        message: 'Gate A and South Stand concourses are experiencing high traffic. Diverting new arrivals to Gate C.',
        timestamp: new Date(),
        isRead: false
      });
    }

    return {
      venueId,
      timestamp: new Date(),
      totalCount,
      capacity: venue.capacity,
      occupancyPct: basePct,
      inflowPerMin: inflow,
      outflowPerMin: outflow,
      sections,
      alerts
    };
  };

  useEffect((): (() => void) => {
    setCrowdData(generateSimulatedData());

    const interval = setInterval((): void => {
      setCrowdData(generateSimulatedData());
    }, 5000);

    return (): void => {
      clearInterval(interval);
    };
  }, [venueId]);

  return {
    crowdData,
    refreshCrowdData: (): void => {
      setCrowdData(generateSimulatedData());
    }
  };
};
