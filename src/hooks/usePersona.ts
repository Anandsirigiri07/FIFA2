/**
 * Hook to manage user profile, persona state, venue selection, and accessibility options.
 * Persists data inside localStorage.
 * @module usePersona
 */

import { useState, useEffect } from 'react';
import type { Persona, Language, AccessibilityNeed, UserProfile } from '../types';
import { detectLanguage } from '../i18n/translations';

export interface UsePersonaResult {
  readonly persona: Persona;
  readonly setPersona: (p: Persona) => void;
  readonly language: Language;
  readonly setLanguage: (l: Language) => void;
  readonly venueId: string;
  readonly setVenueId: (v: string) => void;
  readonly accessibilityNeeds: AccessibilityNeed[];
  readonly toggleAccessibilityNeed: (need: AccessibilityNeed) => void;
  readonly displayName: string;
  readonly setDisplayName: (name: string) => void;
  readonly profile: UserProfile;
}

/**
 * Custom hook providing user profile configurations, active persona state, and active venue.
 * @returns Object containing user profile state and modifiers
 */
export const usePersona = (): UsePersonaResult => {
  const [persona, setPersona] = useState<Persona>((): Persona => {
    const saved = localStorage.getItem('stadiumiq_persona');
    return (saved as Persona) || 'fan';
  });

  const [language, setLanguage] = useState<Language>((): Language => {
    const saved = localStorage.getItem('stadiumiq_language');
    return (saved as Language) || detectLanguage();
  });

  const [venueId, setVenueId] = useState<string>((): string => {
    return localStorage.getItem('stadiumiq_venue') || 'metlife';
  });

  const [accessibilityNeeds, setAccessibilityNeeds] = useState<AccessibilityNeed[]>((): AccessibilityNeed[] => {
    const saved = localStorage.getItem('stadiumiq_accessibility');
    return saved ? JSON.parse(saved) : [];
  });

  const [displayName, setDisplayName] = useState<string>((): string => {
    return localStorage.getItem('stadiumiq_displayname') || 'Guest Fan';
  });

  useEffect((): void => {
    localStorage.setItem('stadiumiq_persona', persona);
  }, [persona]);

  useEffect((): void => {
    localStorage.setItem('stadiumiq_language', language);
  }, [language]);

  useEffect((): void => {
    localStorage.setItem('stadiumiq_venue', venueId);
  }, [venueId]);

  useEffect((): void => {
    localStorage.setItem('stadiumiq_accessibility', JSON.stringify(accessibilityNeeds));
  }, [accessibilityNeeds]);

  /**
   * Toggles a specific accessibility need.
   * @param need - The accessibility need to toggle
   * @returns void
   */
  const toggleAccessibilityNeed = (need: AccessibilityNeed): void => {
    setAccessibilityNeeds((prev): AccessibilityNeed[] => 
      prev.includes(need) ? prev.filter((x): boolean => x !== need) : [...prev, need]
    );
  };

  const profile: UserProfile = {
    uid: 'guest_user_123',
    displayName,
    email: 'guest@fifa.com',
    persona,
    language,
    venueId,
    accessibilityNeeds
  };

  return {
    persona,
    setPersona,
    language,
    setLanguage,
    venueId,
    setVenueId,
    accessibilityNeeds,
    toggleAccessibilityNeed,
    displayName,
    setDisplayName,
    profile
  };
};
