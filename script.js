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
 document.getElementById('alarm-set').addEventListener('change', function() {
    setAlarm(); 
 });
 document.getElementById('sound-set').addEventListener('change', function() {
    setLagu();
 })
 toggleAlarm();
 checkAlarm();
 deleteAlarm();

/* Custom dropdown: build a styled dropdown that mirrors the native select and keeps it in sync. */
function initCustomDropdown() {
    const select = document.getElementById('sound-set');
    if (!select) return;

    const wrapper = select.parentElement.querySelector('.custom-dropdown');
    if (!wrapper) return;

    const toggle = wrapper.querySelector('.dropdown-toggle');
    const menu = wrapper.querySelector('.dropdown-menu');

    // populate menu from select options
    function buildMenu() {
        menu.innerHTML = '';
        for (let i = 0; i < select.options.length; i++) {
            const opt = select.options[i];
            const li = document.createElement('li');
            li.setAttribute('data-value', opt.value);
            li.setAttribute('role', 'option');
            li.textContent = opt.text || opt.value;
            if (opt.disabled) li.classList.add('disabled');
            menu.appendChild(li);
        }
    }

    buildMenu();

    // set initial label
    const selOpt = select.options[select.selectedIndex];
    if (selOpt) toggle.textContent = selOpt.text || selOpt.value || 'Pilih suara';

    // open/close
    toggle.addEventListener('click', function (e) {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!expanded));
        menu.classList.toggle('show');
    });

    // option click
    menu.addEventListener('click', function (e) {
        const li = e.target.closest('li');
        if (!li) return;
        const value = li.getAttribute('data-value') || '';
        // update native select and dispatch change
        select.value = value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        // update toggle label
        toggle.textContent = li.textContent;
        // mark active
        menu.querySelectorAll('li').forEach(node => node.classList.remove('active'));
        li.classList.add('active');
        menu.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
    });

    // close on outside click
    document.addEventListener('click', function (e) {
        if (!wrapper.contains(e.target)) {
            menu.classList.remove('show');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });

    // keep native select changes reflected in custom UI (when set programmatically)
    select.addEventListener('change', function () {
        const opt = select.options[select.selectedIndex];
        if (opt) toggle.textContent = opt.text || opt.value || 'Pilih suara';
        // highlight matching li
        menu.querySelectorAll('li').forEach(li => {
            li.classList.toggle('active', li.getAttribute('data-value') === select.value);
        });
    });
}

initCustomDropdown();
