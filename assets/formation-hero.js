/* Médias officiels fournis par la direction — 16 octobre 2026.
   Les photos sont livrées dans scipt_30_visuels_pret_github.zip.
   Ce module n'affiche jamais une photographie d'un autre métier par défaut. */
(function () {
  "use strict";
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
  logo.src = window.SCIPT_LOGO_POUR_PARCOURS(course);
  logo.alt = course?.href === "ecole-scipt-international.html" ? "Logo complet École Doctorale Internationale SCIPT" : "Logo complet SCIPT INTERNATIONAL " + (isProfessional ? "ACADEMY" : "UNIVERSITY");
  logo.decoding = "async";

  const media = window.SCIPT_MEDIA_BY_PROGRAMME?.[requestedId];
  const root = window.SCIPT_MEDIA_ASSET_ROOT || new URL('.', document.currentScript.src).href;
  const filesToTry = media?.image ? [new URL(media.image, root).href] : [];
  const showWaiting = (message) => {
    holder.classList.add("sc-media-pending");
    holder.classList.remove("sc-media-ready");
    if (image) { image.hidden = true; image.removeAttribute("src"); }
    caption.textContent = message;
  };
  if (!image || !filesToTry.length) {
    showWaiting("Visuel de « " + title + " » en préparation.");
    return;
  }
  image.alt = "Visuel de la formation : " + title + " — SCIPT INTERNATIONAL";
  image.onload = () => {
    holder.classList.remove("sc-media-pending");
    holder.classList.add("sc-media-ready");
    image.hidden = false;
    caption.textContent = title;
  };
  let currentIndex = 0;
  const tryNext = () => {
    if (currentIndex >= filesToTry.length) {
      showWaiting("Visuel de « " + title + " » en attente de publication.");
      return;
    }
    const file = filesToTry[currentIndex++];
    const url = new URL(file, document.baseURI);
    image.hidden = true;
    holder.classList.add("sc-media-pending");
    caption.textContent = "Chargement du visuel métier…";
    image.src = url.href;
    if (image.complete && image.naturalWidth) image.onload();
  };
  image.onerror = tryNext;
  tryNext();
})();
