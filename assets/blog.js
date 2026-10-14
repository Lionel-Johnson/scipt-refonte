(() => {
  const root = document.getElementById('scipt-blog-feed');
  if (!root) return;
  const plain = html => new DOMParser().parseFromString(html || '', 'text/html').body.textContent;
  const make = (tag, text, cls) => { const n = document.createElement(tag); if (text) n.textContent = text; if (cls) n.className = cls; return n; };
  const https = value => { try { const u = new URL(value); return u.protocol === 'https:' ? u.href : ''; } catch { return ''; } };
  const articleId = Number(new URLSearchParams(location.search).get('article'));
  let entries = [];
  const render = (search = '', category = '') => {
    root.replaceChildren();
    const article = entries.find(p => p.id === articleId);
    if (article) {
      root.classList.remove('scipt-blog-grid');
      const wrap = make('article', '', 'scipt-blog-article');
      const back = make('a', '← Tous les articles'); back.href = 'blog.html'; wrap.append(back, make('h1', plain(article.title)), make('p', new Date(article.date).toLocaleDateString('fr-FR') + ' · ' + article.author, 'scipt-blog-meta'));
      if (https(article.image)) { const img = make('img'); img.src = article.image; img.alt = plain(article.title); wrap.append(img); }
      const doc = new DOMParser().parseFromString(article.content, 'text/html');
      doc.querySelectorAll('script,style,object,embed,form').forEach(n => n.remove());
      doc.querySelectorAll('*').forEach(n => { for (const a of [...n.attributes]) { if (a.name.startsWith('on') || (['src', 'href'].includes(a.name) && /^\s*(javascript|data):/i.test(a.value))) n.removeAttribute(a.name); } });
      const content = make('div'); content.append(...doc.body.childNodes); wrap.append(content);
      const comments = make('section'); comments.append(make('h2', 'Votre commentaire'));
      const textarea = make('textarea'); textarea.rows = 4; textarea.setAttribute('aria-label', 'Votre commentaire');
      const label = make('label', 'Ajouter une photo ou une vidéo'); const file = make('input'); file.type = 'file'; file.accept = 'image/jpeg,image/png,image/webp,video/mp4,video/webm'; label.append(file);
      const button = make('button', 'Envoyer mon commentaire'); button.disabled = true;
      comments.append(textarea, label, make('p', 'La réception des commentaires et fichiers sera activée avec la version WordPress.'), button); wrap.append(comments); root.append(wrap); return;
    }
    root.classList.add('scipt-blog-grid');
    const shown = entries.filter(p => plain(p.title + ' ' + p.excerpt).toLocaleLowerCase('fr-FR').includes(search.toLocaleLowerCase('fr-FR')) && (!category || p.categories.some(c => String(c.id) === category)));
    shown.forEach(p => {
      const card = make('article', '', 'scipt-editorial-card'); const link = make('a'); link.href = 'blog.html?article=' + p.id;
      if (https(p.image)) { const img = make('img'); img.src = p.image; img.alt = plain(p.title); img.loading = 'lazy'; link.append(img); }
      link.append(make('h2', plain(p.title))); card.append(link, make('p', new Date(p.date).toLocaleDateString('fr-FR') + ' · ' + p.author, 'scipt-blog-meta'), make('p', plain(p.excerpt), 'scipt-blog-description'));
      const read = make('a', 'Lire l’article →'); read.href = link.href; card.append(read); root.append(card);
    });
    if (!shown.length) root.append(make('p', 'Aucun article pour cette recherche.'));
  };
  fetch('assets/blog-articles.json').then(r => { if (!r.ok) throw Error(); return r.json(); }).then(posts => {
    entries = posts;
    const categories = document.getElementById('scipt-blog-category');
    const seen = new Set(); entries.flatMap(p => p.categories).forEach(c => { if (!seen.has(c.id)) { const o = make('option', plain(c.name)); o.value = c.id; categories?.append(o); seen.add(c.id); } });
    render();
    document.getElementById('scipt-blog-search')?.addEventListener('submit', e => { e.preventDefault(); render(e.currentTarget.elements.recherche.value, categories?.value || ''); });
  }).catch(() => { root.textContent = 'Les articles ne peuvent pas être chargés pour le moment.'; });
})();
