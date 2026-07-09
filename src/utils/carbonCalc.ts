/**
 * Sustainability and carbon calculation utilities.
 * Aligned with FIFA 2026 green stadium standards.
 * @module carbonCalc
 */

import type { TransportMode, CarbonMetrics } from '../types';

/** CO2 kg per passenger km by transport mode */
const TRANSPORT_FACTORS: Readonly<Record<TransportMode, number>> = {
  walk: 0,
  bike: 0,
  metro: 0.041,
  bus: 0.089,
  shuttle: 0.075,
  rideshare: 0.21,
};

/**
 * Calculates CO2 emissions for a given transport trip.
 * @param mode - Mode of transport
 * @param distanceKm - Distance in kilometers
 * @returns CO2 emitted in kilograms
 */
export const calculateTransportCO2 = (
  mode: TransportMode,
  distanceKm: number
): number => {
  const factor = TRANSPORT_FACTORS[mode];
  return Math.round(factor * distanceKm * 1000) / 1000;
};

/**
 * Calculates CO2 saved vs driving alone.
 * @param mode - Chosen transport mode
 * @param distanceKm - Trip distance in km
 * @returns CO2 saved in kilograms
 */
export const calculateCO2Saved = (
  mode: TransportMode,
  distanceKm: number
): number => {
  const carCO2 = calculateTransportCO2('rideshare', distanceKm);
  const modeCO2 = calculateTransportCO2(mode, distanceKm);
  return Math.max(0, Math.round((carCO2 - modeCO2) * 1000) / 1000);
};

/**
 * Calculates overall sustainability rating for a venue.
 * Uses FIFA green standards as baseline.
 * @param metrics - Venue carbon and energy metrics
 * @returns Letter grade A-D based on performance
 */
export const calculateSustainabilityRating = (
  metrics: Omit<CarbonMetrics, 'venueId' | 'rating'>
): 'A' | 'B' | 'C' | 'D' => {
  let score = 0;
  if (metrics.solarPct >= 50) score += 30;
  else if (metrics.solarPct >= 25) score += 15;
  if (metrics.wasteRecycledPct >= 80) score += 30;
  else if (metrics.wasteRecycledPct >= 60) score += 15;
  if (metrics.transportCo2Saved >= 1000) score += 25;
  else if (metrics.transportCo2Saved >= 500) score += 12;
  if (metrics.offsetCredits >= 100) score += 15;
  else if (metrics.offsetCredits >= 50) score += 7;
  if (score >= 80) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  return 'D';
};
