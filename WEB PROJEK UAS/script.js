// ===========================
// DATA PRODUK
// ===========================
const products = [
    { id: 1, name: 'One Piece Luffy', price: 750000, category: 'figures', image: '🎯', rating: 5, sales: 1250 },
    { id: 2, name: 'Naruto Uzumaki', price: 680000, category: 'figures', image: '🎯', rating: 4, sales: 980 },
    { id: 3, name: 'Demon Slayer Tanjiro', price: 720000, category: 'figures', image: '🎯', rating: 5, sales: 1100 },
    { id: 4, name: 'Attack on Titan Eren', price: 800000, category: 'figures', image: '🎯', rating: 4, sales: 850 },
    { id: 5, name: 'My Hero Academia Deku', price: 710000, category: 'figures', image: '🎯', rating: 5, sales: 1300 },
    { id: 6, name: 'Death Note Light', price: 690000, category: 'figures', image: '🎯', rating: 4, sales: 720 },
    { id: 7, name: 'Jujutsu Kaisen Yuji', price: 730000, category: 'figures', image: '🎯', rating: 5, sales: 1150 },
    { id: 8, name: 'Anime T-Shirt Luffy', price: 150000, category: 'merchandise', image: '👕', rating: 4, sales: 450 },
    { id: 9, name: 'Anime Hoodie Naruto', price: 250000, category: 'merchandise', image: '👕', rating: 5, sales: 680 },
    { id: 10, name: 'Limited Collection Box', price: 500000, category: 'collectibles', image: '💎', rating: 5, sales: 320 },
    { id: 11, name: 'Anime Keychain Set', price: 50000, category: 'accessories', image: '🎀', rating: 4, sales: 890 },
    { id: 12, name: 'Anime Phone Case', price: 80000, category: 'accessories', image: '🎀', rating: 4, sales: 620 },
];

// ===========================
// HAMBURGER MENU
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Tutup menu saat link diklik
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }

    // Load cart jika di halaman cart
    if (document.getElementById('cartItems') && document.body.onload !== loadCart) {
        loadCart();
    }

    // Load products jika di halaman produk
    if (document.getElementById('productGrid')) {
        displayProducts(products);
    }

    // Load recommended products di homepage
    if (document.getElementById('recommendedGrid')) {
        displayRecommendedProducts();
    }

    // Initialize filters
    if (document.querySelector('.category-filter')) {
        document.querySelectorAll('.category-filter').forEach(filter => {
            filter.addEventListener('change', filterProducts);
        });

        document.querySelectorAll('.rating-filter').forEach(filter => {
            filter.addEventListener('change', filterProducts);
        });

        document.getElementById('priceRange').addEventListener('input', function() {
            document.getElementById('priceValue').textContent = this.value.toLocaleString('id-ID');
            filterProducts();
        });
    }
});

// ===========================
// DISPLAY PRODUCTS
// ===========================
function displayProducts(productsToDisplay) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;

    productGrid.innerHTML = '';

    if (productsToDisplay.length === 0) {
        productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">Tidak ada produk yang sesuai dengan filter Anda</p>';
        return;
    }

    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div style="font-size: 120px; text-align: center; padding: 40px 0; background: #f0f0f0;">
                ${product.image}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">Rp ${product.price.toLocaleString('id-ID')}</p>
                <div style="display: flex; gap: 5px; margin-bottom: 15px;">
                    ${Array(product.rating).fill('★').join('')}${Array(5 - product.rating).fill('☆').join('')}
                </div>
                <button class="btn" onclick="addToCart('${product.name}', ${product.price}); event.stopPropagation();">
                    Tambah ke Keranjang
                </button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// ===========================
// FILTER PRODUCTS
// ===========================
function filterProducts() {
    const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked'))
        .map(el => el.value);
    const selectedRatings = Array.from(document.querySelectorAll('.rating-filter:checked'))
        .map(el => parseInt(el.value));
    const maxPrice = parseInt(document.getElementById('priceRange').value);

    let filtered = products.filter(product => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const ratingMatch = selectedRatings.length === 0 || selectedRatings.some(rating => product.rating >= rating);
        const priceMatch = product.price <= maxPrice;

        return categoryMatch && ratingMatch && priceMatch;
    });

    displayProducts(filtered);
}

// ===========================
// SORT PRODUCTS
// ===========================
function sortProducts() {
    const sortValue = document.getElementById('sortSelect').value;
    let sortedProducts = [...products];

    switch (sortValue) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
        default:
            sortedProducts.sort((a, b) => b.id - a.id);
    }

    displayProducts(sortedProducts);
}

// ===========================
// RESET FILTERS
// ===========================
function resetFilters() {
    document.querySelectorAll('.category-filter, .rating-filter').forEach(filter => {
        filter.checked = false;
    });
    document.getElementById('priceRange').value = 1000000;
    document.getElementById('priceValue').textContent = '1.000.000';
    displayProducts(products);
}

// ===========================
// CATEGORY FILTER (HOME PAGE)
// ===========================
function filterCategory(category) {
    const filtered = products.filter(p => p.category === category);
    const productGrid = document.getElementById('productGrid');
    if (productGrid) {
        displayProducts(filtered);
        productGrid.scrollIntoView({ behavior: 'smooth' });
    }
}

// ===========================
// CART FUNCTIONS
// ===========================
function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ name, price, id: Date.now() });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("✓ " + name + " ditambahkan ke keranjang!");
}

function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let list = document.getElementById("cartItems");
    
    if (!list) return;

    const cartSection = document.querySelector('.cart-section');
    const emptyCart = document.getElementById("emptyCart");

    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (list.parentElement) list.parentElement.parentElement.style.display = 'none';
        return;
    }

    if (emptyCart) emptyCart.style.display = 'none';
    if (list.parentElement) list.parentElement.parentElement.style.display = 'grid';

    list.innerHTML = '';

    cart.forEach(item => {
        let li = document.createElement("li");
        li.innerHTML = `
            <div class="product-details">
                <div class="product-name">${item.name}</div>
                <div class="product-price">Rp ${item.price.toLocaleString('id-ID')}</div>
            </div>
            <button class="btn" onclick="removeFromCart(${item.id})">Hapus</button>
        `;
        list.appendChild(li);
    });

    updateTotal();
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    alert("✓ Produk dihapus dari keranjang");
}

function updateTotal() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let subtotal = cart.reduce((total, item) => total + item.price, 0);
    let discount = 0;
    let shipping = parseInt(document.getElementById("shippingOption")?.value || 0);
    let tax = Math.floor(subtotal * 0.1);
    let total = subtotal - discount + shipping + tax;

    if (document.getElementById("subtotal")) {
        document.getElementById("subtotal").textContent = "Rp " + subtotal.toLocaleString('id-ID');
        document.getElementById("discount").textContent = "Rp " + discount.toLocaleString('id-ID');
        document.getElementById("tax").textContent = "Rp " + tax.toLocaleString('id-ID');
        document.getElementById("total").textContent = "Rp " + total.toLocaleString('id-ID');
    }
}

function updateShipping() {
    updateTotal();
}

function applyPromo() {
    const promoCode = document.getElementById("promoCode").value.toUpperCase();
    const promoCodes = {
        'DISC10': 0.1,
        'DISC20': 0.2,
        'WELCOME': 0.15
    };

    if (promoCodes[promoCode]) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let subtotal = cart.reduce((total, item) => total + item.price, 0);
        let discount = Math.floor(subtotal * promoCodes[promoCode]);
        
        document.getElementById("discount").textContent = "Rp " + discount.toLocaleString('id-ID');
        updateTotal();
        alert("✓ Promo " + promoCode + " berhasil diterapkan!");
        document.getElementById("promoCode").value = "";
    } else {
        alert("✗ Kode promo tidak valid");
    }
}

function checkout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("✗ Keranjang Anda kosong!");
        return;
    }
    alert("✓ Terima kasih! Proses pembayaran akan segera dimulai...");
    localStorage.setItem("cart", JSON.stringify([]));
    loadCart();
}

// ===========================
// LOGIN FUNCTIONS
// ===========================
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username && password) {
        localStorage.setItem("user", JSON.stringify({ username }));
        alert("✓ Login berhasil! Selamat datang " + username);
        window.location.href = "index.html";
    } else {
        alert("✗ Silakan isi username dan password");
    }
}

// ===========================
// RECOMMENDED PRODUCTS FUNCTION
// ===========================
function displayRecommendedProducts() {
    const recommendedGrid = document.getElementById('recommendedGrid');
    if (!recommendedGrid) return;

    // Sort by sales (terbanyak dibeli)
    const bestSellers = [...products].sort((a, b) => b.sales - a.sales).slice(0, 6);

    recommendedGrid.innerHTML = '';

    bestSellers.forEach(product => {
        const recommendedCard = document.createElement('div');
        recommendedCard.className = 'recommended-card';
        recommendedCard.innerHTML = `
            <div class="sales-count">🔥 ${product.sales} terjual</div>
            <div class="best-seller-badge">Best Seller</div>
            <div style="font-size: 120px; text-align: center; padding: 40px 0; background: #f0f0f0;">
                ${product.image}
            </div>
            <div class="recommended-info">
                <h3>${product.name}</h3>
                <div class="rating">
                    ${Array(product.rating).fill('★').join('')}${Array(5 - product.rating).fill('☆').join('')}
                    (${product.rating}.0)
                </div>
                <p class="price">Rp ${product.price.toLocaleString('id-ID')}</p>
                <button class="btn" onclick="addToCart('${product.name}', ${product.price}); event.stopPropagation();">
                    Tambah ke Keranjang
                </button>
            </div>
        `;
        recommendedGrid.appendChild(recommendedCard);
    });
}

// ===========================
// COLLECTION FUNCTIONS
// ===========================
function viewCollection(collectionName) {
    const collectionData = {
        'one-piece': {
            title: 'One Piece Legacy Collection',
            description: 'Koleksi lengkap karakter One Piece dari tahun 2020-2025',
            items: 24,
            rating: 4.8
        },
        'naruto': {
            title: 'Naruto Shippuden Collection',
            description: 'Seri lengkap Naruto dengan edisi premium dan eksklusif',
            items: 18,
            rating: 4.9
        },
        'jjk': {
            title: 'Jujutsu Kaisen Collection',
            description: 'Koleksi terbaru Jujutsu Kaisen dengan detail yang sangat detail',
            items: 15,
            rating: 4.7
        },
        'mha': {
            title: 'My Hero Academia Collection',
            description: 'Koleksi MHA terlengkap dengan figurin super detail',
            items: 20,
            rating: 4.6
        },
        'aot': {
            title: 'Attack on Titan Collection',
            description: 'Edisi terbatas koleksi Attack on Titan yang sangat eksklusif',
            items: 12,
            rating: 4.9
        },
        'demon-slayer': {
            title: 'Demon Slayer Collection',
            description: 'Koleksi premium Demon Slayer dengan material berkualitas tinggi',
            items: 16,
            rating: 4.8
        }
    };

    const collection = collectionData[collectionName];
    const modal = document.getElementById('collectionModal');
    const details = document.getElementById('collectionDetails');

    if (collection && modal && details) {
        details.innerHTML = `
            <h2>${collection.title}</h2>
            <p>${collection.description}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 30px;">
                <div>
                    <p><strong>Total Items:</strong> ${collection.items}</p>
                    <p><strong>Rating:</strong> ⭐ ${collection.rating}/5</p>
                </div>
                <button class="btn" onclick="closeCollection()">Tutup</button>
            </div>
        `;
        modal.style.display = 'block';
    }
}

function closeCollection() {
    const modal = document.getElementById('collectionModal');
    if (modal) modal.style.display = 'none';
}

// ===========================
// PRE-ORDER FUNCTIONS
// ===========================
function preorderItem(name, price, releaseDate) {
    let preorders = JSON.parse(localStorage.getItem("preorders")) || [];
    preorders.push({ name, price, releaseDate, id: Date.now() });
    localStorage.setItem("preorders", JSON.stringify(preorders));
    alert(`✓ ${name} berhasil di-pre-order!\n\nTanggal Rilis: ${releaseDate}\nHarga: Rp ${price.toLocaleString('id-ID')}`);
}