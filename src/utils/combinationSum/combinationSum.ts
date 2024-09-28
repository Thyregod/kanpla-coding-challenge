/**
 * Finds all unique combinations of items that sum up to the target value.
 *
 * @example
 * combinationSum(
 *  [
 *    { name: 'carrot 🥕', value: 2 },
 *    { name: 'orange 🍊', value: 3 },
 *    { name: 'strawberry 🍓', value: 6 },
 *    { name: 'watermelon 🍉', value: 7 },
 *  ],
 *  (item) => item.value,
 *  7
 * )
 * // => [
 * //      [{ name: 'carrot 🥕', value: 2 }, { name: 'carrot 🥕', value: 2 }, { name: 'orange 🍊', value: 3 }],
 * //      [{ name: 'watermelon 🍉', value: 7 }],
 * // ]
 */
export function combinationSum<T>(items: T[], getCandidate: (item: T) => number, target: number): T[][] {
  const dp: T[][][] = Array.from({ length: target + 1 }, () => []);
  dp[0] = [[]];

  for (const item of items) {
    const candidate = getCandidate(item);
    for (let i = candidate; i <= target; i++) {
      for (const combination of dp[i - candidate]) {
        dp[i].push([...combination, item]);
      }
    }
  }

  return dp[target];
}
