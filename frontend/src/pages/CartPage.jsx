import React from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, TrendingUp, Sparkles } from 'lucide-react';

export default function CartPage({ 
  cartItems = [], 
  onUpdateQty, 
  onRemoveItem, 
  onCheckoutClick,
  setActiveTab
}) {
  const mainItems = cartItems.filter(i => !i.isUpsell);
  const upsellItems = cartItems.filter(i => i.isUpsell);

  const mainSubtotal = mainItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const upsellSubtotal = upsellItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const total = mainSubtotal + upsellSubtotal;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Let ShopPilot AI find the perfect product for your budget and requirements!
        </p>
        <button
          onClick={() => setActiveTab('ai-shopping')}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 inline-flex items-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Start AI Shopping</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shopping Cart</h1>
        <p className="text-sm text-slate-500 mt-1">Review your AI-assisted items before explicit payment consent.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft flex flex-col sm:flex-row items-center gap-5 justify-between">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80'; }}
                  className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shrink-0" 
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-slate-900">{item.name}</h3>
                    {item.isUpsell && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-100 text-violet-700">
                        + AI Add-on
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{item.category}</p>
                  <p className="font-extrabold text-indigo-600 text-sm mt-1">
                    ₹{item.price?.toLocaleString('en-IN')} each
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1 border border-slate-200">
                  <button 
                    onClick={() => onUpdateQty(item.id, (item.quantity || 1) - 1)}
                    className="p-1 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold px-2">{item.quantity || 1}</span>
                  <button 
                    onClick={() => onUpdateQty(item.id, (item.quantity || 1) + 1)}
                    className="p-1 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <span className="font-extrabold text-slate-900 text-base">
                  ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                </span>

                <button 
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-5">
          <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-3">Order Breakdown</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Main Recommended Product</span>
              <span className="font-semibold text-slate-900">₹{mainSubtotal.toLocaleString('en-IN')}</span>
            </div>

            {upsellSubtotal > 0 && (
              <div className="flex justify-between text-violet-700 font-semibold bg-violet-50 p-2.5 rounded-xl border border-violet-100">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> Added Upsell Total
                </span>
                <span>+₹{upsellSubtotal.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Estimated Delivery</span>
              <span className="text-emerald-600 font-semibold">FREE Express</span>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between text-xl font-extrabold text-slate-900">
              <span>Total Payable</span>
              <span className="text-indigo-600">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={onCheckoutClick}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-base shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95"
          >
            <span>Continue to Secure Checkout</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Explicit Consent Gate & Razorpay Signature Guarded</span>
          </div>

        </div>

      </div>
    </div>
  );
}
