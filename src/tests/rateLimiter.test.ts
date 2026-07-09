import { describe, it, expect, beforeEach } from 'vitest';
import { checkRateLimit, resetRateLimit, rateLimits } from '../utils/rateLimiter';

describe('checkRateLimit', () => {
  const key = 'test_user_endpoint';

  beforeEach(() => {
    resetRateLimit(key);
  });

  it('allows the first request', () => {
    const res = checkRateLimit(key, 2, 60000);
    expect(res.allowed).toBe(true);
    expect(res.remaining).toBe(1);
    expect(res.waitMs).toBe(0);
  });

  it('rejects requests exceeding limit', () => {
    checkRateLimit(key, 2, 60000);
    checkRateLimit(key, 2, 60000);
    const res = checkRateLimit(key, 2, 60000);
    expect(res.allowed).toBe(false);
    expect(res.remaining).toBe(0);
    expect(res.waitMs).toBeGreaterThan(0);
  });

  it('pre-configured limiters work correctly', () => {
    const uid = 'limiter_test_user';
    resetRateLimit(`chat_${uid}`);
    
    const res = rateLimits.chat(uid);
    expect(res.allowed).toBe(true);
    expect(res.remaining).toBe(29);
  });
});
