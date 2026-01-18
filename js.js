let finalDonationAmount = 0;
const navItems = document.querySelectorAll('.nav-item');
const screens = document.querySelectorAll('.screen');

function showScreen(screenId) {
    const active = document.querySelector('.screen.active');
    const target = document.getElementById(screenId);
    if (!target || active.id === screenId) return;

    gsap.to(active, { opacity: 0, y: -20, duration: 0.3, onComplete: () => {
        active.classList.remove('active');
        target.classList.add('active');
        gsap.fromTo(target, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
        if(screenId === 'impact') startCounters();
    }});

    navItems.forEach(n => {
        n.classList.remove('active');
        if(n.getAttribute('data-screen') === screenId) n.classList.add('active');
    });
}

function goHome() { showScreen('home'); }

function setAmountAndRegister(amt) {
    finalDonationAmount = amt;
    showScreen('donor-info');
}

function handleManualAndRegister() {
    const val = document.getElementById('manual-amt-input').value;
    if (val > 0) { finalDonationAmount = val; showScreen('donor-info'); } 
    else { alert("Enter amount"); }
}

// GENERATE UNIQUE ID
function generateRegID() {
    const year = new Date().getFullYear();
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `DW-${year}-${randomPart}`;
}

function validateRegistration() {
    const fname = document.getElementById('fname').value;
    const phone = document.getElementById('u-phone').value;
    const email = document.getElementById('u-email').value;
    const occasion = document.getElementById('u-occasion').value;

    if (!fname || phone.length < 10) {
        document.getElementById('err-fname').style.display = fname ? 'none' : 'block';
        document.getElementById('err-phone').style.display = phone.length >= 10 ? 'none' : 'block';
        return;
    }

    // --- NOTIFICATIONS ---
    const registrationData = {
        from_name: fname + " " + document.getElementById('lname').value,
        phone: phone,
        amount: "₹" + finalDonationAmount,
        occasion: occasion
    };

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', registrationData);
    
    const waText = `New Donor: ${registrationData.from_name}%0AAmount: ₹${finalDonationAmount}%0AOccasion: ${occasion}`;
    window.open(`https://wa.me/919666315362?text=${waText}`);

    // Update Profile with ID
    document.getElementById('disp-fullname').innerText = registrationData.from_name;
    document.getElementById('disp-phone').innerText = phone;
    document.getElementById('disp-amt').innerText = "₹" + finalDonationAmount;
    document.getElementById('disp-occasion').innerText = occasion;
    document.getElementById('disp-reg-id').innerText = generateRegID();

    showScreen('wait-screen');
    gsap.to(".progress-fill", { width: "100%", duration: 4, onComplete: () => showScreen('member-profile') });
}

function startCounters() {
    document.querySelectorAll('.count').forEach(c => {
        const target = parseInt(c.getAttribute('data-target'));
        gsap.fromTo(c, { innerText: 0 }, {
            innerText: target, duration: 2, snap: { innerText: 1 },
            onUpdate: () => { c.innerHTML = Math.floor(c.innerText).toLocaleString() + "+"; }
        });
    });
}

navItems.forEach(item => item.addEventListener('click', () => showScreen(item.getAttribute('data-screen'))));