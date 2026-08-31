/* =========================================================
   AL WAFA TECH
   Premium E-Commerce Store
   Vanilla JavaScript
========================================================= */

"use strict";

/* =========================================================
   CONFIG
========================================================= */
/* =========================================================
   CONFIG
========================================================= */

const CONFIG = {
    storeName: "AL WAFA TECH",
    version: "v2", // قم بزيادة رقم الإصدار (مثل v3, v4) كلما أردت فرض تحديث المنتجات تلقائياً

    whatsappNumber: "201501374600",

    currency: "ج.م",

    storage: {
        version: "alwafa_app_version",
        products: "alwafa_products",
        cart: "alwafa_cart",
        orders: "alwafa_orders"
    }
};

/* =========================================================
   DEMO PRODUCTS
========================================================= */

const defaultProducts = [
    {
        id: 1,
        name: "Samsung Galaxy S25",
        category: "Mobiles",
        price: 38999,
        oldPrice: 41999,
        image: "assets/samsung-s25.jpg",
        badge: "NEW",
        stock: 8,
        description: "هاتف سامسونج الرائد بتجربة شاشة ممتازة وأداء قوي وكاميرات متطورة.",
        specifications: [
            "شاشة Dynamic AMOLED",
            "RAM 12GB",
            "Storage 256GB",
            "كاميرات متعددة",
            "بطارية قوية"
        ]
    },
    {
        id: 2,
        name: "4K PTZ Security Camera",
        category: "Cameras",
        price: 5499,
        oldPrice: 5999,
        image: "assets/ptz-camera.jpg",
        badge: "BEST",
        stock: 15,
        description: "كاميرا مراقبة PTZ بدقة 4K مناسبة للمنازل والمحال والشركات.",
        specifications: [
            "دقة 4K",
            "تحكم PTZ",
            "رؤية ليلية",
            "اتصال عبر الشبكة",
            "تسجيل مستمر"
        ]
    },
    {
        id: 3,
        name: "Lenovo LOQ Gaming Laptop",
        category: "Laptops",
        price: 34999,
        oldPrice: 38999,
        image: "assets/laptop.jpg",
        badge: "HOT",
        stock: 5,
        description: "لابتوب ألعاب قوي ومناسب لبرمجة وتطوير البرمجيات والأداء العالي.",
        specifications: [
            "معالج قوي جداً",
            "كارت شاشة منفصل",
            "RAM 16GB",
            "Storage 512GB SSD",
            "شاشة عالية التردد"
        ]
    },
    {
        id: 4,
        name: "Pro Gaming PC Rig",
        category: "PC Builds",
        price: 29999,
        oldPrice: 32999,
        image: "assets/pc-build.jpg",
        badge: "SALE",
        stock: 4,
        description: "تجميعة بي سي احترافية مخصصة للألعاب الثقيلة وبرامج المونتاج.",
        specifications: [
            "تجميعة احترافية",
            "تبريد هواء عالي الكفاءة",
            "هيكل أنيق بإضاءة RGB",
            "أداء فائق وثابت",
            "جاهز للترقية"
        ]
    },
    {
        id: 5,
        name: "27 Inch Curved Gaming Monitor",
        category: "Monitors",
        price: 8499,
        oldPrice: 9499,
        image: "assets/monitor.jpg",
        badge: "NEW",
        stock: 10,
        description: "شاشة ألعاب منحنية توفر تجربة رؤية غامرة ومعدل تحديث سريع.",
        specifications: [
            "حجم 27 بوصة منحنية",
            "معدل تحديث 165Hz",
            "دقة Full HD",
            "وقت استجابة سريع",
            "مداخل متعددة HDMI / DP"
        ]
    }

   
];

/* =========================================================
   STATE
========================================================= */

let products = [];
let cart = [];
let orders = [];

let currentFilter = "All";
let searchTerm = "";

let currentProductId = null;
let editingProductId = null;

/* =========================================================
   DOM ELEMENTS
========================================================= */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeStorage();

    loadData();

    initializeUI();

    renderProducts();

    renderCart();

    renderAdmin();

    setupWhatsApp();

    handleAdminHash();

    setTimeout(() => {
        const loader = $("#pageLoader");

        if (loader) {
            loader.classList.add("hidden");
        }
    }, 700);
});


/* =========================================================
   STORAGE (Smart Update & Admin Safe)
========================================================= */
/* =========================================================
   STORAGE (Smart Update & Admin Safe)
========================================================= */

function initializeStorage() {
    const currentVersion = CONFIG.version;
    const storedVersion = localStorage.getItem(CONFIG.storage.version);

    let storedProducts = JSON.parse(localStorage.getItem(CONFIG.storage.products));

    // لو دي أول مرة يفتح الموقع أو مفيش منتجات خالص
    if (!storedProducts) {
        localStorage.setItem(CONFIG.storage.products, JSON.stringify(defaultProducts));
        localStorage.setItem(CONFIG.storage.version, currentVersion);
    } 
    // لو الإصدار اتغير (يعني أنت ضفت منتجات جديدة في الكود وعاوز تنزلها للزوار والأدمن)
    else if (storedVersion !== currentVersion) {
        defaultProducts.forEach(newProduct => {
            const exists = storedProducts.some(p => p.id === newProduct.id);
            if (!exists) {
                storedProducts.push(newProduct);
            }
        });

        localStorage.setItem(CONFIG.storage.products, JSON.stringify(storedProducts));
        localStorage.setItem(CONFIG.storage.version, currentVersion);
    }

    // التأكد من وجود سلة المشتريات والطلبات بطريقة سليمة
    if (!localStorage.getItem(CONFIG.storage.cart)) {
        localStorage.setItem(CONFIG.storage.cart, JSON.stringify([]));
    }

    if (!localStorage.getItem(CONFIG.storage.orders)) {
        localStorage.setItem(CONFIG.storage.orders, JSON.stringify([]));
    }
}


function loadData() {

    try {

        products =
            JSON.parse(
                localStorage.getItem(CONFIG.storage.products)
            ) || [];

        cart =
            JSON.parse(
                localStorage.getItem(CONFIG.storage.cart)
            ) || [];

        orders =
            JSON.parse(
                localStorage.getItem(CONFIG.storage.orders)
            ) || [];

    } catch (error) {

        console.error(
            "Storage loading error:",
            error
        );

        products = [...defaultProducts];

        cart = [];

        orders = [];

    }

}


/* =========================================================
   SAVE DATA
========================================================= */

function saveProducts() {

    localStorage.setItem(
        CONFIG.storage.products,
        JSON.stringify(products)
    );

}


function saveCart() {

    localStorage.setItem(
        CONFIG.storage.cart,
        JSON.stringify(cart)
    );

}


function saveOrders() {

    localStorage.setItem(
        CONFIG.storage.orders,
        JSON.stringify(orders)
    );

}


/* =========================================================
   UI INITIALIZATION
========================================================= */

function initializeUI() {

    setupNavigation();

    setupSearch();

    setupFilters();

    setupCategories();

    setupCart();

    setupModals();

    setupCheckout();

    setupAdmin();

    setupScrollHeader();

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    const mobileMenuBtn =
        $("#mobileMenuBtn");

    const mobileNav =
        $("#mobileNav");


    if (mobileMenuBtn && mobileNav) {

        mobileMenuBtn.addEventListener(
            "click",
            () => {

                mobileNav.classList.toggle("active");

                const icon =
                    mobileMenuBtn.querySelector("i");

                if (
                    mobileNav.classList.contains("active")
                ) {

                    icon.className =
                        "fa-solid fa-xmark";

                } else {

                    icon.className =
                        "fa-solid fa-bars";

                }

            }
        );


        $$("#mobileNav a").forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    mobileNav.classList.remove("active");

                    const icon =
                        mobileMenuBtn.querySelector("i");

                    icon.className =
                        "fa-solid fa-bars";

                }
            );

        });

    }


    $$(".nav-link").forEach(link => {

        link.addEventListener(
            "click",
            () => {

                $$(".nav-link").forEach(item => {
                    item.classList.remove("active");
                });

                link.classList.add("active");

            }
        );

    });

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    const searchBtn =
        $("#searchBtn");

    const searchOverlay =
        $("#searchOverlay");

    const closeSearch =
        $("#closeSearch");

    const searchInput =
        $("#searchInput");


    if (searchBtn) {

        searchBtn.addEventListener(
            "click",
            () => {

                searchOverlay.classList.add("active");

                setTimeout(() => {

                    searchInput?.focus();

                }, 200);

            }
        );

    }


    if (closeSearch) {

        closeSearch.addEventListener(
            "click",
            closeSearchOverlay
        );

    }


    if (searchOverlay) {

        searchOverlay.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === searchOverlay
                ) {

                    closeSearchOverlay();

                }

            }
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                searchTerm =
                    searchInput.value
                        .trim()
                        .toLowerCase();

                renderSearchResults();

            }
        );

    }


    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                closeSearchOverlay();

                closeAllModals();

            }

        }
    );

}


function closeSearchOverlay() {

    const searchOverlay =
        $("#searchOverlay");

    const searchInput =
        $("#searchInput");


    if (searchOverlay) {

        searchOverlay.classList.remove("active");

    }


    if (searchInput) {

        searchInput.value = "";

    }

    searchTerm = "";

}


function renderSearchResults() {

    const container =
        $("#searchResults");

    if (!container) return;


    if (!searchTerm) {

        container.innerHTML = `
            <div class="search-empty">
                <i class="fa-solid fa-magnifying-glass"></i>
                <p>اكتب اسم المنتج اللي بتدور عليه</p>
            </div>
        `;

        return;

    }


    const results =
        products.filter(product => {

            const text = `
                ${product.name}
                ${product.category}
                ${product.description}
            `.toLowerCase();

            return text.includes(searchTerm);

        });


    if (!results.length) {

        container.innerHTML = `
            <div class="search-empty">
                <i class="fa-solid fa-box-open"></i>
                <p>مفيش منتجات لقيناها</p>
            </div>
        `;

        return;

    }


    container.innerHTML =
        results.map(product => `

            <button
                class="search-result-item"
                data-product-id="${product.id}"
            >

                <div class="search-result-image">
                    ${getProductVisual(product)}
                </div>

                <div class="search-result-info">

                    <strong>
                        ${escapeHTML(product.name)}
                    </strong>

                    <span>
                        ${formatPrice(product.price)}
                    </span>

                </div>

            </button>

        `).join("");


    $$(".search-result-item").forEach(item => {

        item.addEventListener(
            "click",
            () => {

                const id =
                    Number(item.dataset.productId);

                closeSearchOverlay();

                openProductDetails(id);

            }
        );

    });

}


/* =========================================================
   FILTERS
========================================================= */

function setupFilters() {

    $$(".filter-btn").forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const filter =
                    button.dataset.filter;

                currentFilter = filter;

                $$(".filter-btn").forEach(btn => {

                    btn.classList.remove("active");

                });

                button.classList.add("active");

                renderProducts();

                scrollToShop();

            }
        );

    });


    const viewAll =
        $("#viewAllProducts");

    if (viewAll) {

        viewAll.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                currentFilter = "All";

                $$(".filter-btn").forEach(btn => {

                    btn.classList.toggle(
                        "active",
                        btn.dataset.filter === "All"
                    );

                });

                renderProducts();

            }
        );

    }

}


/* =========================================================
   CATEGORIES
========================================================= */

function setupCategories() {

    $$(".category-card").forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const category =
                    card.dataset.category;

                currentFilter = category;

                $$(".filter-btn").forEach(btn => {

                    btn.classList.toggle(
                        "active",
                        btn.dataset.filter === category
                    );

                });

                renderProducts();

                scrollToShop();

            }
        );

    });


    $$("[data-category-action]").forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const category =
                    button.dataset.categoryAction;

                currentFilter = category;

                $$(".filter-btn").forEach(btn => {

                    btn.classList.toggle(
                        "active",
                        btn.dataset.filter === category
                    );

                });

                renderProducts();

                scrollToShop();

            }
        );

    });

}


function scrollToShop() {

    const shop =
        $("#shop");

    if (shop) {

        shop.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================================================
   PRODUCT RENDERING
========================================================= */

function getFilteredProducts() {

    return products.filter(product => {

        const categoryMatch =
            currentFilter === "All" ||
            product.category === currentFilter;


        const searchMatch =
            !searchTerm ||
            `
                ${product.name}
                ${product.category}
                ${product.description}
            `
                .toLowerCase()
                .includes(searchTerm);


        return categoryMatch && searchMatch;

    });

}


function renderProducts() {

    const grid =
        $("#productsGrid");

    const empty =
        $("#productsEmpty");


    if (!grid) return;


    const filteredProducts =
        getFilteredProducts();


    if (!filteredProducts.length) {

        grid.innerHTML = "";

        if (empty) {
            empty.hidden = false;
        }

        return;

    }


    if (empty) {
        empty.hidden = true;
    }


    grid.innerHTML =
        filteredProducts
            .map(product => createProductCard(product))
            .join("");


    attachProductEvents();

}


function createProductCard(product) {

    const hasDiscount =
        product.oldPrice &&
        product.oldPrice > product.price;


    return `

        <article
            class="product-card"
            data-product-id="${product.id}"
        >

            <div class="product-image">

                ${
                    product.badge
                    ?
                    `
                        <span class="product-badge">
                            ${escapeHTML(product.badge)}
                        </span>
                    `
                    :
                    ""
                }

                <button
                    class="product-quick-view"
                    data-action="details"
                    aria-label="عرض التفاصيل"
                >
                    <i class="fa-solid fa-eye"></i>
                </button>


                ${getProductVisual(product)}

            </div>


            <div class="product-info">

                <span class="product-category">
                    ${getArabicCategory(product.category)}
                </span>

                <h3>
                    ${escapeHTML(product.name)}
                </h3>

                <p>
                    ${escapeHTML(
                        truncate(product.description, 75)
                    )}
                </p>


                <div class="product-bottom">

                    <div class="product-price">

                        <strong>
                            ${formatPrice(product.price)}
                        </strong>

                        ${
                            hasDiscount
                            ?
                            `
                                <del>
                                    ${formatPrice(product.oldPrice)}
                                </del>
                            `
                            :
                            ""
                        }

                    </div>


                    <button
                        class="add-cart-btn"
                        data-action="add"
                        aria-label="إضافة للسلة"
                    >
                        <i class="fa-solid fa-plus"></i>
                    </button>

                </div>


                <button
                    class="product-details-btn"
                    data-action="details"
                >
                    عرض التفاصيل
                    <i class="fa-solid fa-arrow-left"></i>
                </button>

            </div>

        </article>

    `;

}


function attachProductEvents() {

    $$(".product-card").forEach(card => {

        const productId =
            Number(card.dataset.productId);


        card.querySelectorAll(
            '[data-action="add"]'
        ).forEach(button => {

            button.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();

                    addToCart(productId);

                }
            );

        });


        card.querySelectorAll(
            '[data-action="details"]'
        ).forEach(button => {

            button.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();

                    openProductDetails(productId);

                }
            );

        });

    });

}


/* =========================================================
   PRODUCT DETAILS
========================================================= */

function openProductDetails(productId) {

    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) return;


    currentProductId =
        productId;


    const modal =
        $("#productModal");

    const details =
        $("#productDetails");


    if (!modal || !details) return;


    const stockText =
        product.stock > 0
            ? `متوفر (${product.stock} قطعة)`
            : "غير متوفر";


    details.innerHTML = `

        <div class="product-details-image">

            ${
                product.badge
                ?
                `
                    <span class="product-badge">
                        ${escapeHTML(product.badge)}
                    </span>
                `
                :
                ""
            }

            ${getProductVisual(product)}

        </div>


        <div class="product-details-content">

            <span class="product-category">
                ${getArabicCategory(product.category)}
            </span>

            <h2>
                ${escapeHTML(product.name)}
            </h2>

            <p class="product-details-description">
                ${escapeHTML(product.description)}
            </p>


            <div class="details-price">

                <strong>
                    ${formatPrice(product.price)}
                </strong>

                ${
                    product.oldPrice
                    ?
                    `
                        <del>
                            ${formatPrice(product.oldPrice)}
                        </del>
                    `
                    :
                    ""
                }

            </div>


            <div class="stock-status">
                <i class="fa-solid fa-circle"></i>
                ${stockText}
            </div>


            <div class="specifications">

                <h3>
                    المواصفات
                </h3>

                <ul>

                    ${
                        product.specifications
                            ?.map(spec => `
                                <li>
                                    <i class="fa-solid fa-check"></i>
                                    ${escapeHTML(spec)}
                                </li>
                            `)
                            .join("")
                        ||
                        `
                            <li>
                                <i class="fa-solid fa-check"></i>
                                مواصفات المنتج متاحة عند الطلب
                            </li>
                        `
                    }

                </ul>

            </div>


            <div class="details-actions">

                <div class="quantity-selector">

                    <button
                        id="detailsDecrease"
                        type="button"
                    >
                        <i class="fa-solid fa-minus"></i>
                    </button>

                    <span id="detailsQuantity">
                        1
                    </span>

                    <button
                        id="detailsIncrease"
                        type="button"
                    >
                        <i class="fa-solid fa-plus"></i>
                    </button>

                </div>


                <button
                    class="btn btn-primary"
                    id="detailsAddCart"
                    ${product.stock <= 0 ? "disabled" : ""}
                >
                    ${
                        product.stock > 0
                        ? "أضف للسلة"
                        : "غير متوفر"
                    }

                    <i class="fa-solid fa-bag-shopping"></i>

                </button>

            </div>

        </div>

    `;


    let quantity = 1;


    const quantityElement =
        $("#detailsQuantity");


    const decrease =
        $("#detailsDecrease");


    const increase =
        $("#detailsIncrease");


    const addButton =
        $("#detailsAddCart");


    decrease?.addEventListener(
        "click",
        () => {

            if (quantity > 1) {

                quantity--;

                quantityElement.textContent =
                    quantity;

            }

        }
    );


    increase?.addEventListener(
        "click",
        () => {

            if (
                quantity <
                product.stock
            ) {

                quantity++;

                quantityElement.textContent =
                    quantity;

            }

        }
    );


    addButton?.addEventListener(
        "click",
        () => {

            addToCart(
                productId,
                quantity
            );

            closeModal("#productModal");

        }
    );


    modal.classList.add("active");

    document.body.classList.add("modal-open");

}


/* =========================================================
   CART
========================================================= */

function setupCart() {

    const cartBtn =
        $("#cartBtn");

    const closeCart =
        $("#closeCart");

    const overlay =
        $("#drawerOverlay");

    const continueShopping =
        $("#continueShopping");

    const checkoutBtn =
        $("#checkoutBtn");


    cartBtn?.addEventListener(
        "click",
        openCart
    );


    closeCart?.addEventListener(
        "click",
        closeCartDrawer
    );


    overlay?.addEventListener(
        "click",
        closeCartDrawer
    );


    continueShopping?.addEventListener(
        "click",
        closeCartDrawer
    );


    checkoutBtn?.addEventListener(
        "click",
        openCheckout
    );

}


function openCart() {

    const drawer =
        $("#cartDrawer");

    const overlay =
        $("#drawerOverlay");


    drawer?.classList.add("active");

    overlay?.classList.add("active");

    document.body.classList.add("drawer-open");

}


function closeCartDrawer() {

    const drawer =
        $("#cartDrawer");

    const overlay =
        $("#drawerOverlay");


    drawer?.classList.remove("active");

    overlay?.classList.remove("active");

    document.body.classList.remove("drawer-open");

}

function addToCart(productId, quantity = 1) {
    productId = Number(productId);

    const product = products.find(
        item => Number(item.id) === productId
    );

    if (!product) {
        console.error("Product not found:", productId);
        return;
    }

    if (product.stock <= 0) {
        showToast(
            "المنتج غير متوفر حاليًا",
            "error"
        );
        return;
    }

    const existing = cart.find(
        item => Number(item.productId) === productId
    );

    if (existing) {
        const newQuantity =
            Number(existing.quantity) + Number(quantity);

        if (newQuantity > product.stock) {
            existing.quantity = product.stock;

            showToast(
                "وصلت لأقصى كمية متاحة",
                "warning"
            );
        } else {
            existing.quantity = newQuantity;

            showToast(
                "تم تحديث الكمية",
                "success"
            );
        }
    } else {
        cart.push({
            productId: productId,
            quantity: Number(quantity)
        });

        showToast(
            "تمت إضافة المنتج للسلة",
            "success"
        );
    }

    saveCart();
    renderCart();
    updateCartCount();
}

function removeFromCart(productId) {

    cart =
        cart.filter(
            item => item.productId !== productId
        );


    saveCart();

    renderCart();

    updateCartCount();

    showToast(
        "تم حذف المنتج من السلة",
        "success"
    );

}


function updateCartQuantity(productId, change) {

    const cartItem =
        cart.find(
            item => item.productId === productId
        );


    const product =
        products.find(
            item => item.id === productId
        );


    if (!cartItem || !product) return;


    const newQuantity =
        cartItem.quantity + change;


    if (newQuantity <= 0) {

        removeFromCart(productId);

        return;

    }


    if (
        newQuantity >
        product.stock
    ) {

        showToast(
            "الكمية المطلوبة أكبر من المخزون",
            "warning"
        );

        return;

    }


    cartItem.quantity =
        newQuantity;


    saveCart();

    renderCart();

    updateCartCount();

}


function renderCart() {

    const container =
        $("#cartItems");

    const empty =
        $("#cartEmpty");

    const footer =
        $("#cartFooter");


    if (!container) return;


    if (!cart.length) {

        container.innerHTML = "";

        empty?.classList.add("active");

        footer?.classList.remove("active");

        updateCartCount();

        return;

    }


    empty?.classList.remove("active");

    footer?.classList.add("active");


    container.innerHTML =
        cart
            .map(item => {

              const product = products.find(
    p => Number(p.id) === Number(item.productId)
);


                if (!product) return "";


                const itemTotal =
                    product.price *
                    item.quantity;


                return `

                    <div
                        class="cart-item"
                        data-cart-id="${product.id}"
                    >

                        <div class="cart-item-image">

                            ${getProductVisual(product)}

                        </div>


                        <div class="cart-item-info">

                            <span>
                                ${getArabicCategory(product.category)}
                            </span>

                            <h3>
                                ${escapeHTML(product.name)}
                            </h3>

                            <strong>
                                ${formatPrice(itemTotal)}
                            </strong>


                            <div class="cart-item-actions">

                                <div class="quantity-selector">

                                    <button
                                        data-cart-action="decrease"
                                    >
                                        <i class="fa-solid fa-minus"></i>
                                    </button>

                                    <span>
                                        ${item.quantity}
                                    </span>

                                    <button
                                        data-cart-action="increase"
                                    >
                                        <i class="fa-solid fa-plus"></i>
                                    </button>

                                </div>


                                <button
                                    class="remove-cart-item"
                                    data-cart-action="remove"
                                >
                                    <i class="fa-solid fa-trash"></i>
                                </button>

                            </div>

                        </div>

                    </div>

                `;

            })
            .join("");


    container
        .querySelectorAll(".cart-item")
        .forEach(itemElement => {

            const productId =
                Number(
                    itemElement.dataset.cartId
                );


            itemElement
                .querySelector(
                    '[data-cart-action="decrease"]'
                )
                ?.addEventListener(
                    "click",
                    () => {

                        updateCartQuantity(
                            productId,
                            -1
                        );

                    }
                );


            itemElement
                .querySelector(
                    '[data-cart-action="increase"]'
                )
                ?.addEventListener(
                    "click",
                    () => {

                        updateCartQuantity(
                            productId,
                            1
                        );

                    }
                );


            itemElement
                .querySelector(
                    '[data-cart-action="remove"]'
                )
                ?.addEventListener(
                    "click",
                    () => {

                        removeFromCart(
                            productId
                        );

                    }
                );

        });


    updateCartTotal();

    updateCartCount();

}


function updateCartTotal() {

    const totalElement =
        $("#cartTotal");


    const total =
        calculateCartTotal();


    if (totalElement) {

        totalElement.textContent =
            formatPrice(total);

    }

}


function updateCartCount() {

    const count =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    const cartCount =
        $("#cartCount");


    if (cartCount) {

        cartCount.textContent =
            count;

    }

}


function calculateCartTotal() {

    return cart.reduce(
        (total, item) => {

           const product = products.find(
    p => Number(p.id) === Number(item.productId)
);


            if (!product) {
                return total;
            }


            return total +
                product.price *
                item.quantity;

        },
        0
    );

}


/* =========================================================
   MODALS
========================================================= */

function setupModals() {

    $("#closeProductModal")
        ?.addEventListener(
            "click",
            () => closeModal("#productModal")
        );


    $("#closeCheckoutModal")
        ?.addEventListener(
            "click",
            () => closeModal("#checkoutModal")
        );


    $("#closeSuccess")
        ?.addEventListener(
            "click",
            () => closeModal("#successModal")
        );


    $("#closeProductAdminModal")
        ?.addEventListener(
            "click",
            () => closeModal("#productAdminModal")
        );


    $$(".modal-overlay").forEach(overlay => {

        overlay.addEventListener(
            "click",
            event => {

                if (
                    event.target === overlay
                ) {

                    overlay.classList.remove(
                        "active"
                    );

                    document.body.classList.remove(
                        "modal-open"
                    );

                }

            }
        );

    });

}


function closeModal(selector) {

    const modal =
        $(selector);

    modal?.classList.remove("active");

    document.body.classList.remove("modal-open");

}


function closeAllModals() {

    $$(".modal-overlay").forEach(modal => {

        modal.classList.remove("active");

    });

    document.body.classList.remove("modal-open");

}


/* =========================================================
   CHECKOUT
========================================================= */

function setupCheckout() {

    const form =
        $("#checkoutForm");


    form?.addEventListener(
        "submit",
        handleCheckoutSubmit
    );

}


function openCheckout() {

    if (!cart.length) {

        showToast(
            "السلة فاضية",
            "warning"
        );

        return;

    }


    closeCartDrawer();


    renderCheckoutSummary();


    const modal =
        $("#checkoutModal");


    modal?.classList.add("active");

    document.body.classList.add("modal-open");

}


function renderCheckoutSummary() {

    const container =
        $("#checkoutItems");

    const totalElement =
        $("#checkoutTotal");

    const countElement =
        $("#checkoutItemsCount");


    if (!container) return;


    container.innerHTML =
        cart
            .map(item => {

                const product =
                    products.find(
                        p => p.id === item.productId
                    );


                if (!product) return "";


                return `

                    <div class="checkout-item">

                        <div class="checkout-item-image">

                            ${getProductVisual(product)}

                        </div>

                        <div class="checkout-item-info">

                            <strong>
                                ${escapeHTML(product.name)}
                            </strong>

                            <span>
                                ${item.quantity} ×
                                ${formatPrice(product.price)}
                            </span>

                        </div>

                    </div>

                `;

            })
            .join("");


    const count =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    if (countElement) {

        countElement.textContent =
            `${count} منتجات`;

    }


    if (totalElement) {

        totalElement.textContent =
            formatPrice(
                calculateCartTotal()
            );

    }

}


function handleCheckoutSubmit(event) {

    event.preventDefault();


    clearFormErrors();


    if (!cart.length) {

        showToast(
            "السلة فاضية",
            "warning"
        );

        return;

    }


    const name =
        $("#customerName")?.value.trim();

    const phone =
        $("#customerPhone")?.value.trim();

    const address =
        $("#customerAddress")?.value.trim();

    const notes =
        $("#customerNotes")?.value.trim();


    let valid = true;


    if (!name || name.length < 3) {

        showFieldError(
            "customerName",
            "اكتب الاسم بالكامل"
        );

        valid = false;

    }


    if (!validateEgyptianPhone(phone)) {

        showFieldError(
            "customerPhone",
            "اكتب رقم موبايل مصري صحيح"
        );

        valid = false;

    }


    if (!address || address.length < 5) {

        showFieldError(
            "customerAddress",
            "اكتب العنوان بالتفصيل"
        );

        valid = false;

    }


    if (!valid) {

        showToast(
            "راجع البيانات المطلوبة",
            "error"
        );

        return;

    }


    const order =
        createOrder({
            name,
            phone,
            address,
            notes
        });


    saveOrder(order);


    cart = [];

    saveCart();

    renderCart();

    updateCartCount();


    event.target.reset();


    closeModal("#checkoutModal");


    showOrderSuccess(order);


    renderAdmin();

}


function createOrder(customer) {

    const orderId =
        generateOrderId();


    const orderProducts =
        cart
            .map(item => {

                const product =
                    products.find(
                        p => p.id === item.productId
                    );


                if (!product) {
                    return null;
                }


                return {

                    productId: product.id,

                    name: product.name,

                    price: product.price,

                    quantity: item.quantity,

                    total:
                        product.price *
                        item.quantity

                };

            })
            .filter(Boolean);


    return {

        orderId,

        date:
            new Date().toISOString(),

        customerName:
            customer.name,

        phone:
            customer.phone,

        address:
            customer.address,

        notes:
            customer.notes,

        products:
            orderProducts,

        total:
            calculateCartTotal(),

        status:
            "New"

    };

}


function saveOrder(order) {

    orders.unshift(order);

    saveOrders();

}


function showOrderSuccess(order) {

    $("#successOrderId").textContent = order.orderId;
    $("#successCustomerName").textContent = order.customerName;
    $("#successTotal").textContent = formatPrice(order.total);

    // تجهيز رسالة تفاصيل الأوردر لإرسالها عبر واتساب
    let productsListText = order.products.map(p => `- ${p.name} (×${p.quantity}) : ${formatPrice(p.total)}`).join("\n");
    
    let whatsappMessage = `مرحباً ${CONFIG.storeName}، لقد قمت بطلب جديد:\n\n` +
        `📦 *رقم الطلب:* ${order.orderId}\n` +
        `👤 *الاسم:* ${order.customerName}\n` +
        `📞 *الهاتف:* ${order.phone}\n` +
        `📍 *العنوان:* ${order.address}\n\n` +
        `*المنتجات المطلوبة:*\n${productsListText}\n\n` +
        `💰 *الإجمالي النهائي:* ${formatPrice(order.total)}`;

    let encodedMessage = encodeURIComponent(whatsappMessage);
    let whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;

    // ربط الحدث (Click) بزرار الواتساب الموجود في الـ HTML
    const successWhatsAppBtn = $("#successWhatsApp");
    if (successWhatsAppBtn) {
        // بنشيل أي أحداث قديمة عشان ميتكرش الإرسال
        const newBtn = successWhatsAppBtn.cloneNode(true);
        successWhatsAppBtn.parentNode.replaceChild(newBtn, successWhatsAppBtn);

        newBtn.addEventListener("click", () => {
            window.open(whatsappUrl, "_blank");
        });
    }

    $("#successModal")?.classList.add("active");
    document.body.classList.add("modal-open");

    showToast("تم إرسال الطلب بنجاح", "success");
}

/* =========================================================
   ADMIN
========================================================= */

function setupAdmin() {

    $$(".admin-nav-btn").forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const view =
                    button.dataset.adminView;

                switchAdminView(view);

            }
        );

    });


    $$("[data-admin-view]").forEach(button => {

        if (
            button.classList.contains(
                "admin-nav-btn"
            )
        ) {
            return;
        }


        button.addEventListener(
            "click",
            () => {

                switchAdminView(
                    button.dataset.adminView
                );

            }
        );

    });


    $("#closeAdmin")
        ?.addEventListener(
            "click",
            closeAdmin
        );


    $("#adminMobileClose")
        ?.addEventListener(
            "click",
            closeAdmin
        );


    $("#openAddProduct")
        ?.addEventListener(
            "click",
            openAddProduct
        );


    $("#productAdminForm")
        ?.addEventListener(
            "submit",
            saveProductFromAdmin
        );

}

/* =========================================================
   ADMIN SECURITY & ACCESS
========================================================= */

function handleAdminHash() {
    if (window.location.hash === "#admin") {
        // نمنع فتح الـ Admin مباشرة ونطلب كلمة السر أولاً
        let password = prompt("أدخل كلمة مرور لوحة التحكم:");
        
        // غير كلمة "1234" بأي كلمة سر قوية تحبها
        if (password === "1234") { 
            openAdmin();
        } else {
            showToast("كلمة المرور غير صحيحة!", "error");
            closeAdmin(); // عشان يشيل الـ #admin من اللينك لو الباسورد غلط
        }
    }
}

window.addEventListener(
    "hashchange",
    handleAdminHash
);


function openAdmin() {
    const admin = $("#adminOverlay");
    if (!admin) return;

    admin.classList.add("active");
    document.body.classList.add("admin-open");
    renderAdmin();
}


function closeAdmin() {

    const admin =
        $("#adminOverlay");


    admin?.classList.remove("active");

    document.body.classList.remove("admin-open");


    if (
        window.location.hash === "#admin"
    ) {

        history.pushState(
            "",
            document.title,
            window.location.pathname +
            window.location.search
        );

    }

}


function switchAdminView(view) {

    const views = {

        dashboard:
            "#adminDashboardView",

        products:
            "#adminProductsView",

        orders:
            "#adminOrdersView"

    };


    Object.values(views).forEach(
        selector => {

            $(selector)
                ?.classList.remove("active");

        }
    );


    $(views[view])
        ?.classList.add("active");


    $$(".admin-nav-btn").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.adminView === view
        );

    });


    const title =
        $("#adminPageTitle");


    const titles = {

        dashboard:
            "لوحة التحكم",

        products:
            "إدارة المنتجات",

        orders:
            "إدارة الطلبات"

    };


    if (title) {

        title.textContent =
            titles[view];

    }


    renderAdmin();

}


/* =========================================================
   ADMIN RENDER
========================================================= */

function renderAdmin() {

    renderAdminStats();

    renderAdminProducts();

    renderAdminOrders();

    renderAdminOrdersPreview();

    updateAdminNewOrders();

}


function renderAdminStats() {

    const totalProducts =
        $("#statProducts");

    const totalOrders =
        $("#statOrders");

    const newOrders =
        $("#statNewOrders");


    if (totalProducts) {

        totalProducts.textContent =
            products.length;

    }


    if (totalOrders) {

        totalOrders.textContent =
            orders.length;

    }


    if (newOrders) {

        newOrders.textContent =
            orders.filter(
                order => order.status === "New"
            ).length;

    }

}


function updateAdminNewOrders() {

    const count =
        orders.filter(
            order => order.status === "New"
        ).length;


    const element =
        $("#adminNewOrdersCount");


    if (element) {

        element.textContent =
            count;

        element.style.display =
            count > 0
                ? "inline-flex"
                : "none";

    }

}


/* =========================================================
   ADMIN PRODUCTS
========================================================= */

function renderAdminProducts() {

    const table =
        $("#adminProductsTable");


    if (!table) return;


    if (!products.length) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="admin-empty"
                >
                    مفيش منتجات حاليًا
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        products
            .map(product => {

                const inStock =
                    product.stock > 0;


                return `

                    <tr>

                        <td>

                            <div class="admin-product-cell">

                                <div class="admin-product-image">

                                    ${getProductVisual(product)}

                                </div>

                                <div>

                                    <strong>
                                        ${escapeHTML(product.name)}
                                    </strong>

                                    <span>
                                        #${product.id}
                                    </span>

                                </div>

                            </div>

                        </td>


                        <td>
                            ${getArabicCategory(product.category)}
                        </td>


                        <td>
                            ${formatPrice(product.price)}
                        </td>


                        <td>
                            ${product.stock}
                        </td>


                        <td>

                            <span
                                class="admin-status-badge ${
                                    inStock
                                        ? "available"
                                        : "unavailable"
                                }"
                            >
                                ${
                                    inStock
                                        ? "متوفر"
                                        : "نفد المخزون"
                                }
                            </span>

                        </td>


                        <td>

                            <div class="admin-actions">

                                <button
                                    class="admin-edit-btn"
                                    data-product-action="edit"
                                    data-product-id="${product.id}"
                                    title="تعديل"
                                >
                                    <i class="fa-solid fa-pen"></i>
                                </button>


                                <button
                                    class="admin-delete-btn"
                                    data-product-action="delete"
                                    data-product-id="${product.id}"
                                    title="حذف"
                                >
                                    <i class="fa-solid fa-trash"></i>
                                </button>

                            </div>

                        </td>

                    </tr>

                `;

            })
            .join("");


    table
        .querySelectorAll(
            '[data-product-action="edit"]'
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openEditProduct(
                        Number(
                            button.dataset.productId
                        )
                    );

                }
            );

        });


    table
        .querySelectorAll(
            '[data-product-action="delete"]'
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteProduct(
                        Number(
                            button.dataset.productId
                        )
                    );

                }
            );

        });

}


/* =========================================================
   ADD PRODUCT
========================================================= */

function openAddProduct() {

    editingProductId = null;


    const modal =
        $("#productAdminModal");


    const title =
        $("#productAdminTitle");


    const form =
        $("#productAdminForm");


    if (!modal || !form) return;


    form.reset();


    $("#editProductId").value = "";


    if (title) {

        title.innerHTML =
            'إضافة <span>منتج جديد</span>';

    }


    modal.classList.add("active");

    document.body.classList.add("modal-open");

}


function openEditProduct(productId) {

    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) return;


    editingProductId =
        productId;


    $("#editProductId").value =
        productId;


    $("#adminProductName").value =
        product.name;


    $("#adminProductCategory").value =
        product.category;


    $("#adminProductPrice").value =
        product.price;


    $("#adminProductOldPrice").value =
        product.oldPrice || "";


    $("#adminProductStock").value =
        product.stock;


    $("#adminProductBadge").value =
        product.badge || "";


    $("#adminProductImage").value =
        product.image || "";


    $("#adminProductDescription").value =
        product.description || "";


    $("#adminProductSpecs").value =
        Array.isArray(product.specifications)
            ? product.specifications.join("\n")
            : "";


    const title =
        $("#productAdminTitle");


    if (title) {

        title.innerHTML =
            'تعديل <span>المنتج</span>';

    }


    $("#productAdminModal")
        ?.classList.add("active");


    document.body.classList.add("modal-open");

}


function saveProductFromAdmin(event) {

    event.preventDefault();


    const name =
        $("#adminProductName").value.trim();

    const category =
        $("#adminProductCategory").value;

    const price =
        Number(
            $("#adminProductPrice").value
        );

    const oldPrice =
        Number(
            $("#adminProductOldPrice").value
        ) || 0;

    const stock =
        Number(
            $("#adminProductStock").value
        );

    const badge =
        $("#adminProductBadge").value;

    const image =
        $("#adminProductImage").value.trim();

    const description =
        $("#adminProductDescription").value.trim();

    const specifications =
        $("#adminProductSpecs")
            .value
            .split("\n")
            .map(item => item.trim())
            .filter(Boolean);


    if (
        !name ||
        !price ||
        stock < 0 ||
        !description
    ) {

        showToast(
            "راجع بيانات المنتج",
            "error"
        );

        return;

    }


    if (editingProductId) {

        const index =
            products.findIndex(
                item =>
                    item.id ===
                    editingProductId
            );


        if (index !== -1) {

            products[index] = {

                ...products[index],

                name,

                category,

                price,

                oldPrice,

                stock,

                badge,

                image,

                description,

                specifications

            };

        }


        showToast(
            "تم تعديل المنتج",
            "success"
        );

    } else {

        const newProduct = {

            id:
                generateProductId(),

            name,

            category,

            price,

            oldPrice,

            image,

            badge,

            stock,

            description,

            specifications

        };


        products.unshift(
            newProduct
        );


        showToast(
            "تم إضافة المنتج",
            "success"
        );

    }


    saveProducts();

    renderProducts();

    renderAdmin();

    closeModal("#productAdminModal");

}


/* =========================================================
   DELETE PRODUCT
========================================================= */

function deleteProduct(productId) {

    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) return;


    const confirmed =
        window.confirm(
            `هل أنت متأكد إنك عايز تحذف "${product.name}"؟`
        );


    if (!confirmed) return;


    products =
        products.filter(
            item => item.id !== productId
        );


    cart =
        cart.filter(
            item => item.productId !== productId
        );


    saveProducts();

    saveCart();

    renderProducts();

    renderCart();

    renderAdmin();


    showToast(
        "تم حذف المنتج",
        "success"
    );

}


/* =========================================================
   ADMIN ORDERS
========================================================= */

function renderAdminOrdersPreview() {

    const container =
        $("#adminOrdersPreview");


    if (!container) return;


    const latestOrders =
        orders.slice(0, 5);


    if (!latestOrders.length) {

        container.innerHTML = `

            <div class="admin-empty-box">

                <i class="fa-solid fa-receipt"></i>

                <p>
                    لسه مفيش طلبات
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        latestOrders
            .map(order =>
                createAdminOrderCard(
                    order,
                    true
                )
            )
            .join("");


    attachOrderStatusEvents(
        container
    );

}


function renderAdminOrders() {

    const container =
        $("#adminOrdersList");


    if (!container) return;


    if (!orders.length) {

        container.innerHTML = `

            <div class="admin-empty-box">

                <i class="fa-solid fa-receipt"></i>

                <h3>
                    مفيش طلبات حاليًا
                </h3>

                <p>
                    الطلبات الجديدة هتظهر هنا.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        orders
            .map(order =>
                createAdminOrderCard(
                    order,
                    false
                )
            )
            .join("");


    attachOrderStatusEvents(
        container
    );

}


function createAdminOrderCard(
    order,
    compact = false
) {

    const productsText =
        order.products
            .map(
                item =>
                    `${item.name} × ${item.quantity}`
            )
            .join("، ");


    return `

        <div
            class="admin-order-card ${
                compact ? "compact" : ""
            }"
        >

            <div class="order-main-info">

                <div class="order-id">

                    <span>
                        رقم الطلب
                    </span>

                    <strong>
                        ${escapeHTML(order.orderId)}
                    </strong>

                </div>


                <div class="order-customer">

                    <strong>
                        ${escapeHTML(order.customerName)}
                    </strong>

                    <span>
                        ${escapeHTML(order.phone)}
                    </span>

                </div>


                ${
                    !compact
                    ?
                    `
                        <div class="order-products">

                            <span>
                                المنتجات
                            </span>

                            <p>
                                ${escapeHTML(productsText)}
                            </p>

                        </div>
                    `
                    :
                    ""
                }


                <div class="order-total">

                    <span>
                        الإجمالي
                    </span>

                    <strong>
                        ${formatPrice(order.total)}
                    </strong>

                </div>


                <div class="order-date">

                    ${formatDate(order.date)}

                </div>


                <div class="order-status-control">

                    <select
                        class="order-status-select"
                        data-order-id="${escapeHTML(order.orderId)}"
                    >

                        ${createStatusOptions(order.status)}

                    </select>

                </div>

            </div>


            ${
                !compact
                ?
                `
                    <div class="order-extra">

                        <div>

                            <span>
                                العنوان
                            </span>

                            <p>
                                ${escapeHTML(order.address)}
                            </p>

                        </div>


                        ${
                            order.notes
                            ?
                            `
                                <div>

                                    <span>
                                        ملاحظات
                                    </span>

                                    <p>
                                        ${escapeHTML(order.notes)}
                                    </p>

                                </div>
                            `
                            :
                            ""
                        }

                    </div>
                `
                :
                ""
            }

        </div>

    `;

}


function createStatusOptions(currentStatus) {

    const statuses = [
        "New",
        "Confirmed",
        "Preparing",
        "Delivered",
        "Cancelled"
    ];


    return statuses
        .map(status => {

            return `

                <option
                    value="${status}"
                    ${status === currentStatus ? "selected" : ""}
                >
                    ${getArabicStatus(status)}
                </option>

            `;

        })
        .join("");

}


function attachOrderStatusEvents(container) {

    container
        .querySelectorAll(
            ".order-status-select"
        )
        .forEach(select => {

            select.addEventListener(
                "change",
                () => {

                    updateOrderStatus(
                        select.dataset.orderId,
                        select.value
                    );

                }
            );

        });

}


function updateOrderStatus(
    orderId,
    status
) {

    const order =
        orders.find(
            item =>
                item.orderId === orderId
        );


    if (!order) return;


    order.status =
        status;


    saveOrders();

    renderAdminStats();

    updateAdminNewOrders();


    showToast(
        "تم تحديث حالة الطلب",
        "success"
    );

}


/* =========================================================
   WHATSAPP
========================================================= */

function setupWhatsApp() {

    const links =
        $$(".whatsapp-link");


    const phone =
        CONFIG.whatsappNumber;


    if (!phone) return;


    const message =
        encodeURIComponent(
            "أهلاً AL WAFA TECH، محتاج أعرف تفاصيل المنتجات المتاحة."
        );


    links.forEach(link => {

        link.href =
            `https://wa.me/${phone}?text=${message}`;

    });

}


/* =========================================================
   HEADER SCROLL
========================================================= */

function setupScrollHeader() {

    const header =
        $("#mainHeader");


    if (!header) return;


    const updateHeader =
        () => {

            if (
                window.scrollY > 30
            ) {

                header.classList.add(
                    "scrolled"
                );

            } else {

                header.classList.remove(
                    "scrolled"
                );

            }

        };


    window.addEventListener(
        "scroll",
        updateHeader,
        {
            passive: true
        }
    );


    updateHeader();

}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    message,
    type = "success"
) {

    const container =
        $("#toastContainer");


    if (!container) return;


    const iconMap = {

        success:
            "fa-circle-check",

        error:
            "fa-circle-exclamation",

        warning:
            "fa-triangle-exclamation",

        info:
            "fa-circle-info"

    };


    const toast =
        document.createElement("div");


    toast.className =
        `toast toast-${type}`;


    toast.innerHTML = `

        <div class="toast-icon">

            <i
                class="fa-solid ${
                    iconMap[type] ||
                    iconMap.info
                }"
            ></i>

        </div>

        <span>
            ${escapeHTML(message)}
        </span>

        <button
            class="toast-close"
            aria-label="إغلاق"
        >
            <i class="fa-solid fa-xmark"></i>
        </button>

    `;


    container.appendChild(toast);


    requestAnimationFrame(() => {

        toast.classList.add(
            "show"
        );

    });


    const removeToast =
        () => {

            toast.classList.remove(
                "show"
            );

            setTimeout(
                () => toast.remove(),
                300
            );

        };


    toast
        .querySelector(".toast-close")
        ?.addEventListener(
            "click",
            removeToast
        );


    setTimeout(
        removeToast,
        3500
    );

}


/* =========================================================
   FORM VALIDATION
========================================================= */

function validateEgyptianPhone(phone) {

    if (!phone) return false;


    const cleaned =
        phone.replace(
            /[\s\-()]/g,
            ""
        );


    const pattern =
        /^(01)(0|1|2|5)[0-9]{8}$/;


    return pattern.test(
        cleaned
    );

}


function showFieldError(
    fieldId,
    message
) {

    const field =
        $(`#${fieldId}`);


    if (!field) return;


    field.classList.add(
        "error"
    );


    const group =
        field.closest(
            ".form-group"
        );


    const error =
        group?.querySelector(
            ".field-error"
        );


    if (error) {

        error.textContent =
            message;

    }

}


function clearFormErrors() {

    $$(".field-error").forEach(
        element => {

            element.textContent = "";

        }
    );


    $$(".checkout-form input, .checkout-form textarea")
        .forEach(element => {

            element.classList.remove(
                "error"
            );

        });

}


/* =========================================================
   HELPERS
========================================================= */

function formatPrice(price) {

    return (
        new Intl.NumberFormat(
            "ar-EG"
        ).format(price) +
        " " +
        CONFIG.currency
    );

}


function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "ar-EG",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}


function generateOrderId() {

    const date =
        new Date();


    const year =
        date.getFullYear();


    const random =
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    return `AWT-${year}-${random}`;

}


function generateProductId() {

    if (!products.length) {
        return 1;
    }


    return (
        Math.max(
            ...products.map(
                product => Number(product.id)
            )
        ) + 1
    );

}

function getArabicCategory(category) {

    const categories = {

        Mobiles:
            "موبايلات",

        Cameras:
            "كاميرات",

        Laptops:
            "لابتوب",

        "PC Builds":
            "تجميعات PC",

        Monitors:
            "شاشات"

    };

    return (
        categories[category] ||
        category
    );

}


function getArabicStatus(status) {

    const statuses = {

        New:
            "جديد",

        Confirmed:
            "تم التأكيد",

        Preparing:
            "جاري التجهيز",

        Delivered:
            "تم التسليم",

        Cancelled:
            "ملغي"

    };


    return (
        statuses[status] ||
        status
    );

}


/*
    لو فيه صورة حقيقية للمنتج:
    يتم عرضها.

    لو الصورة غير موجودة أو المسار فاضي:
    يتم إظهار Visual احتياطي
    بدل ما الموقع يظهر بصورة مكسورة.
*/

function getProductVisual(product) {

    if (
        product.image &&
        product.image.trim() !== ""
    ) {

        return `

            <img
                src="${escapeAttribute(product.image)}"
                alt="${escapeAttribute(product.name)}"
                loading="lazy"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            >

            <div class="product-placeholder">
                ${getProductIcon(product.category)}
            </div>

        `;

    } else {

        return `
            <div class="product-placeholder">
                ${getProductIcon(product.category)}
            </div>
        `;

    }

}

function getProductIcon(category) {

    const icons = {

        Mobiles:
            "fa-mobile-screen-button",

        Cameras:
            "fa-video",

        Laptops:
            "fa-laptop",

        "PC Builds":
            "fa-computer",

        Monitors:
            "fa-tv"

    };

    const icon =
        icons[category] ||
        "fa-box";

    return `
        <i class="fa-solid ${icon}"></i>
    `;

}


function truncate(
    text,
    maxLength
) {

    if (!text) return "";


    if (
        text.length <= maxLength
    ) {

        return text;

    }


    return (
        text.substring(
            0,
            maxLength
        ) +
        "..."
    );

}


function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeAttribute(value) {

    return escapeHTML(value);

}

/* =========================================================
   AUTO UPDATE PRODUCT STOCK IN CART
========================================================= */

function cleanInvalidCartItems() {

    const validProductIds =
        new Set(
            products.map(
                product => product.id
            )
        );


    cart =
        cart.filter(
            item =>
                validProductIds.has(
                    item.productId
                )
        );


    cart.forEach(item => {

        const product =
            products.find(
                p =>
                    p.id ===
                    item.productId
            );


        if (
            product &&
            item.quantity >
            product.stock
        ) {

            item.quantity =
                product.stock;

        }

    });


    cart =
        cart.filter(
            item => item.quantity > 0
        );


    saveCart();

}


/* =========================================================
   RUN CART CLEANUP
========================================================= */

cleanInvalidCartItems();


/* =========================================================
   EXPOSE OPTIONAL FUNCTIONS
   Useful later when connecting backend/API
========================================================= */

window.AlWafaTech = {

    getProducts: () =>
        products,

    getCart: () =>
        cart,

    getOrders: () =>
        orders,

    addToCart,

    removeFromCart,

    updateCartQuantity,

    openProductDetails,

    openCheckout,

    openAdmin,

    showToast

};


/* =========================================================
   END
========================================================= */
