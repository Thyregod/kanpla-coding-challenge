import _ from 'lodash';
import 'lodash.combinations';
import { getCheapestCombination, getCostPerPortion } from '../getCheapestCombination/getCheapestCombination';
import { Bundle, Order, User } from '../types';

type UserPortion = Pick<User, 'id' | 'maxPricePerPortion'>;
type UserBundleCombination = { userCombination: User[]; bundleCombination: Bundle[] };

export function allocatePortions(users: User[], bundles: Bundle[]): Order[] {
  const usersWithinBudget = filterUsersWithinBudget(users, bundles);
  return findCombinationAndCreateOrders(usersWithinBudget, bundles);
}

/**
 * Filters users who can afford the cheapest bundle
 */
function filterUsersWithinBudget(users: User[], bundles: Bundle[]): User[] {
  const cheapestBundle = getCheapestBundle(bundles);
  const costPerPortion = getCostPerPortion(cheapestBundle);
  return users.filter((user) => user.maxPricePerPortion >= costPerPortion);
}

/**
 * Returns the cheapest bundle based on the cost per portion
 */
function getCheapestBundle(bundles: Bundle[]): Bundle {
  return _.minBy(bundles, getCostPerPortion)!;
}

function findCombinationAndCreateOrders(users: User[], bundles: Bundle[]): Order[] {
  const allUserCombinations = _.flatMap(_.range(users.length + 1), (numToRemove) =>
    _.combinations(users, users.length - numToRemove)
  );

  const bestCombination = allUserCombinations.reduce<UserBundleCombination | undefined>(
    (bestCombination, userCombination) => {
      const portionsSum = _.sumBy(userCombination, 'portions');
      const cheapestBundleCombination = getCheapestCombination(portionsSum, bundles);
      if (!canUsersAffordBundles(userCombination, cheapestBundleCombination)) return bestCombination;

      const currentCombination: UserBundleCombination = {
        userCombination,
        bundleCombination: cheapestBundleCombination,
      };
      if (bestCombination && !isBetterCombination(currentCombination, bestCombination)) return bestCombination;

      return currentCombination;
    },
    undefined
  );

  return bestCombination
    ? createOrders(bestCombination.userCombination, bestCombination.bundleCombination)
    : [];
}

/**
 * @example
 * convertUserToPortionsAsc(
 *  [
 *    { id: '1', portions: 1, maxPricePerPortion: 9 },
 *    { id: '2', portions: 2, maxPricePerPortion: 6 },
 *  ]
 * )
 * // => [
 * //       { id: '2', maxPricePerPortion: 6 },
 * //       { id: '2', maxPricePerPortion: 6 }
 * //       { id: '1', maxPricePerPortion: 9 },
 * // ]
 */
function convertUserToPortionsAsc(users: User[]): UserPortion[] {
  return users
    .flatMap((user) => Array(user.portions).fill(user))
    .sort((a, b) => a.maxPricePerPortion - b.maxPricePerPortion);
}

/**
 * @example
 * convertBundleToAveragePricesAsc(
 *  [
 *    { pricePerBundle: 10, portions: 1 },
 *    { pricePerBundle: 18, portions: 2 },
 *    { pricePerBundle: 24, portions: 3 }
 *  ]
 * )
 * // => [ 8, 8, 8, 9, 9, 10 ]
 */
function convertBundleToAveragePricesAsc(bundles: Bundle[]): number[] {
  return bundles
    .flatMap((bundle) => Array(bundle.portions).fill(getCostPerPortion(bundle)))
    .sort((a, b) => a - b); // Sorted in ascending order
}

/**
 * Validates if the users can afford the bundles
 */
function canUsersAffordBundles(users: User[], bundles: Bundle[]): boolean {
  const userPortions = convertUserToPortionsAsc(users);
  const bundlePortions = convertBundleToAveragePricesAsc(bundles);

  // Check each user portion can afford the bundle portion
  return userPortions.every((user, index) => user.maxPricePerPortion >= bundlePortions[index]);
}

/**
 * Determines if the new combination is better than the current best combination
 */
function isBetterCombination(
  newCombination: UserBundleCombination,
  bestCombination: UserBundleCombination
): boolean {
  const newPortions = _.sumBy(newCombination.userCombination, 'portions');
  const bestPortions = _.sumBy(bestCombination.userCombination, 'portions');

  if (newPortions > bestPortions) return true;

  if (newPortions === bestPortions) {
    const newCost = _.sumBy(newCombination.bundleCombination, 'pricePerBundle');
    const bestCost = _.sumBy(bestCombination.bundleCombination, 'pricePerBundle');
    return newCost < bestCost;
  }

  return false;
}

/**
 * Creates orders for users and bundles
 * Assumes that the users and bundles have already been validated by `canUsersAffordBundles`
 */
function createOrders(users: User[], bundles: Bundle[]): Order[] {
  const userPortions = convertUserToPortionsAsc(users);
  const bundlePortions = convertBundleToAveragePricesAsc(bundles);

  const userIdPortionPrices = userPortions.reduce<Record<User['id'], number[]>>((acc, user, index) => {
    const portionPrice = bundlePortions[index];

    return {
      ...acc,
      [user.id]: [...(acc[user.id] || []), portionPrice],
    };
  }, {});

  return Object.entries(userIdPortionPrices).map(([userId, userPortionPrices]) => ({
    userId,
    portions: userPortionPrices.length,
    pricePerPortion: _.round(_.mean(userPortionPrices), 2),
  }));
}
