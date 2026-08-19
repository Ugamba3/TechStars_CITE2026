function team(a, b, c){
  const instructor = document.querySelectorAll(".instructor");
  const selectedLead = document.querySelector(`.${a}`);

  instructor.forEach((i) => {
    i.classList.remove("active");
    selectedLead.classList.add("active");
  });

  const team = document.querySelectorAll(".instructors");
  const selectedTeam = document.querySelector(`.${b}`);

  team.forEach((i) => {
    i.classList.remove("active");
    selectedTeam.classList.add("active");
  });
  
  const btns = document.querySelectorAll('.team-buttons button');
  const btn = document.querySelector(`.${c}`);

  btns.forEach((i) => {
    i.classList.remove("active");
    btn.classList.add("active");
  });
}

// Carousel

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