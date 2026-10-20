/* Galeries de stage et légendes des deux formations concernées. */
(() => {
  'use strict';
  const data = window.SCIPT_STAGES_FROID;
  if (!data) return;
  const photoUrl = photo => window.SCIPT_STAGE_URLS?.[photo.key] || new URL(photo.file, window.SCIPT_STAGE_ASSET_ROOT).href;
  const id = new URLSearchParams(location.search).get('id');
  if (data.course_ids.includes(id)) {
    if (!document.getElementById('stages-froid-climatisation')) {
      const template = document.createElement('template');
      template.innerHTML = data.html;
      template.content.querySelectorAll('[data-stage-photo]').forEach(figure => {
        const photo = data.photos.find(item => item.key === figure.dataset.stagePhoto);
        figure.querySelector('img').src = photoUrl(photo);
        figure.querySelector('a').href = photoUrl(photo);
      });
      document.querySelector('main')?.append(template.content);
    }
    const photo = data.photos.find(item => item.key === data.covers[id]);
    const image = document.getElementById('program-hero-image');
    const holder = document.getElementById('program-hero-media');
    const caption = document.getElementById('program-hero-caption');
    if (photo && image) {
      holder?.classList.add('sc-real-stage-photo');
      const label = () => {
        image.alt = photo.caption;
        if (caption) caption.textContent = photo.caption;
      };
      image.addEventListener('load', label);
      image.src = photoUrl(photo);
      label();
    }
  }
  let dialog;
  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-stage-zoom]');
    if (!link || typeof HTMLDialogElement === 'undefined') return;
    event.preventDefault();
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.className = 'sc-stage-lightbox';
      dialog.setAttribute('aria-label', 'Photographie d’étudiants en stage');
      dialog.innerHTML = '<button type="button" aria-label="Fermer la photographie">Fermer ×</button><img alt=""><p></p>';
      dialog.querySelector('button').addEventListener('click', () => dialog.close());
      dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
      document.body.append(dialog);
    }
    const caption = link.querySelector('img').alt;
    dialog.querySelector('img').src = link.href;
    dialog.querySelector('img').alt = caption;
    dialog.querySelector('p').textContent = caption;
    dialog.showModal();
  });
})();
