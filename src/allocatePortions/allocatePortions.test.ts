import { expect, it, beforeEach, describe } from 'vitest';
import { allocatePortions } from './allocatePortions';
import { Bundle, User } from '../types';

describe(allocatePortions.name, () => {
  let bundles: Bundle[];

  beforeEach(() => {
    bundles = [
      { pricePerBundle: 10, portions: 1 }, // Avg. price per portion: 10
      { pricePerBundle: 25, portions: 3 }, // Avg. price per portion: 8.33
      { pricePerBundle: 50, portions: 7 }, // Avg. price per portion: 7.14
    ];
  });

  it('should return an empty array when no users can afford any bundle', () => {
    const users: User[] = [{ id: '1', portions: 3, maxPricePerPortion: 6 }];

    const result = allocatePortions(users, bundles);

    expect(result).toEqual([]);
  });

  it('should return an empty array when users can afford the cheapest bundle but has no one to pool with ', () => {
    const users: User[] = [
      { id: '1', portions: 6, maxPricePerPortion: 7.5 }, // Can afford the cheapest bundle
    ];

    const result = allocatePortions(users, bundles);

    expect(result).toEqual([]);
  });

  it('should return an order for each user that can afford a bundle by pooling together', () => {
    const users: User[] = [
      { id: '1', portions: 3, maxPricePerPortion: 6 },
      { id: '2', portions: 6, maxPricePerPortion: 7.5 }, // Can afford the cheapest bundle by pooling with user 3
      { id: '3', portions: 2, maxPricePerPortion: 10 },
    ];

    const result = allocatePortions(users, bundles);

    expect(result).toEqual([
      { userId: '2', portions: 6, pricePerPortion: 7.14 },
      { userId: '3', portions: 2, pricePerPortion: 8.57 }, // Avg. price of 1 portion with 10 pricePerBundle and 1 portion of 7.14 pricePerBundle
    ]);
  });

  it('should exclude users who cannot afford any bundle', () => {
    // Only user1 or user2 can pool with user3 to afford the cheapest bundle
    const users: User[] = [
      { id: '1', portions: 6, maxPricePerPortion: 7.5 },
      { id: '2', portions: 6, maxPricePerPortion: 7.5 },
      { id: '3', portions: 1, maxPricePerPortion: 10 },
    ];

    const result = allocatePortions(users, bundles);

    expect(result).toEqual([
      { userId: '1', portions: 6, pricePerPortion: 7.14 },
      { userId: '3', portions: 1, pricePerPortion: 7.14 },
    ]);
  });

  it('should return the combination with most portions when multiple combinations are valid', () => {
    /**
     * Valid combinations after removing a family:
     * 3 portions - user1 & user2 with pricePerPortion: 8.33
     * 7 portions - user1 & user3 with pricePerPortion: 7.14 (Cheapest)
     */
    const users: User[] = [
      { id: '1', portions: 1, maxPricePerPortion: 10 },
      { id: '2', portions: 2, maxPricePerPortion: 8.5 },
      { id: '3', portions: 6, maxPricePerPortion: 7.5 },
    ];

    const result = allocatePortions(users, bundles);

    expect(result).toEqual([
      { userId: '1', portions: 1, pricePerPortion: 7.14 },
      { userId: '3', portions: 6, pricePerPortion: 7.14 },
    ]);
  });

  it('should return the cheapest combination of bundles that fulfill the total portions when multiple combinations are valid', () => {
    const users: User[] = [
      { id: '1', portions: 1, maxPricePerPortion: 5 },
      { id: '2', portions: 2, maxPricePerPortion: 5 },
    ];

    // Both bundles are valid to fulfill the total portions, but the last bundle is the cheapest
    const bundles: Bundle[] = [
      { pricePerBundle: 15, portions: 3 }, // Avg. price per portion: 5
      { pricePerBundle: 12, portions: 3 }, // Avg. price per portion: 4 (Cheapest)
    ];

    const result = allocatePortions(users, bundles);

    expect(result).toEqual([
      { userId: '1', portions: 1, pricePerPortion: 4 },
      { userId: '2', portions: 2, pricePerPortion: 4 },
    ]);
  });
});
