(function () {
  var html = document.documentElement;
  var MSG = {
    uk: { copied: 'Адресу скопійовано' },
    en: { copied: 'Address copied' }
  };

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

  document.querySelectorAll('.screens').forEach(function (block) {
    var buttons = block.querySelectorAll('[data-view]');
    var imgs = block.querySelectorAll('.viewer img');
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        buttons.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        imgs.forEach(function (img) { img.hidden = img.dataset.v !== b.dataset.view; });
      });
    });
  });

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
})();
