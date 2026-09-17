import { create } from "zustand";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, color: string, size: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (newItem) =>
    set((state) => {
      const existing = state.items.find(
        (i) =>
          i.id === newItem.id &&
          i.color === newItem.color &&
          i.size === newItem.size
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i === existing ? { ...i, quantity: i.quantity + newItem.quantity } : i
          ),
        };
      }
      return { items: [...state.items, newItem] };
    }),
  removeItem: (id, color, size) =>
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.id === id && i.color === color && i.size === size)
      ),
    })),
  clearCart: () => set({ items: [] }),
}));