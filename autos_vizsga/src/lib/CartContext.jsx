import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from './supabaseClient';

const CartContext = createContext({});
const STORAGE_KEY = 'carcore_cart';

function getStorageKey(userId) {
  return userId ? `${STORAGE_KEY}_${userId}` : `${STORAGE_KEY}_guest`;
}

function loadCart(userId) {
  if (typeof window === 'undefined') return [];
  try {
    const saved = window.localStorage.getItem(getStorageKey(userId));
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveCart(userId, items) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(getStorageKey(userId), JSON.stringify(items));
  } catch {
    // ignore storage errors
  }
}

export function CartProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    let subscription;

    const initialize = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id ?? null;
      setUserId(currentUserId);
      setItems(loadCart(currentUserId));

      const {
        data: { subscription: authSubscription },
      } = supabase.auth.onAuthStateChange((event, authSession) => {
        const nextUserId = authSession?.user?.id ?? null;
        setUserId(nextUserId);
        setItems(loadCart(nextUserId));
      });

      subscription = authSubscription;
    };

    initialize();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    saveCart(userId, items);
  }, [items, userId]);

  const cartItemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const addToCart = (product) => {
    setItems((current) => {
      const exists = current.find((item) => item.id === product.id);
      if (exists) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setItems((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const toggleCart = () => {
    setIsCartOpen((open) => !open);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    cartItemCount,
    isCartOpen,
    setIsCartOpen,
    toggleCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
