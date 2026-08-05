"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
import { usePlatform } from "@/store/PlatformContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Product } from "@/types";

export default function MerchantMenuPage() {
  const { products, stores, addProduct, updateProduct, deleteProduct, toggleProductStock } =
    usePlatform();
  const myStore = stores[0];

  const storeProducts = products.filter((p) => p.storeId === myStore.id);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Mains");
  const [image, setImage] = useState("");

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    addProduct({
      storeId: myStore.id,
      name,
      description: description || "Freshly prepared meal from our kitchen.",
      price: Number(price),
      category: category || "Mains",
      image: image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
      inStock: true,
    });

    setIsAddModalOpen(false);
    setName("");
    setDescription("");
    setPrice("");
    setImage("");
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Menu & Product Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add new dishes, update prices, and manage in-stock availability.
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsAddModalOpen(true)}>
          Add New Dish / Product
        </Button>
      </div>

      {/* PRODUCTS LIST GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {storeProducts.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 gap-4 shadow-xs"
          >
            <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">{p.name}</h4>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                ₦{p.price.toLocaleString()}
              </span>
              <p className="text-[10px] text-slate-400 font-medium">{p.category}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleProductStock(p.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  p.inStock
                    ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                    : "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300"
                }`}
              >
                {p.inStock ? "In Stock" : "Sold Out"}
              </button>

              <button
                onClick={() => deleteProduct(p.id)}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD PRODUCT MODAL */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Product to Menu">
        <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
          <Input label="Dish / Item Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Category (e.g. Mains, Soups, Drinks)" value={category} onChange={(e) => setCategory(e.target.value)} required />
          <Input label="Price (₦)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input label="Image URL (Unsplash or web link)" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />

          <Button variant="primary" type="submit" className="w-full mt-2">
            Create Item
          </Button>
        </form>
      </Modal>
    </div>
  );
}
