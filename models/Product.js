const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        // Product name
        p_name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true
        },

        // Product price (in INR)
        p_price: {
            type: Number,
            required: [true, "Product price is required"],
            min: 0
        },

        // Category the product belongs to (used for filtering)
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true
        },

        description: {
            type: String,
            default: "No description available."
        },

        image: {
            type: String,
            required: [true, "Product image is required"]
        },

        stock: {
            type: Number,
            default: 50,
            min: 0
        },

        rating: {
            type: Number,
            default: 4.0,
            min: 0,
            max: 5
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);
