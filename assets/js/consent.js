/* RISET · Consentimiento de cookies
   Google Analytics solo se carga DESPUÉS de que la persona pulse "Aceptar".
   La decisión se guarda 6 meses; el botón "Configurar cookies" del footer reabre el banner. */
(function () {
  var GA_ID = 'G-NL5NN4V8BD';
  var KEY = 'riset-cookie-consent';
  var MAX_AGE = 1000 * 60 * 60 * 24 * 180; // 6 meses

  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY));
      if (v && Date.now() - v.t < MAX_AGE) return v.choice;
    } catch (e) {}
    return null;
  }
  function save(choice) {
    try { localStorage.setItem(KEY, JSON.stringify({ choice: choice, t: Date.now() })); } catch (e) {}
  }

  var gaLoaded = false;
  function loadGA() {
    if (gaLoaded) return;
    gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }
  function clearGACookies() {
    var host = location.hostname;
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') === 0) {
        document.cookie = name + '=; Max-Age=0; path=/';
        document.cookie = name + '=; Max-Age=0; path=/; domain=' + host;
        document.cookie = name + '=; Max-Age=0; path=/; domain=.' + host;
      }
    });
  }

  var banner;
  function build() {
    banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Preferencias de cookies');
    banner.innerHTML =
      '<p>Usamos cookies de analítica (Google Analytics) para saber cuánta gente visita la web y mejorarla. ' +
      'Solo las activamos si aceptas. <a href="/privacidad.html#cookies">Más información</a></p>' +
      '<div class="cookie-btns">' +
      '<button type="button" data-c="rejected">Rechazar</button>' +
      '<button type="button" data-c="accepted">Aceptar</button>' +
      '</div>';
    banner.addEventListener('click', function (e) {
      var c = e.target.getAttribute('data-c');
      if (!c) return;
      save(c);
      if (c === 'accepted') {
        loadGA();
      } else {
        clearGACookies();
        if (gaLoaded) location.reload(); // descarga GA si ya estaba cargado
      }
      hide();
    });
    document.body.appendChild(banner);
  }
  function show() { if (!banner) build(); banner.hidden = false; }
  function hide() { if (banner) banner.hidden = true; }

  var choice = read();
  if (choice === 'accepted') loadGA();
  else if (choice === null) show();

  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-cookie-settings]')) {
      e.preventDefault();
      show();
    }
  });
})();
