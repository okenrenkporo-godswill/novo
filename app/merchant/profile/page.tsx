"use client";

import React, { useState } from "react";
import { usePlatform } from "@/store/PlatformContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function MerchantProfilePage() {
  const { stores, updateStore } = usePlatform();
  const myStore = stores[0];

  const [name, setName] = useState(myStore.name);
  const [phone, setPhone] = useState(myStore.phone);
  const [address, setAddress] = useState(myStore.address);
  const [deliveryFee, setDeliveryFee] = useState(String(myStore.deliveryFee));
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStore(myStore.id, {
      name,
      phone,
      address,
      deliveryFee: Number(deliveryFee),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Store Profile & Settings</h1>
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input label="Store / Restaurant Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <Input label="Delivery Fee (₦)" type="number" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)} />

          <Button variant="primary" type="submit" className="w-fit mt-2">
            {saved ? "Saved Successfully!" : "Save Profile Settings"}
          </Button>
        </form>
      </div>
    </div>
  );
}
