// ============ Mouse Tracking 3D Bubble Animation ============

class MouseBubble {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.vx = (Math.random() - 0.5) * 6;
		this.vy = (Math.random() - 0.5) * 6 - 2;
		this.radius = Math.random() * 8 + 4;
		this.maxRadius = this.radius;
		this.life = 1;
		this.friction = 0.95;
		this.gravity = 0.15;
		this.opacity = 1;
		this.rotation = Math.random() * Math.PI * 2;
		this.rotationSpeed = (Math.random() - 0.5) * 0.1;
	}

	update() {
		this.x += this.vx;
		this.y += this.vy;
		this.vx *= this.friction;
		this.vy += this.gravity;
		this.vy *= this.friction;
		this.life -= 0.02;
		this.opacity = Math.max(0, this.life);
		this.radius = this.maxRadius * this.opacity;
		this.rotation += this.rotationSpeed;

		return this.life > 0;
	}

	draw(ctx) {
		ctx.save();
		ctx.globalAlpha = this.opacity;

		// Outer glow
		const gradient = ctx.createRadialGradient(
			this.x,
			this.y,
			0,
			this.x,
			this.y,
			this.radius * 1.5
		);
		gradient.addColorStop(0, "rgba(255, 107, 107, 0.6)");
		gradient.addColorStop(1, "rgba(220, 20, 60, 0)");
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius * 1.5, 0, Math.PI * 2);
		ctx.fill();

		// Main bubble
		const bubbleGradient = ctx.createRadialGradient(
			this.x - this.radius * 0.3,
			this.y - this.radius * 0.3,
			0,
			this.x,
			this.y,
			this.radius
		);
		bubbleGradient.addColorStop(0, "rgba(255, 107, 107, 0.8)");
		bubbleGradient.addColorStop(0.5, "rgba(220, 20, 60, 0.6)");
		bubbleGradient.addColorStop(1, "rgba(139, 0, 0, 0.4)");
		ctx.fillStyle = bubbleGradient;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();

		// Highlight
		ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 * this.opacity})`;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(
			this.x - this.radius * 0.3,
			this.y - this.radius * 0.3,
			this.radius * 0.6,
			0,
			Math.PI * 2
		);
		ctx.stroke();

		// 3D ring effect
		ctx.strokeStyle = `rgba(255, 107, 107, ${0.5 * this.opacity})`;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius * 0.8, 0, Math.PI * 2);
		ctx.stroke();

		ctx.restore();
	}
}

class MouseTracker {
	constructor() {
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.bubbles = [];
		this.mouseX = window.innerWidth / 2;
		this.mouseY = window.innerHeight / 2;
		this.isMoving = false;
		this.animationId = null;

		this.setupCanvas();
		this.bindEvents();
		this.startAnimation();
	}

	setupCanvas() {
		this.canvas.id = "mouseTrackerCanvas";
		this.canvas.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			pointer-events: none;
			z-index: 999;
		`;
		this.resize();
		document.body.appendChild(this.canvas);

		window.addEventListener("resize", () => this.resize());
	}

	resize() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	bindEvents() {
		document.addEventListener("mousemove", (e) => {
			this.mouseX = e.clientX;
			this.mouseY = e.clientY;
			this.isMoving = true;

			// Create bubbles on mouse move
			for (let i = 0; i < 2; i++) {
				this.createBubble();
			}

			// Stop creating bubbles after mouse stops
			clearTimeout(this.moveTimeout);
			this.moveTimeout = setTimeout(() => {
				this.isMoving = false;
			}, 100);
		});

		document.addEventListener("mouseout", () => {
			this.isMoving = false;
		});

		document.addEventListener("click", (e) => {
			this.createClickBubbles(e.clientX, e.clientY);
		});
	}

	createBubble() {
		const offsetX = (Math.random() - 0.5) * 40;
		const offsetY = (Math.random() - 0.5) * 40;
		this.bubbles.push(
			new MouseBubble(this.mouseX + offsetX, this.mouseY + offsetY)
		);
	}

	createClickBubbles(x, y) {
		for (let i = 0; i < 8; i++) {
			const angle = (i / 8) * Math.PI * 2;
			const distance = 20;
			const bubbleX = x + Math.cos(angle) * distance;
			const bubbleY = y + Math.sin(angle) * distance;
			const bubble = new MouseBubble(bubbleX, bubbleY);
			bubble.vx = Math.cos(angle) * 5;
			bubble.vy = Math.sin(angle) * 5;
			bubble.maxRadius = 12;
			this.bubbles.push(bubble);
		}
	}

	startAnimation() {
		const animate = () => {
			// Clear canvas with semi-transparent background for trail effect
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

			// Update and draw bubbles
			this.bubbles = this.bubbles.filter((bubble) => {
				bubble.update();
				bubble.draw(this.ctx);
				return bubble.life > 0;
			});

			// Keep animation running
			this.animationId = requestAnimationFrame(animate);
		};

		animate();
	}

	destroy() {
		cancelAnimationFrame(this.animationId);
		if (this.canvas.parentNode) {
			this.canvas.parentNode.removeChild(this.canvas);
		}
	}
}

// Initialize mouse tracker when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", () => {
		new MouseTracker();
	});
} else {
	new MouseTracker();
}
