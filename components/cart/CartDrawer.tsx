"use client";

import React from "react";
import Link from "next/link";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { usePlatform } from "@/store/PlatformContext";
import { CartItem } from "./CartItem";
import { Button } from "@/components/ui/Button";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, updateCartQuantity, removeFromCart, cartSubtotal, cartDeliveryFee, cartTotal } =
    usePlatform();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">Your Cart</h3>
              <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-3">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center my-auto text-center py-12">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  Your cart is empty
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Explore top Sapele restaurants and shops to add delicious meals or groceries!
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={updateCartQuantity}
                  onRemove={removeFromCart}
                />
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
              <div className="flex flex-col gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    ₦{cartSubtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    ₦{cartDeliveryFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ₦{cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <Link href="/checkout" onClick={onClose} className="w-full">
                <Button variant="primary" className="w-full py-3.5 text-base" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
