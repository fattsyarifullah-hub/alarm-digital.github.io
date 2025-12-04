function realTime() {
  // buat jam realtime nya
  var Year = document.getElementById("year");
  var Month = document.getElementById("month");
  var date = document.getElementById("date");
  var Hour = document.getElementById("hour");
  var Minute = document.getElementById("minute");
  var Second = document.getElementById("second");
  var AMPM = document.getElementById("am");

  var Y = new Date().getFullYear();
  var M = new Date().getMonth() + 1;
  var D = new Date().getDate();
  var H = new Date().getHours();
  var m = new Date().getMinutes();
  var s = new Date().getSeconds();
  var am = "AM";

  if (H > 12) {
    H = H - 12;
    am = "PM";
  }

  H = H < 10 ? "0" + H : H;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;

  Year.innerText = Y;
  Month.innerText = M;
  date.innerText = D;
  Hour.innerText = H;
  Minute.innerText = m;
  Second.innerText = s;
  AMPM.innerText = am;
}

var interval = setInterval(realTime, 1000); //buat jam realtime berjalan

let AlarmTime = null; //setting default waktu alarm
let AlarmActive = false; // ON/OFF dalam toggle alarm
const selectLagu = document.getElementById("sound-set")?.value || "";
let alarmAudio = selectLagu ? new Audio(selectLagu) : null;

function setAlarm() {
  // buat user setting alarmnya
  const input = document.getElementById("alarm-set").value; //input dari user
  if (!input) return; //jika tidak ada input maka kembalikan

  const parts = input.split(":");
  const hh = (parts[0] || "0").toString().padStart(2, "0"); //jam input diubah ke string
  const mm = (parts[1] || "0").toString().padStart(2, "0"); //menit input diubah ke string

  AlarmTime = hh + ":" + mm; //format alarm dari input user
  alert("alarm di setting ke jam " + AlarmTime); //info dari js klo alarmnya udh disetting
}

function setLagu() {
  const pilihanLagu = document.getElementById("sound-set");
  const value = pilihanLagu.value || "";

  if (!value) {
    alarmAudio.pause();
    alarmAudio.src = "";
    return alarmAudio;
  }

  if (alarmAudio.src !== value) {
    alarmAudio.src = value;
  }

  alarmAudio.loop = true;
  alarmAudio.preload = "auto";

  return alarmAudio;
}

function checkAlarm() {
  setInterval(() => {
    if (!AlarmActive || !AlarmTime) return;

    const now = new Date();
    const current =
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0"); //ngecek waktu skrg dan ubah ke string biar sama kyk waktu yang di setting

    if (current === AlarmTime) {
      //klo waktu skrg sama kyk waktu yg diinput user maka lakukan
      // ensure audio source is set and play it
      setLagu();
      try {
        alarmAudio.play();
      } catch (e) {
        // play() may return a promise or raise; fail silently here
        console.warn("Audio play failed", e);
      }

      AlarmActive = false; //klo udh jalan maka settingannya kembali menjadi default
    }
  }, 1000);
}

function toggleAlarm() {
  // buat checkboxnya bikin alarm bisa on/off
  const toggle = document.getElementById("toggle-on/off");

  toggle.addEventListener("change", function () {
    if (toggle.checked && AlarmTime === null) {
      //jika toggle udh dicentang tapi alarm belum di set maka muncul alert
      alert("isi set alarm terlebih dahulu");
      toggle.checked = false; //mereset toggle yang udh dicentang
      AlarmActive = false; //alarmnya belum active
      return;
    }

    if (toggle.checked) {
      AlarmActive = true;
    } else {
      AlarmActive = false;
      // stop and rewind the currently loaded audio
      alarmAudio.pause();
      alarmAudio.currentTime = 0;
    }
  });

  document.getElementById("alarm-set").addEventListener("change", function () {
    if (AlarmActive) {
      setAlarm(); //ini kalau Alarm active ngeliatnya dari set alarm
    }
  });
}

function deleteAlarm() {
  // buat user bisa menghapus set alarm
  const input = document.getElementById("alarm-set");
  const reset = document.getElementById("reset-btn");
  const toggle = document.getElementById("toggle-on/off");

  reset.addEventListener("click", function () {
    alert("reset alarm berhasil");
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
    input.value = "";
    AlarmTime = null;
    AlarmActive = false;
    toggle.checked = false;
  }); //kalo pencet tombol reset bakal lakuin semua yng ada di dalam function
}

//ini adalah pemanggilan semua function
document.getElementById("alarm-set").addEventListener("change", function () {
  setAlarm();
});
document.getElementById("sound-set").addEventListener("change", function () {
  setLagu();
});
toggleAlarm();
checkAlarm();
deleteAlarm();

// ============ DONATION PAGE INTERACTIVITY ============

// Donation amount mapping
const donationAmounts = {
  10000: "Ketua buat lagu baru",
  20000: "mbg biar makin bagus web nya",
  50000: "Paket Combo meria mantap",
  10000000: "Premium Plus plus, langsung jadi atmin",
};

// Handle preset donation cards - HANYA untuk method buttons
document.querySelectorAll(".donasi-card").forEach((card) => {
  const methodButtons = card.querySelectorAll(".method-btn");
  methodButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const amount = card.dataset.amount;
      const isGoPay = this.classList.contains("gopay-btn");

      // Add animation
      card.classList.add("selected");
      setTimeout(() => card.classList.remove("selected"), 600);

      // Show modal with donation details
      openDonationModal(amount, isGoPay);
    });
  });
});

// Handle custom donation
document.querySelector(".custom-dana")?.addEventListener("click", function () {
  const amount = document.getElementById("custom-amount").value;
  if (validateCustomAmount(amount)) {
    openDonationModal(amount, false);
  }
});

document.querySelector(".custom-gopay")?.addEventListener("click", function () {
  const amount = document.getElementById("custom-amount").value;
  if (validateCustomAmount(amount)) {
    openDonationModal(amount, true);
  }
});

// Validate custom amount input
function validateCustomAmount(amount) {
  const messageDiv = document.getElementById("donationMessage");

  if (!amount || isNaN(amount)) {
    showMessage("Silakan masukkan nominal yang valid!", "error");
    return false;
  }

  if (amount < 1000) {
    showMessage("Nominal minimal RP 1.000", "error");
    return false;
  }

  return true;
}

// Process payment
function processPayment(amount, isGoPay) {
  const method = isGoPay ? "GoPay" : "Dana";
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

  // Generate unique transaction ID
  const transactionId = "TRX-" + Date.now();

  // Show success message
  showMessage(
    `✓ Terimakasih atas donasi ${formattedAmount} via ${method}!\nID Transaksi: ${transactionId}`,
    "success"
  );

  // Log transaction (in real app, send to server)
  console.log({
    amount: amount,
    method: method,
    timestamp: new Date(),
    transactionId: transactionId,
  });

  // Clear custom input
  document.getElementById("custom-amount").value = "";

  // Reset message after 5 seconds
  setTimeout(() => {
    document.getElementById("donationMessage").textContent = "";
  }, 5000);
}

// Show message function
function showMessage(text, type) {
  const messageDiv = document.getElementById("donationMessage");
  messageDiv.textContent = text;
  messageDiv.className = "donation-message " + type;
}

// Add input validation for custom amount
document
  .getElementById("custom-amount")
  ?.addEventListener("input", function () {
    // Allow only numbers
    this.value = this.value.replace(/[^0-9]/g, "");

    // Format dengan separasi ribuan
    if (this.value) {
      const formatted = parseInt(this.value).toLocaleString("id-ID");
      // Don't change the value, just show it formatted in placeholder or elsewhere
    }
  });

// Add hover effects
document.querySelectorAll(".donasi-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.cursor = "pointer";
  });
});

// ============ MODAL POPUP FUNCTIONALITY ============

// Menyimpan data donasi saat ini
let currentDonation = {
  amount: 0,
  method: "",
};

// Open donation modal
function openDonationModal(amount, isGoPay) {
  const modal = document.getElementById("donationModal");
  const amountDisplay = document.getElementById("amountDisplay");
  const methodDisplay = document.getElementById("methodDisplay");

  // Update modal dengan data donasi
  currentDonation.amount = amount;
  currentDonation.method = isGoPay ? "GoPay" : "Dana";

  // Format dan tampilkan nominal
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

  amountDisplay.textContent = formattedAmount;
  methodDisplay.textContent = currentDonation.method;

  // Tampilkan modal
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

// Close donation modal
function closeDonationModal() {
  const modal = document.getElementById("donationModal");
  modal.classList.remove("show");
  document.body.style.overflow = "auto";

  // Reset form
  document.getElementById("donationForm").reset();
}

// Modal event listeners
document
  .getElementById("closeModal")
  ?.addEventListener("click", closeDonationModal);
document
  .getElementById("cancelModal")
  ?.addEventListener("click", closeDonationModal);

// Close modal saat klik di luar (backdrop)
document
  .getElementById("donationModal")
  ?.addEventListener("click", function (e) {
    if (e.target === this) {
      closeDonationModal();
    }
  });

// Handle form submission
document
  .getElementById("donationForm")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();

    // Ambil data form
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

    // Validasi form
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.accountNumber
    ) {
      alert("Silakan isi semua field yang wajib!");
      return;
    }

    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Format email tidak valid!");
      return;
    }

    // Validasi phone number (hanya angka)
    if (!/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ""))) {
      alert("Nomor telepon tidak valid!");
      return;
    }

    // Proses donasi
    processPayment(formData);

    // Tutup modal
    closeDonationModal();
  });

// Update processPayment function
function processPayment(formData) {
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(formData.amount);

  // Generate unique transaction ID
  const transactionId = "TRX-" + Date.now();

  // Tampilkan success message
  showMessage(
    `✓ Terimakasih ${formData.name}!\nDonasi ${formattedAmount} via ${formData.method} berhasil!\nID Transaksi: ${transactionId}`,
    "success"
  );

  // Log transaction ke console
  console.log({
    transactionId: transactionId,
    donor: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      accountNumber: formData.accountNumber,
    },
    donation: {
      amount: formData.amount,
      method: formData.method,
      message: formData.message,
    },
    timestamp: formData.timestamp,
  });

  // Simpan ke localStorage untuk referensi
  const donations = JSON.parse(localStorage.getItem("donations") || "[]");
  donations.push({
    ...formData,
    transactionId: transactionId,
  });
  localStorage.setItem("donations", JSON.stringify(donations));

  // Clear custom input
  document.getElementById("custom-amount").value = "";

  // Reset message setelah 5 detik
  setTimeout(() => {
    document.getElementById("donationMessage").textContent = "";
  }, 5000);
}

// Update processPayment yang lama
function processPaymentOld(amount, isGoPay) {
  const method = isGoPay ? "GoPay" : "Dana";
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

  // Generate unique transaction ID
  const transactionId = "TRX-" + Date.now();

  // Show success message
  showMessage(
    `✓ Terimakasih atas donasi ${formattedAmount} via ${method}!\nID Transaksi: ${transactionId}`,
    "success"
  );

  // Log transaction (in real app, send to server)
  console.log({
    amount: amount,
    method: method,
    timestamp: new Date(),
    transactionId: transactionId,
  });

  // Clear custom input
  document.getElementById("custom-amount").value = "";

  // Reset message after 5 seconds
  setTimeout(() => {
    document.getElementById("donationMessage").textContent = "";
  }, 5000);
}
