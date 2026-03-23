document.addEventListener('DOMContentLoaded', function () {

  /* ===========================
     MOBILE DRAWER
  =========================== */
  const hamburger = document.getElementById('hamburger');
  const closeBtn  = document.getElementById('closeBtn');
  const drawer    = document.getElementById('mobileDrawer');
  const overlay   = document.getElementById('overlay');

  function openDrawer() {
    if (drawer)  drawer.classList.add('open');
    if (overlay) overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    if (drawer)  drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openDrawer);
  if (closeBtn)  closeBtn.addEventListener('click', closeDrawer);
  if (overlay)   overlay.addEventListener('click', closeDrawer);


  /* ===========================
     STATS COUNTER
  =========================== */
  (function () {
    'use strict';
    const counters = document.querySelectorAll('.count');
    const duration = 1800;
    let animated   = false;

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function animateCounter(el) {
      const target    = parseInt(el.getAttribute('data-target'), 10);
      const startTime = performance.now();
      function update(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.floor(easeOut(progress) * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }
      requestAnimationFrame(update);
    }

    function startAll() {
      if (animated) return;
      animated = true;
      counters.forEach(c => animateCounter(c));
    }

    const section = document.querySelector('.stats-section');
    if (section && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { startAll(); observer.disconnect(); }
        });
      }, { threshold: 0.3 });
      observer.observe(section);
    } else {
      startAll();
    }
  })();


  /* ===========================
     OUR TEAM — share popup
  =========================== */
  window.toggleShare = function (btn) {
    const wrap   = btn.closest('.card-img-wrap');
    const popup  = wrap.querySelector('.social-popup');
    const isOpen = popup.classList.contains('show');
    document.querySelectorAll('.social-popup.show').forEach(p => p.classList.remove('show'));
    if (!isOpen) popup.classList.add('show');
  };

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.card-img-wrap')) {
      document.querySelectorAll('.social-popup.show').forEach(p => p.classList.remove('show'));
    }
  });


  /* ===========================
     QUOTE FORM
  =========================== */
  const btn    = document.getElementById('quoteSubmitBtn');
  const fields = document.querySelectorAll('.q-field input, .q-field textarea');

  if (btn) {
    btn.addEventListener('click', function () {
      let valid = true;
      fields.forEach(f => { f.closest('.q-field').style.borderColor = ''; });
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
  }


  /* ===========================
     FAQ ACCORDION
  =========================== */
  (function () {
    'use strict';
    const items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      const btn = item.querySelector('.faq-head');
      if (!btn) return;
      btn.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');
        items.forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  })();


  /* ===========================
     TESTIMONIALS SLIDER (testi)
  =========================== */
  (function () {
    'use strict';
    const INTERVAL_MS = 4000;
    const track    = document.getElementById('testiTrack');
    const prevBtn  = document.getElementById('testiPrev');
    const nextBtn  = document.getElementById('testiNext');
    const dotsWrap = document.getElementById('testiDots');

    if (!track) return;

    const cards  = Array.from(track.querySelectorAll('.testi-card'));
    const total  = cards.length;
    let current  = 0;
    let timer    = null;
    let visCount = getVisCount();

    function getVisCount() {
      if (window.innerWidth <= 580) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    }
    function maxIndex()   { return Math.max(0, total - visCount); }
    function cardWidth()  { return (track.parentElement.offsetWidth + 24) / visCount; }

    function buildDots() {
      dotsWrap.innerHTML = '';
      for (let i = 0; i <= maxIndex(); i++) {
        const d = document.createElement('button');
        d.className = 'testi-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        d.addEventListener('click', () => { goTo(i); startTimer(); });
        dotsWrap.appendChild(d);
      }
    }
    function updateDots() {
      dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }
    function goTo(index) {
      current = Math.max(0, Math.min(index, maxIndex()));
      track.style.transform = 'translateX(-' + (current * cardWidth()) + 'px)';
      updateDots();
    }
    function next() { goTo(current + 1 > maxIndex() ? 0 : current + 1); }
    function prev() { goTo(current - 1 < 0 ? maxIndex() : current - 1); }
    function startTimer() { clearInterval(timer); timer = setInterval(next, INTERVAL_MS); }
    function stopTimer()  { clearInterval(timer); }

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); startTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startTimer(); });
    track.addEventListener('mouseenter', stopTimer);
    track.addEventListener('mouseleave', startTimer);

    let ttiTouchX = 0;
    track.addEventListener('touchstart', e => { ttiTouchX = e.changedTouches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = ttiTouchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); startTimer(); }
    }, { passive: true });

    let rTimer;
    window.addEventListener('resize', () => {
      clearTimeout(rTimer);
      rTimer = setTimeout(() => {
        const newVis = getVisCount();
        if (newVis !== visCount) { visCount = newVis; buildDots(); }
        current = Math.min(current, maxIndex());
        goTo(current);
      }, 150);
    });

    buildDots();
    goTo(0);
    startTimer();
  })();


  /* ===========================
     NEWSLETTER
  =========================== */
  window.subscribeNewsletter = function () {
    const input  = document.getElementById('newsletterEmail');
    if (!input) return;
    const val = input.value.trim();
    if (!val || !val.includes('@')) {
      input.style.borderBottom = '1px solid #e74c3c';
      input.focus();
      return;
    }
    input.style.borderBottom = '';
    const subBtn = document.querySelector('.btn-subscribe');
    if (!subBtn) return;
    subBtn.innerHTML        = 'Subscribed ✓';
    subBtn.style.background = '#27ae60';
    subBtn.disabled         = true;
    setTimeout(() => {
      input.value             = '';
      subBtn.innerHTML        = 'Subscribe <i class="fa-regular fa-paper-plane"></i>';
      subBtn.style.background = '';
      subBtn.disabled         = false;
    }, 2500);
  };


  /* ===========================
     TESTIMONIALS SLIDER (ts — 2 card left-panel)
  =========================== */
  (function () {
    'use strict';

    const tsTrack  = document.getElementById('tsTrack');
    const tsPrev   = document.getElementById('tsPrev');
    const tsNext   = document.getElementById('tsNext');
    const tsDotsEl = document.getElementById('tsDots');

    if (!tsTrack) return;

    const tsCards = Array.from(tsTrack.querySelectorAll('.ts-card'));
    const tsTotal = tsCards.length;
    const GAP     = 24;
    let tsCurrent = 0;
    let tsTimer;

    function tsGetVisible()  { return window.innerWidth <= 640 ? 1 : 2; }
    function tsTotalSlides() { return Math.ceil(tsTotal / tsGetVisible()); }

    function tsSetSizes() {
      const vis   = tsGetVisible();
      const contW = tsTrack.parentElement.offsetWidth;
      const cardW = (contW - GAP * (vis - 1)) / vis;
      tsCards.forEach(c => {
        c.style.width    = cardW + 'px';
        c.style.minWidth = cardW + 'px';
      });
      tsTrack.style.width = (tsTotal * cardW + (tsTotal - 1) * GAP) + 'px';
    }

    function tsGetOffset(index) {
      const vis   = tsGetVisible();
      const contW = tsTrack.parentElement.offsetWidth;
      const cardW = (contW - GAP * (vis - 1)) / vis;
      return index * vis * (cardW + GAP);
    }

    function tsBuildDots() {
      if (!tsDotsEl) return;
      tsDotsEl.innerHTML = '';
      for (let i = 0; i < tsTotalSlides(); i++) {
        const d = document.createElement('button');
        d.className = 'ts-dot' + (i === tsCurrent ? ' active' : '');
        d.setAttribute('aria-label', 'Slide ' + (i + 1));
        d.addEventListener('click', () => { tsGoTo(i); tsResetAuto(); });
        tsDotsEl.appendChild(d);
      }
    }

    function tsUpdateDots() {
      if (!tsDotsEl) return;
      tsDotsEl.querySelectorAll('.ts-dot').forEach((d, i) => d.classList.toggle('active', i === tsCurrent));
    }

    function tsGoTo(index) {
      const slides = tsTotalSlides();
      tsCurrent = ((index % slides) + slides) % slides;
      tsTrack.style.transform = 'translateX(-' + tsGetOffset(tsCurrent) + 'px)';
      tsUpdateDots();
    }

    function tsStartAuto() { clearInterval(tsTimer); tsTimer = setInterval(() => tsGoTo(tsCurrent + 1), 4000); }
    function tsResetAuto() { clearInterval(tsTimer); tsStartAuto(); }

    if (tsPrev) tsPrev.addEventListener('click', () => { tsGoTo(tsCurrent - 1); tsResetAuto(); });
    if (tsNext) tsNext.addEventListener('click', () => { tsGoTo(tsCurrent + 1); tsResetAuto(); });

    tsTrack.addEventListener('mouseenter', () => clearInterval(tsTimer));
    tsTrack.addEventListener('mouseleave', tsResetAuto);

    let tsTouchX = 0;
    tsTrack.addEventListener('touchstart', e => { tsTouchX = e.touches[0].clientX; }, { passive: true });
    tsTrack.addEventListener('touchend', e => {
      const diff = tsTouchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? tsGoTo(tsCurrent + 1) : tsGoTo(tsCurrent - 1); tsResetAuto(); }
    }, { passive: true });

    let tsResizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(tsResizeTimer);
      tsResizeTimer = setTimeout(() => { tsSetSizes(); tsBuildDots(); tsGoTo(0); }, 150);
    });

    function tsInit() { tsSetSizes(); tsBuildDots(); tsGoTo(0); tsStartAuto(); }

    if (document.readyState === 'complete') {
      tsInit();
    } else {
      window.addEventListener('load', tsInit);
    }

  })();

}); // end DOMContentLoaded


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