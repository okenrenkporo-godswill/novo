"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Store, Bike, ShieldAlert } from "lucide-react";
import { usePlatform } from "@/store/PlatformContext";
import { UserRole } from "@/types";

export const RoleSwitcher: React.FC = () => {
  const pathname = usePathname();
  const { currentRole, setCurrentRole } = usePlatform();

  const roles: { role: UserRole; label: string; href: string; icon: React.ReactNode }[] = [
    { role: "customer", label: "Customer", href: "/", icon: <ShoppingBag className="w-4 h-4" /> },
    { role: "merchant", label: "Merchant", href: "/merchant", icon: <Store className="w-4 h-4" /> },
    { role: "rider", label: "Rider Hub", href: "/rider", icon: <Bike className="w-4 h-4" /> },
    { role: "admin", label: "Admin Panel", href: "/admin", icon: <ShieldAlert className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 dark:bg-slate-950/90 text-white backdrop-blur-xl px-2 py-1.5 rounded-full border border-slate-700/60 shadow-2xl flex items-center gap-1">
      <span className="text-[10px] font-black uppercase tracking-wider px-2 text-slate-400 border-r border-slate-800 hidden sm:inline">
        Demo Role:
      </span>

      {roles.map((item) => {
        const isActive =
          (item.href === "/" && (pathname === "/" || pathname === "/shop" || pathname === "/checkout" || pathname === "/orders" || pathname === "/profile")) ||
          (item.href !== "/" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.role}
            href={item.href}
            onClick={() => setCurrentRole(item.role)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
              isActive
                ? "bg-emerald-500 text-white shadow-md scale-105"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            {item.icon}
            <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};
