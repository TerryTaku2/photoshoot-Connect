"use client";

import { useTransition } from "react";
import { deletePhoto } from "@/app/actions/photo";

export function DeleteButton({ photoId }: { photoId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => deletePhoto(photoId))}
      className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-100"
    >
      {pending ? "…" : "Delete"}
    </button>
  );
}
