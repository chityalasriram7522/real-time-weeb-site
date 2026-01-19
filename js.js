let finalDonationAmount = 0;
let selectedBoxType = "Support";
let userData = {};

// 1. Theme Toggle
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
themeBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('white-mode');
    themeIcon.setAttribute('name', isDark ? 'sunny-outline' : 'moon-outline');
});

// 2. Navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    const target = document.getElementById(screenId);
    if (!target) return;
    target.style.display = 'flex';
    target.classList.add('active');
    target.scrollTop = 0;

    if(screenId === 'impact') setTimeout(startCounters, 100);

    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-screen') === screenId);
    });
}

// 3. Manual Amount Validation
function handleManualAndRegister() {
    const input = document.getElementById('manual-amt-input');
    const err = document.getElementById('err-manual');
    if (input.value > 0) {
        input.classList.remove('invalid-input');
        err.style.display = 'none';
        finalDonationAmount = input.value;
        selectedBoxType = "Custom Support";
        showScreen('donor-info');
    } else {
        input.classList.add('invalid-input');
        err.style.display = 'block';
    }
}

// 4. Registration Validation
function validateRegistration() {
    const fname = document.getElementById('fname');
    const phone = document.getElementById('u-phone');
    const errFname = document.getElementById('err-fname');
    const errPhone = document.getElementById('err-phone');
    let isValid = true;

    if (!fname.value.trim()) {
        fname.classList.add('invalid-input');
        errFname.style.display = 'block';
        isValid = false;
    } else {
        fname.classList.remove('invalid-input');
        errFname.style.display = 'none';
    }

    if (phone.value.length < 10) {
        phone.classList.add('invalid-input');
        errPhone.style.display = 'block';
        isValid = false;
    } else {
        phone.classList.remove('invalid-input');
        errPhone.style.display = 'none';
    }

    if (isValid) {
        userData = {
            name: fname.value + " " + document.getElementById('lname').value,
            phone: phone.value,
            email: document.getElementById('u-email').value,
            gender: document.getElementById('u-gender').value,
            occasion: document.getElementById('u-occasion').value,
            why: document.getElementById('u-why').value,
            regID: "DW-" + Math.random().toString(36).substr(2, 5).toUpperCase()
        };
        showScreen('whatsapp-gate');
    }
}

// 5. Improved WhatsApp Template
function sendToChairman() {
    const msg = `*DWARAKA FOUNDATION REGISTRATION*
---------------------------------------
*ID:* ${userData.regID}
*Name:* ${userData.name}
*Phone:* ${userData.phone}
*Support:* ${selectedBoxType}
*Amount:* ₹${finalDonationAmount}
*Occasion:* ${userData.occasion}
*Reason:* ${userData.why || 'General Support'}
---------------------------------------
Please verify this donor profile.`;

    window.open(`https://wa.me/919666315362?text=${encodeURIComponent(msg)}`, '_blank');
    showScreen('confirm-gate');
}

// 6. Impact Counters
function startCounters() {
    document.querySelectorAll('.count').forEach(c => {
        const target = parseInt(c.getAttribute('data-target'));
        gsap.fromTo(c, { innerText: 0 }, {
            innerText: target, duration: 2, snap: { innerText: 1 },
            onUpdate: function() { c.innerText = Math.floor(this.targets()[0].innerText).toLocaleString() + "+"; }
        });
    });
}

function setAmountAndRegister(amt, label) {
    finalDonationAmount = amt;
    selectedBoxType = label;
    showScreen('donor-info');
}

async function confirmAndVerify() {
    showScreen('wait-screen');
    document.getElementById('disp-fullname').innerText = userData.name;
    document.getElementById('disp-phone').innerText = userData.phone;
    document.getElementById('disp-amt').innerText = "₹" + finalDonationAmount;
    document.getElementById('disp-box-type').innerText = selectedBoxType;
    document.getElementById('disp-reg-id').innerText = userData.regID;
    document.getElementById('disp-occasion').innerText = userData.occasion;

    gsap.to(".progress-fill", { width: "100%", duration: 4, onComplete: () => showScreen('member-profile') });

    try {
        fetch('http://localhost:5000/api/register-donor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...userData, amount: "₹"+finalDonationAmount, boxes: selectedBoxType })
        });
    } catch (e) { console.log("DB Offline"); }
}

function goHome() { location.reload(); }

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => showScreen(item.getAttribute('data-screen')));
});