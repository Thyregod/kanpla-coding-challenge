import { describe, expect, it } from 'vitest';
import { combinationSum } from './combinationSum';

type TestObject = {
  name: string;
  value: number;
};

const OBJECT_1: TestObject = {
  name: 'carrot 🥕',
  value: 2,
};
const OBJECT_2: TestObject = {
  name: 'orange 🍊',
  value: 3,
};
const OBJECT_3: TestObject = {
  name: 'strawberry 🍓',
  value: 6,
};
const OBJECT_4: TestObject = {
  name: 'watermelon 🍉',
  value: 7,
};

const CANDIDATES = [OBJECT_1, OBJECT_2, OBJECT_3, OBJECT_4];

describe(combinationSum.name, () => {
  it('should return an empty array when no combinations are possible', () => {
    const result = combinationSum(CANDIDATES, (item) => item.value, 1);
    expect(result).toEqual([]);
  });

  it('should return an empty array when the target is zero', () => {
    const result = combinationSum(CANDIDATES, (item) => item.value, 0);
    expect(result).toEqual([[]]);
  });

  it.each([
    [6, [[OBJECT_1, OBJECT_1, OBJECT_1], [OBJECT_2, OBJECT_2], [OBJECT_3]]],
    [7, [[OBJECT_1, OBJECT_1, OBJECT_2], [OBJECT_4]]],
  ])('should return all combinations that sum up to the target %i', (target, expected) => {
    const result = combinationSum(CANDIDATES, (item) => item.value, target);
    expect(result).toEqual(expected);
  });
});
