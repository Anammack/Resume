/* =====================================================
   script.js — Austin Nammack Resume Website
   ===================================================== */

/* ── NAVBAR SCROLL ──────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── HAMBURGER MENU ─────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── TYPEWRITER ─────────────────────────────────────── */
const phrases = [
  'Frontend Developer',
  'Software Engineer',
  'Web Entrepreneur',
  'UI/UX Enthusiast',
  'Open to Work 🚀',
];
const el = document.getElementById('typewriter');
let phraseIdx = 0, charIdx = 0, deleting = false, pauseTimer = null;

function type() {
  const current = phrases[phraseIdx];

  if (!deleting) {
    el.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      pauseTimer = setTimeout(type, 1800);
      return;
    }
  } else {
    el.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 50 : 80);
}
type();

/* ── INTERSECTION OBSERVER (scroll animations) ──────── */
const observerOpts = { threshold: 0.15 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children a bit
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, observerOpts);

document.querySelectorAll(
  '.timeline-item, .skill-category, .edu-card, .cert-card, [data-aos]'
).forEach(el => observer.observe(el));

/* ── ACTIVE NAV LINK ─────────────────────────────────── */
const sections = document.querySelectorAll('section[id], header[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle(
          'active',
          a.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* Active nav style */
const style = document.createElement('style');
style.textContent = `.nav-links a.active { color: var(--text) !important; }`;
document.head.appendChild(style);

/* ── PARTICLE CANVAS ─────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  const PARTICLE_COUNT = 80;
  const MAX_DIST = 120;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.r  = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset(false);
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99,179,237,${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99,179,237,${0.12 * (1 - dist / MAX_DIST)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  init();
  animate();
})();
