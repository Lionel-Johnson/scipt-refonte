#!/usr/bin/env python3
"""Intègre fidèlement la fiche client des seize domaines sans créer de faux cursus ouverts."""
from pathlib import Path
from html import escape as E
import json, re

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'assets'
DATA = json.loads((ASSETS / 'domaines-doctoraux-20261020.json').read_text())
GROUPS = {g['id']: g for g in DATA['groups']}
DOMAINS = {d['number']: d for d in DATA['domains']}
LOGOS = json.loads((ASSETS / 'logos/manifest.json').read_text())['logos']
VERSION = '20261020-doctoral16'
STATUS = 'Cadre de référence · Spécialités doctorales possibles'
OPENING = 'L’ouverture effective d’une spécialité dépend de l’encadrement compétent, des moyens de recherche, du cadre de délivrance du diplôme et de la décision des instances académiques.'
CONTRIBUTION = 'Un travail doctoral doit produire une contribution originale et démontrable. La réalisation d’une application, d’un prototype ou d’un rapport de pratique ne suffit pas, à elle seule, à la constituer.'
NAV = [('presentation', 'Présentation'), ('objectifs', 'Orientation scientifique'), ('programme-detaille', 'Domaines et disciplines'), ('stages', 'Axes de recherche'), ('conditions', 'Accès et positionnement'), ('debouches', 'Déroulement'), ('frais', 'Durées et coûts'), ('faq', 'Questions fréquentes')]

def paragraphs(items):
    return ''.join('<p>' + E(x) + '</p>' for x in items)

def listing(items):
    return '<ul>' + ''.join('<li>' + E(x) + '</li>' for x in items) + '</ul>'

def table(rows, headings, caption):
    return ('<div class="sc-doctoral-table" tabindex="0" role="region" aria-label="' + E(caption) + '"><table><caption>' + E(caption) + '</caption><thead><tr>' +
            ''.join('<th scope="col">' + E(x) + '</th>' for x in headings) + '</tr></thead><tbody>' +
            ''.join('<tr><th scope="row">' + E(row[0]) + '</th>' + ''.join('<td>' + E(x) + '</td>' for x in row[1:]) + '</tr>' for row in rows) + '</tbody></table></div>')

def url(domain):
    return 'programme.html?id=' + domain['group_id'] + '&domaine=' + str(domain['number'])

def card(domain):
    return ('<article class="inst-card sc-doctoral-domain-card" data-doctoral-domain="' + str(domain['number']) + '"><div class="inst-card-body">'
            '<span class="sc-doctoral-number">Domaine doctoral ' + str(domain['number']).zfill(2) + '</span><h3>' + E(domain['title']) + '</h3><p>' + E(domain['orientation']) + '</p>'
            '<a class="inst-link" href="' + E(url(domain), quote=True) + '">Disciplines, spécialités et axes de recherche →</a></div></article>')

def group_block(group):
    code = group['code']
    return ('<article class="sc-doctoral-group" data-doctoral-group="' + group['id'] + '"><header class="sc-doctoral-group-head">'
            '<img src="assets/' + LOGOS[code]['file'] + '" data-doctoral-school="' + code + '" alt="Blason ' + code + '-SCIPT" width="1254" height="1254" loading="lazy">'
            '<div><span>' + code + '-SCIPT · ' + str(len(group['domain_numbers'])) + ' domaines doctoraux</span><h3>' + E(group['title']) + '</h3></div></header>' +
            paragraphs(group['paragraphs']) + '<div class="inst-grid two">' + ''.join(card(DOMAINS[n]) for n in group['domain_numbers']) + '</div></article>')

catalogue = ('<section class="inst-section sc-doctoral-catalogue" id="domaines-doctoraux"><div class="container"><h2>Quatre grands domaines, seize domaines doctoraux</h2>'
             '<p class="sc-doctoral-status">' + STATUS + '</p><p>Les seize domaines s’appuient sur les quatre écoles du SCIPT INTERNATIONAL. Chaque fiche précise les disciplines, les spécialités possibles et les axes de recherche envisageables.</p>'
             '<p>' + OPENING + '</p><div id="universitaire">' + ''.join(group_block(g) for g in DATA['groups']) + '</div></div></section>')
(ASSETS / 'edi-domaines-fragment.html').write_text(catalogue + '\n')

def faq():
    items = [
        ('Doctorat professionnel ou PhD ?', DATA['common']['doctoral_routes']),
        ('Les spécialités sont-elles toutes ouvertes ?', OPENING),
        ('Qui délivre le diplôme ?', 'Dans le modèle présenté, SCIPT INTERNATIONAL organise la formation et le diplôme est délivré par l’université partenaire compétente, selon la convention applicable. L’université délivrante, l’intitulé exact du diplôme et les conditions de délivrance sont à confirmer officiellement pour chaque parcours. La cotutelle est un dispositif distinct, non systématique.'),
        ('Comment préparer un projet ?', 'Délimitez votre question, situez les travaux existants et expliquez la méthode envisagée. Les axes présentés sont des pistes à affiner avec l’encadrement, et non des sujets déjà validés.'),
    ]
    return '<h2>Comprendre le parcours doctoral</h2>' + ''.join('<details class="programme-semester"><summary>' + E(q) + '</summary><div class="sc-doctoral-answer">' + paragraphs([a]) + '</div></details>' for q, a in items)

def panels(group, domain=None):
    chosen = [domain] if domain else [DOMAINS[n] for n in group['domain_numbers']]
    code = group['code']; title = domain['title'] if domain else group['title']
    intro = domain['paragraphs'] if domain else group['paragraphs']
    nav = '<nav class="programme-section-nav" aria-label="Rubriques du domaine doctoral">' + ''.join('<a href="#' + k + '">' + label + '</a>' for k, label in NAV) + '</nav>'
    key_card = ('<aside class="programme-key-card"><h3>Votre domaine doctoral</h3><dl><dt>École doctorale</dt><dd>EDI-SCIPT</dd><dt>Grand domaine</dt><dd>' + E(group['title']) + '</dd>'
                '<dt>École d’appui</dt><dd>' + E(group['school']) + '</dd><dt>Présentation</dt><dd>Cadre de référence · ouverture selon le parcours</dd></dl><a href="contact.html">Échanger sur mon projet →</a></aside>')
    links = '<p class="sc-doctoral-breadcrumb"><a href="ecole-scipt-international.html#domaines-doctoraux">Les seize domaines doctoraux</a>'
    if domain:
        links += ' / <a href="programme.html?id=' + group['id'] + '">' + E(group['title']) + '</a>'
    links += '</p>'
    intro_markup = paragraphs(intro).replace('<p>', '<p id="program-intro">', 1) + '<ul id="program-topics" hidden></ul>'
    presentation = nav + links + '<p class="sc-doctoral-status">' + STATUS + '</p><div class="programme-overview-grid"><div><h2>' + ('Présentation du domaine doctoral' if domain else 'Présentation du grand domaine') + '</h2>' + intro_markup + '</div>' + key_card + '</div>'
    if domain:
        presentation += '<p class="sc-doctoral-attachment">' + E(domain['attachment']) + '</p>'
        detail = '<h2>Disciplines du domaine</h2>' + table([(d['title'], d['description']) for d in domain['disciplines']], ['Discipline', 'Ce qu’elle recouvre'], 'Disciplines de ' + title)
        detail += '<h3>Spécialités doctorales possibles</h3>' + listing(domain['specialties']) + paragraphs([OPENING])
        axes = '<h2>Axes de recherche envisageables</h2>' + listing(domain['research_axes'])
        orientation = '<h2>Orientation scientifique</h2>' + paragraphs([domain['orientation'], CONTRIBUTION])
    else:
        detail = '<h2>Les ' + str(len(chosen)) + ' domaines doctoraux</h2><div class="inst-grid two">' + ''.join(card(d) for d in chosen) + '</div>'
        axes = '<h2>Des questions de recherche à préciser</h2>' + ''.join('<h3>' + E(d['title']) + '</h3>' + listing(d['research_axes']) for d in chosen)
        orientation = '<h2>Construire une contribution scientifique</h2>' + paragraphs([CONTRIBUTION])
    axes += paragraphs(['Ces axes sont des pistes de recherche à affiner avec chaque candidat. Ils ne constituent pas des sujets déjà validés.'])
    common = DATA['common']; conditions = common['conditions']
    result = {
        'presentation': presentation,
        'objectifs': orientation,
        'programme-detaille': detail,
        'stages': axes,
        'conditions': '<h2>Accès et positionnement — principes proposés</h2>' + paragraphs([common['conditions_paragraphs'][0]]) + table([(r['step'], r['principle']) for r in conditions[:2]], ['Étape', 'Principe proposé'], 'Préparer son accès au parcours doctoral') + '<p><a href="contact.html">Demander les conditions propres au parcours →</a></p>',
        'debouches': '<h2>Déroulement du travail doctoral — principes proposés</h2>' + table([(r['step'], r['principle']) for r in conditions[2:]], ['Étape', 'Principe proposé'], 'De la question de recherche à la soutenance'),
        'frais': '<h2>Durées, coûts et modalités du parcours</h2>' + paragraphs([common['conditions_paragraphs'][1]]) + '<p><a href="contact.html">Obtenir les informations officielles du parcours →</a></p>',
        'faq': faq(),
    }
    return {'title': title, 'intro': intro[0], 'group_id': group['id'], 'number': domain['number'] if domain else None,
            'panels': {k: '<div class="sc-doctoral-copy">' + v + '</div>' for k, v in result.items()}}

views = {}
for group in DATA['groups']:
    views[group['id']] = panels(group)
    for number in group['domain_numbers']:
        views[group['id'] + '-' + str(number)] = panels(group, DOMAINS[number])
(ASSETS / 'domaines-doctoraux-fragments.json').write_text(json.dumps(views, ensure_ascii=False) + '\n')
(ASSETS / 'domaines-doctoraux-data.js').write_text('/* Fiche client du 20 octobre 2026 : 4 grands domaines, 16 domaines. */\nwindow.SCIPT_DOCTORAL_VIEWS=' + json.dumps(views, ensure_ascii=False) + ';\n')

def update_js(name, token, changes):
    path = ASSETS / name; text = path.read_text(); start = text.index(token) + len(token)
    data, end = json.JSONDecoder().raw_decode(text[start:])
    changes(data)
    path.write_text(text[:start] + json.dumps(data, ensure_ascii=False) + text[start + end:])

def contents(data):
    for group in DATA['groups']:
        data[group['id']] = {'intro': group['paragraphs'][0], 'topics': [DOMAINS[n]['title'] for n in group['domain_numbers']]}
def programmes(data):
    for group in DATA['groups']:
        data[group['id']]['title'] = 'Grand domaine doctoral : ' + group['title']
def diplomas(data):
    for group in DATA['groups']:
        data[group['id']]['title'] = 'Grand domaine doctoral : ' + group['title']
        data[group['id']]['specializations'] = [DOMAINS[n]['title'] for n in group['domain_numbers']]
update_js('programme-contenus.js', 'window.sciptProgrammeContenus=', contents)
update_js('programmes-ecoles.js', 'const programmes=', programmes)
update_js('diplomes-specialisations.js', 'window.SCIPT_DIPLOMES=', diplomas)

path = ROOT / 'ecole-scipt-international.html'; text = path.read_text()
pattern = r'<section\b[^>]*id="domaines-doctoraux"[^>]*>.*?</section>|<section class="inst-section"><div class="container"><h2>Les domaines doctoraux</h2>.*?</section>'
text, count = re.subn(pattern, lambda _: catalogue, text, flags=re.S)
assert count == 1, 'Section des domaines doctoraux introuvable ou répétée'
text = text.replace('Quatre domaines doctoraux</h3>', 'Quatre grands domaines, seize domaines doctoraux</h3>')
text = re.sub(r'<link\b[^>]*href="assets/domaines-doctoraux\.css[^"]*"[^>]*>\n?', '', text)
text = text.replace('</head>', '<link rel="stylesheet" href="assets/domaines-doctoraux.css?v=' + VERSION + '">\n</head>')
path.write_text(text)

path = ROOT / 'programme.html'; text = path.read_text()
for name in ['domaines-doctoraux-data.js', 'domaines-doctoraux-ui.js', 'domaines-doctoraux.css']:
    text = re.sub(r'<(?:script|link)\b[^>]*(?:src|href)="assets/' + re.escape(name) + r'[^\"]*"[^>]*>(?:</script>)?\n?', '', text)
anchor = re.search(r'<script src="assets/programmes-detail-modern\.js[^\"]*"></script>', text)
assert anchor
scripts = '<script src="assets/domaines-doctoraux-data.js?v=' + VERSION + '"></script><script src="assets/domaines-doctoraux-ui.js?v=' + VERSION + '"></script>'
text = text[:anchor.start()] + scripts + text[anchor.start():]
text = text.replace('</head>', '<link rel="stylesheet" href="assets/domaines-doctoraux.css?v=' + VERSION + '">\n</head>')
for name in ['programme-contenus.js', 'programmes-ecoles.js', 'diplomes-specialisations.js', 'programmes-detail-modern.js']:
    text = re.sub(r'(assets/' + re.escape(name) + r')(?:\?[^"\s<>]*)?', r'\1?v=' + VERSION, text)
path.write_text(text)

# Les fragments institutionnels restent identiques aux pages publiées.
wp = ROOT / 'wordpress/draft-theme/assets'
for registry in ['institution-pages.json', 'presentations-pages.json']:
    path = wp / registry; data = json.loads(path.read_text())
    for slug in ['programme', 'ecole-scipt-international']:
        data['pages'][slug] = re.search(r'<main\b.*?</main>', (ROOT / (slug + '.html')).read_text(), re.S)[0]
    path.write_text(json.dumps(data, ensure_ascii=False) + '\n')
for name in ['domaines-doctoraux-20261020.json', 'domaines-doctoraux-fragments.json', 'domaines-doctoraux-data.js', 'domaines-doctoraux-ui.js', 'domaines-doctoraux.css', 'edi-domaines-fragment.html', 'programme-contenus.js', 'programmes-ecoles.js', 'diplomes-specialisations.js', 'programmes-detail-modern.js']:
    (wp / name).write_bytes((ASSETS / name).read_bytes())
print('EDI : 16 domaines, 88 disciplines, 91 spécialités possibles, 48 axes ; 4 liens historiques conservés.')
