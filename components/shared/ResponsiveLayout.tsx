"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, User, Clock } from "lucide-react";
import { usePlatform } from "@/store/PlatformContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/shared/Footer";
import { NotificationBell } from "@/components/shared/NotificationBell";
import { SupportChatWidget } from "@/components/shared/SupportChatWidget";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const pathname = usePathname();
  const { cart, isCartOpen, setIsCartOpen, isAuthenticated } = usePlatform();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Determine active view mode
  const isMerchant = pathname.startsWith("/merchant");
  const isRider = pathname.startsWith("/rider");
  const isAdmin = pathname.startsWith("/admin");
  // Hide main outer header on home page ("/") because header is integrated in hero banner
  const isCustomerHeaderVisible = !isMerchant && !isRider && !isAdmin && pathname !== "/";
  const isCustomerNavVisible = !isMerchant && !isRider && !isAdmin;

  const customerNavItems = [
    { label: "Home", href: "/", icon: <ShoppingBag className="w-5 h-5" /> },
    { label: "Shop", href: "/shop", icon: <Search className="w-5 h-5" /> },
    { label: "Orders", href: "/orders", icon: <Clock className="w-5 h-5" /> },
    { label: "Profile", href: "/profile", icon: <User className="w-5 h-5" /> },
  ];

  const isHomePage = pathname === "/";

  return (
    <div
      className={`flex flex-col min-h-screen w-full pb-20 sm:pb-0 font-sans ${
        isHomePage
          ? "bg-[#0b0f19] text-slate-100"
          : "bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
      }`}
    >
      {/* GLOBAL HEADER (For Customer View except Home Page) */}
      {isCustomerHeaderVisible && (
        <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl select-none group-hover:scale-105 transition-transform">
                🛍️
              </span>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
                  Novo
                </span>
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mt-0.5">
                  Delivery Express
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {customerNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <NotificationBell />

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm animate-in zoom-in-50">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {!isAuthenticated && (
                <Link
                  href="/auth"
                  className="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-extrabold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 transition-colors"
                >
                  Account
                </Link>
              )}
            </div>
          </div>
        </header>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full flex flex-col">{children}</main>

      {/* FOOTER */}
      {isCustomerNavVisible && <Footer />}

      {/* MOBILE BOTTOM NAVIGATION BAR (Customer view) */}
      {isCustomerNavVisible && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-2 px-6 flex justify-around items-center shadow-lg">
          {customerNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 transition-all ${
                  isActive
                    ? "text-emerald-600 dark:text-emerald-400 font-black scale-105"
                    : "text-slate-400 hover:text-slate-600 dark:text-slate-500"
                }`}
              >
                {item.icon}
                <span className="text-[10px] tracking-wide font-bold">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* 24/7 Customer Support Floating Assistant */}
      <SupportChatWidget />
    </div>
  );
}
