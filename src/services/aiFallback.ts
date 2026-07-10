/**
 * StadiumIQ Pro — Intelligent AI Fallback Engine.
 * Provides contextual, persona-aware, FIFA 2026-specific stadium responses
 * when the Gemini API quota is exhausted or unavailable.
 * Uses a priority-ranked rule engine for deterministic, realistic output.
 * @module aiFallback
 */

import type { Venue } from '../types';
import { getVenueById } from '../utils/stadiumData';

/** Represents a single live match in the stadium */
interface LiveMatch {
  readonly homeTeam: string;
  readonly awayTeam: string;
  readonly score: string;
  readonly minute: number;
  readonly stadium: string;
}

/** Current stadium context injected into all responses */
const STADIUM_CONTEXT = {
  attendance: '78,231',
  match: { homeTeam: 'Argentina 🇦🇷', awayTeam: 'Brazil 🇧🇷', score: '1–1', minute: 71, stadium: 'MetLife' } as LiveMatch,
  weather: 'Partly cloudy, 24°C (rain in ~15 min)',
  securityLevel: 'YELLOW',
  solarOutput: '71%',
  carbonOffset: '7.8 tons today',
  metroStatus: 'Running – 4 min outbound delay',
  volunteerCount: '4,200 deployed',
} as const;

/** A single knowledge-base rule */
interface FallbackRule {
  /** Priority — lower number = checked first */
  readonly priority: number;
  /** Keywords that trigger this response (OR logic) */
  readonly keywords: readonly string[];
  /** Persona scopes this applies to (empty array = all personas) */
  readonly personas: readonly string[];
  /** Pure response generator function */
  readonly response: (persona: string, language: string, venue: Venue) => string;
}

/** Sorted knowledge-base rules (lowest priority number = highest importance) */
const FALLBACK_RULES: readonly FallbackRule[] = [
  // ─── GREETING / ONBOARDING ────────────────────────────────────────────────
  {
    priority: 1,
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon', 'start', 'help me', 'what can you do', 'what do you do'],
    personas: [],
    response: (persona, _language, venue) =>
      `👋 **Welcome to StadiumIQ Pro — FIFA World Cup 2026!**\n\n` +
      `I'm your AI Command Center, optimized for the **${persona.toUpperCase()}** experience at **${venue.name}**.\n\n` +
      `🔴 **LIVE NOW:** ${STADIUM_CONTEXT.match.homeTeam} vs ${STADIUM_CONTEXT.match.awayTeam} — **${STADIUM_CONTEXT.match.score}** (${STADIUM_CONTEXT.match.minute}')\n\n` +
      `**I can help you with:**\n` +
      `• 🍔 Food courts, queues & wait times\n` +
      `• 🚇 Metro, shuttle & parking info\n` +
      `• 🗺️ Stadium navigation & seat finding\n` +
      `• 🚨 Emergency, medical & security response\n` +
      `• 📊 Live crowd density & gate status\n` +
      `• ♿ Accessibility routes & assistance\n` +
      `• 🌱 Sustainability & carbon metrics\n` +
      `• 📋 Incident reporting (staff/volunteers)\n\n` +
      `What do you need right now?`
  },

  // ─── EMERGENCY / MEDICAL ──────────────────────────────────────────────────
  {
    priority: 2,
    keywords: ['emergency', 'medical', 'injury', 'sick', 'faint', 'fainted', 'ambulance', 'doctor', 'hurt', 'bleeding', 'cardiac', 'heart attack', 'unconscious', 'collapse'],
    personas: [],
    response: (_persona: string, _language: string, venue: Venue): string => {
      const firstAid = venue.amenities.filter((a): boolean => a.type === 'medical');
      let stations = '';
      if (firstAid.length > 0) {
        stations = firstAid.map((f): string => `   • 🏥 **${f.name}** — ${f.section} (Wait: ${f.waitMinutes} min)`).join('\n');
      } else {
        stations = `   • 🏥 **Medical Bay** — Gate 2 (Lower Level)\n   • 🏥 **First Aid Station** — Section 225 (Club Level)`;
      }
      return `🚨 **PRIORITY ALERT — MEDICAL EMERGENCY DETECTED at ${venue.name}**\n\n` +
        `**Immediate Actions:**\n` +
        `1. 📞 Call Stadium Control: **Ext. 911** or **+1 201-559-1515**\n` +
        `2. Alert nearest yellow-vest volunteer — they have a direct radio line\n` +
        `3. Nearest First Aid Stations:\n` +
        stations + `\n\n` +
        `**Response Times:**\n` +
        `• Medical team ETA from any zone: **~2–3 minutes**\n` +
        `• AED Defibrillators: Every First Aid station + main gate pillars\n` +
        `• Stretcher access routes: Wheelchair-friendly entryways\n\n` +
        `⚠️ **For life-threatening situations:** Wave both arms overhead — AI security cameras will auto-dispatch the nearest team within 60 seconds.`;
    }
  },

  // ─── SECURITY / THREATS ───────────────────────────────────────────────────
  {
    priority: 3,
    keywords: ['suspicious', 'threat', 'bomb', 'weapon', 'fight', 'violence', 'danger', 'unsafe', 'security', 'police', 'arrest', 'bag', 'unattended'],
    personas: [],
    response: (_persona, _language, venue) =>
      `🛡️ **Security Alert — StadiumIQ Command**\n\n` +
      `**Current Venue:** ${venue.name}\n` +
      `**Current Security Level:** 🟡 YELLOW (Elevated vigilance)\n\n` +
      `**Report a Threat:**\n` +
      `• **Immediately:** Alert any uniformed officer or yellow-vest volunteer\n` +
      `• **SMS:** Text "ALERT" + location to **94253** (anonymous)\n` +
      `• **App:** Use the red 🚨 SOS button in the top-right of StadiumIQ\n\n` +
      `**Suspicious Unattended Bags:**\n` +
      `1. Do NOT touch or move the item\n` +
      `2. Clear the immediate area (5 metre radius)\n` +
      `3. Call Control Room: Ext. 999\n` +
      `4. Bomb Disposal ETA if triggered: **8 minutes**\n\n` +
      `**Active Drone Coverage:** Sweep active across all sections. All entrances use AI facial recognition + bag X-ray scanning.`
  },

  // ─── FOOD & CONCESSIONS ───────────────────────────────────────────────────
  {
    priority: 4,
    keywords: ['food', 'eat', 'hungry', 'court', 'restaurant', 'drink', 'concession', 'meal', 'snack', 'beer', 'coffee', 'water', 'vegan', 'halal', 'kosher', 'vegetarian', 'gluten'],
    personas: [],
    response: (_persona: string, _language: string, venue: Venue): string => {
      const foodConcessions = venue.amenities.filter((a): boolean => a.type === 'food');
      let tableRows = '';
      if (foodConcessions.length > 0) {
        tableRows = foodConcessions.map((f): string => `| ${f.name} | ${f.section} | ${f.isOpen ? `🟢 ${f.waitMinutes} min` : '🔴 Closed'} | ${f.isOpen ? 'OPEN' : 'CLOSED'} |`).join('\n');
      } else {
        tableRows = `| Gate 5 Concourse | Hot dogs, Burgers | 🟢 3 min | OPEN |\n| Section B Food Village | International | 🟡 6 min | OPEN |`;
      }
      return `🍔 **Live Food Court Status — ${venue.name}**\n\n` +
        `| Concession | Location | Queue | Status |\n` +
        `|---|---|---|---|\n` +
        tableRows + `\n\n` +
        `🌱 **Dietary Options (Halal/Vegan/Vegetarian):** Available at main concessions and international stands.\n\n` +
        `💡 **Pro Tips:**\n` +
        `• Use the **StadiumIQ app** to pre-order and skip the line entirely\n` +
        `• Contactless payments only — no cash accepted at any concession`;
    }
  },

  // ─── GATE QUEUES / CROWD ──────────────────────────────────────────────────
  {
    priority: 5,
    keywords: ['queue', 'wait', 'line', 'crowd', 'busy', 'congestion', 'gate', 'entry', 'entrance', 'slow', 'packed', 'dense'],
    personas: [],
    response: (_persona: string, _language: string, venue: Venue): string => {
      let tableRows = '';
      venue.gates.forEach((g): void => {
        const density = g.queueMinutes > 10 ? '🔴 High (92%)' : g.queueMinutes > 5 ? '🟡 Medium (65%)' : '🟢 Low (30%)';
        const rec = g.isOpen && g.queueMinutes <= 5 ? '✅ Best Choice' : 'Standard';
        tableRows += `| ${g.name} | ${g.isOpen ? `${g.queueMinutes} min` : 'Closed'} | ${density} | ${rec} |\n`;
      });
      return `📊 **Live Gate Queue Monitor — ${venue.name}**\n\n` +
        `| Gate | Wait Time | Crowd Density | Recommendation |\n` +
        `|------|-----------|---------------|----------------|\n` +
        tableRows + `\n` +
        `📍 **AI Prediction:** Post-match exit surge expected at main gates.\n` +
        `🚀 **Recommended:** Use the low-wait gates for fastest egress.\n\n` +
        `♿ Step-free accessible entry: ${venue.gates.filter((g): boolean => g.isAccessible).map((g): string => g.name).join(', ') || 'Available at all main gates'}`;
    }
  },

  // ─── TRANSPORT / METRO ────────────────────────────────────────────────────
  {
    priority: 6,
    keywords: ['metro', 'transport', 'bus', 'transit', 'train', 'shuttle', 'parking', 'park', 'taxi', 'uber', 'lyft', 'rideshare', 'car', 'drive', 'exit', 'leave', 'go home'],
    personas: [],
    response: (_persona: string, _language: string, venue: Venue): string => {
      let transit = '';
      if (venue.country === 'Canada') {
        transit = `• Toronto Transit / SkyTrain lines — normal scheduling\n• Stadium Special Shuttle — every 10 min from main terminal\n• Local GO train connections — running every 15 min`;
      } else if (venue.country === 'Mexico') {
        transit = `• CDMX Metro / Local Rapid Transit — running on matchday schedule\n• Direct shuttle express buses — departing every 8 min from terminal hubs`;
      } else {
        transit = `• NJ Transit Meadowlands Line / local rail — every 8 min (⚠️ 4 min outbound delay)\n• Meadowlands Express direct to Penn Station — every 12 min`;
      }
      return `🚇 **Live Transport Dashboard — ${venue.name}**\n\n` +
        `**🚂 Rail / Metro / Transit:**\n` +
        transit + `\n\n` +
        `**🅿️ Parking Status at ${venue.city}:**\n` +
        `• Main Parking Lot — 85% full (⚠️ Near capacity)\n` +
        `• Remote Lot B + Shuttle Egress — 30% full (✅ Recommended)\n\n` +
        `💡 **Exit Strategy:** Leave 20 min before final whistle to avoid post-match congestion.`;
    }
  },

  // ─── NAVIGATION / SEATING ─────────────────────────────────────────────────
  {
    priority: 7,
    keywords: ['seat', 'row', 'section', 'map', 'find', 'locate', 'navigate', 'direction', 'lost', 'kiosk', 'info', 'concourse', 'level'],
    personas: [],
    response: (_persona: string, _language: string, venue: Venue): string => {
      const accGates = venue.gates.filter((g): boolean => g.isAccessible).map((g): string => g.name).join(', ');
      return `🗺️ **Stadium Navigation — ${venue.name}**\n\n` +
        `**Find Your Seat:**\n` +
        `• Sections 100–199: Lower Bowl / Field Level → Enter via Gates 1–4\n` +
        `• Sections 200–299: Club Level (Elevators available)\n` +
        `• Sections 300–399: Upper Deck / Terrace levels\n\n` +
        `♿ **Accessibility Routes:**\n` +
        `• Step-free lifts & entries: ${accGates || 'Gates 1, 3, 5'}\n` +
        `• Sight-impaired audio guides: Request at main Guest Services desk\n\n` +
        `💡 Ask any **yellow-vest volunteer** for a personal escort to your seat!`;
    }
  },

  // ─── RESTROOMS ────────────────────────────────────────────────────────────
  {
    priority: 8,
    keywords: ['toilet', 'restroom', 'bathroom', 'washroom', 'wc', 'loo'],
    personas: [],
    response: (_persona: string, _language: string, venue: Venue): string => {
      const restrooms = venue.amenities.filter((a): boolean => a.type === 'restroom');
      let details = '';
      if (restrooms.length > 0) {
        details = restrooms.map((r): string => `• ${r.name} — Located at ${r.section} (Queue: ~${r.waitMinutes} min)`).join('\n');
      } else {
        details = `• Main Concourse Restrooms — Sections 108, 122, 138\n• Club Level Corridor — East & West Wings`;
      }
      return `🚻 **Nearest Restrooms — ${venue.name}**\n\n` +
        details + `\n\n` +
        `♿ Accessible & family restrooms are fully available at all major sectors.\n` +
        `⏱️ **Current average wait:** 2–4 minutes at all locations.`;
    }
  },

  // ─── INCIDENT REPORTING (Staff/Volunteer/Organizer) ───────────────────────
  {
    priority: 9,
    keywords: ['incident', 'report', 'problem', 'issue', 'broken', 'damage', 'spill', 'flood', 'leak', 'hazard', 'danger', 'malfunction', 'down', 'error'],
    personas: ['staff', 'volunteer', 'organizer'],
    response: (persona, _language, venue) =>
      `📋 **Incident Management — StadiumIQ Command (${venue.name})**\n\n` +
      `As a **${persona.toUpperCase()}**, you have direct escalation access:\n\n` +
      `**Log an Incident:**\n` +
      `1. This AI — describe the incident in plain language\n` +
      `2. **Radio Channel 4** — Operations Control Room (24/7)\n` +
      `3. **Red Kiosks** — touchscreens at every gate entrance\n` +
      `4. **StadiumIQ Staff App** — "Report Incident" button\n\n` +
      `**🔴 Active Incidents Right Now:**\n` +
      `• 🟡 Gate 5 — Crowd congestion (Volunteers dispatched, ETA 2 min)\n` +
      `• 🟢 Section B — Waste bin overflow (Cleaning crew en route)\n` +
      `• 🔴 Restroom Block 112 — Water leak (Maintenance ETA: 6 min)\n\n` +
      `Describe your incident and I'll auto-escalate with location tagging.`
  },

  // ─── SUSTAINABILITY (Organizer) ───────────────────────────────────────────
  {
    priority: 10,
    keywords: ['carbon', 'solar', 'energy', 'sustainability', 'green', 'environment', 'eco', 'renewable', 'waste', 'water', 'emission', 'offset'],
    personas: [],
    response: (_persona, _language, venue) =>
      `🌱 **Sustainability Command Center — ${venue.name} Live**\n\n` +
      `| Metric | Value | Target | Status |\n` +
      `|--------|-------|--------|--------|\n` +
      `| Solar Energy | ${STADIUM_CONTEXT.solarOutput} of grid | 75% | 🟡 Near Target |\n` +
      `| Carbon Offset | ${STADIUM_CONTEXT.carbonOffset} | 10t/day | 🟡 On Track |\n` +
      `| Water Recycled | 43,200L | 40,000L | ✅ Exceeded |\n` +
      `| Waste Diverted | 89% sorted | 85% | ✅ Exceeded |\n` +
      `| LED Coverage | 100% | 100% | ✅ Perfect |\n\n` +
      `📈 **Venue Impact:** Every green transit trip by a visitor saves avg. **4.2kg CO₂** at ${venue.city}.`
  },

  // ─── TICKETING / ACCESS ───────────────────────────────────────────────────
  {
    priority: 11,
    keywords: ['ticket', 'upgrade', 'vip', 'entry', 'banned', 'refund', 'lost ticket', 'digital', 'scan', 'barcode'],
    personas: [],
    response: (_persona, _language, venue) =>
      `🎫 **Ticketing & Access — FIFA 2026 at ${venue.name}**\n\n` +
      `**Ticket Issues:**\n` +
      `• Lost/damaged ticket: Visit the main Ticket Desk (open 2hrs pre-match)\n` +
      `• Digital ticket problems: Show FIFA+ app booking reference\n` +
      `• Seat upgrades: Visit the VIP Concierge Desk (subject to availability)\n\n` +
      `**Entry Rules:**\n` +
      `• Valid photo ID matching ticket name is required\n` +
      `• No re-entry after exit\n` +
      `• Gates open: **3 hours before kickoff**\n\n` +
      `💡 Digital tickets scan **40% faster** than printed — recommended!`
  },

  // ─── VOLUNTEER MANAGEMENT ─────────────────────────────────────────────────
  {
    priority: 12,
    keywords: ['volunteer', 'shift', 'duty', 'assignment', 'schedule', 'break', 'room', 'task', 'zone', 'post'],
    personas: ['volunteer'],
    response: (_persona, _language, venue) =>
      `📋 **Volunteer Command Center — ${venue.name}**\n\n` +
      `**Your Active Assignment:**\n` +
      `• Zone: main concourse crowd control\n` +
      `• Shift: 14:00 – 22:00 IST (Current shift active ✅)\n` +
      `• Next Break: 17:30 — Volunteer Break Room\n` +
      `• Supervisor: Team Lead Maria V. (Radio Ch. 3)\n\n` +
      `**📌 Available Tasks Near You:**\n` +
      `• 🔴 Assist accessibility fans at step-free gates\n` +
      `• 🟡 Direct queue bottlenecks at food concourses\n` +
      `• 🟢 Cleanliness check near restroom entries\n\n` +
      `**Protocol:** Radio Channel 3 when picking up a task, Channel 4 for incidents.\n\n` +
      `💧 Stay hydrated! Water dispensaries available at all main gate entries.`
  },

  // ─── ACCESSIBILITY ────────────────────────────────────────────────────────
  {
    priority: 13,
    keywords: ['wheelchair', 'accessible', 'disability', 'blind', 'deaf', 'hearing', 'vision', 'mobility', 'impaired', 'assist', 'companion', 'lift', 'elevator', 'ramp'],
    personas: [],
    response: (_persona: string, _language: string, venue: Venue): string => {
      const accGates = venue.gates.filter((g): boolean => g.isAccessible).map((g): string => g.name).join(', ');
      return `♿ **Accessibility Services — ${venue.name}**\n\n` +
        `**Mobility Assistance:**\n` +
        `• Wheelchair access: ${accGates || 'Gates 2, 4, 8'} (step-free entries)\n` +
        `• Wheelchair seating bays: Sections 105 (Lower), 220 (Club), 315 (Upper)\n` +
        `• Assistive desks: Located near the primary gates\n\n` +
        `**Sensory Support:**\n` +
        `• Hearing loops: Installed at all Guest Services booths\n` +
        `• Sensory quiet room: Quiet zones mapped on the StadiumIQ dashboard\n\n` +
        `**Companion Passes:** Registered carers enter free with valid disabled badge.\n\n` +
        `📞 Accessibility Assistance Hotline: **+1 201-559-1555** (live operators)`;
    }
  },

  // ─── LIVE MATCH INFO ──────────────────────────────────────────────────────
  {
    priority: 14,
    keywords: ['match', 'score', 'goal', 'live', 'game', 'play', 'argentina', 'brazil', 'fifa', 'world cup', 'halftime', 'kickoff', 'minute', 'result'],
    personas: [],
    response: (_persona, _language, venue) =>
      `⚽ **LIVE Match Status — FIFA World Cup 2026**\n\n` +
      `| | Team | Score |\n` +
      `|---|------|-------|\n` +
      `| 🇦🇷 | **Argentina** | **1** |\n` +
      `| 🇧🇷 | **Brazil** | **1** |\n\n` +
      `🕐 **${STADIUM_CONTEXT.match.minute}' — SECOND HALF IN PROGRESS**\n\n` +
      `**Match Facts:**\n` +
      `• Venue: ${venue.name} (${venue.city})\n` +
      `• Attendance: ${STADIUM_CONTEXT.attendance} / ${venue.capacity.toLocaleString()}\n` +
      `• Goals: L. Messi 23' 🇦🇷 | V. Júnior 61' 🇧🇷\n` +
      `• Yellow Cards: 3 total (ARG: 2, BRA: 1)\n\n` +
      `📺 Watch on FIFA+ | 📊 Live stats on StadiumIQ app → "Live Match" tab`
  },

  // ─── STAFF OPERATIONS ─────────────────────────────────────────────────────
  {
    priority: 15,
    keywords: ['cleaning', 'maintenance', 'inspection', 'task', 'assign', 'dispatch', 'update', 'status', 'log', 'operations'],
    personas: ['staff', 'organizer'],
    response: (persona, _language, venue) =>
      `⚙️ **Operations Dashboard — ${persona.toUpperCase()} View at ${venue.name}**\n\n` +
      `**Active Staff Tasks:**\n` +
      `• 🟡 Concourse — Waste bin replacement (ETA 5 min)\n` +
      `• 🔴 Restroom — Leak response (Maintenance dispatched)\n` +
      `• 🟢 Gates — Card reader check (Completed, log saved)\n\n` +
      `**Cleaning Crew Locations:**\n` +
      `• Team Alpha: Lower Concourse (Sections 100–130)\n` +
      `• Team Beta: Club Level (Sections 200–240)\n\n` +
      `📻 Radio: Ch. 2 for Cleaning, Ch. 4 for Maintenance, Ch. 5 for Security`
  }
];

/** Default catch-all response when no rule matches */
const buildDefaultResponse = (persona: string, venue: Venue): string =>
  `🤖 **StadiumIQ Pro AI — ${persona.charAt(0).toUpperCase() + persona.slice(1)} Mode**\n\n` +
  `**Live Stadium Status at ${venue.name}:**\n` +
  `⚽ Match: ${STADIUM_CONTEXT.match.homeTeam} vs ${STADIUM_CONTEXT.match.awayTeam} — **${STADIUM_CONTEXT.match.score}** (${STADIUM_CONTEXT.match.minute}')\n` +
  `👥 Attendance: ${STADIUM_CONTEXT.attendance} fans\n` +
  `🌤️ Weather: ${STADIUM_CONTEXT.weather}\n` +
  `🚇 Metro: ${STADIUM_CONTEXT.metroStatus}\n` +
  `🛡️ Security: ${STADIUM_CONTEXT.securityLevel}\n` +
  `⚡ Solar: ${STADIUM_CONTEXT.solarOutput} renewable\n\n` +
  `I didn't quite understand that query. Try asking about:\n` +
  `• Food courts • Gate queues • Transport • Medical • Navigation • Incidents`;

/**
 * Finds the best matching fallback response for the given user input.
 * Rules are checked in priority order (lower number = checked first).
 * @param message - Raw user query text
 * @param persona - Active user persona (fan, staff, volunteer, organizer)
 * @param language - Target language code
 * @param venueId - Active selected venue ID (e.g. metlife, sofi, att)
 * @returns Best matching contextual response string
 */
export const getFallbackResponse = (
  message: string,
  persona: string,
  language: string,
  venueId: string = 'metlife'
): string => {
  const lower = message.toLowerCase();
  const venue = getVenueById(venueId) || getVenueById('metlife')!;

  // Sort by priority ascending so highest-priority rules win
  const sorted = [...FALLBACK_RULES].sort((a, b): number => a.priority - b.priority);

  for (const rule of sorted) {
    const matchesKeyword = rule.keywords.some((kw): boolean => {
      if (kw.includes(' ')) {
        return lower.includes(kw);
      }
      // Escape special characters for regex, then use word boundary check
      const escapedKw = kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedKw}\\b`, 'i');
      return regex.test(lower);
    });

    const matchesPersona = rule.personas.length === 0 || rule.personas.includes(persona);

    if (matchesKeyword && matchesPersona) {
      const resp = rule.response(persona, language, venue);
      // Non-English: prepend language tag for clarity
      if (language !== 'en') {
        return `[${language.toUpperCase()} Response]\n\n${resp}`;
      }
      return resp;
    }
  }

  return buildDefaultResponse(persona, venue);
};

/**
 * Returns all available rule keywords for test coverage validation.
 * @returns Flat array of all trigger keywords
 */
export const getAllFallbackKeywords = (): readonly string[] =>
  FALLBACK_RULES.flatMap((r): readonly string[] => r.keywords);
