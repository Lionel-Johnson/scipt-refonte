(()=>{'use strict';const buttons=document.querySelectorAll('[data-institution-image]');if(!buttons.length||typeof HTMLDialogElement==='undefined')return;const dialog=document.createElement('dialog');dialog.className='scipt-about-dialog inst-dialog';dialog.setAttribute('aria-labelledby','institution-dialog-title');dialog.innerHTML='<header class="scipt-about-dialog-header"><div><span>SCIPT INTERNATIONAL</span><h2 id="institution-dialog-title"></h2></div><button class="scipt-about-close" type="button" aria-label="Fermer">✕</button></header><div class="scipt-about-dialog-content"><img alt=""/></div>';document.body.append(dialog);let active;buttons.forEach(button=>button.addEventListener('click',()=>{active=button;dialog.querySelector('h2').textContent=button.dataset.institutionTitle;const img=dialog.querySelector('img');img.src=button.dataset.institutionImage;img.alt=button.dataset.institutionTitle;dialog.showModal()}));dialog.querySelector('button').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>active?.focus({preventScroll:true}));dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close()});})();


/* Retour client du 16 octobre : restaurer les vidéos ESSA après la présentation
   sans toucher à la structure des écoles, départements et filières validée. */
(() => {
  'use strict';
  const mediaRoot = 'https://sciptinternational.com/wp-content/uploads/2026/10/';
  const repoRoot = 'https://raw.githubusercontent.com/Lionel-Johnson/scipt-refonte/main/assets/videos/';
  const media = [
    {
      title: 'Ateliers, stages et mises en situation',
      caption: 'Découvrez les exercices pratiques et les mises en situation encadrées.',
      url: mediaRoot + 'VID-20260604-WA0006_2.mp4',
      poster: 'https://raw.githubusercontent.com/Lionel-Johnson/scipt-refonte/main/assets/sante.jpg'
    },
    {
      title: 'Témoignage étudiant : Elsa en stage',
      caption: 'Elsa partage son expérience de stage dans le domaine de la santé.',
      url: mediaRoot + 'Sante-le-temoignage-dElsa-en-stage.mp4',
      alternate: repoRoot + 'scipt-video-07.mp4',
      poster: repoRoot + 'scipt-video-07.jpg'
    },
    {
      title: 'Témoignage étudiant : Murielle, sciences infirmières',
      caption: 'Murielle revient sur son parcours de formation en sciences infirmières.',
      url: mediaRoot + 'Sciences-infirmieres-le-temoignage-de-Murielle.mp4',
      alternate: repoRoot + 'scipt-video-08.mp4',
      poster: repoRoot + 'scipt-video-08.jpg'
    }
  ];
  function addSource(video, url) {
    const source = document.createElement('source');
    source.src = url;
    source.type = 'video/mp4';
    video.appendChild(source);
    return source;
  }
  function restoreHealthGallery(film) {
    if (document.getElementById('essa-videos-complementaires')) return;
    const title = document.querySelector('.inst-page h1');
    if (!title || !/École des Sciences de la Santé/i.test(title.textContent || '')) return;
    const section = document.createElement('section');
    section.id = 'essa-videos-complementaires';
    section.className = 'scipt-video-gallery scipt-school-gallery container';
    section.setAttribute('aria-labelledby', 'essa-videos-title');
    const kicker = document.createElement('span');
    kicker.className = 'kicker';
    kicker.textContent = 'ARCHIVES AUDIOVISUELLES · SCIPT INTERNATIONAL';
    const heading = document.createElement('h2');
    heading.id = 'essa-videos-title';
    heading.textContent = 'Ateliers, stages et témoignages';
    const intro = document.createElement('p');
    intro.textContent = 'Retrouvez les vidéos validées de l’école, en complément de la présentation institutionnelle ci-dessus.';
    const grid = document.createElement('div');
    grid.className = 'scipt-video-gallery-grid';
    media.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'scipt-video-card';
      const frame = document.createElement('div');
      frame.className = 'scipt-video-frame';
      const video = document.createElement('video');
      video.controls = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.poster = item.poster;
      video.setAttribute('aria-label', item.title);
      addSource(video, item.url);
      if (item.alternate) addSource(video, item.alternate);
      frame.appendChild(video);
      const h3 = document.createElement('h3');
      h3.textContent = item.title;
      const paragraph = document.createElement('p');
      paragraph.textContent = item.caption;
      card.append(frame, h3, paragraph);
      grid.appendChild(card);
    });
    section.append(kicker, heading, intro, grid);
    film.insertAdjacentElement('afterend', section);
  }
  function addPlayerHelp(video) {
    if (video.dataset.sciptHelpReady) return;
    const source = video.querySelector('source[src]')?.src || video.currentSrc || video.getAttribute('src');
    if (!source) return;
    video.dataset.sciptHelpReady = 'true';
    const frame = video.parentElement;
    if (!frame) return;
    const help = document.createElement('p');
    help.className = 'scipt-player-help';
    help.hidden = true;
    help.setAttribute('role', 'status');
    help.append(document.createTextNode('La lecture intégrée ne fonctionne pas ? '));
    const link = document.createElement('a');
    link.href = source;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Ouvrir la vidéo directement';
    help.append(link);
    frame.appendChild(help);
    const show = () => { help.hidden = false; };
    const hide = () => { help.hidden = true; };
    video.addEventListener('error', show);
    video.querySelectorAll('source').forEach((s) => s.addEventListener('error', () => {
      if (!Array.from(video.querySelectorAll('source')).some((candidate) => candidate !== s && !candidate.dataset.sciptFailed)) show();
      s.dataset.sciptFailed = 'true';
    }));
    video.addEventListener('loadedmetadata', hide);
    video.addEventListener('playing', hide);
  }
  function ready() {
    const film = document.querySelector('.inst-page .inst-school-film');
    if (!film) return;
    restoreHealthGallery(film);
    document.querySelectorAll('.inst-page .inst-school-film video, .inst-page .scipt-school-gallery video').forEach(addPlayerHelp);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true });
  else ready();
})();
