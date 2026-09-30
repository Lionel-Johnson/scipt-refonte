(() => {
  const root = document.getElementById('mediatech-feed');
  if (!root) return;
  const entries = Array.isArray(window.SCIPT_MEDIATECH) ? window.SCIPT_MEDIATECH : [];
  const buttons = [...document.querySelectorAll('[data-mediatech-filter]')];
  const trustedUrl = value => {
    if (typeof value !== 'string') return '';
    if (/^assets\/[\w./-]+\.(mp4|webm|jpg|jpeg|png|webp)$/i.test(value) && !value.includes('..')) return value;
    try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; } catch { return ''; }
  };
  const videoSource = value => {
    const url = trustedUrl(value);
    if (!url) return null;
    if (/^assets\//.test(url) && /\.(mp4|webm)$/i.test(url)) return {kind:'file',url};
    try {
      const parsed = new URL(url), host = parsed.hostname.toLowerCase();
      let id = '';
      if (['youtube.com','www.youtube.com','m.youtube.com'].includes(host)) id = parsed.searchParams.get('v') || parsed.pathname.match(/^\/shorts\/([\w-]{11})/)?.[1] || '';
      if (host === 'youtu.be') id = parsed.pathname.slice(1);
      if (/^[\w-]{11}$/.test(id)) return {kind:'embed',url:'https://www.youtube-nocookie.com/embed/'+id};
      if (['vimeo.com','www.vimeo.com'].includes(host) && /^\/\d+$/.test(parsed.pathname)) return {kind:'embed',url:'https://player.vimeo.com/video'+parsed.pathname};
    } catch {}
    return {kind:'link',url};
  };
  const make = (tag, className, text) => { const el=document.createElement(tag); if(className)el.className=className; if(text)el.textContent=text; return el; };
  const render = filter => {
    root.replaceChildren();
    const shown = entries.filter(item => item && ['image','texte','video'].includes(item.type) && (filter === 'tous' || item.type === filter));
    if (!shown.length) { root.append(make('p','mediatech-empty',filter==='video'?'Les premières vidéos validées apparaîtront ici. Vous pouvez proposer la vôtre ci-dessous.':'Aucun contenu pour cette catégorie pour le moment.')); return; }
    shown.forEach(item => {
      const card=make('article','mediatech-entry');
      const visual=make('div','mediatech-entry-media');
      if (item.type === 'video' && item.video) {
        const source=videoSource(item.video);
        if (source?.kind==='embed') { const frame=make('iframe');frame.src=source.url;frame.title=item.title||'Témoignage en vidéo';frame.loading='lazy';frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;visual.append(frame); }
        else if (source?.kind==='file') {const player=make('video');player.src=source.url;player.controls=true;player.preload='metadata';player.playsInline=true;visual.append(player);}
        else if (source?.kind==='link') {const link=make('a','mediatech-video-link','Voir la vidéo ↗');link.href=source.url;link.target='_blank';link.rel='noopener noreferrer';visual.append(link);}
      }
      if (!visual.children.length) {const src=trustedUrl(item.image)||'assets/cours-universitaire.png';const img=make('img');img.src=src;img.alt=item.alt||item.title||'Illustration';img.loading='lazy';visual.append(img);}
      const body=make('div','mediatech-entry-body');body.append(make('span','mediatech-entry-type',item.type.toUpperCase()+' / '+(item.category||'SCIPT')));
      body.append(make('h3','',item.title||'La vie du SCIPT'));body.append(make('p','',item.text||''));
      if (item.link && /^[a-z0-9-]+\.html(?:[?#].*)?$/.test(item.link)) {const link=make('a','sc-album-link',item.linkLabel||'En savoir plus →');link.href=item.link;body.append(link);}
      if (item.credit)body.append(make('small','mediatech-credit',item.credit));
      card.append(visual,body);root.append(card);
    });
  };
  buttons.forEach(button=>button.addEventListener('click',()=>{buttons.forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));});render(button.dataset.mediatechFilter);}));
  render('tous');
  if (location.hash === '#mediatech-videos') buttons.find(item=>item.dataset.mediatechFilter==='video')?.click();
  document.getElementById('mediatech-form')?.addEventListener('submit',event=>{
    event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;
    const get=id=>document.getElementById(id).value.trim();
    if (get('med-type')!=='Texte' && !get('med-link')) {document.getElementById('med-link').setCustomValidity('Ajoutez le lien vers votre image ou votre vidéo.');document.getElementById('med-link').reportValidity();return;}
    document.getElementById('med-link').setCustomValidity('');
    const body=`Nom : ${get('med-name')}\nEmail : ${get('med-email')}\nContenu : ${get('med-type')}\nLien : ${get('med-link')||'Sans lien'}\n\nCommentaire :\n${get('med-message')}\n\nAccord pour être contacté : oui`;
    location.href='mailto:info@sciptinternational.com?subject='+encodeURIComponent('Proposition pour la Médiatech SCIPT')+'&body='+encodeURIComponent(body);
  });
  document.getElementById('med-link')?.addEventListener('input',event=>event.currentTarget.setCustomValidity(''));
})();

