import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight, TrendingUp } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  onUpdateQty, 
  onRemoveItem, 
  onCheckoutClick,
  suggestedUpsells = [],
  onAddUpsell
}) {
  if (!isOpen) return null;

  const mainItems = cartItems.filter(i => !i.isUpsell);
  const upsellItems = cartItems.filter(i => i.isUpsell);

  const mainSubtotal = mainItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const upsellSubtotal = upsellItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const total = mainSubtotal + upsellSubtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="pointer-events-auto w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Your AI Shopping Cart</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                {cartItems.length} items
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">Your cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Ask ShopPilot AI to find products, or add items from the recommendation engine!
                </p>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-3">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80'; }}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{item.name}</h4>
                          <button 
                            onClick={() => onRemoveItem(item.id)}
                            className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="font-extrabold text-xs text-indigo-600 mt-0.5">
                          ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          {item.isUpsell && (
                            <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">
                              + AI Add-on
                            </span>
                          )}
                          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-1.5 py-0.5 ml-auto">
                            <button 
                              onClick={() => onUpdateQty(item.id, (item.quantity || 1) - 1)}
                              className="text-slate-500 hover:text-slate-900"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold px-1">{item.quantity || 1}</span>
                            <button 
                              onClick={() => onUpdateQty(item.id, (item.quantity || 1) + 1)}
                              className="text-slate-500 hover:text-slate-900"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>

                {/* Upsell Revenue Impact Banner */}
                {upsellSubtotal > 0 && (
                  <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-700">
                      <TrendingUp className="w-4 h-4" />
                      Smart Bundle Growth
                    </div>
                    <p className="text-slate-600">
                      ShopPilot identified <span className="font-bold text-indigo-700">₹{upsellSubtotal.toLocaleString('en-IN')}</span> in high-value add-ons.
                    </p>
                  </div>
                )}
              </>
            )}

          </div>

          {/* Footer Summary & CTA */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Original Cart</span>
                  <span>₹{mainSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {upsellSubtotal > 0 && (
                  <div className="flex justify-between text-violet-600 font-semibold">
                    <span>Added Upsell Value</span>
                    <span>+₹{upsellSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>New Cart Total</span>
                  <span className="text-indigo-600">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={onCheckoutClick}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <span>Continue to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Protected by Razorpay Test Gate & Max Limit Rule</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
