import React from 'react';
import { Sparkles, ShieldCheck, Lock, Heart, ShoppingBag, Bot } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Column 1: ShopPilot */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Sparkles className="w-5 h-5 fill-white/20" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">ShopPilot</span>
                <span className="ml-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">AI</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Turn customer intent into intelligent purchases. ShopPilot AI is an agentic e-commerce engine that understands budget, specs, and preferences in plain text.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Razorpay Test Signature Verified
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider text-xs">Shop Categories</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('ai-shopping')} className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                  <span>✨ AI Shopping Discovery</span>
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('home'); setTimeout(() => { document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' }); }, 50); }} className="hover:text-indigo-400 transition-colors">
                  💻 Laptops & Workstations
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('home'); setTimeout(() => { document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' }); }, 50); }} className="hover:text-indigo-400 transition-colors">
                  📱 Smartphones & 5G Devices
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('home'); setTimeout(() => { document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' }); }, 50); }} className="hover:text-indigo-400 transition-colors">
                  🎧 Audio & Noise-Canceling
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('home'); setTimeout(() => { document.getElementById('deals-section')?.scrollIntoView({ behavior: 'smooth' }); }, 50); }} className="hover:text-indigo-400 transition-colors text-rose-400 font-medium">
                  🔥 Smart Tech Deals (Up to 40% OFF)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider text-xs">Customer Service</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('cart')} className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>View Shopping Cart</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('orders')} className="hover:text-indigo-400 transition-colors">
                  Track Orders & History
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('how-it-works')} className="hover:text-indigo-400 transition-colors">
                  How ShopPilot AI Works
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('merchant-growth')} className="hover:text-indigo-400 transition-colors">
                  Merchant Growth Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider text-xs">Trust & Safety</h4>
            <div className="space-y-3">
              <p className="text-xs text-slate-400 leading-relaxed">
                Track 1: AI Growth & Agentic Commerce Hackathon Submission.
              </p>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={() => setActiveTab('audit-trail')} className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Transparent Audit Trail</span>
                  </button>
                </li>
              </ul>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 text-white font-semibold">
                  <Lock className="w-3.5 h-3.5 text-indigo-400" /> Bounded Action Gate
                </div>
                <p className="text-[11px] text-slate-400">Transaction cap enforced at ₹1,00,000 for safe automated agent execution.</p>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© 2026 ShopPilot AI. All rights reserved. Built for Razorpay AI Builder Internship.</p>
          <div className="flex gap-6">
            <button onClick={() => setActiveTab('how-it-works')} className="hover:text-slate-300 transition-colors">How It Works</button>
            <button onClick={() => setActiveTab('audit-trail')} className="hover:text-slate-300 transition-colors">Audit Trail</button>
            <button onClick={() => setActiveTab('merchant-growth')} className="hover:text-slate-300 transition-colors">Merchant Insights</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

