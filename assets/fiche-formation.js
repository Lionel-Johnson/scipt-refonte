(() => {
 'use strict';
 const id=new URLSearchParams(location.search).get('id');
 const anchor=document.getElementById('conditions');if(!anchor||!id)return;
 const c=(window.sciptProgrammeContenus||{})[id]||{};
 const f=(window.SCIPT_FICHES||{})[id]||{};
 const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
 const val=v=>Array.isArray(v)?(v.length?'<ul>'+v.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':''):(v?esc(v):'');
 const rows=[['Public et niveau requis',f.niveau_requis],['Objectifs',f.objectifs],['Durée',f.duree],['Modalité (présentiel, distanciel, hybride)',f.modalite],['Diplôme ou certification délivré',f.diplome],['Domaines de spécialisation',f.specialisations],['Compétences acquises',f.competences],['Stages, projets et ateliers',f.pratique],['Débouchés',f.debouches],['Prochaine rentrée',f.rentree]];
 const panel=document.createElement('div');panel.className='sc-detail-panel';panel.id='fiche';
 panel.innerHTML='<h2>Fiche de la formation</h2><dl class="fiche-grid">'+rows.filter(r=>Array.isArray(r[1])?r[1].length:!!r[1]).map(r=>'<dt>'+r[0]+'</dt><dd>'+val(r[1])+'</dd>').join('')+'</dl><div class="orient-cta"><a class="btn btn-warning" href="candidature.html?id='+encodeURIComponent(id)+'">Candidater</a><a class="btn btn-outline-primary" href="contact.html">Demander des informations</a><a class="btn btn-outline-success" href="https://wa.me/241074254343">WhatsApp</a></div>';
 anchor.parentNode.insertBefore(panel,anchor);
 const apply=anchor.querySelector('a[href*="admissions.html"]');if(apply)apply.href='candidature.html?id='+encodeURIComponent(id);
 const link=document.createElement('link');link.rel='canonical';link.href='https://sciptinternational.com/programme.html?id='+encodeURIComponent(id);document.head.appendChild(link);
 const title=(document.getElementById('program-title')||{}).textContent;
 if(title){const ld=document.createElement('script');ld.type='application/ld+json';ld.textContent=JSON.stringify({'@context':'https://schema.org','@type':'Course',name:title,description:c.intro||title,provider:{'@type':'EducationalOrganization',name:'SCIPT INTERNATIONAL',url:'https://sciptinternational.com/'}});document.head.appendChild(ld)}
})();
