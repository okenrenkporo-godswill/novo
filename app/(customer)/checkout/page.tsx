"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Banknote, Landmark, MapPin, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import { usePlatform } from "@/store/PlatformContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiService } from "@/services/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, cartDeliveryFee, placeOrder } = usePlatform();

  const [address, setAddress] = useState("Apartment 4B, Palm Grove Estate, Commercial Avenue");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash" | "transfer">("card");
  const [tip, setTip] = useState(500);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const discount = promoApplied ? 500 : 0;
  const serviceFee = cart.length > 0 ? 200 : 0;
  const total = cartSubtotal + cartDeliveryFee + serviceFee + tip - discount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "NOVO500" || promoCode.trim().toUpperCase() === "NOVO") {
      setPromoApplied(true);
    } else {
      alert("Invalid promo code. Try 'NOVO' or 'NOVO500'.");
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      const targetStoreId = cart[0]?.product?.storeId || (cart[0]?.product as any)?.store_id;

      if (token && targetStoreId) {
        await apiService.createOrder({
          store_id: targetStoreId,
          subtotal: cartSubtotal,
          delivery_fee: cartDeliveryFee,
          service_fee: serviceFee,
          tip: tip,
          total: total,
          delivery_address: address,
        }, token);
      }
    } catch (e) {
      console.warn("Backend order sync note:", e);
    } finally {
      const order = placeOrder(address, paymentMethod, tip);
      setIsSubmitting(false);
      router.push(`/orders?orderId=${order.id}`);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">Add delicious items to proceed with checkout.</p>
        <Button variant="primary" onClick={() => router.push("/shop")}>
          Browse Stores
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mb-6">
        Checkout & Payment
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Form Column */}
        <div className="md:col-span-7 flex flex-col gap-6">
          {/* Address Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <MapPin className="w-5 h-5 text-emerald-500" />
              <h3 className="font-black text-base">Delivery Address</h3>
            </div>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full street address, building & apartment..."
            />
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <CreditCard className="w-5 h-5 text-emerald-500" />
              <h3 className="font-black text-base">Payment Method</h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "card", label: "Debit Card", icon: <CreditCard className="w-5 h-5" /> },
                { id: "cash", label: "Cash on Delivery", icon: <Banknote className="w-5 h-5" /> },
                { id: "transfer", label: "Bank Transfer", icon: <Landmark className="w-5 h-5" /> },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-xs font-black transition-all cursor-pointer ${
                    paymentMethod === method.id
                      ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {method.icon}
                  <span>{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Driver Tip */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                <h3 className="font-black text-base text-slate-900 dark:text-slate-100">
                  Tip Your Delivery Partner
                </h3>
              </div>
              <span className="text-xs text-slate-400">100% goes to rider</span>
            </div>
            <div className="flex items-center gap-2">
              {[0, 300, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTip(amount)}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    tip === amount
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {amount === 0 ? "No Tip" : `₦${amount}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Summary Column */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-4">
            <h3 className="font-black text-base text-slate-900 dark:text-slate-100">
              Order Summary
            </h3>

            {/* Item List */}
            <div className="flex flex-col gap-2 border-b border-slate-100 dark:border-slate-800 pb-4 text-xs">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <span className="font-semibold">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    ₦{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <Input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo code (NOVO)"
              />
              <Button variant="secondary" type="submit" size="sm">
                Apply
              </Button>
            </form>

            {/* Price Calculations */}
            <div className="flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">₦{cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">₦{cartDeliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Service Fee</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">₦{serviceFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Rider Tip</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">₦{tip.toLocaleString()}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promo Discount</span>
                  <span>-₦500</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 dark:text-slate-100 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span>Total</span>
                <span className="text-emerald-600 dark:text-emerald-400">₦{total.toLocaleString()}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              onClick={handlePlaceOrder}
              className="mt-2 w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Place Order • ₦{total.toLocaleString()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
