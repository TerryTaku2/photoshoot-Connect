import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const db = new PrismaClient({ adapter });

async function main() {
  const email = "demo@aperture-co.com";
  const password = "password123";

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Demo studio already seeded.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      name: "Demo Photographer",
      email,
      passwordHash,
      studio: {
        create: {
          slug: "aperture-co",
          brandName: "Aperture & Co.",
          tagline: "Photography that feels like a memory you already had.",
          description:
            "Aperture & Co. is a photography studio specializing in portrait, graduation, and professional sessions — crafted with care from the first frame to the final print.",
          email: "hello@aperture-co.com",
          phone: "+1 (555) 012-3456",
          location: "Based in New York, available worldwide",
          instagram: "https://instagram.com",
          plan: "pro",
          photos: {
            create: [
              { url: "/photos/graduation-seated.jpg", title: "Class of 2026", category: "Graduation" },
              { url: "/photos/graduation-headshot.jpg", title: "Studio Headshot", category: "Graduation" },
              { url: "/photos/professional-standing.jpg", title: "Professional Portrait", category: "Portrait" },
            ],
          },
        },
      },
    },
  });

  console.log(`Seeded demo studio for user ${user.email} (password: ${password})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
