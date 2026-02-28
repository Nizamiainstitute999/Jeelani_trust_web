// =====================================================
// 📅 SPECIAL DAYS SCRIPT (Synchronized with Arabic Date API)
// =====================================================

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

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Helper to find month number from name (for filtering)
function getMonthNumber(monthVal) {
  if (!isNaN(monthVal)) return Number(monthVal);

  // Attempt to find by string value in ARABIC_MONTHS
  const monthStr = String(monthVal).toLowerCase().trim();
  for (const [key, value] of Object.entries(ARABIC_MONTHS)) {
    if (value.toLowerCase() === monthStr) {
      return Number(key);
    }
    // Handle potential minor spelling diffs if necessary
    // e.g. "Jumada al-Akhirah" vs "Jumada al-Akhir"
    if (monthStr === "jumada al-akhirah" && value === "Jumada al-Akhir") return 6;
  }
  return null;
}

// 1. Fetch the authoritative Arabic Date first
fetch("https://nizamiamadrasa.com/hijri-hub/api/arabic-date/")
  .then((res) => {
    if (!res.ok) throw new Error("Failed to fetch arabic date");
    return res.json();
  })
  .then((dateData) => {
    // 2. We have the date, now fetch the events
    return fetch("https://nizamiamadrasa.com/hijri-hub/api/special-day-events/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch events");
        return res.json();
      })
      .then((eventsData) => {
        // Validation of date data
        if (!dateData || dateData.error) {
          throw new Error("Invalid arabic date data");
        }

        // Handle potentially different types (string vs number)
        const dayVal = Number(dateData.day);
        const yearVal = Number(dateData.year);
        const monthVal = dateData.month; // Could be "Rajab" (string) or 7 (number)

        const currentHijri = {
          day: dayVal,
          month: monthVal,
          year: yearVal,
          monthNum: getMonthNumber(monthVal)
        };

        // ----------------------------------------
        // ⭐ DISPLAY DATE (Synced with arabic-date-api)
        // ----------------------------------------
        let displayMonth = currentHijri.month;

        // If it's a number, map it. If it's a string, use it.
        if (!isNaN(displayMonth)) {
          displayMonth = ARABIC_MONTHS[displayMonth] || displayMonth;
        }

        if (displayMonth === "Jumada al-Akhirah") displayMonth = "Jumada al-Akhir";

        const dateEl = document.getElementById("today-date");
        if (dateEl) {
          dateEl.textContent = `${currentHijri.day} ${displayMonth} ${currentHijri.year} AH`;
        }

        // ----------------------------------------
        // 📌 EVENTS FILTERING
        // ----------------------------------------
        const eventsBox = document.getElementById("today-events");
        if (!eventsBox) return;
        eventsBox.innerHTML = "";

        let todays = [];

        // We only trust the 'all_rows' or 'events' if we filter them ourselves matching the fetched date
        const allEvents = eventsData.all_rows || eventsData.events || [];

        if (Array.isArray(allEvents) && currentHijri.monthNum) {
          todays = allEvents.filter(ev => {
            const evDay = Number(ev.day ?? ev.hijri_day);
            const evMonth = Number(ev.month ?? ev.hijri_month);
            return evDay === currentHijri.day && evMonth === currentHijri.monthNum;
          });
        }

        if (todays.length > 0) {
          todays.forEach((event) => {
            const text =
              typeof event === "string"
                ? event
                : (event.title || event.name || JSON.stringify(event));

            eventsBox.insertAdjacentHTML(
              "beforeend",
              `<div class="font-quicksand">
                 <span class="text-lg font-bold font-cinzel"></span> ${escapeHtml(text)}
               </div>`
            );
          });
        } else {
          eventsBox.innerHTML = `<div class="font-quicksand text-gray-500 text-center italic">No special events today</div>`;
        }
      });
  })
  .catch((err) => {
    console.error("Special Days API Error:", err);
    const eventsBox = document.getElementById("today-events");
    if (eventsBox) {
      eventsBox.innerHTML = `
        <div class="p-4 rounded-xl text-red-700 shadow-inner">
        Error loading special days.
        </div>`;
    }
  });
