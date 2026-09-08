import { TruckIcon, ShieldIcon, RefreshIcon, HeadsetIcon } from './Icons'

const FEATURES = [
  { icon: TruckIcon, title: 'Free Shipping', desc: 'On all orders over $99' },
  { icon: ShieldIcon, title: 'Secure Payment', desc: '256-bit SSL encryption' },
  { icon: RefreshIcon, title: '30-Day Returns', desc: 'Hassle-free return policy' },
  { icon: HeadsetIcon, title: '24/7 Support', desc: 'Dedicated concierge team' },
]

export default function FeatureStrip() {
  return (
    <section className="border-y border-line bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className="group flex items-center gap-4 px-6 py-7 transition-colors duration-300 hover:bg-paper-soft"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-paper transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
              <f.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">{f.title}</p>
              <p className="text-xs text-ink/55">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
