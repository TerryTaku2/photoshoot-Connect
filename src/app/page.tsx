import Link from "next/link";
import { platform, plans } from "@/lib/platform-config";

const features = [
  {
    title: "Branded studio page",
    description: "A polished, mobile-ready photography website under your own name — no design work needed.",
  },
  {
    title: "Your own theme colors",
    description: "Pick the palette that matches your brand. Changes apply across your whole public page instantly.",
  },
  {
    title: "Booking requests",
    description: "Clients request sessions straight from your page. Confirm or decline from your dashboard.",
  },
  {
    title: "Upcoming-event reminders",
    description: "Bookings within the next 7 days are flagged in your dashboard so nothing slips through.",
  },
  {
    title: "Client chatbot",
    description: "An assistant on your page answers common questions about pricing, booking, and location.",
  },
  {
    title: "Portfolio management",
    description: "Upload and organize your work — it shows up in your public portfolio grid automatically.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="font-serif text-lg text-ink">{platform.name}</span>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#features" className="text-ink-soft hover:text-ink">
              Features
            </a>
            <a href="#pricing" className="text-ink-soft hover:text-ink">
              Pricing
            </a>
            <Link href="/login" className="text-ink-soft hover:text-ink">
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-ink px-4 py-2 text-canvas transition-opacity hover:opacity-90"
            >
              Start your studio
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-28 text-center">
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-accent">A T-Tech Connect property</p>
          <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
            {platform.tagline}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-ink-soft leading-relaxed">{platform.description}</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-full bg-ink px-7 py-3 text-sm font-medium text-canvas transition-opacity hover:opacity-90"
            >
              Start your studio
            </Link>
            <Link
              href="/studio/aperture-co"
              className="rounded-full border border-line px-7 py-3 text-sm font-medium text-ink transition-colors hover:border-accent"
            >
              See an example site
            </Link>
          </div>
        </section>

        <section id="features" className="border-y border-line bg-black/[0.02]">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <h2 className="font-serif text-3xl text-ink sm:text-4xl">Everything to run bookings, in one place.</h2>
            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title}>
                  <h3 className="font-serif text-lg text-ink">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-center font-serif text-3xl text-ink sm:text-4xl">Simple pricing</h2>
          <p className="mt-3 text-center text-sm text-ink-soft">
            Billing isn&apos;t connected yet — every plan is free while {platform.name} is in beta.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`flex flex-col rounded-sm border p-8 ${
                  plan.highlighted ? "border-accent" : "border-line"
                }`}
              >
                <h3 className="font-serif text-xl text-ink">{plan.name}</h3>
                <p className="mt-2 text-sm text-ink-soft">{plan.description}</p>
                <p className="mt-6 text-3xl text-ink">
                  {plan.price}
                  <span className="text-sm text-ink-soft">{plan.period}</span>
                </p>
                <ul className="mt-6 flex-1 space-y-2 text-sm text-ink-soft">
                  {plan.features.map((f) => (
                    <li key={f}>— {f}</li>
                  ))}
                </ul>
                <Link
                  href={`/signup?plan=${plan.id}`}
                  className={`mt-8 rounded-full px-5 py-3 text-center text-sm font-medium transition-opacity hover:opacity-90 ${
                    plan.highlighted ? "bg-ink text-canvas" : "border border-line text-ink"
                  }`}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-xs text-ink-soft">
          © {new Date().getFullYear()} {platform.name}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
