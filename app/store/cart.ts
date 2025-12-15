"use client";

import { create } from "zustand";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (id: number) => void;
  inc: (id: number) => void;
  dec: (id: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "zyvero_cart_v1";

function loadFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export const useCart = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) => {
    const items = get().items.length ? get().items : loadFromStorage();

    const existing = items.find((x) => x.id === item.id);
    const next = existing
      ? items.map((x) => (x.id === item.id ? { ...x, qty: x.qty + 1 } : x))
      : [...items, { ...item, qty: 1 }];

    saveToStorage(next);
    set({ items: next });
  },

  removeItem: (id) => {
    const next = get().items.filter((x) => x.id !== id);
    saveToStorage(next);
    set({ items: next });
  },

  inc: (id) => {
    const next = get().items.map((x) =>
      x.id === id ? { ...x, qty: x.qty + 1 } : x
    );
    saveToStorage(next);
    set({ items: next });
  },

  dec: (id) => {
    const next = get().items
      .map((x) => (x.id === id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))
      .filter((x) => x.qty >= 1);

    saveToStorage(next);
    set({ items: next });
  },

  clear: () => {
    saveToStorage([]);
    set({ items: [] });
  },
}));
