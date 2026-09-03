const mongoose = require("mongoose");

// ==========================
// CONNECT TO MONGODB
// ==========================

async function connectDB() {

    const uri =
        process.env.MONGODB_URI ||
        "mongodb://127.0.0.1:27017/bytecart";

    try {

        await mongoose.connect(uri);

        console.log("Connected to MongoDB:", mongoose.connection.name);

    } catch (error) {

        console.error("MongoDB connection error:", error.message);

        console.error(
            "Make sure MongoDB is running locally, or set MONGODB_URI to a valid MongoDB Atlas connection string in your .env file."
        );

        process.exit(1);
    }
}

module.exports = connectDB;
