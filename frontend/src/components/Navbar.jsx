import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Search, Heart, User, Bot, HelpCircle, Tag, Grid, ChevronRight } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, cartCount = 0, openCartDrawer, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistCount, setWishlistCount] = useState(2);
  const [showWishlistToast, setShowWishlistToast] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery.trim());
      } else {
        setActiveTab('ai-shopping');
      }
    }
  };

  const handleNavClick = (tabId, targetSectionId) => {
    setActiveTab(tabId);
    if (targetSectionId && tabId === 'home') {
      setTimeout(() => {
        const el = document.getElementById(targetSectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  };

  const toggleWishlistToast = () => {
    setShowWishlistToast(true);
    setTimeout(() => setShowWishlistToast(false), 2500);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      
      {/* Top Banner Announcement */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-[11px] font-medium py-1.5 px-4 text-center flex items-center justify-between border-b border-indigo-900/30">
        <div className="hidden md:flex items-center gap-2 text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>ShopPilot AI Commerce Engine v1.0</span>
        </div>
        <div className="mx-auto md:mx-0 flex items-center gap-2">
          <span className="bg-indigo-600/80 text-indigo-100 px-2 py-0.5 rounded-full font-bold text-[10px] tracking-wide uppercase">
            AI Sale
          </span>
          <span>Up to 40% OFF on Smart Tech & Accessories • Free Express Delivery</span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-slate-300">
          <span className="hover:text-white cursor-pointer transition-colors" onClick={() => handleNavClick('how-it-works')}>Help & Support</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer transition-colors" onClick={() => handleNavClick('audit-trail')}>Audit Trail</span>
        </div>
      </div>

      {/* Main Navbar Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">ShopPilot</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 tracking-wider">AI</span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 hidden sm:block">Intelligent E-Commerce</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 font-medium text-xs text-slate-700">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-full transition-all ${
                activeTab === 'home' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Shop
            </button>

            <button
              onClick={() => handleNavClick('home', 'categories-section')}
              className="px-3.5 py-2 rounded-full hover:text-indigo-600 hover:bg-slate-50 transition-all flex items-center gap-1"
            >
              <Grid className="w-3.5 h-3.5 text-slate-400" />
              Categories
            </button>

            <button
              onClick={() => handleNavClick('ai-shopping')}
              className={`px-3.5 py-2 rounded-full transition-all flex items-center gap-1 ${
                activeTab === 'ai-shopping' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-indigo-600" />
              AI Shopping
            </button>

            <button
              onClick={() => handleNavClick('home', 'deals-section')}
              className="px-3.5 py-2 rounded-full hover:text-indigo-600 hover:bg-slate-50 transition-all flex items-center gap-1"
            >
              <Tag className="w-3.5 h-3.5 text-rose-500" />
              Deals
            </button>

            <button
              onClick={() => handleNavClick('how-it-works')}
              className={`px-3.5 py-2 rounded-full transition-all flex items-center gap-1 ${
                activeTab === 'how-it-works' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              How It Works
            </button>
          </nav>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex items-center flex-1 max-w-sm relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products or ask AI (e.g. laptop under ₹60k)..."
              className="w-full pl-9 pr-8 py-2 rounded-full bg-slate-100/90 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-1 transition-colors"
                title="Search with AI"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Right Action Icons & Main CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Wishlist Button */}
            <button
              onClick={toggleWishlistToast}
              className="relative p-2.5 rounded-full text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200/70"
              title="Wishlist"
            >
              <Heart className="w-4.5 h-4.5 text-slate-600" />
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => openCartDrawer ? openCartDrawer() : setActiveTab('cart')}
              className="relative p-2.5 rounded-full text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200/70"
              title="View Shopping Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5 text-slate-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-pulse-subtle">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Sign In */}
            <div className="hidden sm:flex items-center">
              <button
                onClick={() => setIsUserLoggedIn(!isUserLoggedIn)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-slate-100 border border-slate-200/70 text-xs font-semibold text-slate-700 transition-colors"
                title="Account Settings"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <span className="hidden xl:inline">{isUserLoggedIn ? 'Demo User' : 'Sign In'}</span>
              </button>
            </div>

            {/* Main CTA: "Shop with AI →" */}
            <button
              onClick={() => handleNavClick('ai-shopping')}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white/30" />
              <span>Shop with AI</span>
              <span className="text-indigo-200 font-normal">→</span>
            </button>

          </div>

        </div>
      </div>

      {/* Wishlist Toast Notification */}
      {showWishlistToast && (
        <div className="absolute top-full right-6 mt-2 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-2 animate-fade-in z-50">
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          <span>Wishlist updated! (2 items saved)</span>
        </div>
      )}

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-200/80 bg-white py-2 px-2 text-[11px] font-semibold text-slate-600">
        <button 
          onClick={() => handleNavClick('home')} 
          className={`flex items-center gap-1 ${activeTab === 'home' ? 'text-indigo-600 font-bold' : ''}`}
        >
          Shop
        </button>
        <button 
          onClick={() => handleNavClick('home', 'categories-section')} 
          className="flex items-center gap-1"
        >
          Categories
        </button>
        <button 
          onClick={() => handleNavClick('ai-shopping')} 
          className={`flex items-center gap-1 text-indigo-600 font-bold ${activeTab === 'ai-shopping' ? 'underline' : ''}`}
        >
          ✨ AI Shopping
        </button>
        <button 
          onClick={() => handleNavClick('home', 'deals-section')} 
          className="flex items-center gap-1 text-rose-600"
        >
          Deals
        </button>
        <button 
          onClick={() => handleNavClick('how-it-works')} 
          className={`flex items-center gap-1 ${activeTab === 'how-it-works' ? 'text-indigo-600 font-bold' : ''}`}
        >
          How It Works
        </button>
      </div>

    </header>
  );
}

