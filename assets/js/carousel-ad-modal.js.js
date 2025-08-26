// ==================================================
// 🎞️ CAROUSEL + SPECIAL MODAL (Homepage)
// ==================================================
(() => {
  window.addEventListener("load", () => {
    const slidesContainer = document.getElementById("carouselSlides");
    if (!slidesContainer) return; // Guard if not on this page

    let currentSlide = 0;
    const totalSlides = slidesContainer.children.length;

    function updateSlide() {
      slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlide();
    }

    function closeSpecialPhotoModal() {
      const modal = document.getElementById("specialPhotoModal");
      if (modal) modal.style.display = "none";
      localStorage.setItem("specialShownTime", String(Date.now()));
    }

    // autoplay slider
    setInterval(nextSlide, 5000);

    // auto-close modal after 60s
    setTimeout(closeSpecialPhotoModal, 60000);

    // expose close handler for button onclick
    window.closeSpecialPhotoModal = closeSpecialPhotoModal;
  });
})();