/**
 * ==========================================================================
 * ANANDHABALAN D — .NET FULL STACK ENGINEER PORTFOLIO
 * Vanilla JavaScript interactions, animations, theme handling, and form validation
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. THEME SWITCHER (Dark / Light with localStorage Persistence)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve stored theme or default to 'dark'
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    });
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  }

  // --------------------------------------------------------------------------
  // 2. HERO TYPING EFFECT
  // Cycles through exact 4 roles:
  // - ".NET Full Stack Engineer"
  // - "ASP.NET Core Developer"
  // - "Azure & Cloud Enthusiast"
  // - "Angular Developer"
  // --------------------------------------------------------------------------
  const typingElement = document.getElementById('typing-text');
  const roles = [
    ".NET Full Stack Engineer",
    "ASP.NET Core Developer",
    "Azure & Cloud Enthusiast",
    "Angular Developer"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 90;
  const deletingSpeed = 45;
  const delayBetweenWords = 1800;

  function typeEffect() {
    if (!typingElement) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      // Remove characters
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Add characters
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at end of completed word
      speed = delayBetweenWords;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Word completely deleted, move to next role
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 400; // Small pause before typing next word
    }

    setTimeout(typeEffect, speed);
  }

  // Initialize typing effect
  typeEffect();

  // --------------------------------------------------------------------------
  // 3. TOP SCROLL PROGRESS BAR
  // --------------------------------------------------------------------------
  const scrollProgressBar = document.getElementById('scroll-progress');
  const navbar = document.getElementById('navbar');
  const floatingTopBtn = document.getElementById('floating-top-btn');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${progress}%`;
    }

    // Navbar blur background increase on scroll
    if (navbar) {
      if (scrollTop > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Floating Back to Top Button visibility
    if (floatingTopBtn) {
      if (scrollTop > 450) {
        floatingTopBtn.classList.add('visible');
      } else {
        floatingTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  // Floating Back to Top Click
  if (floatingTopBtn) {
    floatingTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 4. MOBILE HAMBURGER MENU
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      toggleMenu(!isOpen);
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target) && navMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  function toggleMenu(open) {
    if (!hamburgerBtn || !navMenu) return;
    hamburgerBtn.classList.toggle('active', open);
    navMenu.classList.toggle('open', open);
    hamburgerBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  // --------------------------------------------------------------------------
  // 5. ACTIVE NAVBAR SECTION HIGHLIGHTING (IntersectionObserver)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const navObserverOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => navObserver.observe(section));

  // --------------------------------------------------------------------------
  // 6. ANIMATED STAT COUNTERS
  // Animates counters when they scroll into view
  // --------------------------------------------------------------------------
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 1400; // ms
          const start = 0;
          const startTime = performance.now();

          function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * (target - start) + start);

            counter.textContent = current;

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              counter.textContent = target;
            }
          }

          requestAnimationFrame(updateCount);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.35 });

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) {
    countObserver.observe(statsSection);
  }

  // --------------------------------------------------------------------------
  // 7. CARD 3D TILT EFFECT
  // Subtle interactive tilt for project cards
  // --------------------------------------------------------------------------
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      // Disable on touch / small mobile screens
      if (window.innerWidth < 768) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6; // Max 6 deg
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      card.style.transition = 'transform 0.4s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });

  // --------------------------------------------------------------------------
  // 8. SCROLL REVEAL ANIMATIONS
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.fade-in, .skill-category-card, .project-card, .timeline-item, .credential-card');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  });

  revealElements.forEach(el => {
    el.classList.add('fade-in');
    revealObserver.observe(el);
  });

  // --------------------------------------------------------------------------
  // 9. ACCESSIBLE CONTACT FORM VALIDATION & HANDLING
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submit-btn');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear previous states
      let isValid = true;
      clearFormErrors();

      // Validate Name (at least 2 non-whitespace characters)
      const nameVal = nameInput.value.trim();
      if (nameVal.length < 2) {
        setFieldError(nameInput, true);
        isValid = false;
      }

      // Validate Email (standard regex)
      const emailVal = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        setFieldError(emailInput, true);
        isValid = false;
      }

      // Validate Message (at least 10 characters)
      const messageVal = messageInput.value.trim();
      if (messageVal.length < 10) {
        setFieldError(messageInput, true);
        isValid = false;
      }

      if (!isValid) {
        showFeedback('Please correct the highlighted fields before submitting.', 'error');
        return;
      }

      // Simulate form processing state
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending Message...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;

        // Display success message
        showFeedback(`Thank you, ${nameVal}! Your message has been received. I will get back to you shortly at ${emailVal}.`, 'success');

        // Optional: trigger mailto backup or form reset
        contactForm.reset();
        clearFormErrors();
      }, 1000);
    });

    // Real-time input error removal
    [nameInput, emailInput, messageInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          setFieldError(input, false);
          if (formFeedback.classList.contains('error')) {
            formFeedback.style.display = 'none';
          }
        });
      }
    });
  }

  function setFieldError(inputElement, hasError) {
    const parentGroup = inputElement.closest('.form-group');
    if (parentGroup) {
      if (hasError) {
        parentGroup.classList.add('has-error');
      } else {
        parentGroup.classList.remove('has-error');
      }
    }
  }

  function clearFormErrors() {
    const errorGroups = document.querySelectorAll('.form-group.has-error');
    errorGroups.forEach(group => group.classList.remove('has-error'));
    if (formFeedback) {
      formFeedback.className = 'form-feedback';
      formFeedback.style.display = 'none';
      formFeedback.textContent = '';
    }
  }

  function showFeedback(message, type) {
    if (!formFeedback) return;
    formFeedback.textContent = message;
    formFeedback.className = `form-feedback ${type}`;
    formFeedback.style.display = 'block';
  }

  // --------------------------------------------------------------------------
  // 10. CURRENT YEAR IN FOOTER
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
