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

  const lang    = window.__heroLang || 'ca';
  const phrases = PHRASES[lang] || PHRASES.ca;
  const images  = window.__heroImages || [];

  // Phrase: fade out → swap → fade in
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  title.classList.add('is-switching');
  setTimeout(() => {
    title.innerHTML = phrase;
    title.classList.remove('is-switching');
  }, 350);

  // Image: pick random, preload, fade in
  if (images.length > 0) {
    const src = images[Math.floor(Math.random() * images.length)];
    const img = new Image();
    img.onload = () => {
      bg.style.backgroundImage = `url('${src}')`;
      bg.classList.add('is-loaded');
    };
    img.src = src;
  }
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
        if (img) { img.src = t.dataset.img; }
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

  let items = [];
  let current = 0;

  function show(idx) {
    current = (idx + items.length) % items.length;
    lbImg.src = items[current].dataset.lbSrc;
    lbImg.alt = items[current].dataset.lbAlt || '';
    if (lbCount) lbCount.textContent = `${current + 1} / ${items.length}`;
  }

  function open(idx) {
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    show(idx);
    lbClose.focus();
  }

  function close() {
    lb.hidden = true;
    document.body.style.overflow = '';
  }

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
