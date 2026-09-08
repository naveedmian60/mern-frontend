import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-line bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <span className="font-display text-3xl font-bold tracking-tight">LUXE</span>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/60">
              Crafted for those who appreciate the finer things. We curate premium products
              from around the world — designed to last, made to be remembered.
            </p>
            <div className="mt-6 flex gap-3">
              {['Instagram', 'Twitter', 'YouTube'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="rounded-full border border-paper/20 px-4 py-2 text-xs font-medium text-paper/80 transition-colors hover:border-paper hover:bg-paper hover:text-ink"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-paper/50">Shop</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/products" className="text-paper/80 transition-colors hover:text-paper">All Products</Link></li>
              <li><Link to="/products?category=audio" className="text-paper/80 transition-colors hover:text-paper">Audio</Link></li>
              <li><Link to="/products?category=watches" className="text-paper/80 transition-colors hover:text-paper">Watches</Link></li>
              <li><Link to="/cart" className="text-paper/80 transition-colors hover:text-paper">Your Cart</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-paper/50">Account</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/login" className="text-paper/80 transition-colors hover:text-paper">Sign In</Link></li>
              <li><Link to="/register" className="text-paper/80 transition-colors hover:text-paper">Create Account</Link></li>
              <li><Link to="/myorders" className="text-paper/80 transition-colors hover:text-paper">My Orders</Link></li>
              <li><a href="#" className="text-paper/80 transition-colors hover:text-paper">Customer Support</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-paper/10 pt-8 text-xs text-paper/50 sm:flex-row">
          <p>© {new Date().getFullYear()} LUXE. All rights reserved.</p>
          <p>Designed with intent. Crafted with care.</p>
        </div>
      </div>
    </footer>
  )
}
