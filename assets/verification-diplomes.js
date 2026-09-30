(() => {
 const form=document.getElementById('diploma-form');if(!form)return;
 const role=document.getElementById('diploma-role');
 const establishment=document.getElementById('diploma-establishment');
 form.addEventListener('submit',event=>{
  event.preventDefault();if(!form.reportValidity())return;
  const value=id=>document.getElementById(id).value.trim();
  const reference=value('diploma-number');
  const body=['Bonjour,','Je souhaite demander une vérification auprès du SCIPT INTERNATIONAL.','','Référence du document : '+reference,'Formation : '+value('diploma-program'),'Année : '+value('diploma-year'),'Qualité du demandeur : '+value('diploma-role'),...(establishment.disabled?[]:['Établissement de formation : '+value('diploma-establishment')]),'E-mail de réponse : '+value('diploma-email'),'','Précisions : '+value('diploma-message'),'','Je pourrai joindre une copie du document à cet e-mail.'].join('\n');
  const result=document.getElementById('diploma-result');result.hidden=false;result.textContent='Votre demande est préparée. Envoyez l’e-mail depuis votre messagerie pour la transmettre à l’administration. Aucun résultat d’authenticité n’est délivré automatiquement sur cette page.';
  location.href='mailto:info@sciptinternational.com?subject='+encodeURIComponent('Vérification de diplôme — '+reference)+'&body='+encodeURIComponent(body);
 });
})();
