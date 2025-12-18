export interface MarketProduct {
  id: string;
  name: string;
  category: string;
  prices: {
    bim: number;
    a101: number;
    sok: number;
    migros: number;
    carrefour: number;
  };
  lastUpdated: string;
}

export const products: MarketProduct[] = [
  {
    id: "yogurt-2kg",
    name: "Tam Yağlı Yoğurt 2kg",
    category: "Süt Ürünleri",
    prices: { bim: 62.50, a101: 61.90, sok: 62.00, migros: 74.90, carrefour: 72.50 },
    lastUpdated: "2025-05-20"
  },
  {
    id: "aycicek-yagi-5l",
    name: "Ayçiçek Yağı 5L",
    category: "Temel Gıda",
    prices: { bim: 195.00, a101: 194.50, sok: 195.00, migros: 215.00, carrefour: 210.00 },
    lastUpdated: "2025-05-20"
  }
];