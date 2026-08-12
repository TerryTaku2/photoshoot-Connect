"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";

export type BookingFormState = { error?: string; success?: boolean } | undefined;

export async function createBooking(
  slug: string,
  _prevState: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  const clientName = String(formData.get("clientName") || "").trim();
  const clientEmail = String(formData.get("clientEmail") || "").trim();
  const eventDateRaw = String(formData.get("eventDate") || "");
  const message = String(formData.get("message") || "").trim();

  if (clientName.length < 2) return { error: "Please enter your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) return { error: "Please enter a valid email." };
  const eventDate = new Date(eventDateRaw);
  if (Number.isNaN(eventDate.getTime())) return { error: "Please choose a date." };

  const studio = await db.studio.findUnique({ where: { slug } });
  if (!studio) return { error: "Studio not found." };

  await db.booking.create({
    data: { studioId: studio.id, clientName, clientEmail, eventDate, message },
  });

  revalidatePath("/dashboard/bookings");
  return { success: true };
}

export async function updateBookingStatus(bookingId: string, status: "confirmed" | "declined") {
  const { userId } = await verifySession();
  const studio = await db.studio.findUnique({ where: { ownerId: userId } });
  if (!studio) return;

  const booking = await db.booking.findUnique({ where: { id: bookingId } });
  if (!booking || booking.studioId !== studio.id) return;

  await db.booking.update({ where: { id: bookingId }, data: { status } });
  revalidatePath("/dashboard/bookings");
}
