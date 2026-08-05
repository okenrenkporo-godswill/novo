"use client";

import React from "react";
import { Star, TrendingUp, ShoppingBag, MessageSquare } from "lucide-react";
import { usePlatform } from "@/store/PlatformContext";

export default function MerchantAnalyticsPage() {
  const { reviews, stores, orders } = usePlatform();
  const myStore = stores[0];
  const storeReviews = reviews.filter((r) => r.storeId === myStore.id || true);

  return (
    <div className="flex flex-col gap-6 w-full">
      <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Sales Analytics & Customer Reviews</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Customer Rating</span>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">{myStore.rating}</span>
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">Customer Feedback & Reviews</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {storeReviews.map((rev) => (
            <div key={rev.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{rev.customerName}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-black">{rev.rating}</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">&quot;{rev.comment}&quot;</p>
              <span className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
