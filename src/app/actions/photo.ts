"use server";

import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { getUploadsDir } from "@/lib/uploads";

export type PhotoFormState = { error?: string } | undefined;

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE = 8 * 1024 * 1024;

export async function uploadPhoto(
  _prevState: PhotoFormState,
  formData: FormData
): Promise<PhotoFormState> {
  const { userId } = await verifySession();
  const studio = await db.studio.findUnique({ where: { ownerId: userId } });
  if (!studio) return { error: "Studio not found." };

  const file = formData.get("file");
  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "").trim();

  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image file." };
  if (!ALLOWED_TYPES.has(file.type)) return { error: "Only JPEG, PNG, or WebP images are allowed." };
  if (file.size > MAX_SIZE) return { error: "Image must be under 8MB." };
  if (!title) return { error: "Give the photo a title." };

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const dir = path.join(getUploadsDir(), studio.id);
  await mkdir(dir, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), bytes);

  await db.photo.create({
    data: {
      studioId: studio.id,
      url: `/uploads/${studio.id}/${filename}`,
      title,
      category: category || "Portfolio",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/studio/${studio.slug}`);
}

export async function setPhotoRole(photoId: string, role: "hero" | "about" | "gallery") {
  const { userId } = await verifySession();
  const studio = await db.studio.findUnique({ where: { ownerId: userId } });
  if (!studio) return;

  const photo = await db.photo.findUnique({ where: { id: photoId } });
  if (!photo || photo.studioId !== studio.id) return;

  if (role === "hero" || role === "about") {
    // Only one photo per studio can hold a given slot — demote any existing holder.
    await db.photo.updateMany({
      where: { studioId: studio.id, role },
      data: { role: "gallery" },
    });
  }

  await db.photo.update({ where: { id: photoId }, data: { role } });

  revalidatePath("/dashboard/photos");
  revalidatePath(`/studio/${studio.slug}`);
}

export async function deletePhoto(photoId: string) {
  const { userId } = await verifySession();
  const studio = await db.studio.findUnique({ where: { ownerId: userId } });
  if (!studio) return;

  const photo = await db.photo.findUnique({ where: { id: photoId } });
  if (!photo || photo.studioId !== studio.id) return;

  await db.photo.delete({ where: { id: photoId } });

  const filePath = path.join(getUploadsDir(), photo.url.replace(/^\/uploads\//, ""));
  await unlink(filePath).catch(() => {});

  revalidatePath("/dashboard");
  revalidatePath(`/studio/${studio.slug}`);
}
