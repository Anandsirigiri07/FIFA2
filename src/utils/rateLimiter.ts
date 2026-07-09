/**
 * In-memory rate limiter for API calls.
 * Uses sliding window algorithm per key.
 * @module rateLimiter
 */

import type { RateLimitResult } from '../types';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

/**
 * Checks if a request is within the rate limit.
 * @param key - Unique identifier (userId + endpoint)
 * @param maxRequests - Max requests per window
 * @param windowMs - Window duration in milliseconds
 * @returns RateLimitResult with allowed flag and wait time
 */
export const checkRateLimit = (
  key: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult => {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, waitMs: 0, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      waitMs: entry.resetAt - now,
      remaining: 0
    };
  }

  entry.count++;
  return {
    allowed: true,
    waitMs: 0,
    remaining: maxRequests - entry.count
  };
};

/**
 * Resets rate limit for a specific key (for testing).
 * @param key - Key to reset
 * @returns void
 */
export const resetRateLimit = (key: string): void => {
  store.delete(key);
};

/**
 * Pre-configured limiters for common operations.
 */
export const rateLimits = {
  /** 30 chat messages per hour per user */
  chat: (uid: string): RateLimitResult =>
    checkRateLimit(`chat_${uid}`, 30, 3_600_000),
  /** 20 AI analysis calls per hour */
  analysis: (uid: string): RateLimitResult =>
    checkRateLimit(`analysis_${uid}`, 20, 3_600_000),
  /** 10 incident reports per hour */
  incident: (uid: string): RateLimitResult =>
    checkRateLimit(`incident_${uid}`, 10, 3_600_000),
} as const;
