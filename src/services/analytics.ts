/**
 * Google Analytics (GA4) event tracking wrapper for StadiumIQ Pro.
 * Configured safely to avoid crashing in environments without analytics.
 * @module analytics
 */

import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'mock-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'mock-auth-domain.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mock-project-id',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'mock-storage-bucket.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1234:web:abcd',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-MOCK'
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

let analyticsInstance: ReturnType<typeof getAnalytics> | null = null;

isSupported().then((supported): void => {
  if (supported) {
    analyticsInstance = getAnalytics(app);
  }
}).catch((err): void => {
  console.error('Analytics support check failed: ', err);
});

/**
 * Tracks custom events for hackathon insights.
 * @param eventName - GA4 event identifier
 * @param params - Optional parameter dictionary
 * @returns void
 */
export const logAnalyticsEvent = (
  eventName: string,
  params?: Record<string, unknown>
): void => {
  if (analyticsInstance) {
    try {
      logEvent(analyticsInstance, eventName, params);
    } catch (err) {
      console.error(`GA4 logEvent failed for ${eventName}:`, err);
    }
  } else {
    console.warn(`[Analytics Mock] Event: ${eventName}, Params:`, params);
  }
};
