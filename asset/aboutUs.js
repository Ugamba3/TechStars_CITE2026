// fading start
const observerOptions = {
  threshold: 0.2, // 20% of the element must be visible before it fades in
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");

      // Trigger number count-up if this is a stat card
      const statNum = entry.target.querySelector(".stat-number");
      if (statNum && !statNum.classList.contains("counted")) {
        animateCounter(statNum);
        statNum.classList.add("counted");
      }

      // Optional: observer.unobserve(entry.target); // Check this if you only want it to fade in ONCE
    } else {
      entry.target.classList.remove("active"); // Remove this if you don't want it to fade back out
    }
  });
}, observerOptions);

// Target all elements with the .reveal class
document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

// Also observe stat cards for counting
document.querySelectorAll(".stat-card").forEach((el) => observer.observe(el));

// fading end

/* ===== STAT COUNTER ANIMATION ===== */
function animateCounter(element) {
  // Get the final text, e.g. "850+", "1,200+", "94%", "5 Tracks"
  const finalText = element.textContent.trim();

  // Extract number (handles commas) and suffix
  const match = finalText.match(/^([0-9,]+)(.*)$/);
  if (!match) return;

  const targetNum = parseInt(match[1].replace(/,/g, ""), 10);
  const suffix = match[2]; // e.g. "+", "%", " Tracks"
  const duration = 2000; // 2 seconds
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic for smooth deceleration
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.floor(easeOut * targetNum);

    // Format with commas for thousands
    const formatted = currentVal.toLocaleString();
    element.textContent = formatted + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      // Ensure final value is exact
      element.textContent = match[1] + suffix;
    }
  }

  requestAnimationFrame(update);
} 

/* ============================================================
   PRESERVED: Hero Slideshow (exact original logic)
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;
  const slideInterval = 5000; // Change image every 5 seconds (5000ms)

  function nextSlide() {
    // Remove active class from current slide
    slides[currentSlide].classList.remove("active");

    // Calculate next slide index (loops back to 0 at the end)
    currentSlide = (currentSlide + 1) % slides.length;

    // Add active class to new slide
    slides[currentSlide].classList.add("active");
  }

  // Start automatic slideshow loop
  setInterval(nextSlide, slideInterval);
});

/* ============================================================
   NEW: Gallery Filter + Lightbox
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  // Filter functionality
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      galleryItems.forEach((item) => {
        if (filter === "all" || item.dataset.type === filter) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });

  // Lightbox functionality
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxVideo = document.getElementById("lightbox-video");
  const lightboxCaption = document.getElementById("lightbox-caption");
  let currentIndex = 0;
  let visibleItems = [];

  function updateVisibleItems() {
    visibleItems = Array.from(galleryItems).filter(
      (item) => !item.classList.contains("hidden"),
    );
  }

  function openLightbox(index) {
    updateVisibleItems();
    currentIndex = index;
    const item = visibleItems[index];
    const caption = item.querySelector(".gallery-overlay span").textContent;
    lightboxCaption.textContent = caption;

    const img = item.querySelector("img");
    const video = item.querySelector("video");

    if (video) {
      lightboxImg.style.display = "none";
      lightboxVideo.style.display = "block";
      const source = video.querySelector("source");
      lightboxVideo.querySelector("source").src = source.src;
      lightboxVideo.load();
      lightboxVideo.play();
    } else {
      lightboxVideo.style.display = "none";
      lightboxImg.style.display = "block";
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    }

    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    lightboxVideo.pause();
    document.body.style.overflow = "";
  }

  function nextLightbox() {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    openLightbox(currentIndex);
  }

  function prevLightbox() {
    currentIndex =
      (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    openLightbox(currentIndex);
  }

  // Click on gallery items (not play buttons)
  galleryItems.forEach((item, index) => {
    item.addEventListener("click", (e) => {
      if (e.target.closest(".play-btn")) return;
      updateVisibleItems();
      const visibleIndex = visibleItems.indexOf(item);
      openLightbox(visibleIndex);
    });
  });

  // Play buttons for videos
  document.querySelectorAll(".play-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const item = btn.closest(".gallery-item");
      updateVisibleItems();
      const visibleIndex = visibleItems.indexOf(item);
      openLightbox(visibleIndex);
    });
  });

  // Lightbox controls
  document
    .querySelector(".lightbox-close")
    .addEventListener("click", closeLightbox);
  document
    .querySelector(".lightbox-next")
    .addEventListener("click", nextLightbox);
  document
    .querySelector(".lightbox-prev")
    .addEventListener("click", prevLightbox);

  // Close on background click
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") nextLightbox();
    if (e.key === "ArrowLeft") prevLightbox();
  });
});

/* ============================================================
   NEW: Testimonials Slider
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".testimonial-track");
  const cards = document.querySelectorAll(".testimonial-card");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".testimonial-prev");
  const nextBtn = document.querySelector(".testimonial-next");
  let currentSlide = 0;
  let slidesPerView = getSlidesPerView();

  function getSlidesPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function updateSlider() {
    const cardWidth = cards[0].offsetWidth + 24; // including gap
    track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentSlide);
    });
  }

  function nextTestimonial() {
    const maxSlide = cards.length - slidesPerView;
    currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
    updateSlider();
  }

  function prevTestimonial() {
    const maxSlide = cards.length - slidesPerView;
    currentSlide = currentSlide <= 0 ? maxSlide : currentSlide - 1;
    updateSlider();
  }

  nextBtn.addEventListener("click", nextTestimonial);
  prevBtn.addEventListener("click", prevTestimonial);

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      currentSlide = i;
      updateSlider();
    });
  });

  window.addEventListener("resize", () => {
    slidesPerView = getSlidesPerView();
    currentSlide = 0;
    updateSlider();
  });

  // Auto-play testimonials
  setInterval(nextTestimonial, 6000);
});

/* ============================================================
   NEW: Newsletter Form
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newsletter-form");
  const emailInput = document.getElementById("newsletter-email");
  const message = document.getElementById("form-message");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      const consent = form.querySelector('input[type="checkbox"]').checked;

      if (!email) {
        showMessage("Please enter your email address.", "error");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showMessage("Please enter a valid email address.", "error");
        return;
      }

      if (!consent) {
        showMessage("Please agree to receive newsletters.", "error");
        return;
      }

      // Simulate success
      showMessage(
        "\u2705 Welcome aboard! Check your inbox for confirmation.",
        "success",
      );
      emailInput.value = "";
      form.querySelector('input[type="checkbox"]').checked = false;
    });
  }

  function showMessage(text, type) {
    message.textContent = text;
    message.className = "form-message " + type;
    setTimeout(() => {
      message.textContent = "";
      message.className = "form-message";
    }, 5000);
  }
});

/* ============================================================
   NEW: Scroll Reveal Animations
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(".stat-card, .why-card, .gallery-item, .testimonial-card")
    .forEach((el) => {
      el.classList.add("reveal-on-scroll");
      observer.observe(el);
    });
});


document.addEventListener("DOMContentLoaded", () => {
  // Initialize EmailJS with your Public Key
  emailjs.init("snSskeThbsB8mqmrv"); // Replace with your actual public key

  const form = document.getElementById("newsletter-form");
  const emailInput = document.getElementById("newsletter-email");
  const message = document.getElementById("form-message");
  const submitBtn = document.getElementById("submit-btn");
  const btnText = submitBtn.querySelector(".btn-text");
  const btnIcon = submitBtn.querySelector("i");

  function showMessage(text, type) {
    message.textContent = text;
    message.className = "form-message " + type;
    setTimeout(() => {
      message.textContent = "";
      message.className = "form-message";
    }, 6000);
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    if (isLoading) {
      btnText.textContent = "Sending...";
      btnIcon.className = "fa-solid fa-spinner fa-spin";
    } else {
      btnText.textContent = "Send Hi";
      btnIcon.className = "fa-solid fa-paper-plane";
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const consent = document.getElementById("consent-check").checked;

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }
    if (!consent) {
      showMessage("Please agree to receive the message.", "error");
      return;
    }

    setLoading(true);

    // Send email via EmailJS
    // The template should have: {{to_email}}, {{from_name}}, {{message}}
    emailjs
      .send("service_qsy63nh", "template_y7mcbty", {
        to_email: email, // The email entered in the form
        from_name: "TechStars", // Your brand name
        message: "Hi! 👋 Welcome to TechStars. Thanks for connecting with us!", // The "hi" message
        reply_to: "noreply@techstars.com", // Optional
      })
      .then(() => {
        showMessage("✅ Hi sent successfully! Check your inbox.", "success");
        emailInput.value = "";
        document.getElementById("consent-check").checked = false;
      })
      .catch((err) => {
        console.error("EmailJS error:", err);
        showMessage("❌ Something went wrong. Please try again.", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  });
});