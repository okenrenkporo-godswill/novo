"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Search,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { usePlatform } from "@/store/PlatformContext";
import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { ProductCard } from "@/components/cards/ProductCard";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Product } from "@/types";

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80",
    text: "African Food 🍲",
    caption: "Top Restaurant Food",
  },
  {
    image: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=1000&q=80",
    text: "Pharmacy Meds 💊",
    caption: "Pharmacy & Medical Delivery",
  },
  {
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80",
    text: "Traditional Soups 🍲",
    caption: "Homestyle Traditional Dishes",
  },
  {
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1000&q=80",
    text: "Groceries 🛍️",
    caption: "Groceries & Supermarket Essentials",
  },
  {
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80",
    text: "Spicy Suya 🍢",
    caption: "Express Suya & Finger Food",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Stores" },
  { id: "restaurant", label: "Restaurants" },
  { id: "supermarket", label: "Groceries" },
  { id: "pharmacy", label: "Pharmacy" },
  { id: "express", label: "Express Suya" },
];

export default function CustomerHomePage() {
  const { stores, products, cart, addToCart, setIsCartOpen } = usePlatform();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("Okpe Road, Sapele, Delta State");
  const [isLocating, setIsLocating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Synchronized Slide & Text State
  const [activeSlide, setActiveSlide] = useState(0);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3000);
    return () => clearInterval(slideInterval);
  }, []);

  const handleUseMyLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      setDeliveryLocation("Olympia Cinema Area, Okpe Road, Sapele");
      setIsLocating(false);
    }, 800);
  };

  // Filter stores
  const filteredStores = stores.filter((store) => {
    const matchesCategory = selectedCategory === "all" || store.category === selectedCategory;
    const matchesSearch =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (store.cuisineType && store.cuisineType.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filter featured products
  const featuredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentSlide = HERO_SLIDES[activeSlide];

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      {/* 1. HERO BANNER WITH INTEGRATED TRANSPARENT HEADER & BOTTOM SVG WAVE */}
      <section className="relative w-full bg-gradient-to-br from-[#0a4d3c] via-[#052a21] to-[#21150c] text-white overflow-hidden pb-28 sm:pb-36">
        
        {/* INTEGRATED FULL HEADER INSIDE HERO BANNER */}
        <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative z-30">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl select-none group-hover:scale-105 transition-transform">
              🛍️
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white leading-none">
                Novo
              </span>
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5">
                Delivery Service
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-white/15">
            {[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: "Orders", href: "/orders" },
              { label: "Profile", href: "/profile" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  item.href === "/"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-200 hover:text-white hover:bg-white/15"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Header Action Controls */}
          <div className="flex items-center gap-3">
            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-emerald-300" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-sm animate-in zoom-in-50">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Account / Login */}
            <Link
              href="/auth"
              className="px-4 py-2 rounded-xl text-xs font-extrabold bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all active:scale-95 cursor-pointer"
            >
              Account
            </Link>
          </div>
        </header>

        {/* Dynamic Abstract Glow Shapes */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-24 -mb-24 pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-4 sm:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left gap-5">
            {/* CONCISE SYNCHRONIZED HERO HEADLINE */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight min-h-[90px] sm:min-h-[110px]">
              Get{" "}
              <span
                key={activeSlide}
                className="text-emerald-400 inline-block animate-in fade-in slide-in-from-bottom-2 duration-500 underline decoration-emerald-500/40 underline-offset-8"
              >
                {currentSlide.text}
              </span>{" "}
              delivered.
            </h1>

            {/* CONCISE SUBTITLE */}
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-md">
              Order food, groceries & pharmacy meds delivered fast.
            </p>

            {/* Location & Search Inputs */}
            <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-3 shadow-2xl border border-white/20 flex flex-col gap-2 text-slate-900 dark:text-slate-100 mt-2">
              {/* Location Bar */}
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-full">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <input
                  type="text"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className="bg-transparent text-xs font-bold flex-1 outline-none text-slate-800 dark:text-slate-200"
                  placeholder="Enter delivery address..."
                />
                <button
                  onClick={handleUseMyLocation}
                  className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider hover:underline ml-auto cursor-pointer"
                >
                  {isLocating ? "Locating..." : "Locate"}
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 w-full flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search FoodLAND, Pharmacy meds, Jollof, Milk..."
                  className="w-full pl-9 pr-4 py-2.5 bg-transparent text-sm outline-none text-slate-900 dark:text-slate-100 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Borderless Media Showcase */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative w-full max-w-xl lg:max-w-2xl h-80 sm:h-[420px] lg:h-[460px] rounded-3xl overflow-hidden shadow-2xl border-0 ring-0 outline-none group">
              <img
                src={currentSlide.image}
                alt={currentSlide.caption}
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            </div>
          </div>

        </div>

        {/* ORGANIC SVG WAVE BOTTOM DIVIDER */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-10">
          <svg
            className="relative block w-full h-12 sm:h-20 lg:h-28 text-slate-50 dark:text-slate-950"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* 2. CLEAN CATEGORY PILLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 w-full relative z-20">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. TOP SAPELE MERCHANTS (Glovo Larger Spreading Circles) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 w-full">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-emerald-50/80 dark:from-emerald-950/30 dark:via-slate-900 dark:to-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Top Sapele Merchants
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Popular stores and restaurants delivering near you.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
            >
              <span>See All ({stores.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {filteredStores.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No stores match your search query.
            </div>
          ) : (
            <div className="flex items-center gap-8 sm:gap-10 lg:gap-12 overflow-x-auto pb-4 pt-2 scrollbar-none">
              {filteredStores.map((store) => (
                <Link
                  key={store.id}
                  href={`/shop?store=${store.id}`}
                  className="group flex flex-col items-center gap-3 shrink-0 cursor-pointer"
                >
                  {/* LARGER SPREAD OUT MERCHANT CIRCLE */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full border-2 border-emerald-500/80 p-1 bg-white dark:bg-slate-900 shadow-md group-hover:scale-105 group-hover:border-emerald-400 transition-all duration-300 overflow-hidden">
                    <img
                      src={store.logo}
                      alt={store.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors text-center line-clamp-1 max-w-[110px] sm:max-w-[125px]">
                    {store.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. POPULAR DISHES & PRODUCTS (COMPLETELY BORDERLESS & SEAMLESS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 w-full">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Popular Dishes &amp; Products
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Directly add items to your cart for instant checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onAddToCart={addToCart}
                onSelectProduct={setSelectedProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. LET'S DO IT TOGETHER SECTION (With Glovo Large Overlapping Circle Images) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-28 w-full">
        <div className="flex flex-col gap-14">
          <div className="text-center">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Let&apos;s do it together
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto font-medium">
              Join Novo as a rider partner, merchant business, or career professional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 pt-10">
            {/* Card 1: Become a rider */}
            <div className="group relative bg-white dark:bg-slate-900 rounded-3xl pt-16 px-8 pb-8 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-2xl transition-all duration-300 flex flex-col justify-between items-center text-center gap-6">
              {/* Overlapping Circle Image */}
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-900 shadow-xl group-hover:scale-105 transition-transform duration-300 bg-amber-100 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=600&q=80"
                  alt="Become a rider"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col items-center gap-3 mt-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  Become a rider
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs">
                  Enjoy flexibility, freedom and competitive earnings by delivering through Novo.
                </p>
              </div>

              <Link href="/auth?role=rider">
                <Button
                  variant="primary"
                  className="rounded-full px-8 py-3 text-xs"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Register here
                </Button>
              </Link>
            </div>

            {/* Card 2: Register your business */}
            <div className="group relative bg-white dark:bg-slate-900 rounded-3xl pt-16 px-8 pb-8 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-2xl transition-all duration-300 flex flex-col justify-between items-center text-center gap-6">
              {/* Overlapping Circle Image */}
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-900 shadow-xl group-hover:scale-105 transition-transform duration-300 bg-emerald-100 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80"
                  alt="Register your business"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col items-center gap-3 mt-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  Register your business
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs">
                  Grow with Novo! Our technology and user base can help you boost sales and unlock new opportunities!
                </p>
              </div>

              <Link href="/auth?role=merchant">
                <Button
                  variant="primary"
                  className="rounded-full px-8 py-3 text-xs"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Register here
                </Button>
              </Link>
            </div>

            {/* Card 3: Careers */}
            <div className="group relative bg-white dark:bg-slate-900 rounded-3xl pt-16 px-8 pb-8 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-2xl transition-all duration-300 flex flex-col justify-between items-center text-center gap-6">
              {/* Overlapping Circle Image */}
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-900 shadow-xl group-hover:scale-105 transition-transform duration-300 bg-purple-100 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
                  alt="Careers"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col items-center gap-3 mt-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  Careers
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs">
                  Ready for an exciting new challenge? If you’re ambitious, humble, and love working with others, then we want to hear from you!
                </p>
              </div>

              <Link href="/auth">
                <Button
                  variant="primary"
                  className="rounded-full px-8 py-3 text-xs"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Register here
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT DETAILS MODAL */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name}
      >
        {selectedProduct && (
          <div className="flex flex-col gap-4">
            <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedProduct.description}
            </p>
            {selectedProduct.options && selectedProduct.options.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Select Add-ons
                </span>
                {selectedProduct.options.map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <span>{opt.name}</span>
                    <span className="text-emerald-600 font-bold">+₦{opt.price}</span>
                  </label>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
              <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                ₦{selectedProduct.price.toLocaleString()}
              </span>
              <Button
                variant="primary"
                onClick={() => {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
              >
                Add to Order
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
