"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { PlaceholderMedia } from "./PlaceholderMedia";

export type PortfolioPhoto = {
  id: string;
  title: string;
  category: string;
  url: string;
};

export function Portfolio({
  photos,
  showHeading = true,
  showLabels = true,
  large = false,
}: {
  photos: PortfolioPhoto[];
  showHeading?: boolean;
  showLabels?: boolean;
  large?: boolean;
}) {
  const categories = useMemo(
    () => Array.from(new Set(photos.map((p) => p.category))).filter(Boolean),
    [photos]
  );
  const [active, setActive] = useState<string>("All");
  const visible = active === "All" ? photos : photos.filter((p) => p.category === active);
  const gridCols = large ? "sm:grid-cols-2" : "sm:grid-cols-3";

  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-28">
      {showHeading && (
        <div className="mb-12">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-accent">Selected Work</p>
          <h2 className="font-serif text-3xl leading-snug text-ink sm:text-4xl">
            A few recent stories.
          </h2>
        </div>
      )}

      {photos.length > 0 && categories.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
                active === cat ? "border-accent bg-accent/10 text-ink" : "border-line text-ink-soft hover:border-ink-soft"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {photos.length === 0 ? (
        <div className={`grid grid-cols-2 gap-4 ${gridCols}`}>
          {[0, 1, 2].map((i) => (
            <PlaceholderMedia key={i} index={i} className="aspect-[4/5] w-full rounded-sm" />
          ))}
        </div>
      ) : (
        <div className={`grid grid-cols-2 gap-4 ${gridCols}`}>
          {visible.map((photo) => (
            <div key={photo.id} className="group">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
                <Image
                  src={photo.url}
                  alt={photo.title}
                  fill
                  sizes="(min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                {showLabels && (
                  <>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 text-[11px] uppercase tracking-wide text-white/80">
                      {photo.category}
                    </span>
                  </>
                )}
              </div>
              {showLabels && <p className="mt-3 text-sm text-ink-soft">{photo.title}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
