import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'
import QuickViewModal from '../components/QuickViewModal'
import { ArrowRightIcon } from '../components/Icons'
import { ChevronDown } from 'lucide-react'
// ✅ Custom Sort Dropdown Component
function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const options = [
    { value: 'default', label: 'Sort by' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'name', label: 'Name A-Z' },
  ]

  const selected = options.find(o => o.value === value)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative w-full sm:w-auto" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink outline-none transition-all hover:border-ink/30 focus:border-ink focus:ring-1 focus:ring-ink/20 sm:w-auto sm:min-w-[160px]"
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown className={`w-4 h-4 text-ink/50 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-full sm:min-w-[200px] overflow-hidden rounded-2xl border border-line bg-white shadow-xl animate-dropdown">
          <div className="p-1.5">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={`w-full text-left rounded-xl px-4 py-2.5 text-sm transition-all ${
                  value === opt.value
                    ? 'bg-ink text-paper font-semibold'
                    : 'text-ink/70 hover:bg-paper-soft hover:text-ink font-medium'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Products() {
  const { category: urlCategory } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState(urlCategory || 'All')
  const [sortBy, setSortBy] = useState('default')
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const { data } = await api.get('/products')
        if (!active) return
        const list = Array.isArray(data) ? data : data.products || []
        setProducts(list)
      } catch (err) {
        setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))]

  let filtered = products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    const matchSearch = p.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
                        p.brand?.toLowerCase().includes(searchInput.toLowerCase())
    return matchCat && matchSearch
  })

  if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price)
  if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price)
  if (sortBy === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
  if (sortBy === 'name') filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''))

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-12">
      {/* Header */}
      <div className="mb-6 sm:mb-10">
        <p className="eyebrow">Browse</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
          All Products
        </h1>
        <p className="mt-2 sm:mt-3 text-sm sm:text-base text-ink/60">
          {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Filters Bar */}
      <div className="mb-8 sm:mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs sm:px-5 sm:py-2 sm:text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-ink text-paper shadow-lg'
                  : 'bg-paper-soft text-ink/70 hover:bg-ink/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search + Custom Sort Dropdown */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-full border border-line bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-ink focus:ring-1 focus:ring-ink sm:w-48"
          />
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-line bg-white">
              <div className="aspect-[4/5] animate-pulse bg-paper-soft" />
              <div className="space-y-3 p-3 sm:p-5">
                <div className="h-3 w-3/4 animate-pulse rounded bg-paper-soft" />
                <div className="h-2.5 w-1/3 animate-pulse rounded bg-paper-soft" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-paper-soft" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-8 sm:mt-12 rounded-2xl border border-dashed border-line bg-paper-soft p-8 sm:p-12 text-center">
          <p className="text-sm text-ink/60">{error}</p>
          <p className="mt-1 text-xs text-ink/40">Make sure the backend is running</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-8 sm:mt-12 rounded-2xl border border-dashed border-line bg-paper-soft p-8 sm:p-12 text-center">
          <p className="text-sm text-ink/60">No products found in this category.</p>
          <button
            onClick={() => { setActiveCategory('All'); setSearchInput(''); }}
            className="mt-4 text-sm font-medium text-accent hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      )}

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      <style>{`
        @keyframes dropdown {
          from { opacity: 0; transform: translateY(-8px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-dropdown { animation: dropdown 0.2s ease-out; }
      `}</style>
    </div>
  )
}