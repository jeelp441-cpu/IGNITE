(() => {
  "use strict";

  /* ───────────────────────────────────────────────
     1. HERO SLIDER
     ─────────────────────────────────────────────── */
  const initSlider = () => {
    const slides = document.querySelectorAll(".slide");
    const dotsContainer = document.getElementById("slider-dots");
    const prevBtn = document.getElementById("slider-prev");
    const nextBtn = document.getElementById("slider-next");
    if (!slides.length || !dotsContainer) return;

    let current = 0;
    let interval = null;
    let paused = false;
    const DELAY = 5000;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".dot");

    const goTo = (index) => {
      slides[current].classList.remove("slide-active");
      dots[current].classList.remove("active");
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("slide-active");
      dots[current].classList.add("active");
    };

    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);

    const startAutoplay = () => {
      stopAutoplay();
      interval = setInterval(() => {
        if (!paused) next();
      }, DELAY);
    };

    const stopAutoplay = () => {
      if (interval) clearInterval(interval);
      interval = null;
    };

    // Pause on hover
    const hero = slides[0]?.closest(".hero") || slides[0]?.parentElement;
    if (hero) {
      hero.addEventListener("mouseenter", () => (paused = true));
      hero.addEventListener("mouseleave", () => (paused = false));
    }

    prevBtn?.addEventListener("click", () => { prev(); startAutoplay(); });
    nextBtn?.addEventListener("click", () => { next(); startAutoplay(); });

    startAutoplay();
  };

  /* ───────────────────────────────────────────────
     2 & 8. NAVBAR SCROLL (transparent → white)
     ─────────────────────────────────────────────── */
  const initNavbar = () => {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    const SCROLL_THRESHOLD = 10;

    const onScroll = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  };

  /* ───────────────────────────────────────────────
     SMOOTH SCROLL for anchor links
     ─────────────────────────────────────────────── */
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href");
        if (id === "#" || id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      });
    });
  };

  /* ───────────────────────────────────────────────
     3. MOBILE MENU
     ─────────────────────────────────────────────── */
  const initMobileMenu = () => {
    const toggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");
    if (!toggle || !navLinks) return;

    toggle.addEventListener("click", () => {
      toggle.classList.toggle("active");
      navLinks.classList.toggle("active");
    });

    navLinks.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.classList.remove("active");
        navLinks.classList.remove("active");
      });
    });
  };

  /* ───────────────────────────────────────────────
     4. ACTIVE NAV on scroll
     ─────────────────────────────────────────────── */
  const initActiveNav = () => {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");
    if (!sections.length || !navLinks.length) return;

    const onScroll = () => {
      const scrollPos = window.scrollY + 120;

      let activeId = "";
      sections.forEach((section) => {
        if (section.offsetTop <= scrollPos) {
          activeId = section.getAttribute("id");
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${activeId}`) {
          link.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  };

  /* ───────────────────────────────────────────────
     5. SCROLL REVEAL (IntersectionObserver)
     ─────────────────────────────────────────────── */
  const initScrollReveal = () => {
    const selectors = [
      ".feature-card",
      ".product-card",
      ".service-card",
      ".contact-card",
      ".about-grid",
      ".section-header",
      ".stat-box",
      ".contact-form",
      ".cta-banner",
    ];

    const elements = document.querySelectorAll(selectors.join(", "));
    if (!elements.length) return;

    // Add .reveal to all target elements
    elements.forEach((el) => el.classList.add("reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          // Stagger children
          const children = el.children;
          if (children.length > 1) {
            Array.from(children).forEach((child, i) => {
              child.style.transitionDelay = `${i * 0.1}s`;
            });
          }

          el.classList.add("active");
          observer.unobserve(el);
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
  };

  /* ───────────────────────────────────────────────
     6. COUNTER ANIMATION
     ─────────────────────────────────────────────── */
  const initCounters = () => {
    const statsSection = document.querySelector(".stats-section");
    const statNums = document.querySelectorAll(".stat-num");
    if (!statsSection || !statNums.length) return;

    let animated = false;

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) return;

      const duration = 2000;
      const start = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(easeOutQuart(progress) * target);

        el.textContent = value + "+";

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target + "+";
        }
      };

      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            statNums.forEach(animateCounter);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(statsSection);
  };

  /* ───────────────────────────────────────────────
     7. CONTACT FORM (Web3Forms)
     ─────────────────────────────────────────────── */
  const initContactForm = () => {
    const form = document.getElementById("contact-form");
    const submitBtn = document.getElementById("submit-btn");
    if (!form || !submitBtn) return;

    const originalText = submitBtn.textContent;

    const resetBtn = () => {
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.backgroundColor = "";
        submitBtn.style.color = "";
        submitBtn.disabled = false;
      }, 3000);
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          submitBtn.textContent = "✓ Sent!";
          submitBtn.style.backgroundColor = "#16a34a";
          submitBtn.style.color = "#fff";
          form.reset();
        } else {
          throw new Error("Submission failed");
        }
      } catch {
        submitBtn.textContent = "✕ Failed";
        submitBtn.style.backgroundColor = "#dc2626";
        submitBtn.style.color = "#fff";
      }

      resetBtn();
    });
  };

  /* ───────────────────────────────────────────────
     INIT
     ─────────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    initSlider();
    initNavbar();
    initSmoothScroll();
    initMobileMenu();
    initActiveNav();
    initScrollReveal();
    initCounters();
    initContactForm();
  });
})();
