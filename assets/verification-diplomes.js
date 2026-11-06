(() => {
  const form = document.getElementById('diploma-form');
  if (!form) return;

  const config = window.SCIPT_DIPLOMA_CONFIG || {};
  const result = document.getElementById('diploma-result');
  const submit = form.querySelector('[type="submit"]');

  const val = id =>
    (document.getElementById(id)?.value || '').trim();

  function show(message, state = 'info') {
    result.hidden = false;
    result.className = 'diploma-lookup-result is-' + state;
    result.textContent = message;
  }

  function showDiploma(d) {
    result.replaceChildren();
    result.hidden = false;
    result.className = 'diploma-lookup-result is-success';

    const h = document.createElement('h3');
    h.textContent = 'Document retrouvé';
    result.append(h);

    const p = document.createElement('p');
    p.textContent = 'Référence reconnue dans le registre sélectionné.';
    result.append(p);

    const dl = document.createElement('dl');

    [
      ['Établissement', d.institution],
      ['Titulaire', d.holder_name],
      ['Formation', d.program],
      ['Année', d.issue_year],
      ['Référence', d.serial_number]
    ].forEach(([k, v]) => {
      if (v === null || v === undefined || v === '') return;

      const dt = document.createElement('dt');
      const dd = document.createElement('dd');

      dt.textContent = k;
      dd.textContent = String(v);

      dl.append(dt, dd);
    });

    result.append(dl);

    const note = document.createElement('p');
    note.textContent =
      'Cette consultation confirme la présence de la référence dans le registre. Pour une confirmation officielle ou un duplicata, contactez le service des examens.';

    result.append(note);
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (!form.reportValidity()) return;

    const serial = val('diploma-number');
    const issuer = val('diploma-issuer');

    if (!/^[A-Za-z0-9][A-Za-z0-9 ./_-]{2,99}$/.test(serial)) {
      show('Vérifiez le numéro de série saisi.', 'error');
      return;
    }

    if (!config.supabaseUrl || !config.anonKey) {
      show(
        'Le service sécurisé doit encore être configuré. Vous pouvez utiliser la demande manuelle par e-mail.',
        'warning'
      );
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Recherche en cours…';
    show('Recherche dans le registre sécurisé…');

    try {
      const response = await fetch(
        config.supabaseUrl.replace(/\/$/, '') +
          '/functions/v1/verify-diploma',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': config.anonKey
          },
          body: JSON.stringify({
            issuer,
            serial_number: serial
          })
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || 'Service momentanément indisponible.'
        );
      }

      if (!data.found) {
        show(
          'Aucun diplôme correspondant à cette référence. Vérifiez la saisie ou adressez une demande au service des examens.',
          'warning'
        );
        return;
      }

      showDiploma(data.diploma);

    } catch (err) {
      show(
        err.message || 'Impossible de joindre le service de vérification.',
        'error'
      );

    } finally {
      submit.disabled = false;
      submit.textContent = 'Vérifier le diplôme →';
    }
  });

  document
    .getElementById('diploma-manual-request')
    ?.addEventListener('click', () => {
      const serial = val('diploma-number');

      const body = [
        'Bonjour,',
        'Je souhaite demander une vérification manuelle.',
        '',
        'Registre : ' + val('diploma-issuer'),
        'Référence : ' + serial,
        'Formation : ' + val('diploma-program'),
        'Année : ' + val('diploma-year'),
        'E-mail : ' + val('diploma-email'),
        'Précisions : ' + val('diploma-message')
      ].join('\n');

      location.href =
        'mailto:office.examens@sciptinternational.com?subject=' +
        encodeURIComponent('Vérification de diplôme — ' + serial) +
        '&body=' +
        encodeURIComponent(body);
    });
})();
