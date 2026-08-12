"use client";

import { useActionState, useState } from "react";
import { updateStudio } from "@/app/actions/studio";
import { palettes } from "@/lib/palettes";
import type { Studio } from "@prisma/client";

const COLOR_FIELDS = [
  { name: "primaryColor", label: "Text color" },
  { name: "accentColor", label: "Accent color" },
  { name: "canvasColor", label: "Background color" },
] as const;

export function StudioForm({ studio }: { studio: Studio }) {
  const [state, action, pending] = useActionState(updateStudio, undefined);
  const [colors, setColors] = useState({
    primaryColor: studio.primaryColor,
    accentColor: studio.accentColor,
    canvasColor: studio.canvasColor,
  });

  return (
    <form action={action} className="space-y-8">
      <section className="space-y-5">
        <h2 className="font-serif text-xl text-ink">Brand</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Studio name" name="brandName" defaultValue={studio.brandName} />
          <Field label="Email" name="email" defaultValue={studio.email} type="email" />
          <Field label="Phone" name="phone" defaultValue={studio.phone} />
          <Field label="Location" name="location" defaultValue={studio.location} />
          <Field label="Instagram URL" name="instagram" defaultValue={studio.instagram} />
        </div>
        <Field label="Tagline" name="tagline" defaultValue={studio.tagline} />
        <TextArea label="About / description" name="description" defaultValue={studio.description} />
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-xl text-ink">Theme colors</h2>
        <p className="text-sm text-ink-soft">
          Choose colors for your public studio page at /studio/{studio.slug}.
        </p>

        <div>
          <p className="text-sm text-ink-soft">Preset palettes</p>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {palettes.map((palette) => {
              const active =
                colors.primaryColor === palette.primaryColor &&
                colors.accentColor === palette.accentColor &&
                colors.canvasColor === palette.canvasColor;
              return (
                <button
                  key={palette.name}
                  type="button"
                  onClick={() =>
                    setColors({
                      primaryColor: palette.primaryColor,
                      accentColor: palette.accentColor,
                      canvasColor: palette.canvasColor,
                    })
                  }
                  className={`rounded-sm border p-2 text-left transition-colors ${
                    active ? "border-accent" : "border-line hover:border-ink-soft"
                  }`}
                >
                  <div className="flex h-6 overflow-hidden rounded-sm border border-line">
                    <span className="w-1/3" style={{ backgroundColor: palette.canvasColor }} />
                    <span className="w-1/3" style={{ backgroundColor: palette.primaryColor }} />
                    <span className="w-1/3" style={{ backgroundColor: palette.accentColor }} />
                  </div>
                  <p className="mt-1.5 text-xs text-ink-soft">{palette.name}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {COLOR_FIELDS.map((field) => (
            <div key={field.name}>
              <label className="block text-sm text-ink-soft" htmlFor={field.name}>
                {field.label}
              </label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="color"
                  id={field.name}
                  name={field.name}
                  value={colors[field.name]}
                  onChange={(e) => setColors((prev) => ({ ...prev, [field.name]: e.target.value }))}
                  className="h-10 w-12 cursor-pointer rounded-sm border border-line bg-transparent p-1"
                />
                <span className="text-xs text-ink-soft">{colors[field.name]}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-700">Saved.</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-canvas transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-ink-soft" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-sm border border-line bg-canvas px-3 py-2 text-ink outline-none focus:border-accent"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <div>
      <label className="block text-sm text-ink-soft" htmlFor={name}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        rows={4}
        className="mt-1 w-full rounded-sm border border-line bg-canvas px-3 py-2 text-ink outline-none focus:border-accent"
      />
    </div>
  );
}
