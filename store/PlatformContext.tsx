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
import { INITIAL_STORES, INITIAL_PRODUCTS, INITIAL_RIDERS, INITIAL_ORDERS } from "@/services/api";

interface PlatformContextType {
  // Role & Auth State
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: User;

  // Stores
  stores: Store[];
  addStore: (store: Omit<Store, "id" | "rating" | "reviewCount" | "isVerified">) => void;
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
    address: "Apartment 4B, Palm Grove Estate, Okpe Road, Sapele",
    createdAt: new Date().toISOString(),
  });

  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
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

  // Load from LocalStorage on client start
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.stores) setStores(parsed.stores);
        if (parsed.products) setProducts(parsed.products);
        if (parsed.orders) setOrders(parsed.orders);
        if (parsed.cart) setCart(parsed.cart);
        if (parsed.riderProfile) setRiderProfile(parsed.riderProfile);
      }
    } catch (e) {
      console.warn("Failed to load state from localStorage", e);
    }
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
  const addStore = (storeData: Omit<Store, "id" | "rating" | "reviewCount" | "isVerified">) => {
    const newStore: Store = {
      ...storeData,
      id: `store-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      isVerified: false,
    };
    setStores((prev) => [newStore, ...prev]);
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
    const store = stores.find((s) => s.id === cart[0]?.product.storeId) || stores[0];
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      deliveryAddress: deliveryAddress || currentUser.address || "Sapele, Nigeria",
      storeId: store.id,
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

  return (
    <PlatformContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,

        stores,
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
