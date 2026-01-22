
import React, { useState } from 'react';
import { Search, ShoppingCart, Trash2, CreditCard, Sparkles, Send } from 'lucide-react';
import { Product, SaleItem, Category } from '../types';
import { getSmartRecommendation } from '../services/geminiService';

interface POSProps {
  products: Product[];
  onCompleteSale: (items: SaleItem[]) => void;
}

const POS: React.FC<POSProps> = ({ products, onCompleteSale }) => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [recommendationQuery, setRecommendationQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRecommend = async () => {
    if (!recommendationQuery) return;
    setLoadingAi(true);
    const res = await getSmartRecommendation(recommendationQuery, products);
    setAiResponse(res);
    setLoadingAi(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-120px)]">
      {/* Product Selection */}
      <div className="lg:col-span-2 flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search products or SKU..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
            {['All', ...Object.values(Category)].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all ${
                  activeCategory === cat ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2">
          {filteredProducts.map(product => (
            <div 
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 cursor-pointer hover:border-amber-500/50 hover:bg-slate-800/50 transition-all group"
            >
              <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-slate-800">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h4 className="text-white font-medium text-sm line-clamp-1">{product.name}</h4>
              <p className="text-slate-500 text-xs mb-2">{product.category}</p>
              <div className="flex justify-between items-center">
                <span className="text-amber-500 font-bold">${product.price.toFixed(2)}</span>
                <span className={`text-[10px] px-2 py-1 rounded-full ${product.stock > 10 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                  {product.stock} in stock
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* AI Concierge */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-auto">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-amber-500" size={20} />
            <h3 className="text-lg font-semibold text-white">AI Sommelier Concierge</h3>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="E.g., 'Looking for a smooth peat-heavy scotch under $100'"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              value={recommendationQuery}
              onChange={(e) => setRecommendationQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRecommend()}
            />
            <button 
              onClick={handleRecommend}
              disabled={loadingAi}
              className="bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-xl disabled:opacity-50 transition-all"
            >
              <Send size={20} />
            </button>
          </div>
          {aiResponse && (
            <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 animate-in slide-in-from-top-2">
              <p className="text-sm text-slate-300 leading-relaxed italic">"{aiResponse}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-amber-500" size={20} />
            <h3 className="text-lg font-semibold text-white">Current Cart</h3>
          </div>
          <span className="bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-xs font-bold">
            {cart.reduce((s, i) => s + i.quantity, 0)} items
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
              <ShoppingCart size={48} className="opacity-20" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center gap-4 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white text-sm font-medium line-clamp-1">{item.name}</h4>
                  <p className="text-amber-500 text-xs font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-slate-700 rounded">-</button>
                  <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-slate-700 rounded">+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-slate-500 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-slate-800/50 border-t border-slate-800 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-slate-400 text-sm">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-sm">
              <span>Tax (8%)</span>
              <span>${(total * 0.08).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white text-xl font-bold pt-2 border-t border-slate-700">
              <span>Total</span>
              <span className="text-amber-500">${(total * 1.08).toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            disabled={cart.length === 0}
            onClick={() => {
              onCompleteSale(cart);
              setCart([]);
            }}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 transition-all disabled:opacity-50 disabled:grayscale"
          >
            <CreditCard size={20} />
            Complete Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;
