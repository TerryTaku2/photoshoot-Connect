"use client";

import { useTransition } from "react";
import { updateLayout } from "@/app/actions/studio";
import { layouts, type LayoutId } from "@/lib/layouts";

const MOCKUPS: Record<LayoutId, { label: string; big?: boolean }[]> = {
  classic: [
    { label: "Hero", big: true },
    { label: "About" },
    { label: "Portfolio" },
    { label: "Booking" },
  ],
  "grid-first": [
    { label: "Hero" },
    { label: "Portfolio", big: true },
    { label: "About" },
    { label: "Booking" },
  ],
  minimal: [
    { label: "Hero", big: true },
    { label: "Portfolio" },
    { label: "Booking" },
  ],
};

export function LayoutPicker({ current }: { current: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {layouts.map((layout) => {
        const active = current === layout.id;
        return (
          <div
            key={layout.id}
            className={`flex flex-col rounded-sm border p-4 ${active ? "border-accent" : "border-line"}`}
          >
            <div className="space-y-1">
              {MOCKUPS[layout.id].map((block) => (
                <div
                  key={block.label}
                  className={`rounded-sm bg-black/[0.06] text-center text-[10px] uppercase tracking-wide text-ink-soft ${
                    block.big ? "py-4" : "py-2"
                  }`}
                >
                  {block.label}
                </div>
              ))}
            </div>
            <h3 className="mt-4 font-serif text-lg text-ink">{layout.name}</h3>
            <p className="mt-1 flex-1 text-xs text-ink-soft">{layout.description}</p>
            <button
              type="button"
              disabled={active || pending}
              onClick={() => startTransition(() => updateLayout(layout.id))}
              className="mt-4 rounded-full border border-line px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-accent disabled:opacity-50"
            >
              {active ? "Currently active" : "Use this layout"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
