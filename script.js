function realTime() {
// buat jam realtime nya
    var Year = document.getElementById('year');
    var Month = document.getElementById('month');
    var date = document.getElementById('date');
    var Hour = document.getElementById('hour');
    var Minute = document.getElementById('minute');
    var Second = document.getElementById('second');
    var AMPM = document.getElementById('am');

    var Y = new Date().getFullYear();
    var M = new Date().getMonth() + 1;
    var D = new Date().getDate();
    var H = new Date().getHours();
    var m = new Date().getMinutes();
    var s = new Date().getSeconds();
    var am = 'AM';

    if (H > 12) {
        H = H - 12;
        am = 'PM';
    }

    H = H < 10 ? '0' + H : H;
    m = m < 10 ? '0' + m : m;
    s = s< 10  ? '0' + s :s;
   
    Year.innerText = Y;
    Month.innerText = M;
    date.innerText = D;
    Hour.innerText = H;
    Minute.innerText = m;
    Second.innerText = s;
};

var interval = setInterval(realTime, 1000); //buat jam realtime berjalan


let AlarmTime = null; //setting default waktu alarm
let AlarmActive = false; // ON/OFF dalam toggle alarm
const nihAudio = new Audio('alarm.mp3');

function setAlarm() {
// buat user setting alarmnya
    const input = document.getElementById('alarm-set').value; //input dari user 
    if (!input) return; //jika tidak ada input maka kembalikan

    const parts = input.split(":");
    const hh = (parts[0] || '0').toString().padStart(2, '0'); //jam input diubah ke string
    const mm = (parts[1] || '0').toString().padStart(2, '0'); //menit input diubah ke string

    AlarmTime = hh + ":" + mm; //format alarm dari input user
    alert("alarm di setting ke jam " + AlarmTime); //info dari js klo alarmnya udh disetting
}

function checkAlarm() {
    setInterval(() => {
        if (!AlarmActive || !AlarmTime) return; 
        
        const now = new Date();
        const current = now.getHours().toString().padStart(2,"0") + ":" + now.getMinutes().toString().padStart(2, "0"); //ngecek waktu skrg dan ubah ke string biar sama kyk waktu yang di setting

        if (current === AlarmTime) { //klo waktu skrg sama kyk waktu yg diinput user maka lakukan 
            nihAudio.play().loop //ini yang dilakukan klo udh sama
            AlarmActive = false; //klo udh jalan maka settingannya kembali menjadi default
        } 
    }, 1000)
}

function toggleAlarm() {
// buat checkboxnya bikin alarm bisa on/off
    const toggle = document.getElementById('toggle-on/off');

    toggle.addEventListener("change", function () {
        if (toggle.checked && AlarmTime === null) { //jika toggle udh dicentang tapi alarm belum di set maka muncul alert
            alert("isi set alarm terlebih dahulu")
            toggle.checked = false; //mereset toggle yang udh dicentang
            AlarmActive = false; //alarmnya belum active
            return;
        }

        if (toggle.checked) {;
            AlarmActive = true;
        } else {;
            AlarmActive = false;
            nihAudio.pause();
        }
    })

    document.getElementById('alarm-set').addEventListener('change', function(){
        if (AlarmActive) {
            setAlarm(); //ini kalau Alarm active ngeliatnya dari set alarm
        }
    })
}


function deleteAlarm() {
// buat user bisa menghapus set alarm
    const input = document.getElementById('alarm-set');
    const reset = document.getElementById('reset-btn');
    const toggle = document.getElementById('toggle-on/off');

    reset.addEventListener("click", function() {
        alert("reset alarm berhasil");
        nihAudio.pause(); //berhentiin audio klo alarm di reset
        input.value = "";
        AlarmTime = null;
        AlarmActive = false;
        toggle.checked = false;
    }); //kalo pencet tombol reset bakal lakuin semua yng ada di dalam function
};

//ini adalah pemanggilan semua function
 document.getElementById('alarm-set').addEventListener('change', function() {
    setAlarm(); 
 });
 toggleAlarm();
 checkAlarm();
 deleteAlarm();