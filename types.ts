
export enum Category {
  WHISKEY = 'Whiskey',
  WINE = 'Wine',
  BEER = 'Beer',
  VODKA = 'Vodka',
  TEQUILA = 'Tequila',
  GIN = 'Gin',
  OTHER = 'Other'
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  description: string;
  image: string;
  sku: string;
}

export interface SaleItem extends Product {
  quantity: number;
}

export interface Sale {
  id: string;
  timestamp: number;
  items: SaleItem[];
  total: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  lowStockCount: number;
  topCategory: Category;
}

export interface AIInsight {
  title: string;
  description: string;
  type: 'recommendation' | 'alert' | 'opportunity';
}
