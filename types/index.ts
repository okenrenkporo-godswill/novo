export type UserRole = "customer" | "merchant" | "rider" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  address?: string;
  createdAt: string;
}

export interface CustomerProfile extends User {
  role: "customer";
  savedAddresses: string[];
  favoriteStoreIds: string[];
}

export interface ProductOption {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  options?: ProductOption[];
  rating?: number;
  preparationTimeMinutes?: number;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  banner: string;
  category: "restaurant" | "supermarket" | "pharmacy" | "express" | "drinks";
  cuisineType?: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  address: string;
  isOpening: boolean;
  isVerified: boolean;
  status: "active" | "pending" | "suspended";
  phone: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions?: ProductOption[];
  specialInstructions?: string;
}

export type OrderStatus =
  | "pending_merchant"
  | "preparing"
  | "ready_for_pickup"
  | "rider_assigned"
  | "picked_up"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  storeId: string;
  storeName: string;
  storeAddress: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tip: number;
  total: number;
  status: OrderStatus;
  paymentMethod: "card" | "cash" | "transfer";
  paymentStatus: "paid" | "pending" | "failed";
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  riderPhoto?: string;
  pickupCode?: string;
  estimatedDeliveryMinutes: number;
  createdAt: string;
  updatedAt: string;
  ratings?: {
    storeRating?: number;
    riderRating?: number;
    comment?: string;
  };
}

export interface RiderProfile extends User {
  role: "rider";
  isOnline: boolean;
  isVerified: boolean;
  verificationStatus: "verified" | "pending" | "rejected";
  vehicleType: "motorcycle" | "bicycle" | "car";
  vehiclePlate?: string;
  rating: number;
  totalDeliveries: number;
  currentOrderId?: string;
  earningsToday: number;
  earningsThisWeek: number;
  tipsToday: number;
}

export interface DeliveryRequest {
  id: string;
  orderId: string;
  storeName: string;
  storeAddress: string;
  customerAddress: string;
  distanceKm: number;
  estimatedEarnings: number;
  itemsCount: number;
  pickupCode: string;
  expiresInSeconds: number;
}

export interface PlatformAnalytics {
  totalRevenue: number;
  totalOrders: number;
  activeStoresCount: number;
  activeRidersCount: number;
  totalCustomersCount: number;
  gmvToday: number;
  commissionEarned: number;
}

export interface Review {
  id: string;
  orderId: string;
  customerName: string;
  storeId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
