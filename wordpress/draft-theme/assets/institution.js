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


/* Extension validée : lecteur associé à chaque école, pôle et formation.
   Les clips qui ne concernent pas directement la filière sont explicitement
   présentés comme des vidéos de son école de rattachement. */
(() => {
  'use strict';
  const wp = 'https://sciptinternational.com/wp-content/uploads/2026/10/';
  const gh = 'https://raw.githubusercontent.com/Lionel-Johnson/scipt-refonte/main/assets/videos/';
  const schools = {
    'ecole-sante-developpement.html': {
      key: 'sante', name: 'École des Sciences de la Santé',
      title: 'Présentation des formations en santé',
      url: wp+'Spot-Final-Sante.mp4',
      poster: 'https://raw.githubusercontent.com/Lionel-Johnson/scipt-refonte/main/assets/sante.jpg',
      mode: 'presentation'
    },
    'ecole-droit-sciences-gestion.html': {
      key: 'gestion', name: 'École de Droit, Gestion, Administration et Commerce',
      title: 'Témoignage de Pemba : transport et logistique',
      url: wp+'Transport-et-logistique-temoignage-de-Pemba.mp4',
      poster: gh+'scipt-video-02.jpg',
      mode: 'temoignage'
    },
    'ecole-sciences-technologies-ingenierie.html': {
      key: 'technologies', name: 'École des Sciences, Technologies et Ingénierie',
      title: 'Présentation des sciences, technologies et ingénierie',
      url: gh+'ecole-technologies.mp4', poster: gh+'ecole-technologies.jpg',
      mode: 'presentation'
    },
    'ecole-sciences-humaines-communication.html': {
      key: 'humaines', name: 'École des Sciences Humaines, Sociales et de la Communication',
      title: 'Présentation des sciences humaines et de la communication',
      url: gh+'ecole-humaines.mp4', poster: gh+'ecole-humaines.jpg',
      mode: 'presentation'
    },
    'ecole-scipt-international.html': {
      key: 'doctorale', name: 'École Doctorale Internationale SCIPT',
      title: 'Présentation des parcours doctoraux et de la recherche',
      url: gh+'ecole-doctorale.mp4', poster: gh+'ecole-doctorale.jpg',
      mode: 'presentation'
    }
  };
  const poleMedia = [
    {title:'Présentation générale des formations en santé',url:wp+'Spot-Final-Sante.mp4',poster:schools['ecole-sante-developpement.html'].poster,description:'Vidéo générale de l’École des Sciences de la Santé'},
    {title:'Témoignage : sciences infirmières',url:wp+'Sciences-infirmieres-le-temoignage-de-Murielle.mp4',poster:gh+'scipt-video-08.jpg',description:'Témoignage d’une étudiante en sciences infirmières, non spécifique à la formation de sage-femme'},
    {title:'Ateliers et mises en situation en santé',url:wp+'VID-20260604-WA0006_2.mp4',poster:schools['ecole-sante-developpement.html'].poster,description:'Exemples de pratique en santé, sans rattachement exclusif à une filière paramédicale'}
  ];
  function movie(item, label) {
    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'none';
    video.poster = item.poster;
    video.setAttribute('aria-label',label||item.title);
    const source = document.createElement('source');
    source.src = item.url;
    source.type = 'video/mp4';
    video.append(source);
    return video;
  }
  function directLink(item) {
    const a=document.createElement('a');
    a.href=item.url;
    a.textContent='Ouvrir la vidéo directement ↗';
    a.target='_blank';a.rel='noopener noreferrer';
    a.className='scipt-direct-video';
    return a;
  }
  function player(item, label) {
    const box=document.createElement('div');
    box.className='scipt-video-frame scipt-media-player';
    const video=movie(item,label);
    box.append(video);
    const fallback=document.createElement('div');
    fallback.className='scipt-video-fallback';
    fallback.append(directLink(item));
    // Un lien d'accès demeure visible même si le navigateur ne déclenche pas error.
    const note=document.createElement('span');
    note.textContent='Si la lecture ne démarre pas : ';
    fallback.prepend(note);
    box.append(fallback);
    video.addEventListener('error',()=>box.classList.add('scipt-media-error'));
    return box;
  }
  function filmAnchor(film) {
    if(!film.id)film.id='presentation-video-ecole';
    return '#'+film.id;
  }
  function supplementPoleCards(school, film) {
    const main=document.querySelector('.inst-page');
    if(!main)return;
    const anchor=filmAnchor(film);
    const headings=[...main.querySelectorAll('.inst-section h2')];
    const poleHeading=headings.find(h=>/trois pôles/i.test(h.textContent));
    if(school.key==='sante'&&poleHeading){
      const cards=poleHeading.closest('section')?.querySelectorAll('.inst-grid > article.inst-card')||[];
      cards.forEach((card,index)=>{
        if(card.querySelector('.scipt-pole-video') || index>2) return;
        const item=poleMedia[index];
        const details=document.createElement('details');
        details.className='scipt-pole-video';
        const summary=document.createElement('summary');
        summary.textContent='Voir une vidéo en lien avec ce pôle';
        const caption=document.createElement('p');
        caption.className='scipt-pole-caption';
        caption.textContent=item.description;
        details.append(summary,caption,player(item),document.createElement('p'));
        details.lastElementChild.append(directLink(item));
        card.querySelector('.inst-card-body')?.append(details);
      });
    }
    const depHeading=headings.find(h=>/départements et filières/i.test(h.textContent));
    const departments=depHeading?.closest('section')?.querySelectorAll('details.inst-card')||[];
    departments.forEach(group=>{
      if(group.querySelector('.scipt-department-video-link'))return;
      const link=document.createElement('a');
      link.href=anchor;
      link.className='scipt-department-video-link';
      link.textContent=school.mode==='temoignage'?'Voir le témoignage disponible de l’école ↑':'Voir la présentation vidéo de l’école ↑';
      // Le lien ne modifie ni les filières, ni les cartes existantes.
      group.append(link);
    });
  }
  function schoolPage() {
    const main=document.querySelector('main.inst-page');
    const film=main?.querySelector('.inst-school-film');
    if(!film)return;
    const h=main.querySelector('.inst-hero h1');
    if(!h)return;
    const name=h.textContent.toLocaleLowerCase('fr');
    const school=Object.values(schools).find(s=>name.includes(s.name.toLocaleLowerCase('fr'))||
      (s.key==='sante'&&name.includes('sciences de la santé')));
    if(!school)return;
    supplementPoleCards(school,film);
    if(school.mode==='temoignage'){
      const eyebrow=film.querySelector('.scipt-video-copy > span');
      if(eyebrow)eyebrow.textContent='SCIPT INTERNATIONAL · TÉMOIGNAGE';
    }
    if(!film.querySelector('.scipt-direct-video')){
      const video=film.querySelector('video');
      const frame=video?.closest('.scipt-video-frame');
      if(frame){const link=document.createElement('p');link.className='scipt-video-direct-line';link.append(directLink(school));frame.insertAdjacentElement('afterend',link);}
    }
  }
  function programPage() {
    const hero=document.querySelector('.sc-detail-hero');
    if(!hero||document.querySelector('#scipt-programme-video'))return;
    const params=new URLSearchParams(location.search);
    const requested=params.get('id');
    const item=(typeof programmes!=='undefined'&&requested)?programmes[requested]:null;
    if(!item)return;
    const href=item.href?.split('?')[0];
    const school=schools[href];
    if(!school||!school.url)return;
    const root=document.createElement('section');
    root.id='scipt-programme-video';
    root.className='scipt-video-section container scipt-programme-video';
    root.setAttribute('aria-label','Présentation vidéo de l’école de rattachement');
    const card=document.createElement('div');
    card.className='scipt-video-panel';
    const copy=document.createElement('div');
    copy.className='scipt-video-copy';
    const eyebrow=document.createElement('span');
    eyebrow.textContent=school.mode==='temoignage'?'TÉMOIGNAGE DE L’ÉCOLE DE RATTACHEMENT':'VIDÉO DE L’ÉCOLE DE RATTACHEMENT';
    const title=document.createElement('h2');
    title.textContent=school.title;
    const intro=document.createElement('p');
    intro.textContent=school.mode==='temoignage'?
      'Ce témoignage concerne la logistique et la gestion au sein de l’école ; il ne constitue pas une vidéo propre à cette filière.':
      'Présentation de l’école à laquelle appartient cette formation ; le film n’est pas nécessairement spécifique à cette filière.';
    copy.append(eyebrow,title,intro);
    card.append(copy,player(school,'Vidéo de l’école : '+school.name));
    root.append(card);
    // Les scènes et témoignages complémentaires restent associés aux formations concernées.
    let extra=[];
    const programId=item.alias_of||requested;
    if(school.key==='sante'){
      if(programId==='7660'||programId==='7661'||programId==='7824'){
        extra=[poleMedia[1],poleMedia[2]];
      }else if(programId==='7659'||programId==='7662'||programId==='7663'||programId==='7664'||
       item.type==='Professionnelle'){
        extra=[poleMedia[2]];
      }
    }else if(school.key==='technologies'&&programId==='7818'){
      extra=[{title:'Formation professionnelle : beauté et esthétique',url:gh+'scipt-video-09.mp4',poster:gh+'scipt-video-09.jpg',description:'Témoignage et présentation dans les métiers de la beauté et de l’esthétique'}];
    }
    if(extra.length){
      const heading=document.createElement('h3');
      heading.className='scipt-programme-extras-title';
      heading.textContent='Pratique et témoignages disponibles';
      const grid=document.createElement('div');
      grid.className='scipt-video-gallery-grid';
      extra.forEach(m=>{
        const article=document.createElement('article');article.className='scipt-video-card';
        const h=document.createElement('h4');h.textContent=m.title;
        const p=document.createElement('p');p.textContent=m.description;
        article.append(player(m),h,p);
        grid.append(article);
      });
      root.append(heading,grid);
    }
    hero.insertAdjacentElement('afterend',root);
  }
  function ready(){schoolPage();programPage();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
