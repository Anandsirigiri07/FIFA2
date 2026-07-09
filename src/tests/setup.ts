import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock scrollIntoView for JSDom
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Mock Gemini AI
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: vi.fn().mockResolvedValue({
        response: { text: () => 'Mocked AI response' }
      }),
      startChat: vi.fn().mockReturnValue({
        sendMessageStream: vi.fn().mockResolvedValue({
          stream: (async function* () {
            yield { text: () => 'Mocked ' };
            yield { text: () => 'streaming ' };
            yield { text: () => 'response' };
          })()
        })
      })
    })
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
  onAuthStateChanged: vi.fn(() => () => {}),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  getAuth: vi.fn()
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn(),
  onSnapshot: vi.fn(() => () => {}),
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
