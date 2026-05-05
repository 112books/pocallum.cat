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

/* ── Galeria shuffle ─────────────────────────────────────────────────────── */
(function () {
  const grids = document.querySelectorAll('.js-shuffle');
  grids.forEach(grid => {
    const items = [...grid.querySelectorAll('.foto-item')];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    items.forEach(el => grid.appendChild(el));
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
