"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { layouts, type LayoutId } from "@/lib/layouts";

export type StudioFormState = { error?: string; success?: boolean } | undefined;

export async function updateStudio(
  _prevState: StudioFormState,
  formData: FormData
): Promise<StudioFormState> {
  const { userId } = await verifySession();

  const brandName = String(formData.get("brandName") || "").trim();
  const tagline = String(formData.get("tagline") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const instagram = String(formData.get("instagram") || "").trim();
  const primaryColor = String(formData.get("primaryColor") || "#1b1917");
  const accentColor = String(formData.get("accentColor") || "#9c7a4f");
  const canvasColor = String(formData.get("canvasColor") || "#faf8f5");

  if (brandName.length < 2) return { error: "Studio name is too short." };

  const hexPattern = /^#[0-9a-fA-F]{6}$/;
  if (![primaryColor, accentColor, canvasColor].every((c) => hexPattern.test(c))) {
    return { error: "Theme colors must be valid hex values." };
  }

  const studio = await db.studio.findUnique({ where: { ownerId: userId } });
  if (!studio) return { error: "Studio not found." };

  await db.studio.update({
    where: { id: studio.id },
    data: {
      brandName,
      tagline,
      description,
      email,
      phone,
      location,
      instagram,
      primaryColor,
      accentColor,
      canvasColor,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/studio/${studio.slug}`);
  return { success: true };
}

export async function updateLayout(layout: LayoutId) {
  const { userId } = await verifySession();
  if (!layouts.some((l) => l.id === layout)) return;

  const studio = await db.studio.findUnique({ where: { ownerId: userId } });
  if (!studio) return;

  await db.studio.update({ where: { id: studio.id }, data: { layout } });

  revalidatePath("/dashboard");
  revalidatePath(`/studio/${studio.slug}`);
}
