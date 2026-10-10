/* RISET · Formulario "Avísame del primer ciclo"
   Envía el email a riset-api. Cambia API_URL por la URL real de tu backend. */
(function () {
  var API_URL = 'https://riset-api.onrender.com/waitlist'; // ← REVISAR
  var CONSENT_TEXT = 'Acepto recibir un email cuando empiece el primer ciclo.';

  var form = document.getElementById('waitlist');
  if (!form) return;
  var email = form.querySelector('#wl-email');
  var consent = form.querySelector('#wl-consent');
  var hp = form.querySelector('.hp');
  var btn = form.querySelector('button[type=submit]');
  var msg = form.querySelector('#wl-msg');

  function say(text, kind) {
    msg.textContent = text;
    msg.className = 'waitlist-msg ' + (kind || '');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var value = email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      say('Revisa el email, parece que falta algo.', 'error'); email.focus(); return;
    }
    if (!consent.checked) {
      say('Marca la casilla para que podamos escribirte.', 'error'); consent.focus(); return;
    }
    if (hp.value) { say('¡Listo! Te avisaremos.', 'ok'); form.reset(); return; } // bot: fingimos éxito

    btn.disabled = true;
    btn.textContent = 'Enviando…';
    say('');
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 30000); // Render puede tardar en despertar

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: value, consent: true, consent_text: CONSENT_TEXT, source: 'landing' }),
      signal: ctrl.signal
    }).then(function (r) {
      if (r.ok) { say('¡Listo! Te escribiremos cuando empiece el primer ciclo.', 'ok'); form.reset(); }
      else if (r.status === 429) say('Demasiados intentos. Prueba de nuevo en unos minutos.', 'error');
      else say('No hemos podido guardarlo. Prueba de nuevo o escríbenos a info.risetstudio@gmail.com.', 'error');
    }).catch(function () {
      say('No hemos podido conectar. Prueba de nuevo en un momento.', 'error');
    }).finally(function () {
      clearTimeout(timer);
      btn.disabled = false;
      btn.textContent = 'Avisarme';
    });
  });
})();
