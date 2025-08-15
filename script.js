// Initialize AOS animation library
AOS.init({ 
  duration: 1000, 
  once: true,
  easing: 'ease-in-out',
  offset: 120
});

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? 
    '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
  });
});

// Header scroll effect
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Scroll down button
const scrollDownBtn = document.getElementById('scrollDown');
scrollDownBtn.addEventListener('click', () => {
  window.scrollTo({
    top: document.querySelector('.main-content').offsetTop,
    behavior: 'smooth'
  });
});

// Back to top button
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Background animation
const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');
let width, height;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
resize();
window.addEventListener('resize', resize);

 class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = 1 + Math.random() * 2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = 0.1 + Math.random() * 0.4;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > height) this.speedY = -this.speedY;
      }
      draw() {
        ctx.beginPath();
        let brightnessFactor = 1 + (1 - this.y / height) * 1.5;
        let glowOpacity = this.opacity * brightnessFactor;
        glowOpacity = Math.min(glowOpacity, 1);
        ctx.fillStyle = `rgba(224, 185, 115, ${glowOpacity})`;
        ctx.shadowColor = `rgba(224, 185, 115, ${glowOpacity})`;
        ctx.shadowBlur = 15 * brightnessFactor;
        ctx.arc(this.x, this.y, this.size * brightnessFactor, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }
    }

    const particles = [];
    for (let i = 0; i < 150; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }
    animate();
    // Gallery Slider Functionality
    document.addEventListener('DOMContentLoaded', function() {
      const slides = document.querySelectorAll('.gallery-slide');
      const prevBtn = document.querySelector('.prev-btn');
      const nextBtn = document.querySelector('.next-btn');
      let currentSlide = 0;
      
      // Initialize slides
      function initSlides() {
        slides.forEach((slide, index) => {
          if (index === 0) {
            slide.classList.add('current');
          } else if (index === 1) {
            slide.classList.add('next');
          } else if (index === slides.length - 1) {
            slide.classList.add('prev');
          } else {
            slide.classList.remove('prev', 'current', 'next');
          }
        });
      }
      
      // Move to next slide
      function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlides();
      }
      
      // Move to previous slide
      function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlides();
      }
      
      // Update slide positions
      function updateSlides() {
        slides.forEach((slide, index) => {
          slide.classList.remove('prev', 'current', 'next');
          
          const diff = (index - currentSlide + slides.length) % slides.length;
          
          if (diff === 0) {
            slide.classList.add('current');
          } else if (diff === 1) {
            slide.classList.add('next');
          } else if (diff === slides.length - 1) {
            slide.classList.add('prev');
          }
        });
      }
      
      // Event listeners
      nextBtn.addEventListener('click', nextSlide);
      prevBtn.addEventListener('click', prevSlide);
      
      // Initialize on load
      initSlides();
      
      // Optional: Auto-advance slides
      // setInterval(nextSlide, 5000);
    });
    // Simple quote carousel
    const quotes = document.querySelectorAll('.quote-carousel');
    let currentQuote = 0;
    
    function showNextQuote() {
      quotes.forEach(quote => quote.style.display = 'none');
      currentQuote = (currentQuote + 1) % quotes.length;
      quotes[currentQuote].style.display = 'block';
    }
    
    // Initialize - show first quote and hide others
    quotes.forEach((quote, index) => {
      quote.style.display = index === 0 ? 'block' : 'none';
    });
    
    // Rotate quotes every 5 seconds
    setInterval(showNextQuote, 5000);