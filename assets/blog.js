/* Blog SCIPT — recherche des articles et sélection des filières (GitHub / WordPress). */
(() => {
  'use strict';
  const root=document.getElementById('scipt-blog-feed');
  if(!root)return;
  const form=document.getElementById('scipt-blog-search');
  const category=document.getElementById('scipt-blog-category');
  if(!form || !category)return;
  const allPrograms=window.SCIPT_BLOG_PROGRAMMES||[];
  const plain=html=>new DOMParser().parseFromString(String(html||''),'text/html').body.textContent.trim();
  const clean=s=>plain(s).toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const make=(tag,value,cls)=>{const x=document.createElement(tag);if(value!=null)x.textContent=value;if(cls)x.className=cls;return x};
  const isWordPress=/^(www\.)?sciptinternational\.com$/i.test(location.hostname);
  const date=d=>{const x=new Date(d);return Number.isNaN(x.getTime())?'':x.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})};
  const imageUrl=x=>{try{const u=new URL(x,location.href);return ['http:','https:'].includes(u.protocol)?u.href:''}catch{return ''}};
  const iconName=text=>{
    const s=clean(text);
    if(/droit|juridi|justice|avocat|politique|administration publique/.test(s))return 'fa-scale-balanced';
    if(/sante|soins|infirm|medical|pharmacie|maieutique/.test(s))return 'fa-stethoscope';
    if(/informat|numerique|digital|logiciel|bureautique/.test(s))return 'fa-laptop-code';
    if(/genie|electric|batiment|plomb|technique|maintenance/.test(s))return 'fa-screwdriver-wrench';
    if(/commerce|finance|marketing|gestion|entrepr|audit/.test(s))return 'fa-chart-line';
    if(/journal|communic|audiovis|media/.test(s))return 'fa-newspaper';
    if(/stage|formation|parcours|universit|etud/.test(s))return 'fa-graduation-cap';
    if(/vae|experience/.test(s))return 'fa-award';
    return 'fa-book-open';
  };
  const appendIcon=(node,title)=>{
    if(!node||node.querySelector('.scipt-blog-title-icon'))return;
    const ico=make('i',null,'scipt-blog-title-icon fa-solid '+iconName(title));
    ico.setAttribute('aria-hidden','true');
    node.prepend(ico);
  };
  document.querySelectorAll('.scipt-editorial-card h3, .scipt-editorial-card h2').forEach(h=>appendIcon(h,h.textContent));
  document.querySelectorAll('.about-section .container>h2').forEach(h=>appendIcon(h,h.textContent));
  const programSelect=make('select',null,'form-select');
  programSelect.id='scipt-blog-programme';
  programSelect.setAttribute('aria-label','Choisir une filière ou un programme');
  programSelect.append(new Option('Toutes les filières et programmes',''));
  const schoolGroups=new Map();
  allPrograms.forEach(p=>{
    if(!schoolGroups.has(p.school)){
      const group=document.createElement('optgroup');group.label=p.school;
      schoolGroups.set(p.school,group);programSelect.append(group);
    }
    const opt=new Option(p.title+(p.pathway?' — '+p.pathway:''),p.id);
    schoolGroups.get(p.school).append(opt);
  });
  const programLabel=make('label','Filière / programme');
  programLabel.append(programSelect);
  const submit=form.querySelector('button[type="submit"],button');
  if(submit)form.insertBefore(programLabel,submit);else form.append(programLabel);
  const articleCount=make('p','','scipt-blog-count');
  articleCount.setAttribute('aria-live','polite');
  form.insertAdjacentElement('afterend',articleCount);
  const directory=make('section',null,'scipt-blog-programs');
  directory.id='scipt-blog-programs';
  directory.setAttribute('aria-labelledby','scipt-blog-programs-title');
  directory.append(make('h2','Explorer les filières et programmes'));
  const listings=make('div',null,'scipt-blog-program-grid');
  directory.append(listings);
  const more=make('button','Afficher toutes les filières','scipt-blog-more btn btn-outline-primary');
  more.type='button'; directory.append(more);
  root.insertAdjacentElement('afterend',directory);
  let posts=[],fullList=false;
  const excerptFor=p=>plain(p.excerpt||'');
  const linkFor=p=>isWordPress&&imageUrl(p.link)?p.link:('blog.html?article='+p.id);
  const programUrl=p=>isWordPress?('https://sciptinternational.com/?page_id=7891&id='+encodeURIComponent(p.id)):('programme.html?id='+encodeURIComponent(p.id));
  const renderPrograms=(query,selected)=>{
    listings.replaceChildren();
    const visible=allPrograms.filter(p=>(!selected||p.id===selected) && (!query||clean([p.title,p.school,p.department,p.pathway,p.type].join(' ')).includes(clean(query))));
    const shown=selected||query||fullList?visible:visible.filter(p=>['7645','7656','7660','7652','7916','7678','7901','7822','7913','7821','7806','7651'].includes(p.id));
    shown.forEach(p=>{
      const card=make('article',null,'scipt-blog-program-card');
      const title=make('h3',p.title);appendIcon(title,p.title);card.append(title);
      card.append(make('p',p.school,'scipt-blog-school'));
      card.append(make('span',p.type,'scipt-blog-tag'));
      const a=make('a','Consulter la fiche →','scipt-blog-program-link');a.href=programUrl(p);card.append(a);
      listings.append(card);
    });
    if(!shown.length)listings.append(make('p','Aucune filière ne correspond à ces critères.'));
    more.hidden=!!selected||!!query||visible.length<=shown.length;
    more.textContent='Afficher toutes les filières ('+visible.length+')';
    return shown.length;
  };
  const render=(query='',categoryId='',programId='')=>{
    root.replaceChildren();
    const targetId=Number(new URLSearchParams(location.search).get('article'));
    const article=posts.find(x=>x.id===targetId);
    if(article&&!isWordPress){
      form.hidden=true;directory.hidden=true;articleCount.hidden=true;
      root.classList.remove('scipt-blog-grid');
      const card=make('article',null,'scipt-blog-article');
      const back=make('a','← Tous les articles');back.href='blog.html';card.append(back);
      const h=make('h1',plain(article.title));appendIcon(h,article.title);card.append(h);
      card.append(make('p',date(article.date)+' · '+plain(article.author||'SCIPT INTERNATIONAL'),'scipt-blog-meta'));
      if(imageUrl(article.image)){const img=make('img');img.src=article.image;img.alt=plain(article.title);card.append(img)}
      const doc=new DOMParser().parseFromString(article.content||'','text/html');
      doc.querySelectorAll('script,style,object,embed,form,iframe').forEach(x=>x.remove());
      doc.querySelectorAll('*').forEach(x=>[...x.attributes].forEach(a=>{
        if(a.name.toLowerCase().startsWith('on')||(['href','src'].includes(a.name)&&/^\s*(javascript|data):/i.test(a.value)))x.removeAttribute(a.name);
      }));
      const content=make('div');content.append(...doc.body.childNodes);card.append(content);
      const comments=make('section');const h2=make('h2','Votre commentaire');appendIcon(h2,h2.textContent);comments.append(h2);
      const input=make('textarea');input.rows=4;input.setAttribute('aria-label','Votre commentaire');
      const label=make('label','Ajouter une photo ou une vidéo');const file=document.createElement('input');file.type='file';file.accept='image/jpeg,image/png,image/webp,video/mp4,video/webm';label.append(file);
      const button=make('button','Envoyer mon commentaire');button.disabled=true;
      comments.append(input,label,make('p','La réception des commentaires et fichiers sera activée sur WordPress.'),button);card.append(comments);root.append(card);return;
    }
    root.classList.add('scipt-blog-grid');directory.hidden=false;articleCount.hidden=false;
    const selected=allPrograms.find(p=>p.id===programId);
    const normalized=clean(query);
    const relevant=posts.filter(p=>(!categoryId||p.categories.some(c=>String(c.id)===categoryId)) &&
      (!normalized||clean([p.title,excerptFor(p),...p.categories.map(c=>c.name)].join(' ')).includes(normalized)) &&
      (!selected||clean([p.title,excerptFor(p)].join(' ')).includes(clean(selected.title))||
        (selected&&clean([p.title,excerptFor(p)].join(' ')).includes(clean(selected.department)&&selected.department?clean(selected.department):'_______'))));
    relevant.forEach(p=>{
      const card=make('article',null,'scipt-editorial-card');
      const a=make('a');a.href=linkFor(p);
      if(imageUrl(p.image)){const img=make('img');img.src=p.image;img.alt=plain(p.title);img.loading='lazy';a.append(img)}
      const title=make('h2',plain(p.title));appendIcon(title,p.title);a.append(title);card.append(a);
      card.append(make('p',date(p.date)+' · '+plain(p.author||'SCIPT INTERNATIONAL'),'scipt-blog-meta'));
      card.append(make('p',excerptFor(p),'scipt-blog-description'));
      const read=make('a','Lire l’article →');read.href=a.href;card.append(read);root.append(card);
    });
    if(!relevant.length)root.append(make('p',selected?'Aucun article spécifique à cette filière pour le moment. Sa fiche reste accessible ci-dessous.':'Aucun article pour cette recherche.','scipt-blog-no-results'));
    articleCount.textContent=relevant.length+' article'+(relevant.length>1?'s':'')+' · '+allPrograms.length+' filières et programmes disponibles';
    renderPrograms(query,programId);
  };
  const refresh=()=>render(form.elements.recherche?.value.trim()||'',category.value,programSelect.value);
  form.addEventListener('submit',e=>{e.preventDefault();refresh()});
  category.addEventListener('change',refresh);
  programSelect.addEventListener('change',refresh);
  form.elements.recherche?.addEventListener('input',refresh);
  more.addEventListener('click',()=>{fullList=true;refresh()});
  const loadPosts=()=>{
    if(!isWordPress)return fetch('assets/blog-articles.json').then(r=>{if(!r.ok)throw Error('Articles indisponibles');return r.json()});
    return fetch('/wp-json/wp/v2/posts?per_page=100&_embed=1').then(r=>{if(!r.ok)throw Error('API WordPress indisponible');return r.json()}).then(rows=>rows.map(p=>({
      id:p.id,date:p.date,title:p.title?.rendered||'',excerpt:p.excerpt?.rendered||'',content:p.content?.rendered||'',
      link:p.link,image:p._embedded?.['wp:featuredmedia']?.[0]?.source_url||'',author:'SCIPT INTERNATIONAL',
      categories:(p._embedded?.['wp:term']||[]).flat().filter(t=>t.taxonomy==='category').map(t=>({id:t.id,name:t.name}))
    })));
  };
  loadPosts().then(results=>{
    posts=Array.isArray(results)?results:[];
    const seen=new Set();
    posts.forEach(p=>(p.categories||[]).forEach(c=>{if(seen.has(c.id))return;const opt=new Option(plain(c.name),String(c.id));category.append(opt);seen.add(c.id)}));
    render();
  }).catch(()=>{posts=[];render();articleCount.textContent='Les actualités ne sont pas disponibles actuellement. Vous pouvez consulter les filières ci-dessous.'});
})();