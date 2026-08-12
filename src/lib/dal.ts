import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "./session";
import { db } from "./db";

export const verifySession = cache(async () => {
  const session = await getSession();
  if (!session?.userId) redirect("/login");
  return { userId: session.userId as string };
});

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session?.userId) return null;
  return db.user.findUnique({ where: { id: session.userId as string } });
});

export const getCurrentStudio = cache(async () => {
  const session = await getSession();
  if (!session?.userId) return null;
  return db.studio.findUnique({ where: { ownerId: session.userId as string } });
});
