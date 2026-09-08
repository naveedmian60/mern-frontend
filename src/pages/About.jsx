import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '../components/Icons'

const VALUES = [
  { title: 'Obsessive Craft', desc: 'Every detail, reconsidered. Every material, justified. We obsess so you don’t have to.' },
  { title: 'Honest Materials', desc: 'Aerospace-grade aluminum, full-grain leather, optical glass. Nothing decorative, nothing wasted.' },
  { title: 'Built to Last', desc: 'Engineered for a decade of use, repairable for two. Sustainability is a starting point, not a finish.' },
]

export default function About() {
  return (
    <div className="pt-32">
      {/* Intro */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="eyebrow">Our Philosophy</p>
        <h1 className="mt-6 font-display text-5xl font-bold leading-[1.1] tracking-tight text-ink sm:text-7xl">
          We make objects that
          <br />
          <span className="italic text-accent">earn</span> their place.
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-ink/65 sm:text-lg">
          LUXE began with a simple frustration: the things we use every day rarely feel
          considered. So we set out to make products that are not just functional, but
          quietly beautiful — built to be lived with, not consumed.
        </p>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <div
              key={v.title}
              className="rounded-2xl border border-line bg-white p-8 transition-all duration-500 hover:shadow-[0_20px_60px_-20px_rgba(10,10,11,0.12)] animate-fade-up"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <span className="font-display text-4xl font-bold text-accent">
                0{i + 1}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-ink">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl bg-ink p-16 text-center sm:p-24">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/20 blur-[100px]" />
          <div className="relative">
            <h2 className="font-display text-4xl font-bold text-paper sm:text-5xl">
              Experience the difference.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-paper/60">
              Browse the collection and find a piece worth keeping.
            </p>
            <Link
              to="/products"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-paper px-7 py-3.5 text-sm font-medium text-ink transition-all duration-300 hover:translate-y-[-1px]"
            >
              Browse Collection
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
