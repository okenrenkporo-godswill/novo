"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Store,
  TrendingUp,
  Power,
  Bell,
} from "lucide-react";
import { usePlatform } from "@/store/PlatformContext";

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { stores, toggleStoreStatus } = usePlatform();
  const myStore = stores[0]; // Active store

  const navItems = [
    { label: "Overview", href: "/merchant", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Orders Queue", href: "/merchant/orders", icon: <ShoppingBag className="w-5 h-5" /> },
    { label: "Menu & Products", href: "/merchant/menu", icon: <UtensilsCrossed className="w-5 h-5" /> },
    { label: "Sales Analytics", href: "/merchant/analytics", icon: <TrendingUp className="w-5 h-5" /> },
    { label: "Store Settings", href: "/merchant/profile", icon: <Store className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen w-full flex bg-slate-100 dark:bg-slate-950">
      {/* LEFT SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white border-r border-slate-800 shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <img src={myStore?.logo} alt={myStore?.name} className="w-10 h-10 rounded-xl object-cover" />
          <div className="flex flex-col min-w-0">
            <h3 className="font-black text-sm text-white truncate">{myStore?.name}</h3>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
              Merchant Partner
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* STORE OPERATING TOGGLE */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => toggleStoreStatus(myStore?.id || "store-1")}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              myStore?.isOpening
                ? "bg-emerald-950/80 border border-emerald-800 text-emerald-300"
                : "bg-rose-950/80 border border-rose-800 text-rose-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Power className="w-4 h-4" />
              <span>{myStore?.isOpening ? "Store OPEN" : "Store CLOSED"}</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP BAR */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-slate-900 dark:text-slate-100">
              Merchant Operations Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* MAIN BODY */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
