"use client";

import React from "react";
import { usePlatform } from "@/store/PlatformContext";

export default function RiderEarningsPage() {
  const { riderProfile } = usePlatform();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen flex flex-col gap-6">
      <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Earnings & Payouts</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Today&apos;s Earnings</span>
          <p className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-2">
            ₦{riderProfile.earningsToday.toLocaleString()}
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">This Week&apos;s Total</span>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            ₦{riderProfile.earningsThisWeek.toLocaleString()}
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Tips Earned</span>
          <p className="text-3xl font-black text-amber-500 mt-2">
            ₦{riderProfile.tipsToday.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
