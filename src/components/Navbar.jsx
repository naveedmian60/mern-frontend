import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, LogOut, Shield, Mail, Home, Info, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Navbar() {
  const { user, token, logout, cart, wishlist, searchQuery, setSearchQuery } = useStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/products');
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const linkClass = "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-ink transition-colors hover:bg-paper-soft";

  return (
    <nav className="sticky top-0 z-50 border-b border-line/50 bg-paper/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-4 gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="font-display text-2xl font-bold tracking-tight text-ink">
            Shop<span className="text-accent">Zone</span>
          </span>
        </Link>

        {/* Search Bar - Desktop Only (lg:block) */}
        <form onSubmit={handleSearch} className="hidden lg:flex lg:flex-1">
          <div className={`relative w-full max-w-md transition-all duration-300 ${searchFocused ? 'scale-[1.02]' : ''}`}>
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search products, brands..."
              className="w-full rounded-full border border-line bg-paper-soft py-2.5 pl-11 pr-4 text-sm text-ink outline-none transition-all duration-300 placeholder:text-ink/40 focus:border-ink focus:bg-white focus:ring-1 focus:ring-ink/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        {/* Nav Links + Icons - Desktop Only (lg:flex) */}
        <div className="hidden lg:flex items-center gap-5">
          <Link to="/" className="text-sm font-medium text-ink/70 transition-colors hover:text-ink">Home</Link>
          <Link to="/about" className="text-sm font-medium text-ink/70 transition-colors hover:text-ink">About</Link>
          <Link to="/products" className="text-sm font-medium text-ink/70 transition-colors hover:text-ink">Products</Link>
          <Link to="/contact" className="text-sm font-medium text-ink/70 transition-colors hover:text-ink">Contact</Link>

          {user?.role === 'admin' && (
            <Link to="/admin" className="flex items-center gap-1 text-sm font-medium text-amber-600 transition-colors hover:text-amber-700">
              <Shield className="h-4 w-4" /> Admin
            </Link>
          )}

          <div className="h-5 w-px bg-line"></div>

          <Link to="/wishlist" className="relative flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-paper-soft">
            <Heart className="h-5 w-5 text-ink/70" />
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-bounce-in">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-paper-soft">
            <ShoppingCart className="h-5 w-5 text-ink/70" />
            {cart.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white animate-bounce-in">
                {cart.length}
              </span>
            )}
          </Link>

          {token && user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border border-line py-1.5 pl-1.5 pr-3 transition-all hover:bg-paper-soft"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <span className="text-sm font-bold">{user.name?.charAt(0)?.toUpperCase()}</span>
                </div>
                <span className="hidden text-sm font-medium text-ink lg:block">
                  {user.name?.split(' ')[0]}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-ink/50" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-line bg-white shadow-xl animate-dropdown">
                  <div className="border-b border-line px-4 py-3">
                    <p className="text-sm font-medium text-ink">{user.name}</p>
                    <p className="text-xs text-ink/50">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink transition-colors hover:bg-paper-soft">
                      <User className="h-4 w-4 text-ink/50" /> My Profile
                    </Link>
                    <Link to="/wishlist" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink transition-colors hover:bg-paper-soft">
                      <Heart className="h-4 w-4 text-ink/50" /> Wishlist ({wishlist.length})
                    </Link>
                    <Link to="/cart" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink transition-colors hover:bg-paper-soft">
                      <ShoppingCart className="h-4 w-4 text-ink/50" /> Cart ({cart.length})
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-amber-600 transition-colors hover:bg-amber-50">
                        <Shield className="h-4 w-4" /> Admin Dashboard
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-line p-2">
                    <button onClick={handleLogout} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50">
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-ink transition-all hover:bg-paper-soft">Sign In</Link>
              <Link to="/signup" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-all hover:bg-ink/90 hover:shadow-lg">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile/Tablet Menu Toggle - Shows on screens smaller than LG */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-paper-soft lg:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile/Tablet Menu - Shows on screens smaller than LG */}
      {mobileOpen && (
        <div className="border-t border-line/50 bg-paper px-4 py-6 lg:hidden max-h-[calc(100vh-80px)] overflow-y-auto">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-2xl border border-line bg-paper-soft py-3 pl-12 pr-4 text-base text-ink outline-none focus:border-ink focus:ring-1 focus:ring-ink/20"
              />
            </div>
          </form>

          <div className="space-y-1">
            {/* Main Navigation */}
            <Link to="/" onClick={() => setMobileOpen(false)} className={linkClass}>
              <Home className="h-5 w-5 text-ink/60" /> Home
            </Link>
            <Link to="/about" onClick={() => setMobileOpen(false)} className={linkClass}>
              <Info className="h-5 w-5 text-ink/60" /> About
            </Link>
            <Link to="/products" onClick={() => setMobileOpen(false)} className={linkClass}>
              <Package className="h-5 w-5 text-ink/60" /> Products
            </Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className={linkClass}>
              <Mail className="h-5 w-5 text-ink/60" /> Contact Us
            </Link>

            {/* Divider */}
            <div className="my-4 border-t border-line/50"></div>

            {/* Account Section */}
            <Link to="/cart" onClick={() => setMobileOpen(false)} className={linkClass}>
              <ShoppingCart className="h-5 w-5 text-ink/60" /> 
              <span className="flex-1">Cart</span>
              {cart.length > 0 && <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full">{cart.length}</span>}
            </Link>
            <Link to="/wishlist" onClick={() => setMobileOpen(false)} className={linkClass}>
              <Heart className="h-5 w-5 text-ink/60" /> 
              <span className="flex-1">Wishlist</span>
              {wishlist.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{wishlist.length}</span>}
            </Link>
            <Link to="/profile" onClick={() => setMobileOpen(false)} className={linkClass}>
              <User className="h-5 w-5 text-ink/60" /> Profile
            </Link>

            {/* Admin Section */}
            {user?.role === 'admin' && (
              <>
                <div className="my-4 border-t border-line/50"></div>
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-amber-600 transition-colors hover:bg-amber-50">
                  <Shield className="h-5 w-5" /> Admin Dashboard
                </Link>
              </>
            )}

            {/* Auth Actions */}
            <div className="my-4 border-t border-line/50"></div>
            {token ? (
              <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-red-500 transition-colors hover:bg-red-50">
                <LogOut className="h-5 w-5" /> Logout
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 rounded-xl border border-line py-3 text-sm font-medium text-ink">Sign In</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-medium text-paper">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0); }
          60% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-bounce-in { animation: bounce-in 0.3s ease-out; }
        @keyframes dropdown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-dropdown { animation: dropdown 0.2s ease-out; }
      `}</style>
    </nav>
  );
}