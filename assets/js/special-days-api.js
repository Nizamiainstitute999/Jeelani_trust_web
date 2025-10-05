// =====================================================
// 📅 SPECIAL DAYS SCRIPT
// Fetch Hijri date + today's events from API
// =====================================================

// 1️⃣ Map Hijri month numbers → names
const ARABIC_MONTHS = {
  1: "Muharram",
  2: "Safar",
  3: "Rabiʿ al-Awwal",
  4: "Rabiʿ UL -Akhir",
  5: "Jumada al-Awwal",
  6: "Jumada al-Akhir",
  7: "Rajab",
  8: "Shaʿban",
  9: "Ramadan",
  10: "Shawwal",
  11: "Dhu al-Qaʿdah",
  12: "Dhu al-Hijjah",
};

// 2️⃣ Fetch special days API
fetch("https://nizamiamadrasa.com/api/special-days/")
  .then((res) => res.json())
  .then((data) => {
    // ----------------------------------------
    // 📌 A) Display Hijri Date (with month name)
    // ----------------------------------------
    if (data.hijri) {
      const monthName = ARABIC_MONTHS[data.hijri.month] || data.hijri.month;
      document.getElementById(
        "today-date"
      ).textContent = `${data.hijri.day} ${monthName} ${data.hijri.year} AH`;
    }

    // ----------------------------------------
    // 📌 B) Display Events (if any)
    // ----------------------------------------
    const eventsBox = document.getElementById("today-events");
    eventsBox.innerHTML = ""; // clear old data first

    if (data.todays && data.todays.length > 0) {
      // Loop through events and insert
      data.todays.forEach((event) => {
        eventsBox.insertAdjacentHTML(
          "beforeend",
          `<div class="font-quicksand">
             <span class="text-lg font-bold font-cinzel"></span> ${event}
           </div>`
        );
      });
    } else {
      // No events today → show empty state
      eventsBox.innerHTML = `
        <div class="text-gray-600 font-quicksand">
     
        </div>`;
    }
  })

  // ----------------------------------------
  // 📌 C) Handle API / Network Errors
  // ----------------------------------------
  .catch((err) => {
    document.getElementById("today-events").innerHTML = `
      <div class="p-4 rounded-xl text-red-700 shadow-inner">
      Error loading special days. Please try again later.
      </div>`;
    console.error("API Error:", err);
  });
