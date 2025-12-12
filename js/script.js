// ============ Global Variables ============
let cart = [];
let currentFilter = "all";
let selectedProduct = null;

// ============ Initialize Application ============
document.addEventListener("DOMContentLoaded", () => {
	renderProducts("all");
	setupEventListeners();
	loadCartFromStorage();
});

// ============ Setup Event Listeners ============
function setupEventListeners() {
	// Filter buttons
	const filterButtons = document.querySelectorAll(".filter-btn");
	filterButtons.forEach((btn) => {
		btn.addEventListener("click", () => {
			filterButtons.forEach((b) => b.classList.remove("active"));
			btn.classList.add("active");
			const filter = btn.dataset.filter;
			currentFilter = filter;
			renderProducts(filter);
		});
	});

	// Modal close button
	const closeBtn = document.querySelector(".close");
	if (closeBtn) {
		closeBtn.addEventListener("click", closeModal);
	}

	// Cart icon
	const cartIcon = document.querySelector(".cart-icon");
	if (cartIcon) {
		cartIcon.addEventListener("click", (e) => {
			e.preventDefault();
			toggleCart();
		});
	}

	// Close cart button
	const closeCartBtn = document.querySelector(".close-cart");
	if (closeCartBtn) {
		closeCartBtn.addEventListener("click", closeCart);
	}

	// Cart overlay
	const cartOverlay = document.getElementById("cartOverlay");
	if (cartOverlay) {
		cartOverlay.addEventListener("click", closeCart);
	}

	// Modal overlay
	const modal = document.getElementById("productModal");
	if (modal) {
		window.addEventListener("click", (event) => {
			if (event.target === modal) {
				closeModal();
			}
		});
	}

	// Navigation links
	const navLinks = document.querySelectorAll(".nav-link");
	navLinks.forEach((link) => {
		link.addEventListener("click", () => {
			navLinks.forEach((l) => l.classList.remove("active"));
			link.classList.add("active");
		});
	});
}

// ============ Render Products ============
function renderProducts(filter) {
	const productsGrid = document.getElementById("productsGrid");
	productsGrid.innerHTML = "";

	let filteredProducts = products;
	if (filter !== "all") {
		filteredProducts = products.filter((p) => p.category === filter);
	}

	filteredProducts.forEach((product) => {
		const productCard = createProductCard(product);
		productsGrid.appendChild(productCard);
	});
}

// ============ Create Product Card ============
function createProductCard(product) {
	const card = document.createElement("div");
	card.className = "product-card";
	card.innerHTML = `
        <div class="product-image">
            <div class="product-badge">${product.badge}</div>
            <span style="font-size: 3rem;">${product.icon}</span>
        </div>
        <div class="product-info">
            <div class="product-category">${categories[product.category]}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
                <span class="product-price">$${product.price.toFixed(2)}</span>
                <button class="product-btn">Quick View</button>
            </div>
        </div>
    `;

	card.addEventListener("click", () => {
		selectedProduct = product;
		openModal(product);
	});

	return card;
}

// ============ Modal Functions ============
function openModal(product) {
	const modal = document.getElementById("productModal");
	document.getElementById("modalTitle").textContent = product.name;
	document.getElementById("modalDescription").textContent =
		product.description;
	document.getElementById(
		"modalPrice"
	).textContent = `$${product.price.toFixed(2)}`;
	document.getElementById(
		"modalImage"
	).innerHTML = `<div style="font-size: 5rem;">${product.icon}</div>`;

	const featuresList = document.getElementById("modalFeatures");
	featuresList.innerHTML = "";
	product.features.forEach((feature) => {
		const li = document.createElement("li");
		li.textContent = feature;
		featuresList.appendChild(li);
	});

	modal.style.display = "block";
}

function closeModal() {
	const modal = document.getElementById("productModal");
	modal.style.display = "none";
}

// ============ Cart Functions ============
function addToCart() {
	if (!selectedProduct) return;

	const existingItem = cart.find((item) => item.id === selectedProduct.id);
	if (existingItem) {
		existingItem.quantity += 1;
	} else {
		cart.push({
			...selectedProduct,
			quantity: 1,
		});
	}

	saveCartToStorage();
	updateCartUI();
	closeModal();
	showCartNotification();
}

function removeFromCart(productId) {
	cart = cart.filter((item) => item.id !== productId);
	saveCartToStorage();
	updateCartUI();
}

function updateCartUI() {
	const cartSidebar = document.getElementById("cartSidebar");
	const cartItems = document.getElementById("cartItems");
	const cartTotal = document.getElementById("cartTotal");
	const cartCount = document.querySelector(".cart-count");

	// Clear cart items
	cartItems.innerHTML = "";

	if (cart.length === 0) {
		cartItems.innerHTML =
			'<p style="color: var(--text-light); text-align: center; padding: 2rem;">Your cart is empty</p>';
		cartTotal.textContent = "$0.00";
		cartCount.textContent = "0";
		return;
	}

	// Display cart items
	let total = 0;
	cart.forEach((item) => {
		const itemTotal = item.price * item.quantity;
		total += itemTotal;

		const cartItem = document.createElement("div");
		cartItem.className = "cart-item";
		cartItem.innerHTML = `
            <div class="cart-item-name">${item.name}</div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="color: var(--text-light);">Qty: <strong>${
					item.quantity
				}</strong></span>
                <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
            </div>
            <button onclick="removeFromCart(${item.id})" style="
                width: 100%;
                padding: 0.5rem;
                background: var(--dark-red);
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 0.8rem;
                transition: all 0.3s;
            " onmouseover="this.style.background='var(--primary-red)'" onmouseout="this.style.background='var(--dark-red)'">
                Remove
            </button>
        `;
		cartItems.appendChild(cartItem);
	});

	// Update total and count
	cartTotal.textContent = `$${total.toFixed(2)}`;
	cartCount.textContent = cart.length;
}

function toggleCart() {
	const cartSidebar = document.getElementById("cartSidebar");
	const cartOverlay = document.getElementById("cartOverlay");
	cartSidebar.classList.toggle("active");
	cartOverlay.classList.toggle("active");
}

function closeCart() {
	const cartSidebar = document.getElementById("cartSidebar");
	const cartOverlay = document.getElementById("cartOverlay");
	cartSidebar.classList.remove("active");
	cartOverlay.classList.remove("active");
}

function saveCartToStorage() {
	localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCartFromStorage() {
	const storedCart = localStorage.getItem("cart");
	if (storedCart) {
		cart = JSON.parse(storedCart);
		updateCartUI();
	}
}

// ============ Notification Function ============
function showCartNotification() {
	// Create notification element
	const notification = document.createElement("div");
	notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, var(--primary-red), var(--light-red));
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 5px 20px rgba(220, 20, 60, 0.5);
        z-index: 2000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;
	notification.textContent = "✓ Item added to cart!";
	document.body.appendChild(notification);

	// Remove after 3 seconds
	setTimeout(() => {
		notification.style.animation = "slideOutRight 0.3s ease";
		setTimeout(() => notification.remove(), 300);
	}, 3000);
}

// ============ Add Animation Styles ============
const style = document.createElement("style");
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============ Smooth Scroll Behavior ============
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", function (e) {
		e.preventDefault();
		const target = document.querySelector(this.getAttribute("href"));
		if (target) {
			target.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}
	});
});

// ============ Active Navigation Link on Scroll ============
window.addEventListener("scroll", () => {
	let current = "";
	const sections = document.querySelectorAll("section");

	sections.forEach((section) => {
		const sectionTop = section.offsetTop;
		const sectionHeight = section.clientHeight;
		if (scrollY >= sectionTop - 200) {
			current = section.getAttribute("id");
		}
	});

	document.querySelectorAll(".nav-link").forEach((link) => {
		link.classList.remove("active");
		if (link.getAttribute("href").slice(1) === current) {
			link.classList.add("active");
		}
	});
});

// ============ Price Filter Functionality ============
function filterByPrice(maxPrice) {
	const filtered = products.filter((p) => p.price <= maxPrice);
	const productsGrid = document.getElementById("productsGrid");
	productsGrid.innerHTML = "";
	filtered.forEach((product) => {
		const productCard = createProductCard(product);
		productsGrid.appendChild(productCard);
	});
}

// ============ Search Functionality (Future Enhancement) ============
function searchProducts(query) {
	const filtered = products.filter(
		(p) =>
			p.name.toLowerCase().includes(query.toLowerCase()) ||
			p.description.toLowerCase().includes(query.toLowerCase())
	);
	const productsGrid = document.getElementById("productsGrid");
	productsGrid.innerHTML = "";
	filtered.forEach((product) => {
		const productCard = createProductCard(product);
		productsGrid.appendChild(productCard);
	});
}
