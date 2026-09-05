import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertTriangle, Check, X, CreditCard, ArrowRight, Loader2 } from 'lucide-react';

export default function ConsentGateModal({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  subtotal = 0, 
  total = 0, 
  onConfirmPayment,
  isProcessing = false
}) {
  const [agreed, setAgreed] = useState(true);
  const MAX_LIMIT = 100000;
  const isOverLimit = total > MAX_LIMIT;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Ready to complete your order?</h3>
              <p className="text-xs text-slate-500">Explicit Agentic Payment Consent Gate</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety Boundary Banner */}
        <div className="mt-4 p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 flex items-start gap-3 text-xs text-slate-700">
          <Lock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-900">ShopPilot Bounded Action Rule</p>
            <p className="mt-0.5 text-slate-600">
              ShopPilot will create a Razorpay test payment order for <span className="font-bold text-slate-900">₹{total.toLocaleString('en-IN')}</span>. The AI never purchases without your explicit consent.
            </p>
          </div>
        </div>

        {/* Over Limit Warning */}
        {isOverLimit && (
          <div className="mt-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Transaction Limit Notice</p>
              <p className="mt-0.5">
                This order exceeds the automated limit of ₹1,00,000. Additional confirmation required.
              </p>
            </div>
          </div>
        )}

        {/* Cart Item Summary */}
        <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Summary</h4>
          {cartItems.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div className="flex items-center gap-3 truncate">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80'; }}
                  className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0" 
                />
                <div className="truncate">
                  <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                  <p className="text-slate-500">Qty: {item.quantity || 1} {item.isUpsell && <span className="text-indigo-600 font-medium ml-1">• AI Add-on</span>}</p>
                </div>
              </div>
              <span className="font-bold text-slate-900 shrink-0">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>

        {/* Total Price Breakdown */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-900 text-white space-y-2">
          <div className="flex justify-between text-xs text-slate-300">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-xs text-emerald-400">
            <span>Razorpay Test Gateway Fee</span>
            <span>FREE (Demo)</span>
          </div>
          <div className="border-t border-slate-800 pt-2 flex justify-between text-base font-extrabold text-white">
            <span>Total Payable</span>
            <span className="text-indigo-300">₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Consent Checkbox */}
        <div className="mt-4 flex items-center gap-2.5 text-xs text-slate-600">
          <input
            type="checkbox"
            id="consent-check"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
          />
          <label htmlFor="consent-check" className="cursor-pointer font-medium text-slate-700 select-none">
            I explicitly authorize ShopPilot AI to initiate this Razorpay payment.
          </label>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-1/2 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={onConfirmPayment}
            disabled={!agreed || isProcessing}
            className="w-1/2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-bold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Confirm & Pay</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
