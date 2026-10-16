/* Médias officiels fournis par la direction — 16 octobre 2026.
   Les photos sont livrées dans scipt_30_visuels_pret_github.zip.
   Ce module n'affiche jamais une photographie d'un autre métier par défaut. */
(function () {
  "use strict";
  const imageById = {
  "7645": "gestion-droit-droit-carrieres-juridiques",
  "7646": "gestion-droit-administration-publique",
  "7647": "gestion-droit-management-organisations",
  "7648": "gestion-droit-marketing-commerce",
  "7649": "gestion-droit-entrepreneuriat-innovation",
  "7650": "gestion-droit-gestion-ressources-humaines",
  "7651": "gestion-droit-finance-comptabilite-audit",
  "7652": "gestion-droit-logistique-supply-chain",
  "7653": "technique-genie-civil-batiment",
  "7654": "technique-genie-electrique",
  "7656": "technique-maintenance-informatique-reseaux",
  "7657": "technique-genie-civil-batiment",
  "7658": "technique-panneaux-solaires",
  "7659": "sante-medecine-generale",
  "7660": "sante-sciences-infirmieres",
  "7661": "sante-maieutique",
  "7662": "sante-pharmacie",
  "7663": "sante-sciences-biomedicales",
  "7664": "sante-imagerie-radiologie",
  "7665": "sante-secretariat-medical",
  "7670": "sante-secretariat-medical",
  "7671": "sante-assistance-aux-soins",
  "7672": "sante-hygiene-securite-sanitaire",
  "7673": "technique-maintenance-informatique-reseaux",
  "7674": "technique-bureautique-outils-numeriques",
  "7675": "technique-cameras-de-surveillance",
  "7676": "technique-electricite-batiment-industrielle",
  "7677": "technique-maconnerie-finitions",
  "7678": "technique-plomberie-installation-sanitaire",
  "7679": "technique-panneaux-solaires",
  "7680": "technique-froid-climatisation",
  "7681": "gestion-droit-assistance-de-direction",
  "7682": "gestion-droit-comptabilite-gestion",
  "7683": "gestion-droit-logistique-supply-chain",
  "7701": "technique-genie-electrique",
  "7705": "gestion-droit-management-organisations",
  "7706": "technique-panneaux-solaires",
  "7666": "droit-doctorat-juridique",
  "7669": "humaines-recherche-doctorale",
  "7702": "medias-communication-organisations",
  "7913": "droit-relations-internationales",
  "7916": "medias-journalisme",
  "7917": "medias-production-audiovisuelle",
  "7801": "technique-bureautique-outils-numeriques",
  "7802": "gestion-droit-comptabilite-gestion",
  "7803": "gestion-droit-gestion-ressources-humaines",
  "7804": "gestion-droit-assistance-de-direction",
  "7805": "gestion-droit-logistique-supply-chain",
  "7806": "gestion-transit-douane",
  "7808": "technique-maintenance-informatique-reseaux",
  "7809": "technique-froid-climatisation",
  "7810": "technique-electricite-batiment-industrielle",
  "7811": "technique-electricite-batiment-industrielle",
  "7813": "technique-panneaux-solaires",
  "7816": "technique-maconnerie-finitions",
  "7817": "technique-plomberie-installation-sanitaire",
  "7821": "sante-secretariat-medical",
  "7822": "sante-vendeuse-pharmacie",
  "7823": "sante-assistance-aux-soins",
  "7824": "sante-maieutique",
  "7825": "sante-imagerie-radiologie",
  "7826": "sante-sciences-biomedicales",
  "7901": "gestion-droit-assistance-de-direction",
  "7902": "gestion-droit-marketing-commerce"
};
  const $ = id => document.getElementById(id);
  const image = $("program-hero-image");
  const holder = $("program-hero-media");
  const caption = $("program-hero-caption");
  const logo = $("program-lockup");
  if (!holder || !caption || !logo) return;
  const requestedId = new URLSearchParams(location.search).get("id") || "";
  const course = typeof programmes !== "undefined" ? programmes[requestedId] : null;
  const school = course?.school || $("program-school")?.textContent || "";
  const title = course?.title || $("program-title")?.textContent || "Formation";
  const isProfessional = course?.type === "Professionnelle";
  // Les logos sont officiels et affichés entiers, indépendamment de la photo métier.
  logo.src = isProfessional ? "assets/logo-academy-client.png" : "assets/logo-university-client.jpeg";
  logo.alt = "Logo complet SCIPT INTERNATIONAL " + (isProfessional ? "ACADEMY" : "UNIVERSITY");
  logo.decoding = "async";

  const file = imageById[requestedId] || (course?.alias_of && imageById[course.alias_of]) || "";
  const showWaiting = (message) => {
    holder.classList.add("sc-media-pending");
    holder.classList.remove("sc-media-ready");
    if (image) { image.hidden = true; image.removeAttribute("src"); }
    caption.textContent = message;
  };
  if (!image || !file) {
    showWaiting("Visuel spécifique de « " + title + " » en préparation.");
    return;
  }
  const url = new URL("assets/formations/" + file + ".webp", document.baseURI);
  image.alt = "Illustration de la formation : " + title + " — SCIPT INTERNATIONAL";
  image.onload = () => {
    holder.classList.remove("sc-media-pending");
    holder.classList.add("sc-media-ready");
    image.hidden = false;
    caption.textContent = "Illustration du métier — " + title;
  };
  image.onerror = () => showWaiting("Visuel de « " + title + " » : fichier en cours de publication.");
  // La balise reste masquée avant réception de l'image pour éviter un clignotement.
  image.hidden = true;
  holder.classList.add("sc-media-pending");
  caption.textContent = "Chargement du visuel métier…";
  image.src = url.href;
  if (image.complete && image.naturalWidth) image.onload();
})();
