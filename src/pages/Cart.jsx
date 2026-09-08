import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRightIcon } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Cart() {
  const { cart, removeFromCart, setCartQty, clearCart } = useStore();
  const navigate = useNavigate();

  // ✅ qty — StoreContext mein qty hai, quantity nahi
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-paper-soft">
          <ShoppingBag className="h-10 w-10 text-ink/30" />
        </div>
        <h2 className="font-display text-2xl font-bold text-ink">Your cart is empty</h2>
        <p className="mt-3 text-ink/60">Looks like you haven't added anything to your cart yet.</p>
        <Link
          to="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition-all duration-300 hover:bg-ink/90"
        >
          Start Shopping
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-12">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <p className="eyebrow">Shopping Cart</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink">
          Your Cart ({totalItems} item{totalItems !== 1 ? 's' : ''})
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 sm:gap-5 rounded-2xl border border-line bg-white p-4 sm:p-5 transition-all hover:shadow-md"
            >
              {/* Image */}
              <div className="h-24 w-24 sm:h-28 sm:w-28 flex-shrink-0 overflow-hidden rounded-xl bg-paper-soft">
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
                    <ShoppingBag className="h-8 w-8 text-ink/20" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-medium text-ink text-sm sm:text-base">{item.name}</h3>
                  {item.brand && (
                    <p className="text-xs text-ink/50">{item.brand}</p>
                  )}
                  <p className="mt-1 text-lg font-bold text-ink">
                    ${(item.price * item.qty).toFixed(2)}
                  </p>
                  {item.qty > 1 && (
                    <p className="text-xs text-ink/40">${item.price.toFixed(2)} each</p>
                  )}
                </div>

                {/* Quantity + Remove */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center overflow-hidden rounded-lg border border-line">
                    <button
                      onClick={() => setCartQty(item._id, item.qty - 1)}
                      className="px-3 py-1.5 text-ink/60 transition-colors hover:bg-paper-soft"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-4 py-1.5 text-sm font-medium border-x border-line">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => setCartQty(item._id, item.qty + 1)}
                      className="px-3 py-1.5 text-ink/60 transition-colors hover:bg-paper-soft"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="flex items-center gap-1.5 text-sm text-red-500 transition-colors hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="h-fit rounded-2xl border border-line bg-white p-6 sticky top-24">
          <h3 className="text-lg font-bold text-ink mb-4">Order Summary</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-ink/60">
              <span>Subtotal ({totalItems} items)</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-ink/60">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="border-t border-line pt-3 flex justify-between text-lg font-bold text-ink">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="mt-6 w-full rounded-full bg-ink py-3.5 text-sm font-medium text-paper transition-all duration-300 hover:bg-ink/90 hover:shadow-lg"
          >
            Proceed to Checkout
          </button>

          <button
            onClick={clearCart}
            className="mt-3 w-full rounded-full border border-line py-3 text-sm font-medium text-ink/60 transition-all duration-300 hover:bg-paper-soft hover:text-ink"
          >
            Clear Cart
          </button>

          <Link
            to="/products"
            className="mt-3 flex items-center justify-center gap-1 text-sm font-medium text-ink/50 hover:text-ink transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}