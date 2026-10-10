/* De 0 a Clientes - aviso de idioma (client-side, sin redireccion)
 *
 * SEO/UX:
 *  - Sugiere la version en el otro idioma SIN redirigir nunca. El HTML
 *    servido no cambia (el aviso se inyecta con JS), asi que no afecta el
 *    rastreo ni la indexacion.
 *  - Recuerda la eleccion del usuario en localStorage ("d0c_lang_choice"),
 *    de modo que el aviso no vuelve a aparecer.
 *
 * No muestra nada si:
 *  - el usuario ya eligio idioma,
 *  - la ruta actual no tiene equivalente en el otro idioma.
 */
(function () {
  var KEY = 'd0c_lang_choice';

  function currentLang() {
    return (document.documentElement.getAttribute('lang') || 'es').toLowerCase();
  }
  function currentIsEn() {
    return currentLang().indexOf('en') === 0;
  }
  function store(lang) {
    try { window.localStorage.setItem(KEY, lang); } catch (e) {}
  }

  var path = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
  var MAP = {
    '/': '/en/',
    '/studio': '/en/studio',
    '/contact': '/en/contact',
    '/privacy': '/en/privacy',
    '/en': '/',
    '/en/studio': '/studio',
    '/en/contact': '/contact',
    '/en/privacy': '/privacy'
  };
  var targetHref = MAP[path];

  var alreadyChosen = null;
  try { stored = window.localStorage.getItem(KEY); } catch (e) {}
  if (stored) return;
  if (!targetHref) return;

  var isEn = currentIsEn();
  var targetLang = isEn ? 'es' : 'en';
  var msg = currentIsEn()
    ? 'También podés leer este sitio en español.'
    : 'You can also read this site in English.';
  var cta = currentIsEn() ? 'Ver en español' : 'View in English';

  var style = document.createElement('style');
  style.textContent =
    '.d0c-lang{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:9998;' +
    'display:flex;align-items:center;gap:14px;max-width:calc(100vw - 24px);' +
    'background:#0C0C0C;color:#fff;font-family:Montserrat,-apple-system,BlinkMacSystemFont,sans-serif;' +
    'opacity:0;transition:opacity .25s ease}' +
    '.d0c-lang.is-visible{opacity:1}' +
    '.d0c-lang p{margin:0;color:#fff;font-size:14px;line-height:1.4}' +
    '.d0c-lang a.d0c-lang-go{background:#FFD400;color:#0C0C0C;font-weight:700;white-space:nowrap;' +
    'font-size:14px;padding:10px 16px;text-decoration:none}' +
    '.d0c-lang button{border:0;background:transparent;color:#fff;font-size:20px;line-height:1;' +
    'cursor:pointer;opacity:.7;padding:0 2px}' +
    '.d0c-lang button:hover{opacity:1}' +
    '@media(max-width:560px){.d0c-lang{left:12px;right:12px;bottom:12px;transform:none;flex-wrap:wrap;justify-content:flex-end}}';
  document.head.appendChild(style);

  var wrap = document.createElement('div');
  wrap.className = 'd0c-lang';
  wrap.setAttribute('role', 'region');
  wrap.setAttribute('lang', currentLang());

  var p = document.createElement('p');
  p.textContent = currentIsEn()
    ? 'También podés leer este sitio en español.'
    : 'You can also read this site in English.';

  var link = document.createElement('a');
  link.className = 'd0c-lang-go';
  link.href = MAP[path];
  link.setAttribute('hreflang', currentIsEn() ? 'es' : 'en');
  link.textContent = currentIsEn() ? 'Ver en español' : 'View in English';
  link.addEventListener('click', function () { store(currentIsEn() ? 'es' : 'en'); });

  var close = document.createElement('button');
  close.type = 'button';
  close.setAttribute('aria-label', currentIsEn() ? 'Dismiss' : 'Cerrar');
  close.innerHTML = '&times;';
  close.addEventListener('click', function () {
    store(currentIsEn() ? 'en' : 'es');
    if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
  });

  wrap.appendChild(p);
  wrap.appendChild(link);
  wrap.appendChild(close);

  function show() {
    document.body.appendChild(wrap);
    requestAnimationFrame(function () { wrap.classList.add('is-visible'); });
  }

  // Persistir la eleccion si el usuario usa el switch EN/ES del menu.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a.nav-lang');
    if (a) {
      store((a.getAttribute('lang') || '').toLowerCase().indexOf('en') === 0 ? 'en' : 'es');
    }
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', show);
  } else {
    show();
  }
})();
