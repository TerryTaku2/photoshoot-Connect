import Image from "next/image";
import { PlaceholderMedia } from "./PlaceholderMedia";

export function About({
  description,
  location,
  photoUrl,
}: {
  description: string;
  location: string;
  photoUrl?: string;
}) {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-28">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        {photoUrl ? (
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
            <Image
              src={photoUrl}
              alt="Studio portrait session"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <PlaceholderMedia index={3} className="aspect-[4/5] w-full rounded-sm" />
        )}
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-accent">About the Studio</p>
          <h2 className="font-serif text-3xl leading-snug text-ink sm:text-4xl">
            We photograph people as they actually are.
          </h2>
          <p className="mt-6 text-ink-soft leading-relaxed">{description}</p>
          <p className="mt-4 text-ink-soft leading-relaxed">
            Every session starts with a conversation, not a shot list. The result is a
            collection of images — and sometimes film — that hold up long after the
            shoot day is over.
          </p>
          {location && <p className="mt-6 text-sm text-ink-soft">{location}</p>}
        </div>
      </div>
    </section>
  );
}
