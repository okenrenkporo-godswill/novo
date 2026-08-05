"use client";

import React from "react";
import { usePlatform } from "@/store/PlatformContext";
import { Table, Column } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Store } from "@/types";

export default function AdminStoresPage() {
  const { stores, approveStore } = usePlatform();

  const columns: Column<Store>[] = [
    { header: "Store Name", accessorKey: "name" },
    { header: "Category", accessorKey: "category" },
    { header: "Phone", accessorKey: "phone" },
    { header: "Rating", cell: (s) => <span>{s.rating} ★</span> },
    { header: "Status", cell: (s) => <StatusBadge status={s.isVerified ? "active" : "pending"} /> },
    {
      header: "Actions",
      cell: (s) => (
        <Button
          size="sm"
          variant={s.isVerified ? "secondary" : "primary"}
          disabled={s.isVerified}
          onClick={() => approveStore(s.id)}
        >
          {s.isVerified ? "Approved" : "Approve Store"}
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
        Store Approval & Verification
      </h1>
      <Table columns={columns} data={stores} keyExtractor={(s) => s.id} />
    </div>
  );
}
