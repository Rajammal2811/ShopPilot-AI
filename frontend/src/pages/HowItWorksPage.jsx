import React from 'react';
import { Bot, Lightbulb, TrendingUp, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function HowItWorksPage({ setActiveTab }) {
  const steps = [
    {
      num: "01",
      title: "Understand Intent",
      icon: Bot,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      desc: "ShopPilot extracts natural-language shopping requirements like budget limits, technical specs, user roles (e.g. coding, study), and rating preferences."
    },
    {
      num: "02",
      title: "Recommend & Explain",
      icon: Lightbulb,
      color: "from-indigo-600 to-violet-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100",
      desc: "Products are scored across catalog inventory. ShopPilot presents the best match with explicit 'Why this product?' transparency."
    },
    {
      num: "03",
      title: "Intelligent Growth",
      icon: TrendingUp,
      color: "from-violet-600 to-purple-600",
      bgColor: "bg-violet-50",
      borderColor: "border-violet-100",
      desc: "Automatically identifies complementary add-ons and setup bundles, presenting clear basket arithmetic to increase merchant revenue."
    },
    {
      num: "04",
      title: "Safe Transaction",
      icon: ShieldCheck,
      color: "from-emerald-600 to-teal-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      desc: "Requires explicit user payment confirmation, enforces ₹1,00,000 transaction guardrails, and safely executes Razorpay payment verification."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> Agentic Commerce Flow
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">How ShopPilot AI Works</h1>
        <p className="text-lg text-slate-600">
          Four automated steps bridging human customer intent to verified Razorpay commerce.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div 
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-soft-hover transition-all relative flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-2xl font-black bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                    {step.num}
                  </span>
                  <div className={`w-12 h-12 rounded-2xl ${step.bgColor} ${step.borderColor} border flex items-center justify-center text-slate-900 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>

                <h3 className="font-extrabold text-xl text-slate-900 mb-2">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Step {idx + 1} of 4</span>
                {idx < 3 && <ArrowRight className="w-4 h-4 text-slate-300 hidden lg:block" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Card */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight">Experience Agentic Commerce Live</h2>
          <p className="text-indigo-200 text-sm leading-relaxed">
            Test ShopPilot AI with any shopping requirement and experience the full recommendation, upsell, and payment consent flow.
          </p>
          <button
            onClick={() => setActiveTab('ai-shopping')}
            className="px-8 py-4 rounded-full bg-white text-indigo-900 font-extrabold text-sm hover:bg-indigo-50 shadow-lg inline-flex items-center gap-2 transition-all hover:scale-105"
          >
            <span>Start AI Shopping Demo</span>
            <ArrowRight className="w-4 h-4 text-indigo-700" />
          </button>
        </div>
      </div>

    </div>
  );
}
