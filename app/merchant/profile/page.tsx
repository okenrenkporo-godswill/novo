"use client";

import React, { useState, useEffect } from "react";
import { usePlatform } from "@/store/PlatformContext";
import { Store as StoreIcon, Clock, MapPin, Phone, Upload, Check } from "lucide-react";

export default function MerchantProfilePage() {
  const { stores, activeStore, updateStore } = usePlatform();
  const myStore = activeStore || stores[0];

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cuisineType, setCuisineType] = useState("Fast Food • Local Foods");
  const [deliveryFee, setDeliveryFee] = useState("450");
  const [minOrder, setMinOrder] = useState("1500");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("merchant_profile");
      if (raw) {
        try {
          const profile = JSON.parse(raw);
          if (profile.businessName) setName(profile.businessName);
          if (profile.address) setAddress(profile.address);
          if (profile.phone) setPhone(profile.phone);
          if (profile.email) setEmail(profile.email);
          if (profile.businessType) setCuisineType(profile.businessType);
        } catch (e) {}
      } else if (myStore) {
        setName(myStore.name || "");
        setAddress(myStore.address || "");
        setPhone(myStore.phone || "");
        setCuisineType(myStore.cuisineType || "Fast Food");
      }
    }
  }, [myStore]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProfile = {
      fullName: name + " Owner",
      businessName: name,
      address,
      phone,
      email,
      businessType: cuisineType,
      deliveryFee: Number(deliveryFee),
      minOrder: Number(minOrder),
      isVerified: true,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("merchant_profile", JSON.stringify(updatedProfile));
    }

    if (myStore?.id) {
      updateStore(myStore.id, {
        name,
        address,
        phone,
        cuisineType,
        deliveryFee: Number(deliveryFee),
        minOrder: Number(minOrder),
      });
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-12 font-sans text-[#17201D] dark:text-slate-100">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Store Profile & Settings</h1>
        <p className="text-xs text-[#66736E] dark:text-slate-400 font-medium mt-1">Manage store profile information, delivery rules and weekly operating hours</p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-[#087F5B] dark:text-emerald-300 text-xs font-black flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Store settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-5">
        <h3 className="text-base font-black text-slate-900 dark:text-white">Business Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-black text-slate-700 dark:text-slate-300">Store Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Suya Kingdom"
              required
              className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-700 dark:text-slate-300">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234 803 123 4567"
              required
              className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-black text-slate-700 dark:text-slate-300">Business Category / Tags</label>
            <input
              type="text"
              value={cuisineType}
              onChange={(e) => setCuisineType(e.target.value)}
              placeholder="e.g. Restaurant, Fast Food, Suya"
              required
              className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-700 dark:text-slate-300">Business Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="store@restaurant.com"
              className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-black text-slate-700 dark:text-slate-300">Store Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 14 Commercial Avenue, Sapele"
            required
            className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none text-slate-900 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-black text-slate-700 dark:text-slate-300">Delivery Fee (₦)</label>
            <input
              type="number"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-700 dark:text-slate-300">Minimum Order (₦)</label>
            <input
              type="number"
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-fit px-8 py-3 rounded-2xl bg-[#087F5B] text-white text-xs font-black hover:bg-[#065A43] transition-all cursor-pointer shadow-md shadow-[#087F5B]/20"
        >
          Save Store Profile
        </button>
      </form>
    </div>
  );
}
