import { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../api/axios';

const StoreContext = createContext();

// ── Reducers ──────────────────────────────────────────────

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.items.find((i) => i._id === action.payload._id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i._id === action.payload._id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, items: state.items.filter((i) => i._id !== action.payload) };
    case 'SET_CART_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i._id === action.payload.id ? { ...i, qty: Math.max(1, action.payload.qty) } : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'LOAD_CART':
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

function wishlistReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      if (state.items.find((i) => i._id === action.payload._id)) return state;
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_FROM_WISHLIST':
      return { ...state, items: state.items.filter((i) => i._id !== action.payload) };
    case 'TOGGLE_WISHLIST': {
      const exists = state.items.find((i) => i._id === action.payload._id);
      if (exists) return { ...state, items: state.items.filter((i) => i._id !== action.payload._id) };
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'LOAD_WISHLIST':
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { ...state, user: null, token: null, isAuthenticated: false };
    case 'LOAD_AUTH':
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true };
    default:
      return state;
  }
}

// ── Provider ──────────────────────────────────────────────

export function StoreProvider({ children }) {
  const [cart, dispatchCart] = useReducer(cartReducer, { items: [] });
  const [wishlist, dispatchWishlist] = useReducer(wishlistReducer, { items: [] });
  const [auth, dispatchAuth] = useReducer(authReducer, {
    user: null,
    token: null,
    isAuthenticated: false,
  });
  const [searchQuery, setSearchQuery] = useReducer((s, a) => a, '');

  // Restore auth from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatchAuth({ type: 'LOAD_AUTH', payload: { user, token } });
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Persist cart to localStorage — only if logged in
  useEffect(() => {
    if (auth.isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(cart.items));
    }
  }, [cart.items, auth.isAuthenticated]);

  // Persist wishlist to localStorage — only if logged in
  useEffect(() => {
    if (auth.isAuthenticated) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist.items));
    }
  }, [wishlist.items, auth.isAuthenticated]);

  // Restore cart/wishlist from localStorage — only after auth is loaded
  useEffect(() => {
    if (auth.isAuthenticated) {
      try {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (savedCart.length) dispatchCart({ type: 'LOAD_CART', payload: savedCart });
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        if (savedWishlist.length) dispatchWishlist({ type: 'LOAD_WISHLIST', payload: savedWishlist });
      } catch { /* ignore */ }
    }
  }, [auth.isAuthenticated]);

  const login = async (email, password) => {
    const res = await api.post('/users/login', { email, password });
    const { _id, name, email: userEmail, role, token } = res.data;
    const user = { _id, name, email: userEmail, role };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    dispatchAuth({ type: 'LOGIN', payload: { user, token } });
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/users/register', { name, email, password });
    const { _id, name: userName, email: userEmail, role, token } = res.data;
    const user = { _id, name: userName, email: userEmail, role };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    dispatchAuth({ type: 'LOGIN', payload: { user, token } });
    return res.data;
  };

  const logout = () => {
    dispatchAuth({ type: 'LOGOUT' });
    dispatchCart({ type: 'CLEAR_CART' });
    dispatchWishlist({ type: 'LOAD_WISHLIST', payload: [] });
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
  };

  // Protected addToCart — login required
  const addToCart = (product) => {
    if (!auth.isAuthenticated) {
      alert('Please login first to add items to cart!');
      return;
    }
    dispatchCart({ type: 'ADD_TO_CART', payload: product });
  };

  // Protected toggleWishlist — login required
  const toggleWishlist = (product) => {
    if (!auth.isAuthenticated) {
      alert('Please login first to add items to wishlist!');
      return;
    }
    dispatchWishlist({ type: 'TOGGLE_WISHLIST', payload: product });
  };

  // ✅ addToWishlist — for QuickViewModal (adds only, no toggle)
  const addToWishlist = (product) => {
    if (!auth.isAuthenticated) {
      alert('Please login first to add items to wishlist!');
      return;
    }
    dispatchWishlist({ type: 'ADD_TO_WISHLIST', payload: product });
  };

  // ✅ removeFromWishlist — for Wishlist page
  const removeFromWishlist = (id) => {
    dispatchWishlist({ type: 'REMOVE_FROM_WISHLIST', payload: id });
  };

  const setCartQty = (id, qty) => dispatchCart({ type: 'SET_CART_QTY', payload: { id, qty } });
  const clearCart = () => dispatchCart({ type: 'CLEAR_CART' });
  const removeFromCart = (id) => dispatchCart({ type: 'REMOVE_FROM_CART', payload: id });
  const isInWishlist = (id) => wishlist.items.some((i) => i._id === id);

  const cartTotal = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <StoreContext.Provider
      value={{
        // Cart
        cart: cart.items,
        addToCart,
        removeFromCart,
        setCartQty,
        clearCart,
        cartTotal,
        cartCount,
        // Wishlist
        wishlist: wishlist.items,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlist.items.length,
        // Auth
        user: auth.user,
        auth: auth.user,
        token: auth.token,
        isAuthenticated: auth.isAuthenticated,
        login,
        register,
        logout,
        // Search
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
}