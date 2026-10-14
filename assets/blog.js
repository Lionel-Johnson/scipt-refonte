(() => {
  const root = document.getElementById('scipt-blog-feed');
  if (!root) return;
  fetch('https://sciptinternational.com/wp-json/wp/v2/posts?per_page=9&_embed=1')
    .then(response => { if (!response.ok) throw new Error('Articles indisponibles'); return response.json(); })
    .then(posts => {
      root.replaceChildren();
      posts.forEach(post => {
        const article = document.createElement('article');
        const title = document.createElement('h2');
        const link = document.createElement('a');
        const decoded = new DOMParser().parseFromString(post.title.rendered, 'text/html');
        const url = new URL(post.link);
        if (url.protocol !== 'https:' || url.hostname !== 'sciptinternational.com') return;
        link.href = url.href;
        link.textContent = decoded.body.textContent;
        title.append(link);
        const excerpt = document.createElement('p');
        excerpt.textContent = new DOMParser().parseFromString(post.excerpt.rendered, 'text/html').body.textContent;
        article.append(title, excerpt);
        root.append(article);
      });
      if (!root.children.length) root.textContent = 'Aucun article publié pour le moment.';
    })
    .catch(() => { root.textContent = 'Les articles sont disponibles via le lien « Consulter tous les articles » ci-dessous.'; });
})();
