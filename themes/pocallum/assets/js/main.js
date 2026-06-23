/* ── Hero: imatge aleatòria + frase aleatòria ────────────────────────────── */
(function () {
  const bg    = document.getElementById('js-hero-bg');
  const title = document.getElementById('js-hero-title');
  if (!bg || !title) return;

  const PHRASES = {
    ca: [
      'Fem fotos<br>que entenen<br>la música.',
      'La llum<br>no perdona.<br>Nosaltres sí.',
      'Cada concert<br>és una sola<br>oportunitat.',
      'No expliquem<br>l\'escena.<br>Hi som.',
      'Quinze anys<br>al fossat<br>i a la platea.',
      'El moment<br>no es repeteix.<br>La foto, sí.',
      'Jazz, blues,<br>flamenc, dansa.<br>Sempre en directe.',
      'Fotografiem<br>el que passa<br>entre dues notes.',
    ],
    en: [
      'We take photos<br>that understand<br>the music.',
      'Light doesn\'t<br>forgive.<br>We do.',
      'Every concert<br>is a single<br>chance.',
      'We don\'t explain<br>the scene.<br>We\'re in it.',
      'Fifteen years<br>in the pit<br>and the stalls.',
      'The moment<br>doesn\'t repeat.<br>The photo does.',
      'Jazz, blues,<br>flamenco, dance.<br>Always live.',
      'We photograph<br>what happens<br>between two notes.',
    ],
  };

  const _heroData = window.__heroData || {};
  const images  = _heroData.images || [];
  const lang    = _heroData.lang   || 'ca';
  const phrases = PHRASES[lang] || PHRASES.ca;

  // Phrase: fade out → swap → fade in
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  title.classList.add('is-switching');
  setTimeout(() => {
    title.innerHTML = phrase;
    title.classList.remove('is-switching');
  }, 350);

  // Image: pick random, crossfade into server-rendered img
  const heroImg = bg.querySelector('img');
  if (images.length > 0) {
    const src = images[Math.floor(Math.random() * images.length)];
    if (heroImg && heroImg.src && heroImg.src.endsWith(src)) return; // already showing this one
    const loader = new Image();
    loader.onload = () => {
      bg.classList.add('is-switching');
      setTimeout(() => {
        if (heroImg) { heroImg.src = src; }
        else { bg.style.backgroundImage = `url('${src}')`; }
        bg.classList.remove('is-switching');
      }, 600);
    };
    loader.src = src;
  }
})();

/* ── Scroll progress + back to top ──────────────────────────────────────── */
(function () {
  const bar = document.getElementById('js-scroll-progress');
  const btn = document.getElementById('js-back-top');
  if (!bar && !btn) return;

  function update() {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    const pct      = total > 0 ? (scrolled / total * 100) : 0;

    if (bar) bar.style.transform = 'scaleX(' + (pct / 100) + ')';

    if (btn) {
      const show = scrolled > 400;
      if (show && btn.hidden) { btn.hidden = false; requestAnimationFrame(() => btn.classList.add('is-visible')); }
      if (!show && !btn.hidden) { btn.classList.remove('is-visible'); btn.addEventListener('transitionend', () => { if (!btn.classList.contains('is-visible')) btn.hidden = true; }, { once: true }); }
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  if (btn) btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── Privacy toast ───────────────────────────────────────────────────────── */
(function () {
  if (sessionStorage.getItem('privacy-seen')) return;
  const toast = document.getElementById('js-privacy-toast');
  if (!toast) return;
  toast.hidden = false;
  setTimeout(() => {
    toast.classList.add('is-hiding');
    toast.addEventListener('transitionend', () => { toast.hidden = true; }, { once: true });
  }, 4000);
  sessionStorage.setItem('privacy-seen', '1');
})();

/* ── Mobile nav ─────────────────────────────────────────────────────────── */
(function () {
  const toggle = document.getElementById('js-nav-toggle');
  const menu   = document.getElementById('js-nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    menu.hidden = open;
    menu.classList.toggle('is-open', !open);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !menu.hidden) {
      menu.hidden = true;
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
})();


/* ── Portada: 6 fotos aleatòries de tota la galeria ─────────────────────── */
(function () {
  var grid = document.getElementById('js-home-fotos');
  if (!grid) return;

  var galeria = ((window.__heroData || {}).galeria) || [];
  if (!galeria.length) return;

  var pool = galeria.slice();
  for (var i = pool.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
  }
  var selected = pool.slice(0, 6);

  var openLabel = document.documentElement.lang === 'en' ? 'Enlarge image' : 'Ampliar imatge';

  selected.forEach(function (foto, i) {
    var src = foto.img;
    var alt = (foto.alt || '').replace(/"/g, '&quot;');
    var fig = document.createElement('figure');
    fig.className = 'foto-item';
    fig.dataset.lbSrc = src;
    fig.dataset.lbAlt = foto.alt || '';
    fig.innerHTML =
      '<a class="foto-item__link js-lb-trigger" href="' + src + '" data-lb-index="' + i + '" aria-label="' + openLabel + ': ' + alt + '">' +
      '<img src="' + src + '" alt="' + alt + '" loading="' + (i < 2 ? 'eager' : 'lazy') + '" decoding="async">' +
      '</a>';
    grid.appendChild(fig);
  });
})();

/* ── Galeria shuffle + mosaic ────────────────────────────────────────────── */
(function () {
  const SIZE_CLASSES = ['foto-item--wide', 'foto-item--tall', 'foto-item--big', 'foto-item--hero'];

  // Weighted pool: 50% standard, 22% tall, 14% wide, 10% big, 4% hero
  const SIZE_POOL = [
    ...Array(50).fill(''),
    ...Array(22).fill('foto-item--tall'),
    ...Array(14).fill('foto-item--wide'),
    ...Array(10).fill('foto-item--big'),
    ...Array(4).fill('foto-item--hero'),
  ];

  function fisherYates(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  document.querySelectorAll('.js-shuffle').forEach(grid => {
    const items = [...grid.querySelectorAll('.foto-item')];
    const isMosaic = grid.classList.contains('js-mosaic');

    fisherYates(items);
    items.forEach(el => grid.appendChild(el));

    if (isMosaic) {
      const pool = fisherYates([...SIZE_POOL]);
      items.forEach((el, i) => {
        SIZE_CLASSES.forEach(c => el.classList.remove(c));
        const cls = pool[i % pool.length];
        if (cls) el.classList.add(cls);
      });
    }

    // Slot machine: each photo spins in with staggered delay (random order)
    fisherYates([...items]).forEach((el, i) => {
      el.style.removeProperty('--_rot');
      el.style.animationDelay = '';
      const img = el.querySelector('img');
      if (img) img.style.animationDelay = (Math.min(i, 25) * 70) + 'ms';
    });

    if (isMosaic) grid.style.opacity = '1';
  });
})();

/* ── Noticies showcase (Filmin-style) ────────────────────────────────────── */
(function () {
  const strip   = document.getElementById('js-noticies-strip');
  if (!strip) return;

  const featured = document.querySelector('.noticies-featured');
  const link     = document.getElementById('js-nf-link');
  const imgWrap  = document.getElementById('js-nf-img');
  const dateEl   = document.getElementById('js-nf-date');
  const titleEl  = document.getElementById('js-nf-title');
  const leadEl   = document.getElementById('js-nf-lead');
  const btnPrev  = document.getElementById('js-strip-prev');
  const btnNext  = document.getElementById('js-strip-next');
  if (!featured || !link || !dateEl || !titleEl) return;

  // Injecta separadors d'any entre miniatures de anys diferents
  let lastYear = null;
  [...strip.querySelectorAll('.noticies-thumb')].forEach(thumb => {
    const year = thumb.dataset.year;
    if (year && year !== lastYear) {
      const sep = document.createElement('div');
      sep.className = 'noticies-year-sep';
      sep.innerHTML = `<span>${year}</span>`;
      strip.insertBefore(sep, thumb);
      lastYear = year;
    }
  });

  const thumbs = [...strip.querySelectorAll('.noticies-thumb')];
  let activeIdx = 0;

  function activate(idx) {
    activeIdx = (idx + thumbs.length) % thumbs.length;
    const t = thumbs[activeIdx];

    featured.classList.add('is-switching');

    setTimeout(() => {
      thumbs.forEach(th => th.classList.remove('is-active'));
      t.classList.add('is-active');

      link.href           = t.dataset.href;
      dateEl.textContent  = t.dataset.date;
      titleEl.textContent = t.dataset.title;
      if (leadEl) leadEl.textContent = t.dataset.lead;

      const img = imgWrap.querySelector('img');
      if (t.dataset.img) {
        if (img) { img.src = t.dataset.img; img.alt = t.dataset.title || ''; }
        else { imgWrap.innerHTML = `<img src="${t.dataset.img}" alt="">`; }
      } else {
        imgWrap.innerHTML = '';
      }

      featured.classList.remove('is-switching');
    }, 180);

    t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  thumbs.forEach((t, i) => t.addEventListener('click', () => activate(i)));
  if (btnPrev) btnPrev.addEventListener('click', () => activate(activeIdx - 1));
  if (btnNext) btnNext.addEventListener('click', () => activate(activeIdx + 1));
})();

/* ── Lightbox ────────────────────────────────────────────────────────────── */
(function () {
  const lb      = document.getElementById('js-lightbox');
  const lbImg   = document.getElementById('js-lb-img');
  const lbClose = document.getElementById('js-lb-close');
  const lbPrev  = document.getElementById('js-lb-prev');
  const lbNext  = document.getElementById('js-lb-next');
  const lbCount = document.getElementById('js-lb-counter');
  if (!lb) return;

  // aria-live region for screen reader announcements on image change
  const lbAnnounce = document.createElement('span');
  lbAnnounce.setAttribute('aria-live', 'polite');
  lbAnnounce.setAttribute('aria-atomic', 'true');
  lbAnnounce.className = 'sr-only';
  lb.appendChild(lbAnnounce);

  let items = [];
  let current = 0;
  let openerEl = null;

  function show(idx) {
    current = (idx + items.length) % items.length;
    lbImg.src = items[current].dataset.lbSrc;
    lbImg.alt = items[current].dataset.lbAlt || '';
    if (lbCount) lbCount.textContent = `${current + 1} / ${items.length}`;
    const alt = items[current].dataset.lbAlt;
    lbAnnounce.textContent = alt ? `${current + 1} / ${items.length}: ${alt}` : `${current + 1} / ${items.length}`;
  }

  function open(idx) {
    openerEl = document.activeElement;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    show(idx);
    lbClose.focus();
  }

  function close() {
    lb.hidden = true;
    document.body.style.overflow = '';
    if (openerEl) { openerEl.focus(); openerEl = null; }
  }

  // Focus trap: cycle Tab/Shift+Tab within lightbox buttons
  const focusable = [lbClose, lbPrev, lbNext].filter(Boolean);
  lb.addEventListener('keydown', e => {
    if (e.key !== 'Tab' || !focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });

  document.querySelectorAll('.js-lb-trigger').forEach((trigger, i) => {
    trigger.addEventListener('click', e => {
      e.preventDefault();
      items = [...document.querySelectorAll('.foto-item')];
      open(i);
    });
  });

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const gallery = item.closest('.article-gallery');
      items = [...gallery.querySelectorAll('.gallery-item')];
      open(items.indexOf(item));
    });
  });

  document.querySelectorAll('.servei-page__imgs').forEach(grid => {
    const imgs = grid.querySelectorAll('img');
    imgs.forEach((img, i) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        items = [...imgs].map(el => ({ dataset: { lbSrc: el.src, lbAlt: el.alt } }));
        open(i);
      });
    });
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', () => show(current - 1));
  lbNext.addEventListener('click', () => show(current + 1));

  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();

/* ── Blog stats count-up ─────────────────────────────────────────────────── */
(function () {
  const nums = document.querySelectorAll('.blog-stat__num[data-count]');
  if (!nums.length) return;

  const DURATION = 1600;
  const locale   = document.documentElement.lang || 'ca';

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function formatNum(n, target) {
    if (locale === 'en') return n.toLocaleString('en-GB');
    return n.toLocaleString('ca-ES');
  }

  function animateNum(el) {
    const target = parseInt(el.dataset.count, 10);
    const start  = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / DURATION, 1);
      const value = Math.round(easeOutCubic(progress) * target);
      el.textContent = formatNum(value, target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = formatNum(target, target);
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        nums.forEach(animateNum);
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const statsEl = document.querySelector('.blog-stats');
  if (statsEl) observer.observe(statsEl);
})();

/* ── Foto shimmer: atura l'animació de fons quan la imatge ja ha carregat ── */
(function () {
  document.querySelectorAll('.foto-item img').forEach(function (img) {
    function markLoaded() { img.closest('.foto-item')?.classList.add('img-loaded'); }
    if (img.complete && img.naturalWidth) markLoaded();
    else img.addEventListener('load', markLoaded);
  });
})();
