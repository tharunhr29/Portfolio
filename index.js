/* ==========================================================================
   INITIALIZATION & LUCIDE ICONS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // Initialize all features
  initThemeToggle();
  initMobileMenu();
  initCustomCursor();
  initScrollProgressBar();
  initTypewriter();
  initCanvasParticles();
  initScrollReveals();
  initProjectFilters();
  initStatsCounter();
  initContactForm();
  initBentoHoverGlow();
});

/* ==========================================================================
   THEME TOGGLE
   ========================================================================== */
let isDarkMode = true;

function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Read saved theme or default to system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    if (savedTheme === 'light') {
      htmlElement.classList.remove('dark');
      htmlElement.classList.add('light');
      isDarkMode = false;
    } else {
      htmlElement.classList.remove('light');
      htmlElement.classList.add('dark');
      isDarkMode = true;
    }
  } else {
    // Default to dark
    htmlElement.classList.add('dark');
    isDarkMode = true;
  }

  themeToggleBtn.addEventListener('click', () => {
    if (isDarkMode) {
      htmlElement.classList.remove('dark');
      htmlElement.classList.add('light');
      localStorage.setItem('portfolio-theme', 'light');
      isDarkMode = false;
    } else {
      htmlElement.classList.remove('light');
      htmlElement.classList.add('dark');
      localStorage.setItem('portfolio-theme', 'dark');
      isDarkMode = true;
    }
    // Dispatch custom event to notify canvas system to change particle colors
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark: isDarkMode } }));
  });
}

/* ==========================================================================
   MOBILE NAVBAR MENU
   ========================================================================== */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-link-cta');

  mobileToggle.addEventListener('click', () => {
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', !isExpanded);
    mobileToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });
}

/* ==========================================================================
   CUSTOM INTERACTIVE CURSOR WITH LERP PHYSICS
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById('custom-cursor');
  const follower = document.getElementById('custom-cursor-follower');

  if (!dot || !follower) return;

  let mouseX = 0, mouseY = 0; // Target coordinates
  let dotX = 0, dotY = 0;     // Instant dot coordinates
  let followerX = 0, followerY = 0; // Lerped follower coordinates

  // Update target coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot moves instantly
    dotX = mouseX;
    dotY = mouseY;
    dot.style.left = `${dotX}px`;
    dot.style.top = `${dotY}px`;
  });

  // Smooth out follower movement with Linear Interpolation (lerp)
  function animateFollower() {
    // Lerp formula: current = current + (target - current) * speed
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;

    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;

    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Detect interactive elements to expand cursor
  const interactiveSelectors = 'a, button, input, textarea, .filter-btn, .project-card-inner';
  
  function addHoverListeners() {
    const interactives = document.querySelectorAll(interactiveSelectors);
    
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('hovering');
      });
    });
  }

  addHoverListeners();

  // Run periodically in case DOM updates
  const observer = new MutationObserver(addHoverListeners);
  observer.observe(document.body, { childList: true, subtree: true });
}

/* ==========================================================================
   SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scroll-progress-bar');
  
  window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPosition = window.scrollY;
    
    if (scrollHeight > 0) {
      const percentage = (scrollPosition / scrollHeight) * 100;
      progressBar.style.width = `${percentage}%`;
    } else {
      progressBar.style.width = '0%';
    }
  });
}

/* ==========================================================================
   DYNAMIC TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const textElement = document.getElementById('typing-text');
  if (!textElement) return;

  const roles = [
    'Full Stack MERN Developer',
    'MERN Stack Specialist',
    'Scalable App Architect',
    'UI/UX Design Enthusiast'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100; // ms per character

  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      textElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Deletes faster than typing
    } else {
      textElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    // Finished typing entire word
    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1500; // Wait before deleting
    } 
    // Finished deleting word
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Wait before typing next
    }

    setTimeout(type, typingSpeed);
  }

  // Start typing
  type();
}

/* ==========================================================================
   REACTIVE CANVAS PARTICLES
   ========================================================================== */
function initCanvasParticles() {
  const canvas = document.getElementById('canvas-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  let width = canvas.width = canvas.offsetWidth;
  let height = canvas.height = canvas.offsetHeight;

  const particles = [];
  const particleCount = 65;
  const connectionDistance = 110;
  
  // Track mouse position inside hero
  let mouse = { x: null, y: null, radius: 120 };

  const heroSection = document.getElementById('hero');
  heroSection.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  heroSection.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2.5 + 1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDarkMode ? 'rgba(6, 182, 212, 0.4)' : 'rgba(37, 99, 235, 0.25)';
      ctx.fill();
    }

    update() {
      // Drift movement
      this.x += this.vx;
      this.y += this.vy;

      // Screen boundaries wrap
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Repulsion force from mouse
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.hypot(dx, dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          
          // Gently push particles outward
          this.x += Math.cos(angle) * force * 2.5;
          this.y += Math.sin(angle) * force * 2.5;
        }
      }
    }
  }

  // Create particle pool
  function populateParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  populateParticles();

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw & update particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = isDarkMode 
            ? `rgba(168, 85, 247, ${alpha})` 
            : `rgba(139, 92, 246, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();

  // Resize canvas event handler
  window.addEventListener('resize', () => {
    cancelAnimationFrame(animationFrameId);
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    populateParticles();
    animate();
  });

  // Re-render when theme changes to adjust particle colors instantly
  window.addEventListener('themeChanged', () => {
    // Simply redrawing runs with revised isDarkMode condition inside requestAnimationFrame loop
  });

  // Custom particle trigger: submit success animation
  window.addEventListener('formSuccessBlast', () => {
    // Burst particles from center of canvas
    const centerX = width / 2;
    const centerY = height / 2;

    for (let k = 0; k < 60; k++) {
      const p = new Particle();
      p.x = centerX;
      p.y = centerY;
      // High speed explosion vectors
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      particles.push(p);
    }

    // Trim back down to original size after 3 seconds
    setTimeout(() => {
      if (particles.length > particleCount) {
        particles.splice(particleCount);
      }
    }, 3000);
  });
}

/* ==========================================================================
   SCROLL-TRIGGER REVEALS (Framer Motion emulation)
   ========================================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-fade-up');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12 // Trigger when 12% is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    observer.observe(el);
  });
}

/* ==========================================================================
   PROJECT FILTERING MENU
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const tags = card.getAttribute('data-tags').split(' ');

        if (filterValue === 'all' || tags.includes(filterValue)) {
          card.classList.remove('hidden');
          // Trigger slight reflow to restart CSS transitions
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          // Fully hide after animation completes
          setTimeout(() => {
            if (card.style.opacity === '0') {
              card.classList.add('hidden');
            }
          }, 350);
        }
      });
    });
  });
}

/* ==========================================================================
   ANIMATED STATISTICS COUNT-UP
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let hasAnimated = false;

  const targetSection = document.getElementById('about');
  if (!targetSection) return;

  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting && !hasAnimated) {
      hasAnimated = true;
      
      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'), 10);
        const duration = 2000; // 2 seconds total count animation
        const stepTime = Math.max(Math.floor(duration / target), 30);
        let start = 0;

        const timer = setInterval(() => {
          start += 1;
          stat.textContent = start;

          if (start >= target) {
            stat.textContent = target; // Ensure exact final count matches data-target
            clearInterval(timer);
          }
        }, stepTime);
      });

      // Stop observing after firing once
      observer.unobserve(targetSection);
    }
  }, { threshold: 0.1 });

  observer.observe(targetSection);
}

/* ==========================================================================
   CONTACT FORM VALIDATION & INTERACTIVE FEEDBACK
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successOverlay = document.getElementById('form-success-overlay');
  const closeSuccessBtn = document.getElementById('success-close-btn');

  if (!form || !successOverlay) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    
    // Select input controls
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');

    // 1. Name Check
    if (nameInput.value.trim() === '') {
      setError(nameInput);
      isValid = false;
    } else {
      clearError(nameInput);
    }

    // 2. Email Check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      setError(emailInput);
      isValid = false;
    } else {
      clearError(emailInput);
    }

    // 3. Subject Check
    if (subjectInput.value.trim() === '') {
      setError(subjectInput);
      isValid = false;
    } else {
      clearError(subjectInput);
    }

    // 4. Message Check
    if (messageInput.value.trim() === '') {
      setError(messageInput);
      isValid = false;
    } else {
      clearError(messageInput);
    }

    if (isValid) {
      const submitBtn = document.getElementById('form-submit-btn');
      const originalText = submitBtn.innerHTML;
      
      // Visual feedback: show sending state
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending... <span class="pulse-indicator"></span>';

      const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        subject: subjectInput.value.trim(),
        message: messageInput.value.trim(),
        access_key: "e9758439-ed3f-4000-8614-a68ea8f8da40"
      };

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(async (response) => {
        const json = await response.json();
        if (response.status === 200) {
          // Clear inputs on success
          nameInput.value = '';
          emailInput.value = '';
          subjectInput.value = '';
          messageInput.value = '';

          // Open custom premium modal popup
          successOverlay.classList.add('active');

          // Blast dynamic particle canvas confetti
          window.dispatchEvent(new CustomEvent('formSuccessBlast'));
        } else {
          // Show error message
          alert(json.message || "Failed to send message. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Mail submission error:", error);
        alert("An error occurred. Please check your network connection.");
      })
      .finally(() => {
        // Reset submit button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      });
    }
  });

  closeSuccessBtn.addEventListener('click', () => {
    successOverlay.classList.remove('active');
  });

  // Helpers for feedback UI
  function setError(input) {
    const parent = input.parentElement;
    parent.classList.add('has-error');
  }

  function clearError(input) {
    const parent = input.parentElement;
    parent.classList.remove('has-error');
  }
}

/* ==========================================================================
   BENTO GRID MOUSE FOCUS GLOW GLASSMORPHISM
   ========================================================================== */
function initBentoHoverGlow() {
  const bentoCards = document.querySelectorAll('.bento-card');

  bentoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate inside the element.
      const y = e.clientY - rect.top;  // y coordinate inside the element.

      // Set custom properties to drive radial-gradient background placement
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}
