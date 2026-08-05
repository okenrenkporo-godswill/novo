"use client";

import React, { useState } from "react";
import { Plus, Check } from "lucide-react";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onSelectProduct,
}) => {
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div
      onClick={() => onSelectProduct && onSelectProduct(product)}
      className="group relative flex items-center bg-white dark:bg-slate-900 rounded-2xl p-3.5 gap-3.5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden border-0 outline-none ring-0"
    >
      {/* Borderless Compact Product Image */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-[9px] font-black uppercase text-rose-400 bg-rose-950/90 px-1.5 py-0.5 rounded-md">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Borderless Info Column */}
      <div className="flex flex-col justify-between flex-1 min-w-0 h-full py-0.5 gap-1">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
            {product.name}
          </h4>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5 font-normal">
            {product.description}
          </p>
        </div>

        {/* Borderless Price & Add Control */}
        <div className="flex items-center justify-between mt-2 pt-1">
          <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
            ₦{product.price.toLocaleString()}
          </span>

          <button
            disabled={!product.inStock}
            onClick={handleAdd}
            className={`inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer border-0 outline-none ${
              added
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-95"
            }`}
          >
            {added ? (
              <>
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
