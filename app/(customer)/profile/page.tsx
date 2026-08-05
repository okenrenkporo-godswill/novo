"use client";

import React, { useState } from "react";
import { User, MapPin, CreditCard, Heart, LogOut, ShieldCheck, Phone, Mail } from "lucide-react";
import { usePlatform } from "@/store/PlatformContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function CustomerProfilePage() {
  const { currentUser } = usePlatform();
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address || "");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-emerald-500 text-white font-black text-2xl flex items-center justify-center shadow-lg">
          {name.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">{name}</h1>
          <p className="text-xs text-slate-500">{currentUser.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-base font-black text-slate-900 dark:text-slate-100 mb-4">
            Personal Profile & Delivery Address
          </h3>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input
              label="Primary Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Button variant="primary" type="submit" className="mt-2 w-fit">
              {saved ? "Saved Successfully!" : "Save Changes"}
            </Button>
          </form>
        </div>

        <div className="md:col-span-4 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Account Security</h4>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Account</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
