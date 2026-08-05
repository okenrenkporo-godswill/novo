"use client";

import React from "react";
import { TrendingUp, ShoppingBag, Clock, Star, CheckCircle, XCircle } from "lucide-react";
import { usePlatform } from "@/store/PlatformContext";
import { OrderCard } from "@/components/cards/OrderCard";

export default function MerchantOverviewPage() {
  const { orders, stores, updateOrderStatus } = usePlatform();
  const myStore = stores[0];

  const storeOrders = orders.filter((o) => o.storeId === myStore.id || true);
  const pendingOrders = storeOrders.filter((o) => o.status === "pending_merchant");
  const activeOrders = storeOrders.filter((o) => o.status === "preparing" || o.status === "ready_for_pickup");
  const completedOrders = storeOrders.filter((o) => o.status === "delivered");

  const todayRevenue = storeOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="flex flex-col gap-8 w-full">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Welcome back, {myStore.name}!
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage incoming kitchen orders and track daily performance.
        </p>
      </div>

      {/* KPI METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Today's Revenue",
            value: `₦${todayRevenue.toLocaleString()}`,
            icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
            bgColor: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60",
          },
          {
            label: "Pending Orders",
            value: pendingOrders.length,
            icon: <Clock className="w-5 h-5 text-amber-500" />,
            bgColor: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60",
          },
          {
            label: "Active Kitchen Jobs",
            value: activeOrders.length,
            icon: <ShoppingBag className="w-5 h-5 text-blue-500" />,
            bgColor: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60",
          },
          {
            label: "Store Rating",
            value: `${myStore.rating} ★`,
            icon: <Star className="w-5 h-5 text-amber-400 fill-amber-400" />,
            bgColor: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/60",
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

      {/* LIVE INCOMING ORDERS QUEUE */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
            Live Incoming Orders Queue ({pendingOrders.length})
          </h3>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 font-medium text-xs">
            No pending incoming orders at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingOrders.map((ord) => (
              <OrderCard
                key={ord.id}
                order={ord}
                userRole="merchant"
                onUpdateStatus={updateOrderStatus}
              />
            ))}
          </div>
        )}
      </div>

      {/* ACTIVE KITCHEN JOBS */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
          In Preparation & Ready for Pickup ({activeOrders.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeOrders.map((ord) => (
            <OrderCard
              key={ord.id}
              order={ord}
              userRole="merchant"
              onUpdateStatus={updateOrderStatus}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
