import React from 'react';
import { Sparkles, CheckCircle2, X } from 'lucide-react';

export default function WhyThisProductModal({ isOpen, onClose, product, reasons = [] }) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Why ShopPilot Picked This</h3>
              <p className="text-xs text-slate-500">AI Scoring & Intent Match Breakdown</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Preview */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 mb-4">
          <img 
            src={product.image} 
            alt={product.name} 
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80'; }}
            className="w-12 h-12 rounded-xl object-cover border border-slate-200" 
          />
          <div>
            <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{product.name}</h4>
            <p className="text-xs font-semibold text-indigo-600">₹{product.price?.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Reasons List */}
        <div className="space-y-2.5">
          {reasons.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100/60 text-xs font-medium text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{reason}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
        >
          Got it
        </button>

      </div>
    </div>
  );
}
