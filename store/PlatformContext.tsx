"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserRole,
  User,
  Store,
  Product,
  CartItem,
  Order,
  OrderStatus,
  RiderProfile,
  PlatformAnalytics,
  Review,
} from "@/types";
import { INITIAL_STORES, INITIAL_PRODUCTS, INITIAL_RIDERS, INITIAL_ORDERS, apiService } from "@/services/api";
import { getUniqueStoreBanner, getUniqueStoreLogo } from "@/utils/storeImageUtils";

interface PlatformContextType {
  // Role & Auth State
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: User;
  isAuthenticated: boolean;
  loginUser: (token: string, email?: string) => void;
  logout: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Stores
  stores: Store[];
  activeStoreId: string;
  setActiveStoreId: (id: string) => void;
  activeStore: Store;
  addStore: (store: Omit<Store, "id" | "rating" | "reviewCount" | "isVerified">) => Store;
  updateStore: (id: string, updates: Partial<Store>) => void;
  toggleStoreStatus: (id: string) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStock: (id: string) => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, selectedOptions?: any[], specialInstructions?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartTotal: number;

  // Orders
  orders: Order[];
  activeOrder: Order | null;
  placeOrder: (
    deliveryAddress: string,
    paymentMethod: "card" | "cash" | "transfer",
    tipAmount: number
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  rateOrder: (orderId: string, storeRating: number, riderRating: number, comment: string) => void;

  // Rider State
  riderProfile: RiderProfile;
  toggleRiderOnline: () => void;
  acceptDeliveryJob: (orderId: string) => void;
  completeDelivery: (orderId: string) => void;

  // Admin Analytics
  analytics: PlatformAnalytics;
  approveStore: (storeId: string) => void;
  verifyRider: (riderId: string) => void;

  // Reviews
  reviews: Review[];
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "novo_platform_state_v1";

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>("customer");

  const [currentUser] = useState<User>({
    id: "usr-100",
    name: "Godswill Okenrenkporo",
    email: "godswill@novo.ng",
    phone: "+234 802 111 9900",
    role: "customer",
    address: "Apartment 4B, Palm Grove Estate, Commercial Avenue",
    createdAt: new Date().toISOString(),
  });

  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [activeStoreId, setActiveStoreId] = useState<string>(INITIAL_STORES[0].id);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [riders, setRiders] = useState<RiderProfile[]>(INITIAL_RIDERS);
  const [riderProfile, setRiderProfile] = useState<RiderProfile>(INITIAL_RIDERS[0]);
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "rev-1",
      orderId: "ORD-9824",
      customerName: "Godswill Okenrenkporo",
      storeId: "store-1",
      rating: 5,
      comment: "Hot and super delicious Jollof rice! Driver delivered in 18 minutes. 5 stars!",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);

  const [favorites, setFavorites] = useState<string[]>(["store-1", "prod-1"]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = (localStorage.getItem("novo_theme") as "light" | "dark") || "light";
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("novo_theme", theme);
    }
  }, [theme]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth state on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      setIsAuthenticated(!!token);
    }
  }, []);

  const loginUser = (token: string, email?: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
      if (email) localStorage.setItem("user_email", email);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_email");
    }
    setIsAuthenticated(false);
  };

  // Load from LocalStorage on client start
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.stores && Array.isArray(parsed.stores)) {
          const map = new Map<string, Store>();
          parsed.stores.forEach((s: Store) => {
            if (s && s.id) map.set(s.id, s);
          });
          setStores(Array.from(map.values()));
        }
        if (parsed.products && Array.isArray(parsed.products)) {
          const map = new Map<string, Product>();
          parsed.products.forEach((p: Product) => {
            if (p && p.id) map.set(p.id, p);
          });
          setProducts(Array.from(map.values()));
        }
        if (parsed.orders) setOrders(parsed.orders);
        if (parsed.cart) setCart(parsed.cart);
        if (parsed.riderProfile) setRiderProfile(parsed.riderProfile);
      }
    } catch (e) {
      console.warn("Failed to load state from localStorage", e);
    }
  }, []);

  // Synchronize authenticated merchant profile store into stores state & set activeStoreId
  useEffect(() => {
    if (typeof window !== "undefined") {
      const rawProfile = localStorage.getItem("merchant_profile");
      if (rawProfile) {
        try {
          const profile = JSON.parse(rawProfile);
          if (profile.businessName) {
            const storeSlug = profile.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            const targetId = profile.id || `store-${storeSlug}`;

            setStores((prev) => {
              const map = new Map<string, Store>();
              prev.forEach((s) => map.set(s.id, s));

              const existing = prev.find(
                (s) =>
                  s.id === targetId ||
                  s.name.toLowerCase() === profile.businessName.toLowerCase() ||
                  s.slug === storeSlug
              );

              if (existing) {
                return Array.from(map.values());
              }

              const newMerchantStore: Store = {
                id: targetId,
                name: profile.businessName,
                slug: storeSlug,
                description: `${profile.businessName} - Quality food, drinks & fast delivery`,
                logo: getUniqueStoreLogo({ name: profile.businessName, category: profile.businessType }),
                banner: getUniqueStoreBanner({ name: profile.businessName, category: profile.businessType }),
                category: (profile.businessType || "restaurant").toLowerCase() as any,
                address: profile.address || "Central District",
                phone: profile.phone || "+234 800 000 0000",
                rating: 5.0,
                reviewCount: 0,
                deliveryFee: 450,
                deliveryTime: "20-30 min",
                minOrder: 1000,
                isOpening: true,
                isVerified: true,
                status: "active",
                cuisineType: profile.businessType || "Restaurant",
              };

              map.set(newMerchantStore.id, newMerchantStore);
              return Array.from(map.values());
            });

            setActiveStoreId(targetId);
          }
        } catch (e) {
          console.warn("Failed to sync merchant store profile:", e);
        }
      }
    }
  }, []);

  // Fetch backend stores and products on mount so new stores appear live for customers
  useEffect(() => {
    async function loadBackendStoresAndProducts() {
      try {
        const backendStores = await apiService.getStores();
        if (Array.isArray(backendStores) && backendStores.length > 0) {
          const formattedStores: Store[] = backendStores.map((bs: any) => ({
            id: bs.id,
            merchantId: bs.merchant_id,
            name: bs.name,
            slug: bs.slug || (bs.name ? bs.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `store-${bs.id}`),
            description: bs.description || `${bs.name} - Quality items & fast delivery`,
            category: (bs.store_type || "restaurant").toLowerCase() as any,
            address: bs.address || "Lagos, Nigeria",
            phone: bs.phone || "+2348000000000",
            rating: bs.rating || 5.0,
            reviewCount: bs.review_count || 0,
            isVerified: true,
            status: "active",
            isOpening: bs.is_open ?? true,
            banner: getUniqueStoreBanner({ id: bs.id, name: bs.name, category: bs.store_type, banner: bs.banner }),
            logo: getUniqueStoreLogo({ id: bs.id, name: bs.name, category: bs.store_type, logo: bs.logo }),
            deliveryFee: 450,
            deliveryTime: "20-30 min",
            minOrder: 1000,
            cuisineType: bs.store_type || "Restaurant",
          }));

          setStores((prev) => {
            const map = new Map<string, Store>();
            formattedStores.forEach((s) => map.set(s.id, s));
            prev.forEach((s) => {
              if (!map.has(s.id)) map.set(s.id, s);
            });
            return Array.from(map.values());
          });
        }

        const backendProducts = await apiService.getProducts();
        if (Array.isArray(backendProducts) && backendProducts.length > 0) {
          const formattedProducts: Product[] = backendProducts.map((bp: any) => ({
            id: bp.id,
            storeId: bp.store_id || bp.storeId,
            name: bp.name,
            description: bp.description || "",
            price: bp.price || 0,
            category: bp.category || "General",
            image: bp.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
            inStock: bp.in_stock !== false,
          }));
          setProducts((prev) => {
            const map = new Map<string, Product>();
            formattedProducts.forEach((p) => map.set(p.id, p));
            prev.forEach((p) => {
              if (!map.has(p.id)) map.set(p.id, p);
            });
            return Array.from(map.values());
          });
        }
      } catch (e) {
        console.error("Failed to load backend stores/products in PlatformContext:", e);
      }
    }

    loadBackendStoresAndProducts();
  }, []);

  // Save to LocalStorage on state change
  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ stores, products, orders, cart, riderProfile })
      );
    } catch (e) {
      console.warn("Failed to save state to localStorage", e);
    }
  }, [stores, products, orders, cart, riderProfile]);

  // Store management
  const addStore = (storeData: Omit<Store, "id" | "rating" | "reviewCount" | "isVerified">): Store => {
    const newId = `store-${Date.now()}`;
    const newStore: Store = {
      ...storeData,
      id: newId,
      banner: storeData.banner || getUniqueStoreBanner({ id: newId, name: storeData.name, category: storeData.category }),
      logo: storeData.logo || getUniqueStoreLogo({ id: newId, name: storeData.name, category: storeData.category }),
      rating: 5.0,
      reviewCount: 0,
      isVerified: true,
      status: "active",
      isOpening: true,
    };
    setStores((prev) => [newStore, ...prev]);
    setActiveStoreId(newStore.id);
    return newStore;
  };

  const updateStore = (id: string, updates: Partial<Store>) => {
    setStores((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const toggleStoreStatus = (id: string) => {
    setStores((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isOpening: !s.isOpening } : s))
    );
  };

  // Product management
  const addProduct = (productData: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleProductStock = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
  };

  // Cart operations
  const addToCart = (
    product: Product,
    quantity = 1,
    selectedOptions: any[] = [],
    specialInstructions = ""
  ) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prevCart,
        {
          product,
          quantity,
          selectedOptions,
          specialInstructions,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((acc, item) => {
    const optionsPrice = (item.selectedOptions || []).reduce((oAcc, opt) => oAcc + opt.price, 0);
    return acc + (item.product.price + optionsPrice) * item.quantity;
  }, 0);

  const cartDeliveryFee = cart.length > 0 ? 450 : 0;
  const cartServiceFee = cart.length > 0 ? 200 : 0;
  const cartTotal = cartSubtotal + cartDeliveryFee + cartServiceFee;

  // Orders
  const placeOrder = (
    deliveryAddress: string,
    paymentMethod: "card" | "cash" | "transfer",
    tipAmount = 0
  ): Order => {
    const targetStoreId = cart[0]?.product?.storeId || (cart[0]?.product as any)?.store_id;
    const store = stores.find((s) => s.id === targetStoreId) || stores[0];
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      deliveryAddress: deliveryAddress || currentUser.address || "14 Commercial Avenue, Central District",
      storeId: targetStoreId || store.id,
      storeName: store.name,
      storeAddress: store.address,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee: cartDeliveryFee,
      serviceFee: cartServiceFee,
      tip: tipAmount,
      total: cartSubtotal + cartDeliveryFee + cartServiceFee + tipAmount,
      status: "pending_merchant",
      paymentMethod,
      paymentStatus: paymentMethod === "cash" ? "pending" : "paid",
      pickupCode: String(Math.floor(1000 + Math.random() * 9000)),
      estimatedDeliveryMinutes: 25,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status,
              updatedAt: new Date().toISOString(),
              ...(status === "rider_assigned" && !ord.riderId
                ? {
                    riderId: riderProfile.id,
                    riderName: riderProfile.name,
                    riderPhone: riderProfile.phone,
                    riderPhoto: riderProfile.avatar,
                  }
                : {}),
            }
          : ord
      )
    );
  };

  const rateOrder = (
    orderId: string,
    storeRating: number,
    riderRating: number,
    comment: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              ratings: { storeRating, riderRating, comment },
            }
          : ord
      )
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder && comment) {
      const newReview: Review = {
        id: `rev-${Date.now()}`,
        orderId,
        customerName: targetOrder.customerName,
        storeId: targetOrder.storeId,
        rating: storeRating,
        comment,
        createdAt: new Date().toISOString(),
      };
      setReviews((prev) => [newReview, ...prev]);
    }
  };

  // Rider actions
  const toggleRiderOnline = () => {
    setRiderProfile((prev) => ({ ...prev, isOnline: !prev.isOnline }));
  };

  const acceptDeliveryJob = (orderId: string) => {
    setRiderProfile((prev) => ({ ...prev, currentOrderId: orderId }));
    updateOrderStatus(orderId, "rider_assigned");
  };

  const completeDelivery = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    const earned = targetOrder ? targetOrder.deliveryFee + targetOrder.tip : 950;

    setRiderProfile((prev) => ({
      ...prev,
      currentOrderId: undefined,
      totalDeliveries: prev.totalDeliveries + 1,
      earningsToday: prev.earningsToday + earned,
      earningsThisWeek: prev.earningsThisWeek + earned,
      tipsToday: prev.tipsToday + (targetOrder?.tip || 0),
    }));

    updateOrderStatus(orderId, "delivered");
  };

  // Admin actions
  const approveStore = (storeId: string) => {
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, isVerified: true, status: "active" } : s))
    );
  };

  const verifyRider = (riderId: string) => {
    setRiders((prev) =>
      prev.map((r) => (r.id === riderId ? { ...r, isVerified: true, verificationStatus: "verified" } : r))
    );
  };

  const activeOrder = orders[0] || null;

  // Platform Analytics computation
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const commissionEarned = Math.round(totalRevenue * 0.15);

  const analytics: PlatformAnalytics = {
    totalRevenue: totalRevenue || 1245000,
    totalOrders: orders.length,
    activeStoresCount: stores.filter((s) => s.status === "active").length,
    activeRidersCount: riders.length,
    totalCustomersCount: 3890 + orders.length,
    gmvToday: totalRevenue || 185400,
    commissionEarned: commissionEarned || 18540,
  };

  const activeStore = stores.find((s) => s.id === activeStoreId) || stores[0];

  return (
    <PlatformContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        isAuthenticated,
        loginUser,
        logout,
        favorites,
        toggleFavorite,
        theme,
        toggleTheme,

        stores,
        activeStoreId,
        setActiveStoreId,
        activeStore,
        addStore,
        updateStore,
        toggleStoreStatus,

        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStock,

        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartDeliveryFee,
        cartTotal,

        orders,
        activeOrder,
        placeOrder,
        updateOrderStatus,
        rateOrder,

        riderProfile,
        toggleRiderOnline,
        acceptDeliveryJob,
        completeDelivery,

        analytics,
        approveStore,
        verifyRider,

        reviews,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error("usePlatform must be used within a PlatformProvider");
  }
  return context;
};
