import { describe, it, expect } from 'vitest';
import {
  getCrowdStatus,
  minutesToCapacity,
  calculateRiskScore,
  recommendGate,
  estimateExitTime
} from '../utils/crowdCalc';
import type { SectionData } from '../types';

describe('getCrowdStatus', () => {
  it('identifies critical levels', () => {
    expect(getCrowdStatus(95)).toBe('critical');
  });

  it('identifies high levels', () => {
    expect(getCrowdStatus(80)).toBe('high');
  });

  it('identifies moderate levels', () => {
    expect(getCrowdStatus(60)).toBe('moderate');
  });

  it('identifies low levels', () => {
    expect(getCrowdStatus(30)).toBe('low');
  });
});

describe('minutesToCapacity', () => {
  it('returns Infinity for no inflow', () => {
    expect(minutesToCapacity(50000, 40000, 0)).toBe(Infinity);
  });

  it('returns minutes to full capacity', () => {
    expect(minutesToCapacity(50000, 40000, 500)).toBe(20);
  });

  it('returns 0 if already full', () => {
    expect(minutesToCapacity(50000, 55000, 100)).toBe(0);
  });
});

describe('calculateRiskScore', () => {
  it('returns 0 for empty sections list', () => {
    expect(calculateRiskScore([])).toBe(0);
  });

  it('calculates average risk weight', () => {
    const sections: SectionData[] = [
      { id: '1', name: 'A', count: 100, pct: 95, status: 'critical' },
      { id: '2', name: 'B', count: 100, pct: 20, status: 'low' }
    ];
    expect(calculateRiskScore(sections)).toBe(50);
  });
});

describe('recommendGate', () => {
  it('returns index of minimum wait', () => {
    expect(recommendGate([15, 5, 20])).toBe(1);
  });

  it('returns 0 for empty gates list', () => {
    expect(recommendGate([])).toBe(0);
  });
});

describe('estimateExitTime', () => {
  it('returns 999 for closed gates or zero rate', () => {
    expect(estimateExitTime(10000, 0, 100)).toBe(999);
  });

  it('estimates minutes to clear', () => {
    expect(estimateExitTime(10000, 5, 100)).toBe(20);
  });
});
