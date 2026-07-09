/**
 * Crowd analytics calculations for StadiumIQ Pro.
 * All functions are pure — no side effects.
 * @module crowdCalc
 */

import type { CrowdStatus, SectionData } from '../types';

/**
 * Determines crowd status level from occupancy percentage.
 * @param pct - Occupancy percentage (0-100)
 * @returns CrowdStatus level string
 */
export const getCrowdStatus = (pct: number): CrowdStatus => {
  if (pct >= 90) return 'critical';
  if (pct >= 75) return 'high';
  if (pct >= 50) return 'moderate';
  return 'low';
};

/**
 * Calculates time to full capacity at current inflow rate.
 * @param capacity - Total venue capacity
 * @param currentCount - Current occupant count
 * @param inflowPerMin - People entering per minute
 * @returns Minutes until full, or Infinity if no inflow
 */
export const minutesToCapacity = (
  capacity: number,
  currentCount: number,
  inflowPerMin: number
): number => {
  if (inflowPerMin <= 0) return Infinity;
  const remaining = capacity - currentCount;
  if (remaining <= 0) return 0;
  return Math.round(remaining / inflowPerMin);
};

/**
 * Calculates overall risk score from section data.
 * Score 0-100 where 100 = maximum risk.
 * @param sections - Array of section occupancy data
 * @returns Risk score between 0 and 100
 */
export const calculateRiskScore = (
  sections: SectionData[]
): number => {
  if (sections.length === 0) return 0;
  const weights = { low: 0, moderate: 25, high: 60, critical: 100 };
  const total = sections.reduce(
    (sum, s) => sum + weights[s.status], 0
  );
  return Math.round(total / sections.length);
};

/**
 * Recommends gate redistribution based on queue times.
 * @param gates - Array of gate queue times in minutes
 * @returns Index of least congested gate
 */
export const recommendGate = (
  gates: number[]
): number => {
  if (gates.length === 0) return 0;
  return gates.indexOf(Math.min(...gates));
};

/**
 * Estimates exit time for full venue after match ends.
 * @param totalCount - Total people in venue
 * @param gatesOpen - Number of open exit gates
 * @param ratePerGate - People per minute per gate
 * @returns Estimated minutes to clear venue
 */
export const estimateExitTime = (
  totalCount: number,
  gatesOpen: number,
  ratePerGate: number
): number => {
  if (gatesOpen <= 0 || ratePerGate <= 0) return 999;
  return Math.ceil(totalCount / (gatesOpen * ratePerGate));
};
