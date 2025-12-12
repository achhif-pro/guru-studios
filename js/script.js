// ============ Global Variables ============
let cart = [];
let currentFilter = "all";
let selectedProduct = null;
// Coupon and discount state
let cartDiscountPercent = 0;
let appliedCoupon = null;
// Site-wide discount applied to displayed prices (percentage)
const siteDiscountPercent = 30; // 30% off on all products site-wide

// ============ Initialize Application ============
document.addEventListener("DOMContentLoaded", () => {
	renderProducts("all");
	setupEventListeners();
	loadCartFromStorage();
	// Show discount popup if not seen
	const seen = localStorage.getItem("seenDiscountPopup");
	const discountModal = document.getElementById("discountModal");
	if (!seen && discountModal) {
		discountModal.style.display = "block";
	}
});

// ============ Setup Event Listeners ============
function setupEventListeners() {
	// Search functionality with suggestions
	const searchInput = document.getElementById("searchInput");
	const searchBtn = document.querySelector(".search-btn");
	const searchSuggestions = document.getElementById("searchSuggestions");

	if (searchInput && searchBtn) {
		searchBtn.addEventListener("click", performSearch);
		searchInput.addEventListener("keypress", (e) => {
			if (e.key === "Enter") {
				performSearch();
				searchSuggestions.innerHTML = "";
			}
		});

		// Show search suggestions
		searchInput.addEventListener("input", (e) => {
			const query = e.target.value.trim();
			if (query.length > 0) {
				showSearchSuggestions(query);
			} else {
				searchSuggestions.innerHTML = "";
			}
		});

		// Hide suggestions when clicking outside
		document.addEventListener("click", (e) => {
			if (
				!searchInput.contains(e.target) &&
				!searchSuggestions.contains(e.target)
			) {
				searchSuggestions.innerHTML = "";
			}
		});
	}

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

	// Modal "Add to Cart" with Terms agreement
	const modalAddBtn = document.getElementById("modalAddBtn");
	if (modalAddBtn) {
		modalAddBtn.addEventListener("click", () => {
			const agree = document.getElementById("agreeTerms");
			if (agree && !agree.checked) {
				showNotification(
					"Please agree to the Terms & Conditions before adding to cart."
				);
				return;
			}
			addToCart();
		});
	}

	// Checkout handler
	const checkoutBtn = document.getElementById("checkoutBtn");
	const checkoutModal = document.getElementById("checkoutModal");
	const checkoutClose = document.getElementById("checkoutClose");
	if (checkoutBtn && checkoutModal) {
		checkoutBtn.addEventListener("click", () => {
			checkoutModal.style.display = "block";
		});
	}
	if (checkoutClose) {
		checkoutClose.addEventListener("click", () => {
			checkoutModal.style.display = "none";
		});
	}

	// Connect quick contact buttons in header/contact to checkout links
	const googleFormBtn = document.getElementById("googleFormBtn");
	const discordBtn = document.getElementById("discordBtn");
	const checkoutGoogleForm = document.getElementById("checkoutGoogleForm");
	const checkoutDiscord = document.getElementById("checkoutDiscord");

	// Placeholder: these open '#' by default. You can replace href values with real links.
	[googleFormBtn, checkoutGoogleForm].forEach((el) => {
		if (el)
			el.addEventListener("click", (e) => {
				e.preventDefault();
				showNotification(
					"Open the Google Form link (replace placeholder with real URL)."
				);
			});
	});
	[discordBtn, checkoutDiscord].forEach((el) => {
		if (el)
			el.addEventListener("click", (e) => {
				e.preventDefault();
				showNotification(
					"Open the Discord ticket link (replace placeholder with real URL)."
				);
			});
	});

	// Coupon apply handler (in cart sidebar)
	const applyCouponBtn = document.getElementById("applyCouponBtn");
	const couponInput = document.getElementById("couponInput");
	if (applyCouponBtn && couponInput) {
		applyCouponBtn.addEventListener("click", (e) => {
			e.preventDefault();
			applyCoupon(couponInput.value.trim());
		});
	}

	const clearCouponBtn = document.getElementById("clearCouponBtn");
	if (clearCouponBtn) {
		clearCouponBtn.addEventListener("click", (e) => {
			e.preventDefault();
			appliedCoupon = null;
			cartDiscountPercent = 0;
			localStorage.removeItem("appliedCoupon");
			localStorage.removeItem("cartDiscountPercent");
			const couponDiv = document.getElementById("couponMessage");
			if (couponDiv) {
				couponDiv.classList.remove("success", "error");
				couponDiv.textContent = "";
			}
			if (couponInput) couponInput.value = "";
			updateCartUI();
			showNotification("Coupon removed", "info");
		});
	}

	// Discount popup handlers
	const discountModal = document.getElementById("discountModal");
	const discountClose = document.getElementById("discountClose");
	const claimCouponBtn = document.getElementById("claimCouponBtn");
	const navDiscountBanner = document.getElementById("navDiscountBanner");
	if (discountClose) {
		discountClose.addEventListener("click", () => {
			if (discountModal) {
				discountModal.style.display = "none";
				localStorage.setItem("seenDiscountPopup", "true");
			}
		});
	}
	if (navDiscountBanner && discountModal) {
		navDiscountBanner.addEventListener("click", (e) => {
			e.preventDefault();
			discountModal.style.display = "block";
		});
	}
	if (claimCouponBtn) {
		claimCouponBtn.addEventListener("click", () => {
			if (couponInput) couponInput.value = "EKBAL30";
			applyCoupon("EKBAL30");
			localStorage.setItem("seenDiscountPopup", "true");
			if (discountModal) discountModal.style.display = "none";
		});
	}
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
            <img src="${product.image}" alt="${
		product.name
	}" class="product-img" />
        </div>
        <div class="product-info">
            <div class="product-category">${categories[product.category]}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
				<div class="product-footer">
					<div>
						<div class="product-original-price">$${product.price.toFixed(2)}</div>
						<div class="product-discount-price">$${(
							product.price *
							(1 - siteDiscountPercent / 100)
						).toFixed(2)}</div>
					</div>
                <button class="product-btn">🛒 Buy Now</button>
            </div>
        </div>
    `;

	card.querySelector(".product-btn").addEventListener("click", (e) => {
		e.stopPropagation();
		selectedProduct = product;
		openModal(product);
	});

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
	// Modal shows original and discounted price
	const modalOriginal = document.getElementById("modalOriginalPrice");
	const modalPrice = document.getElementById("modalPrice");
	if (modalOriginal)
		modalOriginal.textContent = `$${product.price.toFixed(2)}`;
	if (modalPrice)
		modalPrice.textContent = `$${(
			product.price *
			(1 - siteDiscountPercent / 100)
		).toFixed(2)}`;
	const modalImage = document.getElementById("modalImage");
	modalImage.src = product.image;
	modalImage.alt = product.name;

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
		const discountedPrice = +(
			selectedProduct.price *
			(1 - siteDiscountPercent / 100)
		).toFixed(2);
		cart.push({
			...selectedProduct,
			originalPrice: selectedProduct.price,
			price: discountedPrice,
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
	let subtotal = 0;
	let originalSubtotal = 0;
	cart.forEach((item) => {
		const itemTotal = item.price * item.quantity;
		subtotal += itemTotal;
		const itemOriginalTotal =
			(item.originalPrice || item.price) * item.quantity;
		originalSubtotal += itemOriginalTotal;

		const cartItem = document.createElement("div");
		cartItem.className = "cart-item";
		cartItem.innerHTML = `
            <div class="cart-item-name">${item.name}</div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="color: var(--text-light);">Qty: <strong>${
					item.quantity
				}</strong></span>
				<div style="text-align:right;">
					<div class="cart-item-original">$${(item.originalPrice || item.price).toFixed(
						2
					)}</div>
					<div class="cart-item-discount">$${itemTotal.toFixed(2)}</div>
				</div>
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

	// Apply discount if any
	let finalTotal = subtotal;
	const couponDiv = document.getElementById("couponMessage");
	if (cartDiscountPercent > 0 && appliedCoupon) {
		const discountAmount = (subtotal * cartDiscountPercent) / 100;
		finalTotal = subtotal - discountAmount;
		// Show a breakdown: original -> site-discounted -> coupon -> final
		cartTotal.innerHTML = `
			<div style="font-size:0.9rem;color:var(--text-light);">Original: <s>$${originalSubtotal.toFixed(
				2
			)}</s></div>
			<div style="font-size:0.95rem;color:var(--text-light);">Subtotal (site discount applied): $${subtotal.toFixed(
				2
			)}</div>
			<div style="font-size:0.95rem;color:var(--accent-gold);">Coupon ${appliedCoupon} applied — ${cartDiscountPercent}% off</div>
			<div style="font-weight:700;font-size:1.05rem;margin-top:6px;">Total: $${finalTotal.toFixed(
				2
			)}</div>
		`;
		if (couponDiv) {
			couponDiv.classList.add("success");
			couponDiv.textContent = `Coupon ${appliedCoupon} applied — ${cartDiscountPercent}% off!`;
		}
	} else {
		// No coupon applied — show subtotal and possibly the original price if site discount exists
		cartTotal.textContent = `$${subtotal.toFixed(2)}`;
		if (originalSubtotal && originalSubtotal > subtotal) {
			cartTotal.textContent += ` (was $${originalSubtotal.toFixed(2)})`;
		}
		if (couponDiv) {
			couponDiv.classList.remove("success");
			couponDiv.textContent = ``;
		}
	}
	// If original total differs, show original struck-through (e.g., site discount applied site-wide)
	if (originalSubtotal && originalSubtotal > subtotal) {
		cartTotal.textContent += ` (was $${originalSubtotal.toFixed(2)})`;
	}
	cartCount.textContent = cart.length;
}

// Coupon function
function applyCoupon(code) {
	const normalized = (code || "").toString().trim().toUpperCase();
	const couponDiv = document.getElementById("couponMessage");
	if (!normalized) {
		if (couponDiv) {
			couponDiv.classList.add("error");
			couponDiv.textContent = "Please enter a coupon code";
		}
		showNotification("Please enter a coupon code", "error");
		return false;
	}
	if (normalized === "EKBAL30") {
		appliedCoupon = normalized;
		if (siteDiscountPercent === 30) {
			cartDiscountPercent = 0; // no extra discount, already applied site-wide
			if (couponDiv) {
				couponDiv.classList.add("success");
				couponDiv.textContent = `Coupon ${appliedCoupon} recognized — 30% site-wide discount is already applied.`;
			}
			showNotification(
				"Coupon recognized — site discount already applied",
				"info"
			);
			saveCartToStorage();
			updateCartUI();
			return true;
		} else {
			cartDiscountPercent = 30;
			if (couponDiv) {
				couponDiv.classList.add("success");
				couponDiv.textContent = `Coupon ${appliedCoupon} applied — 30% off!`;
			}
			showNotification("Coupon applied — 30% off", "success");
			saveCartToStorage();
			updateCartUI();
			return true;
		}
	}
	if (normalized === "DISCOUNT30" || normalized === "EXTRA30") {
		cartDiscountPercent = 30;
		appliedCoupon = normalized;
		localStorage.setItem("appliedCoupon", appliedCoupon);
		localStorage.setItem(
			"cartDiscountPercent",
			String(cartDiscountPercent)
		);
		if (couponDiv) {
			couponDiv.classList.add("success");
			couponDiv.textContent = `Coupon ${appliedCoupon} applied — ${cartDiscountPercent}% off!`;
		}
		showNotification(
			`Coupon applied — ${cartDiscountPercent}% off`,
			"success"
		);
		updateCartUI();
		return true;
	}
	if (couponDiv) {
		couponDiv.classList.add("error");
		couponDiv.textContent = "Invalid coupon code";
	}
	showNotification("Invalid coupon", "error");
	return false;
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
	if (appliedCoupon) {
		localStorage.setItem("appliedCoupon", appliedCoupon);
		localStorage.setItem(
			"cartDiscountPercent",
			String(cartDiscountPercent)
		);
	} else {
		localStorage.removeItem("appliedCoupon");
		localStorage.removeItem("cartDiscountPercent");
	}
}

function loadCartFromStorage() {
	const storedCart = localStorage.getItem("cart");
	if (storedCart) {
		cart = JSON.parse(storedCart);
		updateCartUI();
	}
	// Load coupon state if any
	const storedCoupon = localStorage.getItem("appliedCoupon");
	if (storedCoupon) {
		appliedCoupon = storedCoupon;
		cartDiscountPercent =
			Number(localStorage.getItem("cartDiscountPercent")) || 0;
		// Refresh UI to display discount
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

// Generic notification (info | success | error)
function showNotification(message, type = "info") {
	const notification = document.createElement("div");
	let background =
		"linear-gradient(135deg, var(--primary-red), var(--light-red))";
	if (type === "error")
		background = "linear-gradient(135deg, #ff4d4f, #ff7875)";
	if (type === "success")
		background = "linear-gradient(135deg, #28a745, #9be7a0)";

	notification.style.cssText = `
		position: fixed;
		top: 80px;
		right: 20px;
		background: ${background};
		color: white;
		padding: 1rem 1.5rem;
		border-radius: 5px;
		box-shadow: 0 5px 20px rgba(0,0,0,0.2);
		z-index: 2000;
		animation: slideInRight 0.3s ease;
		font-weight: 600;
	`;
	notification.textContent = message;
	document.body.appendChild(notification);

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
	const filtered = products.filter(
		(p) => p.price * (1 - siteDiscountPercent / 100) <= maxPrice
	);
	const productsGrid = document.getElementById("productsGrid");
	productsGrid.innerHTML = "";
	filtered.forEach((product) => {
		const productCard = createProductCard(product);
		productsGrid.appendChild(productCard);
	});
}

// ============ Search Functionality ============
function performSearch() {
	const searchInput = document.getElementById("searchInput");
	const query = searchInput.value.trim();
	if (query === "") {
		renderProducts("all");
		return;
	}
	searchProducts(query);
}

function searchProducts(query) {
	const filtered = products.filter(
		(p) =>
			p.name.toLowerCase().includes(query.toLowerCase()) ||
			p.description.toLowerCase().includes(query.toLowerCase())
	);
	const productsGrid = document.getElementById("productsGrid");
	productsGrid.innerHTML = "";
	if (filtered.length === 0) {
		productsGrid.innerHTML =
			'<p style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-light);">No products found matching your search.</p>';
		return;
	}
	filtered.forEach((product) => {
		const productCard = createProductCard(product);
		productsGrid.appendChild(productCard);
	});
}

// ============ Search Suggestions ============
function showSearchSuggestions(query) {
	const suggestions = products.filter(
		(p) =>
			p.name.toLowerCase().includes(query.toLowerCase()) ||
			p.description.toLowerCase().includes(query.toLowerCase())
	);

	const searchSuggestions = document.getElementById("searchSuggestions");
	searchSuggestions.innerHTML = "";

	if (suggestions.length === 0) {
		return;
	}

	const suggestionsList = document.createElement("ul");
	suggestionsList.className = "suggestions-list";

	suggestions.slice(0, 8).forEach((product) => {
		const suggestionItem = document.createElement("li");
		suggestionItem.className = "suggestion-item";
		suggestionItem.innerHTML = `
			<i class="fas fa-search"></i>
			<span>${product.name}</span>
		`;
		suggestionItem.addEventListener("click", () => {
			document.getElementById("searchInput").value = product.name;
			searchSuggestions.innerHTML = "";
			searchProducts(product.name);
		});
		suggestionsList.appendChild(suggestionItem);
	});

	searchSuggestions.appendChild(suggestionsList);
}
