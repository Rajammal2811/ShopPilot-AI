import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, Sparkles, ArrowRight, ShieldCheck, ShoppingBag, RotateCcw } from 'lucide-react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ConsentGateModal from './components/ConsentGateModal';
import DemoPaymentModal from './components/DemoPaymentModal';

import Home from './pages/Home';
import AIShopping from './pages/AIShopping';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import MerchantDashboard from './pages/MerchantDashboard';
import AuditTrailPage from './pages/AuditTrailPage';
import HowItWorksPage from './pages/HowItWorksPage';

import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [cartItems, setCartItems] = useState([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [initialShoppingPrompt, setInitialShoppingPrompt] = useState('');
  
  // Payment Modals & State
  const [isConsentGateOpen, setIsConsentGateOpen] = useState(false);
  const [isDemoPaymentOpen, setIsDemoPaymentOpen] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  
  const [activeOrderData, setActiveOrderData] = useState(null);
  const [paymentSuccessState, setPaymentSuccessState] = useState(null);
  const [paymentFailureState, setPaymentFailureState] = useState(null);

  // Cart helper functions
  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.id === product.id && item.isUpsell === product.isUpsell);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity = (updated[existingIdx].quantity || 1) + (product.quantity || 1);
        return updated;
      } else {
        return [...prev, { ...product, quantity: product.quantity || 1 }];
      }
    });
    setIsCartDrawerOpen(true);
  };

  const handleUpdateQty = (itemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
    } else {
      setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQty } : item));
    }
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const calculateSubtotal = () => cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  // Trigger Consent Gate Checkout
  const handleOpenCheckout = () => {
    setIsCartDrawerOpen(false);
    setIsConsentGateOpen(true);
  };

  // Step 1: User confirms consent in ConsentGateModal
  const handleConfirmConsent = async () => {
    setIsPaymentProcessing(true);
    try {
      const res = await api.createPaymentOrder(cartItems, { name: "Demo User", email: "user@shoppilot.ai" });
      
      if (res && res.success) {
        setActiveOrderData(res);
        setIsConsentGateOpen(false);

        // Check if Razorpay Test mode is available and window.Razorpay loaded
        if (res.mode === 'RAZORPAY' && window.Razorpay && res.keyId) {
          const options = {
            key: res.keyId,
            amount: res.amount,
            currency: res.currency,
            name: "ShopPilot AI",
            description: "AI-Assisted Purchase",
            order_id: res.orderId,
            handler: async function (response) {
              await verifyRazorpayPayment({
                orderId: res.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              });
            },
            modal: {
              ondismiss: function () {
                setIsPaymentProcessing(false);
                setPaymentFailureState({ reason: "Razorpay Checkout dismissed by user." });
              }
            },
            theme: { color: "#4F46E5" }
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          // Open DEMO PAYMENT MODE modal
          setIsDemoPaymentOpen(true);
        }
      }
    } catch (err) {
      console.error("Order creation error:", err);
      setIsConsentGateOpen(false);
      setPaymentFailureState({ reason: err.message || "Failed to create payment order" });
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  // Step 2: Verify Razorpay / Demo Payment
  const verifyRazorpayPayment = async (payload) => {
    try {
      const verifyRes = await api.verifyPayment(payload);
      if (verifyRes && verifyRes.success) {
        triggerSuccessFlow(verifyRes);
      } else {
        triggerFailureFlow(verifyRes?.message || "Payment verification failed");
      }
    } catch (err) {
      triggerFailureFlow(err.message || "Payment verification exception");
    }
  };

  // Demo Payment Modal Triggers
  const handleSimulateDemoSuccess = async () => {
    setIsDemoPaymentOpen(false);
    if (activeOrderData?.orderId) {
      await verifyRazorpayPayment({ orderId: activeOrderData.orderId, isDemoSuccess: true });
    }
  };

  const handleSimulateDemoFailure = async () => {
    setIsDemoPaymentOpen(false);
    if (activeOrderData?.orderId) {
      await verifyRazorpayPayment({ orderId: activeOrderData.orderId, isDemoSuccess: false, failureReason: "Simulated card decline" });
    }
  };

  const triggerSuccessFlow = (result) => {
    setPaymentSuccessState(result);
    setCartItems([]); // Clear cart
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (e) { /* ignore */ }
  };

  const triggerFailureFlow = (reason) => {
    setPaymentFailureState({ reason });
  };

  const handleResetPaymentStates = () => {
    setPaymentSuccessState(null);
    setPaymentFailureState(null);
    setActiveOrderData(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => { handleResetPaymentStates(); setActiveTab(tab); }}
        cartCount={cartItems.reduce((s, i) => s + (i.quantity || 1), 0)}
        openCartDrawer={() => setIsCartDrawerOpen(true)}
        onSearch={(prompt) => { setInitialShoppingPrompt(prompt); setActiveTab('ai-shopping'); }}
      />

      {/* Main Container */}
      <main className="flex-1">
        
        {/* Payment Success View */}
        {paymentSuccessState ? (
          <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-white shadow-xl flex items-center justify-center text-emerald-600 mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                ✓ Payment Signature Verified
              </span>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Order Confirmed!</h1>
              <p className="text-base text-slate-600">Your AI-assisted purchase was completed successfully.</p>
            </div>

            {/* Order Details Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft text-left space-y-4 max-w-lg mx-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 text-xs">
                <span className="text-slate-400 font-medium">Order Reference</span>
                <span className="font-mono font-bold text-slate-900">{paymentSuccessState.order?.orderId || 'ORD-VERIFIED'}</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-100 pb-3 text-xs">
                <span className="text-slate-400 font-medium">Payment ID</span>
                <span className="font-mono text-indigo-600 font-bold">{paymentSuccessState.paymentId}</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-100 pb-3 text-xs">
                <span className="text-slate-400 font-medium">Total Amount</span>
                <span className="text-lg font-extrabold text-slate-900">₹{paymentSuccessState.order?.amount?.toLocaleString('en-IN')}</span>
              </div>

              {/* How ShopPilot Helped List */}
              <div className="pt-2 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">How ShopPilot Helped</h4>
                <div className="space-y-1.5 text-xs text-slate-700 font-medium">
                  <p className="flex items-center gap-2 text-emerald-700"><CheckCircle2 className="w-3.5 h-3.5" /> Understood your intent & requirements</p>
                  <p className="flex items-center gap-2 text-emerald-700"><CheckCircle2 className="w-3.5 h-3.5" /> Found the best product match</p>
                  <p className="flex items-center gap-2 text-emerald-700"><CheckCircle2 className="w-3.5 h-3.5" /> Suggested relevant add-ons</p>
                  <p className="flex items-center gap-2 text-emerald-700"><CheckCircle2 className="w-3.5 h-3.5" /> Obtained explicit confirmation</p>
                  <p className="flex items-center gap-2 text-emerald-700"><CheckCircle2 className="w-3.5 h-3.5" /> Verified Razorpay payment signature</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={() => { handleResetPaymentStates(); setActiveTab('orders'); }}
                className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all"
              >
                View Orders History
              </button>

              <button
                onClick={() => { handleResetPaymentStates(); setActiveTab('ai-shopping'); }}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Continue Shopping →
              </button>
            </div>
          </div>
        ) : paymentFailureState ? (
          
          /* Payment Failure View */
          <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-rose-100 border-4 border-white shadow-xl flex items-center justify-center text-rose-600 mx-auto">
              <XCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payment wasn’t completed.</h2>
              <p className="text-sm text-slate-600">No successful payment has been recorded for this order.</p>
              {paymentFailureState.reason && (
                <p className="text-xs font-mono p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 inline-block mt-2">
                  {paymentFailureState.reason}
                </p>
              )}
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => { setPaymentFailureState(null); setIsConsentGateOpen(true); }}
                className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>

              <button
                onClick={() => { setPaymentFailureState(null); setActiveTab('cart'); }}
                className="px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs"
              >
                Return to Cart
              </button>
            </div>
          </div>

        ) : (

          /* Render Selected Page */
          <>
            {activeTab === 'home' && (
              <Home 
                setActiveTab={setActiveTab} 
                onAddToCart={handleAddToCart}
                onQuickSearch={(p) => { setInitialShoppingPrompt(p); setActiveTab('ai-shopping'); }} 
              />
            )}

            {activeTab === 'ai-shopping' && (
              <AIShopping 
                onAddToCart={handleAddToCart} 
                initialPrompt={initialShoppingPrompt}
                openConsentGate={handleOpenCheckout}
              />
            )}

            {activeTab === 'cart' && (
              <CartPage 
                cartItems={cartItems}
                onUpdateQty={handleUpdateQty}
                onRemoveItem={handleRemoveItem}
                onCheckoutClick={handleOpenCheckout}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'orders' && <OrdersPage setActiveTab={setActiveTab} />}

            {activeTab === 'merchant-growth' && <MerchantDashboard />}

            {activeTab === 'audit-trail' && <AuditTrailPage />}

            {activeTab === 'how-it-works' && <HowItWorksPage setActiveTab={setActiveTab} />}
          </>

        )}

      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onCheckoutClick={handleOpenCheckout}
      />

      {/* Explicit Consent Gate Modal */}
      <ConsentGateModal
        isOpen={isConsentGateOpen}
        onClose={() => setIsConsentGateOpen(false)}
        cartItems={cartItems}
        subtotal={calculateSubtotal()}
        total={calculateSubtotal()}
        onConfirmPayment={handleConfirmConsent}
        isProcessing={isPaymentProcessing}
      />

      {/* Demo Payment Simulation Modal */}
      <DemoPaymentModal
        isOpen={isDemoPaymentOpen}
        onClose={() => setIsDemoPaymentOpen(false)}
        orderId={activeOrderData?.orderId}
        amount={calculateSubtotal()}
        onSimulateSuccess={handleSimulateDemoSuccess}
        onSimulateFailure={handleSimulateDemoFailure}
      />

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}
