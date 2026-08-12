-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Photo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studioId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'gallery',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Photo_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "Studio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Photo" ("category", "createdAt", "id", "studioId", "title", "url") SELECT "category", "createdAt", "id", "studioId", "title", "url" FROM "Photo";
DROP TABLE "Photo";
ALTER TABLE "new_Photo" RENAME TO "Photo";
CREATE TABLE "new_Studio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "instagram" TEXT NOT NULL DEFAULT '',
    "primaryColor" TEXT NOT NULL DEFAULT '#1b1917',
    "accentColor" TEXT NOT NULL DEFAULT '#9c7a4f',
    "canvasColor" TEXT NOT NULL DEFAULT '#faf8f5',
    "plan" TEXT NOT NULL DEFAULT 'starter',
    "layout" TEXT NOT NULL DEFAULT 'classic',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Studio_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Studio" ("accentColor", "brandName", "canvasColor", "createdAt", "description", "email", "id", "instagram", "location", "ownerId", "phone", "plan", "primaryColor", "slug", "tagline") SELECT "accentColor", "brandName", "canvasColor", "createdAt", "description", "email", "id", "instagram", "location", "ownerId", "phone", "plan", "primaryColor", "slug", "tagline" FROM "Studio";
DROP TABLE "Studio";
ALTER TABLE "new_Studio" RENAME TO "Studio";
CREATE UNIQUE INDEX "Studio_ownerId_key" ON "Studio"("ownerId");
CREATE UNIQUE INDEX "Studio_slug_key" ON "Studio"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
