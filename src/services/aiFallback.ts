/**
 * StadiumIQ Pro — Intelligent AI Fallback Engine.
 * Provides contextual, persona-aware, FIFA 2026-specific stadium responses
 * when the Gemini API quota is exhausted or unavailable.
 * Uses a priority-ranked rule engine for deterministic, realistic output.
 * @module aiFallback
 */

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
  venue: 'MetLife Stadium, New Jersey',
  attendance: '78,231',
  capacity: '82,500',
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
  readonly response: (persona: string, language: string) => string;
}

/** Sorted knowledge-base rules (lowest priority number = highest importance) */
const FALLBACK_RULES: readonly FallbackRule[] = [
  // ─── GREETING / ONBOARDING ────────────────────────────────────────────────
  {
    priority: 1,
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon', 'start', 'help me', 'what can you do', 'what do you do'],
    personas: [],
    response: (persona) =>
      `👋 **Welcome to StadiumIQ Pro — FIFA World Cup 2026!**\n\n` +
      `I'm your AI Command Center, optimized for the **${persona.toUpperCase()}** experience at **${STADIUM_CONTEXT.venue}**.\n\n` +
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
    response: () =>
      `🚨 **PRIORITY ALERT — MEDICAL EMERGENCY DETECTED**\n\n` +
      `**Immediate Actions:**\n` +
      `1. 📞 Call Stadium Control: **Ext. 911** or **+1 201-559-1515**\n` +
      `2. Alert nearest yellow-vest volunteer — they have a direct radio line\n` +
      `3. Nearest First Aid Stations:\n` +
      `   • 🏥 **Gate 2 Medical Bay** — Lower Level (Primary Triage)\n` +
      `   • 🏥 **Section 225 Triage Point** — Club Level\n` +
      `   • 🏥 **Gate 8 Emergency Station** — Upper Level\n\n` +
      `**Response Times:**\n` +
      `• Medical team ETA from any zone: **~2–3 minutes**\n` +
      `• AED Defibrillators: Every First Aid station + Gate 1, 3, 5, 7 pillars\n` +
      `• Stretcher access routes: Gates 2, 4, 8 (wheelchair-friendly)\n\n` +
      `⚠️ **For life-threatening situations:** Wave both arms overhead — AI security cameras will auto-dispatch the nearest team within 60 seconds.`
  },

  // ─── SECURITY / THREATS ───────────────────────────────────────────────────
  {
    priority: 3,
    keywords: ['suspicious', 'threat', 'bomb', 'weapon', 'fight', 'violence', 'danger', 'unsafe', 'security', 'police', 'arrest', 'bag', 'unattended'],
    personas: [],
    response: () =>
      `🛡️ **Security Alert — StadiumIQ Command**\n\n` +
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
      `**Active Drone Coverage:** 12 security drones currently sweeping Sections A–D.\n` +
      `All entrances use AI facial recognition + bag X-ray scanning.`
  },

  // ─── FOOD & CONCESSIONS ───────────────────────────────────────────────────
  {
    priority: 4,
    keywords: ['food', 'eat', 'hungry', 'court', 'restaurant', 'drink', 'concession', 'meal', 'snack', 'beer', 'coffee', 'water', 'vegan', 'halal', 'kosher', 'vegetarian', 'gluten'],
    personas: [],
    response: () =>
      `🍔 **Live Food Court Status — ${STADIUM_CONTEXT.venue}**\n\n` +
      `| Location | Specialty | Queue | Status |\n` +
      `|----------|-----------|-------|--------|\n` +
      `| Gate 5 Concourse | Hot dogs, Burgers, Nachos | 🟢 3 min | OPEN |\n` +
      `| Section B Food Village | International cuisine | 🟡 6 min | OPEN |\n` +
      `| North Plaza Gourmet | Vegan/Gluten-free | 🟢 4 min | OPEN |\n` +
      `| Halal Hub (Section 120) | Halal-certified meals | 🟡 8 min | OPEN |\n` +
      `| Club Level Bar (Section 200) | Premium drinks + tapas | 🔴 15 min | BUSY |\n` +
      `| Kosher Corner (Gate 9) | Kosher-certified | 🟢 2 min | OPEN |\n\n` +
      `💡 **Pro Tips:**\n` +
      `• Gate 9 Kosher Corner has the shortest queue right now\n` +
      `• Use the **StadiumIQ app** to pre-order and skip the line entirely\n` +
      `• Contactless payments only — no cash accepted at any concession`
  },

  // ─── GATE QUEUES / CROWD ──────────────────────────────────────────────────
  {
    priority: 5,
    keywords: ['queue', 'wait', 'line', 'crowd', 'busy', 'congestion', 'gate', 'entry', 'entrance', 'slow', 'packed', 'dense'],
    personas: [],
    response: () =>
      `📊 **Live Gate Queue Monitor — ${STADIUM_CONTEXT.venue}**\n\n` +
      `| Gate | Wait Time | Crowd Density | Recommendation |\n` +
      `|------|-----------|---------------|----------------|\n` +
      `| Gate 1 | 2 min | 🟢 Low (42%) | ✅ Best Choice |\n` +
      `| Gate 3 | 5 min | 🟡 Medium (65%) | Good |\n` +
      `| Gate 5 | 13 min | 🔴 High (92%) | ⚠️ Avoid |\n` +
      `| Gate 7 | 4 min | 🟡 Medium (58%) | Good |\n` +
      `| Gate 9 | 1 min | 🟢 Low (28%) | ✅ Best Choice |\n\n` +
      `📍 **AI Prediction:** Post-match exit surge expected at Gates 3, 5, 7.\n` +
      `🚀 **Recommended:** Use **Gate 1** or **Gate 9** now. Crowd density drops 40% within 500m of these gates.\n\n` +
      `♿ Step-free accessible entry: **Gates 2, 4, 8**`
  },

  // ─── TRANSPORT / METRO ────────────────────────────────────────────────────
  {
    priority: 6,
    keywords: ['metro', 'transport', 'bus', 'transit', 'train', 'shuttle', 'parking', 'park', 'taxi', 'uber', 'lyft', 'rideshare', 'car', 'drive', 'exit', 'leave', 'go home'],
    personas: [],
    response: () =>
      `🚇 **Live Transport Dashboard — MetLife Stadium**\n\n` +
      `**🚂 Rail / Metro:**\n` +
      `• NJ Transit Meadowlands Line — Every 8 min (⚠️ 4 min outbound delay)\n` +
      `• Meadowlands Express → NYC Penn Station — Every 12 min, direct\n` +
      `• Port Authority Bus — Every 15 min (no delay)\n\n` +
      `**🚌 Shuttle Buses:**\n` +
      `• Route S1 → Times Square: North Plaza, departs every 15 min\n` +
      `• Route S2 → Newark Airport: East Gate, every 20 min\n` +
      `• Route S3 → Jersey City PATH: West Plaza, every 10 min\n\n` +
      `**🅿️ Parking Status:**\n` +
      `• Lot A (Main): 87% full — ⚠️ Near capacity\n` +
      `• Lot C (East): 43% full — ✅ Recommended\n` +
      `• Lot E (Remote + Shuttle): 12% full — Best for post-match exit\n\n` +
      `💡 **Exit Strategy:** Leave 20 min before final whistle to avoid 45-min post-match congestion surge.`
  },

  // ─── NAVIGATION / SEATING ─────────────────────────────────────────────────
  {
    priority: 7,
    keywords: ['seat', 'row', 'section', 'map', 'find', 'locate', 'navigate', 'direction', 'lost', 'kiosk', 'info', 'concourse', 'level'],
    personas: [],
    response: () =>
      `🗺️ **Stadium Navigation — ${STADIUM_CONTEXT.venue}**\n\n` +
      `**Find Your Seat:**\n` +
      `• **Sections 100–149:** Lower Bowl / Field Level → Enter via Gates 1–4\n` +
      `• **Sections 200–249:** Club Level (Elevator available) → Enter via Gates 3–6\n` +
      `• **Sections 300–349:** Upper Deck → Enter via Gates 5–9\n` +
      `• **VIP/Suite Level:** Sections 400+ → Dedicated Suite Entrance, Gate 6A\n\n` +
      `**Info Points:** 🔵 Blue-lit pillars at every gate entrance\n` +
      `**Digital Map:** Stadium map available in FIFA+ app → "Navigate" tab\n\n` +
      `♿ **Accessibility Routes:**\n` +
      `• Step-free lifts: Gates 2, 4, 8 (all levels)\n` +
      `• Wheelchair bays: Sections 105, 220, 315\n` +
      `• Sight-impaired audio guides: Request at Gate 2 Info Desk\n\n` +
      `💡 Ask any **yellow-vest volunteer** for a personal escort to your seat!`
  },

  // ─── RESTROOMS ────────────────────────────────────────────────────────────
  {
    priority: 8,
    keywords: ['toilet', 'restroom', 'bathroom', 'washroom', 'wc', 'loo'],
    personas: [],
    response: () =>
      `🚻 **Nearest Restrooms — ${STADIUM_CONTEXT.venue}**\n\n` +
      `Restrooms are located every 50m on all concourse levels:\n\n` +
      `**Lower Bowl (Sections 100–149):**\n` +
      `• Standard: Sections 108, 122, 138, 149\n` +
      `• ♿ Accessible: Sections 108, 138\n` +
      `• 👶 Family rooms: Section 122\n\n` +
      `**Club Level (Sections 200–249):**\n` +
      `• Both ends of the main corridor (avg wait: 3 min)\n\n` +
      `**Upper Deck (Sections 300–349):**\n` +
      `• Sections 312, 328, 344\n` +
      `• ♿ Accessible: Section 312\n\n` +
      `⏱️ **Current average wait:** 2–4 minutes at all locations\n` +
      `💡 **Tip:** Mid-half restroom visits are 3× faster than halftime`
  },

  // ─── INCIDENT REPORTING (Staff/Volunteer/Organizer) ───────────────────────
  {
    priority: 9,
    keywords: ['incident', 'report', 'problem', 'issue', 'broken', 'damage', 'spill', 'flood', 'leak', 'hazard', 'danger', 'malfunction', 'down', 'error'],
    personas: ['staff', 'volunteer', 'organizer'],
    response: (persona) =>
      `📋 **Incident Management — StadiumIQ Command**\n\n` +
      `As a **${persona.toUpperCase()}**, you have direct escalation access:\n\n` +
      `**Log an Incident:**\n` +
      `1. This AI — describe the incident in plain language\n` +
      `2. **Radio Channel 4** — Operations Control Room (24/7)\n` +
      `3. **Red Kiosks** — touchscreens at every gate entrance\n` +
      `4. **StadiumIQ Staff App** — "Report Incident" button\n\n` +
      `**🔴 Active Incidents Right Now:**\n` +
      `• 🟡 Gate 5 — Crowd congestion (Volunteers dispatched, ETA 2 min)\n` +
      `• 🟢 Section B — Waste bin overflow (Cleaning crew en route)\n` +
      `• 🔴 Restroom Block 112 — Water leak (Maintenance ETA: 6 min)\n` +
      `• 🟡 Seat Row 14–22 — Structural damage reported (Cordon placed)\n\n` +
      `**Priority Levels:** 🔴 CRITICAL | 🟡 HIGH | 🟢 LOW\n\n` +
      `Describe your incident and I'll auto-escalate with location tagging.`
  },

  // ─── SUSTAINABILITY (Organizer) ───────────────────────────────────────────
  {
    priority: 10,
    keywords: ['carbon', 'solar', 'energy', 'sustainability', 'green', 'environment', 'eco', 'renewable', 'waste', 'water', 'emission', 'offset'],
    personas: [],
    response: () =>
      `🌱 **Sustainability Command Center — FIFA 2026 Live**\n\n` +
      `| Metric | Value | Target | Status |\n` +
      `|--------|-------|--------|--------|\n` +
      `| Solar Energy | ${STADIUM_CONTEXT.solarOutput} of grid | 75% | 🟡 Near Target |\n` +
      `| Carbon Offset | ${STADIUM_CONTEXT.carbonOffset} | 10t/day | 🟡 On Track |\n` +
      `| Water Recycled | 43,200L | 40,000L | ✅ Exceeded |\n` +
      `| Waste Diverted | 89% sorted | 85% | ✅ Exceeded |\n` +
      `| LED Coverage | 100% | 100% | ✅ Perfect |\n` +
      `| EV Charging | 47/60 bays used | — | 🟢 Active |\n\n` +
      `📈 **AI Projection:** At current trajectory, MetLife achieves **Carbon Neutral** status by Match Day 3.\n\n` +
      `⚡ **Energy saved today:** 2.4MW (equiv. to powering 1,200 homes for 1 day)\n` +
      `🎯 **Fan Impact:** Every metro trip by a fan saves avg. **4.2kg CO₂** vs solo driving`
  },

  // ─── TICKETING / ACCESS ───────────────────────────────────────────────────
  {
    priority: 11,
    keywords: ['ticket', 'upgrade', 'vip', 'entry', 'banned', 'refund', 'lost ticket', 'digital', 'scan', 'barcode'],
    personas: [],
    response: () =>
      `🎫 **Ticketing & Access — FIFA 2026**\n\n` +
      `**Ticket Issues:**\n` +
      `• Lost/damaged ticket: **Gate 1 or Gate 9 Ticket Desk** (open 2hrs pre-match)\n` +
      `• Digital ticket problems: Show FIFA+ app booking reference (ID: FWCU26-XXXX)\n` +
      `• Seat upgrades: **Gate 3 Concierge Desk** — subject to availability\n` +
      `• Fan zone access: Section 150 Fan Hub, open from kickoff\n\n` +
      `**Entry Rules:**\n` +
      `• Valid photo ID matching ticket name is required\n` +
      `• No re-entry after exit (except Hospitality & VIP suite holders)\n` +
      `• Gates open: **3 hours before kickoff**\n\n` +
      `**Prohibited Items:** Outside food/drink, alcohol, umbrellas, selfie sticks >30cm, professional cameras\n\n` +
      `💡 Digital tickets (FIFA+ app) scan **40% faster** than printed — recommended!`
  },

  // ─── VOLUNTEER MANAGEMENT ─────────────────────────────────────────────────
  {
    priority: 12,
    keywords: ['volunteer', 'shift', 'duty', 'assignment', 'schedule', 'break', 'room', 'task', 'zone', 'post'],
    personas: ['volunteer'],
    response: () =>
      `📋 **Volunteer Command Center — FIFA 2026**\n\n` +
      `**Your Active Assignment:**\n` +
      `• Zone: Gate 5 Crowd Management\n` +
      `• Shift: 14:00 – 22:00 IST (Current shift active ✅)\n` +
      `• Next Break: 17:30 — Room B-12, North Tunnel\n` +
      `• Supervisor: Team Lead Maria V. (Radio Ch. 3)\n\n` +
      `**📌 Available Tasks Near You:**\n` +
      `• 🔴 Gate 5 — Crowd flow redirection (PRIORITY: HIGH)\n` +
      `• 🟡 Section 112 — Fan assistance & wayfinding (MEDIUM)\n` +
      `• 🟢 Lost & Found Desk — 3 unclaimed items pending (LOW)\n` +
      `• 🟢 Section B — Waste bin overflow confirmation (LOW)\n\n` +
      `**Protocol:** Radio Channel 3 when picking up a task, Channel 4 for incidents.\n\n` +
      `💧 Water dispensers at every gate. Rest area: North Tunnel, Room B-12.`
  },

  // ─── ACCESSIBILITY ────────────────────────────────────────────────────────
  {
    priority: 13,
    keywords: ['wheelchair', 'accessible', 'disability', 'blind', 'deaf', 'hearing', 'vision', 'mobility', 'impaired', 'assist', 'companion', 'lift', 'elevator', 'ramp'],
    personas: [],
    response: () =>
      `♿ **Accessibility Services — ${STADIUM_CONTEXT.venue}**\n\n` +
      `**Mobility Assistance:**\n` +
      `• Wheelchair access: Gates 2, 4, 8 (ground level, step-free)\n` +
      `• Lifts to all levels: Gates 2, 4, 6, 8\n` +
      `• Wheelchair seating bays: Sections 105 (Lower), 220 (Club), 315 (Upper)\n` +
      `• Wheelchair loan available: Gate 2 Accessibility Desk\n\n` +
      `**Sensory Support:**\n` +
      `• Hearing loops installed: All concourse info points\n` +
      `• Audio description service: Request at Gate 2 desk\n` +
      `• Quiet room (sensory overload): Section 110, Room Q1\n` +
      `• Braille stadium map: Available at all info kiosks\n\n` +
      `**Companion Passes:** Registered carers enter free with valid disabled badge.\n\n` +
      `📞 Accessibility Hotline: **+1 201-559-1555** (live operators, 6am–midnight)`
  },

  // ─── LIVE MATCH INFO ──────────────────────────────────────────────────────
  {
    priority: 14,
    keywords: ['match', 'score', 'goal', 'live', 'game', 'play', 'argentina', 'brazil', 'fifa', 'world cup', 'halftime', 'kickoff', 'minute', 'result'],
    personas: [],
    response: () =>
      `⚽ **LIVE Match Status — FIFA World Cup 2026**\n\n` +
      `| | Team | Score |\n` +
      `|---|------|-------|\n` +
      `| 🇦🇷 | **Argentina** | **1** |\n` +
      `| 🇧🇷 | **Brazil** | **1** |\n\n` +
      `🕐 **${STADIUM_CONTEXT.match.minute}' — SECOND HALF IN PROGRESS**\n\n` +
      `**Match Facts:**\n` +
      `• Venue: ${STADIUM_CONTEXT.venue}\n` +
      `• Attendance: ${STADIUM_CONTEXT.attendance} / ${STADIUM_CONTEXT.capacity}\n` +
      `• Referee: Pierluigi Collina (ITA)\n` +
      `• Goals: L. Messi 23' 🇦🇷 | V. Júnior 61' 🇧🇷\n` +
      `• Yellow Cards: 3 total (ARG: 2, BRA: 1)\n\n` +
      `📺 Watch on FIFA+ | 📊 Live stats on StadiumIQ app → "Live Match" tab`
  },

  // ─── STAFF OPERATIONS ─────────────────────────────────────────────────────
  {
    priority: 15,
    keywords: ['cleaning', 'maintenance', 'inspection', 'task', 'assign', 'dispatch', 'update', 'status', 'log', 'operations'],
    personas: ['staff', 'organizer'],
    response: (persona) =>
      `⚙️ **Operations Dashboard — ${persona.toUpperCase()} View**\n\n` +
      `**Active Staff Tasks:**\n` +
      `• 🟡 Section B — Waste bin replacement (3 bins, ETA 5 min)\n` +
      `• 🔴 Restroom 112 — Flood/leak response (Plumber dispatched)\n` +
      `• 🟢 Gate 3 — Card reader inspection (Done, logged 14:42)\n` +
      `• 🟡 Upper Deck Row 14 — Broken seat cordoned off\n\n` +
      `**Cleaning Crew Locations:**\n` +
      `• Team Alpha: Lower Concourse (Sections 100–130)\n` +
      `• Team Beta: Club Level (Sections 200–240)\n` +
      `• Team Gamma: Upper Deck (Sections 300–340) — currently at Break\n\n` +
      `**Pending Tasks:** 7 open | **Completed Today:** 43\n\n` +
      `📻 Radio: Ch. 2 for Cleaning, Ch. 4 for Maintenance, Ch. 5 for Security`
  }
];

/** Default catch-all response when no rule matches */
const buildDefaultResponse = (persona: string): string =>
  `🤖 **StadiumIQ Pro AI — ${persona.charAt(0).toUpperCase() + persona.slice(1)} Mode**\n\n` +
  `**Live Stadium Status:**\n` +
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
 * @returns Best matching contextual response string
 */
export const getFallbackResponse = (
  message: string,
  persona: string,
  language: string
): string => {
  const lower = message.toLowerCase();

  // Sort by priority ascending so highest-priority rules win
  const sorted = [...FALLBACK_RULES].sort((a, b): number => a.priority - b.priority);

  for (const rule of sorted) {
    const matchesKeyword = rule.keywords.some((kw): boolean => {
      if (kw.includes(' ')) {
        return lower.includes(kw);
      }
      // Escape special characters for regex, then use word boundary check
      const escapedKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedKw}\\b`, 'i');
      return regex.test(lower);
    });

    const matchesPersona = rule.personas.length === 0 || rule.personas.includes(persona);

    if (matchesKeyword && matchesPersona) {
      const resp = rule.response(persona, language);
      // Non-English: prepend language tag for clarity
      if (language !== 'en') {
        return `[${language.toUpperCase()} Response]\n\n${resp}`;
      }
      return resp;
    }
  }

  return buildDefaultResponse(persona);
};

/**
 * Returns all available rule keywords for test coverage validation.
 * @returns Flat array of all trigger keywords
 */
export const getAllFallbackKeywords = (): readonly string[] =>
  FALLBACK_RULES.flatMap((r): readonly string[] => r.keywords);
