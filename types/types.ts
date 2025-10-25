export type Item = {
  id: string;
  name: string;
  price: number;
  cost: number;
};

export type Sale = {
  date: string; // ISO string
  items: Item[];
  total: number;
  payment: number;
  change: number;
};
