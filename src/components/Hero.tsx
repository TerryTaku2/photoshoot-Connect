const FALLBACK_GRADIENT = "linear-gradient(135deg, #3a3229 0%, #6b5c47 60%, #9c7a4f 100%)";

function heroBackground(photoUrl?: string) {
  const scrim = "linear-gradient(to bottom, rgba(20,16,12,0.45), rgba(20,16,12,0.5) 45%, rgba(10,8,6,0.85))";
  const base = photoUrl ? `url('${photoUrl}')` : FALLBACK_GRADIENT;
  return [scrim, base].join(", ");
}

export function Hero({ tagline, photoUrl }: { tagline: string; photoUrl?: string }) {
  return (
    <section id="top" className="relative flex h-screen min-h-[560px] w-full items-center justify-center">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: heroBackground(photoUrl),
          backgroundSize: "cover",
          backgroundPosition: "center 15%",
        }}
      />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <p className="mb-5 text-xs uppercase tracking-[0.3em] text-white/70">
          Photography Studio
        </p>
        <h1 className="font-serif text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
          {tagline}
        </h1>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#work"
            className="rounded-full bg-white px-7 py-3 text-sm font-medium text-ink transition-colors hover:bg-white/90"
          >
            View Our Work
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/50 px-7 py-3 text-sm font-medium text-white transition-colors hover:border-white"
          >
            Book a Session
          </a>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/60">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-6 w-6 animate-bounce">
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
