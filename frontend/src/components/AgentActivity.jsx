import React from 'react';
import { Bot, CheckCircle2, Search, Brain, Lightbulb, TrendingUp, Lock, CreditCard, Loader2 } from 'lucide-react';

export default function AgentActivity({ steps = [], currentStepIndex = 4, isComplete = false }) {
  const defaultSteps = [
    { title: "Understanding customer intent", desc: "Extracting budget, category & feature requirements", icon: Bot },
    { title: "Searching catalog", desc: "Analyzing available inventory items", icon: Search },
    { title: "Ranking products", desc: "Computing weighted budget & spec scores", icon: Brain },
    { title: "Identifying relevant add-ons", desc: "Matching complementary accessories & setup packages", icon: TrendingUp },
    { title: "Waiting for customer confirmation", desc: "Enforcing explicit payment confirmation gate", icon: Lock }
  ];

  const activeSteps = steps.length > 0 ? steps : defaultSteps;

  return (
    <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-soft">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Bot className="w-4.5 h-4.5 animate-bounce" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-ping"></span>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">ShopPilot Activity Engine</h4>
            <p className="text-xs text-slate-500">AI decision & action log</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
          AI Agent Active
        </span>
      </div>

      <div className="space-y-3">
        {activeSteps.map((step, idx) => {
          const isDone = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex && !isComplete;

          return (
            <div 
              key={idx} 
              className={`flex items-start gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                isCurrent 
                  ? 'bg-indigo-50/80 border border-indigo-200/80 scale-[1.01]' 
                  : isDone 
                  ? 'bg-slate-50/70 border border-slate-100 opacity-90' 
                  : 'opacity-40 grayscale'
              }`}
            >
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold ${isCurrent ? 'text-indigo-950' : 'text-slate-800'}`}>
                  {step.title}
                </p>
                {step.desc && (
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {step.desc}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
