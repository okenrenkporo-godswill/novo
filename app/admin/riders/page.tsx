"use client";

import React from "react";
import { usePlatform } from "@/store/PlatformContext";
import { Table, Column } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { RiderProfile } from "@/types";

export default function AdminRidersPage() {
  const { riderProfile, verifyRider } = usePlatform();
  const ridersList: RiderProfile[] = [riderProfile];

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
          onClick={() => verifyRider(r.id)}
        >
          {r.isVerified ? "Verified Rider" : "Verify Rider"}
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
        Rider Fleet Verification
      </h1>
      <Table columns={columns} data={ridersList} keyExtractor={(r) => r.id} />
    </div>
  );
}
