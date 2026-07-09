/**
 * Static data for all 16 FIFA World Cup 2026 venues.
 * Data sourced from official FIFA 2026 announcements.
 * @module stadiumData
 */

import type { Venue, Amenity } from '../types';

/**
 * Complete list of all 16 FIFA World Cup 2026 venues
 * across USA, Canada, and Mexico.
 */
export const FIFA_2026_VENUES: readonly Venue[] = [
  {
    id: 'metlife', name: 'MetLife Stadium',
    city: 'East Rutherford, NJ', country: 'USA',
    capacity: 82500, lat: 40.8135, lng: -74.0745,
    timezone: 'America/New_York',
    gates: [
      { id: 'g1', name: 'Gate A', isOpen: true, 
        queueMinutes: 8, isAccessible: true },
      { id: 'g2', name: 'Gate B', isOpen: true, 
        queueMinutes: 12, isAccessible: false },
      { id: 'g3', name: 'Gate C', isOpen: true, 
        queueMinutes: 5, isAccessible: true },
      { id: 'g4', name: 'Gate D', isOpen: false, 
        queueMinutes: 0, isAccessible: false },
    ],
    amenities: [
      { id: 'a1', type: 'food', name: 'East Food Court',
        section: 'East Wing', waitMinutes: 15, isOpen: true },
      { id: 'a2', type: 'medical', name: 'Medical Station 1',
        section: 'Gate A Concourse', waitMinutes: 0, isOpen: true },
      { id: 'a3', type: 'restroom', name: 'Restrooms Level 1',
        section: 'Main Concourse', waitMinutes: 5, isOpen: true },
    ]
  },
  {
    id: 'sofi', name: 'SoFi Stadium',
    city: 'Inglewood, CA', country: 'USA',
    capacity: 70240, lat: 33.9535, lng: -118.3392,
    timezone: 'America/Los_Angeles',
    gates: [
      { id: 'g1', name: 'Gate 1', isOpen: true,
        queueMinutes: 6, isAccessible: true },
      { id: 'g2', name: 'Gate 2', isOpen: true,
        queueMinutes: 10, isAccessible: true },
      { id: 'g3', name: 'Gate 3', isOpen: true,
        queueMinutes: 4, isAccessible: false },
    ],
    amenities: [
      { id: 'a1', type: 'food', name: 'West Pavilion Food',
        section: 'West', waitMinutes: 20, isOpen: true },
      { id: 'a2', type: 'medical', name: 'First Aid West',
        section: 'West Entry', waitMinutes: 0, isOpen: true },
    ]
  },
  {
    id: 'att', name: 'AT&T Stadium',
    city: 'Arlington, TX', country: 'USA',
    capacity: 80000, lat: 32.7473, lng: -97.0945,
    timezone: 'America/Chicago',
    gates: [
      { id: 'g1', name: 'North Gate', isOpen: true,
        queueMinutes: 9, isAccessible: true },
      { id: 'g2', name: 'South Gate', isOpen: true,
        queueMinutes: 7, isAccessible: true },
    ],
    amenities: [
      { id: 'a1', type: 'food', name: 'Cowboys Club',
        section: 'Club Level', waitMinutes: 12, isOpen: true },
      { id: 'a2', type: 'merchandise', name: 'Fan Shop',
        section: 'Main Entry', waitMinutes: 5, isOpen: true },
    ]
  },
  {
    id: 'levis', name: "Levi's Stadium",
    city: 'Santa Clara, CA', country: 'USA',
    capacity: 68500, lat: 37.4033, lng: -121.9694,
    timezone: 'America/Los_Angeles',
    gates: [
      { id: 'g1', name: 'Gate A', isOpen: true,
        queueMinutes: 8, isAccessible: true },
      { id: 'g2', name: 'Gate B', isOpen: true,
        queueMinutes: 11, isAccessible: false },
    ],
    amenities: [
      { id: 'a1', type: 'food', name: 'Silicon Valley Eats',
        section: 'East', waitMinutes: 18, isOpen: true },
    ]
  },
  {
    id: 'lincoln', name: 'Lincoln Financial Field',
    city: 'Philadelphia, PA', country: 'USA',
    capacity: 69796, lat: 39.9008, lng: -75.1675,
    timezone: 'America/New_York',
    gates: [
      { id: 'g1', name: 'Gate A', isOpen: true,
        queueMinutes: 7, isAccessible: true },
      { id: 'g2', name: 'Gate B', isOpen: true,
        queueMinutes: 14, isAccessible: true },
    ],
    amenities: [
      { id: 'a1', type: 'food', name: 'Philly Cheesesteak Stand',
        section: 'Lower Concourse', waitMinutes: 22, isOpen: true },
    ]
  },
  {
    id: 'gillette', name: 'Gillette Stadium',
    city: 'Foxborough, MA', country: 'USA',
    capacity: 65878, lat: 42.0909, lng: -71.2643,
    timezone: 'America/New_York',
    gates: [
      { id: 'g1', name: 'Main Gate', isOpen: true,
        queueMinutes: 10, isAccessible: true },
    ],
    amenities: [
      { id: 'a1', type: 'food', name: 'Patriot Place Food',
        section: 'Main', waitMinutes: 16, isOpen: true },
    ]
  },
  {
    id: 'nrg', name: 'NRG Stadium',
    city: 'Houston, TX', country: 'USA',
    capacity: 72220, lat: 29.6847, lng: -95.4107,
    timezone: 'America/Chicago',
    gates: [
      { id: 'g1', name: 'Gate 1', isOpen: true,
        queueMinutes: 6, isAccessible: true },
      { id: 'g2', name: 'Gate 2', isOpen: true,
        queueMinutes: 9, isAccessible: true },
    ],
    amenities: [
      { id: 'a1', type: 'food', name: 'Houston BBQ Stand',
        section: 'West', waitMinutes: 20, isOpen: true },
    ]
  },
  {
    id: 'hardrock', name: 'Hard Rock Stadium',
    city: 'Miami Gardens, FL', country: 'USA',
    capacity: 65326, lat: 25.9580, lng: -80.2389,
    timezone: 'America/New_York',
    gates: [
      { id: 'g1', name: 'Main Entry', isOpen: true,
        queueMinutes: 8, isAccessible: true },
    ],
    amenities: [
      { id: 'a1', type: 'food', name: 'Tropical Food Court',
        section: 'Main', waitMinutes: 14, isOpen: true },
    ]
  },
  {
    id: 'arrowhead', name: 'Arrowhead Stadium',
    city: 'Kansas City, MO', country: 'USA',
    capacity: 76416, lat: 39.0489, lng: -94.4839,
    timezone: 'America/Chicago',
    gates: [
      { id: 'g1', name: 'Gate 1', isOpen: true,
        queueMinutes: 7, isAccessible: true },
    ],
    amenities: [
      { id: 'a1', type: 'food', name: 'Chiefs BBQ',
        section: 'North', waitMinutes: 18, isOpen: true },
    ]
  },
  {
    id: 'lumen', name: 'Lumen Field',
    city: 'Seattle, WA', country: 'USA',
    capacity: 69000, lat: 47.5952, lng: -122.3316,
    timezone: 'America/Los_Angeles',
    gates: [
      { id: 'g1', name: 'Gate A', isOpen: true,
        queueMinutes: 5, isAccessible: true },
    ],
    amenities: [
      { id: 'a1', type: 'food', name: 'Pacific Northwest Eats',
        section: 'Main', waitMinutes: 12, isOpen: true },
    ]
  },
  {
    id: 'bcplace', name: 'BC Place',
    city: 'Vancouver, BC', country: 'Canada',
    capacity: 54500, lat: 49.2767, lng: -123.1117,
    timezone: 'America/Vancouver',
    gates: [
      { id: 'g1', name: 'North Gate', isOpen: true,
        queueMinutes: 8, isAccessible: true },
      { id: 'g2', name: 'South Gate', isOpen: true,
        queueMinutes: 6, isAccessible: true },
    ],
    amenities: [
      { id: 'a1', type: 'food', name: 'Vancouver Eats',
        section: 'Main', waitMinutes: 15, isOpen: true },
      { id: 'a2', type: 'prayer_room', name: 'Quiet Room',
        section: 'Level 2', waitMinutes: 0, isOpen: true },
    ]
  },
  {
    id: 'bmo', name: 'BMO Field',
    city: 'Toronto, ON', country: 'Canada',
    capacity: 45736, lat: 43.6333, lng: -79.4186,
    timezone: 'America/Toronto',
    gates: [
      { id: 'g1', name: 'Main Gate', isOpen: true,
        queueMinutes: 9, isAccessible: true },
    ],
    amenities: [
      { id: 'a1', type: 'food', name: 'Toronto Food Hall',
        section: 'East', waitMinutes: 11, isOpen: true },
    ]
  },
  {
    id: 'commonwealth', name: 'Commonwealth Stadium',
    city: 'Edmonton, AB', country: 'Canada',
    capacity: 56302, lat: 53.5637, lng: -113.4988,
    timezone: 'America/Edmonton',
    gates: [
      { id: 'g1', name: 'Gate A', isOpen: true,
        queueMinutes: 6, isAccessible: true },
    ],
    amenities: [
      { id: 'a1', type: 'food', name: 'Alberta Kitchen',
        section: 'Main', waitMinutes: 10, isOpen: true },
    ]
  },
  {
    id: 'azteca', name: 'Estadio Azteca',
    city: 'Mexico City', country: 'Mexico',
    capacity: 87523, lat: 19.3029, lng: -99.1506,
    timezone: 'America/Mexico_City',
    gates: [
      { id: 'g1', name: 'Puerta 1', isOpen: true,
        queueMinutes: 15, isAccessible: true },
      { id: 'g2', name: 'Puerta 2', isOpen: true,
        queueMinutes: 11, isAccessible: false },
      { id: 'g3', name: 'Puerta 3', isOpen: true,
        queueMinutes: 8, isAccessible: true },
    ],
    amenities: [
      { id: 'a1', type: 'food', name: 'Taqueria Azteca',
        section: 'Nivel 1', waitMinutes: 20, isOpen: true },
      { id: 'a2', type: 'info', name: 'Centro de Información',
        section: 'Entrada Principal', waitMinutes: 3, isOpen: true },
    ]
  },
  {
    id: 'bbva', name: 'Estadio BBVA',
    city: 'Monterrey', country: 'Mexico',
    capacity: 53500, lat: 25.6694, lng: -100.2437,
    timezone: 'America/Monterrey',
    gates: [
      { id: 'g1', name: 'Acceso Norte', isOpen: true,
        queueMinutes: 8, isAccessible: true },
      { id: 'g2', name: 'Acceso Sur', isOpen: true,
        queueMinutes: 6, isAccessible: true },
    ],
    amenities: [
      { id: 'a1', type: 'food', name: 'Cocina Regiomontana',
        section: 'Norte', waitMinutes: 12, isOpen: true },
    ]
  },
  {
    id: 'akron', name: 'Estadio Akron',
    city: 'Guadalajara', country: 'Mexico',
    capacity: 49850, lat: 20.6597, lng: -103.4653,
    timezone: 'America/Guadalajara',
    gates: [
      { id: 'g1', name: 'Entrada Principal', isOpen: true,
        queueMinutes: 7, isAccessible: true },
    ],
    amenities: [
      { id: 'a1', type: 'food', name: 'Birria Stand',
        section: 'Principal', waitMinutes: 14, isOpen: true },
    ]
  },
];

/**
 * Finds a venue by its unique ID.
 * @param id - Venue identifier string
 * @returns Venue object or undefined if not found
 */
export const getVenueById = (id: string): Venue | undefined =>
  FIFA_2026_VENUES.find(v => v.id === id);

/**
 * Returns all venues for a given country.
 * @param country - Country name to filter by
 * @returns Array of matching Venue objects
 */
export const getVenuesByCountry = (
  country: Venue['country']
): readonly Venue[] =>
  FIFA_2026_VENUES.filter(v => v.country === country);

/**
 * Searches amenities by type within a venue.
 * @param venueId - Venue to search within
 * @param type - Amenity type to find
 * @returns Matching amenities, sorted by wait time
 */
export const findAmenities = (
  venueId: string,
  type: Amenity['type']
): Amenity[] => {
  const venue = getVenueById(venueId);
  if (!venue) return [];
  return [...venue.amenities]
    .filter(a => a.type === type && a.isOpen)
    .sort((a, b) => a.waitMinutes - b.waitMinutes);
};
