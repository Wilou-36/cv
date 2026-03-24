document.addEventListener("DOMContentLoaded", () => {

  /* 🎬 SLIDER */
  let index = 0;
  const slides = document.querySelectorAll(".slide-img");

  function showSlide(i) {
    slides.forEach(s => s.classList.remove("active"));
    slides[i].classList.add("active");
  }

  document.getElementById("next").addEventListener("click", () => {
    index = (index + 1) % slides.length;
    showSlide(index);
  });

  document.getElementById("prev").addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
  });

  /* 🔍 LIGHTBOX */
  slides.forEach(img => {
    img.style.cursor = 'zoom-in';

    img.addEventListener('click', () => {
      let lightboxIndex = index;

      const overlay = document.createElement('div');
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Visionneuse d\'image');
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
      bigImg.src = slides[lightboxIndex].src;
      bigImg.alt = slides[lightboxIndex].alt || 'Capture du projet';
      bigImg.style.cssText = `
        max-width: 90vw;
        max-height: 90vh;
        border-radius: 8px;
        object-fit: contain;
      `;

      const btnPrev = document.createElement('button');
      btnPrev.textContent = '⬅';
      btnPrev.setAttribute('aria-label', 'Image précédente');
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
        z-index: 10000;
      `;

      const btnNext = document.createElement('button');
      btnNext.textContent = '➡';
      btnNext.setAttribute('aria-label', 'Image suivante');
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
        z-index: 10000;
      `;

      const btnClose = document.createElement('button');
      btnClose.textContent = '✕';
      btnClose.setAttribute('aria-label', 'Fermer la visionneuse');
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
        z-index: 10000;
      `;

      function updateLightbox() {
        bigImg.src = slides[lightboxIndex].src;
        bigImg.alt = slides[lightboxIndex].alt || 'Capture du projet';
        index = lightboxIndex;
        showSlide(index);
      }

      btnPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        lightboxIndex = (lightboxIndex - 1 + slides.length) % slides.length;
        updateLightbox();
      });

      btnNext.addEventListener('click', (e) => {
        e.stopPropagation();
        lightboxIndex = (lightboxIndex + 1) % slides.length;
        updateLightbox();
      });

      btnClose.addEventListener('click', (e) => {
        e.stopPropagation();
        overlay.remove();
      });

      /* Fermer avec Escape */
      function onKeydown(e) {
        if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', onKeydown); }
        if (e.key === 'ArrowRight') { e.stopPropagation(); lightboxIndex = (lightboxIndex + 1) % slides.length; updateLightbox(); }
        if (e.key === 'ArrowLeft') { e.stopPropagation(); lightboxIndex = (lightboxIndex - 1 + slides.length) % slides.length; updateLightbox(); }
      }
      document.addEventListener('keydown', onKeydown);

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) { overlay.remove(); document.removeEventListener('keydown', onKeydown); }
      });

      overlay.appendChild(bigImg);
      overlay.appendChild(btnPrev);
      overlay.appendChild(btnNext);
      overlay.appendChild(btnClose);
      document.body.appendChild(overlay);
      btnClose.focus();
    });
  });

  /* 🍩 GRAPH PORTFOLIO */
  const ctx = document.getElementById('projectChart');
  if (ctx) {
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Frontend', 'JavaScript', 'Design', 'UX'],
        datasets: [{
          data: [40, 30, 20, 10],
          backgroundColor: ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981']
        }]
      },
      options: {
        cutout: '70%',
        plugins: { legend: { display: false } }
      }
    });
  }

});
