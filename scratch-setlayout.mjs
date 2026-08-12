import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const db = new PrismaClient({ adapter });

const layout = process.argv[2];
await db.studio.update({ where: { slug: "aperture-co" }, data: { layout } });
console.log("set layout to", layout);
process.exit(0);
