"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User, PackageCheck } from "lucide-react";
import { usePlatform } from "@/store/PlatformContext";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { cart, setIsCartOpen } = usePlatform();
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Hide bottom nav on merchant, rider, and admin routes
  if (pathname.startsWith("/merchant") || pathname.startsWith("/rider") || pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Search", href: "/shop", icon: Search },
    { label: "Orders", href: "/orders", icon: PackageCheck },
    { label: "Cart", href: "/cart", icon: ShoppingBag, isCart: true },
    { label: "Account", href: "/profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-[#E3EAE6] dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-lg pb-[env(safe-area-inset-bottom,12px)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href) && item.href !== "/";

        if (item.isCart) {
          return (
            <button
              key={item.label}
              onClick={() => setIsCartOpen(true)}
              className="relative flex flex-col items-center justify-center gap-1 py-1 px-3 text-slate-500 hover:text-[#008A4C] transition-colors cursor-pointer min-w-[56px] min-h-[44px]"
            >
              <div className="relative">
                <Icon className="w-5 h-5 text-[#66736D] dark:text-slate-400" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#008A4C] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-slate-900 shadow-xs">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold text-[#66736D] dark:text-slate-400">{item.label}</span>
            </button>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-3 transition-all min-w-[56px] min-h-[44px] ${
              isActive
                ? "text-[#008A4C] font-black scale-105"
                : "text-[#66736D] dark:text-slate-400 hover:text-[#008A4C]"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-[#008A4C]" : "text-[#66736D] dark:text-slate-400"}`} />
            <span className={`text-[10px] tracking-tight ${isActive ? "font-black text-[#008A4C]" : "font-semibold"}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
