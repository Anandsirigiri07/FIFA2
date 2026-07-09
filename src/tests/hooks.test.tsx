import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePersona } from '../hooks/usePersona';
import { useTranslate } from '../hooks/useTranslate';
import { useAlerts } from '../hooks/useAlerts';
import { useCrowd } from '../hooks/useCrowd';

describe('usePersona Hook', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => usePersona());
    expect(result.current.persona).toBe('fan');
    expect(result.current.language).toBe('en');
    expect(result.current.venueId).toBe('metlife');
  });

  it('updates persona and language state', () => {
    const { result } = renderHook(() => usePersona());
    
    act((): void => {
      result.current.setPersona('staff');
      result.current.setLanguage('es');
    });

    expect(result.current.persona).toBe('staff');
    expect(result.current.language).toBe('es');
  });

  it('toggles accessibility needs list', () => {
    const { result } = renderHook(() => usePersona());

    act((): void => {
      result.current.toggleAccessibilityNeed('wheelchair');
    });
    expect(result.current.accessibilityNeeds).toContain('wheelchair');

    act((): void => {
      result.current.toggleAccessibilityNeed('wheelchair');
    });
    expect(result.current.accessibilityNeeds).not.toContain('wheelchair');
  });
});

describe('useTranslate Hook', () => {
  it('translates standard terms using dictionaries', async () => {
    const { result } = renderHook(() => useTranslate());
    let translation = '';
    await act(async () => {
      translation = await result.current.translateText('stadium', 'es');
    });
    expect(translation).toBe('Estadio');
  });

  it('falls back to prefix format for unrecognized terms', async () => {
    const { result } = renderHook(() => useTranslate());
    let translation = '';
    await act(async () => {
      translation = await result.current.translateText('Random Term XYZ', 'pt');
    });
    expect(translation).toBe('[Translated to PT]: Random Term XYZ');
  });
});

describe('useAlerts Hook', () => {
  it('loads active incidents lists', () => {
    const { result } = renderHook(() => useAlerts('metlife'));
    expect(result.current.incidents.length).toBeGreaterThan(0);
    expect(result.current.incidents[0].reportedBy).toBeDefined();
  });

  it('allows reporting new incident', async () => {
    const { result } = renderHook(() => useAlerts('metlife'));
    
    await act(async () => {
      await result.current.addIncident(
        'medical',
        'Sprained ankle',
        'Fan slipped on stairways',
        'Stand 102',
        'MEDIUM',
        'user_123'
      );
    });

    expect(result.current.incidents.some((i): boolean => i.title === 'Sprained ankle')).toBe(true);
  });
});

describe('useCrowd Hook', () => {
  it('loads occupancy data for active venue', () => {
    const { result } = renderHook(() => useCrowd('metlife'));
    expect(result.current.crowdData).toBeDefined();
    expect(result.current.crowdData?.totalCount).toBeGreaterThan(0);
  });
});
