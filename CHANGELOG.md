# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-10

### Added
- Express server-side rate limiter using `express-rate-limit` on the `/api/chat` POST endpoint (30 requests per IP per hour).
- Secure CORS configuration restricting access to `http://localhost:5173`, `http://localhost:4173`, and Firebase Hosting domains (`*.web.app` and `*.firebaseapp.com`).
- GitHub Actions CI workflow pipeline (`.github/workflows/ci.yml`) triggering on pushes and pull requests to validate linting, TypeScript compilation, and Vitest test suite execution.
- Firebase deployment metadata (`.firebaserc` and `firebase.json` rule mappings).
- Direct client-side Gemini API fallback request handler in `gemini.ts` if the local proxy server is unreachable.
- CI status badge at the top of the README.md.

### Changed
- Configured ESLint rule bypasses in `.eslintrc.cjs` for test files and enabled strict linting on root files like `server.ts`.
- Updated README.md to document the live Firebase Hosting application URL.

## [0.4.0] - 2026-07-09

### Added
- Input sanitization utilities in `sanitize.ts` with HTML escaping and prompt injection pattern detection.
- Sliding-window rate limiter in `rateLimiter.ts` to prevent client-side spamming.
- Dynamic document accessibility attributes (`lang` and `dir`) updating in `usePersona.ts` based on selected translation locale.
- Real-time translation lookup panel inside `VolunteerView.tsx` for multilingual volunteer assistance.

### Fixed
- Fixed ESLint and TypeScript return and parameter typing issues on response generators in `aiFallback.ts`.
- Fixed rendering re-entrancy issues in `useCrowd.ts` by memoizing the mock generator with `useCallback`.
- Removed escaped forward slashes from regex patterns to resolve ESLint warning violations.

## [0.3.0] - 2026-07-09

### Added
- Main application shell (`App.tsx`) with state context mapping for Personas and Language.
- Spectator Command Console (`FanView.tsx`) with gate wait predictors and carbon metrics calculators.
- Stadium Staff Console (`StaffView.tsx`) with incident triage boards and dispatch logs.
- Volunteer Shift Console (`VolunteerView.tsx`) with task checklists and HQ broadcasts.
- Match Director Console (`OrganizerView.tsx`) with sustainability grades and crowd risk gauges.
- Accessibility Dashboard (`AccessibilityView.tsx`) with sensory guidelines and step-free directories.
- Interactive chatbot module (`GeminiChat.tsx`) and dynamic maps (`StadiumMap.tsx`).
- In-stadium wayfinding Navigation Panel (`NavigationPanel`) inside `FanView.tsx`.
- Real-time emergency protocols panel (`DecisionSupport`) inside `StaffView.tsx`.

## [0.2.0] - 2026-07-09

### Added
- Stadium venue catalog database (`stadiumData.ts`) detailing capacities, cities, and amenities.
- Core math utilities in `crowdCalc.ts` and `carbonCalc.ts` for operations indicators.
- Comprehensive test suites in `src/tests/` covering crowd safety, sanitization, rate limits, and hooks.

## [0.1.0] - 2026-07-09

### Added
- Project layout scaffolding (Vite, React, TypeScript, Tailwind CSS, Express).
- Proxy server foundation in `server.ts` to interface with the Gemini API.
- Configuration setups for ESLint, TypeScript compilation, and Vitest testing runner.
