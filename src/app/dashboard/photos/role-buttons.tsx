"use client";

import { useTransition } from "react";
import { setPhotoRole } from "@/app/actions/photo";

export function RoleButtons({ photoId, role }: { photoId: string; role: string }) {
  const [pending, startTransition] = useTransition();

  function set(next: "hero" | "about" | "gallery") {
    startTransition(() => setPhotoRole(photoId, next));
  }

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      <RoleButton active={role === "hero"} disabled={pending} onClick={() => set(role === "hero" ? "gallery" : "hero")}>
        Hero
      </RoleButton>
      <RoleButton active={role === "about"} disabled={pending} onClick={() => set(role === "about" ? "gallery" : "about")}>
        About
      </RoleButton>
    </div>
  );
}

function RoleButton({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors disabled:opacity-50 ${
        active ? "border-accent bg-accent/10 text-ink" : "border-line text-ink-soft hover:border-ink-soft"
      }`}
    >
      {active ? `✓ ${children}` : `Set as ${children}`}
    </button>
  );
}
