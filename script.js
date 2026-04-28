// ===== Cursor Glow =====
const glow = document.createElement('div');
glow.classList.add('cursor-glow');
document.body.appendChild(glow);
document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
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
        this.opacity = Math.random() * 0.4 + 0.05;
        this.color = Math.random() > 0.5 ? '212,160,74' : '232,194,116';
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
                ctx.strokeStyle = `rgba(212,160,74,${0.04 * (1 - dist / 140)})`;
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
