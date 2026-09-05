import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ArrowRight, Bot, ShieldCheck, TrendingUp, CheckCircle2, 
  Search, Zap, Lock, ChevronLeft, ChevronRight, ShoppingBag, Heart, Star,
  Laptop, Smartphone, Headphones, Watch, Home as HomeIcon, Package, Tag, ArrowUpRight
} from 'lucide-react';
import WhyThisProductModal from '../components/WhyThisProductModal';

export default function Home({ setActiveTab, onQuickSearch, onAddToCart }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(null);

  // Hero Advertisement Slides Data
  const slides = [
    {
      badge: "SMARTER SHOPPING",
      category: "AI-POWERED SHOPPING",
      title: "Tell us what you need. We'll find the best match.",
      description: "AI-powered product discovery based on your budget and preferences.",
      buttonText: "Start AI Shopping →",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&auto=format&fit=crop&q=80",
      targetPrompt: "I need a high-performance setup under ₹70,000",
      accent: "from-indigo-600 via-indigo-700 to-violet-700"
    },
    {
      badge: "UP TO 35% OFF",
      category: "SMART TECH DEALS",
      title: "Upgrade Your Setup, Smarter.",
      description: "AI-curated laptops, gadgets and accessories.",
      buttonText: "Explore Tech Deals →",
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1200&auto=format&fit=crop&q=80",
      targetPrompt: "Find laptops with 16GB RAM under ₹60,000",
      accent: "from-blue-600 via-indigo-600 to-indigo-800"
    },
    {
      badge: "UP TO 40% OFF",
      category: "WEEKEND DEALS",
      title: "More Value. Less Searching.",
      description: "Discover products selected by ShopPilot AI.",
      buttonText: "View Deals →",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80",
      targetPrompt: "Best wireless noise canceling headphones under ₹25,000",
      accent: "from-violet-600 via-purple-700 to-indigo-900"
    },
    {
      badge: "PERSONALIZED FOR YOU",
      category: "PERSONALIZED FOR YOU",
      title: "Your Shopping Assistant Knows What Fits.",
      description: "Describe what you need and let ShopPilot find the right products.",
      buttonText: "Try ShopPilot AI →",
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&auto=format&fit=crop&q=80",
      targetPrompt: "Build me a student study setup under ₹40,000",
      accent: "from-emerald-600 via-teal-700 to-indigo-900"
    }
  ];

  // Auto-play Hero Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleStartSearch = (promptText) => {
    if (onQuickSearch) {
      onQuickSearch(promptText || "I need a laptop for coding under ₹60,000");
    }
    setActiveTab('ai-shopping');
  };

  const handleAddProduct = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
    setAddedToast(`Added ${product.name} to cart!`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  const handleOpenWhyModal = (product, customReasons) => {
    setSelectedProductForModal({
      product,
      reasons: customReasons || [
        `✓ Fits exact search criteria & user budget`,
        `✓ Outstanding customer satisfaction (${product.rating} ★)`,
        `✓ Fast shipping available (In Stock: ${product.stock} units)`
      ]
    });
    setIsWhyModalOpen(true);
  };

  // Sample Catalog Products for AI Picks & Trending Sections
  const aiPicks = [
    {
      id: "prod-101",
      name: "Lenovo IdeaPad Slim 5 Intel i5",
      category: "Laptops",
      price: 54999,
      originalPrice: 68990,
      discount: "20% OFF",
      rating: 4.6,
      aiMatch: "98%",
      stock: 18,
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
      reasons: [
        "✓ Powerful 12th Gen Intel Core i5 with 16GB RAM for seamless coding",
        "✓ High 512GB SSD storage for fast compilation",
        "✓ Under your ₹60,000 budget target"
      ]
    },
    {
      id: "prod-301",
      name: "Sony WH-1000XM4 Wireless Headphones",
      category: "Headphones",
      price: 22990,
      originalPrice: 29990,
      discount: "23% OFF",
      rating: 4.8,
      aiMatch: "96%",
      stock: 20,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      reasons: [
        "✓ Industry-leading ANC blocks background ambient distraction",
        "✓ 30-hour long battery life for study & work sessions",
        "✓ Multipoint Bluetooth pairing for laptop and mobile"
      ]
    },
    {
      id: "prod-401",
      name: "Logitech MX Master 3S Mouse",
      category: "Accessories",
      price: 8995,
      originalPrice: 10995,
      discount: "18% OFF",
      rating: 4.9,
      aiMatch: "95%",
      stock: 30,
      image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
      reasons: [
        "✓ Quiet clicks reduce office & library noise",
        "✓ MagSpeed scroll wheel spins 1,000 lines per second",
        "✓ Ergonomic grip prevents wrist fatigue"
      ]
    },
    {
      id: "prod-202",
      name: "Samsung Galaxy A54 5G",
      category: "Smartphones",
      price: 28999,
      originalPrice: 38999,
      discount: "25% OFF",
      rating: 4.5,
      aiMatch: "94%",
      stock: 22,
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
      reasons: [
        "✓ 120Hz Super AMOLED screen for smooth scrolling",
        "✓ 50MP camera with Optical Image Stabilization",
        "✓ IP67 water and dust resistance"
      ]
    },
    {
      id: "prod-601",
      name: "Apple iPad 10th Gen (Wi-Fi 64GB)",
      category: "Tablets",
      price: 34900,
      originalPrice: 44900,
      discount: "22% OFF",
      rating: 4.8,
      aiMatch: "97%",
      stock: 14,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
      reasons: [
        "✓ All-screen 10.9-inch Liquid Retina display",
        "✓ Fast A14 Bionic chip for note-taking & multitasking",
        "✓ Center Stage 12MP ultra-wide front camera"
      ]
    },
    {
      id: "prod-404",
      name: "Keychron K2 V2 Mechanical Keyboard",
      category: "Accessories",
      price: 7499,
      originalPrice: 9999,
      discount: "25% OFF",
      rating: 4.8,
      aiMatch: "93%",
      stock: 14,
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
      reasons: [
        "✓ Tactile brown switches for typing feedback",
        "✓ Seamless Mac & Windows layout switching",
        "✓ 75% compact footprint for desk ergonomics"
      ]
    }
  ];

  const trendingProducts = [
    {
      id: "prod-102",
      name: "ASUS Vivobook 15 OLED",
      category: "Laptops",
      price: 59990,
      originalPrice: 74990,
      discount: "20% OFF",
      rating: 4.7,
      badge: "🔥 #1 Trending",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "prod-201",
      name: "OnePlus Nord CE 3 Lite 5G",
      category: "Smartphones",
      price: 18999,
      originalPrice: 21999,
      discount: "13% OFF",
      rating: 4.3,
      badge: "🔥 Popular Choice",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "prod-403",
      name: "Ergonomic Aluminum Laptop Stand",
      category: "Accessories",
      price: 1299,
      originalPrice: 2499,
      discount: "48% OFF",
      rating: 4.7,
      badge: "🔥 Fast Seller",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "prod-501",
      name: "Samsung Galaxy Watch6 44mm",
      category: "Smartwatches",
      price: 19999,
      originalPrice: 33999,
      discount: "41% OFF",
      rating: 4.7,
      badge: "🔥 Top Rated",
      image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80"
    }
  ];

  const categories = [
    {
      id: "laptops",
      title: "💻 Laptops & Tech",
      desc: "High performance laptops for coding, work & creation",
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
      query: "Show me Laptops for coding and work"
    },
    {
      id: "phones",
      title: "📱 Smartphones",
      desc: "5G smartphones with pro cameras & fast charging",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
      query: "Find Smartphones under ₹30,000"
    },
    {
      id: "audio",
      title: "🎧 Audio",
      desc: "Immersive ANC headphones & noise isolation earbuds",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      query: "Best noise canceling Headphones"
    },
    {
      id: "smartwatches",
      title: "⌚ Smart Devices",
      desc: "Fitness smartwatches & health tracking wearables",
      image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80",
      query: "Smartwatches with fitness tracking"
    },
    {
      id: "lifestyle",
      title: "🏠 Home & Lifestyle",
      desc: "Smart workspace setups & college essentials",
      image: "https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=600&auto=format&fit=crop&q=80",
      query: "Build a college study desk setup"
    },
    {
      id: "accessories",
      title: "🎒 Accessories",
      desc: "Ergonomic mice, keyboards, hubs & power banks",
      image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
      query: "Ergonomic desk accessories"
    }
  ];

  return (
    <div className="space-y-16 pb-16 bg-slate-50 text-slate-900">
      
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{addedToast}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. HERO ADVERTISEMENT CAROUSEL */}
      {/* ============================================================ */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-900 text-white min-h-[460px] sm:min-h-[500px] flex items-center">
          
          {/* Background Image Carousel with Overlay */}
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center transform scale-105"
              />
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent} mix-blend-multiply opacity-90`} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
            </div>
          ))}

          {/* Slide Content */}
          <div className="relative z-20 max-w-2xl px-6 sm:px-12 py-12 space-y-5">
            
            {/* Offer Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-extrabold tracking-wider uppercase shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{slides[currentSlide].badge}</span>
            </div>

            {/* Category Header */}
            <p className="text-xs font-extrabold tracking-widest text-indigo-200 uppercase">
              {slides[currentSlide].category}
            </p>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
              {slides[currentSlide].title}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl font-normal">
              {slides[currentSlide].description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => handleStartSearch(slides[currentSlide].targetPrompt)}
                className="px-7 py-3.5 rounded-full bg-white hover:bg-indigo-50 text-indigo-900 font-extrabold text-sm shadow-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <span>{slides[currentSlide].buttonText}</span>
              </button>

              <button
                onClick={() => handleStartSearch("Top deals recommended for me")}
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold text-sm backdrop-blur-sm transition-all"
              >
                Browse All Deals
              </button>
            </div>

          </div>

          {/* Carousel Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/30 transition-all shadow-lg"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/30 transition-all shadow-lg"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Carousel Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. SHOP BY CATEGORY */}
      {/* ============================================================ */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore AI-curated product departments
            </p>
          </div>
          <button
            onClick={() => handleStartSearch("Show all categories")}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleStartSearch(cat.query)}
              className="group cursor-pointer bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="overflow-hidden rounded-2xl aspect-square mb-3 relative bg-slate-100">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                  {cat.title}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                  {cat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. DEALS SECTION */}
      {/* ============================================================ */}
      <section id="deals-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Tag className="w-6 h-6 text-rose-500 fill-rose-500/20" />
            <span>Featured E-Commerce Deals</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Handpicked deals with artificial intelligence price optimization
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Deal Card 1 */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between border border-indigo-800/50 group">
            <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
            <div className="space-y-3 relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider">
                UP TO 35% OFF
              </span>
              <h3 className="text-2xl font-black text-white leading-tight">Tech Essentials</h3>
              <p className="text-xs text-indigo-200">High performance laptops, coding setups & monitors.</p>
            </div>
            <button
              onClick={() => handleStartSearch("Show Tech Essentials under ₹60,000")}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-white hover:bg-indigo-50 text-indigo-950 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 relative z-10"
            >
              <span>Shop Tech Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Deal Card 2 */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between border border-slate-700/50 group">
            <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
            <div className="space-y-3 relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider">
                UP TO 30% OFF
              </span>
              <h3 className="text-2xl font-black text-white leading-tight">Work From Home</h3>
              <p className="text-xs text-slate-300">Ergonomic stands, mechanical keyboards & posture gear.</p>
            </div>
            <button
              onClick={() => handleStartSearch("Show WFH ergonomic setups")}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 relative z-10"
            >
              <span>Explore WFH</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Deal Card 3 */}
          <div className="bg-gradient-to-br from-violet-900 via-purple-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between border border-purple-800/50 group">
            <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
            <div className="space-y-3 relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-rose-400 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider">
                UP TO 40% OFF
              </span>
              <h3 className="text-2xl font-black text-white leading-tight">Smart Accessories</h3>
              <p className="text-xs text-purple-200">Power banks, USB-C hubs, wireless mice & audio.</p>
            </div>
            <button
              onClick={() => handleStartSearch("Show smart accessories under ₹10,000")}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-white hover:bg-purple-50 text-purple-950 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 relative z-10"
            >
              <span>View Accessories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Deal Card 4 */}
          <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between border border-blue-800/50 group">
            <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
            <div className="space-y-3 relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-300 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider">
                AI PICKS
              </span>
              <h3 className="text-2xl font-black text-white leading-tight">Personalized Deals</h3>
              <p className="text-xs text-blue-200">AI-curated recommendations based on custom intent.</p>
            </div>
            <button
              onClick={() => handleStartSearch("Find best custom recommendations")}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 relative z-10 shadow-md"
            >
              <span>Get AI Picks</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. AI PICKS */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-extrabold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ✨ Picked by ShopPilot AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Products our AI thinks you'll love based on catalog match scoring
            </p>
          </div>

          <button
            onClick={() => handleStartSearch("Recommend products for me")}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hidden sm:flex items-center gap-1"
          >
            <span>See More AI Picks</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {aiPicks.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image + Match Badge Container */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-4 bg-slate-100 border border-slate-100">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* AI Match Badge */}
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-white/30" />
                    <span>{prod.aiMatch} AI Match</span>
                  </span>

                  {/* Discount Tag */}
                  <span className="absolute top-3 right-3 bg-rose-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs">
                    {prod.discount}
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-indigo-600 font-semibold uppercase tracking-wider text-[10px]">
                      {prod.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{prod.rating}</span>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {prod.name}
                  </h3>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-slate-900">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400 line-through font-normal">
                      ₹{prod.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Stock */}
                  <p className="text-[11px] text-emerald-600 font-semibold">
                    ✓ In Stock ({prod.stock} units left)
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => handleOpenWhyModal(prod, prod.reasons)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-slate-700 hover:text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Bot className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Why this product?</span>
                </button>

                <button
                  onClick={() => handleAddProduct(prod)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. TRENDING NOW */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Market Demand</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Trending Now
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            What shoppers are discovering and purchasing this week
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-soft hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-3 bg-slate-100">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-slate-900/90 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs backdrop-blur-sm">
                    {prod.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">{prod.category}</span>
                    <span className="text-amber-500 font-bold text-xs">★ {prod.rating}</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">{prod.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-black text-slate-900">₹{prod.price.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-slate-400 line-through">₹{prod.originalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleAddProduct(prod)}
                className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-900 text-slate-900 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. AI PROMOTIONAL BANNER */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-indigo-900/50">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-extrabold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>NATURAL LANGUAGE SHOPPING ASSISTANT</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                DON'T KNOW WHAT TO BUY?
              </h2>
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-200">
                Just Tell ShopPilot.
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              Describe what you need in your own words. Our AI finds products that match your budget and requirements.
            </p>

            {/* Example Interactive Pill */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 max-w-lg space-y-2">
              <p className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">Try typing something like:</p>
              <button
                onClick={() => handleStartSearch("I need a laptop for coding under ₹60,000")}
                className="w-full p-3 rounded-xl bg-white/15 hover:bg-white/25 text-left text-xs sm:text-sm font-bold text-white flex items-center justify-between transition-colors"
              >
                <span>💡 "I need a laptop for coding under ₹60,000"</span>
                <ArrowRight className="w-4 h-4 text-indigo-300 shrink-0 ml-2" />
              </button>
            </div>

            {/* Main Action Button */}
            <div>
              <button
                onClick={() => handleStartSearch("I need a laptop for coding under ₹60,000")}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-extrabold text-base shadow-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <span>Ask ShopPilot AI →</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. HOW IT WORKS */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How ShopPilot AI Works
          </h2>
          <p className="text-sm text-slate-500">
            From natural prompt input to verified delivery in 4 intelligent steps
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3 relative">
            <span className="text-4xl font-black text-indigo-100 block">01</span>
            <h3 className="font-extrabold text-base text-slate-900">Tell Us What You Need</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Describe your ideal product, budget & preferences in natural language without filling rigid filter forms.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3 relative">
            <span className="text-4xl font-black text-indigo-100 block">02</span>
            <h3 className="font-extrabold text-base text-slate-900">AI Understands Intent</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ShopPilot parses constraints, specs, reviews & price limits to filter the catalog deterministically.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3 relative">
            <span className="text-4xl font-black text-indigo-100 block">03</span>
            <h3 className="font-extrabold text-base text-slate-900">Get Personalized Matches</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive top scored product matches with clear, explainable reasoning and relevant add-on suggestions.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3 relative">
            <span className="text-4xl font-black text-indigo-100 block">04</span>
            <h3 className="font-extrabold text-base text-slate-900">Shop With Confidence</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Confirm your order with explicit consent gates and verified Razorpay payment protection.
            </p>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. TRUST SECTION */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Built-In Safety & Transparency
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Hackathon Trust Story: Safety mechanisms protecting every AI decision
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3 hover:border-indigo-200 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              🤖
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">AI-Powered Discovery</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Smart natural language matching tailored to your exact budget, usage, and spec requirements.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3 hover:border-indigo-200 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
              🔍
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Explainable Recommendations</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clear bulleted reasoning behind every product score, match percentage, and suggested add-on.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3 hover:border-emerald-200 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              🛡️
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Consent-Based Checkout</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explicit customer confirmation modal with transaction caps (₹1,00,000) before initiating payment.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3 hover:border-indigo-200 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              📋
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Transparent Audit Trail</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full real-time audit records of AI agent intent recognition, search scoring, and order fulfillment.
            </p>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. FINAL CTA */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Your Next Great Find Is Waiting.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal">
              Let ShopPilot build a smarter basket for you. Tell us what you're looking for and experience intelligent e-commerce.
            </p>
          </div>

          <div className="relative z-10 flex justify-center pt-2">
            <button
              onClick={() => handleStartSearch("I need a laptop for coding under ₹60,000")}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold text-base shadow-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-5 h-5 fill-white/20" />
              <span>Start Shopping with AI →</span>
            </button>
          </div>
        </div>
      </section>

      {/* Why This Product Modal */}
      {selectedProductForModal && (
        <WhyThisProductModal
          isOpen={isWhyModalOpen}
          onClose={() => setIsWhyModalOpen(false)}
          product={selectedProductForModal.product}
          reasons={selectedProductForModal.reasons}
        />
      )}

    </div>
  );
}
