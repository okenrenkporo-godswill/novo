"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  BarChart3,
  Store,
  Bike,
  Users,
  ShoppingBag,
  CheckCircle,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Executive Overview", href: "/admin", icon: <BarChart3 className="w-5 h-5" /> },
    { label: "Store Approvals", href: "/admin/stores", icon: <Store className="w-5 h-5" /> },
    { label: "Rider Fleet Verification", href: "/admin/riders", icon: <Bike className="w-5 h-5" /> },
    { label: "Live Orders Monitor", href: "/admin/orders", icon: <ShoppingBag className="w-5 h-5" /> },
    { label: "User Management", href: "/admin/users", icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen w-full flex bg-slate-100 dark:bg-slate-950">
      {/* LEFT ADMIN SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-950 text-white border-r border-slate-800 shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black shadow-md">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-black text-sm text-white">Novo Admin</h3>
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
              Control Center
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
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between">
          <span className="text-sm font-black text-slate-900 dark:text-slate-100">
            Platform Master Administration
          </span>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
