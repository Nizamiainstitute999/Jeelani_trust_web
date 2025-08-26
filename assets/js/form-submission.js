// ======================================================
// 📄 File: new/form-submission.js
// 🎯 Purpose: Handle contact form validation + submit,
//             then show a success modal with a countdown.
// ======================================================

document.addEventListener("DOMContentLoaded", function () {
  // ===============================
  // 🔎 1) SELECT ELEMENTS (SAFE)
  // ===============================
  const form = document.getElementById("contact-form");
  if (!form) {
    console.warn("Form with ID 'contact-form' not found.");
    return;
  }

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const messageInput = document.getElementById("message");

  // ==========================================
  // 🧩 2) BUILD SUCCESS MODAL (ONCE, HIDDEN)
  // ==========================================
  const successModal = document.createElement("div");
  successModal.className = "success-modal";
  successModal.style.display = "none"; // hidden by default
  // — Accessibility helpers —
  successModal.setAttribute("role", "dialog");
  successModal.setAttribute("aria-modal", "true");
  successModal.setAttribute("aria-labelledby", "success-title");

  successModal.innerHTML = `
    <div class="success-content">
      <h3 id="success-title">Message Sent Successfully!</h3>
      <p>Thank you for contacting us. We'll get back to you soon.</p>
      <div class="countdown">Closing in 7 seconds...</div>
      <button type="button" class="close-modal" aria-label="Close">Close</button>
    </div>
  `;
  document.body.appendChild(successModal);

  // Close button support + ESC key
  successModal.querySelector(".close-modal").addEventListener("click", () => {
    successModal.style.display = "none";
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") successModal.style.display = "none";
  });

  // ==========================================
  // ✅ 3) LIGHTWEIGHT VALIDATION HELPERS
  // ==========================================
  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const validate = () => {
    const name = nameInput?.value.trim();
    const email = emailInput?.value.trim();
    const message = messageInput?.value.trim();

    if (!name || !email || !message) {
      alert("Please fill in all required fields (Name, Email, and Message)");
      return false;
    }
    if (!isEmail(email)) {
      alert("Please enter a valid email address");
      return false;
    }
    return true;
  };

  // ==========================================
  // 🚀 4) HANDLE SUBMIT → SEND TO BACKEND
  // ==========================================
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validate()) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.textContent : "";

    // Gather data (phone is optional)
    const formData = new FormData();
    formData.append("name", nameInput.value.trim());
    formData.append("email", emailInput.value.trim());
    formData.append("phone", phoneInput ? phoneInput.value.trim() : "");
    formData.append("message", messageInput.value.trim());

    // UI: lock submit
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    try {
      // 🔗  Replace with your own Apps Script URL if needed
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyL6EKQJU87rXrUZXg62mhTy7cqwKipZoQVfhM1zODmzxUkVcgSI_lA6K7jd2qrVSQT_Q/exec",
        { method: "POST", body: formData }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      // ==========================================
      // 🎉 5) SUCCESS FLOW: SHOW MODAL + COUNTDOWN
      // ==========================================
      successModal.style.display = "flex";

      let secondsLeft = 7;
      const countdownElement = successModal.querySelector(".countdown");

      const countdownInterval = setInterval(() => {
        secondsLeft--;
        if (countdownElement) {
          countdownElement.textContent = `Closing in ${secondsLeft} second${secondsLeft !== 1 ? "s" : ""}...`;
        }
        if (secondsLeft <= 0) {
          clearInterval(countdownInterval);
          successModal.style.display = "none";
        }
      }, 1000);

      // Clear form fields after successful submit
      form.reset();
    } catch (error) {
      console.error("Submission error:", error);
      alert("Sorry, we couldn't send your message. Please try again later.");
    } finally {
      // UI: unlock submit
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    }
  });
});
// End of file: assets/js/form-submission.js