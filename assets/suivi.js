/* Suivi des conversions (cahier des charges §27) : événements poussés dans window.dataLayer.
   Aucun script tiers n'est chargé ici : brancher Google Tag Manager / GA4 / Matomo après validation du client
   et consentement du visiteur. */
(() => {
 'use strict';
 window.dataLayer=window.dataLayer||[];
 const push=(event,extra)=>window.dataLayer.push(Object.assign({event,page:location.pathname.split('/').pop()||'index.html'},extra||{}));
 window.sciptTrack=push;
 document.addEventListener('click',e=>{
  const a=e.target.closest&&e.target.closest('a[href]');if(!a)return;
  const h=a.getAttribute('href')||'';
  if(/wa\.me/.test(h))push('whatsapp_click');
  else if(h.startsWith('tel:'))push('phone_click');
  else if(h.startsWith('mailto:'))push('email_click',{cible:h.split('?')[0].slice(7)});
  else if(/candidature\.html/.test(h))push('candidature_cta');
  else if(/orientation\.html/.test(h))push('orientation_cta');
  else if(/programme\.html\?id=/.test(h))push('formation_consultee',{id:(h.match(/id=(\d+)/)||[])[1]});
 });
 document.addEventListener('submit',e=>{if(e.target&&e.target.id)push('formulaire_prepare',{formulaire:e.target.id})});
})();
