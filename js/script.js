/* ── Theme toggle ── */
const htmlEl = document.documentElement;
const toggleBtn = document.getElementById('themeToggle');
const thumb = document.getElementById('toggleThumb');
const saved = localStorage.getItem('theme') || 'dark';
if (saved === 'light') applyLight();
toggleBtn.addEventListener('click', () => {
  if (htmlEl.classList.contains('light')) { applyDark(); localStorage.setItem('theme', 'dark'); }
  else { applyLight(); localStorage.setItem('theme', 'light'); }
});
function applyLight() { htmlEl.classList.add('light'); thumb.textContent = '☀️'; }
function applyDark() { htmlEl.classList.remove('light'); thumb.textContent = '🌙'; }

/* ── Cursor glow ── */
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

/* ── Scroll reveal ── */
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 65);
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => obs.observe(el));

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav ul li a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
  navLinks.forEach(a => { a.classList.toggle('active', a.getAttribute('href') === '#' + current); });
}, { passive: true });

/* ── Réalisations filter ── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.real-card').forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.type === filter) ? '' : 'none';
    });
  });
});

/* ── Mobile hamburger ── */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
let menuOpen = false;
hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  hamburger.setAttribute('aria-expanded', menuOpen);
  navMenu.style.cssText = menuOpen
    ? 'display:flex;flex-direction:column;position:fixed;top:68px;left:0;right:0;background:var(--nav-bg);backdrop-filter:blur(24px);padding:16px 24px;gap:4px;border-bottom:1px solid var(--border);z-index:199;'
    : '';
});

/* ── Fermer menu mobile au clic sur un lien ── */
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (menuOpen) {
      menuOpen = false;
      hamburger.setAttribute('aria-expanded', 'false');
      navMenu.style.cssText = '';
    }
  });
});
