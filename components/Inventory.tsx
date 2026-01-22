
import React from 'react';
import { Product, Category } from '../types';
import { Plus, MoreVertical, Edit2, Trash2, ArrowUpDown } from 'lucide-react';

interface InventoryProps {
  products: Product[];
}

const Inventory: React.FC<InventoryProps> = ({ products }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Inventory Management</h2>
          <p className="text-slate-400">Total {products.length} active products in stock.</p>
        </div>
        <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-amber-900/20">
          <Plus size={20} />
          Add New Product
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-800">
                <th className="px-6 py-4 text-slate-400 font-medium text-sm">Product Details</th>
                <th className="px-6 py-4 text-slate-400 font-medium text-sm">SKU</th>
                <th className="px-6 py-4 text-slate-400 font-medium text-sm">Category</th>
                <th className="px-6 py-4 text-slate-400 font-medium text-sm">Price</th>
                <th className="px-6 py-4 text-slate-400 font-medium text-sm">Stock</th>
                <th className="px-6 py-4 text-slate-400 font-medium text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{product.name}</p>
                        <p className="text-slate-500 text-xs truncate max-w-[200px]">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-400 text-xs font-mono">{product.sku}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-medium border border-slate-700">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-bold">${product.price.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="text-slate-300 text-sm font-medium">{product.stock} units</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
