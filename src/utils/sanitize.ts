/**
 * Sanitization utilities for StadiumIQ Pro.
 * All functions are pure and side-effect free.
 * @module sanitize
 */

import type { SanitizeResult } from '../types';

/** Maximum allowed input length */
const MAX_INPUT_LENGTH = 1000;

/** Patterns that indicate prompt injection, SQL injection, XSS, or path traversal attempts */
const INJECTION_PATTERNS: readonly RegExp[] = [
  // Prompt injection
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/gi,
  /system\s*prompt/gi,
  /you\s+are\s+now/gi,
  /jailbreak/gi,
  /bypass\s+(all\s+)?filters?/gi,
  /act\s+as\s+(if\s+you\s+are|a\b)/gi,
  
  // HTML tags & scripting
  /<script[\s\S]*?>/gi,
  /javascript\s*:/gi,
  /on\w+\s*=/gi,
  /expression\s*\(/gi,
  /iframe/gi,
  /srcdoc\s*=/gi,

  // SQL Injection patterns
  /UNION\s+(ALL\s+)?SELECT/gi,
  /SELECT\s+[\s\S]+?\s+FROM/gi,
  /DROP\s+(TABLE|DATABASE|VIEW|SCHEMA)/gi,
  /TRUNCATE\s+TABLE/gi,
  /OR\s+\d+\s*=\s*\d+/gi,

  // Path Traversal
  /\.\.[/\\]/g
];

/**
 * Sanitizes raw user input for safe AI processing.
 * Strips HTML, detects prompt injection, enforces length.
 * @param input - Raw string from user input field
 * @returns SanitizeResult with clean string and flags
 */
export const sanitizeInput = (input: string): SanitizeResult => {
  if (typeof input !== 'string') {
    return { clean: '', wasInjection: false, wasTruncated: false };
  }

  let clean = input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/["]/g, '&quot;')
    .replace(/[']/g, '&#39;')
    .trim();

  const wasInjection = INJECTION_PATTERNS.some((p): boolean => {
    // Reset regex cursor for global matches
    p.lastIndex = 0;
    return p.test(clean);
  });

  const wasTruncated = clean.length > MAX_INPUT_LENGTH;
  if (wasTruncated) {
    clean = clean.slice(0, MAX_INPUT_LENGTH);
  }

  return { clean, wasInjection, wasTruncated };
};

/**
 * Validates that a persona value is one of the allowed types.
 * @param value - Raw string to validate
 * @returns True if value is a valid Persona type
 */
export const isValidPersona = (value: string): boolean => {
  return ['fan', 'staff', 'volunteer', 'organizer'].includes(value);
};

/**
 * Validates that a language code is supported.
 * @param value - Language code string to validate
 * @returns True if language is supported by the app
 */
export const isValidLanguage = (value: string): boolean => {
  return [
    'en', 'es', 'fr', 'pt', 'ar', 
    'de', 'ja', 'zh', 'hi', 'ko'
  ].includes(value);
};

/**
 * Sanitizes and validates a numeric value within bounds.
 * @param input - Raw value to sanitize
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Clamped number, or min if input is invalid
 */
export const sanitizeNumber = (
  input: unknown,
  min: number,
  max: number
): number => {
  const n = Number(input);
  if (isNaN(n) || !isFinite(n)) return min;
  return Math.min(Math.max(n, min), max);
};
