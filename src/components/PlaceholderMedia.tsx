const GRADIENTS = [
  "linear-gradient(135deg, #3a3229 0%, #6b5c47 60%, #9c7a4f 100%)",
  "linear-gradient(135deg, #4a4038 0%, #7a6a56 60%, #b39169 100%)",
  "linear-gradient(135deg, #2b2925 0%, #55483a 60%, #8a6f4e 100%)",
  "linear-gradient(135deg, #504336 0%, #7c6a52 60%, #c9a668 100%)",
  "linear-gradient(135deg, #33302b 0%, #625442 60%, #a3805a 100%)",
  "linear-gradient(135deg, #443a30 0%, #705f4a 60%, #b58f5f 100%)",
];

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.4">
      <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.1a1 1 0 0 0 .87-.5l.6-1A1.5 1.5 0 0 1 10.36 5h3.28a1.5 1.5 0 0 1 1.29.75l.6 1a1 1 0 0 0 .87.5h2.1A1.5 1.5 0 0 1 20.5 8.5v9A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5v-9Z" />
      <circle cx="12" cy="13" r="3.25" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}

export function PlaceholderMedia({
  index = 0,
  type = "photo",
  label,
  className = "",
}: {
  index?: number;
  type?: "photo" | "video";
  label?: string;
  className?: string;
}) {
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundImage: gradient }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 15%, rgba(255,255,255,0.16), transparent 55%)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/35 text-white/80">
          {type === "video" ? <PlayIcon /> : <CameraIcon />}
        </div>
      </div>
      {label && (
        <span className="absolute bottom-3 left-3 text-[11px] uppercase tracking-wide text-white/70">
          {label}
        </span>
      )}
    </div>
  );
}
