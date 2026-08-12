"use client";

import { useActionState } from "react";
import { createBooking } from "@/app/actions/booking";

type Studio = {
  brandName: string;
  email: string;
  phone: string;
  location: string;
  instagram: string;
  slug: string;
};

export function BookingSection({ studio }: { studio: Studio }) {
  const action = createBooking.bind(null, studio.slug);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <section id="contact" className="border-t border-line bg-black/[0.02]">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2">
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-accent">Get in Touch</p>
          <h2 className="font-serif text-3xl leading-snug text-ink sm:text-4xl">
            Let&apos;s plan your session.
          </h2>
          <div className="mt-8 space-y-2 text-sm text-ink-soft">
            {studio.location && <p>{studio.location}</p>}
            {studio.email && (
              <p>
                <a href={`mailto:${studio.email}`} className="hover:text-accent">
                  {studio.email}
                </a>
              </p>
            )}
            {studio.phone && (
              <p>
                <a href={`tel:${studio.phone}`} className="hover:text-accent">
                  {studio.phone}
                </a>
              </p>
            )}
            {studio.instagram && (
              <p>
                <a href={studio.instagram} className="hover:text-accent">
                  Instagram
                </a>
              </p>
            )}
          </div>
        </div>

        {state?.success ? (
          <div className="flex items-center rounded-sm border border-line bg-canvas p-8 text-ink">
            Thanks — your request has been sent. {studio.brandName} will be in touch soon.
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="clientName"
                required
                placeholder="Your name"
                className="rounded-sm border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-accent"
              />
              <input
                name="clientEmail"
                type="email"
                required
                placeholder="Email"
                className="rounded-sm border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-accent"
              />
            </div>
            <input
              name="eventDate"
              type="date"
              required
              className="w-full rounded-sm border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />
            <textarea
              name="message"
              rows={4}
              placeholder="Tell us about the shoot you have in mind"
              className="w-full rounded-sm border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />
            {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-canvas transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {pending ? "Sending…" : "Request booking"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
