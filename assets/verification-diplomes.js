(() => {
  const form = document.getElementById("diploma-form");
  if (!form) return;

  const config = window.SCIPT_DIPLOMA_CONFIG || {};
  const result = document.getElementById("diploma-result");
  const submit = form.querySelector('[type="submit"]');
  const val = id => (document.getElementById(id)?.value || "").trim();

  const ISSUERS = {
    GENIUS: {
      name: "GENIUS COLLEGE OF HEALTH SCIENCES, BUSINESS AND TECHNOLOGY",
      signatory: "NGOMA MAVBUTO, PhD",
      titleFr: "Directeur académique",
      titleEn: "Academic Director"
    },
    BCC: {
      name: "BLESSED COSMOPOLITAN COLLEGE UK",
      signatory: "ADRIAN ESTES, PhD",
      titleFr: "Responsable académique",
      titleEn: "Academic Program"
    },
    MJB: {
      name: "MJB MANAGEMENT & INTEGRATED SERVICES",
      signatory: "THOMAS SAMSON, PhD",
      titleFr: "Registraire académique",
      titleEn: "Academic Registrar"
    },
    SCIPT_GABON: {
      name: "SCIPT INTERNATIONAL",
      signatory: "Dr Arland Narcisse ELLA",
      titleFr: "Directeur du SCIPT INTERNATIONAL",
      titleEn: "Director of SCIPT INTERNATIONAL"
    }
  };

  const style = document.createElement("style");
  style.textContent = `
    .diploma-lookup-result{margin-top:1.5rem;padding:clamp(1.1rem,3vw,1.7rem);border:1px solid #d9e2ec;border-radius:18px;background:#fff;color:#20344c;box-shadow:0 12px 34px rgba(20,42,68,.08)}
    .diploma-lookup-result .lookup-heading{display:flex;align-items:center;gap:.85rem;margin-bottom:.55rem}
    .diploma-lookup-result .lookup-mark{display:grid;place-items:center;flex:0 0 42px;width:42px;height:42px;border-radius:50%;font-size:1.2rem}
    .diploma-lookup-result h3{margin:0;font-size:1.18rem;font-weight:800}
    .diploma-lookup-result .lookup-lead{margin:.35rem 0 1.1rem;color:#52647a}
    .diploma-lookup-result dl{display:grid;grid-template-columns:minmax(115px,.65fr) 1.35fr;gap:.7rem 1rem;margin:1rem 0 1.2rem;padding:1rem;border-radius:12px;background:#f6f8fb}
    .diploma-lookup-result dt{font-size:.9rem;font-weight:700;color:#52647a}
    .diploma-lookup-result dd{margin:0;font-weight:600;overflow-wrap:anywhere}
    .diploma-lookup-result .lookup-note{margin:1rem 0 0;padding-top:1rem;border-top:1px solid #e4eaf0;font-size:.9rem;line-height:1.6;color:#52647a}
    .diploma-lookup-result .lookup-actions{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1rem}
    .diploma-lookup-result .lookup-copy{border:1px solid #c7d2df;border-radius:999px;padding:.55rem .95rem;background:#fff;color:#20344c;font-weight:700;cursor:pointer}
    .diploma-lookup-result.is-success{border-color:#9bc9aa;background:linear-gradient(145deg,#f4fbf6,#fff 70%)}
    .diploma-lookup-result.is-success .lookup-mark{background:#dff3e5;color:#18733b}
    .diploma-lookup-result.is-warning{border-color:#e6d29a;background:#fffaf0}
    .diploma-lookup-result.is-warning .lookup-mark{background:#fff0c7;color:#8a5a00}
    .diploma-lookup-result.is-error{border-color:#e4b0b0;background:#fff5f5}
    .diploma-lookup-result.is-error .lookup-mark{background:#ffe2e2;color:#a12626}
    @media(max-width:480px){.diploma-lookup-result dl{grid-template-columns:1fr;gap:.2rem}.diploma-lookup-result dd{margin-bottom:.55rem}}
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
    mark.textContent = state === "error" ? "!" : state === "warning" ? "⌕" : "…";

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
    if (value === null || value === undefined || value === "") return "";
    return String(value);
  }

  function showDiploma(d) {
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
      ["Date de naissance", d.date_of_birth],
      ["Lieu de naissance", d.place_of_birth || d.birth_place],
      ["Formation", d.program],
      ["Durée des études", d.study_duration],
      ["Année", d.issue_year],
      ["Référence", d.serial_number]
    ];

    fields.forEach(([label, value]) => {
      if (value === null || value === undefined || value === "") return;

      const dt = document.createElement("dt");
      dt.textContent = label;

      const dd = document.createElement("dd");
      dd.textContent = String(value);

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
    pdf.addEventListener("click", () => printCertificate(d, val("diploma-issuer")));

    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "lookup-copy";
    copy.textContent = "Copier la référence";
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(String(d.serial_number ?? ""));
        copy.textContent = "Référence copiée ✓";
      } catch {
        copy.textContent = "Copie non disponible";
      }
    });

    actions.append(pdf, copy);
    result.append(heading, lead, dl, note, actions);
  }

  function printCertificate(d, issuerCode) {
    const issuer = ISSUERS[issuerCode] || {
      name: d.institution || "Établissement émetteur",
      signatory: "",
      titleFr: "",
      titleEn: ""
    };

    const verifyUrl = new URL("verification-diplomes.html", window.location.href);
    verifyUrl.searchParams.set("issuer", issuerCode);
    verifyUrl.searchParams.set("serial", d.serial_number || "");

    const qr =
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=5&data=" +
      encodeURIComponent(verifyUrl.href);

    const issuerLogo = d.institution_logo_url || d.issuer_logo_url || d.logo_url || "";
    const studentPhoto = d.photo_url || d.student_photo_url || "";

    const field = (label, value) =>
      `<div class="field"><span>${escapeHtml(label)}</span><strong>${escapeHtml(displayValue(value) || "—")}</strong></div>`;

    const win = window.open("", "_blank");

    if (!win) {
      show("Autorisez les fenêtres contextuelles pour générer le certificat.", "error");
      return;
    }

    win.document.open();

    win.document.write(`<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Certificate of Authenticity — ${escapeHtml(d.serial_number)}</title>
<style>
@page{size:A4 landscape;margin:7mm}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:#fff;color:#17263b;font-family:Georgia,'Times New Roman',serif}
.sheet{position:relative;width:100%;height:196mm;max-height:196mm;overflow:hidden;margin:0 auto;padding:7mm 10mm;border:2px solid #b58a42;background:#fff;outline:1px solid #b58a42;outline-offset:-7px}
.top{display:grid;grid-template-columns:32mm 1fr 30mm;align-items:center;gap:6mm}
.logo{height:25mm;border:1px dashed #9aa5b2;display:flex;align-items:center;justify-content:center;text-align:center;padding:4mm;font:10px Arial;color:#687587}
.student-photo{width:27mm;height:30mm;border:1px dashed #9aa5b2;display:flex;align-items:center;justify-content:center;text-align:center;padding:2mm;font:9px Arial;color:#687587;background:#fafbfd;overflow:hidden}
.student-photo img{width:100%;height:100%;object-fit:cover}
.brand{text-align:center}
.brand h1{font-size:23px;letter-spacing:2px;margin:0;color:#18324e}
.brand p{margin:4px 0;font:11px Arial;letter-spacing:1px}
.rule{height:2px;background:#b58a42;margin:4mm 0 3mm}
.heading{text-align:center}
.heading h2{font-size:25px;margin:0 0 2mm;color:#18324e}
.heading p{font:12px Arial;letter-spacing:1.5px;margin:0}
.intro{text-align:center;font-size:11px;margin:2mm 0 1mm}
.holder{text-align:center;font-size:21px;font-weight:bold;color:#8a6429;margin:2mm 0 6mm}
.fields{display:grid;grid-template-columns:1fr 1fr 1fr;gap:2mm 6mm}
.field{border-bottom:1px solid #cbd2dc;padding:1mm 0;min-height:10mm;overflow-wrap:anywhere}
.field span{display:block;font:10px Arial;text-transform:uppercase;color:#667386;letter-spacing:.5px;margin-bottom:2mm}
.field strong{font-size:13px}
.bottom{display:grid;grid-template-columns:1fr 30mm 1fr;align-items:end;gap:6mm;margin-top:4mm}
.sign{text-align:center;border-top:1px solid #788596;padding-top:2mm;font:11px Arial}
.sign strong{display:block;font:bold 12px Georgia;margin-bottom:1mm}
.qr{text-align:center;font:9px Arial}
.qr img{width:22mm;height:22mm;display:block;margin:auto}
.seal{height:17mm;border:1px dashed #9aa5b2;text-align:center;padding:7mm 2mm;font:10px Arial;color:#687587}
.foot{text-align:center;font:8px Arial;color:#657286;margin-top:2mm}
@media print{html,body{width:297mm;height:210mm;background:#fff}.sheet{width:100%;height:196mm;max-height:196mm;margin:0;padding:7mm 10mm;box-shadow:none;break-inside:avoid;page-break-inside:avoid}button{display:none}}
</style>
</head>
<body>
<main class="sheet">
  <div class="top">
    <div class="logo">
      ${issuerLogo
        ? `<img src="${escapeHtml(issuerLogo)}" alt="Logo officiel" style="max-width:100%;max-height:100%;object-fit:contain">`
        : "EMPLACEMENT RÉSERVÉ<br>LOGO OFFICIEL DE L’ÉTABLISSEMENT"}
    </div>
    <div class="brand">
      <h1>${escapeHtml(issuer.name)}</h1>
      <p>CERTIFICATE OF AUTHENTICITY · CERTIFICAT D’AUTHENTICITÉ</p>
    </div>
    <div class="student-photo">
      ${studentPhoto
        ? `<img src="${escapeHtml(studentPhoto)}" alt="Photo du titulaire">`
        : "PHOTO DE L’ÉTUDIANT<br>À INSÉRER"}
    </div>
  </div>

  <div class="rule"></div>

  <div class="heading">
    <h2>CERTIFICAT D’AUTHENTICITÉ</h2>
    <p>CERTIFICATE OF AUTHENTICITY</p>
  </div>

  <p class="intro">
    Je soussigné(e), ${escapeHtml(issuer.signatory || "représentant(e) habilité(e) de " + issuer.name)},
    certifie l’authenticité du présent diplôme.<br>
    I, the undersigned, hereby certify the authenticity of this diploma.
  </p>

  <p class="intro">Il est attesté que / This is to certify that</p>

  <div class="holder">${escapeHtml(d.holder_name || "NOM DU TITULAIRE")}</div>

  <div class="fields">
    ${field("Diplôme / Award", d.program)}
    ${field("Référence / Serial number", d.serial_number)}
    ${field("Année de délivrance / Year", d.issue_year)}
    ${field("Établissement / Institution", d.institution || issuer.name)}
    ${field("Date de naissance / Date of birth", d.date_of_birth)}
    ${field("Lieu de naissance / Place of birth", d.place_of_birth || d.birth_place)}
    ${field("Nationalité / Nationality", d.nationality)}
    ${field("Durée des études / Study duration", d.study_duration)}
    ${field("Matricule étudiant / Student ID", d.student_id || d.student_id_number)}
    ${field("Date de délivrance / Issue date", d.issue_date || d.certificate_issue_date)}
  </div>

  <div class="bottom">
    <div class="sign">
      <strong>${escapeHtml(issuer.signatory)}</strong>
      ${escapeHtml(issuer.titleFr)}<br>
      ${escapeHtml(issuer.titleEn)}<br>
      Signature
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

<script>
window.addEventListener("load", () => setTimeout(() => window.print(), 700));
</script>
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
        config.supabaseUrl.replace(/\/$/, "") + "/functions/v1/verify-diploma",
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
        throw new Error(data.error || "Service momentanément indisponible.");
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
      show(err.message || "Impossible de joindre le service de vérification.", "error");
    } finally {
      submit.disabled = false;
      submit.textContent = "Vérifier le diplôme →";
    }
  });

  document.getElementById("diploma-manual-request")?.addEventListener("click", () => {
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
