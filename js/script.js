const hamburger = document.getElementById('hamburger');
  const closeBtn = document.getElementById('closeBtn');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('overlay');
 
  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }
 
  hamburger.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  /* ===========================
   HERO SLIDER — hero.js
=========================== */

(function () {
  'use strict';

  /* ── Config ── */
  const AUTO_PLAY    = true;
  const INTERVAL_MS  = 5000;   // 5 seconds between slides

  /* ── State ── */
  let current  = 0;
  let timer    = null;
  let isAnim   = false;

  /* ── Elements ── */
  const slides  = document.querySelectorAll('.slide');
  const dots    = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const fabTop  = document.getElementById('fabTop');
  const total   = slides.length;

  /* ── Go to slide ── */
  function goTo(index) {
    if (isAnim || index === current) return;
    isAnim = true;

    // Remove active from current
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');

    // Wrap index
    current = (index + total) % total;

    // Activate new slide
    slides[current].classList.add('active');
    dots[current].classList.add('active');

    // Allow next transition after CSS duration (800ms)
    setTimeout(() => { isAnim = false; }, 850);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  /* ── Auto-play ── */
  function startTimer() {
    if (!AUTO_PLAY) return;
    clearInterval(timer);
    timer = setInterval(next, INTERVAL_MS);
  }

  function stopTimer() {
    clearInterval(timer);
  }

  /* ── Arrow buttons ── */
  nextBtn.addEventListener('click', () => { next(); startTimer(); });
  prevBtn.addEventListener('click', () => { prev(); startTimer(); });

  /* ── Dot navigation ── */
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index, 10));
      startTimer();
    });
  });

  /* ── Pause on hover ── */
  const slider = document.getElementById('heroSlider');
  slider.addEventListener('mouseenter', stopTimer);
  slider.addEventListener('mouseleave', startTimer);

  /* ── Touch / swipe support ── */
  let touchStartX = 0;
  let touchEndX   = 0;

  slider.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  slider.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {          // minimum swipe distance
      diff > 0 ? next() : prev();
      startTimer();
    }
  }, { passive: true });

  /* ── Keyboard navigation ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { next(); startTimer(); }
    if (e.key === 'ArrowLeft')  { prev(); startTimer(); }
  });

  /* ── Back to top button ── */
  if (fabTop) {
    fabTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Init ── */
  startTimer();

})();

/* ===========================
   PORTFOLIO SLIDER — portfolio.js
=========================== */

(function () {
  'use strict';

  /* ── Config ── */
  const AUTO_PLAY   = true;
  const INTERVAL_MS = 3500;

  /* ── Elements ── */
  const track    = document.getElementById('portfolioTrack');
  const prevBtn  = document.getElementById('portPrev');
  const nextBtn  = document.getElementById('portNext');
  const dotsWrap = document.getElementById('portDots');

  if (!track) return;

  const slides     = Array.from(track.querySelectorAll('.port-slide'));
  const totalSlides = slides.length;

  let current   = 0;
  let timer     = null;
  let visCount  = getVisibleCount();  // how many slides are visible at once

  /* ── How many slides fit at once based on viewport ── */
  function getVisibleCount() {
    if (window.innerWidth <= 580) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  /* ── Maximum index we can scroll to ── */
  function maxIndex() {
    return Math.max(0, totalSlides - visCount);
  }

  /* ── Build dot buttons ── */
  function buildDots() {
    dotsWrap.innerHTML = '';
    const count = maxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const btn = document.createElement('button');
      btn.className = 'port-dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
      btn.addEventListener('click', () => { goTo(i); startTimer(); });
      dotsWrap.appendChild(btn);
    }
  }

  /* ── Update dots ── */
  function updateDots() {
    const dots = dotsWrap.querySelectorAll('.port-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  /* ── Slide width including gap ── */
  function slideWidth() {
    const gap = 20;   // matches CSS gap
    const outer = track.parentElement;
    return (outer.offsetWidth + gap) / visCount;
  }

  /* ── Move track ── */
  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    track.style.transform = `translateX(-${current * slideWidth()}px)`;
    updateDots();
  }

  function next() { goTo(current + 1 > maxIndex() ? 0 : current + 1); }
  function prev() { goTo(current - 1 < 0 ? maxIndex() : current - 1); }

  /* ── Auto-play ── */
  function startTimer() {
    if (!AUTO_PLAY) return;
    clearInterval(timer);
    timer = setInterval(next, INTERVAL_MS);
  }

  function stopTimer() { clearInterval(timer); }

  /* ── Arrow buttons ── */
  nextBtn.addEventListener('click', () => { next(); startTimer(); });
  prevBtn.addEventListener('click', () => { prev(); startTimer(); });

  /* ── Pause on hover ── */
  track.addEventListener('mouseenter', stopTimer);
  track.addEventListener('mouseleave', startTimer);

  /* ── Touch / swipe ── */
  let touchStartX = 0;

  track.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
      startTimer();
    }
  }, { passive: true });

  /* ── Keyboard ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { next(); startTimer(); }
    if (e.key === 'ArrowLeft')  { prev(); startTimer(); }
  });

  /* ── Recalculate on resize ── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newVis = getVisibleCount();
      if (newVis !== visCount) {
        visCount = newVis;
        buildDots();
      }
      current = Math.min(current, maxIndex());
      goTo(current);
    }, 150);
  });

  /* ── Init ── */
  buildDots();
  goTo(0);
  startTimer();

})();

/* ── Quote Modal ── */
const modal    = document.getElementById('quoteModal');
const modalCloseBtn = document.getElementById('modalClose');
const planName = document.getElementById('modalPlanName');

window.openQuoteModal = function (plan) {
  if (!modal || !planName) return;

  planName.textContent = 'Selected Plan: ' + plan;
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
};

function closeQuoteModal() {
  if (!modal) return;

  modal.classList.remove('show');
  document.body.style.overflow = '';
}

if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeQuoteModal);
}

/* ===========================
   STATS COUNTER — stats.js
   Animated count-up when section scrolls into view
=========================== */

(function () {
  'use strict';

  const counters  = document.querySelectorAll('.count');
  const duration  = 1800; // ms for the animation
  let   animated  = false;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    const target    = parseInt(el.getAttribute('data-target'), 10);
    const startTime = performance.now();

    function update(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOut(progress) * target);
      el.textContent = value;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  function startAll() {
    if (animated) return;
    animated = true;
    counters.forEach(c => animateCounter(c));
  }

  /* ── Trigger on scroll into view (IntersectionObserver) ── */
  const section = document.querySelector('.stats-section');

  if (section && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAll();
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(section);
  } else {
    // Fallback: run immediately if observer not supported
    startAll();
  }

})();


/* ===========================
   OUR TEAM — team.js
=========================== */

window.toggleShare = function (btn) {
  const wrap   = btn.closest('.card-img-wrap');
  const popup  = wrap.querySelector('.social-popup');
  const isOpen = popup.classList.contains('show');

  // Close ALL other open popups first
  document.querySelectorAll('.social-popup.show').forEach(p => {
    p.classList.remove('show');
  });

  // Toggle this one
  if (!isOpen) {
    popup.classList.add('show');
  }
};

// Close popups when clicking anywhere outside a card
document.addEventListener('click', function (e) {
  if (!e.target.closest('.card-img-wrap')) {
    document.querySelectorAll('.social-popup.show').forEach(p => {
      p.classList.remove('show');
    });
  }
});


const btn    = document.getElementById('quoteSubmitBtn');
  const fields = document.querySelectorAll('.q-field input, .q-field textarea');
 
  btn.addEventListener('click', function () {
    let valid = true;
 
    fields.forEach(f => {
      f.closest('.q-field').style.borderColor = '';
    });
 
    fields.forEach(f => {
      if (!f.value.trim()) {
        f.closest('.q-field').style.borderColor = '#e74c3c';
        valid = false;
      }
    });
 
    if (!valid) return;
 
    btn.innerHTML = 'Submitted ✓';
    btn.classList.add('success');
    btn.disabled = true;
 
    setTimeout(() => {
      fields.forEach(f => f.value = '');
      btn.innerHTML = 'Request Quote &nbsp;<i class="fa-solid fa-bell"></i>';
      btn.classList.remove('success');
      btn.disabled = false;
    }, 2500);
  });

  /* ===========================
   FAQ ACCORDION — faq.js
=========================== */

(function () {
  'use strict';

  const items = document.querySelectorAll('.faq-item');

  items.forEach(function (item) {
    const btn = item.querySelector('.faq-head');

    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Close all open items
      items.forEach(function (i) {
        i.classList.remove('open');
      });

      // If it was closed, open it
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

})();

/* ===========================
   TESTIMONIALS SLIDER — testimonials.js
=========================== */

(function () {
  'use strict';

  const INTERVAL_MS = 4000;

  const track    = document.getElementById('testiTrack');
  const prevBtn  = document.getElementById('testiPrev');
  const nextBtn  = document.getElementById('testiNext');
  const dotsWrap = document.getElementById('testiDots');

  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.testi-card'));
  const total = cards.length;
  let current = 0;
  let timer   = null;
  let visCount = getVisCount();

  function getVisCount() {
    if (window.innerWidth <= 580) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, total - visCount);
  }

  /* ── Build dots ── */
  function buildDots() {
    dotsWrap.innerHTML = '';
    const count = maxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const btn = document.createElement('button');
      btn.className = 'testi-dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
      btn.addEventListener('click', () => { goTo(i); startTimer(); });
      dotsWrap.appendChild(btn);
    }
  }

  function updateDots() {
    const dots = dotsWrap.querySelectorAll('.testi-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  /* ── Card width + gap ── */
  function cardWidth() {
    const gap = 24;
    return (track.parentElement.offsetWidth + gap) / visCount;
  }

  /* ── Move ── */
  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    track.style.transform = `translateX(-${current * cardWidth()}px)`;
    updateDots();
  }

  function next() { goTo(current + 1 > maxIndex() ? 0 : current + 1); }
  function prev() { goTo(current - 1 < 0 ? maxIndex() : current - 1); }

  /* ── Auto-play ── */
  function startTimer() {
    clearInterval(timer);
    timer = setInterval(next, INTERVAL_MS);
  }

  function stopTimer() { clearInterval(timer); }

  /* ── Controls ── */
  nextBtn.addEventListener('click', () => { next(); startTimer(); });
  prevBtn.addEventListener('click', () => { prev(); startTimer(); });

  /* ── Pause on hover ── */
  track.addEventListener('mouseenter', stopTimer);
  track.addEventListener('mouseleave', startTimer);

  /* ── Touch swipe ── */
  let touchStartX = 0;

  track.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
      startTimer();
    }
  }, { passive: true });

  /* ── Keyboard ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { next(); startTimer(); }
    if (e.key === 'ArrowLeft')  { prev(); startTimer(); }
  });

  /* ── Resize ── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newVis = getVisCount();
      if (newVis !== visCount) {
        visCount = newVis;
        buildDots();
      }
      current = Math.min(current, maxIndex());
      goTo(current);
    }, 150);
  });

  /* ── Init ── */
  buildDots();
  goTo(0);
  startTimer();

})();

function subscribeNewsletter() {
  const input = document.getElementById('newsletterEmail');
  const val = input.value.trim();
  if (!val || !val.includes('@')) {
    input.style.borderBottom = '1px solid #e74c3c';
    input.focus();
    return;
  }
  input.style.borderBottom = '';
  const btn = document.querySelector('.btn-subscribe');
  btn.innerHTML = 'Subscribed ✓';
  btn.style.background = '#27ae60';
  btn.disabled = true;
  setTimeout(() => {
    input.value = '';
    btn.innerHTML = 'Subscribe <i class="fa-regular fa-paper-plane"></i>';
    btn.style.background = '';
    btn.disabled = false;
  }, 2500);
}

function toggleShare(button) {
  const card = button.closest('.card-img-wrap');
  const popup = card.querySelector('.social-popup');

  // Close all other popups
  document.querySelectorAll('.social-popup').forEach(p => {
    if (p !== popup) p.classList.remove('active');
  });

  // Toggle current one
  popup.classList.toggle('active');
}


// JS — optional tooltip on hover
document.querySelectorAll('.fab').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    const label = btn.getAttribute('aria-label');
    btn.setAttribute('title', label);
  });
});