export type User = {
    id: string;
    portions: number;
    maxPricePerPortion: number;
  };

  export type Bundle = {
    portions: number;
    pricePerBundle: number;
};

export type Order = {
    userId: string;
    portions: number;
    pricePerPortion: number;
};