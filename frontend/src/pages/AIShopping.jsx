import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Sparkles, CheckCircle2, ShoppingBag, Plus, HelpCircle, Loader2, ArrowRight, TrendingUp, Info } from 'lucide-react';
import AgentActivity from '../components/AgentActivity';
import WhyThisProductModal from '../components/WhyThisProductModal';
import UpsellCard from '../components/UpsellCard';
import { api } from '../services/api';
import { PRODUCTS } from '../data/products';
import { generateInstantRecommendation } from '../services/localEngine';

export default function AIShopping({ onAddToCart, initialPrompt = '', openConsentGate }) {
  const defaultInitialPrompt = initialPrompt || "I need a laptop for coding under ₹60,000";
  const [inputPrompt, setInputPrompt] = useState(defaultInitialPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [activityStep, setActivityStep] = useState(4);
  const [catalog, setCatalog] = useState(PRODUCTS);

  // ⚡ Pre-compute instant recommendation so initial page load has zero blank state
  const [currentResult, setCurrentResult] = useState(() => generateInstantRecommendation(defaultInitialPrompt, PRODUCTS));
  const [chatHistory, setChatHistory] = useState(() => [
    {
      role: 'assistant',
      content: generateInstantRecommendation(defaultInitialPrompt, PRODUCTS).message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [selectedWhyProduct, setSelectedWhyProduct] = useState(null);
  const [addedUpsellIds, setAddedUpsellIds] = useState([]);
  const [paymentConfig, setPaymentConfig] = useState({ isRazorpayConfigured: false });

  const hasInitializedRef = useRef(false);

  const quickPrompts = [
    "I need a laptop for coding under ₹60,000",
    "Find a smartphone under ₹30,000 with a great camera",
    "Build me a college setup under ₹10,000",
    "Find headphones for studying under ₹5,000"
  ];

  // Eagerly fetch latest catalog & payment config in background
  useEffect(() => {
    api.getPaymentConfig()
      .then(res => { if (res) setPaymentConfig(res); })
      .catch(() => {});

    api.getProducts()
      .then(res => {
        const all = Array.isArray(res) ? res : (res?.products || []);
        if (all.length > 0) setCatalog(all);
      })
      .catch(() => {});
  }, []);

  // Process initial prompt safely once
  useEffect(() => {
    if (!hasInitializedRef.current && initialPrompt && initialPrompt !== defaultInitialPrompt) {
      hasInitializedRef.current = true;
      handleSendPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendPrompt = async (promptToUse) => {
    const text = (promptToUse !== undefined ? promptToUse : inputPrompt).trim();
    if (!text) return;

    // ⚡ 1. INSTANT LOCAL MATCH (<1ms) - ZERO PERCEIVED LATENCY
    const instantResult = generateInstantRecommendation(text, catalog);
    setCurrentResult(instantResult);

    const userMsg = { role: 'user', content: text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const aiMsg = { 
      role: 'assistant', 
      content: instantResult.message, 
      result: instantResult,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };

    setChatHistory(prev => [...prev, userMsg, aiMsg]);
    setInputPrompt('');

    // Fast-track activity step animation (75ms per step = 300ms total)
    setIsLoading(true);
    setActivityStep(0);
    let step = 0;
    const stepInterval = setInterval(() => {
      step += 1;
      if (step >= 4) {
        setActivityStep(4);
        setIsLoading(false);
        clearInterval(stepInterval);
      } else {
        setActivityStep(step);
      }
    }, 75);

    // ⚡ 2. Async background sync to record audit trail & fetch Gemini enrichment
    try {
      const response = await api.sendAIChat(text);
      if (response && response.success && response.bestMatch) {
        setCurrentResult(response);
      }
    } catch (err) {
      // Already running on verified instant recommendation, continue seamlessly
    }
  };

  const product = currentResult?.bestMatch;
  const reasons = currentResult?.reasons || [];
  const upsells = currentResult?.upsells || [];

  const handleAddPrimaryToCart = () => {
    if (product) {
      onAddToCart({ ...product, quantity: 1, isUpsell: false });
    }
  };

  const handleAddUpsellToCart = (upsellItem) => {
    onAddToCart({ ...upsellItem, quantity: 1, isUpsell: true });
    setAddedUpsellIds(prev => [...prev, upsellItem.id]);
  };

  // Cart arithmetic computation for upsell display
  const primaryPrice = product?.price || 0;
  const addedUpsellPrice = upsells
    .filter(u => addedUpsellIds.includes(u.id))
    .reduce((sum, u) => sum + (u.price || 0), 0);
  const potentialUpsellTotal = upsells.reduce((sum, u) => sum + (u.price || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 font-bold">
              <Bot className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Agentic Shopping</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Understands intent, scores catalog inventory, and optimizes cross-sell setup packages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {paymentConfig?.isRazorpayConfigured ? (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● Razorpay Test Mode Ready
            </span>
          ) : (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              ● Demo Payment Mode
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Left Conversation Stream, Right Recommendation Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Chat Conversation Stream */}
        <div className="lg:col-span-5 flex flex-col h-[650px] bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          
          {/* Conversation Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="font-extrabold text-xs text-slate-800">ShopPilot Assistant</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Gemini-2.5 Flash / Engine</span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                    <Bot className="w-4.5 h-4.5" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium rounded-tr-none shadow-sm'
                    : 'bg-slate-100 text-slate-800 border border-slate-200/60 rounded-tl-none'
                }`}>
                  <p>{msg.content}</p>
                  <span className={`text-[10px] block mt-1.5 ${msg.role === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>ShopPilot is processing catalog & scoring matches...</span>
              </div>
            )}
          </div>

          {/* Quick Example Prompts */}
          <div className="p-3 bg-slate-50 border-t border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Example Quick Prompts</p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(qp)}
                  className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-700 transition-colors shadow-2xs"
                >
                  "{qp}"
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendPrompt(); }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="What are you looking for? (e.g. laptop under ₹60k)"
              className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Right Column: AI Recommendations & Upsell Engine */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Agent Activity Progress Indicator */}
          <AgentActivity 
            steps={currentResult?.processSteps}
            currentStepIndex={activityStep} 
            isComplete={!isLoading} 
          />

          {/* Primary Recommended Product Card — renders as soon as any product is available */}
          {product && (
            <div className="bg-white rounded-3xl p-6 border border-indigo-200 shadow-soft hover:shadow-soft-hover transition-all relative overflow-hidden space-y-4">

              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-extrabold shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 fill-white/20" />
                  {currentResult?.bestMatch ? 'AI Pick · Best match for you' : 'Best match for you'}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  Stock: {product.stock ?? '—'} left
                </span>
              </div>

              {/* Product Info Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                <div className="sm:col-span-5 relative group">
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80'}
                    alt={product.name || 'Product'}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80'; }}
                    className="w-full h-48 rounded-2xl object-cover border border-slate-100 shadow-xs group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-lg text-xs font-bold text-slate-900 border border-slate-200">
                    ★ {product.rating ?? 'N/A'}
                  </div>
                  {product.originalPrice && product.price && product.originalPrice > product.price && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-lg shadow-sm">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>

                <div className="sm:col-span-7 space-y-3">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{product.category || 'Product'}</span>
                    <h3 className="text-xl font-extrabold text-slate-900 leading-tight">{product.name || 'Recommended Product'}</h3>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900">
                      ₹{product.price != null ? product.price.toLocaleString('en-IN') : '—'}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs font-medium text-slate-400 line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Key Feature Spec Pills */}
                  {Array.isArray(product.features) && product.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {product.features.map((feat, idx) => (
                        <span key={idx} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60">
                          {feat}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handleAddPrimaryToCart}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>

                    <button
                      onClick={() => setSelectedWhyProduct(product)}
                      className="py-3 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs sm:text-sm border border-indigo-200/80 flex items-center gap-1.5 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-indigo-600" />
                      <span>Why this product?</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Smart Upsell / Cross-sell Section */}
          {upsells.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-violet-600" />
                    <h4 className="font-extrabold text-slate-900 text-lg">Complete your setup?</h4>
                  </div>
                  <p className="text-xs text-slate-500">ShopPilot AI cross-sell suggestions based on complementary usage patterns.</p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                    +₹{potentialUpsellTotal.toLocaleString('en-IN')} Add-on Potential
                  </span>
                </div>
              </div>

              {/* Upsell Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upsells.map((upsellItem) => (
                  <UpsellCard
                    key={upsellItem.id}
                    product={upsellItem}
                    onAdd={handleAddUpsellToCart}
                    isAdded={addedUpsellIds.includes(upsellItem.id)}
                  />
                ))}
              </div>

              {/* Real-time Side-by-Side Cart Math Calculation */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="space-y-0.5 text-center sm:text-left text-xs">
                  <p className="text-slate-400 font-medium">Cart Arithmetic Summary</p>
                  <p className="text-sm font-bold text-slate-200">
                    Original: <span className="text-white font-extrabold">₹{primaryPrice.toLocaleString('en-IN')}</span>
                    {addedUpsellPrice > 0 && (
                      <> + Added Upsell: <span className="text-violet-300 font-extrabold">₹{addedUpsellPrice.toLocaleString('en-IN')}</span></>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">New Cart Value</p>
                    <p className="text-xl font-extrabold text-indigo-300">
                      ₹{(primaryPrice + addedUpsellPrice).toLocaleString('en-IN')}
                    </p>
                  </div>
                  
                  <button
                    onClick={openConsentGate}
                    className="py-2.5 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <span>Checkout Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Why This Product Modal */}
      <WhyThisProductModal
        isOpen={Boolean(selectedWhyProduct)}
        onClose={() => setSelectedWhyProduct(null)}
        product={selectedWhyProduct}
        reasons={reasons}
      />

    </div>
  );
}
