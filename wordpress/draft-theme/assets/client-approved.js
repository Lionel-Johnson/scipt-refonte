(() => {
 'use strict';
 document.querySelectorAll('.approved-dropdown').forEach(item=>{
  const button=item.querySelector('[data-bs-toggle="dropdown"]');
  if(!button)return;
  const dropdown=bootstrap.Dropdown.getOrCreateInstance(button,{autoClose:'outside'});
  let openedByHover=false,closeTimer;
  const cancelClose=()=>clearTimeout(closeTimer);
  item.addEventListener('pointerenter',e=>{cancelClose();if(e.pointerType==='mouse'&&matchMedia('(min-width:1200px)').matches){document.querySelectorAll('.approved-dropdown [aria-expanded="true"]').forEach(other=>{if(other!==button)bootstrap.Dropdown.getOrCreateInstance(other).hide()});if(button.getAttribute('aria-expanded')!=='true'){dropdown.show();openedByHover=true}}});
  // Bootstrap traite le clic une seule fois, notamment les taps mobiles.
  button.addEventListener('click',event=>{if(openedByHover&&matchMedia('(min-width:1200px)').matches){event.preventDefault();dropdown.show();openedByHover=false}});
  item.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&matchMedia('(min-width:1200px)').matches){cancelClose();closeTimer=setTimeout(()=>{if(!item.matches(':hover')){openedByHover=false;dropdown.hide()}},450)}});
  item.addEventListener('focusout',()=>{setTimeout(()=>{if(!item.matches(':hover')&&!item.contains(document.activeElement))dropdown.hide()},0)});
 });
 document.addEventListener('keydown',event=>{if(event.key==='Escape')document.querySelectorAll('.approved-dropdown [aria-expanded="true"]').forEach(button=>{bootstrap.Dropdown.getOrCreateInstance(button).hide();button.focus()})});
 document.querySelectorAll('#year').forEach(el=>el.textContent=new Date().getFullYear());
 if(typeof p!=='undefined'&&p){
  const lockup=document.getElementById('program-lockup');
  if(lockup){const professional=p.type==='Professionnelle';lockup.src=window.SCIPT_LOGO_POUR_PARCOURS(p);lockup.alt=p.href==='ecole-scipt-international.html'?'Logo officiel École Doctorale Internationale SCIPT':'Logo officiel SCIPT INTERNATIONAL '+(professional?'ACADEMY':'UNIVERSITY')}
  const image=document.querySelector('.sc-detail-hero>.container>img');
  if(image){image.src=p.type==='Professionnelle'?'assets/slide-professionnel-v2.png':p.school.includes('Santé')?'assets/708928025_1838045444299020_3015249326694980685_n.jpg':p.school.includes('Doctorale')?'assets/cours-universitaire.png':p.school.includes('Droit')?'assets/747587268_1884906659612898_6764401732807429606_n.jpg':'assets/cours-technologie.png';image.alt=p.title+' — '+p.school}
 }
 // Les nouvelles pages catalogue/contact chargent le comportement existant de leurs formulaires.
})();
