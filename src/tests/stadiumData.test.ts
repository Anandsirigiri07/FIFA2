import { describe, it, expect } from 'vitest';
import { getVenueById, getVenuesByCountry, findAmenities } from '../utils/stadiumData';

describe('stadiumData utils', () => {
  it('finds MetLife by ID', () => {
    const venue = getVenueById('metlife');
    expect(venue).toBeDefined();
    expect(venue?.name).toBe('MetLife Stadium');
  });

  it('returns undefined for invalid ID', () => {
    expect(getVenueById('not-exists')).toBeUndefined();
  });

  it('filters venues by country', () => {
    const venues = getVenuesByCountry('Mexico');
    expect(venues.length).toBe(3);
    expect(venues[0].country).toBe('Mexico');
  });

  it('finds and sorts amenities by wait time', () => {
    const foodList = findAmenities('metlife', 'food');
    expect(foodList.length).toBeGreaterThan(0);
    expect(foodList[0].type).toBe('food');
    expect(foodList[0].waitMinutes).toBe(15);
  });
});
