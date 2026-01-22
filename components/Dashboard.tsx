
import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, PackageCheck, AlertCircle, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SALES_CHART_DATA } from '../constants';
import { Product, AIInsight } from '../types';
import { getInventoryInsights } from '../services/geminiService';

interface DashboardProps {
  products: Product[];
}

const Dashboard: React.FC<DashboardProps> = ({ products }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoadingInsights(true);
      const res = await getInventoryInsights(products);
      setInsights(res);
      setLoadingInsights(false);
    };
    fetchInsights();
  }, [products]);

  const stats = [
    { label: 'Total Revenue', value: '$24,592.00', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Total Orders', value: '142', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'In Stock', value: products.length.toString(), icon: PackageCheck, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Low Stock Alerts', value: products.filter(p => p.stock < 5).length.toString(), icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Welcome back, Admin</h2>
        <p className="text-slate-400">Here's what's happening at Vintner & Spirit today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-6">Revenue Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_CHART_DATA}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#d97706' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#d97706" fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-amber-500" size={20} />
            <h3 className="text-lg font-semibold text-white">Gemini Smart Insights</h3>
          </div>

          <div className="space-y-4">
            {loadingInsights ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                <p className="text-slate-400 text-sm">Consulting the sommelier...</p>
              </div>
            ) : (
              insights.map((insight, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-800/50 hover:bg-slate-800 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                      insight.type === 'alert' ? 'bg-red-500' : 
                      insight.type === 'recommendation' ? 'bg-emerald-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <h4 className="font-semibold text-sm text-white mb-1">{insight.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
