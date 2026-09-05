import React from 'react';
import { Plus, Check, TrendingUp } from 'lucide-react';

export default function UpsellCard({ product, onAdd, isAdded = false }) {
  if (!product) return null;

  return (
    <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-soft hover:shadow-soft-hover transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Header Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700">
            <TrendingUp className="w-3 h-3" />
            Recommended Add-on
          </span>
          <span className="text-xs font-semibold text-slate-400">★ {product.rating || 4.5}</span>
        </div>

        {/* Image & Title */}
        <div className="flex items-center gap-3 mb-3">
          <img 
            src={product.image} 
            alt={product.name} 
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80'; }}
            className="w-14 h-14 rounded-xl object-cover border border-slate-100 group-hover:scale-105 transition-transform duration-200 shrink-0" 
          />
          <div>
            <h5 className="font-bold text-sm text-slate-900 line-clamp-1">{product.name}</h5>
            <p className="font-extrabold text-sm text-indigo-600 mt-0.5">
              +₹{product.price?.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* AI Reason */}
        <p className="text-xs text-slate-500 leading-relaxed mb-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
          💡 {product.reason || "Frequently paired with this item to complete your setup."}
        </p>
      </div>

      {/* Quick Add Button */}
      <button
        onClick={() => onAdd(product)}
        disabled={isAdded}
        className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
          isAdded
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
            : 'bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-200 hover:border-transparent shadow-xs'
        }`}
      >
        {isAdded ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Added to Cart</span>
          </>
        ) : (
          <>
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add to Setup</span>
          </>
        )}
      </button>
    </div>
  );
}
