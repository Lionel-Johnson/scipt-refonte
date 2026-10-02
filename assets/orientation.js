(() => {
 'use strict';
 const form=document.getElementById('orientation-form');if(!form)return;
 const data=window.SCIPT_ORIENTATION||[];
 const DOMAINS={gestion:'droit, gestion et administration',tech:'sciences, technique et numérique',sante:'santé et développement',recherche:'recherche doctorale'};
 const val=n=>(form.elements[n]||{}).value||'';
 // Prérenseignement depuis l'accueil : orientation.html?objectif=metier
 const pre=new URLSearchParams(location.search).get('objectif');
 if(pre){const r=form.querySelector('input[name="objectif"][value="'+pre+'"]');if(r)r.checked=true}
 form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const a={niveau:val('niveau'),objectif:val('objectif'),type:val('type'),domaine:val('domaine'),situation:val('situation'),international:val('international')};
  const advanced=['master','doctorat'].includes(a.niveau);
  const scored=data.filter(p=>p.domain!=='recherche'||advanced).map(p=>{
   let s=0;const why=[];
   if(a.domaine!=='nsp'&&a.domaine===p.domain){s+=3;why.push('le domaine correspond à votre intérêt ('+DOMAINS[p.domain]+')')}
   if(a.type==='diplome'&&p.type==='Universitaire'){s+=3;why.push('vous recherchez un diplôme universitaire')}
   if(a.type==='courte'&&p.type==='Professionnelle'){s+=3;why.push('vous recherchez une formation courte et professionnalisante')}
   if(['etudes','reprendre'].includes(a.objectif)&&p.type==='Universitaire'){s+=2;why.push('cela répond à votre projet d’études')}
   if(['metier','competences'].includes(a.objectif)&&p.type==='Professionnelle'){s+=2;why.push('cela répond à votre objectif métier ou compétences')}
   if(['salarie','emploi','reconversion'].includes(a.situation)&&p.type==='Professionnelle'){s+=1;why.push('format adapté à votre situation actuelle')}
   if(['lyceen','etudiant'].includes(a.situation)&&p.type==='Universitaire'){s+=1;why.push('format adapté à votre situation actuelle')}
   if(p.domain==='recherche'&&advanced){s+=4;why.push('votre niveau d’études permet d’envisager la recherche doctorale')}
   else if(advanced&&p.type==='Universitaire'){s+=1;why.push('votre niveau d’études ouvre l’accès aux parcours universitaires avancés')}
   return {p,s,why}
  }).sort((x,y)=>y.s-x.s);
  let top=scored.filter(x=>x.s>0).slice(0,6);
  if(top.length<3)top=scored.slice(0,3);
  const box=document.getElementById('orientation-results');
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  box.innerHTML='<h2>Vos pistes de formation</h2><p class="orient-note">Ces pistes sont indicatives : les niveaux d’accès, durées et conditions sont confirmés par le service des admissions.</p><div class="orient-grid">'+top.map(({p,why})=>'<article class="orient-card"><span class="orient-tag">'+esc(p.type)+'</span><h3>'+esc(p.title)+'</h3><p class="orient-school">'+esc(p.school)+'</p><p><strong>Pourquoi cette piste :</strong> '+(why.length?esc(why.join(' ; '))+'.':'proposition générale à affiner avec un conseiller.')+'</p><a class="orient-link" href="programme.html?id='+esc(p.id)+'">Voir la fiche →</a></article>').join('')+'</div>'
   +(a.international==='oui'?'<p class="orient-note">Vous êtes intéressé par l’international : consultez la rubrique <a href="admissions.html">Admissions · Étudiants internationaux</a>.</p>':'')
   +'<div class="orient-cta"><a class="btn btn-warning" href="contact.html">Demander conseil</a><a class="btn btn-primary" href="admissions.html">Candidater</a></div>';
  box.hidden=false;box.scrollIntoView({behavior:'smooth',block:'start'});
 });
})();
