"use client";

import React, { useState, useEffect } from "react";
import { usePlatform } from "@/store/PlatformContext";
import { Table, Column } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { RiderProfile } from "@/types";
import { apiService } from "@/services/api";

export default function AdminRidersPage() {
  const { riderProfile, verifyRider } = usePlatform();
  const [ridersList, setRidersList] = useState<RiderProfile[]>([riderProfile]);
  const [loading, setLoading] = useState(true);

  const fetchBackendRiders = async () => {
    setLoading(true);
    try {
      const data = await apiService.getRiders();
      if (Array.isArray(data) && data.length > 0) {
        setRidersList(data);
      } else {
        setRidersList([riderProfile]);
      }
    } catch (e) {
      console.warn("Failed to fetch backend riders:", e);
      setRidersList([riderProfile]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendRiders();
  }, []);

  const handleVerify = async (riderId: string) => {
    verifyRider(riderId);
    setRidersList((prev) =>
      prev.map((r) => (r.id === riderId ? { ...r, isVerified: true } : r))
    );
  };

  const columns: Column<RiderProfile>[] = [
    { header: "Name", accessorKey: "name" },
    { header: "Phone", accessorKey: "phone" },
    { header: "Vehicle Plate", accessorKey: "vehiclePlate" },
    { header: "Deliveries", accessorKey: "totalDeliveries" },
    { header: "Status", cell: (r) => <StatusBadge status={r.isVerified ? "verified" : "pending"} /> },
    {
      header: "Actions",
      cell: (r) => (
        <Button
          size="sm"
          variant={r.isVerified ? "secondary" : "primary"}
          disabled={r.isVerified}
          onClick={() => handleVerify(r.id)}
        >
          {r.isVerified ? "Verified Rider" : "Verify Rider"}
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          Rider Fleet Verification
        </h1>
        <span className="text-xs font-bold text-slate-500">
          {ridersList.length} Active Riders
        </span>
      </div>
      <Table columns={columns} data={ridersList} keyExtractor={(r) => r.id || "rider-1"} />
    </div>
  );
}
