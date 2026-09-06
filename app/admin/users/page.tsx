"use client";

import React, { useState, useEffect } from "react";
import { usePlatform } from "@/store/PlatformContext";
import { Table, Column } from "@/components/ui/Table";
import { User } from "@/types";
import { apiService } from "@/services/api";

export default function AdminUsersPage() {
  const { currentUser, riderProfile } = usePlatform();
  const defaultUsers: User[] = [
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

  const [usersList, setUsersList] = useState<User[]>(defaultUsers);
  const [loading, setLoading] = useState(true);

  const fetchBackendUsers = async () => {
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      const data = await apiService.getUsers(token || undefined);
      if (Array.isArray(data) && data.length > 0) {
        setUsersList(data);
      } else {
        setUsersList(defaultUsers);
      }
    } catch (e) {
      console.warn("Failed to fetch backend users:", e);
      setUsersList(defaultUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendUsers();
  }, []);

  const columns: Column<User>[] = [
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { header: "Phone", accessorKey: "phone" },
    { header: "Role", cell: (u) => <span className="font-bold capitalize">{u.role}</span> },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          Platform Users Directory
        </h1>
        <span className="text-xs font-bold text-slate-500">
          {usersList.length} Accounts Registered
        </span>
      </div>
      <Table columns={columns} data={usersList} keyExtractor={(u) => u.id} />
    </div>
  );
}
