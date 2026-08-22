import { Store, Product, Order, RiderProfile, PlatformAnalytics, Review } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Helper for authorized headers
const getAuthHeaders = (token?: string) => {
  const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("access_token") : "");
  return {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };
};

// INITIAL SEED STORES (Fallback & Offline Mocking)
export const INITIAL_STORES: Store[] = [
  {
    id: "store-1",
    name: "FoodLAND Restaurant",
    slug: "foodland-restaurant",
    description: "Authentic African delicacies, Jollof Rice, Fried Rice, Pounded Yam & Egusi Soup.",
    logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80",
    banner: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80",
    category: "restaurant",
    cuisineType: "African • Rice",
    rating: 4.8,
    reviewCount: 342,
    deliveryTime: "25-35 min",
    deliveryFee: 450,
    minOrder: 1500,
    address: "24 Commercial Avenue, Central District",
    isOpening: true,
    isVerified: true,
    status: "active",
    phone: "+234 803 123 4567",
  },
  {
    id: "store-2",
    name: "Mama Cass Kitchen",
    slug: "mama-cass-kitchen",
    description: "Homestyle Traditional Nigerian Soups, Pepper Soup, Fisherman Soup & Plantain.",
    logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80",
    banner: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
    category: "restaurant",
    cuisineType: "Traditional • Soups",
    rating: 4.7,
    reviewCount: 215,
    deliveryTime: "30-40 min",
    deliveryFee: 500,
    minOrder: 2000,
    address: "12 Mission Road, Central District",
    isOpening: true,
    isVerified: true,
    status: "active",
    phone: "+234 802 987 6543",
  },
  {
    id: "store-3",
    name: "SmallChops & Grills Express",
    slug: "smallchops-grills-express",
    description: "Crispy Samosa, Spring Rolls, Puff-Puff, Suya & Grilled Chicken Wings.",
    logo: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=200&q=80",
    banner: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80",
    category: "restaurant",
    cuisineType: "Finger Food • Suya",
    rating: 4.9,
    reviewCount: 512,
    deliveryTime: "15-25 min",
    deliveryFee: 350,
    minOrder: 1000,
    address: "88 Express Highway, Central District",
    isOpening: true,
    isVerified: true,
    status: "active",
    phone: "+234 814 555 7788",
  },
  {
    id: "store-4",
    name: "Metro Central Supermarket",
    slug: "metro-central-supermarket",
    description: "Groceries, Fresh Fruits, Drinks, Toiletries, Dairy & Household Items.",
    logo: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=200&q=80",
    banner: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1000&q=80",
    category: "supermarket",
    cuisineType: "Groceries • Essentials",
    rating: 4.6,
    reviewCount: 180,
    deliveryTime: "20-30 min",
    deliveryFee: 400,
    minOrder: 1200,
    address: "5 Market Road, Central District",
    isOpening: true,
    isVerified: true,
    status: "active",
    phone: "+234 805 111 2233",
  },
  {
    id: "store-5",
    name: "HealthFirst Pharmacy",
    slug: "healthfirst-pharmacy",
    description: "Prescription drugs, Vitamins, First Aid, Hygiene & Wellness essentials.",
    logo: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=200&q=80",
    banner: "https://images.unsplash.com/photo-1631549912264-377863931b47?auto=format&fit=crop&w=1000&q=80",
    category: "pharmacy",
    cuisineType: "Meds • Wellness",
    rating: 4.9,
    reviewCount: 94,
    deliveryTime: "15-20 min",
    deliveryFee: 300,
    minOrder: 800,
    address: "14 Hospital Road, Central District",
    isOpening: true,
    isVerified: true,
    status: "active",
    phone: "+234 809 333 4455",
  },
];

// INITIAL SEED PRODUCTS
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    storeId: "store-1",
    name: "Smokey Party Jollof Rice + Fried Plantain & Chicken",
    description: "Fragrant smokey wood-fired Nigerian Jollof rice served with ripe sweet fried plantain and seasoned fried chicken quarter.",
    price: 3500,
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=600&q=80",
    category: "Mains",
    inStock: true,
    rating: 4.9,
    preparationTimeMinutes: 20,
    options: [
      { id: "opt-1", name: "Extra Fried Chicken", price: 1200 },
      { id: "opt-2", name: "Add Coleslaw", price: 500 },
      { id: "opt-3", name: "Add Boiled Egg", price: 300 },
    ],
  },
  {
    id: "prod-2",
    storeId: "store-1",
    name: "Pounded Yam with Goat Meat Egusi Soup",
    description: "Smooth velvety pounded yam served with rich melon Egusi soup loaded with tender goat meat and stockfish.",
    price: 4200,
    image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80",
    category: "Swallow & Soups",
    inStock: true,
    rating: 4.8,
    preparationTimeMinutes: 25,
    options: [
      { id: "opt-4", name: "Extra Goat Meat", price: 1500 },
      { id: "opt-5", name: "Add Assorted Meat", price: 1000 },
    ],
  },
  {
    id: "prod-3",
    storeId: "store-2",
    name: "Signature Catfish Pepper Soup",
    description: "Freshly caught catfish cooked in aromatic traditional herbal spices, chili pepper, and fresh scented leaves.",
    price: 4500,
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80",
    category: "Pepper Soup",
    inStock: true,
    rating: 4.9,
    preparationTimeMinutes: 25,
  },
  {
    id: "prod-4",
    storeId: "store-3",
    name: "Mega Smallchops Platter (30 Pieces)",
    description: "Crispy Samosas, Spring Rolls, Puff-Puff, Gizzard & Spicy Beef Suya strips.",
    price: 5500,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
    category: "Finger Foods",
    inStock: true,
    rating: 5.0,
    preparationTimeMinutes: 15,
  },
  {
    id: "prod-5",
    storeId: "store-4",
    name: "Fresh Whole Milk 1L",
    description: "Pure pasteurized whole milk, rich in calcium and vitamins.",
    price: 1800,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80",
    category: "Dairy",
    inStock: true,
  },
  {
    id: "prod-6",
    storeId: "store-5",
    name: "Vitamin C 1000mg Effervescent (20 Tablets)",
    description: "High potency immune support with Zinc and Bioflavonoids.",
    price: 2500,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
    category: "Vitamins",
    inStock: true,
  },
];

// INITIAL RIDERS
export const INITIAL_RIDERS: RiderProfile[] = [
  {
    id: "rider-1",
    name: "Emmanuel Okafor",
    email: "emmanuel.rider@novo.ng",
    phone: "+234 812 345 6789",
    role: "rider",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    address: "Commercial Avenue",
    createdAt: new Date().toISOString(),
    isOnline: true,
    isVerified: true,
    verificationStatus: "verified",
    vehicleType: "motorcycle",
    vehiclePlate: "SL-884-XY",
    rating: 4.9,
    totalDeliveries: 428,
    earningsToday: 14500,
    earningsThisWeek: 68000,
    tipsToday: 2500,
  },
  {
    id: "rider-2",
    name: "Blessing Akpan",
    email: "blessing.rider@novo.ng",
    phone: "+234 816 777 8899",
    role: "rider",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    address: "Market Road",
    createdAt: new Date().toISOString(),
    isOnline: true,
    isVerified: true,
    verificationStatus: "verified",
    vehicleType: "motorcycle",
    vehiclePlate: "SP-102-AB",
    rating: 4.8,
    totalDeliveries: 312,
    earningsToday: 11200,
    earningsThisWeek: 54000,
    tipsToday: 1800,
  },
];

// INITIAL ORDERS
export const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-9824",
    customerId: "cust-1",
    customerName: "Godswill Okenrenkporo",
    customerPhone: "+234 802 111 9900",
    deliveryAddress: "Apartment 4B, Palm Grove Estate, Commercial Avenue",
    storeId: "store-1",
    storeName: "FoodLAND Restaurant",
    storeAddress: "24 Commercial Avenue",
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 2,
        selectedOptions: [INITIAL_PRODUCTS[0].options![0]],
      },
    ],
    subtotal: 9400,
    deliveryFee: 450,
    serviceFee: 200,
    tip: 500,
    total: 10550,
    status: "preparing",
    paymentMethod: "card",
    paymentStatus: "paid",
    riderId: "rider-1",
    riderName: "Emmanuel Okafor",
    riderPhone: "+234 812 345 6789",
    riderPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    pickupCode: "4819",
    estimatedDeliveryMinutes: 20,
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
];

// COMPLETE NOVO MODULAR MONOLITH BACKEND INTEGRATED API SERVICE
export const apiService = {
  // 1. AUTHENTICATION MODULE (/api/v1/auth)
  signUp: async (payload: {
    email: string;
    password: string;
    full_name?: string;
    role?: string;
    phone?: string;
  }) => {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Registration failed");
    return data;
  },

  login: async (payload: { email: string; password: string }) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Login failed");
    return data;
  },

  verifyOtp: async (payload: { email: string; token: string }) => {
    const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "OTP verification failed");
    return data;
  },

  getMe: async (token?: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to fetch auth details");
    return data;
  },

  // 2. USERS PROFILE MODULE (/api/v1/users)
  getUserProfile: async (token?: string) => {
    const res = await fetch(`${API_BASE_URL}/users/me`, {
      headers: getAuthHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to fetch profile");
    return data;
  },

  updateUserProfile: async (payload: { full_name?: string; phone?: string }, token?: string) => {
    const res = await fetch(`${API_BASE_URL}/users/me`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to update profile");
    return data;
  },

  uploadUserAvatar: async (formData: FormData, token?: string) => {
    const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("access_token") : "");
    const res = await fetch(`${API_BASE_URL}/users/me/avatar`, {
      method: "POST",
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Avatar upload failed");
    return data;
  },

  // 3. ADDRESSES MODULE (/api/v1/addresses)
  getAddresses: async (token?: string) => {
    const res = await fetch(`${API_BASE_URL}/addresses/`, {
      headers: getAuthHeaders(token),
    });
    if (res.ok) return await res.json();
    return [];
  },

  createAddress: async (
    payload: { label: string; address_text: string; delivery_instructions?: string; is_default?: boolean },
    token?: string
  ) => {
    const res = await fetch(`${API_BASE_URL}/addresses/`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to add address");
    return data;
  },

  setDefaultAddress: async (addressId: string, token?: string) => {
    const res = await fetch(`${API_BASE_URL}/addresses/${addressId}/default`, {
      method: "PATCH",
      headers: getAuthHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to set default address");
    return data;
  },

  // 4. MERCHANTS MODULE (/api/v1/merchants)
  getMerchantMe: async (token?: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/merchants/me`, {
        headers: getAuthHeaders(token),
      });
      if (res.ok) {
        const result = await res.json();
        return result.data || result;
      }
    } catch (e) {}
    return null;
  },

  getMerchants: async (token?: string) => {
    const res = await fetch(`${API_BASE_URL}/merchants`, {
      headers: getAuthHeaders(token),
    });
    if (res.ok) {
      const result = await res.json();
      return result.data || result;
    }
    return [];
  },

  createMerchant: async (payload: { name: string; owner_id?: string }, token?: string) => {
    const res = await fetch(`${API_BASE_URL}/merchants`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to register merchant");
    return data;
  },

  // 5. STORES MODULE (/api/v1/stores)
  getStores: async (token?: string): Promise<Store[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/stores`, {
        headers: getAuthHeaders(token),
      });
      if (res.ok) {
        const result = await res.json();
        const data = result.data || result;
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      // Fallback to offline seed data
    }
    return Promise.resolve(INITIAL_STORES);
  },

  getStoreById: async (id: string, token?: string): Promise<Store> => {
    try {
      const res = await fetch(`${API_BASE_URL}/stores/${id}`, {
        headers: getAuthHeaders(token),
      });
      if (res.ok) {
        const result = await res.json();
        return result.data || result;
      }
    } catch (e) {}
    return INITIAL_STORES.find((s) => s.id === id) || INITIAL_STORES[0];
  },

  createStore: async (payload: Partial<Store>, token?: string) => {
    const res = await fetch(`${API_BASE_URL}/stores`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to create store");
    return data;
  },

  updateStore: async (storeId: string, payload: Partial<Store>, token?: string) => {
    const res = await fetch(`${API_BASE_URL}/stores/${storeId}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to update store");
    return data;
  },

  toggleStoreOpenStatus: async (storeId: string, token?: string) => {
    const res = await fetch(`${API_BASE_URL}/stores/${storeId}/toggle-open`, {
      method: "PATCH",
      headers: getAuthHeaders(token),
    });
    return await res.json();
  },

  // 6. PRODUCTS MODULE (/api/v1/products)
  getProducts: async (storeId?: string, token?: string): Promise<Product[]> => {
    try {
      const url = storeId
        ? `${API_BASE_URL}/products?store_id=${storeId}`
        : `${API_BASE_URL}/products`;
      const res = await fetch(url, {
        headers: getAuthHeaders(token),
      });
      if (res.ok) {
        const result = await res.json();
        const data = result.data || result;
        if (Array.isArray(data)) return data;
      }
    } catch (e) {}
    if (token) return [];
    if (storeId) {
      return Promise.resolve(INITIAL_PRODUCTS.filter((p) => p.storeId === storeId));
    }
    return Promise.resolve(INITIAL_PRODUCTS);
  },

  createProduct: async (payload: Partial<Product>, token?: string) => {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to create product");
    return data;
  },

  toggleProductStock: async (productId: string, token?: string) => {
    const res = await fetch(`${API_BASE_URL}/products/${productId}/toggle-stock`, {
      method: "PATCH",
      headers: getAuthHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to toggle product stock");
    return data;
  },

  deleteProduct: async (productId: string, token?: string) => {
    const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to delete product");
    return data;
  },

  // 7. CART MODULE (/api/v1/carts)
  getCartSession: async (token?: string) => {
    const res = await fetch(`${API_BASE_URL}/carts/`, {
      headers: getAuthHeaders(token),
    });
    if (res.ok) {
      const result = await res.json();
      return result.data || result;
    }
    return null;
  },

  addToCartSession: async (productId: string, quantity: number, token?: string) => {
    const res = await fetch(`${API_BASE_URL}/carts/items?product_id=${productId}&quantity=${quantity}`, {
      method: "POST",
      headers: getAuthHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to add item to cart");
    return data;
  },

  clearCartSession: async (token?: string) => {
    const res = await fetch(`${API_BASE_URL}/carts/`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });
    return await res.json();
  },

  // 8. ORDERS MODULE (/api/v1/orders)
  getOrders: async (storeId?: string, token?: string): Promise<Order[]> => {
    try {
      const url = storeId
        ? `${API_BASE_URL}/orders?store_id=${storeId}`
        : `${API_BASE_URL}/orders`;
      const res = await fetch(url, {
        headers: getAuthHeaders(token),
      });
      if (res.ok) {
        const result = await res.json();
        const data = result.data || result;
        if (Array.isArray(data)) return data;
      }
    } catch (e) {
      // Fallback
    }
    if (token) return [];
    return Promise.resolve(INITIAL_ORDERS);
  },

  getOrderById: async (orderId: string, token?: string): Promise<Order | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        headers: getAuthHeaders(token),
      });
      if (res.ok) {
        const result = await res.json();
        return result.data || result;
      }
    } catch (e) {}
    return INITIAL_ORDERS.find((o) => o.id === orderId) || null;
  },

  getOrderHistory: async (orderId: string, token?: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/history`, {
        headers: getAuthHeaders(token),
      });
      if (res.ok) {
        const result = await res.json();
        return result.data || result;
      }
    } catch (e) {}
    return [];
  },

  createOrder: async (payload: any, token?: string) => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to place order");
    return data;
  },

  updateOrderStatus: async (orderId: string, status: string, token?: string) => {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status?status=${status}`, {
      method: "PATCH",
      headers: getAuthHeaders(token),
    });
    return await res.json();
  },

  cancelOrder: async (orderId: string, reason: string, token?: string) => {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ reason }),
    });
    return await res.json();
  },

  // 9. PAYMENTS MODULE (/api/v1/payments)
  getPaymentForOrder: async (orderId: string, token?: string) => {
    const res = await fetch(`${API_BASE_URL}/payments/${orderId}`, {
      headers: getAuthHeaders(token),
    });
    if (res.ok) {
      const result = await res.json();
      return result.data || result;
    }
    return null;
  },

  initiatePayment: async (payload: { order_id: string; amount: number; payment_method: string }, token?: string) => {
    const res = await fetch(`${API_BASE_URL}/payments`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Payment initialization failed");
    return data;
  },

  // 10. WALLETS MODULE (/api/v1/wallets)
  getWallets: async (token?: string) => {
    const res = await fetch(`${API_BASE_URL}/wallets`, {
      headers: getAuthHeaders(token),
    });
    if (res.ok) {
      const result = await res.json();
      return result.data || result;
    }
    return [];
  },

  getWalletBalance: async (currency = "NGN", token?: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/wallets/${currency}/balance`, {
        headers: getAuthHeaders(token),
      });
      if (res.ok) {
        const result = await res.json();
        return result.data || result;
      }
    } catch (e) {}
    return { balance: 0, currency };
  },

  getWalletTransactions: async (currency = "NGN", token?: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/wallets/${currency}/transactions`, {
        headers: getAuthHeaders(token),
      });
      if (res.ok) {
        const result = await res.json();
        return result.data || result;
      }
    } catch (e) {}
    return [];
  },

  requestPayoutDebit: async (payload: { amount: number; currency?: string; description?: string }, token?: string) => {
    const res = await fetch(`${API_BASE_URL}/wallets/debit`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({
        currency: payload.currency || "NGN",
        amount: payload.amount,
        description: payload.description || "Merchant wallet payout request",
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Payout request failed");
    return data;
  },

  // 11. DELIVERIES & LOGISTICS MODULE (/api/v1/deliveries)
  getDeliveryByOrderId: async (orderId: string, token?: string) => {
    const res = await fetch(`${API_BASE_URL}/deliveries/order/${orderId}`, {
      headers: getAuthHeaders(token),
    });
    if (res.ok) return await res.json();
    return null;
  },

  updateDeliveryStatus: async (deliveryId: string, status: string, token?: string) => {
    const res = await fetch(`${API_BASE_URL}/deliveries/${deliveryId}/status?status=${status}`, {
      method: "PATCH",
      headers: getAuthHeaders(token),
    });
    return await res.json();
  },

  postRiderGpsLocation: async (payload: { latitude: number; longitude: number }, token?: string) => {
    const res = await fetch(`${API_BASE_URL}/deliveries/rider/location`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  // 12. RIDERS MODULE (/api/v1/riders)
  getRiders: async (): Promise<RiderProfile[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/riders/`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      // Fallback
    }
    return Promise.resolve(INITIAL_RIDERS);
  },

  toggleRiderOnlineStatus: async (token?: string) => {
    const res = await fetch(`${API_BASE_URL}/riders/me/status`, {
      method: "PATCH",
      headers: getAuthHeaders(token),
    });
    return await res.json();
  },

  // 13. FILE UPLOADS & IMAGES MODULE (/api/v1/uploads)
  uploadSingleImage: async (formData: FormData, token?: string) => {
    const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("access_token") : "");
    const res = await fetch(`${API_BASE_URL}/uploads/`, {
      method: "POST",
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Image upload failed");
    return data;
  },

  // 14. INVENTORY & CSV BULK IMPORT MODULE (/api/v1/inventory)
  importInventoryCSV: async (file: File, token?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("access_token") : "");

    const res = await fetch(`${API_BASE_URL}/inventory/import`, {
      method: "POST",
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "CSV Inventory import failed");
    return data;
  },

  // 15. ANALYTICS MODULE (/api/v1/analytics)
  getAnalytics: async (token?: string): Promise<PlatformAnalytics> => {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics`, {
        headers: getAuthHeaders(token),
      });
      if (res.ok) {
        const result = await res.json();
        const data = result.data || result;
        if (data && typeof data === "object") return data;
      }
    } catch (e) {
      // Fallback
    }
    if (token) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        activeStoresCount: 0,
        activeRidersCount: 0,
        totalCustomersCount: 0,
        gmvToday: 0,
        commissionEarned: 0,
      };
    }
    return Promise.resolve({
      totalRevenue: 0,
      totalOrders: 0,
      activeStoresCount: INITIAL_STORES.length,
      activeRidersCount: INITIAL_RIDERS.length,
      totalCustomersCount: 0,
      gmvToday: 0,
      commissionEarned: 0,
    });
  },
};
