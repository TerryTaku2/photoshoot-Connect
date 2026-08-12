"use client";

import { useActionState, useRef } from "react";
import { uploadPhoto } from "@/app/actions/photo";

export function UploadForm() {
  const [state, action, pending] = useActionState(uploadPhoto, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await action(formData);
        formRef.current?.reset();
      }}
      className="flex flex-wrap items-end gap-4 rounded-sm border border-line p-5"
    >
      <div>
        <label className="block text-sm text-ink-soft" htmlFor="file">
          Photo
        </label>
        <input id="file" name="file" type="file" accept="image/jpeg,image/png,image/webp" required className="mt-1 text-sm" />
      </div>
      <div>
        <label className="block text-sm text-ink-soft" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          className="mt-1 rounded-sm border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-accent"
        />
      </div>
      <div>
        <label className="block text-sm text-ink-soft" htmlFor="category">
          Album / category
        </label>
        <input
          id="category"
          name="category"
          placeholder="Weddings, Graduations…"
          className="mt-1 rounded-sm border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-accent"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-canvas transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Uploading…" : "Upload"}
      </button>
      {state?.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
