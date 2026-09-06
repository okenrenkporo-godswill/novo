"use client";

import React, { useState, useEffect } from "react";
import { usePlatform } from "@/store/PlatformContext";
import { Table, Column } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Store } from "@/types";
import { apiService } from "@/services/api";
import { Star, ShieldCheck, Sparkles, Edit3 } from "lucide-react";

export default function AdminStoresPage() {
  const { stores: contextStores, approveStore, updateStore } = usePlatform();
  const [storesList, setStoresList] = useState<Store[]>(contextStores);
  const [loading, setLoading] = useState(true);

  // Edit Store Config Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [customCommission, setCustomCommission] = useState("15");
  const [storeCategory, setStoreCategory] = useState("restaurant");

  const fetchBackendStores = async () => {
    setLoading(true);
    try {
      const data = await apiService.getStores();
      if (Array.isArray(data) && data.length > 0) {
        setStoresList(data);
      } else {
        setStoresList(contextStores);
      }
    } catch (e) {
      console.warn("Failed to fetch backend stores:", e);
      setStoresList(contextStores);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendStores();
  }, []);

  const handleApprove = async (storeId: string) => {
    approveStore(storeId);
    setStoresList((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, isVerified: true, status: "active" } : s))
    );
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      await apiService.toggleMerchantStatus(storeId, true, token || undefined);
    } catch (e) {
      console.warn("Backend toggle status note:", e);
    }
  };

  const handleToggleFeatured = (storeId: string) => {
    setStoresList((prev) =>
      prev.map((s) => {
        if (s.id === storeId) {
          const updated = { ...s, isOpening: !s.isOpening };
          updateStore(storeId, updated);
          return updated;
        }
        return s;
      })
    );
  };

  const handleSaveStoreConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStore) {
      updateStore(selectedStore.id, {
        category: storeCategory as any,
      });
      setStoresList((prev) =>
        prev.map((s) =>
          s.id === selectedStore.id
            ? { ...s, category: storeCategory as any }
            : s
        )
      );
    }
    setIsEditModalOpen(false);
  };

  const columns: Column<Store>[] = [
    { header: "Store Name", accessorKey: "name" },
    { header: "Category", accessorKey: "category" },
    { header: "Phone", accessorKey: "phone" },
    {
      header: "Featured on Home",
      cell: (s) => (
        <button
          onClick={() => handleToggleFeatured(s.id)}
          className={`px-3 py-1 text-xs font-black flex items-center gap-1 cursor-pointer ${
            s.isOpening !== false ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-500"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{s.isOpening !== false ? "Featured" : "Standard"}</span>
        </button>
      ),
    },
    { header: "Rating", cell: (s) => <span>{s.rating || 5.0} ★</span> },
    { header: "Status", cell: (s) => <StatusBadge status={s.isVerified ? "active" : "pending"} /> },
    {
      header: "Actions",
      cell: (s) => (
        <div className="flex items-center gap-2">
          {!s.isVerified && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleApprove(s.id)}
            >
              Approve Store
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedStore(s);
              setStoreCategory(s.category || "restaurant");
              setIsEditModalOpen(true);
            }}
          >
            <Edit3 className="w-3.5 h-3.5 mr-1" />
            Config
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Store Approvals &amp; Home Highlights
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Approve registered store merchants, feature top stores on customer home, and manage commission overrides.
          </p>
        </div>
        <span className="text-xs font-bold text-slate-500">
          {storesList.length} Stores Total
        </span>
      </div>

      <Table columns={columns} data={storesList} keyExtractor={(s) => s.id} />

      {/* EDIT STORE CONFIG MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Configure ${selectedStore?.name}`}
      >
        <form onSubmit={handleSaveStoreConfig} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Primary Store Category
            </label>
            <select
              value={storeCategory}
              onChange={(e) => setStoreCategory(e.target.value)}
              className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none"
            >
              <option value="restaurant">Restaurant / Fast Food 🍲</option>
              <option value="supermarket">Supermarket / Groceries 🛍️</option>
              <option value="pharmacy">Pharmacy / Medical 💊</option>
              <option value="bakery">Bakery &amp; Pastries 🥐</option>
              <option value="drinks">Drinks &amp; Liquor 🥤</option>
            </select>
          </div>

          <Input
            label="Merchant Commission Override (%)"
            type="number"
            value={customCommission}
            onChange={(e) => setCustomCommission(e.target.value)}
            placeholder="15"
          />

          <Button type="submit" variant="primary" className="w-full mt-2">
            Save Store Configuration
          </Button>
        </form>
      </Modal>
    </div>
  );
}
