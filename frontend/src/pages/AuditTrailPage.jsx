import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, CheckCircle2, AlertTriangle, Bot, Search, Lightbulb, TrendingUp, Lock, CreditCard, XCircle } from 'lucide-react';
import { api } from '../services/api';

export default function AuditTrailPage() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const res = await api.getAuditLogs();
      if (res && res.logs) {
        setLogs(res.logs);
      }
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'USER_INTENT': return <Bot className="w-4 h-4 text-indigo-600" />;
      case 'PRODUCT_SEARCH': return <Search className="w-4 h-4 text-blue-600" />;
      case 'RECOMMENDATION': return <Lightbulb className="w-4 h-4 text-amber-600" />;
      case 'UPSELL_SUGGESTED': return <TrendingUp className="w-4 h-4 text-violet-600" />;
      case 'USER_CONFIRMATION': return <Lock className="w-4 h-4 text-emerald-600" />;
      case 'PAYMENT_ORDER_CREATED': return <CreditCard className="w-4 h-4 text-indigo-600" />;
      case 'PAYMENT_SUCCESS': return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'PAYMENT_FAILED': return <XCircle className="w-4 h-4 text-rose-600" />;
      case 'SECURITY_GUARDRAIL': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default: return <Clock className="w-4 h-4 text-slate-600" />;
    }
  };

  const getEventBadge = (type) => {
    switch (type) {
      case 'USER_INTENT': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'PRODUCT_SEARCH': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'RECOMMENDATION': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'UPSELL_SUGGESTED': return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'USER_CONFIRMATION': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PAYMENT_ORDER_CREATED': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'PAYMENT_SUCCESS': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'PAYMENT_FAILED': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'SECURITY_GUARDRAIL': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 font-bold">
              <Clock className="w-5 h-5" />
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Audit Trail</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time chronological timeline of AI agent reasoning, search scoring, and payment consent execution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Audit Log
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-slate-500 mt-3">Fetching audit timeline...</p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {logs.map((event, idx) => (
            <div key={idx} className="relative group">
              
              {/* Timeline Dot Icon */}
              <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {getEventIcon(event.type)}
              </div>

              {/* Event Card */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft hover:shadow-soft-hover transition-all space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getEventBadge(event.type)}`}>
                    {event.type}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {new Date(event.timestamp).toLocaleTimeString()} • {new Date(event.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                  {event.description}
                </p>

                {/* Metadata Pill Breakdown */}
                {event.metadata && Object.keys(event.metadata).length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-2">
                    {Object.entries(event.metadata).map(([key, val], mIdx) => (
                      <span key={mIdx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600">
                        <span className="text-slate-400">{key}:</span> {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
