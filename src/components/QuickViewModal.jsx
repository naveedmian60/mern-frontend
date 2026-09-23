import { useState } from 'react';
import { X, Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const QuickViewModal = ({ product, onClose }) => {
  const { addToCart, addToWishlist, wishlist } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  const isInWishlist = wishlist.some(item => item._id === product._id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      <div
        className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
        style={{ animation: 'popIn 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mobile ke liye gripcols-1 aur PC ke liye gridcols-2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* LEFT - Image */}
          <div className="relative bg-gray-50 sm:rounded-l-3xl overflow-hidden">
            {!imgError && product.image ? (
              <img
                src={product.image}
                alt={product.name}
                // Mobile par height 250px (h-56) aur PC par 500px (sm:h-[500px])
                className="w-full h-56 sm:h-[500px] object-cover" 
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-56 sm:h-[500px] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-3 shadow">
                  <ShoppingCart className="w-10 h-10 text-indigo-300" />
                </div>
                <p className="text-sm text-indigo-400">No Image</p>
              </div>
            )}
            {product.discount && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* RIGHT - Details */}
          {/* Mobile par padding kam aur PC par zyada */}
          <div className="p-5 sm:p-8">
            <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-2">
              {product.category}
            </p>
            {/* Mobile par text thota chota */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{product.name}</h2>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-400">({product.rating || 'N/A'})</span>
            </div>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Rs {product.price?.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  Rs {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-5">
              {product.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-5">
              {product.brand && (
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold">
                  {product.brand}
                </span>
              )}
              <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                product.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <span className="text-sm font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 py-2 font-semibold text-sm min-w-[3rem] text-center border-x border-gray-200">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-200"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

              <button
                onClick={() => addToWishlist(product)}
                className={`w-full py-3 rounded-xl border-2 font-medium transition-all flex items-center justify-center gap-2 ${
                  isInWishlist
                    ? 'border-red-200 bg-red-50 text-red-500'
                    : 'border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                {isInWishlist ? 'Added to Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-gray-100">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-5 h-5 text-indigo-500" />
                <span className="text-[11px] text-gray-500">Free Ship</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Shield className="w-5 h-5 text-indigo-500" />
                <span className="text-[11px] text-gray-500">Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-5 h-5 text-indigo-500" />
                <span className="text-[11px] text-gray-500">30d Return</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default QuickViewModal;