(() => {
  const form = document.getElementById('diploma-form');
  if (!form) return;

  const config = window.SCIPT_DIPLOMA_CONFIG || {};
  const result = document.getElementById('diploma-result');
  const submit = form.querySelector('[type="submit"]');
  const val = id => (document.getElementById(id)?.value || '').trim();

  // Présentation cohérente du résultat, sans dépendance supplémentaire.
  const style = document.createElement('style');
  style.textContent = `
    .diploma-lookup-result{margin-top:1.5rem;padding:clamp(1.1rem,3vw,1.7rem);border:1px solid #d9e2ec;border-radius:18px;background:#fff;color:#20344c;box-shadow:0 12px 34px rgba(20,42,68,.08)}
    .diploma-lookup-result .lookup-heading{display:flex;align-items:center;gap:.85rem;margin-bottom:.55rem}
    .diploma-lookup-result .lookup-mark{display:grid;place-items:center;flex:0 0 42px;width:42px;height:42px;border-radius:50%;font-size:1.2rem}
    .diploma-lookup-result h3{margin:0;font-size:1.18rem;font-weight:800;letter-spacing:-.02em}
    .diploma-lookup-result .lookup-lead{margin:.35rem 0 1.1rem;color:#52647a}
    .diploma-lookup-result dl{display:grid;grid-template-columns:minmax(115px,.65fr) 1.35fr;gap:.7rem 1rem;margin:1rem 0 1.2rem;padding:1rem;border-radius:12px;background:#f6f8fb}
    .diploma-lookup-result dt{font-size:.9rem;font-weight:700;color:#52647a}
    .diploma-lookup-result dd{margin:0;font-weight:600;overflow-wrap:anywhere}
    .diploma-lookup-result .lookup-note{margin:1rem 0 0;padding-top:1rem;border-top:1px solid #e4eaf0;font-size:.9rem;line-height:1.6;color:#52647a}
    .diploma-lookup-result .lookup-actions{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1rem}
    .diploma-lookup-result .lookup-copy{border:1px solid #c7d2df;border-radius:999px;padding:.55rem .95rem;background:#fff;color:#20344c;font-weight:700}
    .diploma-lookup-result .lookup-copy:hover{background:#f2f5f9}
    .diploma-lookup-result.is-success{border-color:#9bc9aa;background:linear-gradient(145deg,#f4fbf6,#fff 70%)}
    .diploma-lookup-result.is-success .lookup-mark{background:#dff3e5;color:#18733b}
    .diploma-lookup-result.is-warning{border-color:#e6d29a;background:#fffaf0}
    .diploma-lookup-result.is-warning .lookup-mark{background:#fff0c7;color:#8a5a00}
    .diploma-lookup-result.is-error{border-color:#e4b0b0;background:#fff5f5}
    .diploma-lookup-result.is-error .lookup-mark{background:#ffe2e2;color:#a12626}
    .diploma-lookup-result.is-info .lookup-mark{background:#e8eef7;color:#294b76}
    @media(max-width:480px){.diploma-lookup-result dl{grid-template-columns:1fr;gap:.2rem}.diploma-lookup-result dd{margin-bottom:.55rem}}
  `;
  document.head.append(style);

  function show(message, state = 'info') {
    result.hidden = false;
    result.className = 'diploma-lookup-result is-' + state;
    result.replaceChildren();
    const heading = document.createElement('div');
    heading.className = 'lookup-heading';
    const mark = document.createElement('span');
    mark.className = 'lookup-mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = state === 'error' ? '!' : state === 'warning' ? '⌕' : '…';
    const title = document.createElement('h3');
    title.textContent = state === 'error' ? 'Une erreur est survenue' :
      state === 'warning' ? 'Aucun résultat confirmé' : 'Vérification en cours';
    heading.append(mark, title);
    const p = document.createElement('p');
    p.className = 'lookup-lead';
    p.textContent = message;
    result.append(heading, p);
  }

  function showDiploma(d) {
    result.replaceChildren();
    result.hidden = false;
    result.className = 'diploma-lookup-result is-success';

    const heading = document.createElement('div');
    heading.className = 'lookup-heading';
    const mark = document.createElement('span');
    mark.className = 'lookup-mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = '✓';
    const title = document.createElement('h3');
    title.textContent = 'Document retrouvé';
    heading.append(mark, title);

    const lead = document.createElement('p');
    lead.className = 'lookup-lead';
    lead.textContent = 'Cette référence figure dans le registre de l’établissement sélectionné.';

    const dl = document.createElement('dl');
    [
      ['Établissement', d.institution],
      ['Titulaire', d.holder_name],
      ['Formation', d.program],
      ['Année de délivrance', d.issue_year],
      ['Référence', d.serial_number]
    ].forEach(([label, value]) => {
      if (value === null || value === undefined || value === '') return;
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = label;
      dd.textContent = String(value);
      dl.append(dt, dd);
    });

    const note = document.createElement('p');
    note.className = 'lookup-note';
    note.textContent = 'Résultat de consultation du registre : cette réponse confirme uniquement la présence de la référence et des informations affichées dans la base consultée. Pour une authentification officielle du document, une attestation ou un duplicata, contactez le service des examens et certifications.';

    const actions = document.createElement('div');
    actions.className = 'lookup-actions';
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'lookup-copy';
    copy.textContent = 'Copier la référence';
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(String(d.serial_number ?? ''));
        copy.textContent = 'Référence copiée ✓';
      } catch {
        copy.textContent = 'Copie non disponible';
      }
    });
    actions.append(copy);
    result.append(heading, lead, dl, note, actions);
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
      show('Le service sécurisé doit encore être configuré. Vous pouvez utiliser la demande manuelle par e-mail.', 'warning');
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Recherche en cours…';
    show('Recherche dans le registre sécurisé…');

    try {
      const response = await fetch(
        config.supabaseUrl.replace(/\/$/, '') + '/functions/v1/verify-diploma',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': config.anonKey
          },
          body: JSON.stringify({ issuer, serial_number: serial })
        }
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Service momentanément indisponible.');

      if (!data.found) {
        show('Aucun diplôme correspondant à cette référence. Vérifiez la saisie ou adressez une demande au service des examens.', 'warning');
        return;
      }

      showDiploma(data.diploma);
    } catch (err) {
      show(err.message || 'Impossible de joindre le service de vérification.', 'error');
    } finally {
      submit.disabled = false;
      submit.textContent = 'Vérifier le diplôme →';
    }
  });

  document.getElementById('diploma-manual-request')?.addEventListener('click', () => {
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
      '&body=' + encodeURIComponent(body);
  });
})();
