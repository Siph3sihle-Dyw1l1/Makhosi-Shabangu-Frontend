/* ==========================================================================
   General site behaviour: nav, footer year, booking form
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const navToggle = document.getElementById("navToggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.style.display === "flex";
      navLinks.style.display = isOpen ? "none" : "flex";
      navLinks.style.flexDirection = "column";
      navLinks.style.position = "absolute";
      navLinks.style.top = "76px";
      navLinks.style.left = "0";
      navLinks.style.right = "0";
      navLinks.style.background = "#FBF8F2";
      navLinks.style.padding = "24px 32px";
      navLinks.style.borderBottom = "1px solid rgba(42,32,24,0.12)";
    });
  }

  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const service = document.getElementById("service").value;
      const message = document.getElementById("message").value.trim();

      const waNumber = typeof WHATSAPP_NUMBER !== "undefined" ? WHATSAPP_NUMBER : "27000000000";
      let text = `Hi Makhosi, I'd like to request a consultation.%0A%0A`;
      text += `Name: ${name}%0A`;
      text += `Phone: ${phone}%0A`;
      text += `Service: ${service}%0A`;
      if (message) text += `Message: ${message}%0A`;

      window.open(`https://wa.me/${waNumber}?text=${text}`, "_blank");
      bookingForm.reset();
    });
  }
});
