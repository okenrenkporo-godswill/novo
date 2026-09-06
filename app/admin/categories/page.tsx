"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, CheckCircle2, Eye, EyeOff, Sparkles, Layers, Tag, Star, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { usePlatform } from "@/store/PlatformContext";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  isActive: boolean;
  itemCount: number;
  displayOrder: number;
}

interface SpecialFeatureItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  bannerImage: string;
  targetCategory: string;
  isActive: boolean;
  isFeaturedOnHome: boolean;
}

export default function AdminCategoriesPage() {
  const { stores, products } = usePlatform();

  // Initial Platform Categories
  const [categories, setCategories] = useState<CategoryItem[]>([
    {
      id: "cat-1",
      name: "Restaurants & Fast Food",
      slug: "restaurant",
      icon: "🍲",
      description: "Fresh hot meals, suya, grills, rice & continental dishes",
      isActive: true,
      itemCount: 42,
      displayOrder: 1,
    },
    {
      id: "cat-2",
      name: "Supermarket & Groceries",
      slug: "supermarket",
      icon: "🛍️",
      description: "Fresh produce, beverages, pantry items & household goods",
      isActive: true,
      itemCount: 88,
      displayOrder: 2,
    },
    {
      id: "cat-3",
      name: "Pharmacy & Health",
      slug: "pharmacy",
      icon: "💊",
      description: "Over-the-counter medicine, first aid, supplements & hygiene",
      isActive: true,
      itemCount: 29,
      displayOrder: 3,
    },
    {
      id: "cat-4",
      name: "Bakery & Pastries",
      slug: "bakery",
      icon: "🥐",
      description: "Cakes, bread, meat pies, donuts & confectionery",
      isActive: true,
      itemCount: 19,
      displayOrder: 4,
    },
    {
      id: "cat-5",
      name: "Drinks & Liquor",
      slug: "drinks",
      icon: "🥤",
      description: "Chilled wines, spirits, soft drinks, craft beers & energy drinks",
      isActive: true,
      itemCount: 35,
      displayOrder: 5,
    },
  ]);

  // Special Homepage Feature Highlight Collections
  const [specialFeatures, setSpecialFeatures] = useState<SpecialFeatureItem[]>([
    {
      id: "feat-1",
      title: "Top Picks Near You",
      subtitle: "Highest rated local spots delivered in under 25 mins",
      badge: "HOT 🔥",
      bannerImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80",
      targetCategory: "all",
      isActive: true,
      isFeaturedOnHome: true,
    },
    {
      id: "feat-2",
      title: "Express 15-min Supermarket",
      subtitle: "Instant grocery delivery right to your door step",
      badge: "FAST ⚡",
      bannerImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80",
      targetCategory: "supermarket",
      isActive: true,
      isFeaturedOnHome: true,
    },
    {
      id: "feat-3",
      title: "Late Night Munchies & Grills",
      subtitle: "Open till 3:00 AM for nocturnal food cravings",
      badge: "LATE NIGHT 🌙",
      bannerImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80",
      targetCategory: "restaurant",
      isActive: true,
      isFeaturedOnHome: true,
    },
  ]);

  // Modal States
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catIcon, setCatIcon] = useState("🏷️");
  const [catDesc, setCatDesc] = useState("");

  // Special Feature Modal
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<SpecialFeatureItem | null>(null);

  const [featTitle, setFeatTitle] = useState("");
  const [featSub, setFeatSub] = useState("");
  const [featBadge, setFeatBadge] = useState("NEW ✨");
  const [featBanner, setFeatBanner] = useState("");

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? { ...c, name: catName, slug: catSlug || catName.toLowerCase().replace(/[^a-z0-9]+/g, "-"), icon: catIcon, description: catDesc }
            : c
        )
      );
    } else {
      const newCat: CategoryItem = {
        id: `cat-${Date.now()}`,
        name: catName,
        slug: catSlug || catName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        icon: catIcon || "🏷️",
        description: catDesc,
        isActive: true,
        itemCount: 0,
        displayOrder: categories.length + 1,
      };
      setCategories((prev) => [...prev, newCat]);
    }
    setIsCategoryModalOpen(false);
  };

  const handleSaveFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFeature) {
      setSpecialFeatures((prev) =>
        prev.map((f) =>
          f.id === editingFeature.id
            ? { ...f, title: featTitle, subtitle: featSub, badge: featBadge, bannerImage: featBanner || f.bannerImage }
            : f
        )
      );
    } else {
      const newFeat: SpecialFeatureItem = {
        id: `feat-${Date.now()}`,
        title: featTitle,
        subtitle: featSub,
        badge: featBadge,
        bannerImage: featBanner || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80",
        targetCategory: "all",
        isActive: true,
        isFeaturedOnHome: true,
      };
      setSpecialFeatures((prev) => [...prev, newFeat]);
    }
    setIsFeatureModalOpen(false);
  };

  const toggleCategoryActive = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const toggleFeatureActive = (id: string) => {
    setSpecialFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f))
    );
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* HEADER TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Categories &amp; Special Features Control
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage top navigation categories, icons, and homepage featured highlight collections.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              setEditingCategory(null);
              setCatName("");
              setCatSlug("");
              setCatIcon("🍲");
              setCatDesc("");
              setIsCategoryModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add New Category
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setEditingFeature(null);
              setFeatTitle("");
              setFeatSub("");
              setFeatBadge("PROMO 🎁");
              setFeatBanner("");
              setIsFeatureModalOpen(true);
            }}
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Add Special Feature
          </Button>
        </div>
      </div>

      {/* SECTION 1: PLATFORM MAIN CATEGORIES */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-600" />
            <span>Platform Main Categories ({categories.length})</span>
          </h2>
          <span className="text-xs text-slate-500 font-bold">Visible in Top Bar &amp; Home Badges</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-slate-50 dark:bg-slate-800/60 p-5 flex flex-col justify-between gap-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{cat.icon}</span>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                        {cat.name}
                      </h4>
                      <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 font-bold">
                        /{cat.slug}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-black ${
                      cat.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {cat.isActive ? "ACTIVE" : "HIDDEN"}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {cat.description}
                </p>

                <div className="flex items-center justify-between pt-3 text-xs">
                  <span className="text-slate-400 font-bold">Order: #{cat.displayOrder}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleCategoryActive(cat.id)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                      title={cat.isActive ? "Hide Category" : "Show Category"}
                    >
                      {cat.isActive ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                    </button>
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setCatName(cat.name);
                        setCatSlug(cat.slug);
                        setCatIcon(cat.icon);
                        setCatDesc(cat.description);
                        setIsCategoryModalOpen(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-purple-600 cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: SPECIAL HOMEPAGE FEATURE HIGHLIGHTS */}
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Special Feature Highlights &amp; Banners</span>
          </h2>
          <span className="text-xs text-slate-500 font-bold">Appears in Customer Top Slider</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specialFeatures.map((feat) => (
              <div
                key={feat.id}
                className="bg-slate-50 dark:bg-slate-800/60 p-5 flex flex-col gap-4"
              >
                <div className="relative w-full h-36 bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <img
                    src={feat.bannerImage}
                    alt={feat.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-black">
                    {feat.badge}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {feat.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    Target: {feat.targetCategory.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFeatureActive(feat.id)}
                      className="p-1.5 text-slate-500 cursor-pointer"
                    >
                      {feat.isActive ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                    </button>
                    <button
                      onClick={() => {
                        setEditingFeature(feat);
                        setFeatTitle(feat.title);
                        setFeatSub(feat.subtitle);
                        setFeatBadge(feat.badge);
                        setFeatBanner(feat.bannerImage);
                        setIsFeatureModalOpen(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-purple-600 cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORY MODAL */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={editingCategory ? "Edit Platform Category" : "Create New Platform Category"}
      >
        <form onSubmit={handleSaveCategory} className="flex flex-col gap-4">
          <Input
            label="Category Name *"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            placeholder="e.g. Organic Groceries"
            required
          />
          <Input
            label="Category Slug"
            value={catSlug}
            onChange={(e) => setCatSlug(e.target.value)}
            placeholder="e.g. organic-groceries"
          />
          <Input
            label="Emoji Icon"
            value={catIcon}
            onChange={(e) => setCatIcon(e.target.value)}
            placeholder="e.g. 🥦"
          />
          <Input
            label="Short Description"
            value={catDesc}
            onChange={(e) => setCatDesc(e.target.value)}
            placeholder="e.g. Pure fresh organic farm produce"
          />
          <Button type="submit" variant="primary" className="w-full mt-2">
            {editingCategory ? "Save Category Changes" : "Create Category"}
          </Button>
        </form>
      </Modal>

      {/* SPECIAL FEATURE MODAL */}
      <Modal
        isOpen={isFeatureModalOpen}
        onClose={() => setIsFeatureModalOpen(false)}
        title={editingFeature ? "Edit Special Feature" : "Add Special Homepage Feature"}
      >
        <form onSubmit={handleSaveFeature} className="flex flex-col gap-4">
          <Input
            label="Feature Title *"
            value={featTitle}
            onChange={(e) => setFeatTitle(e.target.value)}
            placeholder="e.g. 50% Off Weekend Deals"
            required
          />
          <Input
            label="Subtitle"
            value={featSub}
            onChange={(e) => setFeatSub(e.target.value)}
            placeholder="e.g. Half price meals from top kitchens"
          />
          <Input
            label="Badge Tag"
            value={featBadge}
            onChange={(e) => setFeatBadge(e.target.value)}
            placeholder="e.g. 50% OFF 🔥"
          />
          <Input
            label="Banner Image URL"
            value={featBanner}
            onChange={(e) => setFeatBanner(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
          />
          <Button type="submit" variant="primary" className="w-full mt-2">
            {editingFeature ? "Save Feature Changes" : "Create Special Feature"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
