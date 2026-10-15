#!/usr/bin/env python3
"""Contrôle les cinq écoles, l’ordre commun et les lecteurs natifs, y compris sans JavaScript."""
from pathlib import Path
from lxml import html
import json,re,subprocess
root=Path(__file__).resolve().parents[1]
a=json.loads((root/'assets/architecture-academique.json').read_text())
names=[s['href'] for s in a['schools']]+['ecole-scipt-international.html']
assert a['presentation']['school_count']==5
assert a['schools'][0]['code']=='ESSA'
registry=json.loads((root/'wordpress/draft-theme/assets/institution-pages.json').read_text())
for n in names:
 doc=html.fromstring((root/n).read_text())
 videos=doc.xpath('//main//video');assert len(videos)==1,(n,len(videos))
 assert videos[0].get('controls') is not None
 assert videos[0].xpath('./source/@src')
 assert doc.xpath('//main//nav[contains(@class,"inst-school-nav")]//a/@href')==names,n
 assert doc.xpath('//*[@id="mega-uni"]//article/a[1]/@href')==names,n
 assert doc.xpath('//main//img[contains(@class,"inst-school-logo")]'),n
 assert not doc.xpath('//main//*[contains(@class,"scipt-video-pending")]'),n
 assert '<video ' in registry['pages'][n[:-5]],n
for p in root.glob('*.html'):
 s=p.read_text();assert not re.search(r'(?:quatre|4) écoles académiques',s,re.I),p.name
assert 'Médecine Générale et Pharmacie' in (root/names[0]).read_text()
for key in ['technologies','humaines','doctorale']:
 p=root/f'assets/videos/ecole-{key}.mp4'
 info=json.loads(subprocess.check_output(['ffprobe','-v','quiet','-show_format','-show_streams','-of','json',str(p)]))
 assert float(info['format']['duration'])>=15
 assert info['streams'][0]['codec_name']=='h264'
 assert info['streams'][0]['width']==1280
print('OK : 5 écoles, santé en premier, doctorat en dernier, menus concordants, lecteurs natifs et 3 vidéos H.264 de 15 s.')
