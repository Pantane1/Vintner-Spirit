
import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  LayoutDashboard, Package, ShoppingCart, History, Settings, LogOut, Wine,
  TrendingUp, Users, PackageCheck, AlertCircle, Sparkles, Search, Trash2, 
  CreditCard, Send, Plus, Edit2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { GoogleGenAI, Type } from "@google/genai";

// --- Types ---
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

export interface AIInsight {
  title: string;
  description: string;
  type: 'recommendation' | 'alert' | 'opportunity';
}

// --- Constants ---
const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Macallan 12 Year Old', category: Category.WHISKEY, price: 85.99, stock: 12, sku: 'WH-MAC-12', description: 'Rich single malt scotch.', image: 'https://images.unsplash.com/photo-1527281405159-35d5b9a7fa39?auto=format&fit=crop&q=80&w=400' },
  { id: '2', name: 'Grey Goose Original', category: Category.VODKA, price: 34.50, stock: 24, sku: 'VO-GRY-ORG', description: 'Premium French vodka.', image: 'https://images.unsplash.com/photo-1626262310115-46f7d0843658?auto=format&fit=crop&q=80&w=400' },
  { id: '3', name: 'Veuve Clicquot Yellow', category: Category.WINE, price: 59.99, stock: 8, sku: 'WI-VEU-YEL', description: 'Classic non-vintage champagne.', image: 'https://images.unsplash.com/photo-1594498653385-d5172b532c00?auto=format&fit=crop&q=80&w=400' },
  { id: '4', name: 'Don Julio 1942 Añejo', category: Category.TEQUILA, price: 189.00, stock: 4, sku: 'TE-DON-42', description: 'Ultra-premium tequila.', image: 'https://images.unsplash.com/photo-1516997121675-4c2d04fe1ec1?auto=format&fit=crop&q=80&w=400' },
  { id: '5', name: 'Hendricks Gin', category: Category.GIN, price: 39.99, stock: 15, sku: 'GI-HEN-DR', description: 'Distilled with cucumber and rose.', image: 'https://images.unsplash.com/photo-1563810486665-27a36d6dfc9d?auto=format&fit=crop&q=80&w=400' },
  { id: '6', name: 'Lagavulin 16 Year', category: Category.WHISKEY, price: 110.00, stock: 6, sku: 'WH-LAG-16', description: 'Intense, smoky Islay malt.', image: 'https://images.unsplash.com/photo-1582819509237-45b754223abd?auto=format&fit=crop&q=80&w=400' }
];

const SALES_CHART_DATA = [
  { name: 'Mon', sales: 4000 }, { name: 'Tue', sales: 3000 }, { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 }, { name: 'Fri', sales: 1890 }, { name: 'Sat', sales: 2390 }, { name: 'Sun', sales: 3490 },
];

// --- AI Services ---
const getInventoryInsights = async (products: Product[]): Promise<AIInsight[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const productList = products.map(p => `${p.name} (Stock: ${p.stock}, Price: $${p.price})`).join('\n');
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this inventory and provide 3 actionable business insights in JSON format. Data:\n${productList}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['recommendation', 'alert', 'opportunity'] }
            },
            required: ['title', 'description', 'type']
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    return [{ title: "Stock Alert", description: "Monitor whiskey levels closely this weekend.", type: "alert" }];
  }
};

const getSmartRecommendation = async (query: string, products: Product[]): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const productList = products.map(p => `${p.name} - ${p.description}`).join('\n');
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Customer asks: "${query}". Based on this inventory, recommend 1 bottle. Inventory:\n${productList}`,
    });
    return response.text || "I recommend our Macallan 12 Year Old.";
  } catch (error) {
    return "Check our premium whiskey collection.";
  }
};

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos', label: 'Point of Sale', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'history', label: 'Sales History', icon: History },
  ];
  return (
    <div className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="p-2 bg-amber-600 rounded-lg"><Wine className="text-white w-6 h-6" /></div>
        <h1 className="text-xl font-bold text-white">Vintner & Spirit</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id ? 'bg-amber-600/10 text-amber-500 border border-amber-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-xl"><LogOut size={20} /><span>Logout</span></button>
      </div>
    </div>
  );
};

const Dashboard = ({ products }: { products: Product[] }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInventoryInsights(products).then(res => {
      setInsights(res);
      setLoading(false);
    });
  }, [products]);

  const stats = [
    { label: 'Revenue', value: '$24,592', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Orders', value: '142', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'In Stock', value: products.length, icon: PackageCheck, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Low Stock', value: products.filter(p => p.stock < 5).length, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold text-white">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className={`p-3 rounded-xl w-fit mb-4 ${stat.bg}`}><stat.icon className={stat.color} size={24} /></div>
            <p className="text-slate-400 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[400px]">
          <h3 className="text-lg font-semibold text-white mb-6">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={SALES_CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="sales" stroke="#d97706" fill="#d97706" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6"><Sparkles className="text-amber-500" size={20} /><h3 className="text-lg font-semibold text-white">Smart Insights</h3></div>
          <div className="space-y-4">
            {loading ? <div className="animate-pulse space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-slate-800 rounded-xl" />)}</div> :
              insights.map((ins, i) => (
                <div key={i} className="p-4 bg-slate-800/50 rounded-xl border border-slate-800">
                  <h4 className="font-semibold text-white text-sm mb-1">{ins.title}</h4>
                  <p className="text-xs text-slate-400">{ins.description}</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

const POS = ({ products, onCompleteSale }: { products: Product[], onCompleteSale: (items: SaleItem[]) => void }) => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [recQuery, setRecQuery] = useState('');
  const [aiRes, setAiRes] = useState('');

  const filtered = products.filter(p => (activeCat === 'All' || p.category === activeCat) && p.name.toLowerCase().includes(search.toLowerCase()));
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const addToCart = (p: Product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      return ex ? prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i) : [...prev, { ...p, quantity: 1 }];
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-160px)]">
      <div className="lg:col-span-2 flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input type="text" className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['All', ...Object.values(Category)].map(c => (
              <button key={c} onClick={() => setActiveCat(c)} className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm ${activeCat === c ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400'}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pr-2">
          {filtered.map(p => (
            <div key={p.id} onClick={() => addToCart(p)} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 cursor-pointer hover:border-amber-500/50 transition-all">
              <div className="aspect-square bg-slate-800 rounded-xl overflow-hidden mb-3"><img src={p.image} className="w-full h-full object-cover" /></div>
              <h4 className="text-white text-sm font-medium">{p.name}</h4>
              <p className="text-amber-500 font-bold">${p.price}</p>
            </div>
          ))}
        </div>
        <div className="mt-auto bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 text-white font-semibold"><Sparkles className="text-amber-500" size={18} />AI Sommelier</div>
          <div className="flex gap-2">
            <input type="text" className="flex-1 bg-slate-800 border-none rounded-xl px-4 py-3" placeholder="Tell the sommelier what you need..." value={recQuery} onChange={e => setRecQuery(e.target.value)} />
            <button onClick={() => getSmartRecommendation(recQuery, products).then(setAiRes)} className="bg-amber-600 p-3 rounded-xl"><Send size={20} /></button>
          </div>
          {aiRes && <p className="mt-3 text-sm italic text-slate-400">"{aiRes}"</p>}
        </div>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col p-6">
        <h3 className="text-lg font-bold text-white mb-6">Current Order</h3>
        <div className="flex-1 overflow-y-auto space-y-4">
          {cart.map(i => (
            <div key={i.id} className="flex justify-between items-center text-sm">
              <span className="text-white">{i.name} (x{i.quantity})</span>
              <span className="text-amber-500">${(i.price * i.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <div className="flex justify-between text-xl font-bold text-white"><span>Total</span><span>${(total * 1.08).toFixed(2)}</span></div>
          <button onClick={() => { onCompleteSale(cart); setCart([]); }} className="w-full bg-amber-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2"><CreditCard size={20} /> Checkout</button>
        </div>
      </div>
    </div>
  );
};

const Inventory = ({ products }: { products: Product[] }) => (
  <div className="space-y-6">
    <div className="flex justify-between"><h2 className="text-3xl font-bold text-white">Inventory</h2><button className="bg-amber-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Plus size={20} /> Add Product</button></div>
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-800/50 text-slate-400 text-sm"><tr><th className="p-6">Product</th><th>Category</th><th>Price</th><th>Stock</th><th className="text-right p-6">Actions</th></tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="border-t border-slate-800 text-white">
              <td className="p-6 flex items-center gap-3"><div className="w-10 h-10 rounded bg-slate-800 overflow-hidden"><img src={p.image} className="w-full h-full object-cover" /></div>{p.name}</td>
              <td>{p.category}</td>
              <td>${p.price}</td>
              <td>{p.stock} units</td>
              <td className="p-6 text-right"><button className="text-slate-500 hover:text-white"><Edit2 size={16} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- Main App ---
const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>([]);

  const handleCompleteSale = (items: SaleItem[]) => {
    setProducts(prev => prev.map(p => {
      const sold = items.find(i => i.id === p.id);
      return sold ? { ...p, stock: Math.max(0, p.stock - sold.quantity) } : p;
    }));
    setSales(prev => [{ id: Math.random().toString(36).substr(2, 9), timestamp: Date.now(), items, total: items.reduce((s, i) => s + i.price * i.quantity, 0) * 1.08 }, ...prev]);
    alert("Sale completed!");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 ml-64 p-12 max-w-[1600px]">
        {activeTab === 'dashboard' && <Dashboard products={products} />}
        {activeTab === 'pos' && <POS products={products} onCompleteSale={handleCompleteSale} />}
        {activeTab === 'inventory' && <Inventory products={products} />}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Sales History</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              {sales.length === 0 ? <p className="text-slate-500 text-center py-12">No sales yet.</p> :
                sales.map(s => (
                  <div key={s.id} className="p-4 border-b border-slate-800 flex justify-between">
                    <div><p className="text-white font-bold">Order #{s.id.toUpperCase()}</p><p className="text-slate-500 text-xs">{new Date(s.timestamp).toLocaleString()}</p></div>
                    <div className="text-right text-amber-500 font-bold">${s.total.toFixed(2)}</div>
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><App /></React.StrictMode>);
