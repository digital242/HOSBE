/* =========================================================
   OBE Studio — animations
   Plain JavaScript, no libraries. Content is fully visible
   without this file; it only adds motion on top.
   ========================================================= */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  // Load sequence (header, logo, intro) starts once fonts are ready.
  const start = () => root.classList.add('is-loaded');
  if (reduce) { start(); return; }
  root.classList.add('anim');
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(start));
  setTimeout(start, 1200); // safety net

  /* ---------- 1. Split big headings into words ---------- */
  function splitWords(el) {
    let i = 0;
    const wrap = (text, silver) => {
      const frag = document.createDocumentFragment();
      text.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        const w = document.createElement('span'); w.className = 'w';
        const inner = document.createElement('span');
        inner.textContent = part; inner.style.setProperty('--i', i++);
        if (silver) inner.className = 'silver';
        w.appendChild(inner); frag.appendChild(w);
      });
      return frag;
    };
    Array.from(el.childNodes).forEach(node => {
      if (node.nodeType === 3) el.replaceChild(wrap(node.textContent, false), node);
      else if (node.nodeName === 'EM') {
        const text = node.textContent; node.textContent = '';
        node.classList.add('em-split'); node.appendChild(wrap(text, true));
      }
    });
    el.classList.add('split');
  }
  $$('.display, .title').forEach(splitWords);

  /* ---------- 2. Scroll reveal ---------- */
  const groups = [
    ['.manifesto > .label, .contact > .label', 0],
    ['.section__head .lead', 1],
    ['.gallery figure, .gallery blockquote', 0],
    ['.services .card', 0],
    ['.media--wide', 0],
    ['.videos figure', 0],
    ['.work figure', 0],
    ['.section > .btn', 0],
    ['.contact__row', 0],
    ['.footer__col, .footer__logo, .footer__cta', 0],
  ];
  const revealEls = [];
  groups.forEach(([sel, offset]) => {
    $$(sel).forEach((el, idx) => {
      el.classList.add('reveal');
      const parentKids = el.parentElement ? Array.from(el.parentElement.children) : [];
      const pos = Math.max(0, parentKids.indexOf(el));
      el.style.setProperty('--d', ((pos % 4) + offset) * 90 + 'ms');
      revealEls.push(el);
    });
  });
  const splitEls = $$('.split');

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { const t = e.target; t.classList.add('in'); io.unobserve(t); setTimeout(() => t.classList.add('done'), 1400); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  [...revealEls, ...splitEls].forEach(el => io.observe(el));
  // Anything already on screen at load shows straight away.
  requestAnimationFrame(() => {
    [...revealEls, ...splitEls].forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) el.classList.add('in');
    });
  });

  /* ---------- 3. Scroll-linked: progress bar, header, parallax ---------- */
  const bar = document.createElement('div'); bar.className = 'progress'; document.body.appendChild(bar);
  const header = $('.header');
  const heroLogo = $('.hero__logo');
  const parallax = $$('.gallery figure, .gallery blockquote').map((el, i) => ({ el, speed: [0.06, -0.05, 0.09, -0.03, 0.04, -0.08, 0.07][i % 7] }));
  const footerLogo = $('.footer__logo');
  let lastY = scrollY, ticking = false;

  function onScroll() {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    header.classList.toggle('is-scrolled', y > 20);
    header.classList.toggle('is-hidden', y > lastY && y > 400);
    lastY = y;

    if (heroLogo) heroLogo.style.setProperty('--py', `${y * 0.25}px`);
    parallax.forEach(({ el, speed }) => {
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2 - innerHeight / 2;
      el.style.setProperty('--py', `${(-center * speed).toFixed(1)}px`);
    });
    if (footerLogo) {
      const r = footerLogo.getBoundingClientRect();
      footerLogo.style.setProperty('--rot', `${((r.top - innerHeight) * 0.03).toFixed(1)}deg`);
    }
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- 4. Pointer effects (desktop only) ---------- */
  if (finePointer) {
    // Hero: glow follows cursor, logo tilts toward it
    const hero = $('.hero');
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      hero.style.setProperty('--gx', `${(x * 100 + 50).toFixed(1)}%`);
      hero.style.setProperty('--gy', `${(y * 100 + 50).toFixed(1)}%`);
      heroLogo.style.setProperty('--tx', `${(x * 14).toFixed(1)}deg`);
      heroLogo.style.setProperty('--ty', `${(-y * 14).toFixed(1)}deg`);
    });
    hero.addEventListener('pointerleave', () => {
      heroLogo.style.setProperty('--tx', '0deg'); heroLogo.style.setProperty('--ty', '0deg');
    });

    // Cards: spotlight follows cursor + slight 3D tilt
    $$('.card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);
        card.style.setProperty('--rx', `${((y / r.height - 0.5) * -6).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${((x / r.width - 0.5) * 6).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg');
      });
    });

    // Buttons: gentle magnetic pull
    $$('.btn').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty('--bx', `${((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1)}px`);
        btn.style.setProperty('--by', `${((e.clientY - r.top - r.height / 2) * 0.25).toFixed(1)}px`);
      });
      btn.addEventListener('pointerleave', () => { btn.style.setProperty('--bx', '0px'); btn.style.setProperty('--by', '0px'); });
    });

    // Media placeholders: tilt slightly toward cursor
    $$('.media--photo, .media--video').forEach(m => {
      m.addEventListener('pointermove', e => {
        const r = m.getBoundingClientRect();
        m.style.setProperty('--mx', `${e.clientX - r.left}px`);
        m.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }
})();
