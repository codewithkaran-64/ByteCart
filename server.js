require("dotenv").config();

const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const connectDB = require("./database/db");
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const { requireLogin, checkLogin } = require("./middleware/auth");

const app = express();

const PORT = process.env.PORT || 3000;

const CLIENT_URL = process.env.CLIENT_URL || `http://localhost:${PORT}`;

// Stripe is only initialized if a secret key is present, so the rest of the
// site still works even before you've added your Stripe test keys.
const stripe = process.env.STRIPE_SECRET_KEY
    ? require("stripe")(process.env.STRIPE_SECRET_KEY.trim())
    : null;

// ==========================
// CONNECT TO DATABASE
// ==========================

connectDB();

// ==========================
// MIDDLEWARE
// ==========================

app.use(express.json());
app.use(cookieParser());

// Serve index.html, style.css, script.js, login.html, etc.
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


// ==========================
// REGISTER
// ==========================

app.post("/api/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({
                message: "Please fill in all fields."
            });
        }

        if (password.length < 6) {

            return res.status(400).json({
                message: "Password must be at least 6 characters."
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {

            return res.status(400).json({
                message: "This email is already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        res.json({
            message: "Registration successful! You can now login.",
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Something went wrong. Please try again."
        });
    }
});


// ==========================
// LOGIN
// ==========================

app.post("/api/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                message: "Please enter email and password."
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {

            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const passwordCorrect = await bcrypt.compare(password, user.password);

        if (!passwordCorrect) {

            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const tokenPayload = {
            id: user._id,
            name: user.name,
            email: user.email
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            sameSite: "lax"
        });

        res.json({
            message: "Login successful!",
            user: tokenPayload
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Something went wrong. Please try again."
        });
    }
});


// ==========================
// CHECK LOGGED-IN USER
// ==========================

app.get("/api/user", checkLogin, (req, res) => {

    if (!req.user) {

        return res.status(401).json({
            message: "User is not logged in."
        });
    }

    res.json(req.user);
});


// ==========================
// LOGOUT
// ==========================

app.post("/api/logout", (req, res) => {

    res.clearCookie("token");

    res.json({
        message: "Logout successful."
    });
});


// ==========================
// GET PRODUCTS
// (supports ?category=... and ?search=... query params)
// ==========================

app.get("/api/products", async (req, res) => {

    try {

        const { category, search } = req.query;

        const filter = {};

        if (category && category !== "All") {
            filter.category = category;
        }

        if (search) {
            filter.p_name = { $regex: search, $options: "i" };
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });

        res.json(products);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Could not load products."
        });
    }
});


// ==========================
// GET CATEGORIES
// ==========================

app.get("/api/categories", async (req, res) => {

    try {

        const categories = await Product.distinct("category");

        res.json(categories);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Could not load categories."
        });
    }
});


// ==========================
// CREATE STRIPE CHECKOUT SESSION (requires login)
// ==========================
// The cart itself never sets the price that gets charged - we always
// re-look-up each product's real price from MongoDB here, so a user
// can't tamper with prices from the browser.

app.post("/api/create-checkout-session", requireLogin, async (req, res) => {

    try {

        if (!stripe) {

            return res.status(500).json({
                message: "Payments are not configured yet. Add STRIPE_SECRET_KEY to your .env file."
            });
        }

        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {

            return res.status(400).json({
                message: "Your cart is empty."
            });
        }

        const productIds = [...new Set(items.map((item) => item.id))];

        const products = await Product.find({ _id: { $in: productIds } });

        if (products.length !== productIds.length) {

            return res.status(400).json({
                message: "One or more products are invalid."
            });
        }

        let total = 0;

        const orderItems = [];
        const lineItems = [];

        items.forEach((item) => {

            const product = products.find(
                (p) => p._id.toString() === item.id
            );

            const quantity = Math.max(1, Number(item.quantity) || 1);

            total += product.p_price * quantity;

            orderItems.push({
                product: product._id,
                p_name: product.p_name,
                p_price: product.p_price,
                quantity
            });

            lineItems.push({
                quantity,
                price_data: {
                    currency: "inr",
                    unit_amount: Math.round(product.p_price * 100), // paise
                    product_data: {
                        name: product.p_name,
                        images: product.image ? [product.image] : undefined
                    }
                }
            });
        });

        // Create a "pending" order up front so we have a record even if
        // the shopper abandons the Stripe checkout page.
        const order = await Order.create({
            user: req.user.id,
            customerName: req.user.name,
            items: orderItems,
            total,
            status: "pending",
            paymentStatus: "pending"
        });

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card", "upi"],
            line_items: lineItems,
            customer_email: req.user.email,
            success_url: `${CLIENT_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${CLIENT_URL}/cancel.html`,
            metadata: {
                orderId: order._id.toString()
            }
        });

        order.stripeSessionId = session.id;
        await order.save();

        res.json({
            url: session.url
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Could not start checkout."
        });
    }
});


// ==========================
// VERIFY A CHECKOUT SESSION (requires login)
// ==========================
// Called by success.html after Stripe redirects back, to confirm the
// payment actually went through and to fetch the order details to show.

app.get("/api/checkout-session/:sessionId", requireLogin, async (req, res) => {

    try {

        if (!stripe) {

            return res.status(500).json({
                message: "Payments are not configured yet."
            });
        }

        const session = await stripe.checkout.sessions.retrieve(
            req.params.sessionId
        );

        const order = await Order.findOne({
            stripeSessionId: req.params.sessionId,
            user: req.user.id
        });

        if (!order) {

            return res.status(404).json({
                message: "Order not found."
            });
        }

        if (session.payment_status === "paid" && order.paymentStatus !== "paid") {

            order.paymentStatus = "paid";
            order.status = "confirmed";
            await order.save();
        }

        res.json({
            paymentStatus: session.payment_status,
            order: {
                id: order._id,
                items: order.items,
                total: order.total,
                status: order.status,
                paymentStatus: order.paymentStatus,
                createdAt: order.createdAt
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Could not verify checkout session."
        });
    }
});


// ==========================
// GET MY ORDERS (requires login)
// ==========================

app.get("/api/orders", requireLogin, async (req, res) => {

    try {

        const orders = await Order.find({ user: req.user.id }).sort({
            createdAt: -1
        });

        res.json(orders);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Could not load orders."
        });
    }
});


// ==========================
// START SERVER
// ==========================

app.listen(PORT, () => {

    console.log("");
    console.log("==============================");
    console.log("       BYTECART ONLINE       ");
    console.log("==============================");
    console.log("");
    console.log(`Website: http://localhost:${PORT}`);
    console.log("");
});
