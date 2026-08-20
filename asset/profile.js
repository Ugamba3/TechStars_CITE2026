function initPageNavigation() {
  const navItems = document.querySelectorAll(".nav-item[data-page]");
  const pages = document.querySelectorAll(".page");

  function showPage(target) {
    // Toggle active page
    pages.forEach((p) =>
      p.classList.toggle("active", p.id === "page-" + target),
    );

    // Toggle active nav item
    navItems.forEach((n) =>
      n.classList.toggle("active", n.dataset.page === target),
    );

    // Scroll main content to top
    document.querySelector(".main").scrollTo({ top: 0, behavior: "instant" });
  }

  // Handle all [data-page] clicks (sidebar + any inline links)
  document.querySelectorAll("[data-page]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      showPage(el.dataset.page);
    });
  });

  // Expose globally so search / other components can jump to pages
  window.goToPage = showPage;
}

// Run on load
document.addEventListener("DOMContentLoaded", initPageNavigation);

/* STUDENT LIST EXPORT (demo) */
const exportBtn = document.querySelector("#page-students .btn-outline");
if (exportBtn) {
  exportBtn.addEventListener("click", () => {
    alert("Student list export started...");
  });
}
