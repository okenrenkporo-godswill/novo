"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Star, Clock, Bike, ShieldCheck, Search } from "lucide-react";
import { usePlatform } from "@/store/PlatformContext";
import { ProductCard } from "@/components/cards/ProductCard";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Product } from "@/types";

function ShopContent() {
  const searchParams = useSearchParams();
  const storeParam = searchParams.get("store") || "store-1";
  const { stores, products, addToCart } = usePlatform();

  const store =
    stores.find(
      (s) =>
        s.id === storeParam ||
        s.slug === storeParam ||
        s.name.toLowerCase() === storeParam.toLowerCase()
    ) || stores[0];

  const storeProducts = products.filter((p) => p.storeId === store.id);

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = ["All", ...Array.from(new Set(storeProducts.map((p) => p.category)))];

  const filteredProducts = storeProducts.filter((p) => {
    const matchesCat = activeCategory === "All" || p.category === activeCategory;
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Store Cover Header */}
      <div className="relative w-full h-56 sm:h-72 bg-slate-800 overflow-hidden">
        <img src={store.banner} alt={store.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

        <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 flex items-end gap-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-4 border-white dark:border-slate-900 overflow-hidden bg-white shadow-xl shrink-0">
            <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col text-white gap-1 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{store.name}</h1>
              {store.isVerified && <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-1">{store.description}</p>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-300 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{store.rating} ({store.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{store.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bike className="w-4 h-4 text-indigo-400" />
                <span>₦{store.deliveryFee} delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Navigation & Search */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search within Menu */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search store menu..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium outline-none text-slate-900 dark:text-slate-100 border border-transparent focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 w-full">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 font-medium">
            {storeProducts.length === 0
              ? `No menu items have been added to ${store.name} yet. Check back soon!`
              : `No products found matching "${searchQuery}".`}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onAddToCart={addToCart}
                onSelectProduct={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </div>

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
                Add to Cart
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading Store Menu...</div>}>
      <ShopContent />
    </Suspense>
  );
}
