
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import POS from './components/POS';
import Inventory from './components/Inventory';
import { INITIAL_PRODUCTS } from './constants';
import { Product, SaleItem, Sale } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>([]);

  const handleCompleteSale = (items: SaleItem[]) => {
    // Update stock levels
    setProducts(prev => prev.map(p => {
      const sold = items.find(item => item.id === p.id);
      if (sold) {
        return { ...p, stock: Math.max(0, p.stock - sold.quantity) };
      }
      return p;
    }));

    // Record sale
    const newSale: Sale = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      items: [...items],
      total: items.reduce((sum, i) => sum + (i.price * i.quantity), 0) * 1.08
    };
    setSales(prev => [newSale, ...prev]);
    
    // Auto-navigate to dashboard or show success notification (simplified for now)
    alert("Transaction completed successfully!");
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard products={products} />;
      case 'pos':
        return <POS products={products} onCompleteSale={handleCompleteSale} />;
      case 'inventory':
        return <Inventory products={products} />;
      case 'history':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-2">Sales History</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              {sales.length === 0 ? (
                <p className="text-slate-500 text-center py-12">No sales recorded today.</p>
              ) : (
                <div className="space-y-4">
                  {sales.map(sale => (
                    <div key={sale.id} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-800">
                      <div>
                        <p className="text-white font-medium">Order #{sale.id.toUpperCase()}</p>
                        <p className="text-slate-500 text-sm">{new Date(sale.timestamp).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-amber-500 font-bold">${sale.total.toFixed(2)}</p>
                        <p className="text-slate-400 text-xs">{sale.items.length} items</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      default:
        return <Dashboard products={products} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="pl-64 min-h-screen">
        <div className="max-w-[1400px] mx-auto p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
