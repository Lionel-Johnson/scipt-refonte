#!/usr/bin/env python3
"""Ajouts éditoriaux du 19 octobre, sans remplacer les contenus ou médias validés.

Relancer après une génération des pages pour réappliquer les ajouts.
La source JSON ne contient que les textes à publier, hors gabarits Word.
"""
from pathlib import Path
from html import escape as E
import json
import re

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / 'assets/presentations-client-20261019.json').read_text())
START, END = '<!-- presentations-client:start -->', '<!-- presentations-client:end -->'
STYLE = '<link rel="stylesheet" href="assets/presentations-client.css?v=20261019">'
MENU = '<li><a class="dropdown-item" href="qui-sommes-nous.html#chiffres-cles">SCIPT INTERNATIONAL en chiffres</a></li>'


def paragraphs(items):
    return ''.join('<p>' + E(p) + '</p>' for p in items)


def table(rows, caption):
    return ('<div class="scipt-editorial-table" tabindex="0" role="region" aria-label="' + E(caption) + '">'
            '<table><caption>' + E(caption) + '</caption><thead><tr>' +
            ''.join('<th scope="col">' + E(c) + '</th>' for c in rows[0]) +
            '</tr></thead><tbody>' + ''.join('<tr><th scope="row">' + E(row[0]) + '</th>' +
            ''.join('<td>' + E(c) + '</td>' for c in row[1:]) + '</tr>' for row in rows[1:]) +
            '</tbody></table></div>')


def section(title, body, id):
    return '<section class="scipt-editorial" id="' + id + '"><div class="container"><h2>' + E(title) + '</h2>' + body + '</div></section>'


def about():
    parts = DATA['institution']
    body = paragraphs(parts[0]['paragraphs']) + '<div class="scipt-editorial-stories">'
    for i, part in enumerate(parts[1:9], 1):
        content = paragraphs(part['paragraphs'])
        if i == 6:
            content += table(DATA['international'], 'Domaines et orientations de l’ouverture internationale')
        body += '<details><summary>' + E(part['title']) + '</summary><div>' + content + '</div></details>'
    body += '</div>'
    result = section('Présentation de l’établissement', body, 'presentation-etablissement')
    cards = ''.join('<div class="scipt-stat"><dt>' + E(label) + '</dt><dd>' + E(value) + '</dd></div>' for label, value in DATA['figures'])
    result += section('SCIPT INTERNATIONAL en chiffres', '<p class="scipt-editorial-period">Repères institutionnels · 2020–2026</p><dl class="scipt-stats">' + cards + '</dl>', 'chiffres-cles')
    links = '<ul class="scipt-editorial-schools">' + ''.join('<li><a href="' + s['slug'] + '.html">' + E(s['title']) + ' →</a></li>' for s in DATA['schools']) + '</ul>'
    result += section('Deux programmes, cinq écoles', paragraphs(parts[10]['paragraphs']) + '<div class="scipt-editorial-actions"><a href="programmes-universitaires.html">SCIPT INTERNATIONAL UNIVERSITY →</a><a href="formations-professionnelles.html">SCIPT INTERNATIONAL ACADEMY →</a></div>' + links, 'deux-programmes-cinq-ecoles')
    return result


def school(item):
    body = ''
    for block in item['blocks']:
        kind = block['type']
        if kind == 'heading':
            body += '<h3>' + E(block['text'].capitalize() if block['text'].isupper() else block['text']) + '</h3>'
        elif kind == 'paragraph':
            body += paragraphs([block['text']])
        elif kind == 'table':
            body += table(block['rows'], 'Repères pour comprendre l’école')
        else:
            body += '<aside class="scipt-editorial-note">' + paragraphs([c for r in block['rows'] for c in r]) + '</aside>'
    if item.get('departments'):
        body += table(item['departments'], 'Nos départements en quelques mots')
    return section(item['title'], body, 'presentation-detaillee')


updated = {}
for file in ROOT.glob('*.html'):
    text = file.read_text()
    text = re.sub(re.escape(START) + r'.*?' + re.escape(END), '', text, flags=re.S)
    text = re.sub(r'<!-- mission-client:start -->.*?<!-- mission-client:end -->', '', text, flags=re.S)
    slug = file.stem
    content = None
    if slug in ('a-propos', 'qui-sommes-nous'):
        text = re.sub(r'(<section class="about-hero".*?<h1>).*?(</h1>)', lambda m: m[1] + 'SCIPT INTERNATIONAL<br><em>Former ici, pour réussir partout.</em>' + m[2], text, count=1, flags=re.S)
        seo_title = 'SCIPT INTERNATIONAL : former en Afrique | Libreville'
        seo_description = 'SCIPT INTERNATIONAL, créé en 2020 à Libreville : des formations professionnelles et universitaires et des diplômes internationaux, sans quitter l’Afrique.'
        text = re.sub(r'<title>.*?</title>', '<title>' + seo_title + '</title>', text, count=1)
        text = re.sub(r'<meta content="[^"]*" name="description">', '<meta content="' + seo_description + '" name="description">', text, count=1)
        for key, value in [('og:title', seo_title), ('og:description', seo_description)]:
            text = re.sub(r'<meta content="[^"]*" property="' + key + '">', '<meta content="' + value + '" property="' + key + '">', text, count=1)
        content = about()
        anchor = re.search(r'<nav[^>]*class="about-subnav".*?</nav>', text, re.S)
        assert anchor, slug
        text = text[:anchor.end()] + START + content + END + text[anchor.end():]
        mission = '<!-- mission-client:start --><div class="container scipt-mission-client"><h3>Mission, vision et valeurs</h3>' + paragraphs(DATA['institution'][9]['paragraphs']) + '</div><!-- mission-client:end -->'
        text = re.sub(r'(<section\b[^>]*id="mission"[^>]*>.*?)(</section>)', lambda m: m[1] + mission + m[2], text, count=1, flags=re.S)
        text = text.replace('assets/about-dialogs.js?v=20261015', 'assets/about-dialogs.js?v=20261019')
        if 'href="#chiffres-cles"' not in text:
            text = text.replace('<a href="#mission">', '<a href="#presentation-etablissement">L’établissement</a><a href="#chiffres-cles">En chiffres</a><a href="#mission">', 1)
    elif slug in [s['slug'] for s in DATA['schools']]:
        content = school(next(s for s in DATA['schools'] if s['slug'] == slug))
        # Keep the existing introduction and film together, before new prose.
        anchor = text.index('<section class="inst-section"', text.index('<main'))
        text = text[:anchor] + START + content + END + text[anchor:]
    elif slug == 'agrement-reconnaissance':
        content = section('Certification ISO 21001:2018', '<p class="scipt-editorial-period">Obtenue en 2026</p><p>Cette certification porte sur le système de management de SCIPT INTERNATIONAL en tant qu’organisme d’éducation et de formation. Elle complète la certification ISO 9001:2015, obtenue en 2022.</p><p>Ces certifications attestent la qualité d’un système de management ; elles ne constituent pas, à elles seules, la reconnaissance d’un diplôme.</p>', 'iso-21001-2018')
        content += section('Agréments, reconnaissances et certifications', paragraphs([DATA['certifications_intro']]) + table(DATA['certifications'], 'Autorités, normes et références institutionnelles'), 'references-institutionnelles')
        anchor = text.index('<section class="inst-section"', text.index('<main'))
        text = text[:anchor] + START + content + END + text[anchor:]
    if content:
        if STYLE not in text:
            text = text.replace('</head>', STYLE + '\n</head>')
        updated[slug] = re.search(r'<main\b.*?</main>', text, re.S).group()
    # The same destination is available from every existing About dropdown.
    pattern = r'(<ul\b[^>]*\bid="menu-about"[^>]*>)(.*?)(</ul>)'
    def menu(match):
        inner = match[2]
        if 'qui-sommes-nous.html#chiffres-cles' not in inner:
            inner += MENU
        return match[1] + inner + match[3]
    text = re.sub(pattern, menu, text, flags=re.S)
    if text != file.read_text():
        file.write_text(text)

# Keep the WordPress preview registry in step with the static site.
registry_path = ROOT / 'wordpress/draft-theme/assets/institution-pages.json'
registry = json.loads(registry_path.read_text())
registry['pages'].update(updated)
registry_path.write_text(json.dumps(registry, ensure_ascii=False) + '\n')
target = ROOT / 'wordpress/draft-theme/assets/presentations-client.css'
target.write_text((ROOT / 'assets/presentations-client.css').read_text())
print('Présentations intégrées :', ', '.join(updated))
