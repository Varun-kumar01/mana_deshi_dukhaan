import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CartItem, Product, ProductVariant, Coupon } from '../types';
import { validateCoupon } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  couponError: string | null;
  applyCouponCode: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  subtotal: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
  totalAmount: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_KEY = 'manadeshi_cart_guest';
const LEGACY_KEY = 'manadeshi_cart';

function cartKeyFor(userId?: number) {
  return userId ? `manadeshi_cart_${userId}` : GUEST_KEY;
}

function readCart(key: string): CartItem[] {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function mergeCarts(primary: CartItem[], extra: CartItem[]): CartItem[] {
  const map = new Map<string, CartItem>();
  for (const item of [...primary, ...extra]) {
    const existing = map.get(item.id);
    if (existing) {
      map.set(item.id, { ...existing, quantity: existing.quantity + item.quantity });
    } else {
      map.set(item.id, { ...item });
    }
  }
  return Array.from(map.values());
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const lastUserId = useRef<number | undefined>(undefined);

  const freeDeliveryThreshold = 499;

  useEffect(() => {
    const userId = user?.id;
    let loaded = readCart(cartKeyFor(userId));

    if (!userId) {
      const legacy = readCart(LEGACY_KEY);
      if (legacy.length && loaded.length === 0) {
        loaded = legacy;
        localStorage.removeItem(LEGACY_KEY);
      }
    } else {
      const guest = readCart(GUEST_KEY);
      const leftoverLegacy = readCart(LEGACY_KEY);
      if (guest.length || leftoverLegacy.length) {
        loaded = mergeCarts(loaded, mergeCarts(guest, leftoverLegacy));
        localStorage.removeItem(GUEST_KEY);
        localStorage.removeItem(LEGACY_KEY);
      }
    }

    lastUserId.current = userId;
    setCart(loaded);
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponError(null);
    setHydrated(true);
  }, [user?.id]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(cartKeyFor(user?.id), JSON.stringify(cart));
    } catch (err) {
      console.error('Could not save cart:', err);
    }
  }, [cart, hydrated, user?.id]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = subtotal === 0 || subtotal >= freeDeliveryThreshold ? 0 : 40;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const totalAmount = Math.max(0, subtotal - couponDiscount + deliveryFee);

  const addToCart = (product: Product, variant?: ProductVariant, quantity = 1) => {
    const selectedVariant = variant || (product.variants && product.variants[0]) || {
      id: product.id,
      title: 'Standard',
      price: product.base_price,
      stock_quantity: 50,
    };

    const cartItemId = `${product.id}-${selectedVariant.id}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      const newItem: CartItem = {
        id: cartItemId,
        product_id: product.id,
        name: product.name,
        slug: product.slug,
        image: (product.images && product.images[0]) || '/visiting_card.png',
        variant_id: selectedVariant.id,
        variant_title: selectedVariant.title,
        price: selectedVariant.price,
        quantity,
        category_name: product.category_name,
      };
      return [...prev, newItem];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id !== cartItemId) return item;
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponError(null);
  };

  const applyCouponCode = async (code: string): Promise<boolean> => {
    setCouponError(null);
    if (!code.trim()) {
      setCouponError('Please enter a coupon code');
      return false;
    }

    try {
      const res = await validateCoupon(code, subtotal);
      if (res.success && res.data) {
        setAppliedCoupon({
          code: res.data.code,
          description: res.data.description,
          discount_type: res.data.discount_type,
          discount_value: res.data.discount_value,
        });
        setCouponDiscount(res.data.discount);
        setCouponError(null);
        return true;
      }
      setCouponError(res.message || 'Invalid coupon code');
      return false;
    } catch {
      setCouponError('Error validating coupon');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponError(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        couponDiscount,
        couponError,
        applyCouponCode,
        removeCoupon,
        subtotal,
        deliveryFee,
        freeDeliveryThreshold,
        amountNeededForFreeDelivery,
        totalAmount,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
