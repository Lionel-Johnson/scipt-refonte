/* Présentation des domaines : les contenus proviennent de la fiche fournie par le client. */
(() => {
  'use strict';
  window.SCIPT_RENDER_DOCTORAL = (id) => {
    const views = window.SCIPT_DOCTORAL_VIEWS;
    if (!views?.[id]) return false;
    const number = new URLSearchParams(location.search).get('domaine');
    const key = number && views[id + '-' + number] ? id + '-' + number : id;
    const view = views[key];
    document.getElementById('fiche')?.remove();
    for (const [name, markup] of Object.entries(view.panels)) {
      const panel = document.getElementById(name);
      if (panel) panel.innerHTML = markup;
    }
    const title = document.getElementById('program-title');
    if (title) title.textContent = view.title;
    document.title = view.title + ' — École Doctorale Internationale SCIPT';
    const type = document.getElementById('program-type');
    if (type) type.textContent = view.number ? 'DOMAINE DOCTORAL ' + view.number : 'GRAND DOMAINE DOCTORAL';
    const back = document.getElementById('program-back');
    if (back) {
      back.href = view.number ? 'programme.html?id=' + id : 'ecole-scipt-international.html#domaines-doctoraux';
      back.textContent = view.number ? '← Voir le grand domaine' : '← Voir les seize domaines';
    }
    const caption = document.getElementById('program-hero-caption');
    const label = () => { if (caption) caption.textContent = view.title; };
    document.getElementById('program-hero-image')?.addEventListener('load', label);
    label();
    const labels = {presentation:'Présentation',objectifs:'Orientation scientifique','programme-detaille':'Disciplines et spécialités',stages:'Axes de recherche',conditions:'Accès et positionnement',debouches:'Déroulement',frais:'Durées et coûts',faq:'Questions fréquentes'};
    const main = document.querySelector('main');
    main?.querySelectorAll('a[href^="#"]').forEach(a => {
      const label = labels[a.getAttribute('href').slice(1)];
      if (label) a.textContent = label;
    });
    main?.querySelectorAll('a[href*="candidature.html"]').forEach(a => {
      a.href = 'contact.html'; a.textContent = 'Échanger sur mon projet →';
    });
    main?.querySelectorAll('a[href]').forEach(a => {
      const parsed = new URL(a.getAttribute('href'), document.baseURI);
      const slug = parsed.pathname.split('/').pop()?.replace(/\.html$/, '');
      const native = window.SCIPT_DOCTORAL_LINKS?.[slug];
      if (!native) return;
      const url = new URL(native);
      parsed.searchParams.forEach((value, key) => url.searchParams.set(key, value));
      url.hash = parsed.hash;
      a.href = url.href;
    });
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = 'https://sciptinternational.com/programme.html?id=' + id + (view.number ? '&domaine=' + view.number : '');
    document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
      try {
        const record = JSON.parse(script.textContent);
        if (record['@type'] === 'Course') {
          record.name = view.title; record.description = view.intro;
          script.textContent = JSON.stringify(record);
        }
      } catch (_) { /* Les autres données structurées restent intactes. */ }
    });
    return true;
  };
})();
