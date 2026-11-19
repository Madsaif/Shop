// Sample product data
const products = [
    {
        id: 1,
        name: "E-Commerce Platform",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=400",
    },
    {
        id: 2,
        name: "Business Analytics Dashboard",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    },
    {
        id: 3,
        name: "Mobile App Suite",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
    },
    {
        id: 4,
        name: "Cloud Storage Solution",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400",
    },
    {
        id: 5,
        name: "AI Chatbot Integration",
        price: 399.99,
        image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400",
    },
    {
        id: 6,
        name: "Cybersecurity Suite",
        price: 249.99,
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400",
    }
];

// Cart array
let cart = [];

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const cartIcon = document.getElementById('cartIcon');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalSpan = document.getElementById('cartTotal');
const cartCountSpan = document.querySelector('.cart-count');
const mobileCartCount = document.querySelector('.cart-count-mobile');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

// Render products
function renderProducts() {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    openCartDrawer(); // optional: open cart when adding
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

// Update cart UI (drawer, counts, total)
function updateCartUI() {
    // Update cart count badges
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = totalItems;
    if (mobileCartCount) mobileCartCount.textContent = totalItems;

    // Update cart drawer
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; color:#999;">Your cart is empty.</p>';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn plus">+</button>
                        </div>
                    </div>
                    <button class="remove-item"><i class="fas fa-trash"></i></button>
                </div>
            `).join('');
        }
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotalSpan.textContent = `$${total.toFixed(2)}`;
}

// Open cart drawer
function openCartDrawer() {
    cartDrawer.classList.add('open');
    cartOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close cart drawer
function closeCartDrawer() {
    cartDrawer.classList.remove('open');
    cartOverlay.style.display = 'none';
    document.body.style.overflow = '';
}

// Event listeners
document.addEventListener('click', (e) => {
    // Add to cart button
    if (e.target.classList.contains('add-to-cart')) {
        const productCard = e.target.closest('.product-card');
        if (productCard) {
            const productId = parseInt(productCard.dataset.id);
            addToCart(productId);
        }
    }

    // Cart icon click
    if (e.target.closest('#cartIcon') || e.target.closest('#mobileCartLink')) {
        e.preventDefault();
        openCartDrawer();
    }

    // Close cart overlay
    if (e.target === cartOverlay) {
        closeCartDrawer();
    }

    // Close cart button
    if (e.target.closest('#closeCart')) {
        closeCartDrawer();
    }

    // Quantity buttons (delegation)
    if (e.target.classList.contains('quantity-btn')) {
        const cartItem = e.target.closest('.cart-item');
        if (!cartItem) return;
        const productId = parseInt(cartItem.dataset.id);
        if (e.target.classList.contains('plus')) {
            updateQuantity(productId, 1);
        } else if (e.target.classList.contains('minus')) {
            updateQuantity(productId, -1);
        }
    }

    // Remove item
    if (e.target.closest('.remove-item')) {
        const cartItem = e.target.closest('.cart-item');
        if (cartItem) {
            const productId = parseInt(cartItem.dataset.id);
            removeFromCart(productId);
        }
    }
});

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Search functionality (simple filter)
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

function filterProducts() {
    const term = searchInput.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(term));
    productsGrid.innerHTML = filtered.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

searchBtn.addEventListener('click', filterProducts);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') filterProducts();
});

// Initialize
renderProducts();
updateCartUI();

// Optional: close mobile nav when clicking a link
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
    });
});