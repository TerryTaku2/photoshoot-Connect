"use client";

import { useTransition } from "react";
import { updateBookingStatus } from "@/app/actions/booking";

export function StatusButtons({ bookingId, status }: { bookingId: string; status: string }) {
  const [pending, startTransition] = useTransition();

  if (status !== "new") {
    return (
      <span className={`text-xs uppercase tracking-wide ${status === "confirmed" ? "text-emerald-700" : "text-red-600"}`}>
        {status}
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => updateBookingStatus(bookingId, "confirmed"))}
        className="rounded-full border border-line px-3 py-1 text-xs text-ink hover:border-accent disabled:opacity-50"
      >
        Confirm
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => updateBookingStatus(bookingId, "declined"))}
        className="rounded-full border border-line px-3 py-1 text-xs text-ink-soft hover:border-accent disabled:opacity-50"
      >
        Decline
      </button>
    </div>
  );
}
