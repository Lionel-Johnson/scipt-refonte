#!/usr/bin/env python3
"""Sept cartes illustrées, avec liens et fonctionnement des fenêtres conservés."""
from pathlib import Path
from html import escape as E
import json, re

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'assets'
CARDS = json.loads((ASSETS / 'about-cards.json').read_text())
VERSION = '20261020-aurora'
arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true" focusable="false"><path d="M7 17 17 7M7 7h10v10" stroke-linecap="round" stroke-linejoin="round"/></svg>'
markup = {}
for index, card in enumerate(CARDS, 1):
    svg = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + card['icon'] + '</svg>'
    inner = ('<span class="sc-about-card-top"><span class="sc-about-card-icon">' + svg + '</span><span class="sc-about-card-index" aria-hidden="true">' + str(index).zfill(2) + '</span></span>'
             '<span class="sc-about-card-copy"><strong class="sc-about-card-title">' + E(card['title']) + '</strong><span class="sc-about-card-description">' + E(card['description']) + '</span></span>'
             '<span class="sc-about-card-footer" aria-hidden="true"><span>Découvrir</span><span class="sc-about-card-arrow">' + arrow + '</span></span>')
    markup[card['key']] = {'title': card['title'], 'description': card['description'], 'markup': inner}

nav = '<nav aria-label="Découvrir cette page" class="about-subnav scipt-about-cards scipt-about-aurora"><div class="container">' + ''.join(
    '<a class="sc-about-card" href="#' + card['key'] + '" aria-label="Découvrir : ' + E(card['title'], quote=True) + '">' + markup[card['key']]['markup'] + '</a>' for card in CARDS) + '</div></nav>'
(ASSETS / 'about-cards-data.js').write_text('/* Pictogrammes vectoriels et textes des sept entrées À propos. */\nwindow.SCIPT_ABOUT_CARDS=' + json.dumps(markup, ensure_ascii=False) + ';\n')
(ASSETS / 'about-cards-fragment.html').write_text(nav + '\n')

for slug in ['qui-sommes-nous', 'a-propos']:
    path = ROOT / (slug + '.html'); text = path.read_text()
    text, count = re.subn(r'<nav\b[^>]*class="[^"]*\babout-subnav\b[^"]*"[^>]*>.*?</nav>', lambda _: nav, text, flags=re.S)
    assert count == 1, slug
    for name in ['about-cards.css', 'about-cards-data.js', 'about-cards.js']:
        text = re.sub(r'<(?:link|script)\b[^>]*(?:href|src)="assets/' + re.escape(name) + r'[^\"]*"[^>]*>(?:</script>)?\n?', '', text)
    text = text.replace('</head>', '<link rel="stylesheet" href="assets/about-cards.css?v=' + VERSION + '">\n</head>')
    text = text.replace('</body>', '<script src="assets/about-cards-data.js?v=' + VERSION + '"></script><script src="assets/about-cards.js?v=' + VERSION + '"></script></body>')
    text = re.sub(r'(assets/about-dialogs\.js)(?:\?[^"\s<>]*)?', r'\1?v=' + VERSION, text)
    path.write_text(text)

wp = ROOT / 'wordpress/draft-theme/assets'
for name in ['about-cards.json', 'about-cards-data.js', 'about-cards-fragment.html', 'about-cards.css', 'about-cards.js', 'about-dialogs.js']:
    (wp / name).write_bytes((ASSETS / name).read_bytes())
for name in ['institution-pages.json', 'presentations-pages.json']:
    path = wp / name; registry = json.loads(path.read_text())
    for slug in ['qui-sommes-nous', 'a-propos']:
        registry['pages'][slug] = re.search(r'<main\b.*?</main>', (ROOT / (slug + '.html')).read_text(), re.S)[0]
    path.write_text(json.dumps(registry, ensure_ascii=False) + '\n')
print('Sept cartes illustrées sur Qui sommes-nous et À propos ; liens et contenus conservés.')
