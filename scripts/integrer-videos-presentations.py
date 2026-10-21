#!/usr/bin/env python3
"""Intègre les présentations ESSA et ESGA remises le 21 octobre 2026."""
from pathlib import Path
from html import escape
import json
import re

ROOT = Path(__file__).resolve().parents[1]
records = json.loads((ROOT / 'assets/videos/presentations-20261021.json').read_text())['videos']
data_path = ROOT / 'assets/videos-accueil-data.js'
data = json.JSONDecoder().raw_decode(data_path.read_text().split('=', 1)[1].lstrip())[0]


def film(item, css='inst-school-film', anchor=None):
    identity = ' id="' + anchor + '"' if anchor else ''
    title, description = escape(item['title']), escape(item['description'])
    url, poster = escape(item['url'], quote=True), escape(item['poster'], quote=True)
    return ('<section class="scipt-video-section container ' + css + '"' + identity
            + ' aria-label="' + title + '"><div class="scipt-video-panel"><div class="scipt-video-copy">'
            + '<span>' + escape(item.get('kicker', 'SCIPT INTERNATIONAL · PRÉSENTATION')) + '</span>'
            + '<h2>' + title + '</h2><p>' + description + '</p></div>'
            + '<div class="scipt-video-frame"><video controls playsinline preload="metadata"'
            + ' aria-label="' + title + '" poster="' + poster + '">'
            + '<source src="' + url + '" type="video/mp4">Votre navigateur ne prend pas en charge cette vidéo. '
            + '<a href="' + url + '">Ouvrir la vidéo</a></video>'
            + '<a class="scipt-direct-video" href="' + url + '" target="_blank" rel="noopener noreferrer">'
            + 'Ouvrir cette vidéo ↗</a></div></div></section>')


updated = {}
for item in records:
    path = ROOT / item['page']
    page = path.read_text()
    assert (ROOT / item['url']).is_file(), item['url']
    replacement = film(item, anchor='presentation-' + item['code'].lower())
    pattern = r'<section\b[^>]*class="[^\"]*\binst-school-film\b[^\"]*"[^>]*>.*?</section>'
    page, count = re.subn(pattern, lambda _: replacement, page, count=1, flags=re.S)
    assert count == 1, item['page']
    # Le spot santé validé reste accessible en complément de la nouvelle présentation.
    if item['code'] == 'ESSA' and 'id="spot-sante-archive"' not in page:
        archive = {**data['sante'], 'title': 'Archives de l’ESSA — spot santé',
                   'kicker': 'ARCHIVE SCIPT INTERNATIONAL',
                   'description': 'Retrouvez également le spot santé déjà présenté sur le site.'}
        page = page.replace(replacement, replacement + film(archive, 'scipt-sante-archive', 'spot-sante-archive'), 1)
    page = re.sub(r'assets/videos-accueil-data\.js(?:\?[^"<>]*)?',
                  'assets/videos-accueil-data.js?v=20261021-presentations', page)
    path.write_text(page)
    updated[path.stem] = re.search(r'<main\b.*?</main>', page, re.S).group(0)
    data['presentation-' + item['code'].lower()] = {key: item[key] for key in ['title', 'url', 'poster', 'description']}

data_path.write_text('window.SCIPT_VIDEOS_ACCUEIL = ' + json.dumps(data, ensure_ascii=False, indent=2) + ';\n')
(ROOT / 'wordpress/draft-theme/assets/videos-accueil-data.js').write_text(data_path.read_text())
for name in ['institution-pages.json', 'presentations-pages.json']:
    path = ROOT / 'wordpress/draft-theme/assets' / name
    registry = json.loads(path.read_text())
    registry['pages'].update(updated)
    path.write_text(json.dumps(registry, ensure_ascii=False) + '\n')
print('Présentations ESSA et ESGA intégrées ; spot santé et témoignage logistique conservés.')
