import { allocatePortions } from './allocatePortions';
import { Bundle, User } from './types';

const users: User[] = [
  { id: '1', portions: 3, maxPricePerPortion: 6 },
  { id: '2', portions: 5, maxPricePerPortion: 9 },
  { id: '3', portions: 2, maxPricePerPortion: 7.5 },
  { id: '4', portions: 1, maxPricePerPortion: 8 },
  { id: '5', portions: 4, maxPricePerPortion: 6.5 },
  { id: '6', portions: 3, maxPricePerPortion: 10 },
  { id: '7', portions: 2, maxPricePerPortion: 8 },
  { id: '8', portions: 3, maxPricePerPortion: 7 },
  { id: '9', portions: 4, maxPricePerPortion: 6 },
  { id: '10', portions: 1, maxPricePerPortion: 9.5 },
  { id: '11', portions: 2, maxPricePerPortion: 8.5 },
  { id: '12', portions: 3, maxPricePerPortion: 6 }
];

const bundles: Bundle[] = [
  { pricePerBundle: 10, portions: 1 },
  { pricePerBundle: 25, portions: 3 },
  { pricePerBundle: 50, portions: 7 }
];

const orders = allocatePortions(users, bundles);
console.log(orders);