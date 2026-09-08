import { Star, Heart, ShoppingCart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useState } from 'react';

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart, addToWishlist, wishlist } = useStore();
  const [imgError, setImgError] = useState(false);

  const isInWishlist = wishlist.some(item => item._id === product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
  };

  const handleClick = () => {
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100">
        <div className="relative overflow-hidden aspect-square bg-gray-100">
          {!imgError && product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
              <ShoppingCart className="w-10 h-10 text-indigo-300 mb-1" />
              <span className="text-xs text-indigo-300">No Image</span>
            </div>
          )}

          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white shadow-sm transition-all"
          >
            <Heart
              className={`w-5 h-5 ${
                isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-500'
              }`}
            />
          </button>

          {product.discount && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{product.discount}%
            </span>
          )}

          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
            <span className="bg-white/90 text-gray-800 px-5 py-2 rounded-full text-sm font-semibold shadow-lg">
              Quick View
            </span>
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <h3 className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating || 0)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200'
                }`}
              />
            ))}
            <span className="text-xs text-gray-400 ml-1">({product.rating || 'N/A'})</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-gray-900">
                ${product.price?.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through ml-1">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all hover:scale-110 active:scale-95 shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 