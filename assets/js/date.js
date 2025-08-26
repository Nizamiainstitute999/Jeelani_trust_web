// ===============================
// 📆 GREGORIAN DATE DISPLAY
// ===============================

// 1. Get the target element
const gregorianDate = document.getElementById('gregorian-date');

// 2. Create a Date object for today
const today = new Date();

// 3. If the element exists → format and display date
if (gregorianDate) {
  // Day of the month (1–31)
  const Gday = today.getDate();

  // Month name in full (e.g., "August") → using Indian English format
  const Gmonth = today.toLocaleDateString('en-IN', { month: 'long' });

  // Year (e.g., 2025)
  const Gyear = today.getFullYear();

  // Insert formatted date into the element
  gregorianDate.innerHTML = `
    ${Gday} 
    <span class="text-trust-600" style="font-family:'Roboto Condensed', sans-serif;">
      ${Gmonth}
    </span> 
    ${Gyear}
  `;
}
