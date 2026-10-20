#!/usr/bin/env python3
"""Ajoute les repères officiels des cinq écoles au catalogue universitaire."""
from pathlib import Path
from html import escape
import json
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
logos = json.loads((ROOT / 'assets/logos/manifest.json').read_text())['logos']
schools = json.loads((ROOT / 'assets/architecture-academique.json').read_text())['schools']
entries = [{**school, 'heading': school['code'] + ' · ' + school['name']} for school in schools]
entries.append({'code': 'EDI', 'name': 'École Doctorale Internationale SCIPT',
                'href': 'ecole-scipt-international.html', 'heading': 'SCIPT INTERNATIONAL · École Doctorale'})


def crest(item, css):
    logo = logos[item['code']]
    return ('<img class="' + css + '" src="assets/' + logo['file'] + '" alt="Blason officiel '
            + item['code'] + '-SCIPT" width="' + str(logo['width']) + '" height="'
            + str(logo['height']) + '" loading="lazy" decoding="async">')


navigation = '<nav class="inst-school-nav scipt-school-logo-nav" aria-label="Nos 5 écoles">'
for item in entries:
    navigation += ('<a href="' + item['href'] + '">' + crest(item, 'scipt-school-nav-crest')
                   + '<span class="scipt-school-nav-code">' + item['code'] + '</span>'
                   + '<span class="scipt-school-nav-name">' + escape(item['name']) + '</span>'
                   + '<span class="scipt-school-nav-action">Découvrir l’école <span aria-hidden="true">↗</span></span></a>')
navigation += '</nav>'

path = ROOT / 'programmes-universitaires.html'
page = path.read_text()
page, count = re.subn(r'<nav\b[^>]*class="[^\"]*\binst-school-nav\b[^\"]*"[^>]*>.*?</nav>',
                      lambda _: navigation, page, count=1, flags=re.S)
assert count == 1, 'Le sélecteur des écoles doit être unique.'
# Repartir des titres existants rend cette transformation idempotente.
page = re.sub(r'<header class="scipt-programme-school-header"[^>]*>.*?</header>',
              lambda m: re.search(r'<h2>.*?</h2>', m[0], re.S).group(0), page, flags=re.S)
for index, item in enumerate(entries, 1):
    heading = '<h2>' + escape(item['heading']) + '</h2>'
    header = ('<header class="scipt-programme-school-header" id="ecole-' + item['code'].lower() + '">'
              + crest(item, 'scipt-programme-school-crest') + '<div class="scipt-programme-school-copy">'
              + '<span class="scipt-programme-school-kicker">École ' + str(index).zfill(2)
              + ' / 05 · SCIPT INTERNATIONAL UNIVERSITY</span>' + heading + '</div></header>')
    assert page.count(heading) == 1, item['code']
    page = page.replace(heading, header, 1)
style = '<link rel="stylesheet" href="assets/programmes-identites.css?v=20261020-blasons">'
page = re.sub(r'<link\b[^>]*href="assets/programmes-identites\.css[^\"]*"[^>]*>\s*', '', page)
page = page.replace('</head>', style + '\n</head>', 1)
path.write_text(page)

main = re.search(r'<main\b.*?</main>', page, re.S).group(0)
registry_path = ROOT / 'wordpress/draft-theme/assets/institution-pages.json'
registry = json.loads(registry_path.read_text())
registry['pages']['programmes-universitaires'] = main
registry_path.write_text(json.dumps(registry, ensure_ascii=False))
shutil.copyfile(ROOT / 'assets/programmes-identites.css', ROOT / 'wordpress/draft-theme/assets/programmes-identites.css')
print('Catalogue : cinq blasons dans la navigation et cinq séparateurs d’école.')
