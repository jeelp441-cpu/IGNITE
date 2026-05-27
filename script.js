// ===== Cursor Glow =====
const glow = document.createElement('div');
glow.style.cssText = 'position:fixed;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(200,146,42,0.06),transparent 70%);pointer-events:none;z-index:0;transform:translate(-50%,-50%);transition:0.08s linear';
document.body.appendChild(glow);

// ===== Cursor Ring =====
const ring = document.createElement('div');
ring.style.cssText = 'position:fixed;width:32px;height:32px;border:1.5px solid rgba(200,146,42,0.25);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:width 0.3s,height 0.3s,border-color 0.3s,background 0.3s';
document.body.appendChild(ring);

let ringX=0,ringY=0,mouseX=0,mouseY=0;
function animateRing(){ringX+=(mouseX-ringX)*0.12;ringY+=(mouseY-ringY)*0.12;ring.style.left=ringX+'px';ring.style.top=ringY+'px';requestAnimationFrame(animateRing)}
animateRing();

// ===== Sparkle Trail =====
const sparkleColors=['rgba(200,146,42,0.6)','rgba(212,168,75,0.5)','rgba(226,192,110,0.4)','rgba(184,134,11,0.5)','rgba(240,200,100,0.3)'];
let lastSparkle=0;
const sparkleStyle=document.createElement('style');
sparkleStyle.textContent='@keyframes sFade{0%{transform:translate(-50%,-50%) scale(1);opacity:1}100%{transform:translate(-50%,-50%) scale(0) translateY(-30px);opacity:0}}.sparkle{position:fixed;pointer-events:none;z-index:9999;border-radius:50%;animation:sFade 0.7s ease-out forwards}';
document.head.appendChild(sparkleStyle);

function createSparkle(x,y){
    const s=document.createElement('div');s.className='sparkle';
    const sz=Math.random()*5+2;
    s.style.cssText=`width:${sz}px;height:${sz}px;left:${x+(Math.random()-0.5)*16}px;top:${y+(Math.random()-0.5)*16}px;background:${sparkleColors[Math.floor(Math.random()*sparkleColors.length)]};box-shadow:0 0 ${sz+2}px currentColor`;
    document.body.appendChild(s);setTimeout(()=>s.remove(),700);
}

document.addEventListener('mousemove',e=>{
    mouseX=e.clientX;mouseY=e.clientY;
    glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';
    const now=Date.now();if(now-lastSparkle>50){createSparkle(e.clientX,e.clientY);lastSparkle=now}
});

document.addEventListener('mouseover',e=>{if(e.target.closest('a,button,.service-card,.portfolio-card,.social-link,.nav-toggle,input,textarea')){ring.style.width='48px';ring.style.height='48px';ring.style.borderColor='rgba(200,146,42,0.5)';ring.style.background='rgba(200,146,42,0.03)'}});
document.addEventListener('mouseout',e=>{if(e.target.closest('a,button,.service-card,.portfolio-card,.social-link,.nav-toggle,input,textarea')){ring.style.width='32px';ring.style.height='32px';ring.style.borderColor='rgba(200,146,42,0.25)';ring.style.background='transparent'}});

// ===== Particle Network =====
const canvas=document.getElementById('particles-canvas');
const ctx=canvas.getContext('2d');
let particles=[];
function resizeCanvas(){canvas.width=window.innerWidth;canvas.height=window.innerHeight}
resizeCanvas();window.addEventListener('resize',resizeCanvas);

class Particle{
    constructor(){this.reset()}
    reset(){
        this.x=Math.random()*canvas.width;this.y=Math.random()*canvas.height;
        this.size=Math.random()*1.2+0.3;
        this.speedX=(Math.random()-0.5)*0.25;this.speedY=(Math.random()-0.5)*0.25;
        this.opacity=Math.random()*0.3+0.05;
        this.color=Math.random()>0.6?'200,146,42':Math.random()>0.5?'184,134,11':'212,168,75';
    }
    update(){this.x+=this.speedX;this.y+=this.speedY;if(this.x<0||this.x>canvas.width||this.y<0||this.y>canvas.height)this.reset()}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);ctx.fillStyle=`rgba(${this.color},${this.opacity})`;ctx.fill()}
}
for(let i=0;i<80;i++)particles.push(new Particle());

function animateParticles(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{p.update();p.draw()});
    for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
            const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y;
            const dist=Math.sqrt(dx*dx+dy*dy);
            if(dist<120){ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);ctx.strokeStyle=`rgba(200,146,42,${0.03*(1-dist/120)})`;ctx.lineWidth=0.5;ctx.stroke()}
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== Navbar =====
const navbar=document.getElementById('navbar');
window.addEventListener('scroll',()=>navbar.classList.toggle('scrolled',window.scrollY>50));

// ===== Mobile Menu =====
const navToggle=document.getElementById('nav-toggle');
const navLinks=document.getElementById('nav-links');
navToggle.addEventListener('click',()=>{navToggle.classList.toggle('active');navLinks.classList.toggle('active')});
navLinks.querySelectorAll('.nav-link').forEach(l=>l.addEventListener('click',()=>{navToggle.classList.remove('active');navLinks.classList.remove('active')}));

// ===== Active Link =====
const sections=document.querySelectorAll('section[id]');
window.addEventListener('scroll',()=>{
    const y=window.scrollY+100;
    sections.forEach(s=>{const link=document.querySelector(`.nav-link[href="#${s.id}"]`);if(link)link.classList.toggle('active',y>=s.offsetTop&&y<s.offsetTop+s.offsetHeight)});
});

// ===== Counter Animation =====
function animateCounters(){
    document.querySelectorAll('.stat-number').forEach(c=>{
        const target=+c.dataset.target;const start=performance.now();
        function tick(now){const p=Math.min((now-start)/2000,1);const ease=1-Math.pow(1-p,4);c.textContent=Math.floor(ease*target);if(p<1)requestAnimationFrame(tick)}
        requestAnimationFrame(tick);
    });
}

// ===== Scroll Reveal =====
const observer=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add('active');
            if(entry.target.closest('.hero-stats')||entry.target.classList.contains('hero-stats'))animateCounters();
            const children=entry.target.querySelectorAll('.holo-card,.service-card,.portfolio-card,.testimonial-card');
            children.forEach((child,i)=>{child.style.transitionDelay=`${i*0.12}s`;setTimeout(()=>child.classList.add('active'),10)});
        }
    });
},{threshold:0.1});

document.querySelectorAll('.section-header,.holo-card,.service-card,.portfolio-card,.cta-box,.hero-stats,.about-grid,.services-grid,.portfolio-grid,.testimonials-slider,.contact-grid').forEach(el=>{el.classList.add('reveal');observer.observe(el)});

// ===== Tilt Effect =====
document.querySelectorAll('.service-card,.holo-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{const rect=card.getBoundingClientRect();const x=(e.clientX-rect.left)/rect.width-0.5;const y=(e.clientY-rect.top)/rect.height-0.5;card.style.transform=`translateY(-6px) perspective(800px) rotateX(${-y*5}deg) rotateY(${x*5}deg)`});
    card.addEventListener('mouseleave',()=>{card.style.transform=''});
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{e.preventDefault();const t=document.querySelector(a.getAttribute('href'));if(t)t.scrollIntoView({behavior:'smooth'})});
});

// ===== Contact Form (Web3Forms) =====
document.getElementById('contact-form').addEventListener('submit',async function(e){
    e.preventDefault();
    const btn=document.getElementById('submit-btn');const originalHTML=btn.innerHTML;
    btn.innerHTML='<span class="btn-text">Transmitting...</span>';btn.disabled=true;
    try{
        const formData=new FormData(this);const obj=Object.fromEntries(formData);
        const res=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(obj)});
        const data=await res.json();
        if(data.success){btn.innerHTML='<span class="btn-text">✓ Sent!</span>';btn.style.background='linear-gradient(135deg,#4caf50,#43a047)';this.reset()}
        else{btn.innerHTML='<span class="btn-text">✕ Failed</span>';btn.style.background='linear-gradient(135deg,#ff4757,#ff6b6b)'}
    }catch(err){btn.innerHTML='<span class="btn-text">✕ Error</span>';btn.style.background='linear-gradient(135deg,#ff4757,#ff6b6b)'}
    setTimeout(()=>{btn.innerHTML=originalHTML;btn.style.background='';btn.disabled=false},3000);
});

// ===== Glitch effect on hero title hover =====
const heroTitle=document.querySelector('.hero-title');
if(heroTitle){
    heroTitle.addEventListener('mouseenter',()=>{heroTitle.style.animation='glitch 0.3s ease';setTimeout(()=>heroTitle.style.animation='',300)});
    const glitchStyle=document.createElement('style');
    glitchStyle.textContent='@keyframes glitch{0%{transform:translate(0)}20%{transform:translate(-2px,2px)}40%{transform:translate(2px,-2px)}60%{transform:translate(-1px,-1px)}80%{transform:translate(1px,1px)}100%{transform:translate(0)}}';
    document.head.appendChild(glitchStyle);
}
