// ===== Cursor Glow =====
const glow = document.createElement('div');
glow.classList.add('cursor-glow');
document.body.appendChild(glow);

// ===== Cursor Ring =====
const ring = document.createElement('div');
ring.classList.add('cursor-ring');
document.body.appendChild(ring);

// Smooth ring follow
let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;
function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

// ===== Cursor Sparkle Trail =====
const sparkleColors = [
    'rgba(192,121,42,0.7)',
    'rgba(212,160,74,0.6)',
    'rgba(232,194,116,0.5)',
    'rgba(180,140,80,0.5)',
    'rgba(255,200,100,0.4)'
];
let lastSparkle = 0;

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.classList.add('cursor-sparkle');
    const size = Math.random() * 6 + 3;
    sparkle.style.width = size + 'px';
    sparkle.style.height = size + 'px';
    sparkle.style.left = x + (Math.random() - 0.5) * 20 + 'px';
    sparkle.style.top = y + (Math.random() - 0.5) * 20 + 'px';
    sparkle.style.background = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
    sparkle.style.boxShadow = `0 0 ${size + 2}px ${sparkle.style.background}`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
}

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';

    // Throttle sparkles for performance
    const now = Date.now();
    if (now - lastSparkle > 40) {
        createSparkle(e.clientX, e.clientY);
        lastSparkle = now;
    }
});

// ===== Hover Detection for Ring =====
document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, .service-card, .portfolio-card, .social-link, .nav-toggle, input, textarea')) {
        ring.classList.add('hovering');
    }
});
document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, .service-card, .portfolio-card, .social-link, .nav-toggle, input, textarea')) {
        ring.classList.remove('hovering');
    }
});

// ===== Particle Background =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.2 + 0.04;
        this.color = Math.random() > 0.5 ? '192,121,42' : '180,140,80';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < 60; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(192,121,42,${0.03 * (1 - dist / 140)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== Navbar =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));

// ===== Mobile Menu =====
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
navToggle.addEventListener('click', () => { navToggle.classList.toggle('active'); navLinks.classList.toggle('active'); });
navLinks.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => { navToggle.classList.remove('active'); navLinks.classList.remove('active'); }));

// ===== Active Link =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const y = window.scrollY + 100;
    sections.forEach(s => {
        const link = document.querySelector(`.nav-link[href="#${s.id}"]`);
        if (link) link.classList.toggle('active', y >= s.offsetTop && y < s.offsetTop + s.offsetHeight);
    });
});

// ===== Counter Animation =====
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(c => {
        const target = +c.dataset.target;
        const start = performance.now();
        function tick(now) {
            const p = Math.min((now - start) / 2000, 1);
            const ease = 1 - Math.pow(1 - p, 4);
            c.textContent = Math.floor(ease * target);
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    });
}

// ===== Scroll Reveal with Stagger =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            if (entry.target.closest('.hero-stats') || entry.target.classList.contains('hero-stats')) animateCounters();
            // Stagger children
            const children = entry.target.querySelectorAll('.glass-card, .service-card, .portfolio-card, .testimonial-card');
            children.forEach((child, i) => {
                child.style.transitionDelay = `${i * 0.12}s`;
                setTimeout(() => child.classList.add('active'), 10);
            });
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.section-header, .glass-card, .service-card, .portfolio-card, .cta-box, .hero-stats, .about-grid, .services-grid, .portfolio-grid, .testimonials-slider, .contact-grid').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// ===== Tilt Effect on Cards =====
document.querySelectorAll('.service-card, .glass-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-8px) perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
});

// ===== Contact Form (Web3Forms) =====
document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;

    try {
        const formData = new FormData(this);
        const obj = Object.fromEntries(formData);
        const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(obj)
        });
        const data = await res.json();

        if (data.success) {
            btn.innerHTML = '<span>✓ Inquiry Sent!</span>';
            btn.style.background = 'linear-gradient(135deg, #43e97b, #38f9d7)';
            this.reset();
        } else {
            btn.innerHTML = '<span>✕ Failed — Try Again</span>';
            btn.style.background = 'linear-gradient(135deg, #f5576c, #ff6b6b)';
        }
    } catch (err) {
        btn.innerHTML = '<span>✕ Error — Try Again</span>';
        btn.style.background = 'linear-gradient(135deg, #f5576c, #ff6b6b)';
    }

    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
    }, 3000);
});

// ===== Hero line reveal structure =====
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const html = heroTitle.innerHTML;
    const lines = html.split('<br>');
    heroTitle.innerHTML = lines.map(l => `<span class="line"><span class="line-inner">${l.trim()}</span></span>`).join('');
}
