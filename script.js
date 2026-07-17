// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------- Scroll progress bar ----------
const progressBar = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
  backToTop.classList.toggle('show', scrollTop > 500);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---------- Active nav link highlighting ----------
const sections = document.querySelectorAll('section[id], .hero[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(sec => navObserver.observe(sec));

// ---------- Scroll-reveal animation ----------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---------- Lazy-loaded gallery images ----------
// Images are only requested once they're near the viewport, each figure
// shows a shimmer skeleton until its photo has finished loading, then
// fades in. If a load genuinely fails (wrong path / case mismatch /
// missing file) the figure now shows a visible "Image unavailable"
// state instead of shimmering forever with no explanation.
const galleryItems = document.querySelectorAll('.gallery-item[data-src]');

function loadGalleryImage(item) {
  const src = item.getAttribute('data-src');
  if (!src || item.dataset.loading === 'true') return;
  item.dataset.loading = 'true';

  const img = new Image();
  img.alt = item.querySelector('figcaption strong')?.textContent || 'Gallery photo';
  img.decoding = 'async';

  img.onload = () => {
    item.prepend(img);
    requestAnimationFrame(() => {
      img.classList.add('loaded');
      item.classList.add('loaded');
    });
  };

  img.onerror = () => {
    console.error('Failed to load image:', src);
    item.classList.add('load-error');
  };

  img.src = src;
}

const imgObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadGalleryImage(entry.target);
      imgObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '250px 0px' }); // start fetching a bit before it scrolls into view

galleryItems.forEach(item => imgObserver.observe(item));
