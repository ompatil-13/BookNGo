import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/travelDB";

async function fixIndex() {
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection("seats");

    // List all indexes
    const indexes = await collection.indexes();
    console.log("\n📋 Current indexes:");
    indexes.forEach(idx => console.log("  -", idx.name, ":", idx.key));

    // Try to drop the old seat_no_1 index
    try {
      await collection.dropIndex("seat_no_1");
      console.log("\n✅ Successfully dropped old index: seat_no_1");
    } catch (err) {
      if (err.code === 27 || err.message.includes("index not found")) {
        console.log("\n⚠️  Index seat_no_1 not found (may already be dropped)");
      } else {
        throw err;
      }
    }

    // Create the new compound index if it doesn't exist
    try {
      await collection.createIndex(
        { seat_no: 1, mode_of_travel: 1 },
        { unique: true, name: "seat_no_1_mode_of_travel_1" }
      );
      console.log("✅ Created new compound unique index: seat_no + mode_of_travel");
    } catch (err) {
      if (err.code === 85 || err.message.includes("already exists")) {
        console.log("✅ Compound index already exists");
      } else {
        throw err;
      }
    }

    // List indexes again to confirm
    const newIndexes = await collection.indexes();
    console.log("\n📋 Updated indexes:");
    newIndexes.forEach(idx => console.log("  -", idx.name, ":", idx.key));

    console.log("\n🎉 Index fix complete! You can now initialize seats for all modes.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

fixIndex();
