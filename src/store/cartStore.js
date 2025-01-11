// src/store/cartStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const normalizeCartItem = (item) => {
  // If it's already in the simple format, return as is
  if (item.name && item.price && !item.product) {
    return item;
  }

  // If it's from the database (has product object), normalize it
  if (item.product) {
    return {
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.images[0],
      quantity: item.quantity,
      slug: item.product.slug,
      inventory: item.product.inventory,
    };
  }

  return item;
};

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0,
      isLoading: false,
      isInitialized: false,

      initializeCart: async (session) => {
        set({ isLoading: true });
        try {
          if (session?.user) {
            const response = await fetch("/api/cart");
            const dbCart = await response.json();

            // Normalize the items from DB
            const normalizedItems = dbCart.items.map(normalizeCartItem);

            if (!get().isInitialized) {
              const localItems = get().items;
              const mergedItems = [...normalizedItems];

              localItems.forEach((localItem) => {
                const existingItem = mergedItems.find(
                  (item) => item.id === localItem.id
                );
                if (existingItem) {
                  existingItem.quantity += localItem.quantity;
                } else {
                  mergedItems.push(localItem);
                }
              });

              set({ items: mergedItems, isInitialized: true });

              await fetch("/api/cart", {
                method: "PUT",
                body: JSON.stringify({ items: mergedItems }),
              });
            } else {
              set({ items: normalizedItems });
            }
          }
        } catch (error) {
          console.error("Failed to initialize cart:", error);
        } finally {
          set({ isLoading: false });
        }
        get().updateTotals();
      },

      addItem: async (product, session) => {
        const normalizedProduct = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          quantity: 1,
          slug: product.slug,
          inventory: product.inventory,
        };

        const items = get().items;
        const existingItem = items.find(
          (item) => item.id === normalizedProduct.id
        );
        let updatedItems;

        if (existingItem) {
          updatedItems = items.map((item) =>
            item.id === normalizedProduct.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          updatedItems = [...items, normalizedProduct];
        }

        set({ items: updatedItems });
        get().updateTotals();

        if (session?.user) {
          try {
            await fetch("/api/cart", {
              method: "PUT",
              body: JSON.stringify({ items: updatedItems }),
            });
          } catch (error) {
            console.error("Failed to sync cart:", error);
          }
        }
      },

      removeItem: async (productId, session) => {
        const updatedItems = get().items.filter(
          (item) => item.id !== productId
        );

        if (session?.user) {
          try {
            const response = await fetch("/api/cart", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ productId }), // Send the productId to be removed
            });

            if (!response.ok) {
              throw new Error("Failed to remove item from server");
            }
          } catch (error) {
            console.error("Failed to sync cart deletion:", error);
            return; // Don't update local state if server sync fails
          }
        }

        set({ items: updatedItems });
        get().updateTotals();
      },

      updateQuantity: async (productId, quantity, session) => {
        const updatedItems = get().items.map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        );

        set({ items: updatedItems });
        get().updateTotals();

        if (session?.user) {
          try {
            await fetch("/api/cart", {
              method: "PUT",
              body: JSON.stringify({ items: updatedItems }),
            });
          } catch (error) {
            console.error("Failed to sync cart:", error);
          }
        }
      },

      updateTotals: () => {
        const items = get().items;
        const subtotal = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const shipping = subtotal > 100 ? 0 : 10;
        const tax = subtotal * 0.1;
        const total = subtotal + shipping + tax;

        set({ subtotal, shipping, tax, total });
      },

      clearCart: async (session) => {
        set({ items: [], subtotal: 0, shipping: 0, tax: 0, total: 0 });

        if (session?.user) {
          try {
            await fetch("/api/cart", {
              method: "DELETE",
            });
          } catch (error) {
            console.error("Failed to clear cart in database:", error);
          }
        }
      },
    }),
    {
      name: "cart-storage",
    }
  )
);

export default useCartStore;
