// ===============================
// 🎞️ AOS (Animate On Scroll) INIT
// ===============================

// Wait until the HTML is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  
  // Initialize AOS library
  AOS.init({
    // Optional settings (you can tweak as needed)
    duration: 800,   // Animation duration in ms
    once: true,      // Animation happens only once (no repeat)
    easing: "ease-in-out", // Animation easing
    offset: 100      // Trigger point from top
  });

});
// End of file: assets/js/main.js

// ===============================
// 📱 MOBILE MENU TOGGLE
// ===============================

document.addEventListener('DOMContentLoaded', () => {
  // ===============================
  // 🔎 1) GET ELEMENTS
  // ===============================
  const menuToggle = document.getElementById('menu-toggle'); // Button (open)
  const menuClose = document.getElementById('menu-close');   // Button (close)
  const mobileMenu = document.getElementById('mobile-menu'); // Mobile nav container

  // ===============================
  // 🚪 2) MENU OPEN FUNCTION
  // ===============================
  function openMenu() {
    // Remove "hidden" state classes
    mobileMenu.classList.remove('translate-x-full', 'opacity-0', 'pointer-events-none');
    // Add "visible" state classes
    mobileMenu.classList.add('translate-x-0', 'opacity-100', 'pointer-events-auto');
  }

  // ===============================
  // 🚪 3) MENU CLOSE FUNCTION
  // ===============================
  function closeMenu() {
    // Remove "visible" state classes
    mobileMenu.classList.remove('translate-x-0', 'opacity-100', 'pointer-events-auto');
    // Add "hidden" state classes
    mobileMenu.classList.add('translate-x-full', 'opacity-0', 'pointer-events-none');
  }

  // ===============================
  // 🖱️ 4) ATTACH EVENTS
  // ===============================
  menuToggle?.addEventListener('click', openMenu);  // Open menu
  menuClose?.addEventListener('click', closeMenu);  // Close menu

  // Auto close menu when clicking any link inside
  document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
});
