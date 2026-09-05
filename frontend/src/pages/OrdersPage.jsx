import React, { useState, useEffect } from 'react';
import { Package, Sparkles, CheckCircle2, Clock, ShieldCheck, ChevronRight, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

export default function OrdersPage({ setActiveTab }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.getOrders();
      if (res && res.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <button
          onClick={() => setSelectedOrder(null)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 px-3 py-1.5 rounded-full transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </button>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">Order {selectedOrder.id || selectedOrder.orderId}</h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                  {selectedOrder.status || 'PAID'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
            </div>

            {selectedOrder.aiAssisted !== false && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Assisted Purchase
              </span>
            )}
          </div>

          {/* Purchased Items */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Items Ordered</h3>
            {selectedOrder.items?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80'; }}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200" 
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500">Qty: {item.quantity || 1} {item.isUpsell && <span className="text-violet-600 font-semibold">• AI Cross-sell</span>}</p>
                  </div>
                </div>
                <span className="font-extrabold text-sm text-slate-900">
                  ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Payment Proof Details */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Payment ID</span>
              <span className="font-mono text-indigo-300">{selectedOrder.paymentId || 'pay_demo_verified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Gateway Mode</span>
              <span>{selectedOrder.mode || 'Razorpay Test Gate'}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold border-t border-slate-800 pt-2">
              <span>Total Paid</span>
              <span className="text-indigo-400">₹{selectedOrder.amount?.toLocaleString('en-IN')}</span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Order History</h1>
          <p className="text-sm text-slate-500 mt-1">Track past transactions and agentic commerce audit trails.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-slate-500 mt-3">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-lg">No orders found</h3>
          <p className="text-xs text-slate-500">Complete an AI shopping checkout to record your first order!</p>
          <button
            onClick={() => setActiveTab('ai-shopping')}
            className="px-6 py-2.5 rounded-full bg-indigo-600 text-white font-bold text-xs"
          >
            Start AI Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedOrder(order)}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft hover:shadow-soft-hover transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-slate-900">{order.id || order.orderId}</h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      {order.status || 'PAID'}
                    </span>
                    {order.aiAssisted !== false && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                        ✦ AI Assisted
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {order.items?.length || 1} item(s) • {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-lg font-extrabold text-slate-900">
                  ₹{order.amount?.toLocaleString('en-IN')}
                </span>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
