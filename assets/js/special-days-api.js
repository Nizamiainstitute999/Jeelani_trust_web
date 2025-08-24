  // Map month numbers → Hijri month names
  const ARABIC_MONTHS = {
    1: "Muharram",
    2: "Safar",
    3: "Rabiʿ al-Awwal",
    4: "Rabiʿ ath-Thani",
    5: "Jumada al-Ula",
    6: "Jumada ath-Thaniya",
    7: "Rajab",
    8: "Shaʿban",
    9: "Ramadan",
    10: "Shawwal",
    11: "Dhu al-Qaʿdah",
    12: "Dhu al-Hijjah"
  };

  fetch("https://nizamiamadrasa.com/api/special-days/")
    .then(res => res.json())
    .then(data => {
      // Hijri Date with month name
      if (data.hijri) {
        const monthName = ARABIC_MONTHS[data.hijri.month] || data.hijri.month;
        document.getElementById("today-date").textContent =
          ` ${data.hijri.day} ${monthName} ${data.hijri.year} AH`;
      }

      // Events
      const eventsBox = document.getElementById("today-events");
      eventsBox.innerHTML = "";
      if (data.todays && data.todays.length > 0) {
        data.todays.forEach(event => {
          eventsBox.insertAdjacentHTML(
            "beforeend",
            `<div class="font-quicksand ">
           <span class="text-lg font-bold font-cinzel">o</span>  ${event}
             </div>`
          );
        });
      } else {
        eventsBox.innerHTML =
          `<div class=" text-gray-600 font-quicksand">
             No special remembrance today.
           </div>`;
      }
    })
    .catch(err => {
      document.getElementById("today-events").innerHTML =
        `<div class="p-4 rounded-xl  text-red-700 shadow-inner">
           ⚠️ Failed to load events. Please try again later.
         </div>`;
      console.error(err);
    });