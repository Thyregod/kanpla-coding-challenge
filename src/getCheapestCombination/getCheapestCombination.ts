import _ from 'lodash';
import { Bundle } from '../types';
import { combinationSum } from '../utils/combinationSum/combinationSum';

export function getCostPerPortion(bundle: Bundle): number {
  return bundle.pricePerBundle / bundle.portions;
}

export function getCheapestCombination(totalPortions: number, bundles: Bundle[]): Bundle[] {
  const allCombinations = combinationSum(bundles, (bundle) => bundle.portions, totalPortions);
  const cheapestCombination = _.minBy(allCombinations, (combination) =>
    _.sumBy(combination, getCostPerPortion)
  );
  return cheapestCombination ?? [];
}
