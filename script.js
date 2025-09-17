// Product data array with sample images
const products = [
    { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 2999, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop' },
    { id: 2, name: 'Stylish T-Shirt', category: 'Apparel', price: 599, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop' },
    { id: 3, name: 'Smartphone Pro', category: 'Electronics', price: 45999, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop' },
    { id: 4, name: 'Denim Jeans', category: 'Apparel', price: 1899, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=200&fit=crop' },
    { id: 5, name: 'Smartwatch', category: 'Electronics', price: 8999, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop' },
    { id: 6, name: 'Classic Hoodie', category: 'Apparel', price: 1299, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=200&fit=crop' },
    { id: 7, name: 'Gaming Laptop', category: 'Electronics', price: 75999, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop' },
    { id: 8, name: 'Running Shoes', category: 'Apparel', price: 3499, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop' },
    { id: 9, name: 'Bluetooth Speaker', category: 'Electronics', price: 1999, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=200&fit=crop' },
    { id: 10, name: 'Winter Jacket', category: 'Apparel', price: 2799, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=200&fit=crop' }
];

// Shopping cart array to store added items
let cart = [];

// DOM elements
const productsGrid = document.getElementById('products-grid');
const cartBtn = document.querySelector('.cart-btn');
const cartDropdown = document.querySelector('.cart-dropdown');
const cartCount = document.querySelector('.cart-count');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.getElementById('cart-total');
const filterBtns = document.querySelectorAll('.filter-btn');
const closeCartBtn = document.querySelector('.close-cart');
const loading = document.getElementById('loading');
const navLinks = document.querySelectorAll('.nav-link');
const loginBtn = document.querySelector('.login-btn');
const categoryItems = document.querySelectorAll('.category-item');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    showLoading();
    setTimeout(() => {
        renderProducts(products);
        hideLoading();
    }, 500);
    
    setupEventListeners();
    setupNavigation();
});

// Show loading spinner
function showLoading() {
    loading.classList.add('show');
    loading.setAttribute('aria-hidden', 'false');
}

// Hide loading spinner
function hideLoading() {
    loading.classList.remove('show');
    loading.setAttribute('aria-hidden', 'true');
}

// Setup all event listeners
function setupEventListeners() {
    // Filter button event listeners
    filterBtns.forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
        btn.addEventListener('keydown', handleFilterKeydown);
    });
    
    // Cart button event listener
    cartBtn.addEventListener('click', toggleCart);
    cartBtn.addEventListener('keydown', handleCartKeydown);
    
    // Close cart button event listener
    closeCartBtn.addEventListener('click', closeCart);
    
    // Close cart when clicking outside
    document.addEventListener('click', handleOutsideClick);
    
    // Keyboard navigation for cart
    document.addEventListener('keydown', handleEscapeKey);
    
    // Login button event listener
    loginBtn.addEventListener('click', handleLogin);
    
    // Category dropdown event listeners
    setupCategoryDropdowns();
}

// Handle filter button clicks
function handleFilterClick(e) {
    const category = e.target.dataset.category;
    
    // Update active filter button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Filter and render products
    showLoading();
    setTimeout(() => {
        const filteredProducts = category === 'all' 
            ? products 
            : products.filter(product => product.category === category);
        
        renderProducts(filteredProducts);
        hideLoading();
    }, 300);
}

// Handle keyboard navigation for filter buttons
function handleFilterKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleFilterClick(e);
    }
}

// Render products in the grid
function renderProducts(productsToRender) {
    productsGrid.innerHTML = '';
    
    productsToRender.forEach((product, index) => {
        const productCard = createProductCard(product);
        productCard.style.animationDelay = `${index * 0.1}s`;
        productsGrid.appendChild(productCard);
    });
}

// Create individual product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('role', 'gridcell');
    
    card.innerHTML = `
        <div class="product-image" role="img" aria-label="${product.name} image">
            <img src="${product.image}" alt="${product.name}" 
                 style="width: 100%; height: 100%; object-fit: cover;"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
            <span style="font-size: 2rem; display: none; width: 100%; height: 100%; align-items: center; justify-content: center;">${getProductEmoji(product.category)}</span>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <span class="product-category">${product.category}</span>
            <div class="product-price">₹${product.price.toLocaleString('en-IN')}</div>
            <button class="add-to-cart" 
                    data-id="${product.id}" 
                    aria-label="Add ${product.name} to cart">
                Add to Cart
            </button>
        </div>
    `;
    
    // Add event listener to the add to cart button
    const addToCartBtn = card.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => addToCart(product));
    addToCartBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            addToCart(product);
        }
    });
    
    return card;
}

// Get emoji based on product category
function getProductEmoji(category) {
    const emojis = {
        'Electronics': '📱',
        'Apparel': '👕'
    };
    return emojis[category] || '🛍️';
}

// Add product to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
    showCartFeedback();
}

// Show visual feedback when item is added to cart
function showCartFeedback() {
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartBtn.style.transform = '';
    }, 200);
}

// Update cart UI elements
function updateCartUI() {
    updateCartCount();
    renderCartItems();
    updateCartTotal();
}

// Update cart count badge
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Render cart items in dropdown
function renderCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Your cart is empty</p>';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" 
                 style="width: 40px; height: 40px; object-fit: cover; border-radius: 5px;"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
            <div style="width: 40px; height: 40px; background: #f0f0f0; border-radius: 5px; display: none; align-items: center; justify-content: center;">
                ${getProductEmoji(item.category)}
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')} x ${item.quantity}</div>
            </div>
            <button onclick="removeFromCart(${item.id})" 
                    style="background: none; border: none; color: #e74c3c; cursor: pointer; font-size: 1.2rem;"
                    aria-label="Remove ${item.name} from cart">
                ×
            </button>
        </div>
    `).join('');
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Update cart total
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toLocaleString('en-IN');
}

// Toggle cart dropdown
function toggleCart() {
    const isOpen = cartDropdown.classList.contains('show');
    
    if (isOpen) {
        closeCart();
    } else {
        openCart();
    }
}

// Open cart dropdown
function openCart() {
    cartDropdown.classList.add('show');
    cartBtn.setAttribute('aria-expanded', 'true');
    
    // Focus management for accessibility
    setTimeout(() => {
        closeCartBtn.focus();
    }, 100);
}

// Close cart dropdown
function closeCart() {
    cartDropdown.classList.remove('show');
    cartBtn.setAttribute('aria-expanded', 'false');
    cartBtn.focus();
}

// Handle keyboard navigation for cart button
function handleCartKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCart();
    }
}

// Handle clicks outside cart to close it
function handleOutsideClick(e) {
    if (!cartDropdown.contains(e.target) && !cartBtn.contains(e.target)) {
        closeCart();
    }
}

// Handle escape key to close cart
function handleEscapeKey(e) {
    if (e.key === 'Escape' && cartDropdown.classList.contains('show')) {
        closeCart();
    }
}

// Smooth scroll to top when logo is clicked
document.querySelector('.logo').addEventListener('click', () => {
    // Reset to home view
    navLinks.forEach(l => l.classList.remove('active'));
    navLinks[0].classList.add('active');
    
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add intersection observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate promotional cards on scroll
function observePromoCards() {
    const promoCards = document.querySelectorAll('.promo-card');
    promoCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.animationDelay = `${index * 0.2}s`;
        observer.observe(card);
    });
}

// Call observe function for promo cards
setTimeout(observePromoCards, 100);

// Observe product cards for scroll animations
function observeProductCards() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Call observe function after products are rendered
const originalRenderProducts = renderProducts;
renderProducts = function(productsToRender) {
    originalRenderProducts(productsToRender);
    setTimeout(() => {
        observeProductCards();
        observePromoCards();
    }, 100);
};

// Performance optimization: Debounce filter clicks
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to filter function
const debouncedFilter = debounce(handleFilterClick, 150);

// Update filter event listeners with debounced function
filterBtns.forEach(btn => {
    btn.removeEventListener('click', handleFilterClick);
    btn.addEventListener('click', debouncedFilter);
});

// Add loading states for better UX
function addLoadingState(element) {
    element.style.opacity = '0.7';
    element.style.pointerEvents = 'none';
}

function removeLoadingState(element) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
}

// Error handling for missing images
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
    }
}, true);

// Setup navigation functionality
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Smooth scroll to top for navigation
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Setup category dropdown functionality
function setupCategoryDropdowns() {
    categoryItems.forEach(item => {
        const dropdown = item.querySelector('.dropdown');
        const links = dropdown.querySelectorAll('a');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.textContent;
                
                // Filter products based on category selection
                showLoading();
                setTimeout(() => {
                    let filteredProducts = products;
                    
                    // Simple category mapping
                    if (category.includes('Smartphone') || category.includes('Laptop') || category.includes('Headphone') || category.includes('Camera')) {
                        filteredProducts = products.filter(p => p.category === 'Electronics');
                    } else if (category.includes('Clothing') || category.includes('Shoes') || category.includes('Accessories')) {
                        filteredProducts = products.filter(p => p.category === 'Apparel');
                    }
                    
                    renderProducts(filteredProducts);
                    hideLoading();
                    
                    // Scroll to products section
                    document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth' });
                }, 300);
            });
        });
    });
}

// Handle login button click
function handleLogin() {
    alert('Login functionality coming soon! 🚀\n\nFeatures:\n• Secure user authentication\n• Order history\n• Wishlist management\n• Personalized recommendations');
}

// Add promotional card click handlers
document.addEventListener('DOMContentLoaded', () => {
    const promoCards = document.querySelectorAll('.promo-card');
    promoCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').textContent;
            
            showLoading();
            setTimeout(() => {
                let filteredProducts = products;
                
                if (title.includes('Electronics')) {
                    filteredProducts = products.filter(p => p.category === 'Electronics');
                } else if (title.includes('Sports')) {
                    filteredProducts = products.filter(p => p.category === 'Apparel');
                }
                
                renderProducts(filteredProducts);
                hideLoading();
                
                // Scroll to products section
                document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth' });
            }, 300);
        });
        
        // Add cursor pointer
        card.style.cursor = 'pointer';
    });
});

// Console welcome message
console.log(`
🛍️ Welcome to Click Bazar! 
🎨 Modern shopping experience with white & blue theme
♿ Fully accessible and responsive design
🚀 Optimized for performance
💫 Enhanced with category dropdowns and promotions
`);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        products,
        addToCart,
        removeFromCart,
        renderProducts
    };
}