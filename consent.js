/* De 0 a Clientes - consentimiento de cookies
 *
 * Google AdSense NO se carga hasta que el visitante decide.
 *   - "all"       -> se carga AdSense (ads personalizados + no personalizados)
 *   - "necessary" -> NO se carga AdSense
 *   - sin decision -> se muestra la barra y los ads siguen bloqueados
 *
 * ------------------------------------------------------------------
 * PARA EEA / UK / SUIZA (ads personalizados)
 * ------------------------------------------------------------------
 * Esta barra es un CMP propio: cumple el principio de "informado y
 * explicito", pero NO es un CMP certificado. Google exige un CMP
 * certificado para servir ads personalizados en el Espacio Economico
 * Europeo, Reino Unido y Suiza. Activa Google Funding Choices desde tu
 * cuenta de AdSense (Privacidad e informacion -> CMP) y pega aqui el
 * snippet que te dan; tiene prioridad sobre este archivo:
 *
 *   <script async src="https://fundingchoicesmessages.google.com/i/pub-XXXXXXXX?cx=XXXXXXXX" charset="utf-8"></script>
 *
 * Sin eso, Google seguira limitando los ads personalizados en esas
 * regiones aunque el visitante acepte. Para el resto del mundo (USA,
 * Canada, Latinoamerica) esta barra es suficiente.
 */
(function () {
  'use strict';

  var KEY = 'd0c_consent';
  var ADSENSE = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4384314147708100';
  var COOKIE_LIFETIME_DAYS = 180;
  var started = false;
  var escaped = false;

  var isEn = (document.documentElement.getAttribute('lang') || 'es').toLowerCase().indexOf('en') === 0;
  /* URL absoluta: no depende de la profundidad de la pagina, asi que funciona
     igual desde /, /en/ o cualquier futuro subdirectorio. */
  var privacyUrl = 'https://de0aclientes.com/' + (isEn ? 'en/' : '') + 'privacy.html';

  var T = isEn ? {
    title: 'We use cookies',
    body: 'We use cookies to run this site and, with your consent, to show Google ads that help fund the free content. You can accept all cookies or keep only the necessary ones.',
    accept: 'Accept all',
    reject: 'Necessary only',
    privacy: 'Privacy Policy'
  } : {
    title: 'Usamos cookies',
    body: 'Usamos cookies para que el sitio funcione y, con tu consentimiento, para mostrar publicidad de Google que financia el contenido gratis. Podés aceptar todas las cookies o quedarte solo con las necesarias.',
    accept: 'Aceptar todas',
    reject: 'Solo necesarias',
    privacy: 'Pol' + String.fromCharCode(237) + 'tica de privacidad'
  };

  function read() {
    try { return window.localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function write(value) {
    try {
      window.localStorage.setItem(KEY, value);
      var exp = new Date();
      exp.setTime(exp.getTime() + COOKIE_LIFETIME_DAYS * 864e5);
      document.cookie = KEY + '=' + value + ';expires=' + exp.toUTCString() + ';path=/;SameSite=Lax';
    } catch (e) { /* modo privado: la decision no persiste */ }
  }

  function loadAdsense() {
    if (document.getElementById('d0c-adsense')) return;
    var s = document.createElement('script');
    s.id = 'd0c-adsense';
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = ADSENSE;
    document.head.appendChild(s);
  }

  function closeBar(bar) {
    if (bar && bar.parentNode) bar.parentNode.removeChild(bar);
  }

  function build() {
    var bar = document.createElement('div');
    bar.className = 'cookie-bar';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-live', 'polite');
    bar.setAttribute('aria-label', T.title);

    var inner = document.createElement('div');
    inner.className = 'cookie-bar-inner';

    var text = document.createElement('div');
    text.className = 'cookie-bar-text';
    var h = document.createElement('strong');
    h.textContent = T.title;
    var p = document.createElement('p');
    p.textContent = T.body + ' ';
    var a = document.createElement('a');
    a.href = privacyUrl;
    a.textContent = T.privacy;
    text.appendChild(h);
    text.appendChild(p);
    text.appendChild(a);

    var actions = document.createElement('div');
    actions.className = 'cookie-bar-actions';

    var accept = document.createElement('button');
    accept.type = 'button';
    accept.className = 'cookie-btn cookie-btn-accept';
    accept.textContent = T.accept;

    var reject = document.createElement('button');
    reject.type = 'button';
    reject.className = 'cookie-btn cookie-btn-reject';
    reject.textContent = T.reject;

    actions.appendChild(reject);
    actions.appendChild(accept);
    inner.appendChild(text);
    inner.appendChild(actions);
    bar.appendChild(inner);
    document.body.appendChild(bar);

    accept.addEventListener('click', function () {
      write('all');
      closeBar(bar);
      loadAdsense();
    });
    reject.addEventListener('click', function () {
      write('necessary');
      closeBar(bar);
    });

    accept.focus();
  }

  function start() {
    if (started) return;
    started = true;

    var c = read();
    if (c === 'all') {
      loadAdsense();
    } else if (c === 'necessary') {
      /* ads bloqueados a proposito */
    } else {
      build();
    }

    var openers = document.querySelectorAll('[data-consent-open]');
    for (var i = 0; i < openers.length; i++) {
      openers[i].addEventListener('click', function (ev) {
        ev.preventDefault();
        var existing = document.querySelector('.cookie-bar');
        closeBar(existing);
        build();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
