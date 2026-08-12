import { getCurrentStudio } from "@/lib/dal";
import { db } from "@/lib/db";
import { StatusButtons } from "./status-buttons";

function isUpcoming(date: Date) {
  const days = (date.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= 7;
}

export default async function DashboardBookingsPage() {
  const studio = await getCurrentStudio();
  if (!studio) return null;

  const bookings = await db.booking.findMany({
    where: { studioId: studio.id },
    orderBy: { eventDate: "asc" },
  });

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">Bookings</h1>
      <p className="mt-2 text-sm text-ink-soft">Requests submitted through your public page.</p>

      {bookings.length === 0 ? (
        <p className="mt-10 text-sm text-ink-soft">No booking requests yet.</p>
      ) : (
        <div className="mt-8 divide-y divide-line border-y border-line">
          {bookings.map((booking) => (
            <div key={booking.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-medium text-ink">
                  {booking.clientName}{" "}
                  {isUpcoming(booking.eventDate) && (
                    <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] uppercase tracking-wide text-accent">
                      Upcoming
                    </span>
                  )}
                </p>
                <p className="text-xs text-ink-soft">{booking.clientEmail}</p>
                <p className="mt-1 text-sm text-ink-soft">
                  {booking.eventDate.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                {booking.message && <p className="mt-1 max-w-md text-sm text-ink-soft">{booking.message}</p>}
              </div>
              <StatusButtons bookingId={booking.id} status={booking.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
