(() => {
 'use strict';
 const form=document.getElementById('apply-form');if(!form)return;
 const panels=[...form.querySelectorAll('.apply-panel')];
 const steps=[...document.querySelectorAll('.apply-steps li')];
 const err=document.getElementById('apply-error');
 const data=window.SCIPT_ORIENTATION||[];
 const sel=document.getElementById('a-formation');
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 [['Universitaire','Programmes universitaires'],['Professionnelle','Formations professionnelles']].forEach(([t,l])=>{
  const g=document.createElement('optgroup');g.label=l;
  data.filter(p=>p.type===t).forEach(p=>{const o=document.createElement('option');o.value=p.id;o.textContent=p.title+' — '+p.school;g.appendChild(o)});sel.appendChild(g)});
 const pre=new URLSearchParams(location.search).get('id');if(pre&&data.some(p=>p.id===pre))sel.value=pre;
 let cur=0;
 const show=n=>{cur=n;panels.forEach((p,i)=>p.hidden=i!==n);steps.forEach((s,i)=>{s.classList.toggle('done',i<n);i===n?s.setAttribute('aria-current','step'):s.removeAttribute('aria-current')});
  if(n===panels.length-1)recap();err.textContent='';panels[n].querySelector('input,select,textarea,h2')?.focus();
  if(window.sciptTrack)sciptTrack('candidature_etape',{etape:n+1})};
 const valid=()=>{const bad=[...panels[cur].querySelectorAll('input,select,textarea')].find(el=>!el.checkValidity());
  if(bad){err.textContent=bad.validationMessage||'Merci de compléter ce champ.';bad.focus();return false}return true};
 const v=id=>document.getElementById(id).value.trim();
 const checked=name=>[...form.querySelectorAll('input[name="'+name+'"]:checked')].map(i=>i.value);
 const lines=()=>{const p=data.find(x=>x.id===v('a-formation'))||{};return [
  ['Nom et prénom',v('a-nom')+' '+v('a-prenom')],['E-mail',v('a-email')],['Téléphone',v('a-tel')],['Pays de résidence',v('a-pays')],
  ['Niveau d’études actuel',v('a-niveau')],['Dernier diplôme',v('a-diplome')],['Situation',v('a-situation')],
  ['Formation choisie',(p.title||'')+(p.school?' — '+p.school:'')],['Niveau visé',v('a-vise')],
  ['Pièces que je joindrai',checked('piece').join(', ')||'à préciser']]};
 const recap=()=>{document.getElementById('apply-recap').innerHTML=lines().map(l=>'<dt>'+esc(l[0])+'</dt><dd>'+esc(l[1]||'—')+'</dd>').join('')};
 form.addEventListener('click',e=>{
  if(e.target.matches('[data-next]')&&valid())show(cur+1);
  if(e.target.matches('[data-prev]'))show(cur-1)});
 form.addEventListener('submit',e=>{
  e.preventDefault();if(!valid())return;
  const body=['Bonjour,','Je souhaite déposer ma candidature auprès du SCIPT INTERNATIONAL.',''].concat(lines().map(l=>l[0]+' : '+(l[1]||'—')),['','Je déclare que les informations ci-dessus sont exactes.','Je joins à ce message les pièces listées ci-dessus.']).join('\n');
  document.getElementById('apply-result').hidden=false;
  if(window.sciptTrack)sciptTrack('candidature_preparee');
  location.href='mailto:admissions@sciptinternational.com?subject='+encodeURIComponent('Candidature — '+v('a-nom')+' '+v('a-prenom'))+'&body='+encodeURIComponent(body)});
 show(0);
})();
