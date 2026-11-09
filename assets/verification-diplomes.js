
(() => {
  "use strict";

  const form = document.getElementById("diploma-form");
  if (!form) return;

  const config = window.SCIPT_DIPLOMA_CONFIG || {};
  const result = document.getElementById("diploma-result");
  const submit = form.querySelector('[type="submit"]');

  const val = id =>
    (document.getElementById(id)?.value || "").trim();

  // Les logos, signatures et modèles proviennent d'une seule configuration.
  // Les identifiants de modèles sont en minuscules : bcc, genius, mjb, scipt.


  const style = document.createElement("style");

  style.textContent = `
    .diploma-lookup-result {
      margin-top: 1.5rem;
      padding: clamp(1.1rem,3vw,1.7rem);
      border: 1px solid #d9e2ec;
      border-radius: 18px;
      background: #fff;
      color: #20344c;
      box-shadow: 0 12px 34px rgba(20,42,68,.08);
    }

    .diploma-lookup-result .lookup-heading {
      display: flex;
      align-items: center;
      gap: .85rem;
      margin-bottom: .55rem;
    }

    .diploma-lookup-result .lookup-mark {
      display: grid;
      place-items: center;
      flex: 0 0 42px;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      font-size: 1.2rem;
    }

    .diploma-lookup-result h3 {
      margin: 0;
      font-size: 1.18rem;
      font-weight: 800;
    }

    .diploma-lookup-result .lookup-lead {
      margin: .35rem 0 1.1rem;
      color: #52647a;
    }

    .diploma-lookup-result dl {
      display: grid;
      grid-template-columns: minmax(115px,.65fr) 1.35fr;
      gap: .7rem 1rem;
      margin: 1rem 0 1.2rem;
      padding: 1rem;
      border-radius: 12px;
      background: #f6f8fb;
    }

    .diploma-lookup-result dt {
      font-size: .9rem;
      font-weight: 700;
      color: #52647a;
    }

    .diploma-lookup-result dd {
      margin: 0;
      font-weight: 600;
      overflow-wrap: anywhere;
    }

    .diploma-lookup-result .lookup-note {
      margin: 1rem 0 0;
      padding-top: 1rem;
      border-top: 1px solid #e4eaf0;
      font-size: .9rem;
      line-height: 1.6;
      color: #52647a;
    }

    .diploma-lookup-result .lookup-actions {
      display: flex;
      flex-wrap: wrap;
      gap: .6rem;
      margin-top: 1rem;
    }

    .diploma-lookup-result .lookup-copy {
      border: 1px solid #c7d2df;
      border-radius: 999px;
      padding: .55rem .95rem;
      background: #fff;
      color: #20344c;
      font-weight: 700;
      cursor: pointer;
    }

    .diploma-lookup-result.is-success {
      border-color: #9bc9aa;
      background: linear-gradient(145deg,#f4fbf6,#fff 70%);
    }

    .diploma-lookup-result.is-success .lookup-mark {
      background: #dff3e5;
      color: #18733b;
    }

    .diploma-lookup-result.is-warning {
      border-color: #e6d29a;
      background: #fffaf0;
    }

    .diploma-lookup-result.is-warning .lookup-mark {
      background: #fff0c7;
      color: #8a5a00;
    }

    .diploma-lookup-result.is-error {
      border-color: #e4b0b0;
      background: #fff5f5;
    }

    .diploma-lookup-result.is-error .lookup-mark {
      background: #ffe2e2;
      color: #a12626;
    }

    @media(max-width:480px) {
      .diploma-lookup-result dl {
        grid-template-columns: 1fr;
        gap: .2rem;
      }

      .diploma-lookup-result dd {
        margin-bottom: .55rem;
      }
    }
  `;

  document.head.append(style);

  function show(message, state = "info") {
    result.hidden = false;
    result.className = "diploma-lookup-result is-" + state;
    result.replaceChildren();

    const heading = document.createElement("div");
    heading.className = "lookup-heading";

    const mark = document.createElement("span");
    mark.className = "lookup-mark";
    mark.textContent =
      state === "error" ? "!" :
      state === "warning" ? "⌕" : "…";

    const title = document.createElement("h3");
    title.textContent =
      state === "error" ? "Une erreur est survenue" :
      state === "warning" ? "Aucun résultat confirmé" :
      "Vérification en cours";

    heading.append(mark, title);

    const p = document.createElement("p");
    p.className = "lookup-lead";
    p.textContent = message;

    result.append(heading, p);
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[c]);
  }

  function displayValue(value) {
    if (value === null || value === undefined || value === "") {
      return "";
    }
    return String(value);
  }

  /*
   * NORMALISATION DES DONNÉES
   * BCC / GENIUS : place_of_birth ou birth_place
   * SCIPT GABON : birth_place
   */
  // 1990-02-05 -> 05/02/1990 (les autres valeurs sont conservées telles quelles)
  function fmtDate(v) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v || ""));
    return m ? `${m[3]}/${m[2]}/${m[1]}` : v;
  }

  function nationalityDisplay(d) {
    const fr = displayValue(d.nationality_fr);
    const en = displayValue(d.nationality_en);
    return fr && en ? `${fr} / ${en}` : fr || en || displayValue(d.nationality);
  }

  function normalizeDiploma(d) {
    return {
      ...d,
      date_of_birth: d.date_of_birth || "",
      birth_place: d.birth_place || d.place_of_birth || "",
      place_of_birth: d.place_of_birth || d.birth_place || "",
      study_duration: d.study_duration || "",
      student_id_number: d.student_id_number || d.student_id || "",
      certificate_issue_date:
        d.certificate_issue_date || d.issue_date || ""
    };
  }

  function showDiploma(rawDiploma) {
    const d = normalizeDiploma(rawDiploma);

    result.replaceChildren();
    result.hidden = false;
    result.className = "diploma-lookup-result is-success";

    const heading = document.createElement("div");
    heading.className = "lookup-heading";

    const mark = document.createElement("span");
    mark.className = "lookup-mark";
    mark.textContent = "✓";

    const title = document.createElement("h3");
    title.textContent = "Diplôme confirmé dans le registre";

    heading.append(mark, title);

    const lead = document.createElement("p");
    lead.className = "lookup-lead";
    lead.textContent =
      "La référence est marquée « valid » dans le registre consulté. Vous pouvez générer le certificat de vérification ci-dessous.";

    const dl = document.createElement("dl");

    const fields = [
      ["Établissement", d.institution],
      ["Titulaire", d.holder_name],
      ["Date de naissance", fmtDate(d.date_of_birth)],
      ["Lieu de naissance", d.birth_place || d.place_of_birth],
      ["Nationalité / Nationality", nationalityDisplay(d)],
      ["Matricule étudiant", d.student_id_number || d.student_id],
      ["Date de délivrance", fmtDate(d.certificate_issue_date || d.issue_date)],
      ["Formation", d.program],
      ["Durée des études", d.study_duration],
      ["Année", d.issue_year],
      ["Référence", d.serial_number]
    ];

    fields.forEach(([label, value]) => {
      const shown =
        value === null || value === undefined || value === "" ? "—" : value;

      const dt = document.createElement("dt");
      dt.textContent = label;

      const dd = document.createElement("dd");
      dd.textContent = String(shown);

      dl.append(dt, dd);
    });

    const note = document.createElement("p");
    note.className = "lookup-note";
    note.textContent =
      "Le certificat reprend les informations présentes dans le registre numérique. Les champs non renseignés restent à compléter par l'établissement émetteur.";

    const actions = document.createElement("div");
    actions.className = "lookup-actions";

    const pdf = document.createElement("button");
    pdf.type = "button";
    pdf.className = "lookup-copy";
    pdf.textContent = "Générer le certificat / PDF";

    pdf.addEventListener("click", () => {
      printCertificate(d, val("diploma-issuer"));
    });

    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "lookup-copy";
    copy.textContent = "Copier la référence";

    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(
          String(d.serial_number ?? "")
        );
        copy.textContent = "Référence copiée ✓";
      } catch {
        copy.textContent = "Copie non disponible";
      }
    });

    actions.append(pdf, copy);
    result.append(heading, lead, dl, note, actions);
  }

  // Script exécuté dans la fenêtre du certificat.
  const POPUP_SCRIPT = [
    'function imgFail(img, html) {',
    '  var alt = img.dataset && img.dataset.alt;',
    '  if (alt && img.src !== alt) { img.dataset.alt = ""; img.src = alt; return; }',
    '  img.parentNode.innerHTML = \'<div class="ph">\' + html + \'</div>\';',
    '}',
    'function fit() {',
    '  var w = 283 / 25.4 * 96 + 8;',
    '  var z = Math.min(1, window.innerWidth / w);',
    '  document.documentElement.style.setProperty("--z", z);',
    '}',
    'fit(); window.addEventListener("resize", fit);',
    'function whenImagesReady(done) {',
    '  var imgs = Array.prototype.slice.call(document.images);',
    '  var pending = imgs.filter(function (i) { return !i.complete; }).length;',
    '  var finished = false;',
    '  function end() { if (!finished) { finished = true; done(); } }',
    '  if (!pending) return end();',
    '  imgs.forEach(function (i) {',
    '    if (i.complete) return;',
    '    var fn = function () { if (--pending <= 0) end(); };',
    '    i.addEventListener("load", fn); i.addEventListener("error", fn);',
    '  });',
    '  setTimeout(end, 8000);',
    '}',
    'window.addEventListener("load", function () {',
    '  whenImagesReady(function () { setTimeout(function () { window.print(); }, 300); });',
    '});'
  ].join("\n");

  function printCertificate(rawDiploma, issuerCode) {
    const d = normalizeDiploma(rawDiploma);

    const CFG = window.SCIPT_CERT_CONFIG || {};
    const cfgIssuer = (CFG.issuers || {})[issuerCode] || {};
    const issuer = Object.assign({}, {
      name: d.institution || "Établissement émetteur",
      signatory: "",
      titleFr: "",
      titleEn: ""
    }, cfgIssuer);

    const verifyUrl = new URL(
      CFG.verifyBase || "verification-diplomes.html",
      window.location.href
    );

    verifyUrl.searchParams.set("issuer", issuerCode);
    verifyUrl.searchParams.set("serial", d.serial_number || "");

    // QR généré localement (assets/qr-local.js) ; le service externe n'est
    // qu'un secours si ce fichier n'est pas chargé.
    const qr = window.SciptQR
      ? window.SciptQR.svg(verifyUrl.href)
      : "https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=5&data=" +
        encodeURIComponent(verifyUrl.href);

    // La fenêtre du certificat est ouverte en about:blank : les chemins
    // relatifs ne fonctionnent pas, il faut des URL absolues.
    const absUrl = (p) => {
      if (!p) return "";
      try { return new URL(p, window.location.href).href; } catch (e) { return ""; }
    };

    const issuerLogo = absUrl(issuer.logo);
    const issuerSignature = absUrl(issuer.signature);

    // Liens Google Drive : version « miniature », plus fiable à l'affichage.
    const driveId = (u) => {
      const m = /drive\.google\.com\/(?:uc\?[^#]*?id=|file\/d\/|open\?id=|thumbnail\?id=)([\w-]+)/.exec(u);
      return m ? m[1] : "";
    };
    const rawPhoto = String(d.photo_url || d.student_photo_url || "").trim();
    const photoId = driveId(rawPhoto);
    // Affichage des liens photo exactement tels qu'enregistres dans les sources.
    // Un lien vers un montage peut afficher le document entier, pas un portrait individuel.
    const studentPhoto = photoId
      ? "https://drive.google.com/thumbnail?id=" + photoId + "&sz=w600"
      : rawPhoto;
    const photoFallback = photoId ? rawPhoto : "";

    const field = (label, value) =>
      `<div class="field">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(displayValue(value) || "—")}</strong>
      </div>`;

    const win = window.open("", "_blank");

    if (!win) {
      show(
        "Autorisez les fenêtres contextuelles pour générer le certificat.",
        "error"
      );
      return;
    }

    win.document.open();

    const tpl = (window.SCIPT_CERT_TEMPLATES || {})[issuer.template];

    if (tpl && typeof tpl.render === "function") {
      const dv = (v) => displayValue(v) || "—";
      win.document.write(tpl.render({
        issuer,
        d,
        esc: escapeHtml,
        script: POPUP_SCRIPT,
        urls: {
          logo: issuerLogo,
          signature: issuerSignature,
          photo: studentPhoto,
          photoFallback,
          qr
        },
        vals: {
          holder: displayValue(d.holder_name) || "",
          program: dv(d.program),
          serial: dv(d.serial_number),
          year: dv(d.issue_year),
          institution: dv(d.institution),
          dob: dv(fmtDate(d.date_of_birth)),
          pob: dv(d.birth_place || d.place_of_birth),
          nat: dv(nationalityDisplay(d)),
          duration: dv(d.study_duration),
          sid: dv(d.student_id_number || d.student_id),
          issued: dv(fmtDate(d.certificate_issue_date || d.issue_date))
        }
      }));
      win.document.close();
      return;
    }

    win.document.write(`<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Certificate of Authenticity — ${escapeHtml(d.serial_number)}</title>

<style>
@page { size:A4 landscape; margin:7mm; }

* { box-sizing:border-box; }

html,body {
  margin:0;
  padding:0;
  background:#fff;
  color:#17263b;
  font-family:Georgia,'Times New Roman',serif;
}

.sheet {
  position:relative;
  width:100%;
  height:196mm;
  max-height:196mm;
  overflow:hidden;
  margin:0 auto;
  padding:7mm 10mm;
  border:2px solid #b58a42;
  background:#fff;
  outline:1px solid #b58a42;
  outline-offset:-7px;
}

.top {
  display:grid;
  grid-template-columns:48mm 1fr 35mm;
  align-items:center;
  gap:6mm;
}

.logo {
  height:40mm;
  width:48mm;
  border:1px dashed #9aa5b2;
  display:flex;
  align-items:center;
  justify-content:center;
  text-align:center;
  padding:4mm;
  font:10px Arial;
  color:#687587;
}

.student-photo {
  width:32mm;
  height:36mm;
  border:1px dashed #9aa5b2;
  display:flex;
  align-items:center;
  justify-content:center;
  text-align:center;
  padding:2mm;
  font:9px Arial;
  color:#687587;
  background:#fafbfd;
  overflow:hidden;
}

.student-photo img {
  width:100%;
  height:100%;
  object-fit:cover;
}

.brand { text-align:center; }

.brand h1 {
  font-size:23px;
  letter-spacing:2px;
  margin:0;
  color:#18324e;
}

.brand p {
  margin:4px 0;
  font:11px Arial;
  letter-spacing:1px;
}

.rule {
  height:2px;
  background:#b58a42;
  margin:4mm 0 3mm;
}

.heading { text-align:center; }

.heading h2 {
  font-size:25px;
  margin:0 0 2mm;
  color:#18324e;
}

.heading p {
  font:12px Arial;
  letter-spacing:1.5px;
  margin:0;
}

.intro {
  text-align:center;
  font-size:11px;
  margin:2mm 0 1mm;
}

.holder {
  text-align:center;
  font-size:21px;
  font-weight:bold;
  color:#8a6429;
  margin:2mm 0 6mm;
}

.fields {
  display:grid;
  grid-template-columns:1fr 1fr 1fr;
  gap:2mm 6mm;
}

.field {
  border-bottom:1px solid #cbd2dc;
  padding:1mm 0;
  min-height:10mm;
  overflow-wrap:anywhere;
}

.field span {
  display:block;
  font:10px Arial;
  text-transform:uppercase;
  color:#667386;
  letter-spacing:.5px;
  margin-bottom:2mm;
}

.field strong { font-size:13px; }

.bottom {
  display:grid;
  grid-template-columns:1fr 35mm 1fr;
  align-items:end;
  gap:6mm;
  margin-top:4mm;
}

.sign {
  text-align:center;
  border-top:1px solid #788596;
  padding-top:2mm;
  font:11px Arial;
}

.sign strong {
  display:block;
  font:bold 12px Georgia;
  margin-bottom:1mm;
}

.signcol { display:flex; flex-direction:column; }

.sigbox {
  height:12mm;
  display:flex;
  align-items:flex-end;
  justify-content:center;
}

.sigbox img {
  max-height:12mm;
  max-width:100%;
  object-fit:contain;
}

.qr {
  text-align:center;
  font:9px Arial;
}

.qr img {
  width:22mm;
  height:22mm;
  display:block;
  margin:auto;
}

.seal {
  height:17mm;
  border:1px dashed #9aa5b2;
  text-align:center;
  padding:7mm 2mm;
  font:10px Arial;
  color:#687587;
}

.foot {
  text-align:center;
  font:8px Arial;
  color:#657286;
  margin-top:2mm;
}

@media print {
  html,body {
    width:auto;
    height:auto;
    background:#fff;
  }

  .sheet {
    width:100%;
    height:196mm;
    max-height:196mm;
    margin:0;
    padding:7mm 10mm;
    box-shadow:none;
    break-inside:avoid;
    page-break-inside:avoid;
  }

  button { display:none; }
}
</style>
</head>

<body>
<main class="sheet">

  <div class="top">
    <div class="logo">
      ${
        issuerLogo
          ? `<img src="${escapeHtml(issuerLogo)}"
              alt="Logo officiel"
              style="width:100%;height:100%;max-width:none;max-height:none;object-fit:contain;padding:1mm"
              onerror="imgFail(this,'EMPLACEMENT RÉSERVÉ<br>LOGO OFFICIEL')">`
          : "EMPLACEMENT RÉSERVÉ<br>LOGO OFFICIEL DE L’ÉTABLISSEMENT"
      }
    </div>

    <div class="brand">
      <h1>${escapeHtml(issuer.name)}</h1>
      <p>CERTIFICATE OF AUTHENTICITY · CERTIFICAT D’AUTHENTICITÉ</p>
    </div>

    <div class="student-photo">
      ${
        studentPhoto
          ? `<img src="${escapeHtml(studentPhoto)}" alt="Photo du titulaire"
              referrerpolicy="no-referrer"
              data-alt="${escapeHtml(photoFallback)}"
              onerror="imgFail(this,'PHOTO NON DISPONIBLE<br>PHOTO NOT AVAILABLE')">`
          : "PHOTO NON DISPONIBLE<br>PHOTO NOT AVAILABLE"
      }
    </div>
  </div>

  <div class="rule"></div>

  <div class="heading">
    <h2>CERTIFICAT D’AUTHENTICITÉ</h2>
    <p>CERTIFICATE OF AUTHENTICITY</p>
  </div>

  <p class="intro">
    Je soussigné(e), ${escapeHtml(
      issuer.signatory || "représentant(e) habilité(e) de " + issuer.name
    )},
    certifie l’authenticité du présent diplôme.<br>
    I, the undersigned, hereby certify the authenticity of this diploma.
  </p>

  <p class="intro">Il est attesté que / This is to certify that</p>

  <div class="holder">
    ${escapeHtml(d.holder_name || "NOM DU TITULAIRE")}
  </div>

  <div class="fields">
    ${field("Diplôme / Award", d.program)}
    ${field("Référence / Serial number", d.serial_number)}
    ${field("Année de délivrance / Year", d.issue_year)}
    ${field("Établissement / Institution", d.institution || issuer.name)}
    ${field("Date de naissance / Date of birth", fmtDate(d.date_of_birth))}
    ${field("Lieu de naissance / Place of birth", d.birth_place)}
    ${field("Nationalité / Nationality", nationalityDisplay(d))}
    ${field("Durée des études / Study duration", d.study_duration)}
    ${field("Matricule étudiant / Student ID", d.student_id_number)}
    ${field("Date de délivrance / Issue date", fmtDate(d.certificate_issue_date))}
  </div>

  <div class="bottom">
    <div class="signcol">
    <div class="sigbox">${
      issuerSignature
        ? `<img src="${escapeHtml(issuerSignature)}" alt="Signature"
            onerror="this.remove()">`
        : ""
    }</div>
    <div class="sign">
      <strong>${escapeHtml(issuer.signatory)}</strong>
      ${escapeHtml(issuer.titleFr)}<br>
      ${escapeHtml(issuer.titleEn)}<br>
      Signature
    </div>
    </div>

    <div class="qr">
      <img src="${qr}" alt="QR code de vérification">
      SCAN TO VERIFY<br>SCANNER POUR VÉRIFIER
    </div>

    <div class="sign">
      <div class="seal">CACHET OFFICIEL<br>À APPOSER</div>
      <strong>Signature & cachet</strong>
      Signature and official stamp
    </div>
  </div>

  <div class="foot">
    Document généré à partir du registre numérique de l’établissement.
    Les champs non renseignés sont laissés vierges et doivent être complétés par l’émetteur.<br>
    Generated from the institution’s digital register.
  </div>

  <div style="text-align:center;margin-top:5mm">
    <button onclick="window.print()">Imprimer / Enregistrer en PDF</button>
  </div>

</main>

<script>${POPUP_SCRIPT}<\/script>

</body>
</html>`);

    win.document.close();
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();

    if (!form.reportValidity()) return;

    const serial = val("diploma-number");
    const issuer = val("diploma-issuer");

    if (!/^[A-Za-z0-9][A-Za-z0-9 ./_-]{2,99}$/.test(serial)) {
      show("Vérifiez le numéro de série saisi.", "error");
      return;
    }

    if (!config.supabaseUrl || !config.anonKey) {
      show("Le service sécurisé doit encore être configuré.", "warning");
      return;
    }

    submit.disabled = true;
    submit.textContent = "Recherche en cours…";

    show("Recherche dans le registre sécurisé…");

    try {
      const response = await fetch(
        config.supabaseUrl.replace(/\/$/, "") +
          "/functions/v1/verify-diploma",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": config.anonKey
          },
          body: JSON.stringify({
            issuer,
            serial_number: serial
          })
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || "Service momentanément indisponible."
        );
      }

      if (!data.found || !data.diploma) {
        show(
          "Aucun diplôme correspondant à cette référence. Vérifiez la saisie ou adressez une demande au service des examens.",
          "warning"
        );
        return;
      }

      showDiploma(data.diploma);

    } catch (err) {
      show(
        err.message || "Impossible de joindre le service de vérification.",
        "error"
      );

    } finally {
      submit.disabled = false;
      submit.textContent = "Vérifier le diplôme →";
    }
  });

  (function autoVerifyFromUrl() {
    try {
      const q = new URLSearchParams(window.location.search);
      const iss = (q.get("issuer") || "").toUpperCase();
      const ser = q.get("serial") || "";
      const sel = document.getElementById("diploma-issuer");
      const inp = document.getElementById("diploma-number");
      if (!iss || !ser || !sel || !inp) return;
      if (![...sel.options].some((o) => o.value === iss)) return;
      sel.value = iss;
      inp.value = ser;
      if (form.requestSubmit) form.requestSubmit();
      else form.dispatchEvent(new Event("submit", { cancelable: true }));
    } catch (e) { /* sans effet : le formulaire reste utilisable à la main */ }
  })();

  document
    .getElementById("diploma-manual-request")
    ?.addEventListener("click", () => {

      const serial = val("diploma-number");

      const body = [
        "Bonjour,",
        "Je souhaite demander une vérification manuelle.",
        "",
        "Registre : " + val("diploma-issuer"),
        "Référence : " + serial,
        "Formation : " + val("diploma-program"),
        "Année : " + val("diploma-year"),
        "E-mail : " + val("diploma-email"),
        "Précisions : " + val("diploma-message")
      ].join("\n");

      location.href =
        "mailto:office.examens@sciptinternational.com?subject=" +
        encodeURIComponent("Vérification de diplôme — " + serial) +
        "&body=" + encodeURIComponent(body);
    });

})();
