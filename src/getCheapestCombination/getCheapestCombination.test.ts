import { expect, it, beforeEach, describe } from 'vitest';
import { getCheapestCombination } from './getCheapestCombination';
import { Bundle } from '../types';

describe(getCheapestCombination.name, () => {
  let bundles: Bundle[];

  beforeEach(() => {
    bundles = [
      { pricePerBundle: 30, portions: 1 }, // Avg. price per portion: 30
      { pricePerBundle: 15, portions: 2 }, // Avg. price per portion: 7.5
      { pricePerBundle: 20, portions: 3 }, // Avg. price per portion: 6.67
      { pricePerBundle: 25, portions: 4 }, // Avg. price per portion: 6.25
    ];
  });

  it('should return the cheapest combination of bundles that fulfill the total portions', () => {
    const result = getCheapestCombination(5, bundles);

    expect(result).toEqual([
      { pricePerBundle: 15, portions: 2 },
      { pricePerBundle: 20, portions: 3 },
    ]);
  });
});
