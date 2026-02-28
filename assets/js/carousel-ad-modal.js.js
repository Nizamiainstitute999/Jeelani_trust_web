// ==================================================
// 🎞️ CAROUSEL + SPECIAL MODAL (Homepage)
// Fetches images from /api/special-day-images/ API
// ==================================================
(() => {
  // API endpoint for special day images
  const API_URL = "https://nizamiamadrasa.com/hijri-hub/api/special-day-images/";

  let currentSlide = 0;
  let totalSlides = 0;
  let autoplayInterval = null;

  // Preload a single image and return a promise
  function preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  // Show the modal
  function showModal() {
    const modal = document.getElementById("specialPhotoModal");
    if (modal) modal.style.display = "flex";
  }

  // Fetch images from API and populate carousel
  async function loadCarouselImages() {
    const slidesContainer = document.getElementById("carouselSlides");
    if (!slidesContainer) return;

    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      // Check if we have images in the response
      const images = data.images || (Array.isArray(data) ? data : []);

      if (images.length > 0) {
        // Preload all images in parallel for fast display
        const imageUrls = images.map(img => img.image_url || img.url || img.image || img);

        await Promise.all(imageUrls.map(url => preloadImage(url)));

        // Clear container and add images
        slidesContainer.innerHTML = "";

        // Add images to carousel
        images.forEach((image, index) => {
          const img = document.createElement("img");
          img.src = image.image_url || image.url || image.image || image;
          img.alt = image.title || image.alt || `Special Day Image ${index + 1}`;
          img.width = 768;
          img.height = 960;
          img.className = "w-full h-full object-contain flex-shrink-0";
          slidesContainer.appendChild(img);
        });

        totalSlides = images.length;

        // Show modal only after images are ready
        showModal();

        // Initialize carousel autoplay
        if (totalSlides > 1) {
          startAutoplay();
        }

        // Auto-close modal after 60s
        setTimeout(closeSpecialPhotoModal, 60000);
      }
      // If no images, modal stays hidden

    } catch (error) {
      console.error("Error loading carousel images:", error);
      // On error, modal stays hidden
    }
  }

  function updateSlide() {
    const slidesContainer = document.getElementById("carouselSlides");
    if (slidesContainer) {
      slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlide();
  }

  function startAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function closeSpecialPhotoModal() {
    const modal = document.getElementById("specialPhotoModal");
    if (modal) modal.style.display = "none";
    localStorage.setItem("specialShownTime", String(Date.now()));
    if (autoplayInterval) clearInterval(autoplayInterval);
  }

  window.addEventListener("load", () => {
    // Load images from API and show modal when ready
    loadCarouselImages();

    // expose close handler for button onclick
    window.closeSpecialPhotoModal = closeSpecialPhotoModal;
  });
})();
