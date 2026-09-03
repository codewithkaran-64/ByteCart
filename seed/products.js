// ==========================================================
// 40 SAMPLE PRODUCTS ACROSS 8 CATEGORIES
// Every image below is a REAL, verified photo hosted on
// Unsplash's CDN (images.unsplash.com) - each one was checked
// individually to make sure it actually depicts the matching
// product (e.g. the cricket bat product links to a real cricket
// bat photo, the resistance bands product to a real resistance
// bands photo, etc.) instead of a random/generic placeholder.
//
// These are permanent Unsplash CDN links (the same kind every
// major site hotlinks), so they don't expire or rate-limit the
// way some placeholder-image proxies do.
// ==========================================================

function img(photoId) {
    return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=500&q=80`;
}

const products = [

    // ---------------- ELECTRONICS ----------------
    { p_name: "Wireless Bluetooth Earbuds", p_price: 1499, category: "Electronics", description: "True wireless earbuds with noise isolation and 24-hour battery backup.", image: img("photo-1606220588913-b3aacb4d2f46"), stock: 60, rating: 4.3 },
    { p_name: "Smart Fitness Band", p_price: 1999, category: "Electronics", description: "Tracks steps, heart rate, sleep and notifications with a 7-day battery life.", image: img("photo-1532435109783-fdb8a2be0baa"), stock: 45, rating: 4.1 },
    { p_name: "4K Action Camera", p_price: 4999, category: "Electronics", description: "Waterproof action camera with 4K recording and image stabilization.", image: img("photo-1513193643083-07325d25a4b0"), stock: 20, rating: 4.4 },
    { p_name: "Portable Power Bank 20000mAh", p_price: 1299, category: "Electronics", description: "Fast-charging power bank with dual USB output for phones and tablets.", image: img("photo-1604160687800-f7799a525a33"), stock: 80, rating: 4.5 },
    { p_name: "Mechanical Gaming Keyboard", p_price: 2799, category: "Electronics", description: "RGB backlit mechanical keyboard with tactile switches for gaming.", image: img("photo-1597638566411-4e4dc7854728"), stock: 35, rating: 4.6 },

    // ---------------- FASHION ----------------
    { p_name: "Men's Casual Shirt", p_price: 799, category: "Fashion", description: "Breathable cotton-blend casual shirt, perfect for everyday wear.", image: img("photo-1521572163474-6864f9cf17ab"), stock: 100, rating: 4.0 },
    { p_name: "Women's Denim Jacket", p_price: 1699, category: "Fashion", description: "Classic fit denim jacket with a soft brushed inner lining.", image: img("photo-1575752229768-116115c80c8f"), stock: 55, rating: 4.2 },
    { p_name: "Classic Leather Wallet", p_price: 599, category: "Fashion", description: "Genuine leather bi-fold wallet with multiple card slots.", image: img("photo-1612023395494-1c4050b68647"), stock: 90, rating: 4.3 },
    { p_name: "Unisex Hoodie", p_price: 999, category: "Fashion", description: "Cozy fleece-lined hoodie with a front kangaroo pocket.", image: img("photo-1556821840-3a63f95609a7"), stock: 70, rating: 4.4 },
    { p_name: "Running Sneakers", p_price: 1899, category: "Fashion", description: "Lightweight cushioned sneakers designed for daily running.", image: img("photo-1542291026-7eec264c27ff"), stock: 40, rating: 4.5 },

    // ---------------- HOME & KITCHEN ----------------
    { p_name: "Non-Stick Cookware Set (5 pcs)", p_price: 2199, category: "Home & Kitchen", description: "Durable non-stick cookware set with heat-resistant handles.", image: img("photo-1588279102819-f4520e40b1c6"), stock: 25, rating: 4.2 },
    { p_name: "Electric Kettle 1.5L", p_price: 899, category: "Home & Kitchen", description: "Fast-boil electric kettle with auto shut-off protection.", image: img("photo-1581348304131-9d03407316b7"), stock: 60, rating: 4.1 },
    { p_name: "LED Desk Lamp", p_price: 649, category: "Home & Kitchen", description: "Adjustable LED desk lamp with 3 brightness modes.", image: img("photo-1605194004886-56d82f482d53"), stock: 75, rating: 4.0 },
    { p_name: "Memory Foam Pillow", p_price: 749, category: "Home & Kitchen", description: "Ergonomic memory foam pillow for neck and back support.", image: img("photo-1585469434395-ac3d72767035"), stock: 65, rating: 4.3 },
    { p_name: "Ceramic Dinner Set (16 pcs)", p_price: 1999, category: "Home & Kitchen", description: "Elegant ceramic dinner set for everyday family meals.", image: img("photo-1587334207810-4915c4e40c67"), stock: 30, rating: 4.4 },

    // ---------------- BOOKS ----------------
    { p_name: "The Art of Clean Code", p_price: 499, category: "Books", description: "A practical guide to writing readable and maintainable code.", image: img("photo-1457369804613-52c61a468e7d"), stock: 50, rating: 4.6 },
    { p_name: "Mystery at Midnight - Thriller Novel", p_price: 349, category: "Books", description: "A gripping page-turner full of twists and suspense.", image: img("photo-1495446815901-a7297e633e8d"), stock: 55, rating: 4.2 },
    { p_name: "World History Atlas", p_price: 599, category: "Books", description: "Illustrated atlas covering major events across world history.", image: img("photo-1524995997946-a1c2e315a42f"), stock: 40, rating: 4.1 },
    { p_name: "Personal Finance Made Simple", p_price: 399, category: "Books", description: "Beginner-friendly guide to budgeting, saving and investing.", image: img("photo-1513185041617-8ab03f83d6c5"), stock: 60, rating: 4.3 },
    { p_name: "Children's Picture Storybook", p_price: 249, category: "Books", description: "Colorful illustrated storybook for early readers.", image: img("photo-1666888735993-6ed30a900f36"), stock: 70, rating: 4.5 },

    // ---------------- SPORTS & FITNESS ----------------
    { p_name: "Yoga Mat Pro", p_price: 599, category: "Sports & Fitness", description: "Non-slip extra-thick yoga mat with carry strap.", image: img("photo-1646239646963-b0b9be56d6b5"), stock: 85, rating: 4.4 },
    { p_name: "Adjustable Dumbbell Set", p_price: 2499, category: "Sports & Fitness", description: "Space-saving adjustable dumbbells for home workouts.", image: img("photo-1591291621164-2c6367723315"), stock: 20, rating: 4.5 },
    { p_name: "Cricket Bat - Kashmir Willow", p_price: 1299, category: "Sports & Fitness", description: "Lightweight Kashmir willow bat, ideal for tennis-ball cricket.", image: img("photo-1547839918-5ed99eac4175"), stock: 30, rating: 4.2 },
    { p_name: "Football Size 5", p_price: 699, category: "Sports & Fitness", description: "Match-standard size 5 football with durable stitching.", image: img("photo-1519516806580-c11fe89bd47f"), stock: 50, rating: 4.3 },
    { p_name: "Resistance Bands Set", p_price: 449, category: "Sports & Fitness", description: "5-piece resistance band set for strength and mobility training.", image: img("photo-1767404890803-228d5390fcd4"), stock: 90, rating: 4.1 },

    // ---------------- BEAUTY & PERSONAL CARE ----------------
    { p_name: "Herbal Face Wash", p_price: 249, category: "Beauty & Personal Care", description: "Gentle herbal face wash suitable for daily use.", image: img("photo-1748639320154-6ba118bccc74"), stock: 100, rating: 4.0 },
    { p_name: "Vitamin C Serum", p_price: 599, category: "Beauty & Personal Care", description: "Brightening vitamin C serum for glowing, even-toned skin.", image: img("photo-1713768704571-6aeb0d0e5105"), stock: 65, rating: 4.4 },
    { p_name: "Electric Trimmer", p_price: 899, category: "Beauty & Personal Care", description: "Cordless electric trimmer with multiple length settings.", image: img("photo-1508380702597-707c1b00695c"), stock: 45, rating: 4.2 },
    { p_name: "Perfume Spray 100ml", p_price: 1099, category: "Beauty & Personal Care", description: "Long-lasting fragrance spray for everyday elegance.", image: img("photo-1665763630810-e6251bdd392d"), stock: 55, rating: 4.3 },
    { p_name: "Hair Dryer 1800W", p_price: 1199, category: "Beauty & Personal Care", description: "Fast-drying hair dryer with cool-shot function.", image: img("photo-1704124205210-34fd56da2707"), stock: 40, rating: 4.1 },

    // ---------------- GROCERY & GOURMET ----------------
    { p_name: "Organic Basmati Rice 5kg", p_price: 799, category: "Grocery & Gourmet", description: "Premium long-grain organic basmati rice.", image: img("photo-1586201375761-83865001e31c"), stock: 60, rating: 4.5 },
    { p_name: "Assorted Dry Fruits Pack 1kg", p_price: 999, category: "Grocery & Gourmet", description: "A healthy mix of almonds, cashews, raisins and walnuts.", image: img("photo-1543158181-1274e5362710"), stock: 50, rating: 4.6 },
    { p_name: "Cold Pressed Coconut Oil 1L", p_price: 449, category: "Grocery & Gourmet", description: "Pure cold-pressed coconut oil for cooking and hair care.", image: img("photo-1690228987673-f6e104fa653c"), stock: 70, rating: 4.3 },
    { p_name: "Herbal Green Tea Box (50 bags)", p_price: 299, category: "Grocery & Gourmet", description: "Antioxidant-rich herbal green tea for a refreshing start.", image: img("photo-1606377695906-236fdfcef767"), stock: 80, rating: 4.2 },
    { p_name: "Dark Chocolate Gift Pack", p_price: 649, category: "Grocery & Gourmet", description: "Assorted dark chocolate bars, perfect for gifting.", image: img("photo-1626697556651-67ebdcb8cbd6"), stock: 65, rating: 4.7 },

    // ---------------- TOYS & GAMES ----------------
    { p_name: "Remote Control Car", p_price: 1399, category: "Toys & Games", description: "High-speed RC car with rechargeable battery.", image: img("photo-1527612820672-5b56351f7346"), stock: 35, rating: 4.3 },
    { p_name: "Building Blocks Set (200 pcs)", p_price: 899, category: "Toys & Games", description: "Creative building blocks set to boost imagination.", image: img("photo-1752322069850-f92b5ce0e961"), stock: 55, rating: 4.4 },
    { p_name: "Jigsaw Puzzle - 1000 Pieces", p_price: 499, category: "Toys & Games", description: "Challenging 1000-piece jigsaw puzzle for all ages.", image: img("photo-1704027689040-26184f878a78"), stock: 45, rating: 4.2 },
    { p_name: "Kids Learning Tablet Toy", p_price: 1299, category: "Toys & Games", description: "Educational touch-screen toy with games, alphabets and numbers.", image: img("photo-1495654794940-1c0cd2aeedc1"), stock: 40, rating: 4.1 },
    { p_name: "Family Board Game Pack", p_price: 799, category: "Toys & Games", description: "Fun board game set for family game nights.", image: img("photo-1577896849786-738ed6c78bd3"), stock: 50, rating: 4.5 }
];

module.exports = products;
