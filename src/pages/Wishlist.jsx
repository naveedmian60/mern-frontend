import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-paper-soft">
          <Heart className="h-10 w-10 text-ink/30" />
        </div>
        <h2 className="font-display text-2xl font-bold text-ink">Your wishlist is empty</h2>
        <p className="mt-3 text-ink/60">Save items you love for later.</p>
        <Link
          to="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition-all duration-300 hover:bg-ink/90"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="eyebrow">Saved Items</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ink">
          My Wishlist ({wishlist.length})
        </h1>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
        {wishlist.map((item) => (
          <div
            key={item._id}
            className="overflow-hidden rounded-2xl border border-line bg-white transition-all hover:shadow-lg"
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-paper-soft">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ShoppingBag className="h-10 w-10 text-ink/20" />
                </div>
              )}

              {/* Remove button */}
              <button
                onClick={() => removeFromWishlist(item._id)}
                className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-all hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              {/* Wishlist indicator */}
              <div className="absolute top-3 left-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 shadow-sm">
                  <Heart className="h-4 w-4 fill-white text-white" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              {item.category && (
                <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                  {item.category}
                </p>
              )}
              <h3 className="mt-1 font-medium text-ink line-clamp-1">{item.name}</h3>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-ink">
                  ${item.price?.toFixed(2)}
                </span>

                <button
                  onClick={() => {
                    addToCart(item);
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-paper transition-all hover:bg-ink/90 hover:scale-110"
                >
                  <ShoppingCart className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}