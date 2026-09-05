import React from 'react';
import { CheckCircle2, XCircle, ShieldAlert, Sparkles, CreditCard } from 'lucide-react';

export default function DemoPaymentModal({ 
  isOpen, 
  onClose, 
  orderId, 
  amount = 0, 
  onSimulateSuccess, 
  onSimulateFailure 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            DEMO PAYMENT MODE
          </div>
          <span className="text-xs text-slate-400 font-mono">{orderId || 'ORDER-DEMO'}</span>
        </div>

        {/* Content */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
            <CreditCard className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">Razorpay Test Gateway</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Select a payment outcome below to demonstrate ShopPilot's end-to-end agentic payment workflow and failure recovery.
          </p>
          <div className="pt-2">
            <span className="text-2xl font-extrabold text-slate-900">₹{amount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Interactive Simulation Buttons */}
        <div className="space-y-3">
          <button
            onClick={onSimulateSuccess}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all group"
          >
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-200 group-hover:scale-110 transition-transform" />
            <span>Simulate Successful Payment</span>
          </button>

          <button
            onClick={onSimulateFailure}
            className="w-full py-3.5 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-sm flex items-center justify-center gap-2 transition-all group"
          >
            <XCircle className="w-4.5 h-4.5 text-rose-500 group-hover:scale-110 transition-transform" />
            <span>Simulate Failed Payment</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400 text-center mt-4">
          Note: Real Razorpay Test Mode automatically activates when RAZORPAY_KEY_ID is configured in .env.
        </p>

      </div>
    </div>
  );
}
