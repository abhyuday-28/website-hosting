if (window.AOS) {
  AOS.init({
    duration: 850,
    once: true,
    easing: 'ease-out-cubic',
    offset: 80
  });
}

const toggleInput = document.getElementById('languageToggle');
const mobileMenuBtn = document.getElementById('navbarToggle');
const navLinks = document.getElementById('navbarMenu');
const header = document.getElementById('pageHeader');
const backToTopBtn = document.getElementById('backToTop');
const scrollDownBtn = document.getElementById('scrollDown');
const sections = document.querySelectorAll('.section-shell');
const navAnchors = document.querySelectorAll('.nav-links a');
const scrollTargets = Array.from(document.querySelectorAll('.hero, .stats-band, .section-shell, footer'));
let autoScrollTimer = null;
let autoScrollFrame = null;
let isAutoScrolling = false;

function stopAutoScroll() {
  isAutoScrolling = false;

  if (autoScrollTimer) {
    clearInterval(autoScrollTimer);
    autoScrollTimer = null;
  }

  if (autoScrollFrame) {
    cancelAnimationFrame(autoScrollFrame);
    autoScrollFrame = null;
  }
}

function setLanguage(isEnglish) {
  document.querySelectorAll('.hindi').forEach((el) => {
    el.style.display = isEnglish ? 'none' : '';
  });

  document.querySelectorAll('.english').forEach((el) => {
    el.style.display = isEnglish ? '' : 'none';
  });

  document.documentElement.lang = isEnglish ? 'en' : 'hi';
}

if (toggleInput) {
  setLanguage(toggleInput.checked);
  toggleInput.addEventListener('change', function () {
    setLanguage(this.checked);
  });
}

function toggleMobileMenu(forceState) {
  if (!navLinks || !mobileMenuBtn) return;

  const shouldOpen = typeof forceState === 'boolean' ? forceState : !navLinks.classList.contains('active');
  navLinks.classList.toggle('active', shouldOpen);
  mobileMenuBtn.classList.toggle('active', shouldOpen);
  mobileMenuBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
}

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => toggleMobileMenu());
}

navAnchors.forEach((anchor) => {
  anchor.addEventListener('click', () => toggleMobileMenu(false));
});

function updateHeaderState() {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 24);
}

function updateBackToTop() {
  if (!backToTopBtn) return;
  backToTopBtn.classList.toggle('visible', window.scrollY > 520);
}

function updateActiveNav() {
  const scrollPoint = window.scrollY + 180;

  sections.forEach((section) => {
    const id = section.getAttribute('id');
    const start = section.offsetTop;
    const end = start + section.offsetHeight;
    const active = scrollPoint >= start && scrollPoint < end;

    navAnchors.forEach((anchor) => {
      if (anchor.getAttribute('href') === `#${id}`) {
        anchor.classList.toggle('active', active);
      }
    });
  });
}

function refreshViewportUIState() {
  updateHeaderState();
  updateBackToTop();
  updateActiveNav();
}

function scrollToTarget(targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  const offset = header ? header.offsetHeight + 30 : 90;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

function scrollToNextSection() {
  if (isAutoScrolling || autoScrollTimer || autoScrollFrame) {
    stopAutoScroll();
    return;
  }

  isAutoScrolling = true;

  const isMobile = window.innerWidth <= 640;

  if (isMobile) {
    autoScrollTimer = window.setInterval(() => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

      if (atBottom) {
        stopAutoScroll();
        return;
      }

      window.scrollBy({
        top: 10,
        behavior: 'auto'
      });
    }, 16);

    return;
  }

  let lastTimestamp = null;
  const pixelsPerSecond = 760;

  const step = (timestamp) => {
    if (!isAutoScrolling) {
      stopAutoScroll();
      return;
    }

    if (lastTimestamp === null) {
      lastTimestamp = timestamp;
    }

    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) {
      stopAutoScroll();
      return;
    }

    const distance = (pixelsPerSecond * delta) / 1000;
    window.scrollTo({
      top: Math.min(window.scrollY + distance, document.documentElement.scrollHeight - window.innerHeight),
      behavior: 'auto'
    });
    autoScrollFrame = requestAnimationFrame(step);
  };

  autoScrollFrame = requestAnimationFrame(step);
}

if (scrollDownBtn) {
  scrollDownBtn.addEventListener('click', scrollToNextSection);
}

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    stopAutoScroll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    event.preventDefault();
    stopAutoScroll();
    scrollToTarget(href);
  });
});

window.addEventListener('wheel', () => {
  stopAutoScroll();
}, { passive: true });

window.addEventListener('touchmove', () => {
  stopAutoScroll();
}, { passive: true });

window.addEventListener('keydown', (event) => {
  const keysThatScroll = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', 'Space'];
  if (keysThatScroll.includes(event.code) || keysThatScroll.includes(event.key)) {
    stopAutoScroll();
  }
});

window.addEventListener('scroll', () => {
  updateHeaderState();
  updateBackToTop();
  updateActiveNav();
});

window.addEventListener('resize', () => {
  refreshViewportUIState();
  resizeCanvas();
});

window.addEventListener('load', () => {
  window.scrollTo({ left: 0, top: window.scrollY, behavior: 'auto' });
  refreshViewportUIState();
  window.setTimeout(refreshViewportUIState, 120);
  window.setTimeout(refreshViewportUIState, 360);
});

window.addEventListener('pageshow', () => {
  window.scrollTo({ left: 0, top: window.scrollY, behavior: 'auto' });
  refreshViewportUIState();
  window.setTimeout(refreshViewportUIState, 120);
});

refreshViewportUIState();

function createLoopSlider({ selector, prevSelector, nextSelector, autoAdvanceMs = 0 }) {
  const slides = Array.from(document.querySelectorAll(selector));
  const prevBtn = document.querySelector(prevSelector);
  const nextBtn = document.querySelector(nextSelector);
  let current = 0;
  let timer = null;

  if (!slides.length) return;

  function render() {
    slides.forEach((slide, index) => {
      slide.classList.remove('prev', 'current', 'next');

      const diff = (index - current + slides.length) % slides.length;
      if (diff === 0) slide.classList.add('current');
      else if (diff === 1) slide.classList.add('next');
      else if (diff === slides.length - 1) slide.classList.add('prev');
    });
  }

  function next() {
    current = (current + 1) % slides.length;
    render();
  }

  function prev() {
    current = (current - 1 + slides.length) % slides.length;
    render();
  }

  function restartTimer() {
    if (!autoAdvanceMs) return;
    clearInterval(timer);
    timer = setInterval(next, autoAdvanceMs);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      next();
      restartTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prev();
      restartTimer();
    });
  }

  render();
  restartTimer();
}

createLoopSlider({
  selector: '.gallery-slide',
  prevSelector: '.prev-btn',
  nextSelector: '.next-btn',
  autoAdvanceMs: 4500
});

createLoopSlider({
  selector: '.book-slide',
  prevSelector: '.prev-book',
  nextSelector: '.next-book',
  autoAdvanceMs: 0
});

const quotes = Array.from(document.querySelectorAll('.quote-carousel'));
let currentQuote = 0;

function showQuote(index) {
  quotes.forEach((quote, quoteIndex) => {
    quote.style.display = quoteIndex === index ? 'flex' : 'none';
  });
}

if (quotes.length) {
  showQuote(currentQuote);
  setInterval(() => {
    currentQuote = (currentQuote + 1) % quotes.length;
    showQuote(currentQuote);
  }, 5000);
}

const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let width = 0;
let height = 0;

function resizeCanvas() {
  if (!canvas || !ctx) return;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = 1.4 + Math.random() * 2.8;
    this.speedX = (Math.random() - 0.5) * 0.16;
    this.speedY = (Math.random() - 0.5) * 0.14;
    this.opacity = 0.08 + Math.random() * 0.24;
    this.phase = Math.random() * Math.PI * 2;
    this.phaseSpeed = 0.004 + Math.random() * 0.01;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.phase += this.phaseSpeed;
    this.x += Math.sin(this.phase) * 0.12;
    this.y += Math.cos(this.phase * 0.8) * 0.08;

    if (this.x < -20 || this.x > width + 20 || this.y < -20 || this.y > height + 20) {
      this.reset();
    }
  }

  draw() {
    if (!ctx) return;
    ctx.beginPath();
    const glowRadius = this.size * 14;
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowRadius);
    gradient.addColorStop(0, `rgba(255, 215, 163, ${this.opacity})`);
    gradient.addColorStop(0.45, `rgba(243, 183, 107, ${this.opacity * 0.65})`);
    gradient.addColorStop(1, 'rgba(243, 183, 107, 0)');
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 244, 227, ${Math.min(this.opacity + 0.25, 0.5)})`;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const particles = [];

if (canvas && ctx) {
  resizeCanvas();

  for (let i = 0; i < 65; i += 1) {
    particles.push(new Particle());
  }

  const drawGradientWash = () => {
    const gradientA = ctx.createRadialGradient(width * 0.18, height * 0.15, 0, width * 0.18, height * 0.15, width * 0.45);
    gradientA.addColorStop(0, 'rgba(243, 183, 107, 0.08)');
    gradientA.addColorStop(1, 'rgba(243, 183, 107, 0)');

    const gradientB = ctx.createRadialGradient(width * 0.82, height * 0.2, 0, width * 0.82, height * 0.2, width * 0.35);
    gradientB.addColorStop(0, 'rgba(86, 130, 255, 0.08)');
    gradientB.addColorStop(1, 'rgba(86, 130, 255, 0)');

    ctx.fillStyle = gradientA;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = gradientB;
    ctx.fillRect(0, 0, width, height);
  };

  const animate = () => {
    ctx.clearRect(0, 0, width, height);
    drawGradientWash();
    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });
    requestAnimationFrame(animate);
  };

  animate();
}
