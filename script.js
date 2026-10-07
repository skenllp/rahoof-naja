// ============================================================
// FALLING FLOWERS â€” SVG petals drift from top to bottom
// ============================================================
(function () {
  const field = document.getElementById('flowerField');
  if (!field) return;

  // Colour palette matching the dark crimson theme
  const colours = [
    '#C8393A', '#9a1a20', '#F5EBE6',
    '#C4909A', '#e05050', '#7a0e14',
    '#F0E4E0', '#A84350'
  ];

  // Four SVG flower shapes (as inline SVG strings)
  const shapes = [
    // 5-petal rounded flower
    (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40" fill="${c}" opacity="0.65" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(0   20 20)"/>
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(72  20 20)"/>
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(144 20 20)"/>
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(216 20 20)"/>
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(288 20 20)"/>
      <circle  cx="20" cy="20" r="5" fill="${c}" opacity="0.8"/>
    </svg>`,

    // 6-petal daisy
    (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40" fill="${c}" opacity="0.6" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(0   20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(60  20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(120 20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(180 20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(240 20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(300 20 20)"/>
      <circle  cx="20" cy="20" r="4.5" fill="${c}" opacity="0.8"/>
    </svg>`,

    // Single petal / leaf shape
    (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40" fill="${c}" opacity="0.55" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4 C 28 12, 28 28, 20 36 C 12 28, 12 12, 20 4 Z"/>
    </svg>`,

    // 4-petal sakura style
    (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40" fill="${c}" opacity="0.6" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="8"  rx="5.5" ry="10" transform="rotate(0   20 20)"/>
      <ellipse cx="20" cy="8"  rx="5.5" ry="10" transform="rotate(90  20 20)"/>
      <ellipse cx="20" cy="8"  rx="5.5" ry="10" transform="rotate(180 20 20)"/>
      <ellipse cx="20" cy="8"  rx="5.5" ry="10" transform="rotate(270 20 20)"/>
      <circle  cx="20" cy="20" r="4" fill="${c}" opacity="0.75"/>
    </svg>`,
  ];

  const TOTAL = 10;  // number of flowers in the pool
  const rnd = (a, b) => Math.random() * (b - a) + a;
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  for (let i = 0; i < TOTAL; i++) {
    const el = document.createElement('div');
    el.className = 'flower';

    const size = rnd(14, 32);                   // px
    const colour = pick(colours);
    const shapeIdx = Math.floor(rnd(0, shapes.length));
    const duration = rnd(7, 18);                    // fall speed (s)
    const spinSpeed = rnd(4, 14);                    // rotation speed (s)
    const delay = rnd(-duration, 0);             // stagger so they're already mid-air
    const leftPct = rnd(0, 100);                   // horizontal start
    const drift = `${rnd(-80, 80)}px`;           // horizontal wander during fall

    el.style.cssText = `
      left: ${leftPct}%;
      --drift: ${drift};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    el.innerHTML = shapes[shapeIdx](colour, Math.round(size));

    // Apply spin speed to the inner svg
    const svg = el.querySelector('svg');
    if (svg) {
      svg.style.animationDuration = `${spinSpeed}s`;
    }

    field.appendChild(el);
  }
})();


const EVENT_DATE = new Date('2026-10-18T17:00:00+05:30').getTime();

const cdDays = document.getElementById('cd-days');
const cdHours = document.getElementById('cd-hours');
const cdMins = document.getElementById('cd-mins');
const cdSecs = document.getElementById('cd-secs');

function pad(n) { return String(n).padStart(2, '0'); }

function updateCountdown() {
  const now = Date.now();
  let diff = EVENT_DATE - now;

  if (diff <= 0) {
    cdDays.textContent = '00';
    cdHours.textContent = '00';
    cdMins.textContent = '00';
    cdSecs.textContent = '00';
    return;
  }

  const days = Math.floor(diff / 86400000); diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
  const mins = Math.floor(diff / 60000); diff -= mins * 60000;
  const secs = Math.floor(diff / 1000);

  cdDays.textContent = pad(days);
  cdHours.textContent = pad(hours);
  cdMins.textContent = pad(mins);
  cdSecs.textContent = pad(secs);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ============================================================
// SPLASH SCREEN â€” dismiss on "Open Invitation" click + autoplay music
// ============================================================
const splashOverlay = document.getElementById('splashOverlay');
const openInvitationBtn = document.getElementById('openInvitationBtn');
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const musicRing = document.getElementById('musicRing');
const iconOn = musicBtn.querySelector('.music-icon--on');
const iconOff = musicBtn.querySelector('.music-icon--off');

// Update button appearance to match actual playing state
function syncMusicBtn(playing) {
  if (playing) {
    iconOn.style.display = '';
    iconOff.style.display = 'none';
    musicBtn.setAttribute('aria-label', 'Pause music');
    musicRing.classList.add('spinning');
  } else {
    iconOn.style.display = 'none';
    iconOff.style.display = '';
    musicBtn.setAttribute('aria-label', 'Play music');
    musicRing.classList.remove('spinning');
  }
}

// Attempt autoplay when user clicks "Open Invitation"
openInvitationBtn.addEventListener('click', () => {
  splashOverlay.classList.add('hidden');
  splashOverlay.addEventListener('transitionend', () => {
    splashOverlay.remove();
  }, { once: true });

  // Make the floating music toggle button visible
  musicBtn.classList.add('visible');

  // Autoplay — browsers allow this after a user gesture
  bgMusic.volume = 0.55;
  bgMusic.play().then(() => {
    syncMusicBtn(true);
  }).catch(() => {
    // Autoplay blocked — show button in paused state
    syncMusicBtn(false);
  });
});

// Toggle play / pause via floating button
musicBtn.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play().then(() => syncMusicBtn(true));
  } else {
    bgMusic.pause();
    syncMusicBtn(false);
  }
});

// Keep button in sync if audio ends unexpectedly (shouldn't happen with loop)
bgMusic.addEventListener('pause', () => syncMusicBtn(false));
bgMusic.addEventListener('play', () => syncMusicBtn(true));

// ============================================================
// REVEAL ON SCROLL
// ============================================================
const revealTargets = document.querySelectorAll(
  '.occasion-card, .countdown-grid, .venue-card, .rsvp-card, .section-title, .section-eyebrow, .invite-note p, .couples-img-container, .wish-card'
);

revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => observer.observe(el));

// ============================================================
// RSVP â€” Attendance Toggle
// ============================================================
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const attendanceInput = document.getElementById('attendanceInput');

function setAttendance(value) {
  if (attendanceInput) attendanceInput.value = value;

  if (value === 'yes') {
    if (btnYes) { btnYes.classList.add('active'); btnYes.setAttribute('aria-pressed', 'true'); }
    if (btnNo)  { btnNo.classList.remove('active'); btnNo.setAttribute('aria-pressed', 'false'); }
  } else {
    if (btnNo)  { btnNo.classList.add('active'); btnNo.setAttribute('aria-pressed', 'true'); }
    if (btnYes) { btnYes.classList.remove('active'); btnYes.setAttribute('aria-pressed', 'false'); }
  }
}

if (btnYes) btnYes.addEventListener('click', () => setAttendance('yes'));
if (btnNo)  btnNo.addEventListener('click',  () => setAttendance('no'));

// ============================================================
// RSVP — Form Submit — Google Sheets via Apps Script
// ============================================================

const APPS_SCRIPT_URL = '';
const rsvpForm    = document.getElementById('rsvpForm');
const rsvpSuccess = document.getElementById('rsvpSuccess');

if (rsvpForm) {
  const submitBtn = rsvpForm.querySelector('.rsvp-submit');

  rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameField = document.getElementById('rsvpName');

    // Basic validation
    if (!nameField.value.trim()) {
      nameField.focus();
      nameField.style.borderColor = '#6E473B';
      nameField.style.boxShadow = '0 0 0 3px rgba(110,71,59,0.18)';
      setTimeout(() => {
        nameField.style.borderColor = '';
        nameField.style.boxShadow = '';
      }, 2200);
      return;
    }

    // Collect data
    const payload = {
      attendance: attendanceInput ? attendanceInput.value : '',
      name: document.getElementById('rsvpName').value.trim(),
      mobile: document.getElementById('rsvpMobile').value.trim(),
      guests: document.getElementById('rsvpGuests').value,
      message: document.getElementById('rsvpMessage').value.trim(),
    };

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      showRsvpSuccess();
    } catch (err) {
      try {
        const existing = JSON.parse(localStorage.getItem('rsvp_responses') || '[]');
        existing.push({ ...payload, savedOffline: true, timestamp: new Date().toISOString() });
        localStorage.setItem('rsvp_responses', JSON.stringify(existing));
      } catch (_) { /* ignore */ }
      showRsvpSuccess();
      console.warn('RSVP saved offline (network error):', err);
    }
  });
}

function showRsvpSuccess() {
  if (rsvpForm)    rsvpForm.hidden    = true;
  if (rsvpSuccess) rsvpSuccess.hidden = false;
}

// ============================================================
// WISHING BOX — sends message to WhatsApp
// ============================================================

// 📱 Change this to the target WhatsApp number (international format, no + or spaces)
// Example: India +91 98765 43210  →  919876543210
const WHATSAPP_NUMBER = '919562327585'; // +91 95623 27585

const wishForm     = document.getElementById('wishForm');
const wishSuccess  = document.getElementById('wishSuccess');
const wishAgainBtn = document.getElementById('wishAgainBtn');

if (wishForm) {
  wishForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameEl = document.getElementById('wishName');
    const msgEl  = document.getElementById('wishMessage');
    const name   = nameEl.value.trim();
    const msg    = msgEl.value.trim();

    // Basic validation — highlight empty fields
    let valid = true;
    [nameEl, msgEl].forEach(el => {
      if (!el.value.trim()) {
        el.style.borderColor  = 'var(--gold)';
        el.style.boxShadow    = '0 0 0 3px rgba(200,57,58,0.20)';
        setTimeout(() => {
          el.style.borderColor = '';
          el.style.boxShadow   = '';
        }, 2200);
        valid = false;
      }
    });
    if (!valid) { nameEl.focus(); return; }

    // Build WhatsApp deep-link with pre-filled message
    const text = `*Wedding Wish for Rahoof & Naja*\n\n*From:* ${name}\n\n*Message:*\n${msg}`;
    const url  = `https://wa.me/${919562327585}?text=${encodeURIComponent(text)}`;

    window.location.href = url;

    // Show success state
    wishForm.hidden    = true;
    wishSuccess.hidden = false;
  });
}

if (wishAgainBtn) {
  wishAgainBtn.addEventListener('click', () => {
    document.getElementById('wishName').value    = '';
    document.getElementById('wishMessage').value = '';
    wishSuccess.hidden = true;
    wishForm.hidden    = false;
  });
}

