import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRightIcon } from 'lucide-react';

export default function OrderSuccess() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20 text-center">
      <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-50">
        <CheckCircle className="h-14 w-14 text-green-500" />
      </div>

      <h1 className="font-display text-4xl font-bold text-ink">Order Placed!</h1>
      <p className="mt-4 max-w-md mx-auto text-ink/60">
        Thank you for your order. We've received your purchase and will start processing it right away.
      </p>

      <div className="mt-4 inline-block rounded-xl bg-green-50 border border-green-200 px-6 py-3">
        <p className="text-sm text-green-700">
          Order confirmation sent to your email
        </p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition-all hover:bg-ink/90"
        >
          Continue Shopping
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm font-medium text-ink transition-all hover:bg-paper-soft"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}