import { describe, it, expect } from 'vitest';
import {
  calculateTransportCO2,
  calculateCO2Saved,
  calculateSustainabilityRating
} from '../utils/carbonCalc';

describe('calculateTransportCO2', () => {
  it('returns 0 for walk/bike', () => {
    expect(calculateTransportCO2('walk', 10)).toBe(0);
    expect(calculateTransportCO2('bike', 10)).toBe(0);
  });

  it('calculates correct CO2 emissions', () => {
    expect(calculateTransportCO2('rideshare', 10)).toBe(2.1);
  });
});

describe('calculateCO2Saved', () => {
  it('calculates correct savings vs rideshare', () => {
    expect(calculateCO2Saved('walk', 10)).toBe(2.1);
  });

  it('handles negative results by returning 0', () => {
    expect(calculateCO2Saved('rideshare', 10)).toBe(0);
  });
});

describe('calculateSustainabilityRating', () => {
  it('returns rating A for top scores', () => {
    const res = calculateSustainabilityRating({
      solarPct: 60,
      wasteRecycledPct: 85,
      transportCo2Saved: 1200,
      offsetCredits: 120
    });
    expect(res).toBe('A');
  });

  it('returns rating D for poor scores', () => {
    const res = calculateSustainabilityRating({
      solarPct: 5,
      wasteRecycledPct: 10,
      transportCo2Saved: 10,
      offsetCredits: 5
    });
    expect(res).toBe('D');
  });
});
