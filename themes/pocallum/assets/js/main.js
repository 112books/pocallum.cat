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
