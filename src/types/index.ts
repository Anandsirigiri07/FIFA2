// ZERO any types. Every value explicitly typed.

export type Persona = 
  'fan' | 'staff' | 'volunteer' | 'organizer';

export type Language = 
  'en' | 'es' | 'fr' | 'pt' | 'ar' | 
  'de' | 'ja' | 'zh' | 'hi' | 'ko';

export type AlertSeverity = 
  'info' | 'warning' | 'critical';

export type IncidentType = 
  'medical' | 'security' | 'crowd' | 
  'facility' | 'fire' | 'technical';

export type IncidentStatus = 
  'open' | 'in_progress' | 'resolved';

export type CrowdStatus = 
  'low' | 'moderate' | 'high' | 'critical';

export type TransportMode = 
  'metro' | 'bus' | 'shuttle' | 
  'rideshare' | 'walk' | 'bike';

export interface Venue {
  readonly id: string;
  readonly name: string;
  readonly city: string;
  readonly country: 'USA' | 'Canada' | 'Mexico';
  readonly capacity: number;
  readonly lat: number;
  readonly lng: number;
  readonly timezone: string;
  readonly gates: Gate[];
  readonly amenities: Amenity[];
}

export interface Gate {
  readonly id: string;
  readonly name: string;
  isOpen: boolean;
  queueMinutes: number;
  readonly isAccessible: boolean;
}

export interface Amenity {
  readonly id: string;
  readonly type: 
    'food' | 'restroom' | 'medical' | 
    'info' | 'merchandise' | 'prayer_room';
  readonly name: string;
  readonly section: string;
  waitMinutes: number;
  isOpen: boolean;
}

export interface CrowdData {
  readonly venueId: string;
  timestamp: Date;
  totalCount: number;
  readonly capacity: number;
  occupancyPct: number;
  inflowPerMin: number;
  outflowPerMin: number;
  sections: SectionData[];
  alerts: StadiumAlert[];
}

export interface SectionData {
  readonly id: string;
  readonly name: string;
  count: number;
  pct: number;
  status: CrowdStatus;
}

export interface StadiumAlert {
  readonly id: string;
  readonly type: AlertSeverity;
  readonly title: string;
  message: string;
  readonly timestamp: Date;
  isRead: boolean;
}

export interface Incident {
  id: string;
  type: IncidentType;
  title: string;
  description: string;
  location: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: IncidentStatus;
  reportedBy: string;
  timestamp: Date;
  aiResponse?: string;
}

export interface TransportOption {
  readonly id: string;
  readonly mode: TransportMode;
  readonly provider: string;
  departureTime: string;
  arrivalTime: string;
  readonly durationMins: number;
  crowdLevel: CrowdStatus;
  readonly co2Kg: number;
  readonly price: string;
}

export interface ChatMessage {
  readonly id: string;
  role: 'user' | 'assistant';
  content: string;
  readonly timestamp: Date;
  readonly language: Language;
  readonly persona: Persona;
}

export interface UserProfile {
  readonly uid: string;
  displayName: string;
  readonly email: string;
  persona: Persona;
  language: Language;
  readonly venueId: string;
  accessibilityNeeds: AccessibilityNeed[];
}

export type AccessibilityNeed = 
  'wheelchair' | 'visual' | 'hearing' | 
  'cognitive' | 'medical_device';

export interface CarbonMetrics {
  readonly venueId: string;
  solarPct: number;
  energyMwh: number;
  wasteRecycledPct: number;
  transportCo2Saved: number;
  offsetCredits: number;
  rating: 'A' | 'B' | 'C' | 'D';
}

export interface OperationsMetrics {
  readonly venueId: string;
  staffOnDuty: number;
  volunteersActive: number;
  incidentsOpen: number;
  incidentsResolved: number;
  avgEntryTimeMins: number;
  fanSatisfactionScore: number;
  gateUtilizationPct: number;
}

export interface GeminiConfig {
  readonly model: 'gemini-1.5-flash';
  readonly maxTokens: number;
  readonly temperature: number;
}

export interface SanitizeResult {
  readonly clean: string;
  readonly wasInjection: boolean;
  readonly wasTruncated: boolean;
}

export interface RateLimitResult {
  readonly allowed: boolean;
  readonly waitMs: number;
  readonly remaining: number;
}

export interface AuditLog {
  readonly id: string;
  readonly timestamp: string;
  readonly action: string;
  readonly actor: string;
  readonly details: Record<string, unknown>;
  readonly status: 'SUCCESS' | 'FAILED';
}
