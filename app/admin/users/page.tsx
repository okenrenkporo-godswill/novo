"use client";

import React from "react";
import { usePlatform } from "@/store/PlatformContext";
import { Table, Column } from "@/components/ui/Table";
import { User } from "@/types";

export default function AdminUsersPage() {
  const { currentUser, riderProfile } = usePlatform();

  const users: User[] = [
    currentUser,
    riderProfile,
    {
      id: "usr-200",
      name: "FoodLAND Merchant Admin",
      email: "merchant@foodland.ng",
      phone: "+234 803 123 4567",
      role: "merchant",
      createdAt: new Date().toISOString(),
    },
  ];

  const columns: Column<User>[] = [
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { header: "Phone", accessorKey: "phone" },
    { header: "Role", cell: (u) => <span className="font-bold capitalize">{u.role}</span> },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
        Platform Users Directory
      </h1>
      <Table columns={columns} data={users} keyExtractor={(u) => u.id} />
    </div>
  );
}
