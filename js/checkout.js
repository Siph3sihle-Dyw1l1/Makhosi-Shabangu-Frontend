/* ==========================================================================
   Checkout flow — demo payment only. No network call, no real charge,
   no card data is stored or transmitted anywhere.
   ========================================================================== */

let checkoutOrderId = null;
let checkoutSnapshot = null; // cart contents frozen at "payment" time

function goToStep(step) {
  [1, 2, 3].forEach(n => {
    document.getElementById(`panel-${n}`).style.display = n === step ? "block" : "none";
  });
  document.querySelectorAll(".step-item").forEach(el => {
    const n = Number(el.dataset.step);
    el.classList.toggle("active", n <= step);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderReview() {
  const cart = getCart();
  const ids = Object.keys(cart);
  const itemsEl = document.getElementById("reviewItems");
  const subtotalEl = document.getElementById("summarySubtotal");
  const totalEls = [document.getElementById("summaryTotal"), document.getElementById("summaryTotal2")];
  const continueBtn = document.getElementById("toPaymentBtn");
  const emptyLink = document.getElementById("emptyCartLink");

  if (ids.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    if (continueBtn) continueBtn.disabled = true;
    if (emptyLink) emptyLink.style.display = "inline-flex";
  } else {
    itemsEl.innerHTML = ids.map(id => {
      const product = PRODUCTS.find(p => p.id === id);
      if (!product) return "";
      const qty = cart[id];
      return `
        <div class="cart-item" style="margin-bottom:18px;">
          <img src="${product.image}" alt="${product.name}">
          <div>
            <div class="cart-item-name">${product.name}</div>
            <div class="cart-item-meta"><span>Qty ${qty}</span></div>
          </div>
          <div class="price">${formatPrice(product.price * qty)}</div>
        </div>
      `;
    }).join("");
    if (continueBtn) continueBtn.disabled = false;
    if (emptyLink) emptyLink.style.display = "none";
  }

  const total = cartTotal();
  if (subtotalEl) subtotalEl.textContent = formatPrice(total);
  totalEls.forEach(el => { if (el) el.textContent = formatPrice(total); });

  const payAmountEl = document.getElementById("payAmount");
  if (payAmountEl) payAmountEl.textContent = formatPrice(total);
}

/* ---------- Card field formatting (display only, no validation against real networks) ---------- */

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return digits.slice(0, 2) + "/" + digits.slice(2);
}

function generateOrderId() {
  const stamp = Date.now().toString().slice(-6);
  return `MS-${stamp}`;
}

function buildConfirmationMessage() {
  const ids = Object.keys(checkoutSnapshot.cart);
  let msg = `Hi Makhosi, I've completed payment for order ${checkoutOrderId}:%0A%0A`;
  ids.forEach(id => {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;
    const qty = checkoutSnapshot.cart[id];
    msg += `- ${product.name} x${qty} (${formatPrice(product.price * qty)})%0A`;
  });
  msg += `%0ATotal: ${formatPrice(checkoutSnapshot.total)}%0A`;
  msg += `Contact number: ${checkoutSnapshot.waNumber}`;
  return msg;
}

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("paymentForm")) return; // not on checkout page

  renderReview();

  document.getElementById("toPaymentBtn")?.addEventListener("click", () => {
    if (cartCount() === 0) return;
    goToStep(2);
  });

  document.getElementById("backToReview")?.addEventListener("click", () => goToStep(1));

  const cardNumberInput = document.getElementById("cardNumber");
  cardNumberInput.addEventListener("input", (e) => {
    e.target.value = formatCardNumber(e.target.value);
  });

  const expiryInput = document.getElementById("cardExpiry");
  expiryInput.addEventListener("input", (e) => {
    e.target.value = formatExpiry(e.target.value);
  });

  const cvvInput = document.getElementById("cardCvv");
  cvvInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 3);
  });

  document.getElementById("paymentForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const errorEl = document.getElementById("paymentError");
    errorEl.style.display = "none";

    const cardNumberDigits = cardNumberInput.value.replace(/\D/g, "");
    const expiry = expiryInput.value;
    const cvv = cvvInput.value;
    const waNumber = document.getElementById("waNumber").value.trim();

    // Format-only checks. This never contacts a card network — it just
    // confirms the demo form was filled in plausibly.
    if (cardNumberDigits.length !== 16) {
      errorEl.textContent = "Enter a 16-digit card number.";
      errorEl.style.display = "block";
      return;
    }
    const expiryMatch = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!expiryMatch) {
      errorEl.textContent = "Enter expiry as MM/YY.";
      errorEl.style.display = "block";
      return;
    }
    const month = Number(expiryMatch[1]);
    if (month < 1 || month > 12) {
      errorEl.textContent = "Expiry month must be between 01 and 12.";
      errorEl.style.display = "block";
      return;
    }
    if (cvv.length !== 3) {
      errorEl.textContent = "Enter a 3-digit CVV.";
      errorEl.style.display = "block";
      return;
    }
    if (waNumber.length < 9) {
      errorEl.textContent = "Enter a valid WhatsApp number.";
      errorEl.style.display = "block";
      return;
    }

    // Simulated processing delay, then "success".
    const payBtn = document.getElementById("payBtn");
    const payLabel = document.getElementById("payBtnLabel");
    payBtn.disabled = true;
    const originalLabel = payLabel.innerHTML;
    payLabel.textContent = "Processing…";

    setTimeout(() => {
      checkoutSnapshot = {
        cart: getCart(),
        total: cartTotal(),
        waNumber
      };
      checkoutOrderId = generateOrderId();
      document.getElementById("orderId").textContent = checkoutOrderId;

      // Clear the cart now that the demo "payment" succeeded.
      localStorage.removeItem(CART_KEY);
      renderCartCount();

      payBtn.disabled = false;
      payLabel.innerHTML = originalLabel;
      goToStep(3);
    }, 1400);
  });

  document.getElementById("sendWhatsAppBtn")?.addEventListener("click", () => {
    if (!checkoutSnapshot) return;
    const message = buildConfirmationMessage();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  });
});
