// ===============================
// 📅 FETCH HIJRI DATE FROM API
// ===============================
fetch("https://nizamiamadrasa.com/hijri-hub/api/arabic-date/")

  // Step 1: Convert response → JSON
  .then(res => res.json())

  // Step 2: Handle the data
  .then(data => {
    if (!data.error) {
      // ✅ If no error → update elements with Hijri date
      document.getElementById("hijri-day").innerText = data.day;
      document.getElementById("hijri-month").innerText = data.month;
      document.getElementById("hijri-year").innerText = data.year;
    } else {
      // ❌ If API sent error → show message
      document.getElementById("hijri-date").innerText = "Date unavailable";
    }
  })

  // Step 3: Handle network/server error
  .catch(() => {
    document.getElementById("hijri-date").innerText = "Error fetching date";
  });
