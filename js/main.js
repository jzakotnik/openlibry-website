/**
 * OpenLibry Website - Main JavaScript
 * Minimal, vanilla JS with no external dependencies
 */

(function() {
  'use strict';

  // DOM Elements
  const header = document.querySelector('.header');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const themeToggle = document.querySelector('.theme-toggle');
  const fadeElements = document.querySelectorAll('.fade-in');

  // =====================
  // Theme Management
  // =====================
  
  function getPreferredTheme() {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
  }

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const sunIcon = themeToggle.querySelector('.icon-sun');
    const moonIcon = themeToggle.querySelector('.icon-moon');
    if (sunIcon && moonIcon) {
      sunIcon.style.display = theme === 'dark' ? 'block' : 'none';
      moonIcon.style.display = theme === 'light' ? 'block' : 'none';
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Initialize theme
  setTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // =====================
  // Header Scroll Effect
  // =====================
  
  let lastScroll = 0;
  
  function handleScroll() {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class when past threshold
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // =====================
  // Mobile Menu
  // =====================
  
  function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  }

  function closeMobileMenu() {
    mobileMenuBtn.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile menu when clicking a link
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // Close mobile menu on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // =====================
  // Smooth Scroll
  // =====================
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // =====================
  // Scroll Animations (IntersectionObserver)
  // =====================
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally unobserve after animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));

  // =====================
  // Video Lazy Loading & Controls
  // =====================
  
  const videos = document.querySelectorAll('video[data-src]');
  
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target;
        const source = video.querySelector('source');
        if (source && video.dataset.src) {
          source.src = video.dataset.src;
          video.load();
        }
        videoObserver.unobserve(video);
      }
    });
  }, { rootMargin: '100px' });

  videos.forEach(video => videoObserver.observe(video));

  // Auto-play videos when in viewport
  const autoPlayVideos = document.querySelectorAll('video[data-autoplay]');
  
  const autoPlayObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => {
          // Autoplay prevented, that's okay
        });
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.5 });

  autoPlayVideos.forEach(video => autoPlayObserver.observe(video));

  // =====================
  // Screenshot Carousel (Auto-scrolling)
  // =====================
  
  const carousel = document.querySelector('.screenshots-wrapper');
  
  if (carousel) {
    let isDown = false;
    let startX;
    let scrollLeft;
    let animationId;
    let isHovering = false;
    let isPaused = false;
    
    const scrollSpeed = 0.8; // Pixels per frame (slow speed)
    const items = carousel.querySelectorAll('.screenshot-item');
    const originalItemCount = 5; // Number of original items (not duplicates)
    
    // Calculate the width of original items (for seamless reset)
    function getResetPoint() {
      let totalWidth = 0;
      for (let i = 0; i < originalItemCount; i++) {
        if (items[i]) {
          totalWidth += items[i].offsetWidth + 24; // 24px = gap (var(--space-6))
        }
      }
      return totalWidth;
    }
    
    // Auto-scroll function using requestAnimationFrame for smooth scrolling
    function autoScroll() {
      if (!isHovering && !isDown && !isPaused) {
        carousel.scrollLeft += scrollSpeed;
        
        // Seamless loop: when we've scrolled past original items, jump back
        const resetPoint = getResetPoint();
        if (carousel.scrollLeft >= resetPoint) {
          carousel.scrollLeft = 0;
        }
      }
      
      animationId = requestAnimationFrame(autoScroll);
    }
    
    // Start auto-scrolling
    function startAutoScroll() {
      if (animationId) return;
      animationId = requestAnimationFrame(autoScroll);
    }
    
    // Stop auto-scrolling
    function stopAutoScroll() {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }
    
    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
      isHovering = true;
    });
    
    carousel.addEventListener('mouseleave', () => {
      isHovering = false;
      isDown = false;
      carousel.style.cursor = 'grab';
    });
    
    // Pause on touch
    carousel.addEventListener('touchstart', () => {
      isPaused = true;
    }, { passive: true });
    
    carousel.addEventListener('touchend', () => {
      // Resume after a short delay
      setTimeout(() => {
        isPaused = false;
      }, 3000);
    }, { passive: true });
    
    // Manual drag functionality
    carousel.addEventListener('mousedown', (e) => {
      isDown = true;
      carousel.style.cursor = 'grabbing';
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseup', () => {
      isDown = false;
      carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2;
      carousel.scrollLeft = scrollLeft - walk;
    });
    
    // Start auto-scroll when carousel is visible
    const carouselObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAutoScroll();
        } else {
          stopAutoScroll();
        }
      });
    }, { threshold: 0.2 });
    
    carouselObserver.observe(carousel);
    
    // Respect reduced motion preference
    if (prefersReducedMotion.matches) {
      stopAutoScroll();
    }
    
    // Cleanup on page hide
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoScroll();
      } else {
        startAutoScroll();
      }
    });
  }

  // =====================
  // Counter Animation
  // =====================
  
  function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeOut);
      
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    }
    
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('[data-counter]');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.counter, 10);
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // =====================
  // Form Handling
  // =====================
  
  const ctaForm = document.querySelector('.cta-form');
  
  if (ctaForm) {
    ctaForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;
      
      if (email) {
        // Open email client with pre-filled subject
        window.location.href = `mailto:info@openlibry.de?subject=Demo%20Anfrage&body=Meine%20E-Mail%20Adresse:%20${encodeURIComponent(email)}`;
      }
    });
  }

  // =====================
  // Keyboard Navigation
  // =====================
  
  // Focus visible polyfill-like behavior
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });

  // =====================
  // Performance: Reduce motion for accessibility
  // =====================
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  if (prefersReducedMotion.matches) {
    // Disable animations
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-base', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
    
    // Make fade-in elements visible immediately
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  // =====================
  // Copy to Clipboard (for code snippets)
  // =====================
  
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async function() {
      const text = this.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        const originalText = this.textContent;
        this.textContent = 'Kopiert!';
        setTimeout(() => {
          this.textContent = originalText;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  });

  // =====================
  // Console Easter Egg
  // =====================
  
  console.log('%c📚 OpenLibry', 'font-size: 24px; font-weight: bold; color: #14b8a6;');
  console.log('%cDie freie Schulbücherei-Software', 'font-size: 14px; color: #a1a1aa;');
  console.log('%cInteressiert an der Entwicklung? → https://github.com/jzakotnik/openlibry', 'font-size: 12px; color: #71717a;');

})();
