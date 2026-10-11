(function () {
  var html = document.documentElement;
  var MSG = {
    uk: { copied: 'Адресу скопійовано' },
    en: { copied: 'Address copied' }
  };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* language */
  var langButtons = document.querySelectorAll('.lang button');
  function setLang(l) {
    html.lang = l;
    langButtons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.set === l)); });
    var title = html.getAttribute('data-title-' + l);
    if (title) document.title = title;
    try { localStorage.setItem('lang', l); } catch (e) {}
  }
  langButtons.forEach(function (b) { b.addEventListener('click', function () { setLang(b.dataset.set); }); });
  var saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) {}
  var guess = saved || ((navigator.language || 'uk').slice(0, 2) === 'uk' ? 'uk' : 'en');
  setLang(guess === 'en' ? 'en' : 'uk');

  /* screenshot viewer: cross-fade between screens */
  document.querySelectorAll('.screens').forEach(function (block) {
    var buttons = block.querySelectorAll('[data-view]');
    var imgs = block.querySelectorAll('.viewer img');
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        buttons.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        imgs.forEach(function (img) {
          var off = img.dataset.v !== b.dataset.view;
          img.classList.toggle('off', off);
          img.setAttribute('aria-hidden', String(off));
        });
      });
    });
  });

  /* copy e-mail */
  var copyBtn = document.getElementById('copy');
  if (copyBtn) {
    var status = document.getElementById('copy-status');
    copyBtn.addEventListener('click', function () {
      var addr = document.getElementById('mail').textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addr).then(function () {
          status.textContent = MSG[html.lang].copied;
          setTimeout(function () { status.textContent = ''; }, 2500);
        }, function () {});
      }
    });
  }

  /* header shadow once the page is scrolled */
  var top = document.querySelector('.top');
  if (top) {
    var onScroll = function () { top.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* reveal blocks as they enter the viewport */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var selectors = [
      '.hero > div:first-child > *', '.sec-head', '.proj', '.tile', '.custom', '.stackline',
      '.about-photo', '.about > div:last-child', '.how > div', '.contact', '.intro > *',
      '.feat', '.admin h2', '.admin .lead', '.acard', '.screens .wrap > *', '.stat', '.next a'
    ].join(',');
    var items = document.querySelectorAll(selectors);
    html.classList.add('reveal-on');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    var seen = new Map();
    items.forEach(function (el) {
      var n = seen.get(el.parentNode) || 0;
      seen.set(el.parentNode, n + 1);
      el.style.setProperty('--d', (n % 4) * 90 + 'ms');
      el.classList.add('rv');
      io.observe(el);
    });
  }
})();
