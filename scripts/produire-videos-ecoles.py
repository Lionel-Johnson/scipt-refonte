#!/usr/bin/env python3
"""Séquences institutionnelles éditoriales : texte du catalogue, blasons originaux, sans scènes de campus inventées."""
from pathlib import Path
import subprocess,json
ROOT=Path(__file__).resolve().parents[1]
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
B='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
S='/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
films={
 'technologies':('ESTI','logos/esti-scipt-20261020.webp',['Sciences, technologies','et ingénierie'],[
 ('COMPRENDRE LES SCIENCES',['Sciences fondamentales appliquées','Terre, environnement et géosciences']),
 ('CONCEVOIR ET INNOVER',['Informatique et systèmes numériques','Génies électrique, mécanique et civil']),
 ('TRANSFORMER LES RESSOURCES',['Mines, pétrole et énergies','Agronomie et agro-industrie'])]),
 'humaines':('ESHC','logos/eshc-scipt-20261020.webp',['Sciences humaines,','sociales et communication'],[
 ('COMPRENDRE LES SOCIÉTÉS',['Sociologie et anthropologie','Science politique et relations internationales']),
 ('ACCOMPAGNER LE DÉVELOPPEMENT',['Développement communautaire','Action humanitaire et solidarité']),
 ('COMMUNIQUER ET CRÉER',['Journalisme et médias','Production audiovisuelle et arts numériques'])]),
 'doctorale':('ÉCOLE DOCTORALE','logos/edi-scipt-20261020.webp',['La recherche au service','de nouveaux savoirs'],[
 ('CONSTRUIRE UNE PROBLÉMATIQUE',['Sciences juridiques, politiques et gestion','Sciences, technologies et ingénierie']),
 ('APPROFONDIR UNE EXPERTISE',['Sciences de la santé','Sciences humaines, sociales et communication']),
 ('PRODUIRE ET PARTAGER LES SAVOIRS',['Méthode scientifique et analyse','Présentation rigoureuse des résultats'])])}
def text_filter(text,x,y,size,color='white',font=F,extra=''):
 # File-based text keeps punctuation out of ffmpeg expression syntax.
 k=len(list(TMP.glob('*.txt')));p=TMP/f'text-{k}.txt';p.write_text(text)
 return f"drawtext=fontfile={font}:textfile={p}:x={x}:y={y}:fontsize={size}:fontcolor={color}{extra}"
TMP=ROOT/'../tmp/films-ecoles';TMP.mkdir(parents=True,exist_ok=True)
for key,(code,logo,title,slides) in films.items():
 filters=['[0:v]format=yuv420p', 'drawbox=x=0:y=0:w=iw:h=8:color=0xb8954e:t=fill', 'drawbox=x=60:y=562:w=1160:h=1:color=0xffffff33:t=fill',text_filter('SCIPT INTERNATIONAL UNIVERSITY',60,52,17,'0xe0c48b',B),text_filter(code,60,106,20,'0xe0c48b',B)]
 for i,t in enumerate(title):filters.append(text_filter(t,60,158+i*56,46,'white',S))
 for i,(heading,lines) in enumerate(slides):
  enable=f":enable='gte(t,{i*5})*lt(t,{(i+1)*5})'"
  filters.append(text_filter(heading,60,345,20,'0xe0c48b',B,enable))
  for j,line in enumerate(lines):filters.append(text_filter(line,60,398+j*40,24,'0xeaf0f7',F,enable))
 filters.extend([text_filter('FORMATION  /  PRATIQUE  /  EXCELLENCE',60,615,16,'0xc1ccdb',F),"drawbox=x=60:y=583:w='1160':h=3:color=0x314765:t=fill",'drawbox=x=60:y=583:w=1160:h=3:color=0xb8954e:t=fill'])
 graph=','.join(filters)+'[base];[1:v]scale=280:280:force_original_aspect_ratio=decrease,pad=300:300:(ow-iw)/2:(oh-ih)/2:color=0x10263f[logo];[base][logo]overlay=x=920:y=145+6*sin(t*0.65),fade=t=in:st=0:d=0.7,fade=t=out:st=14.3:d=0.7[v]'
 out=ROOT/f'assets/videos/ecole-{key}-20261020.mp4'
 cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','lavfi','-i','color=c=0x10263f:s=1280x720:r=24:d=15','-loop','1','-i',str(ROOT/'assets'/logo),'-filter_complex',graph,'-map','[v]','-t','15','-c:v','libx264','-preset','fast','-crf','24','-pix_fmt','yuv420p','-movflags','+faststart','-an',str(out)]
 subprocess.run(cmd,check=True)
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss','1','-i',str(out),'-frames:v','1',str(out.with_suffix('.jpg'))],check=True)
 print(key,out.stat().st_size,flush=True)
