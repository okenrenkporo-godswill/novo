"use client";

import React from "react";
import { usePlatform } from "@/store/PlatformContext";
import { Table, Column } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Order } from "@/types";

export default function AdminOrdersPage() {
  const { orders } = usePlatform();

  const columns: Column<Order>[] = [
    { header: "Order ID", accessorKey: "id" },
    { header: "Customer", accessorKey: "customerName" },
    { header: "Store", accessorKey: "storeName" },
    { header: "Rider", cell: (o) => <span>{o.riderName || "Unassigned"}</span> },
    { header: "Total", cell: (o) => <span className="font-bold">₦{o.total.toLocaleString()}</span> },
    { header: "Status", cell: (o) => <StatusBadge status={o.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
        Live Platform Order Monitor
      </h1>
      <Table columns={columns} data={orders} keyExtractor={(o) => o.id} />
    </div>
  );
}
