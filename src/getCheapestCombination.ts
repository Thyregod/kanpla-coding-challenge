import { Bundle } from "./types";

function getCostPerPortion(bundle: Bundle): number {
return bundle.pricePerBundle / bundle.portions;
}

export function getCheapestCombination(totalPortions: number, bundles: Bundle[]): Bundle[] {
// Sort bundles by cost per portion in ascending order
const sortedBundles = bundles.sort((a, b) => getCostPerPortion(a) - getCostPerPortion(b));
const result: Bundle[] = [];
let remainingPortions = totalPortions;

// Add the cheapest bundles until the required portions are met
for (const bundle of sortedBundles) {
    while (remainingPortions >= bundle.portions) {
    result.push(bundle);
    remainingPortions -= bundle.portions;
    }
    if (remainingPortions === 0) break;
}

// If there are still remaining portions that couldn't be fulfilled, return an empty array
if (remainingPortions > 0) {
    return [];
}

return result;
}