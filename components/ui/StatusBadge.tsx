"use client";

import React from "react";
import { OrderStatus } from "@/types";

interface StatusBadgeProps {
  status: OrderStatus | "active" | "pending" | "suspended" | "verified" | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeConfig = (statusStr: string) => {
    switch (statusStr) {
      case "pending_merchant":
      case "pending":
        return {
          label: "Pending",
          className: "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800",
          dot: "bg-amber-500",
        };
      case "preparing":
        return {
          label: "Preparing",
          className: "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800",
          dot: "bg-blue-500 animate-ping",
        };
      case "ready_for_pickup":
        return {
          label: "Ready for Pickup",
          className: "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
          dot: "bg-indigo-500",
        };
      case "rider_assigned":
      case "picked_up":
        return {
          label: "Out for Delivery",
          className: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
          dot: "bg-emerald-500 animate-pulse",
        };
      case "delivered":
      case "active":
      case "verified":
        return {
          label: statusStr === "delivered" ? "Delivered" : statusStr === "active" ? "Active" : "Verified",
          className: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
          dot: "bg-emerald-500",
        };
      case "cancelled":
      case "suspended":
        return {
          label: statusStr === "cancelled" ? "Cancelled" : "Suspended",
          className: "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800",
          dot: "bg-rose-500",
        };
      default:
        return {
          label: statusStr,
          className: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
          dot: "bg-slate-400",
        };
    }
  };

  const config = getBadgeConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold border ${config.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
