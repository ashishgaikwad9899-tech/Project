// ========================================
// STORAGE
// ========================================

let cart = JSON.parse(
    localStorage.getItem("shopcart-cart")
) || [];

let wishlist = JSON.parse(
    localStorage.getItem("shopcart-wishlist")
) || [];


// ========================================
// SAVE DATA
// ========================================

function saveCart() {

    localStorage.setItem(
        "shopcart-cart",
        JSON.stringify(cart)
    );

}

function saveWishlist() {

    localStorage.setItem(
        "shopcart-wishlist",
        JSON.stringify(wishlist)
    );

}


// ========================================
// HEADER COUNTS
// ========================================

function updateHeaderCounts() {

    const cartCount =
        document.getElementById("cartCount");

    const wishlistCount =
        document.getElementById("wishlistCount");


    if (cartCount) {

        const total = cart.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        cartCount.textContent = total;

    }


    if (wishlistCount) {

        wishlistCount.textContent =
            wishlist.length;

    }

}


// ========================================
// PRODUCT CARD
// ========================================

function productCard(product) {

    const inWishlist =
        wishlist.includes(product.id);

    const discount =
        Math.round(
            ((product.oldPrice - product.price) /
                product.oldPrice) * 100
        );


    return `

        <div class="product-card">

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <span class="discount">
                    ${discount}% OFF
                </span>

                <button
                    class="wishlist-btn ${inWishlist ? "active" : ""}"
                    onclick="toggleWishlist(${product.id})"
                >
                    ${inWishlist ? "❤️" : "♡"}
                </button>

            </div>


            <div class="product-info">

                <p class="product-category">
                    ${product.category}
                </p>

                <h3>
                    ${product.name}
                </h3>

                <div class="rating">

                    ⭐ ${product.rating}

                    <span>
                        (${product.reviews})
                    </span>

                </div>


                <div class="price">

                    <strong>
                        ₹${product.price.toLocaleString("en-IN")}
                    </strong>

                    <del>
                        ₹${product.oldPrice.toLocaleString("en-IN")}
                    </del>

                </div>


                <div class="product-buttons">

                    <button
                        onclick="addToCart(${product.id})"
                        class="add-cart"
                    >
                        Add to Cart
                    </button>

                    <a
                        href="product.html?id=${product.id}"
                        class="view-product"
                    >
                        View
                    </a>

                </div>

            </div>

        </div>

    `;

}


// ========================================
// FEATURED PRODUCTS
// ========================================

function loadFeaturedProducts() {

    const container =
        document.getElementById("featuredProducts");

    if (!container) return;


    container.innerHTML =
        products
            .slice(0, 8)
            .map(productCard)
            .join("");

}


// ========================================
// PRODUCTS PAGE
// ========================================

function loadProducts() {

    const container =
        document.getElementById("productsContainer");

    if (!container) return;


    const params =
        new URLSearchParams(
            window.location.search
        );

    const category =
        params.get("category");


    if (category) {

        const radio =
            document.querySelector(
                `input[name="category"][value="${category}"]`
            );

        if (radio) {

            radio.checked = true;

        }

    }


    applyFilters();

}


// ========================================
// FILTER
// ========================================

function applyFilters() {

    const container =
        document.getElementById("productsContainer");

    if (!container) return;


    let filteredProducts = [...products];


    const category =
        document.querySelector(
            'input[name="category"]:checked'
        )?.value || "All";


    const price =
        document.querySelector(
            'input[name="price"]:checked'
        )?.value || "all";


    if (category !== "All") {

        filteredProducts =
            filteredProducts.filter(
                product =>
                    product.category === category
            );

    }


    if (price !== "all") {

        filteredProducts =
            filteredProducts.filter(
                product =>
                    product.price <= Number(price)
            );

    }


    const search =
        new URLSearchParams(
            window.location.search
        ).get("search");


    if (search) {

        filteredProducts =
            filteredProducts.filter(product =>
                product.name
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )
            );

    }


    const sort =
        document.getElementById("sortProducts")
            ?.value;


    if (sort === "low") {

        filteredProducts.sort(
            (a, b) => a.price - b.price
        );

    }

    if (sort === "high") {

        filteredProducts.sort(
            (a, b) => b.price - a.price
        );

    }

    if (sort === "rating") {

        filteredProducts.sort(
            (a, b) => b.rating - a.rating
        );

    }


    const count =
        document.getElementById("productCount");

    if (count) {

        count.textContent =
            `${filteredProducts.length} Products`;

    }


    if (filteredProducts.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <h2>No products found</h2>
                <p>Try another category or search.</p>
            </div>
        `;

        return;

    }


    container.innerHTML =
        filteredProducts
            .map(productCard)
            .join("");

}


// ========================================
// SEARCH
// ========================================

function searchProducts() {

    const input =
        document.getElementById("headerSearch");

    if (!input) return;


    const search =
        input.value.trim();


    if (!search) {

        window.location.href =
            "products.html";

        return;

    }


    window.location.href =
        `products.html?search=${encodeURIComponent(search)}`;

}


// ========================================
// ADD TO CART
// ========================================

function addToCart(id) {

    const product =
        products.find(
            product => product.id === id
        );

    if (!product) return;


    const existing =
        cart.find(
            item => item.id === id
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            id: id,
            quantity: 1
        });

    }


    saveCart();

    updateHeaderCounts();


    alert(
        `${product.name} added to cart!`
    );

}


// ========================================
// REMOVE FROM CART
// ========================================

function removeFromCart(id) {

    cart =
        cart.filter(
            item => item.id !== id
        );

    saveCart();

    loadCart();

    updateHeaderCounts();

}


// ========================================
// CHANGE QUANTITY
// ========================================

function changeQuantity(id, change) {

    const item =
        cart.find(
            item => item.id === id
        );

    if (!item) return;


    item.quantity += change;


    if (item.quantity <= 0) {

        removeFromCart(id);

        return;

    }


    saveCart();

    loadCart();

    updateHeaderCounts();

}


// ========================================
// CART
// ========================================

function loadCart() {

    const container =
        document.getElementById("cartItems");

    if (!container) return;


    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <div class="empty-icon">
                    🛒
                </div>

                <h2>Your cart is empty</h2>

                <p>
                    Looks like you haven't added
                    anything yet.
                </p>

                <a
                    href="products.html"
                    class="btn"
                >
                    Start Shopping
                </a>

            </div>

        `;

        updateCartSummary();

        return;

    }


    container.innerHTML =
        cart.map(item => {

            const product =
                products.find(
                    p => p.id === item.id
                );

            if (!product) return "";


            return `

                <div class="cart-item">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >


                    <div class="cart-item-info">

                        <p>
                            ${product.category}
                        </p>

                        <h3>
                            ${product.name}
                        </h3>

                        <strong>
                            ₹${product.price.toLocaleString("en-IN")}
                        </strong>


                        <div class="quantity">

                            <button
                                onclick="changeQuantity(${product.id}, -1)"
                            >
                                −
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                onclick="changeQuantity(${product.id}, 1)"
                            >
                                +
                            </button>

                        </div>

                    </div>


                    <button
                        class="remove-btn"
                        onclick="removeFromCart(${product.id})"
                    >
                        Remove
                    </button>

                </div>

            `;

        }).join("");


    updateCartSummary();

}


// ========================================
// CART SUMMARY
// ========================================

function updateCartSummary() {

    let subtotal = 0;


    cart.forEach(item => {

        const product =
            products.find(
                p => p.id === item.id
            );

        if (product) {

            subtotal +=
                product.price * item.quantity;

        }

    });


    const delivery =
        subtotal === 0
            ? 0
            : subtotal >= 999
                ? 0
                : 99;


    const total =
        subtotal + delivery;


    const subtotalElement =
        document.getElementById(
            "cartSubtotal"
        );

    const deliveryElement =
        document.getElementById(
            "delivery"
        );

    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    if (subtotalElement) {

        subtotalElement.textContent =
            `₹${subtotal.toLocaleString("en-IN")}`;

    }


    if (deliveryElement) {

        deliveryElement.textContent =
            delivery === 0
                ? "FREE"
                : `₹${delivery}`;

    }


    if (totalElement) {

        totalElement.textContent =
            `₹${total.toLocaleString("en-IN")}`;

    }

}


// ========================================
// WISHLIST
// ========================================

function toggleWishlist(id) {

    if (wishlist.includes(id)) {

        wishlist =
            wishlist.filter(
                item => item !== id
            );

    } else {

        wishlist.push(id);

    }


    saveWishlist();

    updateHeaderCounts();

    loadFeaturedProducts();

    loadProducts();

    loadWishlist();

}


// ========================================
// WISHLIST PAGE
// ========================================

function loadWishlist() {

    const container =
        document.getElementById(
            "wishlistContainer"
        );

    if (!container) return;


    const wishlistProducts =
        products.filter(
            product =>
                wishlist.includes(product.id)
        );


    if (wishlistProducts.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ❤️
                </div>

                <h2>Your wishlist is empty</h2>

                <p>
                    Save products you love here.
                </p>

                <a
                    href="products.html"
                    class="btn"
                >
                    Explore Products
                </a>

            </div>

        `;

        return;

    }


    container.innerHTML =
        wishlistProducts
            .map(productCard)
            .join("");

}


// ========================================
// PRODUCT DETAILS
// ========================================

function loadProductDetails() {

    const container =
        document.getElementById(
            "productDetails"
        );

    if (!container) return;


    const params =
        new URLSearchParams(
            window.location.search
        );


    const id =
        Number(params.get("id"));


    const product =
        products.find(
            p => p.id === id
        );


    if (!product) {

        container.innerHTML = `
            <div class="empty-state">
                <h2>Product not found</h2>
            </div>
        `;

        return;

    }


    container.innerHTML = `

        <div class="product-detail-image">

            <img
                src="${product.image}"
                alt="${product.name}"
            >

        </div>


        <div class="product-detail-info">

            <p class="product-category">
                ${product.category}
            </p>

            <h1>
                ${product.name}
            </h1>

            <div class="detail-rating">

                ⭐ ${product.rating}

                <span>
                    ${product.reviews} Reviews
                </span>

            </div>


            <div class="detail-price">

                <strong>
                    ₹${product.price.toLocaleString("en-IN")}
                </strong>

                <del>
                    ₹${product.oldPrice.toLocaleString("en-IN")}
                </del>

            </div>


            <p class="description">

                ${product.description}

            </p>


            <div class="size-selector">

                <h3>Select Size</h3>

                <div>

                    <button>S</button>
                    <button>M</button>
                    <button>L</button>
                    <button>XL</button>
                    <button>XXL</button>

                </div>

            </div>


            <div class="detail-actions">

                <button
                    class="btn"
                    onclick="addToCart(${product.id})"
                >
                    Add to Cart
                </button>

                <button
                    class="wishlist-detail"
                    onclick="toggleWishlist(${product.id})"
                >
                    ❤️ Wishlist
                </button>

            </div>


            <div class="product-benefits">

                <p>🚚 Free delivery above ₹999</p>

                <p>↩️ 7-day easy returns</p>

                <p>🔒 Secure payment</p>

            </div>

        </div>

    `;


    loadRelatedProducts(product);

}


// ========================================
// RELATED PRODUCTS
// ========================================

function loadRelatedProducts(product) {

    const container =
        document.getElementById(
            "relatedProducts"
        );

    if (!container) return;


    const related =
        products
            .filter(
                p =>
                    p.category === product.category &&
                    p.id !== product.id
            )
            .slice(0, 4);


    container.innerHTML =
        related
            .map(productCard)
            .join("");

}


// ========================================
// CHECKOUT
// ========================================

function loadCheckout() {

    const container =
        document.getElementById(
            "checkoutItems"
        );

    if (!container) return;


    let total = 0;


    container.innerHTML =
        cart.map(item => {

            const product =
                products.find(
                    p => p.id === item.id
                );

            if (!product) return "";


            const itemTotal =
                product.price *
                item.quantity;


            total += itemTotal;


            return `

                <div class="checkout-item">

                    <span>
                        ${product.name}
                        × ${item.quantity}
                    </span>

                    <strong>
                        ₹${itemTotal.toLocaleString("en-IN")}
                    </strong>

                </div>

            `;

        }).join("");


    const delivery =
        total >= 999 || total === 0
            ? 0
            : 99;


    total += delivery;


    const totalElement =
        document.getElementById(
            "checkoutTotal"
        );


    if (totalElement) {

        totalElement.textContent =
            `₹${total.toLocaleString("en-IN")}`;

    }

}


// ========================================
// PLACE ORDER
// ========================================

function placeOrder(event) {

    event.preventDefault();


    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    const order = {

        id:
            "SC" +
            Date.now()
                .toString()
                .slice(-6),

        items: cart,

        date:
            new Date().toLocaleDateString(),

        status:
            "Order Placed"

    };


    const orders =
        JSON.parse(
            localStorage.getItem(
                "shopcart-orders"
            )
        ) || [];


    orders.push(order);


    localStorage.setItem(
        "shopcart-orders",
        JSON.stringify(orders)
    );


    cart = [];

    saveCart();


    alert(
        `Order placed successfully! Order ID: ${order.id}`
    );


    window.location.href =
        "index.html";

}


// ========================================
// LOGIN
// ========================================

function loginUser(event) {

    event.preventDefault();


    localStorage.setItem(
        "shopcart-logged-in",
        "true"
    );


    alert(
        "Login successful!"
    );


    window.location.href =
        "index.html";

}


// ========================================
// MOBILE MENU
// ========================================

function toggleMenu() {

    const navbar =
        document.querySelector(
            ".navbar"
        );


    navbar.classList.toggle(
        "active"
    );

}


// ========================================
// INITIALIZE
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateHeaderCounts();

        loadFeaturedProducts();

        loadProducts();

        loadProductDetails();

        loadCart();

        loadWishlist();

        loadCheckout();

    }
);