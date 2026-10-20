#!/usr/bin/env python3
"""Galerie réelle de stage, limitée aux parcours de froid et climatisation."""
from pathlib import Path
from html import escape
import json, re

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / 'assets/stages-froid.json').read_text())
PAGES = ['ecole-sciences-technologies-ingenierie', 'formations-professionnelles',
         'formations-professionnelles-18-mois', 'medias', 'vie-etudiante']
START = '<!-- SCIPT_STAGES_FROID_START -->'
END = '<!-- SCIPT_STAGES_FROID_END -->'

def gallery():
    photos = ''
    for photo in DATA['photos']:
        src = 'assets/' + photo['file']
        caption = escape(photo['caption'])
        photos += ('<figure class="sc-stage-photo" data-stage-photo="' + photo['key'] + '">'
                   '<a href="' + src + '" data-stage-zoom aria-label="Agrandir : ' + caption + '">'
                   '<img src="' + src + '" alt="' + caption + '" width="' + str(photo['width']) +
                   '" height="' + str(photo['height']) + '" loading="lazy" decoding="async">'
                   '<span class="sc-stage-enlarge">Agrandir ↗</span></a><figcaption>' + caption + '</figcaption></figure>')
    return ('<section class="sc-stage-gallery" id="stages-froid-climatisation" aria-labelledby="stages-froid-title">'
            '<div class="container"><header class="sc-stage-heading"><span class="sc-stage-kicker">SCIPT INTERNATIONAL · EXPÉRIENCE PROFESSIONNELLE</span>'
            '<h2 id="stages-froid-title">' + escape(DATA['title']) + '</h2><p>' + escape(DATA['description']) + '</p></header>'
            '<div class="sc-stage-photos">' + photos + '</div><nav class="sc-stage-links" aria-label="Formations en froid et climatisation">'
            '<a href="programme.html?id=7680">Froid domestique et industriel →</a>'
            '<a href="programme.html?id=7809">Froid et Climatisation · 18 mois →</a></nav></div></section>')

fragment = gallery()
(ROOT / 'assets/stages-froid-fragment.html').write_text(fragment + '\n')
runtime = {key: DATA[key] for key in ['course_ids', 'covers', 'photos']}
runtime['html'] = fragment
(ROOT / 'assets/stages-froid-data.js').write_text(
    '/* Photographies réelles fournies par SCIPT INTERNATIONAL — 20 octobre 2026. */\n'
    'window.SCIPT_STAGES_FROID=' + json.dumps(runtime, ensure_ascii=False) + ';\n'
    'window.SCIPT_STAGE_ASSET_ROOT=/(^|\\.)sciptinternational\\.com$/.test(location.hostname)?'
    '"https://lionel-johnson.github.io/scipt-refonte/assets/":new URL(".",document.currentScript.src).href;\n')

for slug in PAGES + ['programme']:
    path = ROOT / (slug + '.html')
    text = path.read_text()
    text = re.sub(re.escape(START) + '.*?' + re.escape(END), '', text, flags=re.S)
    if slug != 'programme':
        block = fragment
        if slug == 'medias':
            block = block.replace('<section ', '<section data-album="stages-froid" ', 1)
            button = '<button aria-pressed="false" data-media-filter="stages-froid">Stages : froid et climatisation</button>'
            if 'data-media-filter="stages-froid"' not in text:
                text = re.sub(r'(<div\b[^>]*aria-label="Choisir un album"[^>]*>)', r'\1' + button, text, count=1)
            anchor = re.search(r'<section\b[^>]*id="mediatech"[^>]*>', text)
        else:
            anchor = None
        pos = anchor.start() if anchor else text.index('</main>')
        text = text[:pos] + START + block + END + text[pos:]
    for name in ['stages-froid-data.js', 'stages-froid.js', 'stages-froid.css']:
        text = re.sub(r'<(?:script|link)\b[^>]*(?:src|href)="assets/' + re.escape(name) + r'[^\"]*"[^>]*>(?:</script>)?\n?', '', text)
    text = text.replace('</head>', '<link rel="stylesheet" href="assets/stages-froid.css?v=20261020-stages">\n</head>')
    text = text.replace('</body>', '<script src="assets/stages-froid-data.js?v=20261020-stages"></script>'
                        '<script src="assets/stages-froid.js?v=20261020-stages"></script></body>')
    for name in ['medias-formations-data.js', 'formation-hero.js']:
        text = re.sub(r'(assets/' + re.escape(name) + r')(?:\?[^"\s<>]*)?', r'\1?v=20261020-stages', text)
    path.write_text(text)

media_path = ROOT / 'assets/medias-formations-data.js'
media = media_path.read_text()
token = 'window.SCIPT_MEDIA_BY_PROGRAMME = '
offset = media.index(token) + len(token)
records, length = json.JSONDecoder().raw_decode(media[offset:])
for course_id, key in DATA['covers'].items():
    photo = next(p for p in DATA['photos'] if p['key'] == key)
    records[course_id].update(image=photo['file'], kind='stage', alt=photo['caption'], caption=photo['caption'])
media_path.write_text(media[:offset] + json.dumps(records, ensure_ascii=False, indent=2) + media[offset + length:])

wp = ROOT / 'wordpress/draft-theme/assets'
for name in ['stages-froid-data.js', 'stages-froid.js', 'stages-froid.css', 'stages-froid-fragment.html',
             'stages-froid.json', 'medias-formations-data.js', 'formation-hero.js']:
    (wp / name).write_text((ROOT / 'assets' / name).read_text())
for name in ['institution-pages.json', 'presentations-pages.json']:
    path = wp / name
    data = json.loads(path.read_text())
    for slug in PAGES:
        if slug in data.get('pages', {}):
            data['pages'][slug] = re.search(r'<main\b.*?</main>', (ROOT / (slug + '.html')).read_text(), re.S)[0]
    path.write_text(json.dumps(data, ensure_ascii=False) + '\n')
(wp / 'stages-pages.json').write_text(json.dumps({'pages': {
    slug: re.search(r'<main\b.*?</main>', (ROOT / (slug + '.html')).read_text(), re.S)[0]
    for slug in PAGES}}, ensure_ascii=False) + '\n')
print('Stages intégrés : 5 photos, 2 fiches, 5 rubriques et un filtre de médiathèque.')
