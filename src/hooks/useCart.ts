import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  cart: CartItem[];
  totalAmount: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      totalAmount: 0,

      addItem: (item) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find((i) => i.id === item.id);

        if (existingItem) {
          const updatedCart = currentCart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
          set({
            cart: updatedCart,
            totalAmount: updatedCart.reduce((total, item) => total + item.price * item.quantity, 0),
          });
        } else {
          const updatedCart = [...currentCart, { ...item, quantity: 1 }];
          set({
            cart: updatedCart,
            totalAmount: updatedCart.reduce((total, item) => total + item.price * item.quantity, 0),
          });
        }
      },

      removeItem: (id) => {
        const currentCart = get().cart;
        const updatedCart = currentCart.filter((item) => item.id !== id);
        set({
          cart: updatedCart,
          totalAmount: updatedCart.reduce((total, item) => total + item.price * item.quantity, 0),
        });
      },

      updateQuantity: (id, quantity) => {
        const currentCart = get().cart;
        const updatedCart = currentCart.map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
        ).filter(item => item.quantity > 0);
        
        set({
          cart: updatedCart,
          totalAmount: updatedCart.reduce((total, item) => total + item.price * item.quantity, 0),
        });
      },

      clearCart: () => {
        set({ cart: [], totalAmount: 0 });
      },
    }),
    {
      name: 'cart-storage',
    }
  )
); 