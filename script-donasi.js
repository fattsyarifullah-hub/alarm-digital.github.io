// Menyimpan data donasi saat ini
let currentDonation = {
  amount: 0,
  method: "",
};

// Tunggu DOM fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Setup event listeners
  setupDonationCards();
  setupCustomDonation();
  setupModalListeners();
  setupFormSubmit();
});

// Setup donation card buttons
function setupDonationCards() {
  const donationCards = document.querySelectorAll(".donasi-card");

  donationCards.forEach((card) => {
    const methodButtons = card.querySelectorAll(".method-btn");

    methodButtons.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        e.preventDefault();

        const amount = card.dataset.amount;
        const isGoPay = this.classList.contains("gopay-btn");

        // Add animation
        card.classList.add("selected");
        setTimeout(() => card.classList.remove("selected"), 600);

        // Show modal
        openDonationModal(amount, isGoPay);
      });
    });
  });
}

// Setup custom donation buttons
function setupCustomDonation() {
  const customDana = document.querySelector(".custom-dana");
  const customGopay = document.querySelector(".custom-gopay");

  if (customDana) {
    customDana.addEventListener("click", function () {
      const amount = document.getElementById("custom-amount").value;
      if (validateCustomAmount(amount)) {
        openDonationModal(amount, false);
      }
    });
  }

  if (customGopay) {
    customGopay.addEventListener("click", function () {
      const amount = document.getElementById("custom-amount").value;
      if (validateCustomAmount(amount)) {
        openDonationModal(amount, true);
      }
    });
  }
}

// Setup modal event listeners
function setupModalListeners() {
  const closeModal = document.getElementById("closeModal");
  const cancelModal = document.getElementById("cancelModal");
  const donationModal = document.getElementById("donationModal");

  if (closeModal) {
    closeModal.addEventListener("click", closeDonationModal);
  }

  if (cancelModal) {
    cancelModal.addEventListener("click", closeDonationModal);
  }

  if (donationModal) {
    donationModal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeDonationModal();
      }
    });
  }
}

// Setup form submission
function setupFormSubmit() {
  const donationForm = document.getElementById("donationForm");

  if (donationForm) {
    donationForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = {
        name: document.getElementById("donorName").value.trim(),
        email: document.getElementById("donorEmail").value.trim(),
        phone: document.getElementById("donorPhone").value.trim(),
        accountNumber: document.getElementById("accountNumber").value.trim(),
        message: document.getElementById("donorMessage").value.trim(),
        amount: currentDonation.amount,
        method: currentDonation.method,
        timestamp: new Date(),
      };

      // Validate form
      if (!validateForm(formData)) {
        return;
      }

      // Process payment
      processPayment(formData);

      // Close modal
      closeDonationModal();
    });
  }
}

// Open donation modal
function openDonationModal(amount, isGoPay) {
  const modal = document.getElementById("donationModal");
  const amountDisplay = document.getElementById("amountDisplay");
  const methodDisplay = document.getElementById("methodDisplay");

  if (!modal) {
    return;
  }

  // Set current donation
  currentDonation.amount = amount;
  currentDonation.method = isGoPay ? "GoPay" : "Dana";

  // Format amount
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

  // Update display
  if (amountDisplay) {
    amountDisplay.textContent = formattedAmount;
  }
  if (methodDisplay) {
    methodDisplay.textContent = currentDonation.method;
  }

  // Show modal
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

// Close donation modal
function closeDonationModal() {
  const modal = document.getElementById("donationModal");

  if (modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "auto";

    // Reset form
    const form = document.getElementById("donationForm");
    if (form) {
      form.reset();
    }
  }
}

// Validate custom amount
function validateCustomAmount(amount) {
  if (!amount || isNaN(amount)) {
    alert("Silakan masukkan nominal yang valid!");
    return false;
  }

  if (amount < 1000) {
    alert("Nominal minimal RP 1.000");
    return false;
  }

  return true;
}

// Validate form data
function validateForm(formData) {
  // Check required fields
  if (
    !formData.name ||
    !formData.email ||
    !formData.phone ||
    !formData.accountNumber
  ) {
    alert("Silakan isi semua field yang wajib!");
    return false;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    alert("Format email tidak valid!");
    return false;
  }

  // Validate phone
  if (!/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ""))) {
    alert("Nomor telepon tidak valid (10-15 digit)!");
    return false;
  }

  return true;
}

// Process payment
function processPayment(formData) {
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(formData.amount);

  // Generate transaction ID
  const transactionId = "TRX-" + Date.now();

  // Show success message
  const messageDiv = document.getElementById("donationMessage");
  if (messageDiv) {
    messageDiv.textContent =
      "✓ Terimakasih " +
      formData.name +
      "!\nDonasi " +
      formattedAmount +
      " via " +
      formData.method +
      " berhasil!\nID Transaksi: " +
      transactionId;
    messageDiv.className = "donation-message success";
  }

  // Save to localStorage
  const donations = JSON.parse(localStorage.getItem("donations") || "[]");
  donations.push({
    ...formData,
    transactionId: transactionId,
  });
  localStorage.setItem("donations", JSON.stringify(donations));

  // Clear custom input
  const customAmount = document.getElementById("custom-amount");
  if (customAmount) {
    customAmount.value = "";
  }

  // Clear message after 5 seconds
  setTimeout(() => {
    if (messageDiv) {
      messageDiv.textContent = "";
    }
  }, 5000);
}
