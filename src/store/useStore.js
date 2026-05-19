import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // Products state
  products: [],
  isLoadingProducts: false,
  productsError: null,

  // Cart state
  cart: [],
  isCartOpen: false,

  // Search state
  searchQuery: '',

  // Notifications state
  notifications: [],

  // Actions
  fetchProducts: async () => {
    set({ isLoadingProducts: true, productsError: null });
    try {
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockProducts = [
        { id: 1, name: '無線藍牙耳機', price: 2999, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60' },
        { id: 2, name: '智慧手錶', price: 8999, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60' },
        { id: 3, name: '便攜式充電器', price: 1299, image: 'https://images.unsplash.com/photo-1609592424089-9a2eb2d326a0?w=500&auto=format&fit=crop&q=60' },
        { id: 4, name: '無線滑鼠', price: 899, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60' },
        { id: 5, name: '機械鍵盤', price: 3999, image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop&q=60' },
        { id: 6, name: '網路攝影機', price: 2199, image: 'https://images.unsplash.com/photo-1600541519468-4a87a2d334cb?w=500&auto=format&fit=crop&q=60' },
        { id: 7, name: 'USB隨身碟', price: 599, image: 'https://images.unsplash.com/photo-1590480371424-df38d2f5a049?w=500&auto=format&fit=crop&q=60' },
        { id: 8, name: '桌面擴音器', price: 1599, image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=60' }
      ];
      
      set({ products: mockProducts, isLoadingProducts: false });
    } catch (err) {
      set({ productsError: '無法載入商品，請稍後再試。', isLoadingProducts: false });
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

  // Cart actions
  addToCart: (product, quantityToAdd = 1) => {
    if (quantityToAdd <= 0) return;
    
    set((state) => {
      const existingIndex = state.cart.findIndex((item) => item.product.id === product.id);
      let newCart = [...state.cart];
      
      if (existingIndex > -1) {
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + quantityToAdd
        };
      } else {
        newCart.push({ product, quantity: quantityToAdd });
      }

      // Add toast notification
      const notificationId = Date.now() + Math.random().toString(36).substring(2, 9);
      const newNotification = {
        id: notificationId,
        message: `已將 ${quantityToAdd} 個「${product.name}」加入購物車！`,
        type: 'success'
      };
      
      // Auto-remove notification after 3.5 seconds
      setTimeout(() => {
        get().removeNotification(notificationId);
      }, 3500);

      return {
        cart: newCart,
        notifications: [...state.notifications, newNotification]
      };
    });
  },

  removeFromCart: (productId) => {
    const item = get().cart.find((i) => i.product.id === productId);
    if (!item) return;

    set((state) => {
      const newCart = state.cart.filter((i) => i.product.id !== productId);
      const notificationId = Date.now() + Math.random().toString(36).substring(2, 9);
      const newNotification = {
        id: notificationId,
        message: `已將「${item.product.name}」從購物車移除`,
        type: 'info'
      };

      setTimeout(() => {
        get().removeNotification(notificationId);
      }, 3500);

      return {
        cart: newCart,
        notifications: [...state.notifications, newNotification]
      };
    });
  },

  updateQuantity: (productId, newQuantity) => {
    if (newQuantity <= 0) return;
    set((state) => ({
      cart: state.cart.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      ),
    }));
  },

  clearCart: () => set({ cart: [] }),

  // Notification actions
  addNotification: (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }]
    }));
    setTimeout(() => {
      get().removeNotification(id);
    }, 3500);
  },

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  }))
}));
