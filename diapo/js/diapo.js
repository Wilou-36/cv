/* ════════════════════════════════════════════════════
   DIAPO.JS — fichier unique
   Contient : Constellation · Moteur slides · Slider
              images + Lightbox · Barres compétences
              Navigation page (fade) · Hash URL
════════════════════════════════════════════════════ */

/* ════════════════════════════
   1. CONSTELLATION (diapo.html uniquement)
════════════════════════════ */
(function () {
  const canvas = document.getElementById('bg');
  if (!canvas) return; // absent sur les pages projet

  const ctx = canvas.getContext('2d');
  let W, H, stars;
  const mouse = { x: -9999, y: -9999 };

  function init() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const n = Math.floor(W * H / 8500);
    stars = Array.from({ length: n }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.3 + 0.2,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
      a:  Math.random() * Math.PI * 2
    }));
  }

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('resize', init);

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    if (!stars) return;
    stars.forEach(s => {
      const dx = mouse.x - s.x, dy = mouse.y - s.y;
      const d  = Math.hypot(dx, dy);
      if (d > 0 && d < 150) { s.vx += dx / d * 0.011; s.vy += dy / d * 0.011; }
      s.vx *= 0.97; s.vy *= 0.97;
      s.x  += s.vx;  s.y  += s.vy;
      if (s.x < 0 || s.x > W) s.vx *= -1;
      if (s.y < 0 || s.y > H) s.vy *= -1;
      s.a += 0.008;
      const al = 0.22 + Math.sin(s.a) * 0.18;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(79,142,247,${al})`;
      ctx.fill();
    });
    const LINK = 88;
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x, dy = stars[i].y - stars[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < LINK) {
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.strokeStyle = `rgba(79,142,247,${(1 - d / LINK) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  }());

  init();
}());

/* ════════════════════════════
   2. MOTEUR DIAPORAMA (diapo.html uniquement)
════════════════════════════ */
(function () {
  const stage = document.getElementById('stage');
  if (!stage) return; // absent sur les pages projet

  const LABELS = [
    'Accueil', 'Tableau de synthèse', 'Projets',
    'Bancaire & Crypto', 'Portfolio', 'Suivi sportif',
    'Conclusion'
  ];
  const slideEls = Array.from(document.querySelectorAll('.sl'));
  const TOTAL    = slideEls.length;
  let cur = 0;

  const elPrev    = document.getElementById('btn-prev');
  const elNext    = document.getElementById('btn-next');
  const elDots    = document.getElementById('dots');
  const elCtr     = document.getElementById('slide-counter');
  const elTbNum   = document.getElementById('tb-num');
  const elTbSlide = document.getElementById('tb-slide');
  const elPbar    = document.getElementById('pbar');

  // Créer les dots
  LABELS.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'dot' + (i === 0 ? ' on' : '');
    d.addEventListener('click', () => goTo(i));
    elDots.appendChild(d);
  });

  function updateUI() {
    if (elTbNum)   elTbNum.textContent   = String(cur).padStart(2, '0');
    if (elTbSlide) elTbSlide.textContent = LABELS[cur];
    if (elCtr)     elCtr.textContent     = (cur + 1) + '/' + TOTAL;
    elPrev.disabled = cur === 0;
    elNext.disabled = cur === TOTAL - 1;
    elPbar.style.width = TOTAL > 1 ? (cur / (TOTAL - 1) * 100) + '%' : '0%';
    elDots.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('on', i === cur));
  }

  function goTo(to) {
    to = Math.max(0, Math.min(to, TOTAL - 1));
    if (to === cur) return;
    const dir  = to > cur ? 1 : -1;
    const from = cur;
    slideEls[from].classList.remove('active');
    slideEls[from].classList.add(dir > 0 ? 'exit-left' : 'exit-right');
    setTimeout(() => slideEls[from].classList.remove('exit-left', 'exit-right'), 500);
    slideEls[to].style.transition = 'none';
    slideEls[to].style.transform  = dir > 0 ? 'translateX(100%)' : 'translateX(-100%)';
    slideEls[to].style.opacity    = '0';
    void slideEls[to].offsetWidth;
    slideEls[to].style.transition = '';
    slideEls[to].style.transform  = '';
    slideEls[to].style.opacity    = '';
    slideEls[to].classList.add('active');
    slideEls[to].scrollTop = 0;
    cur = to;
    updateUI();
  }

  function next() { goTo(cur + 1); }
  function prev() { goTo(cur - 1); }

  // Exposer pour les boutons onclick HTML
  window.goTo = goTo;
  window.next = next;
  window.prev = prev;

  // Clavier
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); prev(); }
    if (e.key === 'f') {
      document.fullscreenElement
        ? document.exitFullscreen()
        : document.documentElement.requestFullscreen();
    }
  });

  // Swipe mobile
  let touchStartX = 0;
  window.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  window.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
  });

  // Hash URL : diapo.html#s2 → goTo(2)
  (function () {
    const m = window.location.hash.match(/^#s(\d+)$/);
    if (m) {
      const t = parseInt(m[1]);
      if (t > 0 && t < TOTAL) goTo(t);
    }
  })();

  updateUI();
}());

/* ════════════════════════════
   3. SLIDER IMAGES + LIGHTBOX (pages projet)
════════════════════════════ */
/* ════════════════════════════
   3. SLIDER IMAGES + LIGHTBOX (pages projet)
════════════════════════════ */
(function () {

  // ── Slider interne (.on) ──
  window.sliderNav = function (id, dir) {
    const box  = document.getElementById(id);
    if (!box) return;

    const imgs = Array.from(box.querySelectorAll('img'));
    if (!imgs.length) return;

    const idx = imgs.findIndex(i => i.classList.contains('on'));
    if (idx === -1) return;

    imgs[idx].classList.remove('on');
    imgs[(idx + dir + imgs.length) % imgs.length].classList.add('on');
  };

  window.sliderNext = id => sliderNav(id,  1);
  window.sliderPrev = id => sliderNav(id, -1);


  // ── Slider classique + Lightbox ──
  document.addEventListener('DOMContentLoaded', () => {

    const slideImgs = Array.from(document.querySelectorAll('.slide-img'));
    if (!slideImgs.length) return;

    let index = 0;

    function showSlide(i) {
      slideImgs.forEach(s => s.classList.remove('active'));
      slideImgs[i].classList.add('active');
    }

    const btnNext = document.getElementById('next');
    const btnPrev = document.getElementById('prev');

    if (btnNext) btnNext.addEventListener('click', () => {
      index = (index + 1) % slideImgs.length;
      showSlide(index);
    });

    if (btnPrev) btnPrev.addEventListener('click', () => {
      index = (index - 1 + slideImgs.length) % slideImgs.length;
      showSlide(index);
    });


    // ── LIGHTBOX ──
    slideImgs.forEach(img => {

      img.style.cursor = 'zoom-in';

      img.addEventListener('click', () => {

        // ✔ CORRECTION PRINCIPALE
        let lightboxIndex = slideImgs.indexOf(img);

        const overlay = document.createElement('div');
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.style.cssText = `
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        `;

        const bigImg = document.createElement('img');
        bigImg.style.cssText = `
          max-width: 90vw;
          max-height: 90vh;
          border-radius: 8px;
          object-fit: contain;
        `;

        function updateLightbox() {
          bigImg.src = slideImgs[lightboxIndex].src;
          bigImg.alt = slideImgs[lightboxIndex].alt || '';
          index = lightboxIndex;
          showSlide(index);
        }

        updateLightbox();


        // boutons
        const btnPrev = document.createElement('button');
        btnPrev.textContent = '⬅';
        btnPrev.style.cssText = `
          position: fixed;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.5rem;
          background: rgba(255,255,255,0.15);
          border: none;
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
        `;

        const btnNext = document.createElement('button');
        btnNext.textContent = '➡';
        btnNext.style.cssText = `
          position: fixed;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.5rem;
          background: rgba(255,255,255,0.15);
          border: none;
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
        `;

        const btnClose = document.createElement('button');
        btnClose.textContent = '✕';
        btnClose.style.cssText = `
          position: fixed;
          top: 16px;
          right: 20px;
          font-size: 1.2rem;
          background: rgba(255,255,255,0.15);
          border: none;
          color: white;
          padding: 4px 10px;
          border-radius: 8px;
          cursor: pointer;
        `;


        // actions
        btnPrev.addEventListener('click', e => {
          e.stopPropagation();
          lightboxIndex = (lightboxIndex - 1 + slideImgs.length) % slideImgs.length;
          updateLightbox();
        });

        btnNext.addEventListener('click', e => {
          e.stopPropagation();
          lightboxIndex = (lightboxIndex + 1) % slideImgs.length;
          updateLightbox();
        });

        btnClose.addEventListener('click', e => {
          e.stopPropagation();
          overlay.remove();
          document.removeEventListener('keydown', onKeydown);
        });


        function onKeydown(e) {
          if (e.key === 'Escape') {
            overlay.remove();
            document.removeEventListener('keydown', onKeydown);
          }
          if (e.key === 'ArrowRight') {
            lightboxIndex = (lightboxIndex + 1) % slideImgs.length;
            updateLightbox();
          }
          if (e.key === 'ArrowLeft') {
            lightboxIndex = (lightboxIndex - 1 + slideImgs.length) % slideImgs.length;
            updateLightbox();
          }
        }

        document.addEventListener('keydown', onKeydown);


        overlay.addEventListener('click', e => {
          if (e.target === overlay) {
            overlay.remove();
            document.removeEventListener('keydown', onKeydown);
          }
        });


        overlay.appendChild(bigImg);
        overlay.appendChild(btnPrev);
        overlay.appendChild(btnNext);
        overlay.appendChild(btnClose);

        document.body.appendChild(overlay);
      });
    });

  });

})();

/* ════════════════════════════
   4. BARRES COMPÉTENCES (banc.html)
════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const bars = document.querySelectorAll('.fill');
  if (bars.length) {
    setTimeout(() => {
      bars.forEach(bar => { bar.style.width = bar.dataset.width || bar.dataset.w || '0%'; });
    }, 400);
  }
});

/* ════════════════════════════
   5. NAVIGATION PAGE AVEC FADE (pages projet)
════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('.nav')) return; // absent sur diapo.html

  document.body.classList.add('fade-in');

  function navigate(url) {
    document.body.classList.remove('fade-in');
    document.body.classList.add('fade-out');
    setTimeout(() => { window.location.href = url; }, 300);
  }

  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', e => { e.preventDefault(); navigate(link.href); });
  });

  // Clavier sur les pages projet (flèches désactivées — conflit avec lightbox)
  document.addEventListener('keydown', e => {
    if (e.key === 'f') {
      document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
    }
  });
});
