
import { Category, Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Macallan 12 Year Old Double Cask',
    category: Category.WHISKEY,
    price: 85.99,
    stock: 12,
    sku: 'WH-MAC-12',
    description: 'A rich and complex highland single malt scotch whiskey.',
    image: 'https://picsum.photos/seed/whiskey1/400/400'
  },
  {
    id: '2',
    name: 'Grey Goose Original Vodka',
    category: Category.VODKA,
    price: 34.50,
    stock: 24,
    sku: 'VO-GRY-ORG',
    description: 'Premium French vodka made from winter wheat and natural spring water.',
    image: 'https://picsum.photos/seed/vodka1/400/400'
  },
  {
    id: '3',
    name: 'Veuve Clicquot Yellow Label',
    category: Category.WINE,
    price: 59.99,
    stock: 8,
    sku: 'WI-VEU-YEL',
    description: 'Classic non-vintage champagne known for its strength and silkiness.',
    image: 'https://picsum.photos/seed/wine1/400/400'
  },
  {
    id: '4',
    name: 'Don Julio 1942 Añejo',
    category: Category.TEQUILA,
    price: 189.00,
    stock: 4,
    sku: 'TE-DON-42',
    description: 'An ultra-premium tequila aged for at least two and a half years.',
    image: 'https://picsum.photos/seed/tequila1/400/400'
  },
  {
    id: '5',
    name: 'Hendricks Gin',
    category: Category.GIN,
    price: 39.99,
    stock: 15,
    sku: 'GI-HEN-DR',
    description: 'Distilled in Scotland with infusions of cucumber and rose petals.',
    image: 'https://picsum.photos/seed/gin1/400/400'
  },
  {
    id: '6',
    name: 'Lagavulin 16 Year Old',
    category: Category.WHISKEY,
    price: 110.00,
    stock: 6,
    sku: 'WH-LAG-16',
    description: 'The definitive Islay malt—intense, smoky, and rich.',
    image: 'https://picsum.photos/seed/whiskey2/400/400'
  },
  {
    id: '7',
    name: 'Château Margaux 2018',
    category: Category.WINE,
    price: 850.00,
    stock: 2,
    sku: 'WI-MAR-18',
    description: 'One of the most prestigious wines in the world from the Bordeaux region.',
    image: 'https://picsum.photos/seed/wine2/400/400'
  }
];

export const SALES_CHART_DATA = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];
