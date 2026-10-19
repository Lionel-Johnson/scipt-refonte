/* Logos officiels fournis par la direction — 20 octobre 2026. */
(function () {
  'use strict';
  const root = new URL('.', document.currentScript.src);
  const files = {"academy": "logos/scipt-academy-20261020.webp", "university": "logos/scipt-university-20261020.webp", "ediLockup": "logos/edi-scipt-bandeau-20261020.webp", "EDI": "logos/edi-scipt-20261020.webp", "ESHC": "logos/eshc-scipt-20261020.webp", "ESSA": "logos/essa-scipt-20261020.webp", "ESGA": "logos/esga-scipt-20261020.webp", "ESTI": "logos/esti-scipt-20261020.webp"};
  const overrides = window.SCIPT_LOGOS || {};
  window.SCIPT_LOGOS = Object.freeze(Object.fromEntries(
    Object.entries(files).map(([key, file]) => [key, overrides[key] || new URL(file, root).href])
  ));
  window.SCIPT_LOGO_POUR_PARCOURS = function (course) {
    const doctoral = course?.href?.split('?')[0] === 'ecole-scipt-international.html' || /Doctorale/i.test(course?.school || '');
    return window.SCIPT_LOGOS[doctoral ? 'ediLockup' : course?.type === 'Professionnelle' ? 'academy' : 'university'];
  };
  window.SCIPT_LOGO_URL = function (file) {
    const key = Object.keys(files).find(key => files[key] === file);
    return key ? window.SCIPT_LOGOS[key] : new URL(file, root).href;
  };
})();
