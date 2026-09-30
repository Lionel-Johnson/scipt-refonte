(() => {
 'use strict';
 document.querySelectorAll('.approved-dropdown').forEach(item=>{
  const button=item.querySelector('[data-bs-toggle="dropdown"]');
  const dropdown=bootstrap.Dropdown.getOrCreateInstance(button,{autoClose:'outside'});
  item.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&matchMedia('(min-width:1200px)').matches){document.querySelectorAll('.approved-dropdown [aria-expanded="true"]').forEach(other=>{if(other!==button)bootstrap.Dropdown.getOrCreateInstance(other).hide()});dropdown.show()}});
  item.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&matchMedia('(min-width:1200px)').matches&&!item.contains(document.activeElement))dropdown.hide()});
  item.addEventListener('focusout',()=>{setTimeout(()=>{if(!item.contains(document.activeElement))dropdown.hide()},0)});
 });
 document.addEventListener('keydown',event=>{if(event.key==='Escape')document.querySelectorAll('.approved-dropdown [aria-expanded="true"]').forEach(button=>{bootstrap.Dropdown.getOrCreateInstance(button).hide();button.focus()})});
 document.querySelectorAll('#year').forEach(el=>el.textContent=new Date().getFullYear());
 if(typeof p!=='undefined'&&p){
  const image=document.querySelector('.sc-detail-hero>.container>img');
  if(image){image.src=p.type==='Professionnelle'?'assets/slide-professionnel-v2.png':p.school.includes('Santé')?'assets/sante.jpg':p.school.includes('Doctorale')?'assets/cours-universitaire.png':p.school.includes('Droit')?'assets/droit.jpg':'assets/cours-technologie.png';image.alt=p.title+' — '+p.school}
 }
 // Les nouvelles pages catalogue/contact chargent le comportement existant de leurs formulaires.
})();
