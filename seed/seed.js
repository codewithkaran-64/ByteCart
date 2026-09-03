// Run this with: npm run seed
// It connects to MongoDB and inserts the 40 sample products
// (only if the products collection is currently empty).

require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../database/db");
const Product = require("../models/Product");
const products = require("./products");

async function run() {

    await connectDB();

    const existingCount = await Product.countDocuments();

    if (existingCount > 0) {

        console.log(
            `Products collection already has ${existingCount} item(s). Skipping seed.`
        );

        console.log(
            "To re-seed from scratch, delete the products collection first, then run 'npm run seed' again."
        );

    } else {

        await Product.insertMany(products);

        console.log(`Inserted ${products.length} sample products into MongoDB.`);
    }

    await mongoose.connection.close();

    process.exit(0);
}

run().catch((error) => {

    console.error("Seeding failed:", error.message);

    process.exit(1);
});
