import { defineConfig } from "prisma/config";

// Note: the Prisma CLI's config loader does not read .env files, so the
// fallback below is what local `npx prisma ...` commands use. Platforms that
// inject DATABASE_URL directly into the process env (e.g. Render) override it.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "file:./prisma/dev.db",
  },
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
});
