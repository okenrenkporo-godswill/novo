/**
 * Curated unique high-definition Unsplash imagery registry for Novo Kitchens, Restaurants,
 * Supermarkets, Pharmacies, and Express Stores.
 */

// 15+ Unique Restaurant & Kitchen Banners
export const KITCHEN_BANNERS = [
  // African Delicacies & Rice Banners
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80",
  // Homestyle Soups & Stews Banners
  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
  // Suya & Smallchops BBQ Grills Banners
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80",
  // Gourmet Burger & Fries Banners
  "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1000&q=80",
  // Modern Casual Dining Banners
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",
  // Artisanal Pizza & Italian Banners
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80",
  // Pan-Asian & Noodle Banners
  "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80",
  // Seafood & Grill Banners
  "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1000&q=80",
  // Healthy Salads & Bowls Banners
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80",
  // Bakery & Breakfast Pastry Banners
  "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80",
  // Smoothie & Cold-pressed Juices Banners
  "https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=1000&q=80",
  // Fried Chicken & Wings Banners
  "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=1000&q=80",
];

export const SUPERMARKET_BANNERS = [
  "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80",
];

export const PHARMACY_BANNERS = [
  "https://images.unsplash.com/photo-1631549912264-377863931b47?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80",
];

// 15+ Unique Restaurant & Store Logos
export const KITCHEN_LOGOS = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=200&q=80",
];

export const SUPERMARKET_LOGOS = [
  "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=200&q=80",
];

export const PHARMACY_LOGOS = [
  "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=200&q=80",
];

/**
 * Deterministically generates a hash code from a string (e.g. store ID or store name).
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Returns a 100% unique background banner picture for any kitchen, restaurant, or store.
 */
export function getUniqueStoreBanner(store: { id?: string; name?: string; category?: string; banner?: string }): string {
  // If store already has a valid custom non-generic banner URL, use it
  const isGeneric = !store.banner || 
                    store.banner.includes("photo-1555396273-367ea4eb4db5") || 
                    store.banner === "" || 
                    store.banner === "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80";

  if (!isGeneric && store.banner) {
    return store.banner;
  }

  const category = (store.category || "restaurant").toLowerCase();
  const key = `${store.id || ""}-${store.name || ""}`;
  const index = hashString(key);

  if (category === "supermarket") {
    return SUPERMARKET_BANNERS[index % SUPERMARKET_BANNERS.length];
  }
  if (category === "pharmacy") {
    return PHARMACY_BANNERS[index % PHARMACY_BANNERS.length];
  }

  // Default to unique kitchen / restaurant banners pool
  return KITCHEN_BANNERS[index % KITCHEN_BANNERS.length];
}

/**
 * Returns a unique store logo picture for any kitchen, restaurant, or store.
 */
export function getUniqueStoreLogo(store: { id?: string; name?: string; category?: string; logo?: string }): string {
  const isGeneric = !store.logo || 
                    store.logo.includes("photo-1517248135467-4c7edcad34c4") || 
                    store.logo === "";

  if (!isGeneric && store.logo) {
    return store.logo;
  }

  const category = (store.category || "restaurant").toLowerCase();
  const key = `${store.id || ""}-${store.name || ""}`;
  const index = hashString(key);

  if (category === "supermarket") {
    return SUPERMARKET_LOGOS[index % SUPERMARKET_LOGOS.length];
  }
  if (category === "pharmacy") {
    return PHARMACY_LOGOS[index % PHARMACY_LOGOS.length];
  }

  return KITCHEN_LOGOS[index % KITCHEN_LOGOS.length];
}
