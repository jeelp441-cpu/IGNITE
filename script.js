(() => {
  "use strict";
  // Web3Forms access key: messages are emailed to the address this key was created with
  const KEY = "074ac125-a118-4b84-ad70-5ea65cc333d5";
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const calm = matchMedia("(prefers-reduced-motion:reduce)").matches;


  // Scroll: navbar, progress bar, active link
  const nav = $("#nav"), bar = $("#bar"), secs = $$("section[id]"), links = $$(".links a");
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle("scrolled", y > 20);
    bar.style.width = (y / (document.body.scrollHeight - innerHeight)) * 100 + "%";
    let id = "";
    secs.forEach(s => { if (s.offsetTop <= y + 160) id = s.id; });
    links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // Mobile menu
  const bg = $("#burger"), ul = $("#links");
  bg.onclick = () => { bg.classList.toggle("open"); ul.classList.toggle("open"); };
  links.forEach(a => a.addEventListener("click", () => { bg.classList.remove("open"); ul.classList.remove("open"); }));

  // Hero slider
  const slides = $$(".slide"), dotBox = $("#dots"), hero = $("#home");
  let cur = 0, paused = false, timer;
  slides.forEach((_, i) => { const d = document.createElement("span"); d.className = "dot" + (i ? "" : " active"); d.onclick = () => { go(i); restart(); }; dotBox.appendChild(d); });
  const dots = $$(".dot");
  const go = n => {
    const old = slides[cur]; old.classList.add("out"); setTimeout(() => old.classList.remove("out"), 1400);
    old.classList.remove("on"); dots[cur].classList.remove("active");
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add("on"); dots[cur].classList.add("active");
  };
  const restart = () => { clearInterval(timer); timer = setInterval(() => { if (!paused) go(cur + 1); }, 6500); };
  $("#prev").onclick = () => { go(cur - 1); restart(); };
  $("#next").onclick = () => { go(cur + 1); restart(); };
  hero.onmouseenter = () => paused = true; hero.onmouseleave = () => paused = false;
  restart();

  // Hero headline: split into words for a staggered blur-in
  $$(".ln>*").forEach(el => { el.innerHTML = el.textContent.trim().split(/\s+/).map((t, i) => `<span class="w" style="--i:${i}">${t}</span>`).join(" "); });

  // Marquee: duplicate content for a seamless loop
  const mq = $("#mqt"); mq.innerHTML += mq.innerHTML;

  // Scroll reveal with stagger
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.style.setProperty("--d", [...el.parentNode.children].indexOf(el) * .1 + "s");
    el.classList.add("in"); io.unobserve(el);
  }), { threshold: .15 });
  $$(".rv").forEach(el => io.observe(el));

  // Counters
  const run = el => {
    const t = +el.dataset.t, t0 = performance.now();
    const tick = now => {
      const k = Math.min((now - t0) / 2000, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - k, 4)) * t) + "+";
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const co = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { $$(".num").forEach(run); co.disconnect(); } }), { threshold: .4 });
  co.observe($(".stats"));

  // Message box and contact form: emails you via Web3Forms
  const toast = (m, err) => {
    const t = $("#toast"); t.textContent = m; t.classList.toggle("err", !!err); t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 5000);
  };
  $("#msgBtn").onclick = () => $("#chat").classList.toggle("open");
  $("#chatX").onclick = () => $("#chat").classList.remove("open");
  $$(".mail-form").forEach(f => f.addEventListener("submit", async e => {
    e.preventDefault();
    const b = $("button", f), old = b.textContent;
    b.disabled = true; b.textContent = "Sending…";
    const d = Object.fromEntries(new FormData(f));
    Object.assign(d, { access_key: KEY, from_name: "Ignite Exim Website", subject: `New inquiry from ${d.name} — Ignite Exim` });
    try {
      const r = await fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(d) });
      const j = await r.json();
      if (!j.success) throw new Error(j.message);
      f.reset(); $("#chat").classList.remove("open");
      toast("Message sent. We will reply to your email soon.");
    } catch {
      toast("Message not sent. Please email igniteexim19@gmail.com directly.", true);
    }
    b.disabled = false; b.textContent = old;
  }));
})();
