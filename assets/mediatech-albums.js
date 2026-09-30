(() => {
 const albums=[...document.querySelectorAll('[data-album]')];
 if(!albums.length)return;
 const buttons=[...document.querySelectorAll('[data-media-filter]')];
 const aliases={atelier:'technique',sciences:'sante'};
 function select(value){
  const chosen=aliases[value]||value;
  const filter=albums.some(a=>a.dataset.album===chosen)?chosen:'tous';
  albums.forEach(a=>a.hidden=filter!=='tous'&&a.dataset.album!==filter);
  buttons.forEach(b=>{const active=b.dataset.mediaFilter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
 }
 buttons.forEach(b=>b.addEventListener('click',()=>{select(b.dataset.mediaFilter);const u=new URL(location.href);u.searchParams.set('filtre',b.dataset.mediaFilter);history.replaceState(null,'',u);}));
 select(new URLSearchParams(location.search).get('filtre')||'tous');
})();
