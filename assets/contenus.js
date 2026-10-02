(() => {
 'use strict';
 const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const safeUrl=u=>/^(https?:\/\/|[a-z0-9-]+\.html)/i.test(u||'')?u:'';
 const fmt=d=>{const x=new Date(d);return isNaN(x)?'':x.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})};
 const empty=(m)=>'<p class="content-empty">'+m+'</p>';
 const link=(u,t)=>safeUrl(u)?' <a href="'+esc(safeUrl(u))+'">'+t+'</a>':'';
 const fill=(id,list,render,msg)=>{const el=document.getElementById(id);if(!el)return;el.innerHTML=list.length?'<div class="content-grid">'+list.map(render).join('')+'</div>':empty(msg)};
 const news=(window.SCIPT_ACTUALITES||[]).filter(n=>n.titre&&fmt(n.date)).sort((a,b)=>new Date(b.date)-new Date(a.date));
 const card=n=>'<article class="content-card"><span class="orient-tag">'+esc(n.categorie||'Actualité')+' · '+fmt(n.date)+'</span><h3>'+esc(n.titre)+'</h3><p>'+esc(n.resume)+'</p>'+link(n.lien,'Lire la suite →')+'</article>';
 fill('actualites-list',news,card,'Les actualités et événements du SCIPT INTERNATIONAL seront publiés ici, avec leur date et leur catégorie, après validation de la Direction.');
 const home=document.getElementById('home-actualites');
 if(home){if(news.length){home.querySelector('.content-host').innerHTML='<div class="content-grid">'+news.slice(0,3).map(card).join('')+'</div>';home.hidden=false}}
 fill('partenaires-list',window.SCIPT_PARTENAIRES||[],p=>'<article class="content-card"><h3>'+esc(p.nom)+'</h3><p><strong>Nature :</strong> '+esc(p.nature)+'</p><p><strong>Diplôme / certification :</strong> '+esc(p.diplome)+'</p><p><strong>Conditions :</strong> '+esc(p.conditions)+'</p><p><strong>Reconnaissance :</strong> '+esc(p.reconnaissance)+'</p>'+link(p.lien,'Site du partenaire →')+'</article>','Les partenariats seront présentés ici avec l’institution partenaire, la nature du partenariat, le diplôme ou la certification concerné et les conditions, après validation de la Direction.');
 fill('accreditations-list',window.SCIPT_ACCREDITATIONS||[],a=>'<article class="content-card"><h3>'+esc(a.intitule)+'</h3><p><strong>Organisme :</strong> '+esc(a.organisme)+'</p><p><strong>Référence :</strong> '+esc(a.reference)+'</p><p class="orient-note">Dernière vérification : '+(fmt(a.verifie_le)||'non renseignée')+'</p></article>','Les accréditations et agréments seront publiés ici avec leur référence officielle et leur date de dernière vérification.');
 fill('temoignages-list',(window.SCIPT_TEMOIGNAGES||[]).filter(t=>t.autorisation===true),t=>'<article class="content-card"><blockquote>'+esc(t.texte)+'</blockquote><p><strong>'+esc(t.nom)+'</strong> · '+esc(t.formation)+'</p></article>','Les témoignages d’étudiants seront publiés ici, uniquement avec l’accord écrit de chaque personne.');
})();
