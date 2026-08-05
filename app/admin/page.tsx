"use client";

import React from "react";
import { DollarSign, Store, Bike, ShoppingBag, TrendingUp, ShieldCheck } from "lucide-react";
import { usePlatform } from "@/store/PlatformContext";

export default function AdminExecutivePage() {
  const { analytics, stores, orders, riderProfile } = usePlatform();

  return (
    <div className="flex flex-col gap-8 w-full">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Executive Platform Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time Gross Merchandise Value (GMV), active fleet, and store performance.
        </p>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Platform GMV",
            value: `₦${analytics.totalRevenue.toLocaleString()}`,
            icon: <DollarSign className="w-5 h-5 text-emerald-500" />,
            bgColor: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60",
          },
          {
            label: "Net Platform Commission (15%)",
            value: `₦${analytics.commissionEarned.toLocaleString()}`,
            icon: <TrendingUp className="w-5 h-5 text-purple-500" />,
            bgColor: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/60",
          },
          {
            label: "Active Merchant Stores",
            value: stores.length,
            icon: <Store className="w-5 h-5 text-blue-500" />,
            bgColor: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60",
          },
          {
            label: "Registered Delivery Riders",
            value: analytics.activeRidersCount,
            icon: <Bike className="w-5 h-5 text-amber-500" />,
            bgColor: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`p-5 rounded-3xl border ${stat.bgColor} flex flex-col justify-between gap-3 shadow-xs`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {stat.label}
              </span>
              {stat.icon}
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
