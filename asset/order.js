const products = [
  {
    id: 1,
    title: "Full Stack Development App Package",
    category: "creator",
    badge: "Required for Developers",
    badgeClass: "required",
    price: 30000.0,
    desc: "Includes apps like Vs Code, Node Js, Frameworks like React or Bootstrap to speed up work & Git for tracking code and GitHub to save your projects online",
    img: "💻 🌐",
  },
  {
    id: 2,
    title: "Digital Art Drawing Tablet",
    category: "explorer",
    badge: "Best Seller",
    badgeClass: "",
    price: 15000.0,
    desc: "Pressure-sensitive stylus tablet tailored for young digital creator in ui/ux & graphic design.",
    img: "🎨",
  },
  {
    id: 3,
    title: "Tech Stars Branded Hoodie",
    category: "merch",
    badge: "Official Merch",
    badgeClass: "",
    price: 14000.0,
    desc: "Ultra-soft cotton hoodie with official logo. Perfect for coding in comfort.",
    img: "👕",
  },
  {
    id: 4,
    title: "Web Dev Track Workbook",
    category: "innovator",
    badge: "Required Workguide",
    badgeClass: "required",
    price: 25000.0,
    desc: "Step-by-step HTML, CSS, JavaScript project guides and reference exercises.",
    img: "📚",
  },
  {
    id: 5,
    title: "Raspberry Pi 4 Tech Module",
    category: "innovator",
    badge: "Advanced Track",
    badgeClass: "",
    price: 18500.0,
    desc: "Mini computer board for Python programming, automation, and server projects.",
    img: "🤖⚙️",
  },
  {
    id: 6,
    title: "Holographic Sticker Pack",
    category: "merch",
    badge: "Popular",
    badgeClass: "",
    price: 4500.0,
    desc: "12 durable vinyl stickers to customize laptop lids and kit boxes.",
    img: "👾✨",
  },
  {
    id: 7, 
    title: "Intro to Python & Data Activity Book",
    category: "innovator",
    badge: "Python Starter",
    badgeClass: "required",
    price: 12000.0,
    desc: "Fun puzzles, logic games, and easy coding scripts designed to introduce Python arrays and data logic.",
    img: "📊",
    courses: ["Data Science & python"],
  },
  {
    id: 8,
    title: "Kids Smart Office Mastery Guide",
    category: "explorer",
    badge: "Course Companion",
    badgeClass: "",
    price: 8000.0,
    desc: "Fun, visual guide to mastering Word templates, Excel charts, and PowerPoint animations for the bootcamp.",
    img: "📁 📊",
    courses: ["Microsoft Packages"],   
  },
];

let cart = [];
let activeTrack = "all";
let currentSlide = 0;
// Fixed: Initialized state to accurately reflect the pre-selected items
let bundleTotal = 70000; 

/* CAROUSEL LOGIC */
function goToSlide(index) {
  currentSlide = index;
  document.getElementById("carouselSlides").style.transform =
    `translateX(-${index * 100}%)`;
  const dots = document.querySelectorAll(".carousel-dot");
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

// Auto rotate carousel every 5s
setInterval(() => {
  currentSlide = (currentSlide + 1) % 2;
  goToSlide(currentSlide);
}, 5000);


/* PRODUCT RENDERING & FILTERS */
function renderProducts() {
  const grid = document.getElementById("productGrid");
  const searchVal = document.getElementById("searchInput").value.toLowerCase();

  const filtered = products.filter((p) => {
    const matchesTrack = activeTrack === "all" || p.category === activeTrack;
    const matchesSearch =
      p.title.toLowerCase().includes(searchVal) ||
      p.desc.toLowerCase().includes(searchVal);
    return matchesTrack && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 40px;">No materials found matching your filter.</p>`;
    return;
  }

  grid.innerHTML = filtered
    .map(
      (p) => `
        <div class="product-card">
          <span class="card-badge ${p.badgeClass}">${p.badge}</span>
          <div class="card-img-wrapper">
            <span style="font-size: 4rem;">${p.img}</span>
          </div>
          <div class="card-body">
            <span class="card-track">${p.category.toUpperCase()}</span>
            <h3 class="card-title">${p.title}</h3>
            <p class="card-desc">${p.desc}</p>
            <div class="card-footer">
              <span class="price">₦${p.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              <button class="btn-primary" onclick="addToCart('${p.title.replace(/'/g, "\\'")}', ${p.price})">Add to Cart</button>
            </div>
          </div>
        </div>
      `,
    )
    .join("");
}

function filterTrack(track, btn) {
  activeTrack = track;
  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderProducts();
}

function filterProducts() {
  renderProducts();
}


/* BUNDLE BUILDER LOGIC */
function toggleBundleItem(element) {
  element.classList.toggle("selected");
  const checkbox = element.querySelector('input[type="checkbox"]');
  checkbox.checked = !checkbox.checked;

  // Recalculate bundle total properly by sanitizing numeric values
  bundleTotal = 0;
  document.querySelectorAll(".bundle-option.selected").forEach((item) => {
    const priceText = item.querySelector(".price-val").innerText;
    // Strip everything except digits and decimals
    const numericString = priceText.replace(/[^\d.-]/g, '');
    bundleTotal += parseFloat(numericString);
  });

  document.getElementById("bundlePrice").innerText =
    `₦ ${bundleTotal.toLocaleString()}`;
}

function addBundleToCart() {
  addToCart("Custom Bootcamp Starter Pack", bundleTotal);
}


/* CART & DRAWER LOGIC */
function toggleCart() {
  document.getElementById("cartDrawer").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("active");
}

function addToCart(title, price) {
  const existing = cart.find((item) => item.title === title);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ title, price, qty: 1 });
  }
  updateCartUI();
  
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("overlay").classList.add("active");
}

function updateCartUI() {
  const cartCountEl = document.getElementById("cartCount");
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCountEl.innerText = totalQty;
  cartTotalEl.innerText = `₦${totalPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p style="color: var(--text-secondary); text-align: center; margin-top: 40px;">Your cart is empty.</p>`;
    return;
  }

  cartItemsEl.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <div>
            <strong>${item.title}</strong>
            <div style="font-size: 0.85rem; color: var(--text-secondary);">₦ ${item.price.toLocaleString(undefined, {minimumFractionDigits: 2})} x ${item.qty}</div>
          </div>
          <strong>₦ ${(item.price * item.qty).toLocaleString(undefined, {minimumFractionDigits: 2})}</strong>
        </div>
      `,
    )
    .join("");
}

// Initial render
renderProducts();