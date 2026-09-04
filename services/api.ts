import { Store, Product, Order, RiderProfile, PlatformAnalytics, Review } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// Helper for authorized headers
const getAuthHeaders = (token?: string) => {
  const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("access_token") : "");
  return {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };
};

// INITIAL SEED STORES (Clean fallback)
export const INITIAL_STORES: Store[] = [];

// INITIAL SEED PRODUCTS
export const INITIAL_PRODUCTS: Product[] = [];

// INITIAL RIDERS
export const INITIAL_RIDERS: RiderProfile[] = [];

// INITIAL ORDERS
export const INITIAL_ORDERS: Order[] = [];

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
        if (Array.isArray(data)) return data;
      }
    } catch (e) {
      console.warn("Failed to fetch stores from backend API:", e);
    }
    return [];
  },

  getStoreById: async (id: string, token?: string): Promise<Store | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/stores/${id}`, {
        headers: getAuthHeaders(token),
      });
      if (res.ok) {
        const result = await res.json();
        return result.data || result;
      }
    } catch (e) {}
    return null;
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
    } catch (e) {
      console.warn("Failed to fetch products from backend API:", e);
    }
    return [];
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
      console.warn("Failed to fetch orders from backend API:", e);
    }
    return [];
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
    return null;
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

  recordPaymentTransaction: async (
    paymentId: string,
    payload: { provider_tx_id?: string; amount: number; currency?: string; status: string; raw_response?: any },
    token?: string
  ) => {
    const res = await fetch(`${API_BASE_URL}/payments/${paymentId}/transactions`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Recording transaction failed");
    return data;
  },

  verifyPayment: async (reference: string) => {
    const res = await fetch(`${API_BASE_URL}/payments/verify/${reference}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Payment verification failed");
    return data.data || data;
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
        if (Array.isArray(data)) return data;
      }
    } catch (e) {
      console.warn("Failed to fetch riders from backend API:", e);
    }
    return [];
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
      console.warn("Failed to fetch analytics from backend API:", e);
    }
    return {
      totalRevenue: 0,
      totalOrders: 0,
      activeStoresCount: 0,
      activeRidersCount: 0,
      totalCustomersCount: 0,
      gmvToday: 0,
      commissionEarned: 0,
    };
  },
};
