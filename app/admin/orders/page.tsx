"use client";

import React, { useState, useEffect } from "react";
import { usePlatform } from "@/store/PlatformContext";
import { Table, Column } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Order, OrderStatus } from "@/types";
import { apiService } from "@/services/api";

export default function AdminOrdersPage() {
  const { orders: contextOrders, updateOrderStatus } = usePlatform();
  const [ordersList, setOrdersList] = useState<Order[]>(contextOrders);
  const [loading, setLoading] = useState(true);

  const fetchBackendOrders = async () => {
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      const data = await apiService.getOrders(undefined, token || undefined);
      if (Array.isArray(data) && data.length > 0) {
        setOrdersList(data);
      } else {
        setOrdersList(contextOrders);
      }
    } catch (e) {
      console.warn("Failed to fetch backend orders:", e);
      setOrdersList(contextOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    setOrdersList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      await apiService.updateOrderStatus(orderId, newStatus, token || undefined);
    } catch (e) {
      console.warn("Backend order status update note:", e);
    }
  };

  const columns: Column<Order>[] = [
    { header: "Order ID", accessorKey: "id" },
    { header: "Customer", accessorKey: "customerName" },
    { header: "Store", accessorKey: "storeName" },
    { header: "Rider", cell: (o) => <span>{o.riderName || "Unassigned"}</span> },
    { header: "Total", cell: (o) => <span className="font-bold">₦{(o.total || 0).toLocaleString()}</span> },
    { header: "Status", cell: (o) => <StatusBadge status={o.status} /> },
    {
      header: "Admin Action",
      cell: (o) => (
        <select
          value={o.status}
          onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
          className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 cursor-pointer"
        >
          <option value="PENDING">PENDING</option>
          <option value="PLACED">PLACED</option>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="PREPARING">PREPARING</option>
          <option value="READY_FOR_PICKUP">READY FOR PICKUP</option>
          <option value="ON_THE_WAY">ON THE WAY</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          Live Platform Order Monitor
        </h1>
        <span className="text-xs font-bold text-slate-500">
          {ordersList.length} Total Orders
        </span>
      </div>
      <Table columns={columns} data={ordersList} keyExtractor={(o) => o.id} />
    </div>
  );
}
