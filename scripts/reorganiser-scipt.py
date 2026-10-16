#!/usr/bin/env python3
"""Construit les pages et données depuis un référentiel académique unique, sans pages v2."""
from pathlib import Path
from lxml import html as dom
from html import escape as E
import json,re,copy
ROOT=Path(__file__).resolve().parents[1]
def read(n):return (ROOT/n).read_text()
def write(n,s):
 p=ROOT/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(s)
def jd(v):return json.dumps(v,ensure_ascii=False)
def jsdata(n):return json.JSONDecoder().raw_decode(read(n).split('=',1)[1].lstrip())[0]
def main(n):return re.search(r'<main\b.*?</main>',read(n),re.S).group(0)
def setmain(n,body):write(n,re.sub(r'<main\b.*?</main>',lambda m:body,read(n),count=1,flags=re.S))
a=json.loads(read('assets/architecture-academique.json'));schools={s['code']:s for s in a['schools']};canonical={p['id']:p for p in a['programmes']}
if 'faculty' not in a:
 doc=dom.fromstring(read('corps-professoral.html'));a['faculty']=[]
 for h in doc.xpath('//main//h6'):
  a['faculty'].append({'name':' '.join(h.text_content().split()),'role':' '.join(h.getnext().text_content().split()),'image':h.xpath('preceding::img[1]')[0].get('src')})
 a['cert_images']=[x.get('src') for x in dom.fromstring(main('agrement-reconnaissance.html')).xpath('//img')]
 write('assets/architecture-academique.json',json.dumps(a,ensure_ascii=False,indent=2))
oldsrc=read('assets/programmes-ecoles.js');programmes,end=json.JSONDecoder().raw_decode(oldsrc[len('const programmes='):]);tail=oldsrc[len('const programmes=')+end:]
contents=jsdata('assets/programme-contenus.js');diplomes=jsdata('assets/diplomes-specialisations.js');orientation=jsdata('assets/orientation-data.js');oldori={p['id']:p for p in orientation}
for id,p in canonical.items():
 s=schools[p['school_code']];programmes[id]={'title':p['title'],'type':'Universitaire','school':s['name'],'href':s['href'],'department':p['department'],'status':p['status']}
 previous=contents.get(id,{});contents[id]={'intro':previous.get('intro','Explorez les enseignements et les domaines de spécialisation de la filière '+p['title']+'.'),'topics':p['specializations']}
 if p['status']=='reserve':contents[id]['intro']=p['condition']+' Ce parcours est présenté en réserve et n’est pas ouvert à la candidature en ligne.'
 previous=diplomes.get(id,{})
 diplomes[id]={'title':p['title'],'school':s['name'],'href':s['href'],'levels':p['levels'],'diplomas': ['Doctorat en médecine'] if id=='7659' else ['Doctorat en pharmacie'] if id=='7662' else previous.get('diplomas',p['levels']),'specializations':p['specializations'],'stages':previous.get('stages',[])}
# Le secrétariat médical reste accessible avec son identifiant, dans l’Academy.
programmes['7665'].update(title='Secrétariat médical — appui transversal',type='Professionnelle',school=schools['ESSA']['name'],href=schools['ESSA']['href'],department='Appui transversal aux six départements de santé')
diplomes['7665']={'title':programmes['7665']['title'],'school':schools['ESSA']['name'],'href':schools['ESSA']['href'],'levels':['AFP','CFP'],'diplomas':['Attestation ou certificat selon le parcours préparé'],'specializations':['Appui administratif aux six départements de l’ESSA'],'stages':[]}
for id,p in programmes.items():
 if id in canonical or id in a['aliases'] or id in ['7666','7667','7668','7669','7665']:continue
 for s in schools.values():
  if p['href']==s['href']:p['school']=s['name']
for id,alias in a['aliases'].items():
 target=alias['target'];programmes[id]={**programmes[target],'alias_of':target,'pathway':alias['pathway']};contents[id]=contents[target];diplomes[id]=diplomes[target]
for id in ['7666','7667','7668','7669']:
 diplomes[id]={'title':programmes[id]['title'],'school':'École Doctorale Internationale SCIPT','href':'ecole-scipt-international.html','levels':['Doctorat'],'diplomas':['Doctorat'],'specializations':[],'stages':[]}
# Alias : même contenu canonique, avec conservation de l’identifiant ancien pour les liens et les cours.
write('assets/programmes-ecoles.js','const programmes='+jd(programmes)+tail)
write('assets/programme-contenus.js','window.sciptProgrammeContenus='+jd(contents)+';\n')
write('assets/diplomes-specialisations.js','window.SCIPT_DIPLOMES='+jd(diplomes)+';\n')
ori=[]
for id,p in programmes.items():
 if id in a['aliases']:continue
 old=oldori.get(id,{});school=next((s for s in schools.values() if s['href']==p['href']),None)
 ori.append({'id':id,'title':p['title'],'type':p['type'],'school':p['school'],'domain':school['domain'] if school else 'recherche','status':p.get('status','catalogue'),'levels':diplomes.get(id,{}).get('levels',[]),**({'duration':old['duration']} if old.get('duration') else {})})
write('assets/orientation-data.js','window.SCIPT_ORIENTATION='+jd(ori)+';\n')
# Les cours validés conservent leur identifiant ; leurs destinations suivent les regroupements.
f=json.loads(read('wordpress/draft-theme/assets/classement-cours.json'));f['filieres']=ori;f['version']=a['version']
for course in f['courses']:
 id=str(course.get('catalogue_id') or '')
 if id in a['aliases']:
  new=a['aliases'][id];course['catalogue_id']=new['target'];course['reason']+=' Regroupement dans '+programmes[new['target']]['title']+' ; parcours '+new['pathway']+'.'
write('wordpress/draft-theme/assets/classement-cours.json',json.dumps(f,ensure_ascii=False,indent=2))
# Générateurs de composants.
def img(src,alt,cls=''):
 return '<img src="'+E(src,quote=True)+'" alt="'+E(alt,quote=True)+'" loading="lazy" class="'+cls+'"/>'
def hero(kicker,title,desc,image=None):
 return '<section class="inst-hero"><div class="container'+(' inst-hero-grid' if image else '')+'"><div><span class="inst-kicker">'+kicker+'</span><h1>'+title+'</h1><p class="inst-lead">'+desc+'</p></div>'+(img(image,title.replace('<em>','').replace('</em>',''),'inst-hero-image') if image else '')+'</div></section>'
def card(title,text,index='',image=None,extra=''):
 return '<article class="inst-card">'+(img(image,title) if image else '')+'<div class="inst-card-body"><span class="inst-index">'+index+'</span><h3>'+title+'</h3><p>'+text+'</p>'+extra+'</div></article>'
def cta():return '<section class="inst-section"><div class="container"><div class="inst-banner"><span class="inst-kicker">VOTRE PROCHAINE ÉTAPE</span><h2>Construisons votre parcours.</h2><p>Découvrez les formations et échangez avec les admissions pour choisir le parcours adapté à votre projet.</p><a class="inst-link" href="programmes-universitaires.html">Explorer les programmes →</a> &nbsp; <a class="inst-link" href="contact.html">Échanger avec les admissions →</a></div></div></section>'
def wrap(body):return '<main id="contenu" class="inst-page" tabindex="-1">'+body+'</main>'
def section(title,content,desc=''):return '<section class="inst-section"><div class="container"><h2>'+title+'</h2>'+(('<p>'+desc+'</p>') if desc else '')+content+'</div></section>'
faculty=''
for i,p in enumerate(a['faculty']):
 faculty+='<article class="inst-card">'+img(p['image'],p['name'],'inst-portrait')+'<div class="inst-card-body"><span class="inst-index">ENSEIGNEMENT & EXPERTISE</span><h2>'+E(p['name'])+'</h2><p>'+E(p['role'])+'</p><button class="inst-link" type="button" data-institution-image="'+E(p['image'],quote=True)+'" data-institution-title="'+E(p['name'],quote=True)+'">Voir le portrait ↗</button></div></article>'
setmain('corps-professoral.html',wrap(hero('LES VISAGES DU SCIPT','Des savoirs.<br/><em>Des personnalités.</em>','Rencontrez les membres du corps professoral : des expériences académiques et professionnelles au service de votre formation.')+section('Notre corps professoral','<div class="inst-grid">'+faculty+'</div>')+cta()))
photo='https://sciptinternational.com/wp-content/uploads/2024/11/333105967_734065661658105_7024682901616330939_n-1024x683.jpg'
methods=[('Comprendre les fondements','Les enseignements théoriques apportent les concepts, les méthodes et les repères nécessaires pour analyser une situation professionnelle.'),('Apprendre par projets','Études de cas, travaux individuels et projets collectifs développent l’analyse, la coopération et la gestion de projet.'),('Pratiquer en atelier','Ateliers et simulations permettent de s’exercer dans un cadre pédagogique, avec les outils et méthodes du domaine étudié.'),('Relier formation et terrain','Stages et projets en structure d’accueil donnent une place à la mise en application, selon le parcours préparé.'),('Être accompagné','Les échanges avec les enseignants et la scolarité aident à comprendre les attendus et à construire une progression.'),('Développer des compétences transversales','Communication professionnelle, résolution de problèmes, autonomie et travail en équipe accompagnent les apprentissages techniques.')]
setmain('approche-pedagogique.html',wrap(hero('APPRENDRE EN FAISANT','Comprendre.<br/>Pratiquer. <em>Progresser.</em>','Une pédagogie qui relie les savoirs aux situations concrètes, avec des méthodes adaptées à chaque parcours.',photo)+section('Une formation qui prend forme dans l’action.','<div class="inst-grid">'+''.join(card(t,p,f'{i+1:02}') for i,(t,p) in enumerate(methods))+'</div>')+section('L’équilibre entre théorie et pratique.','<div class="inst-banner"><div class="inst-stats"><div><strong>70 %</strong><span>Pratique : orientation pédagogique présentée</span></div><div><strong>30 %</strong><span>Théorie : orientation pédagogique présentée</span></div></div><p>Cette répartition décrit l’approche institutionnelle. L’organisation effective des cours, ateliers, projets et stages est précisée dans chaque programme.</p></div>')+cta()))
reasons=[('Un parcours qui vous ressemble','La distinction entre études universitaires et formations professionnelles vous aide à choisir selon votre projet.','programmes-universitaires.html','Explorer les parcours'),('Des spécialisations lisibles','Chaque filière regroupe ses parcours et ses domaines de spécialisation, dans une organisation par école et département.','diplomes-specialisations.html','Voir les spécialisations'),('La pratique au cœur des apprentissages','Projets, ateliers, études de cas et stages relient les enseignements aux réalités professionnelles.','approche-pedagogique.html','Découvrir notre pédagogie'),('Des enseignants aux expériences variées','Des profils académiques et professionnels apportent des approches complémentaires aux enseignements.','corps-professoral.html','Rencontrer les enseignants'),('Une ouverture internationale','Les partenariats et parcours internationaux sont présentés avec leurs conditions et leur périmètre.','partenaires.html','Découvrir les partenariats'),('Un projet accompagné','Orientation, admissions et échanges avec la scolarité vous aident à identifier les étapes de votre parcours.','orientation.html','Trouver ma formation')]
setmain('pourquoi-nous-choisir.html',wrap(hero('CHOISIR LE SCIPT','Votre ambition.<br/><em>Un parcours pour avancer.</em>','Des études structurées, une place donnée à la pratique et un accompagnement pour donner du sens à votre projet.','assets/etudiants-parcours.png')+section('Six raisons de construire votre avenir avec nous.','<div class="inst-grid">'+''.join(card(t,p,f'{i+1:02}',extra='<a class="inst-link" href="'+href+'">'+label+' →</a>') for i,(t,p,href,label) in enumerate(reasons))+'</div>')+cta()))
certs=a['cert_images'];certcards=''
certspec=[('Agrément national','Agrément N° 00352/MENFPFC/SG/DGFP/DFP, présenté par SCIPT INTERNATIONAL pour son activité de formation.',certs[-1]),('ISO 9001:2015','La certification qualité présentée porte sur le système de management et son périmètre. Elle se distingue de l’habilitation propre à un diplôme.',certs[0]),('Certification et programme international','Présentation des éléments de certification American Certification Services — Global Program communiqués par l’établissement.',certs[2])]
for i,(t,p,image) in enumerate(certspec):
 certcards+='<article class="inst-card">'+img(image,t,'inst-document')+'<div class="inst-card-body"><span class="inst-index">CADRE INSTITUTIONNEL</span><h2>'+t+'</h2><p>'+p+'</p><button class="inst-link" type="button" data-institution-image="'+E(image,quote=True)+'" data-institution-title="'+E(t,quote=True)+'">Agrandir le visuel ↗</button></div></article>'
setmain('agrement-reconnaissance.html',wrap(hero('CONFIANCE & TRANSPARENCE','Un cadre clair.<br/><em>Des repères pour choisir.</em>','Retrouvez les éléments institutionnels présentés par le SCIPT et comprenez le rôle de chaque agrément, certification et partenariat.')+section('Nos éléments institutionnels','<div class="inst-grid">'+certcards+'</div>')+section('Bien distinguer les périmètres.','<div class="inst-grid two">'+card('Qualité et organisation','Une certification de système de management décrit un cadre de qualité. Son objet diffère de la reconnaissance académique d’un diplôme.','01')+card('Diplôme et organisme délivrant','Avant de choisir votre parcours, consultez son intitulé, son niveau, l’organisme délivrant le diplôme et les conditions applicables.','02',extra='<a class="inst-link" href="verification-diplomes.html">Vérifier un diplôme →</a>')+'</div>')+cta()))
# Les cinq pages partagent un système visuel ; Qui sommes-nous conserve ses fenêtres.
for name in ['qui-sommes-nous.html','a-propos.html']:
 s=read(name).replace('quatre écoles, dont l’École Doctorale Internationale SCIPT','cinq écoles')
 write(name,s)
# Catalogue par département, sans fiches dupliquées pour les anciennes spécialisations.
def programme_card(p):
 status=p.get('status','catalogue');badge='<span class="inst-pill'+(' reserve' if status=='reserve' else '')+'">'+('Parcours en réserve' if status=='reserve' else ' · '.join(p['levels']))+'</span>'
 return '<article class="inst-card inst-programme"><div class="inst-card-body">'+badge+'<h3>'+E(p['title'])+'</h3><ul>'+''.join('<li>'+E(t)+'</li>' for t in p['specializations'])+'</ul>'+('<p>'+E(p['condition'])+'</p>' if status=='reserve' else '')+'<a class="inst-link" href="programme.html?id='+p['id']+'">Découvrir la filière →</a></div></article>'
def department_sections(s):
 out=''
 for dept in s['departments']:
  ps=[p for p in a['programmes'] if p['school_code']==s['code'] and p['department']==dept]
  out+='<details class="inst-card"'+(' open' if dept==s['departments'][0] else '')+'><summary>'+E(dept)+'<small>'+str(len(ps))+' filière'+('s' if len(ps)>1 else '')+'</small></summary><div class="inst-grid">'+''.join(programme_card(p) for p in ps)+'</div></details>'
 return out
video_data=json.JSONDecoder().raw_decode(read('assets/videos-accueil-data.js').split('=',1)[1].lstrip())[0]
def school_video(key):
 v=video_data[key]
 return '<section class="scipt-video-section container inst-school-film" aria-label="Présentation vidéo de l’école"><div class="scipt-video-panel"><div class="scipt-video-copy"><span>SCIPT INTERNATIONAL · PRÉSENTATION INSTITUTIONNELLE</span><h2>'+E(v['title'])+'</h2><p>'+E(v['description'])+'</p><details><summary>Lire la présentation</summary><p>'+E(v['transcript'])+'</p></details></div><div class="scipt-video-frame"><video controls playsinline preload="metadata" aria-label="'+E(v['title'],quote=True)+'"'+(' poster="'+E(v['poster'],quote=True)+'"' if v.get('poster') else '')+'><source src="'+E(v['url'],quote=True)+'" type="video/mp4"/>Votre navigateur ne prend pas en charge cette vidéo. <a href="'+E(v['url'],quote=True)+'">Ouvrir la vidéo</a></video></div></div></section>'
schoolnav='<nav class="inst-school-nav" aria-label="Nos 5 écoles">'+''.join('<a href="'+s['href']+'">'+s['code']+'</a>' for s in schools.values())+'<a href="ecole-scipt-international.html">École Doctorale Internationale</a></nav>'
for s in schools.values():
 n=s['href']
 if not (ROOT/n).exists():write(n,read('ecole-droit-sciences-gestion.html'))
 pro=[(id,p) for id,p in programmes.items() if p['type']=='Professionnelle' and p['href']==s['href']]
 prohtml='<div class="inst-grid">'+''.join(card(p['title'],'Parcours professionnel SCIPT INTERNATIONAL ACADEMY.',extra='<a class="inst-link" href="programme.html?id='+id+'">Voir la formation →</a>') for id,p in pro)+'</div>' if pro else '<p>Cette école ne possède pas d’offre Academy dans la synthèse.</p>'
 poles=section('Trois pôles pour découvrir la santé','<div class="inst-grid">'+card('Médecine Générale et Pharmacie','Des formations dédiées à la prévention, au diagnostic, au traitement et au suivi des patients, ainsi qu’aux médicaments et à la sécurité thérapeutique.','01')+card('Sciences infirmières et formation des sages-femmes','Développer les compétences du soin, de la santé communautaire et de la santé maternelle et infantile. Sciences infirmières et formation des sages-femmes restent deux filières distinctes.','02')+card('Sciences paramédicales','Former aux techniques du laboratoire, de l’imagerie et de la réadaptation pour accompagner le diagnostic et la prise en charge des patients.','03')+'</div>') if s['code']=='ESSA' else ''
 setmain(n,wrap(hero(s['code']+' · SCIPT INTERNATIONAL UNIVERSITY',E(s['name']),s['description'],'assets/'+s['logo']).replace('class="inst-hero-image"','class="inst-hero-image inst-school-logo"')+school_video(s['video_key'])+'<div class="container">'+schoolnav+'</div>'+poles+section('Départements et filières', '<div id="universitaire">'+department_sections(s)+'</div>')+section('SCIPT INTERNATIONAL ACADEMY','<div id="professionnel">'+('<div class="inst-banner"><p>Le Secrétariat médical constitue un appui transversal aux six départements de santé. Il relève de l’Academy.</p></div>' if s['code']=='ESSA' else '')+prohtml+'</div>')+cta()))
doctoral_intro='L’École Doctorale Internationale SCIPT accompagne la construction d’un projet de recherche, la définition d’une problématique, la méthode scientifique et la présentation des résultats. Ses domaines s’appuient sur les disciplines des autres écoles.'
setmain('ecole-scipt-international.html',wrap(hero('SCIPT INTERNATIONAL UNIVERSITY','École Doctorale Internationale SCIPT',doctoral_intro,'assets/blason-doctoral.png').replace('class="inst-hero-image"','class="inst-hero-image inst-school-logo"')+school_video('doctorale')+'<div class="container">'+schoolnav+'</div>'+section('Les domaines doctoraux','<div id="universitaire" class="inst-grid two">'+''.join(card(programmes[id]['title'],'Approfondir les savoirs et construire une démarche de recherche dans ce domaine.',extra='<a class="inst-link" href="programme.html?id='+id+'">Explorer le domaine doctoral →</a>') for id in ['7666','7667','7668','7669'])+'</div>')+section('Construire une démarche scientifique','<div class="inst-grid">'+card('Définir une problématique','Délimiter un sujet, situer les travaux existants et préciser les objectifs de recherche.','01')+card('Structurer une méthode','Choisir les méthodes adaptées au sujet et organiser le travail de recherche.','02')+card('Partager les résultats','Analyser les résultats et présenter les contributions avec rigueur.','03')+'</div>')+cta()))
# Page universitaire : quatre écoles + un niveau doctoral distinct, maintenu en première position.
n='programmes-universitaires.html';original=main(n);identity=re.search(r'<section class="scipt-identity-banner".*?</section>',original,re.S).group(0)
body=identity+school_video('universitaire')+hero('SCIPT INTERNATIONAL UNIVERSITY','Découvrez nos<br/><em>Programmes Universitaires</em>','Cinq écoles pour construire votre avenir : sciences de la santé, droit et gestion, sciences et technologies, sciences humaines et communication, et école doctorale internationale.','assets/cours-universitaire.png')+'<div class="container">'+schoolnav+'<div class="inst-stats"><div><strong>5</strong><span>Écoles</span></div><div><strong>20</strong><span>Départements</span></div><div><strong>40</strong><span>Filières structurées</span></div><div><strong>3</strong><span>Parcours en réserve</span></div></div></div>'
for s in schools.values():body+=section(s['code']+' · '+s['name'],'<p>'+E(s['description'])+'</p>'+department_sections(s))
body+=section('SCIPT INTERNATIONAL · École Doctorale','<div class="inst-banner"><p>Construire un projet de recherche, approfondir une expertise et produire de nouveaux savoirs dans les domaines doctoraux du SCIPT.</p><a class="inst-link" href="ecole-scipt-international.html">Découvrir la recherche et les domaines doctoraux →</a></div>')
body+=section('Deux approches des énergies, un choix éclairé.','<div class="inst-grid two">'+card('Concevoir les systèmes','Le Génie électrique aborde la conception et la réalisation technique des systèmes, avec les automatismes et l’électrotechnique.')+card('Gérer les ressources et les impacts','La filière Énergies renouvelables et Gestion environnementale relie les systèmes énergétiques à la sécurité et à la gestion de l’environnement.')+'</div>')+cta();setmain(n,wrap(body))
# Panorama cohérent avec la nouvelle nomenclature.
setmain('diplomes-specialisations.html',wrap(hero('DIPLÔMES & SPÉCIALISATIONS','Une filière.<br/><em>Plusieurs perspectives.</em>','Le diplôme correspond à une filière. Les parcours et spécialisations en précisent le domaine ; les conditions d’accès dépendent du niveau préparé.')+section('Les cycles de formation','<div class="inst-grid">'+card('Licence','Premier cycle organisé autour d’une filière et de ses enseignements fondamentaux.','01')+card('Master','Approfondissement et spécialisations de second cycle selon les filières.','02')+card('Doctorat et cursus de santé','Médecine et Pharmacie figurent au niveau Doctorat dans la nouvelle architecture. Les domaines doctoraux de recherche restent présentés séparément.','03')+'</div>')+''.join(section(s['code']+' · '+s['name'],department_sections(s)) for s in schools.values())+cta()))
# Menus partagés : les liens existants restent valables et les regroupements ne créent pas de doublons.
def school_menu(s,pro=False):
 rows=[(id,p) for id,p in programmes.items() if p['href']==s['href'] and p['type']==('Professionnelle' if pro else 'Universitaire') and id not in a['aliases']]
 url=s['href']+('?parcours=pro' if pro else '')
 return '<article class="approved-school"><a class="approved-school-title" href="'+url+'">'+img('assets/'+s['logo'],s['code'],'school-emblem')+'<span>'+s['code']+' · '+E(s['name'])+'</span></a><ul>'+''.join('<li><a href="programme.html?id='+id+'">'+E(p['title'])+'</a></li>' for id,p in rows[:3])+'</ul><a class="approved-school-more" href="'+url+'">Départements et formations →</a></article>'
docmenu='<article class="approved-school doctorale"><a class="approved-school-title" href="ecole-scipt-international.html">'+img('assets/blason-doctoral.png','SCIPT INTERNATIONAL','school-emblem')+'<span>SCIPT INTERNATIONAL<br/>École Doctorale Internationale</span></a><ul>'+''.join('<li><a href="programme.html?id='+id+'">'+E(programmes[id]['title'])+'</a></li>' for id in ['7666','7667','7668','7669'])+'</ul></article>'
menus={'mega-uni':'<div class="approved-mega-intro"><strong>5 écoles · SCIPT INTERNATIONAL UNIVERSITY</strong><a href="programmes-universitaires.html">Tout le catalogue →</a></div><div class="approved-mega-grid approved-mega-uni">'+''.join(school_menu(s) for s in schools.values())+docmenu+'</div>','mega-pro':'<div class="approved-mega-intro"><strong>SCIPT INTERNATIONAL ACADEMY</strong><a href="formations-professionnelles.html">Toutes les formations →</a></div><div class="approved-mega-grid approved-mega-pro">'+''.join(school_menu(s,True) for s in schools.values() if s['code']!='ESHC')+'</div>'}
for file in ROOT.glob('*.html'):
 text=file.read_text();doc=dom.fromstring(text)
 for id,markup in menus.items():
  targets=doc.xpath('//*[@id="'+id+'"]')
  for target in targets:
   for child in list(target):target.remove(child)
   target.text=None
   for child in dom.fragments_fromstring(markup):target.append(child)
 for link in doc.xpath('//a[contains(@class,"scipt-catalogue-link")]'):
  link.text='Programmes Universitaire' if 'universitaires' in link.get('href','') else 'Formation Professionnelles'
 # Une seule feuille et un seul script communs, ajoutés sans versions de pages parallèles.
 for asset in ['institution.css','about-dialogs.css','videos-accueil.css']:
  if not doc.xpath('//link[contains(@href,"'+asset+'")]'):
   link=dom.Element('link',rel='stylesheet',href='assets/'+asset+'?v=20261015-ecoles-videos');doc.find('head').append(link)
 if 'inst-page' in text and not doc.xpath('//script[contains(@src,"institution.js")]'):
  doc.find('body').append(dom.Element('script',src='assets/institution.js?v=20261015-ecoles-videos'))
 for node in doc.xpath('//link[contains(@href,"institution.css")]'):
  node.set('href','assets/institution.css?v=20261016-relief')
 for node in doc.xpath('//script[contains(@src,"videos-accueil-data.js")]'):
  node.set('src','assets/videos-accueil-data.js?v=20261015-ecoles-videos')
 for node in doc.xpath('//script[@src]'):
  if node.get('src','').split('?')[0] in ['assets/app.js','assets/programmes-ecoles.js','assets/programme-contenus.js','assets/orientation-data.js','assets/diplomes-specialisations.js','assets/candidature.js','assets/orientation.js','assets/programmes-detail-modern.js']:
   node.set('src',node.get('src').split('?')[0]+'?v=20261015-ecoles-videos')
 write(file.name,'<!DOCTYPE html>\n'+dom.tostring(doc,encoding='unicode',method='html'))
# Registre des fragments : WordPress réutilise les mêmes contenus dans son brouillon.
page_names=['corps-professoral','approche-pedagogique','pourquoi-nous-choisir','agrement-reconnaissance','ecole-droit-sciences-gestion','ecole-sciences-technologies-ingenierie','ecole-sante-developpement','ecole-sciences-humaines-communication','ecole-scipt-international','programmes-universitaires','diplomes-specialisations']
write('wordpress/draft-theme/assets/institution-pages.json',jd({'pages':{n:main(n+'.html') for n in page_names},'menus':menus}))
# Application des mêmes écoles au sélecteur historique de l’accueil.
app=read('assets/app.js');start=app.index("document.querySelectorAll('.filter')")
doctoral={'name':'SCIPT INTERNATIONAL · École Doctorale Internationale','href':'ecole-scipt-international.html','levels':['Doctorat'],'image':'blason-doctoral.png','desc':'Recherche et domaines doctoraux.'}
uni=[{'name':s['name'],'href':s['href'],'levels':['Licence','Master']+(['Doctorat'] if s['code']=='ESSA' else []),'image':s['logo'],'desc':s['description']} for s in schools.values()]+[doctoral]
pro=[{**u,'levels':['AFP','CFP','CAP','CQF'],'href':u['href']+'?parcours=pro','desc':'Formations SCIPT INTERNATIONAL ACADEMY.'} for u in uni if u['href'] in [s['href'] for s in schools.values() if s['code']!='ESHC']]
prefix='const university='+jd(uni)+';const professional='+jd(pro)+''';function render(group,filter='Tous'){const target=document.getElementById(group==='uni'?'university-cards':'professional-cards');if(!target)return;target.innerHTML=(group==='uni'?university:professional).filter(x=>filter==='Tous'||x.levels.includes(filter)).map(x=>`<div class="col-md-6 col-xl-4"><article class="program-card"><div class="card-body-custom"><h3><img class="school-emblem" src="assets/${x.image}" alt="">${x.name}</h3><p>${x.desc}</p><a href="${x.href}">Découvrir l’école →</a></div></article></div>`).join('')}render('uni');render('pro');'''
write('assets/app.js',prefix+app[start:])
print('Architecture et pages générées :',len(programmes),'identifiants conservés ou ajoutés ;',len(ori),'entrées hors alias.')
