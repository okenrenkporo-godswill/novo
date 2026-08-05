"use client";

import React, { useState } from "react";
import { usePlatform } from "@/store/PlatformContext";
import { Table, Column } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Order } from "@/types";

export default function MerchantOrdersPage() {
  const { orders, updateOrderStatus } = usePlatform();
  const [filter, setFilter] = useState("all");

  const filteredOrders = orders.filter((o) => {
    if (filter === "all") return true;
    return o.status === filter;
  });

  const columns: Column<Order>[] = [
    { header: "Order ID", accessorKey: "id" },
    { header: "Customer", accessorKey: "customerName" },
    {
      header: "Items",
      cell: (o) => (
        <span className="text-xs">
          {o.items.map((i) => `${i.quantity}x ${i.product.name}`).join(", ")}
        </span>
      ),
    },
    {
      header: "Total",
      cell: (o) => <span className="font-bold">₦{o.total.toLocaleString()}</span>,
    },
    {
      header: "Status",
      cell: (o) => <StatusBadge status={o.status} />,
    },
    {
      header: "Actions",
      cell: (o) => (
        <div className="flex gap-2">
          {o.status === "pending_merchant" && (
            <Button size="sm" variant="primary" onClick={() => updateOrderStatus(o.id, "preparing")}>
              Accept
            </Button>
          )}
          {o.status === "preparing" && (
            <Button size="sm" variant="secondary" onClick={() => updateOrderStatus(o.id, "ready_for_pickup")}>
              Mark Ready
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Orders Management</h1>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {["all", "pending_merchant", "preparing", "ready_for_pickup", "delivered"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
              filter === f
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      <Table columns={columns} data={filteredOrders} keyExtractor={(item) => item.id} />
    </div>
  );
}
