// ==================================================
// 🌐 GLOBAL NAV HIGHLIGHT (Scroll Spy)
// Highlights nav links based on current section in view
// Works for both desktop (.nav-link) and mobile (.mobile-nav-link)
// ==================================================

document.addEventListener('DOMContentLoaded', () => {

  // ===============================
  // 🔍 1) CREATE INTERSECTION OBSERVER
  // ===============================
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Current section's ID
        const id = entry.target.getAttribute('id');

        // -------------------------------
        // 🖥️ Update Desktop Nav Links
        // -------------------------------
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active'); // reset all
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active'); // highlight current
          }
        });

        // -------------------------------
        // 📱 Update Mobile Nav Links
        // -------------------------------
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
          // Reset all styles
          link.classList.remove(
            'active', 'bg-white', 'bg-opacity-5',
            'text-gold', 'border-l-4', 'border-gold'
          );

          // Highlight current active link
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add(
              'active', 'bg-white', 'bg-opacity-5',
              'text-gold', 'border-l-4', 'border-gold'
            );
          }
        });
      }
    });
  }, {
    threshold: 0.5,              // Section must be 50% visible
    rootMargin: '0px 0px -50% 0px' // Trigger earlier/later
  });

  // ===============================
  // 📌 2) OBSERVE ALL SECTIONS
  // ===============================
  document.querySelectorAll('section').forEach(section => observer.observe(section));

  // ===============================
  // 🏠 3) DEFAULT ACTIVE LINK ON LOAD
  // ===============================
  const navHome = document.querySelector('.nav-link[href="#home"]');
  const mobileNavHome = document.querySelector('.mobile-nav-link[href="#home"]');

  navHome?.classList.add('active');
  mobileNavHome?.classList.add(
    'active', 'bg-white', 'bg-opacity-5',
    'text-gold', 'border-l-4', 'border-gold'
  );
});
// End of file: assets/js/scrollspy.js