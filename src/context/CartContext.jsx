import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios';

const CartContext = createContext();
const GUEST_CART_KEY = 'guest_cart';
const BACKEND_URL = 'http://localhost:8000';

export const CartProvider = ({ children }) => {
  const { auth } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.token) {
      loadAuthCart();
    } else {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      setItems(stored ? JSON.parse(stored) : []);
    }
  }, [auth.token]);

  const loadAuthCart = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      if (stored) {
        const guestItems = JSON.parse(stored);
        if (guestItems.length > 0) {
          try {
            await api.post('/api/cart/sync/', { items: guestItems });
          } finally {
            localStorage.removeItem(GUEST_CART_KEY);
          }
        } else {
          localStorage.removeItem(GUEST_CART_KEY);
        }
      }
      const res = await api.get('/api/cart/');
      setItems(res.data.items || []);
    } catch {
      // cart fetch failed silently
    } finally {
      setLoading(false);
    }
  };

  const persistGuest = (newItems) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newItems));
  };

  const addItem = async (product, quantity) => {
    if (auth.token) {
      await api.post('/api/cart/', { product_id: product.id, quantity });
      const res = await api.get('/api/cart/');
      setItems(res.data.items || []);
    } else {
      const updated = [...items];
      const idx = updated.findIndex(i => i.product_id === product.id);
      if (idx >= 0) {
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + quantity };
      } else {
        updated.push({
          id: null,
          product_id: product.id,
          name: product.name,
          price: String(product.price),
          quantity,
          image_url: product.images?.length > 0 ? `${BACKEND_URL}${product.images[0].url}` : null,
        });
      }
      setItems(updated);
      persistGuest(updated);
    }
  };

  const updateItem = async (item, quantity) => {
    if (auth.token) {
      await api.put(`/api/cart/${item.id}/`, { quantity });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity } : i));
    } else {
      const updated = items.map(i =>
        i.product_id === item.product_id ? { ...i, quantity } : i
      );
      setItems(updated);
      persistGuest(updated);
    }
  };

  const removeItem = async (item) => {
    if (auth.token) {
      await api.delete(`/api/cart/${item.id}/`);
      setItems(prev => prev.filter(i => i.id !== item.id));
    } else {
      const updated = items.filter(i => i.product_id !== item.product_id);
      setItems(updated);
      persistGuest(updated);
    }
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0).toFixed(2);

  return (
    <CartContext.Provider value={{ items, loading, addItem, updateItem, removeItem, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
