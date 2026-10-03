// scripts/syncDb.ts
// One-off script: connects to MongoDB, creates EVERY collection that has a
// Mongoose model (core + pharmacy), builds all indexes, and prints the result.
// Run from the backend folder:   npx tsx scripts/syncDb.ts
import dotenv from "dotenv";
import mongoose from "mongoose";
import "../models"; // registers every model (models/index.ts)

dotenv.config();

async function main(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is missing in backend/.env");

  const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  const db = conn.connection.db;
  if (!db) throw new Error("No database handle after connecting");
  console.log(`Connected to database: ${conn.connection.name}`);
  if (conn.connection.name !== "OPDFlow") {
    console.warn(`WARNING: expected database "OPDFlow" but connected to "${conn.connection.name}". Check the /OPDFlow part of MONGODB_URI.`);
  }

  const models = Object.values(mongoose.models);
  console.log(`Models registered: ${models.length}\n`);

  const existing = new Set((await db.listCollections().toArray()).map((c) => c.name));
  let failed = 0;

  for (const model of models) {
    const name = model.collection.name;
    try {
      if (!existing.has(name)) await model.createCollection();
      await model.syncIndexes(); // creates missing indexes, drops indexes no longer in the schema
      console.log(`OK    ${name}${existing.has(name) ? "  (already existed, indexes synced)" : "  (created)"}`);
    } catch (err) {
      failed++;
      console.error(`FAIL  ${name}: ${(err as Error).message}`);
    }
  }

  const finalNames = (await db.listCollections().toArray()).map((c) => c.name).sort();
  console.log(`\nCollections now in "${conn.connection.name}": ${finalNames.length}`);
  finalNames.forEach((n) => console.log(`  - ${n}`));
  console.log(failed ? `\n${failed} model(s) FAILED, see messages above.` : "\nAll collections are in place.");

  await mongoose.disconnect();
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error("Sync failed:", (err as Error).message);
  process.exit(1);
});
