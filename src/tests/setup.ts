import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock scrollIntoView for JSDom
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Mock Gemini AI (@google/genai)
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: vi.fn().mockResolvedValue({
        text: 'Mocked AI response'
      }),
      generateContentStream: vi.fn().mockResolvedValue(
        (async function* (): AsyncGenerator<{ readonly text: string }, void, unknown> {
          yield { text: 'Mocked ' };
          yield { text: 'streaming ' };
          yield { text: 'response' };
        })()
      )
    }
  }))
}));

// Mock Firebase
vi.mock('../services/firebase', () => ({
  auth: { currentUser: null },
  db: {},
  analytics: null,
  default: {}
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((): (() => void) => (): void => {}),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  getAuth: vi.fn()
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn(),
  onSnapshot: vi.fn((): (() => void) => (): void => {}),
  query: vi.fn(),
  orderBy: vi.fn(),
  serverTimestamp: vi.fn()
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
  isSupported: vi.fn(() => Promise.resolve(false)),
  logEvent: vi.fn()
}));

// ResizeObserver polyfill
class ResizeObserverMock {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock
});

// Mock window.speechSynthesis
Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {
    speak: vi.fn(),
    cancel: vi.fn(),
    getVoices: vi.fn(() => [])
  }
});

// Export React for JSX in tests
export { React };
