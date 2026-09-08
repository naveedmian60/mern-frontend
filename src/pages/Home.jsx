import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import FeatureStrip from '../components/FeatureStrip'
import ProductCard from '../components/ProductCard'
import { ArrowRightIcon } from '../components/Icons'
import QuickViewModal from '../components/QuickViewModal'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const { data } = await api.get('/products')
        if (!active) return
        const list = Array.isArray(data) ? data : data.products || []
        setProducts(list.slice(0, 8))
      } catch (err) {
        setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        {/* Gradient backdrop */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0b] via-[#1c1c1f] to-[#3a2e1f]" />
          <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-accent/30 blur-[120px]" />
          <div className="absolute right-0 top-0 h-[40rem] w-[40rem] rounded-full bg-accent-dark/20 blur-[140px]" />
          {/* subtle grain */}
          <div
            className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div className="mx-auto w-full max-w-7xl px-6 pt-32">
          <div className="max-w-3xl">
            <p className="eyebrow text-accent animate-fade-up">New · Autumn Collection 2026</p>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight text-paper sm:text-7xl lg:text-8xl animate-fade-up" style={{ animationDelay: '100ms' }}>
              Sound, in its
              <br />
              <span className="italic text-accent">purest</span> form.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-paper/65 sm:text-lg animate-fade-up" style={{ animationDelay: '200ms' }}>
              Immerse yourself in premium audio, crafted with obsessive precision.
              Each piece — a quiet revolution in design and engineering.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
              <Link
                to="/products"
                className="group inline-flex items-center gap-2 rounded-full bg-paper px-7 py-3.5 text-sm font-medium text-ink transition-all duration-300 hover:bg-white hover:shadow-[0_20px_40px_-10px_rgba(250,250,250,0.3)]"
                style={{ transitionTimingFunction: 'var(--ease-luxe)' }}
              >
                Explore Collection
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full border border-paper/30 px-7 py-3.5 text-sm font-medium text-paper transition-all duration-300 hover:border-paper hover:bg-paper/10"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex h-10 w-6 items-start justify-center rounded-full border border-paper/30 p-1.5">
            <div className="h-2 w-1 animate-bounce rounded-full bg-paper/60" />
          </div>
        </div>
      </section>

      {/* ---------- FEATURE STRIP ---------- */}
      <FeatureStrip />

      {/* ---------- PRODUCT GRID ---------- */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Curated Selection</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Featured Products
            </h2>
          </div>
          <Link
            to="/products"
            className="group hidden items-center gap-1 text-sm font-medium text-ink/60 transition-colors hover:text-ink sm:inline-flex"
          >
            View all
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton />
        ) : error ? (
          <div className="mt-12 rounded-2xl border border-dashed border-line bg-paper-soft p-12 text-center">
            <p className="text-sm text-ink/60">{error}</p>
            <p className="mt-1 text-xs text-ink/40">Make sure the backend is running on http://localhost:5000/api</p>
          </div>
        ) : products.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-line bg-paper-soft p-12 text-center">
            <p className="text-sm text-ink/60">No products yet. Add some from the Admin dashboard.</p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center sm:hidden">
          <Link to="/products" className="btn-secondary">View All Products</Link>
        </div>
      </section>

      {/* ---------- CINEMATIC BANNER ---------- */}
      <section className="relative overflow-hidden bg-ink py-32">
        <div className="absolute inset-0 -z-0">
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <p className="eyebrow text-accent">Crafted, not manufactured</p>
          <h2 className="mt-6 font-display text-4xl font-bold leading-tight text-paper sm:text-6xl">
            Where engineering meets emotion.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-paper/60 sm:text-lg">
            Every LUXE product is the result of thousands of hours of refinement —
            a dialogue between materials, mechanics, and the people who use them.
          </p>
          <Link
            to="/products"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-paper px-7 py-3.5 text-sm font-medium text-ink transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_20px_40px_-10px_rgba(250,250,250,0.3)]"
          >
            Discover the Collection
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="mt-12 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="aspect-[4/5] animate-pulse bg-paper-soft" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-3/4 animate-pulse rounded bg-paper-soft" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-paper-soft" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-paper-soft" />
          </div>
        </div>
      ))}
    </div>
  )
}