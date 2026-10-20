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
STYLE = '<link rel="stylesheet" href="assets/presentations-client.css?v=20261020-ecoles">'
LOGOS = json.loads((ROOT / 'assets/logos/manifest.json').read_text())['logos']
SCHOOL_CODES = {'ecole-droit-sciences-gestion': 'ESGA', 'ecole-sciences-technologies-ingenierie': 'ESTI',
                'ecole-sante-developpement': 'ESSA', 'ecole-sciences-humaines-communication': 'ESHC',
                'ecole-scipt-international': 'EDI'}
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


def school_divider(item):
    code = SCHOOL_CODES[item['slug']]
    logo = LOGOS[code]
    title = re.sub(r',?\s*' + code + r'-SCIPT\s*$', '', item['title'])
    return ('<li data-school="' + code + '"><a class="scipt-school-divider" href="' + item['slug'] + '.html">'
            '<img class="scipt-school-divider-crest" src="assets/' + logo['file'] + '" alt="Blason ' + code + '-SCIPT"'
            ' width="1254" height="1254" loading="lazy" decoding="async">'
            '<span class="scipt-school-divider-copy"><strong>' + code + '-SCIPT</strong><span>' + E(title) + '</span></span>'
            '<span class="scipt-school-divider-arrow" aria-hidden="true">↗</span></a></li>')


def about():
    parts = DATA['institution']
    body = '<div class="scipt-editorial-intro">' + paragraphs(parts[0]['paragraphs']) + '</div><div class="scipt-editorial-stories">'
    for i, part in enumerate(parts[1:9], 1):
        content = paragraphs(part['paragraphs'])
        if i == 6:
            content += table(DATA['international'], 'Domaines et orientations de l’ouverture internationale')
        body += '<details class="scipt-glass-story"><summary><span class="scipt-story-index">' + str(i).zfill(2) + '</span><span>' + E(part['title']) + '</span><span class="scipt-story-toggle" aria-hidden="true">+</span></summary><div class="scipt-story-content">' + content + '</div></details>'
    body += '</div>'
    result = section('Présentation de l’établissement', body, 'presentation-etablissement')
    numbers = ['2020', '6', '5', '3', '472', '65 · 25 · 10 %', '6', '24', '11']
    cards = ''
    for i, ((label, value), number) in enumerate(zip(DATA['figures'], numbers)):
        cards += '<div class="scipt-stat"><dt><button class="scipt-stat-trigger" type="button" aria-expanded="false" aria-controls="stat-detail-' + str(i) + '"><strong>' + number + '</strong><span>' + E(label) + '</span><small aria-hidden="true">Découvrir ↗</small></button></dt><dd id="stat-detail-' + str(i) + '"><b>' + E(label) + '</b><span>' + E(value) + '</span></dd></div>'
    result += section('SCIPT INTERNATIONAL en chiffres', '<p class="scipt-editorial-period">Repères institutionnels · 2020–2026</p><p class="scipt-stats-hint">Survolez ou touchez une carte pour en découvrir le détail.</p><dl class="scipt-stats">' + cards + '</dl>', 'chiffres-cles')
    links = '<ul class="scipt-editorial-schools" aria-label="Les cinq écoles SCIPT INTERNATIONAL">' + ''.join(school_divider(s) for s in DATA['schools']) + '</ul>'
    copy = '<div class="scipt-programmes-copy">' + paragraphs(parts[10]['paragraphs']) + '<div class="scipt-editorial-actions"><a href="programmes-universitaires.html">SCIPT INTERNATIONAL UNIVERSITY →</a><a href="formations-professionnelles.html">SCIPT INTERNATIONAL ACADEMY →</a></div>' + links + '</div>'
    visual = '<figure class="scipt-programmes-visual"><img src="assets/deux-programmes-cinq-ecoles.webp" alt="Études universitaires et compétences professionnelles : des apprenants africains tournés vers leur avenir" width="1000" height="1250" loading="lazy"><figcaption>Des savoirs. Des métiers. Un avenir.</figcaption></figure>'
    result += section('Deux programmes, cinq écoles', '<div class="scipt-programmes-layout">' + copy + visual + '</div>', 'deux-programmes-cinq-ecoles')
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
        archive = re.search(r'<section[^>]*class="[^"]*scipt-logistique-archive[^>]*>', text)
        main_start = text.index('<main')
        first_section = re.search(r'<section\b[^>]*class="[^\"]*\binst-section\b[^\"]*"[^>]*>', text[main_start:])
        assert archive or first_section, slug
        anchor = archive.start() if archive else main_start + first_section.start()
        text = text[:anchor] + START + content + END + text[anchor:]
    elif slug == 'agrement-reconnaissance':
        content = section('Certification ISO 21001:2018', '<p class="scipt-editorial-period">Obtenue en 2026</p><p>Cette certification porte sur le système de management de SCIPT INTERNATIONAL en tant qu’organisme d’éducation et de formation. Elle complète la certification ISO 9001:2015, obtenue en 2022.</p><p>Ces certifications attestent la qualité d’un système de management ; elles ne constituent pas, à elles seules, la reconnaissance d’un diplôme.</p>', 'iso-21001-2018')
        content += section('Agréments, reconnaissances et certifications', paragraphs([DATA['certifications_intro']]) + table(DATA['certifications'], 'Autorités, normes et références institutionnelles'), 'references-institutionnelles')
        anchor = text.index('<section class="inst-section"', text.index('<main'))
        text = text[:anchor] + START + content + END + text[anchor:]
    if content:
        text = re.sub(r'<link[^>]*href="assets/presentations-client\.css[^"]*"[^>]*>\n?', '', text)
        if STYLE not in text:
            text = text.replace('</head>', STYLE + '\n</head>')
        if slug in ('a-propos', 'qui-sommes-nous'):
            script = '<script src="assets/presentations-client.js?v=20261019-glass"></script>'
            text = re.sub(r'<script src="assets/presentations-client\.js[^"]*"></script>', '', text)
            text = text.replace('</body>', script + '</body>')
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
programme = re.search(r'<main\b.*?</main>', (ROOT / 'programme.html').read_text(), re.S).group()
updated['programme'] = programme
registry['pages']['programme'] = programme
registry_path.write_text(json.dumps(registry, ensure_ascii=False) + '\n')
(ROOT / 'wordpress/draft-theme/assets/presentations-pages.json').write_text(json.dumps({'pages': updated}, ensure_ascii=False) + '\n')
target = ROOT / 'wordpress/draft-theme/assets/presentations-client.css'
target.write_text((ROOT / 'assets/presentations-client.css').read_text())
for asset in ['presentations-client.js', 'formation-hero.js', 'medias-formations-data.js', 'institution.js']:
    (ROOT / 'wordpress/draft-theme/assets' / asset).write_text((ROOT / 'assets' / asset).read_text())
print('Présentations intégrées :', ', '.join(updated))
