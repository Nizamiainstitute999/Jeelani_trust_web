// =====================================================
// 📅 SPECIAL DAYS SCRIPT (final working version + auto Hijri year)
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

fetch("http://nizamiamadrasa.com/api/special-day-events/")
  .then((res) => {
    if (!res.ok) throw new Error("Network error");
    return res.json();
  })
  .then((data) => {
    console.log("[special-day-events] full response:", data);

    let hijri = data.hijri_date ?? data.hijri ?? null;

    if (!hijri && Array.isArray(data.events)) {
      for (const ev of data.events) {
        if (ev && typeof ev === "object") {
          if ("hijri_day" in ev || "hijri_month" in ev || "hijri_year" in ev) {
            hijri = {
              day: ev.hijri_day ?? ev.day ?? null,
              month: ev.hijri_month ?? ev.month ?? null,
              year: ev.hijri_year ?? ev.year ?? null,
              month_name: ev.hijri_month_name ?? ev.month_name ?? null
            };
            break;
          }
        }
      }
    }

    // ----------------------------------------
    // ⭐ AUTO-SET CURRENT HIJRI YEAR IF MISSING
    // ----------------------------------------
    if (!hijri.year || hijri.year === null) {
      // Convert today’s Gregorian date → Hijri year (simple algorithm)
      const today = new Date();
      const hijriCalc = new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
        year: "numeric"
      }).format(today);

      hijri.year = parseInt(hijriCalc);  // Example: "1447"
    }

    // ----------------------------------------
    // ⭐ DISPLAY DATE
    // ----------------------------------------
    if (hijri) {
      let monthName =
        hijri.month_name ||
        ARABIC_MONTHS[hijri.month] ||
        hijri.month;

      if (monthName === "Jumada al-Akhirah") monthName = "Jumada al-Akhir";

      const dateEl = document.getElementById("today-date");
      if (dateEl) {
        dateEl.textContent = `${hijri.day} ${monthName} ${hijri.year} AH`;
      }
    }

    // ----------------------------------------
    // 📌 EVENTS (same as before)
    // ----------------------------------------
    const eventsBox = document.getElementById("today-events");
    if (!eventsBox) return;
    eventsBox.innerHTML = "";

    let todays = [];

    if (Array.isArray(data.todays) && data.todays.length) {
      todays = data.todays;
    } else if (Array.isArray(data.events) && data.events.length) {
      todays = data.events;
    } else if (Array.isArray(data.all_rows) && data.all_rows.length && hijri) {
      todays = data.all_rows.filter((r) => {
        const rowDay = r.day ?? r.hijri_day;
        const rowMonth = r.month ?? r.hijri_month;
        return Number(rowDay) === Number(hijri.day) &&
               Number(rowMonth) === Number(hijri.month);
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
    }
  })
  .catch((err) => {
    console.error("API Error:", err);
    const eventsBox = document.getElementById("today-events");
    if (eventsBox) {
      eventsBox.innerHTML = `
        <div class="p-4 rounded-xl text-red-700 shadow-inner">
        Error loading special days.
        </div>`;
    }
  });
