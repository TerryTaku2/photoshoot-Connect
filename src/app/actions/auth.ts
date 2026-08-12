"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";
import { slugify } from "@/lib/slugify";

export type AuthState = { error?: string } | undefined;

async function uniqueSlug(base: string) {
  const root = slugify(base) || "studio";
  let candidate = root;
  let n = 1;
  while (await db.studio.findUnique({ where: { slug: candidate } })) {
    n += 1;
    candidate = `${root}-${n}`;
  }
  return candidate;
}

export async function signup(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") || "").trim();
  const brandName = String(formData.get("brandName") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const planInput = String(formData.get("plan") || "starter");
  const plan = ["starter", "pro", "studio"].includes(planInput) ? planInput : "starter";

  if (name.length < 2) return { error: "Please enter your name." };
  if (brandName.length < 2) return { error: "Please enter a studio name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Please enter a valid email." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { error: "An account with that email already exists." };

  const passwordHash = await bcrypt.hash(password, 10);
  const slug = await uniqueSlug(brandName);

  const user = await db.user.create({
    data: {
      name,
      email,
      passwordHash,
      studio: {
        create: {
          slug,
          brandName,
          tagline: "Photography that feels like a memory you already had.",
          description: `${brandName} is a photography studio crafting images worth keeping.`,
          email,
          phone: "",
          location: "",
          plan,
        },
      },
    },
  });

  await createSession(user.id);
  redirect("/dashboard");
}

export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  const user = await db.user.findUnique({ where: { email } });
  if (!user) return { error: "Invalid email or password." };

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return { error: "Invalid email or password." };

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
