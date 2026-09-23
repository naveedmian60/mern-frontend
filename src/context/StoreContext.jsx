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

  // Load Cart & Wishlist when auth state changes
  useEffect(() => {
    if (auth.isAuthenticated) {
      // Agar login hai toh backend se cart lao
      const fetchCart = async () => {
        try {
          const { data } = await api.get('/cart');
          dispatchCart({ type: 'LOAD_CART', payload: data.cartItems || [] });
        } catch (err) {
          console.error('Failed to fetch cart', err);
        }
      };
      fetchCart();
    } else {
      // Agar guest hai toh localStorage se lao
      try {
        const savedCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
        if (savedCart.length) dispatchCart({ type: 'LOAD_CART', payload: savedCart });
        
        const savedWishlist = JSON.parse(localStorage.getItem('guest_wishlist') || '[]');
        if (savedWishlist.length) dispatchWishlist({ type: 'LOAD_WISHLIST', payload: savedWishlist });
      } catch { /* ignore */ }
    }
  }, [auth.isAuthenticated]);

  // Persist Guest cart to localStorage
  useEffect(() => {
    if (!auth.isAuthenticated) {
      localStorage.setItem('guest_cart', JSON.stringify(cart.items));
    }
  }, [cart.items, auth.isAuthenticated]);

  // Persist Guest wishlist to localStorage
  useEffect(() => {
    if (!auth.isAuthenticated) {
      localStorage.setItem('guest_wishlist', JSON.stringify(wishlist.items));
    }
  }, [wishlist.items, auth.isAuthenticated]);

  const login = async (email, password) => {
    const res = await api.post('/users/login', { email, password });
    const { _id, name, email: userEmail, role, token } = res.data;
    const user = { _id, name, email: userEmail, role };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.removeItem('guest_cart'); // Login par guest data clear
    localStorage.removeItem('guest_wishlist');
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
  };

  // Cart Actions (Backend sync ke sath)
  const addToCart = (product) => {
    dispatchCart({ type: 'ADD_TO_CART', payload: product });
    if (auth.isAuthenticated) {
      api.post('/cart', { ...product, qty: 1 }).catch(err => console.error('Cart sync error', err));
    }
  };

  const removeFromCart = (id) => {
    dispatchCart({ type: 'REMOVE_FROM_CART', payload: id });
    if (auth.isAuthenticated) {
      api.delete(`/cart/${id}`).catch(err => console.error('Cart sync error', err));
    }
  };

  const setCartQty = (id, qty) => {
    dispatchCart({ type: 'SET_CART_QTY', payload: { id, qty } });
    if (auth.isAuthenticated) {
      const product = cart.items.find(i => i._id === id);
      if (product) {
        api.post('/cart', { ...product, qty }).catch(err => console.error('Cart sync error', err));
      }
    }
  };

  const clearCart = () => {
    dispatchCart({ type: 'CLEAR_CART' });
    if (auth.isAuthenticated) {
      api.delete('/cart').catch(err => console.error('Cart sync error', err));
    }
  };

  // Wishlist Actions (Local state for now)
  const toggleWishlist = (product) => {
    dispatchWishlist({ type: 'TOGGLE_WISHLIST', payload: product });
  };

  const addToWishlist = (product) => {
    dispatchWishlist({ type: 'ADD_TO_WISHLIST', payload: product });
  };

  const removeFromWishlist = (id) => {
    dispatchWishlist({ type: 'REMOVE_FROM_WISHLIST', payload: id });
  };

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