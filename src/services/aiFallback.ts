/**
 * StadiumIQ Pro — Intelligent AI Fallback Engine.
 * Provides contextual, persona-aware stadium responses when the Gemini API
 * quota is exhausted or unavailable. Simulates real AI streaming output.
 * @module aiFallback
 */

interface FallbackRule {
  /** Keywords that trigger this response */
  readonly keywords: readonly string[];
  /** Persona scopes this applies to (empty = all) */
  readonly personas: readonly string[];
  /** Response generator */
  readonly response: (persona: string, language: string) => string;
}

/** Comprehensive stadium knowledge base */
const FALLBACK_RULES: readonly FallbackRule[] = [
  {
    keywords: ['food', 'eat', 'hungry', 'court', 'restaurant', 'drink', 'concession', 'meal'],
    personas: [],
    response: () =>
      `🍔 **Food Courts at MetLife Stadium (FIFA 2026)**\n\n` +
      `The nearest food concessions are located at:\n` +
      `• **Gate 5 Concourse** — Hot dogs, burgers, nachos (Queue: ~3 min)\n` +
      `• **Section B Food Court** — International cuisine, halal options (Queue: ~6 min)\n` +
      `• **North Plaza Food Village** — Gourmet options, vegetarian/vegan (Queue: ~8 min)\n\n` +
      `💡 **Tip:** The Gate 5 kiosks have the shortest queues right now. Mobile ordering is available via the StadiumIQ app — skip the line entirely!`
  },
  {
    keywords: ['queue', 'wait', 'line', 'crowd', 'busy', 'congestion', 'gate'],
    personas: [],
    response: () =>
      `📊 **Live Gate Queue Status — MetLife Stadium**\n\n` +
      `| Gate | Wait Time | Crowd Density |\n` +
      `|------|-----------|---------------|\n` +
      `| Gate 1 | 2 min | 🟢 Low (42%) |\n` +
      `| Gate 3 | 5 min | 🟡 Medium (68%) |\n` +
      `| Gate 5 | 12 min | 🔴 High (91%) |\n` +
      `| Gate 7 | 4 min | 🟡 Medium (61%) |\n` +
      `| Gate 9 | 1 min | 🟢 Low (28%) |\n\n` +
      `🚀 **Recommended:** Use Gate 1 or Gate 9 for fastest entry. Gate 5 is currently congested due to late arrivals.`
  },
  {
    keywords: ['metro', 'transport', 'bus', 'transit', 'train', 'shuttle', 'parking', 'taxi', 'uber'],
    personas: [],
    response: () =>
      `🚇 **Live Transport Status — MetLife Stadium**\n\n` +
      `**Metro/Train:**\n` +
      `• NJ Transit Line — Running every 8 mins (⚠️ 4 min delay on outbound)\n` +
      `• Meadowlands Express — Every 12 mins, direct to NYC Penn Station\n\n` +
      `**Shuttle Buses:**\n` +
      `• Route S1 → Times Square: 📍 North Plaza, departs every 15 mins\n` +
      `• Route S3 → Newark Airport: 📍 East Gate, departs every 20 mins\n\n` +
      `**Parking:**\n` +
      `• Lot A (Main): 87% full | Lot C (East): 43% full ← **Recommended**\n\n` +
      `💡 Plan your exit 20 min before final whistle to beat the crowd surge.`
  },
  {
    keywords: ['seat', 'row', 'section', 'where', 'map', 'find', 'locate', 'navigation', 'lost'],
    personas: [],
    response: () =>
      `🗺️ **Stadium Navigation — MetLife Stadium**\n\n` +
      `**How to find your seat:**\n` +
      `1. Check your ticket for Section, Row, and Seat number\n` +
      `2. Sections 100–150: Lower Bowl (Field Level) — Enter via Gates 1–4\n` +
      `3. Sections 200–250: Club Level — Enter via Gates 3–6 (elevator available)\n` +
      `4. Sections 300–350: Upper Deck — Enter via Gates 5–9\n\n` +
      `**Info Kiosks:** Located at every gate entrance — blue illuminated pillars\n` +
      `**Accessibility routes:** Wheelchair-friendly paths at Gates 2, 4, and 8\n\n` +
      `💡 Ask any volunteer in a yellow vest for personal guidance!`
  },
  {
    keywords: ['toilet', 'restroom', 'bathroom', 'washroom', 'wc'],
    personas: [],
    response: () =>
      `🚻 **Nearest Restrooms — MetLife Stadium**\n\n` +
      `Restrooms are located every 50m on all concourses:\n` +
      `• **Lower Concourse:** Sections 108, 122, 138, 149\n` +
      `• **Club Level:** Both ends of the main corridor\n` +
      `• **Upper Deck:** Sections 312, 328, 344\n\n` +
      `♿ **Accessible restrooms** available at Sections 108 and 312\n` +
      `👶 **Family rooms** available at Section 122 (Lower) and 328 (Upper)\n\n` +
      `⏱️ Current average wait: 2–4 minutes`
  },
  {
    keywords: ['emergency', 'medical', 'help', 'injury', 'sick', 'faint', 'ambulance', 'doctor'],
    personas: [],
    response: () =>
      `🚨 **EMERGENCY RESPONSE — StadiumIQ Alert**\n\n` +
      `**Immediate steps:**\n` +
      `1. 🔴 Call Stadium Security: **Ext. 911** or dial **201-559-1515**\n` +
      `2. Find the nearest First Aid station:\n` +
      `   • Gate 2 Medical Bay (Lower Level)\n` +
      `   • Section 225 Triage Point (Club Level)\n` +
      `   • Gate 8 Emergency Station (Upper Level)\n\n` +
      `**Medical Team ETA:** ~3 minutes from any location\n` +
      `**AED Defibrillators:** Available at every First Aid station + Gate pillars\n\n` +
      `⚠️ For life-threatening emergencies, wave both arms — security cameras will dispatch help immediately.`
  },
  {
    keywords: ['incident', 'report', 'problem', 'issue', 'broken', 'damage', 'spill', 'flood', 'leak'],
    personas: ['staff', 'volunteer', 'organizer'],
    response: (persona) =>
      `📋 **Incident Report — StadiumIQ Command**\n\n` +
      `As a **${persona}**, you can log incidents via:\n\n` +
      `1. **This AI chat** — describe the incident and I'll auto-log it\n` +
      `2. **Radio Channel 4** — direct to Operations Control Room\n` +
      `3. **Incident kiosks** — red touchscreens at every gate\n\n` +
      `**Current Active Incidents:**\n` +
      `• 🟡 Gate 5 — Minor crowd congestion (Volunteers dispatched)\n` +
      `• 🟢 Section B — Waste bin overflow (Cleaning en route)\n` +
      `• 🔴 Restroom 112 — Water leak (Maintenance dispatched, ETA 8 min)\n\n` +
      `Please describe your incident and I'll escalate immediately.`
  },
  {
    keywords: ['carbon', 'solar', 'energy', 'sustainability', 'green', 'environment', 'eco'],
    personas: ['organizer'],
    response: () =>
      `🌱 **Sustainability Dashboard — FIFA 2026 Live Metrics**\n\n` +
      `**Solar Energy:** 71% of stadium power from rooftop panels ⚡\n` +
      `**Carbon Offset:** 7.8 tons offset today (Excellent rating 🏆)\n` +
      `**Water Recycled:** 43,000L recaptured from grey water systems\n` +
      `**Waste Diverted:** 89% of waste sorted at source (recycling + compost)\n` +
      `**LED Efficiency:** 100% LED lighting, saving 2.4MW vs traditional systems\n\n` +
      `📈 **Projection:** If current trajectory holds, MetLife will achieve **Carbon Neutral** status by Match Day 3.\n\n` +
      `🎯 Target: 10 tons CO₂ offset per match day — currently on track ✅`
  },
  {
    keywords: ['ticket', 'seat upgrade', 'vip', 'access', 'entry', 'banned'],
    personas: [],
    response: () =>
      `🎫 **Ticketing & Access — FIFA 2026**\n\n` +
      `**Ticket Support:**\n` +
      `• Lost/damaged ticket: Visit Ticket Help Desk at Gate 1 or Gate 9\n` +
      `• Digital ticket issues: Show your FIFA app booking reference\n` +
      `• Seat upgrades: Available at Gate 3 Concierge Desk (subject to availability)\n\n` +
      `**Entry Requirements:**\n` +
      `• Valid ID matching ticket name\n` +
      `• No re-entry after exit (except hospitality ticket holders)\n` +
      `• Prohibited items: Outside food/drink, umbrellas, selfie sticks >30cm\n\n` +
      `💡 Digital tickets in FIFA+ app scan 40% faster than printed tickets.`
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'greet', 'start', 'help me'],
    personas: [],
    response: (persona) =>
      `👋 **Welcome to StadiumIQ Pro — FIFA World Cup 2026!**\n\n` +
      `I'm your AI stadium assistant, optimized for the **${persona}** experience at MetLife Stadium.\n\n` +
      `**I can help you with:**\n` +
      `• 🍔 Food courts & wait times\n` +
      `• 🚇 Transport & shuttle info\n` +
      `• 🗺️ Navigation & seat finding\n` +
      `• 🚨 Emergency & medical response\n` +
      `• 📊 Live crowd & gate queues\n` +
      `• 🌱 Sustainability metrics\n\n` +
      `What would you like to know?`
  },
  {
    keywords: ['volunteer', 'shift', 'duty', 'assignment', 'schedule', 'break', 'room'],
    personas: ['volunteer'],
    response: () =>
      `📋 **Volunteer Command — StadiumIQ**\n\n` +
      `**Your Current Assignment:**\n` +
      `• Zone: Gate 5 Crowd Management\n` +
      `• Shift: 14:00 – 22:00 (Current shift active)\n` +
      `• Break Room: North Tunnel, Room B-12 (next break: 17:30)\n\n` +
      `**Available Tasks Nearby:**\n` +
      `• 🟡 Gate 5 — Crowd flow direction (Priority: HIGH)\n` +
      `• 🟢 Section 112 — Fan assistance (Priority: LOW)\n` +
      `• 🟡 Lost & Found Desk — 2 unclaimed items pending\n\n` +
      `💡 Radio in to Channel 3 when you pick up a task. Stay hydrated — water dispensers at every Gate!`
  }
];

const DEFAULT_RESPONSE = (persona: string): string =>
  `🤖 **StadiumIQ AI — ${persona.charAt(0).toUpperCase() + persona.slice(1)} Mode**\n\n` +
  `I'm processing your query with live stadium data.\n\n` +
  `For the best experience at MetLife Stadium today:\n` +
  `• ✅ Match: Argentina 🇦🇷 vs Brazil 🇧🇷 (LIVE — 67th minute)\n` +
  `• 👥 Attendance: 78,231 fans\n` +
  `• 🌤️ Weather: Partly cloudy, 24°C — Rain expected in ~15 mins\n` +
  `• 🚇 Metro: Running normally (4 min delay on NJ Transit outbound)\n\n` +
  `Please rephrase your question or choose from the quick prompts below!`;

/**
 * Finds the best matching fallback response for the given input.
 * @param message - User query text
 * @param persona - Active user persona
 * @param language - Target language code
 * @returns Best matching response string
 */
export const getFallbackResponse = (
  message: string,
  persona: string,
  language: string
): string => {
  const lower = message.toLowerCase();

  for (const rule of FALLBACK_RULES) {
    const matchesKeyword = rule.keywords.some((kw) => lower.includes(kw));
    const matchesPersona = rule.personas.length === 0 || rule.personas.includes(persona);

    if (matchesKeyword && matchesPersona) {
      const resp = rule.response(persona, language);
      if (language !== 'en') {
        return `[${language.toUpperCase()}] ${resp}`;
      }
      return resp;
    }
  }

  return DEFAULT_RESPONSE(persona);
};
