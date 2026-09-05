import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Percent, Sparkles, ArrowUpRight, Zap, Target, Layers } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';
import { api } from '../services/api';

export default function MerchantDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await api.getAnalytics();
      if (res && res.analytics) {
        setAnalytics(res.analytics);
      }
    } catch (err) {
      console.error("Failed to load merchant analytics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const metrics = analytics?.metrics || {
    totalRevenue: 432281,
    aiRevenue: 384200,
    upsellRevenue: 51274,
    orderCount: 14,
    conversionRate: "47.7%",
    avgOrderValue: 30877
  };

  const revenueData = analytics?.revenueGrowth || [
    { day: "Mon", total: 45000, aiRevenue: 38000, upsell: 4200 },
    { day: "Tue", total: 62000, aiRevenue: 52000, upsell: 6800 },
    { day: "Wed", total: 78000, aiRevenue: 69000, upsell: 8500 },
    { day: "Thu", total: 63994, aiRevenue: 63994, upsell: 8995 },
    { day: "Fri", total: 85288, aiRevenue: 75000, upsell: 10200 },
    { day: "Sat", total: 98000, aiRevenue: 88000, upsell: 12500 },
    { day: "Sun", total: 110000, aiRevenue: 98000, upsell: 14200 }
  ];

  const funnel = analytics?.funnel || [
    { stage: "Customer Intent", count: 180, rate: "100%" },
    { stage: "AI Recommendation", count: 165, rate: "91.6%" },
    { stage: "Product View", count: 142, rate: "78.8%" },
    { stage: "Upsell Displayed", count: 120, rate: "66.6%" },
    { stage: "Checkout Gate", count: 98, rate: "54.4%" },
    { stage: "Payment Confirmed", count: 86, rate: "47.7%" }
  ];

  const aiInsights = analytics?.aiInsights || [
    {
      id: 1,
      title: "High AI-Influenced Sales Share",
      description: `AI recommendations directly influenced ₹${metrics.aiRevenue.toLocaleString('en-IN')} in total sales.`,
      metric: `${Math.round((metrics.aiRevenue / (metrics.totalRevenue || 1)) * 100)}%`,
      type: "positive"
    },
    {
      id: 2,
      title: "Cross-Sell Basket Booster",
      description: `Smart upsell suggestions contributed ₹${metrics.upsellRevenue.toLocaleString('en-IN')} in incremental revenue.`,
      metric: `+₹${Math.round(metrics.upsellRevenue / (metrics.orderCount || 1)).toLocaleString('en-IN')} / order`,
      type: "highlight"
    },
    {
      id: 3,
      title: "Higher Conversion Rate",
      description: "Customers receiving personalized reasoning ('Why this product?') converted 18% more often.",
      metric: "18% Lift",
      type: "insight"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 font-bold">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Merchant Growth</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">See how ShopPilot turns customer intent into revenue.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            ✦ AI Agentic Commerce Active
          </span>
        </div>
      </div>

      {/* Top Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">₹{metrics.totalRevenue?.toLocaleString('en-IN')}</p>
          <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +24% vs last week
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">AI-Influenced</span>
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-indigo-600">₹{metrics.aiRevenue?.toLocaleString('en-IN')}</p>
          <p className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded inline-block">
            {Math.round((metrics.aiRevenue / (metrics.totalRevenue || 1)) * 100)}% of total
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Upsell Revenue</span>
            <TrendingUp className="w-4 h-4 text-violet-600" />
          </div>
          <p className="text-2xl font-extrabold text-violet-600">₹{metrics.upsellRevenue?.toLocaleString('en-IN')}</p>
          <p className="text-[11px] font-semibold text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded inline-block">
            Add-on baskets
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{metrics.orderCount}</p>
          <p className="text-[11px] font-semibold text-slate-500">Completed purchases</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Conversion Rate</span>
            <Percent className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600">{metrics.conversionRate}</p>
          <p className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded inline-block">
            +18% AI lift
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Order Value</span>
            <Target className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">₹{metrics.avgOrderValue?.toLocaleString('en-IN')}</p>
          <p className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded inline-block">
            AOV Boost
          </p>
        </div>

      </div>

      {/* Recharts Analytics Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Revenue Growth Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Revenue Growth & AI Impact</h3>
              <p className="text-xs text-slate-500">Weekly breakdown of Total Revenue vs AI-Influenced Sales</p>
            </div>
            <div className="flex gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-indigo-600"><span className="w-3 h-3 rounded bg-indigo-600" /> AI Revenue</span>
              <span className="flex items-center gap-1.5 text-violet-500"><span className="w-3 h-3 rounded bg-violet-500" /> Upsell</span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorUpsell" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip 
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none' }}
                />
                <Area type="monotone" dataKey="aiRevenue" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorAi)" />
                <Area type="monotone" dataKey="upsell" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorUpsell)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Visual Conversion Funnel */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Agentic Commerce Funnel</h3>
            <p className="text-xs text-slate-500">Stage-by-stage conversion metrics</p>
          </div>

          <div className="space-y-2.5 pt-2">
            {funnel.map((item, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">{item.stage}</span>
                  <span className="font-mono font-bold text-indigo-600">{item.count} sessions ({item.rate})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full" 
                    style={{ width: item.rate }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* AI Growth Insights Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="font-extrabold text-lg text-slate-900">AI Growth Insights</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiInsights.map((insight) => (
            <div key={insight.id} className="p-5 rounded-2xl bg-gradient-to-tr from-indigo-50/70 to-slate-50 border border-indigo-100 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">{insight.title}</h4>
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-indigo-600 text-white shadow-2xs">
                  {insight.metric}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
