let products = [];

let cart = [];

let activeCategory = "All";

let activeSearch = "";

const CART_STORAGE_KEY = "bytecart_cart";


// ==========================
// TOAST NOTIFICATIONS
// (replaces plain alert() popups)
// ==========================

function showToast(message, type = "info") {

    const container =
        document.getElementById("toastContainer");

    if (!container) {
        return;
    }

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}


// ==========================
// CART PERSISTENCE (localStorage)
// ==========================

function saveCartToStorage() {

    try {

        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(cart)
        );

    } catch (error) {

        console.error("Could not save cart:", error);
    }
}


function loadCartFromStorage() {

    try {

        const saved =
            localStorage.getItem(CART_STORAGE_KEY);

        if (saved) {
            cart = JSON.parse(saved);
        }

    } catch (error) {

        console.error("Could not load saved cart:", error);

        cart = [];
    }
}


// ==========================
// LOAD CATEGORIES
// ==========================

async function loadCategories() {

    try {

        const response =
            await fetch("/api/categories");

        const categories =
            await response.json();

        const list =
            document.getElementById(
                "categoryList"
            );

        categories.forEach(category => {

            const button =
                document.createElement("button");

            button.className = "category-chip";
            button.textContent = category;
            button.dataset.category = category;

            button.onclick = () =>
                filterByCategory(category);

            list.appendChild(button);
        });

    } catch (error) {

        console.error(error);
    }
}


// ==========================
// LOAD PRODUCTS
// ==========================

async function loadProducts() {

    try {

        const params = new URLSearchParams();

        if (activeCategory && activeCategory !== "All") {
            params.set("category", activeCategory);
        }

        if (activeSearch) {
            params.set("search", activeSearch);
        }

        const response =
            await fetch(`/api/products?${params.toString()}`);

        products =
            await response.json();

        displayProducts();

    } catch (error) {

        console.error(error);

        document.getElementById(
            "products"
        ).innerHTML =
            "<p class='no-products'>Could not load products.</p>";
    }
}


// ==========================
// DISPLAY PRODUCTS
// ==========================

function displayProducts() {

    const container =
        document.getElementById(
            "products"
        );

    container.innerHTML = "";


    if (products.length === 0) {

        container.innerHTML =
            "<p class='no-products'>No products found.</p>";

        return;
    }


    products.forEach(product => {

        const card = document.createElement("div");

        card.className = "product";

        card.dataset.id = product._id;

        card.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.p_name}"
                loading="lazy"
            >

            <div class="product-content">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>
                    ${product.p_name}
                </h3>

                <p class="product-desc">
                    ${product.description || ""}
                </p>

                <p class="product-price">
                    ₹${product.p_price}
                </p>

                <button class="add-button">
                    Add to Cart
                </button>

            </div>

        `;

        card.querySelector(".add-button")
            .addEventListener("click", (event) => {
                addToCart(product._id, event);
            });

        container.appendChild(card);
    });

    attachTiltEffect();

    observeCardsForReveal();
}


// ==========================
// 3D TILT EFFECT ON HOVER
// ==========================

function attachTiltEffect() {

    document.querySelectorAll(".product").forEach(card => {

        card.addEventListener("mousemove", (event) => {

            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateY = ((x - centerX) / centerX) * 8;
            const rotateX = ((centerY - y) / centerY) * 8;

            card.style.transform =
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener("mouseleave", () => {

            card.style.transform =
                "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
        });
    });
}


// ==========================
// SCROLL-REVEAL ANIMATION
// ==========================

function observeCardsForReveal() {

    const cards = document.querySelectorAll(".product");

    if (!("IntersectionObserver" in window)) {

        // Fallback: just show everything immediately
        cards.forEach(card => card.classList.add("revealed"));

        return;
    }

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("revealed");

                observer.unobserve(entry.target);
            }
        });

    }, { threshold: 0.1 });

    cards.forEach(card => observer.observe(card));
}


// ==========================
// FILTER BY CATEGORY
// ==========================

function filterByCategory(category) {

    activeCategory = category;

    document
        .querySelectorAll(".category-chip")
        .forEach(chip => {

            chip.classList.toggle(
                "active",
                chip.dataset.category === category
            );
        });

    const heading =
        document.getElementById("productsHeading");

    heading.textContent =
        category === "All" ?
            "Our Products" :
            category;

    loadProducts();
}


// ==========================
// SEARCH
// ==========================

function handleSearch() {

    activeSearch =
        document.getElementById(
            "searchInput"
        ).value.trim();

    loadProducts();
}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const searchInput =
            document.getElementById(
                "searchInput"
            );

        if (searchInput) {

            searchInput.addEventListener(
                "keydown",
                (event) => {

                    if (event.key === "Enter") {
                        handleSearch();
                    }
                }
            );
        }


        // Hero parallax - background layers shift slightly with the mouse
        const hero = document.getElementById("hero");

        if (hero) {

            hero.addEventListener("mousemove", (event) => {

                const rect = hero.getBoundingClientRect();

                const x = (event.clientX - rect.left) / rect.width - 0.5;
                const y = (event.clientY - rect.top) / rect.height - 0.5;

                const bg = hero.querySelector(".hero-layer-bg");
                const glow = hero.querySelector(".hero-layer-glow");

                if (bg) {
                    bg.style.transform =
                        `translate(${x * 15}px, ${y * 15}px) scale(1.05)`;
                }

                if (glow) {
                    glow.style.transform =
                        `translate(${x * -25}px, ${y * -25}px)`;
                }
            });

            hero.addEventListener("mouseleave", () => {

                const bg = hero.querySelector(".hero-layer-bg");
                const glow = hero.querySelector(".hero-layer-glow");

                if (bg) bg.style.transform = "translate(0, 0) scale(1)";
                if (glow) glow.style.transform = "translate(0, 0)";
            });
        }
    }
);


// ==========================
// ADD TO CART (with fly-to-cart animation)
// ==========================

function addToCart(id, event) {

    const product =
        products.find(
            p => p._id === id
        );


    if (!product) {
        return;
    }


    // --- fly-to-cart ghost animation ---
    if (event) {

        const sourceImg =
            event.target
                .closest(".product")
                .querySelector("img");

        const cartButton =
            document.getElementById("cartButton");

        if (sourceImg && cartButton) {

            const startRect = sourceImg.getBoundingClientRect();
            const endRect = cartButton.getBoundingClientRect();

            const ghost = sourceImg.cloneNode();

            ghost.className = "fly-to-cart";

            ghost.style.top = startRect.top + "px";
            ghost.style.left = startRect.left + "px";
            ghost.style.width = startRect.width + "px";
            ghost.style.height = startRect.height + "px";
            ghost.style.opacity = "1";

            document.body.appendChild(ghost);

            requestAnimationFrame(() => {

                ghost.style.top = (endRect.top + endRect.height / 2 - 10) + "px";
                ghost.style.left = (endRect.left + endRect.width / 2 - 10) + "px";
                ghost.style.width = "20px";
                ghost.style.height = "20px";
                ghost.style.opacity = "0.3";
            });

            setTimeout(() => {

                ghost.remove();

                cartButton.classList.add("bump");

                setTimeout(() => cartButton.classList.remove("bump"), 350);

            }, 700);
        }
    }


    const existing =
        cart.find(
            item => item._id === id
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });
    }


    updateCart();

    showToast(`${product.p_name} added to cart`, "success");
}


// ==========================
// UPDATE CART
// ==========================

function updateCart() {

    saveCartToStorage();

    const count =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    document.getElementById(
        "cartCount"
    ).textContent = count;


    const cartItems =
        document.getElementById(
            "cartItems"
        );

    const checkoutButton =
        document.getElementById("checkoutButton");


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <p>Your cart is empty.</p>
            </div>
        `;

        document.getElementById(
            "cartTotal"
        ).textContent = "0";

        if (checkoutButton) checkoutButton.disabled = true;

        return;
    }


    if (checkoutButton) checkoutButton.disabled = false;


    let total = 0;


    cart.forEach((product, index) => {

        const itemTotal =
            product.p_price *
            product.quantity;


        total += itemTotal;


        const row = document.createElement("div");

        row.className = "cart-item";

        row.innerHTML = `

            <img src="${product.image}" alt="${product.p_name}">

            <div class="cart-item-info">

                <div class="cart-item-name">
                    ${product.p_name}
                </div>

                <div class="cart-item-price">
                    ₹${product.p_price}
                </div>

            </div>


            <div class="quantity-controls">

                <button data-action="decrease">−</button>

                <span>${product.quantity}</span>

                <button data-action="increase">+</button>

            </div>


            <button class="remove-button" data-action="remove">
                ✕
            </button>

        `;

        row.querySelector('[data-action="decrease"]')
            .addEventListener("click", () => decreaseQuantity(index));

        row.querySelector('[data-action="increase"]')
            .addEventListener("click", () => increaseQuantity(index));

        row.querySelector('[data-action="remove"]')
            .addEventListener("click", () => removeFromCart(index));

        cartItems.appendChild(row);
    });


    document.getElementById(
        "cartTotal"
    ).textContent =
        total.toFixed(2);
}


// ==========================
// INCREASE QUANTITY
// ==========================

function increaseQuantity(index) {

    cart[index].quantity++;

    updateCart();
}


// ==========================
// DECREASE QUANTITY
// ==========================

function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);
    }


    updateCart();
}


// ==========================
// REMOVE FROM CART
// ==========================

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();
}


// ==========================
// SHOW / CLOSE CART DRAWER
// ==========================

function showCart() {

    document.getElementById("cartDrawer").classList.add("open");

    document.getElementById("cartOverlay").classList.add("open");

    updateCart();
}


function closeCart() {

    document.getElementById("cartDrawer").classList.remove("open");

    document.getElementById("cartOverlay").classList.remove("open");
}


// ==========================
// CHECKOUT WITH STRIPE
// ==========================

async function placeOrder() {

    if (cart.length === 0) {

        showToast("Your cart is empty.", "error");

        return;
    }


    const checkoutButton =
        document.getElementById("checkoutButton");

    checkoutButton.disabled = true;

    checkoutButton.textContent = "Redirecting to Stripe...";


    const items =
        cart.map(product => ({
            id: product._id,
            quantity: product.quantity
        }));


    try {

        const response =
            await fetch(
                "/api/create-checkout-session",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        items
                    })
                }
            );


        const result =
            await response.json();


        // Not logged in
        if (response.status === 401) {

            showToast("Please login before checking out.", "error");

            setTimeout(() => {
                window.location.href = "login.html";
            }, 900);

            return;
        }


        if (response.ok && result.url) {

            // Cart will be cleared on success.html once payment is confirmed
            window.location.href = result.url;

        } else {

            showToast(
                result.message ||
                "Could not start checkout.",
                "error"
            );

            checkoutButton.disabled = false;

            checkoutButton.textContent = "Checkout with Stripe";
        }

    } catch (error) {

        console.error(error);

        showToast("Could not connect to server.", "error");

        checkoutButton.disabled = false;

        checkoutButton.textContent = "Checkout with Stripe";
    }
}


// ==========================
// CHECK USER
// ==========================

async function checkUser() {

    try {

        const response =
            await fetch("/api/user");


        const loginButton =
            document.getElementById(
                "loginButton"
            );


        const logoutButton =
            document.getElementById(
                "logoutButton"
            );


        const userName =
            document.getElementById(
                "userName"
            );


        if (response.ok) {

            const user =
                await response.json();


            userName.textContent =
                `Hello, ${user.name}`;


            loginButton.classList.add(
                "hidden"
            );


            logoutButton.classList.remove(
                "hidden"
            );

        } else {

            loginButton.classList.remove(
                "hidden"
            );


            logoutButton.classList.add(
                "hidden"
            );
        }

    } catch (error) {

        console.error(error);
    }
}


// ==========================
// LOGOUT
// ==========================

async function logout() {

    try {

        const response =
            await fetch(
                "/api/logout",
                {
                    method: "POST"
                }
            );


        if (response.ok) {

            showToast("Logged out.", "info");

            setTimeout(() => window.location.reload(), 500);
        }

    } catch (error) {

        console.error(error);

        showToast("Could not logout.", "error");
    }
}


// ==========================
// GO TO LOGIN
// ==========================

function goToLogin() {

    window.location.href =
        "login.html";
}


// ==========================
// SCROLL TO PRODUCTS
// ==========================

function scrollToProducts() {

    document.getElementById(
        "productsSection"
    ).scrollIntoView({
        behavior: "smooth"
    });
}


// ==========================
// START WEBSITE
// ==========================

loadCartFromStorage();

loadCategories();

loadProducts();

checkUser();

updateCart();
