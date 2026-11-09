/*
 * SCIPT INTERNATIONAL — modèles de certificats d'authenticité (A4 paysage).
 * Quatre identités graphiques distinctes, chacune tirée du logo officiel :
 *   bcc    : prestige académique britannique (indigo / or)
 *   genius : moderne et géométrique (rouge / bleu acier)
 *   mjb    : institutionnel structuré (vert / rouge)
 *   scipt  : médaillon bronze (bronze / rouge / or clair)
 *
 * Chaque modèle reçoit un contexte `ctx` préparé par verification-diplomes.js
 * (aucune donnée n'est lue ici) et renvoie le document HTML complet.
 */
(function () {
  "use strict";

  const LABELS = {
    program:     ["Diplôme", "Award"],
    serial:      ["Référence", "Serial number"],
    year:        ["Année de délivrance", "Year"],
    institution: ["Établissement", "Institution"],
    dob:         ["Date de naissance", "Date of birth"],
    pob:         ["Lieu de naissance", "Place of birth"],
    nat:         ["Nationalité", "Nationality"],
    duration:    ["Durée des études", "Study duration"],
    sid:         ["Matricule étudiant", "Student ID"],
    issued:      ["Date de délivrance", "Issue date"]
  };

  /* ---------- Styles communs (A4 paysage, couleurs conservées à l'impression) ---------- */
  const COMMON_CSS = `
@page { size:A4 landscape; margin:7mm; }
* { box-sizing:border-box; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
html,body { margin:0; padding:0; }
body { background:#e8ebef; }
.stage { width:283mm; margin:0 auto; }
.sheet { position:relative; width:283mm; height:195mm; overflow:hidden; }
.bar { text-align:center; padding:12px; font:14px Arial,sans-serif; }
.bar button { padding:10px 20px; border:0; border-radius:8px; background:#17263b; color:#fff; font-size:14px; cursor:pointer; }
@media screen {
  body { padding:10px 0; }
  .stage { zoom:var(--z,1); box-shadow:0 6px 26px rgba(0,0,0,.18); }
}
@media print {
  body { background:#fff; padding:0; }
  .stage { zoom:1 !important; box-shadow:none; }
  .bar { display:none; }
}
.logo img, .photo img, .logocard img { display:block; max-width:100%; max-height:100%; object-fit:contain; margin:0 auto; }
.photo img { width:100%; height:100%; object-fit:cover; }
.ph { display:flex; align-items:center; justify-content:center; text-align:center; width:100%; height:100%;
      font:600 6.2pt/1.35 Arial,sans-serif; letter-spacing:.06em; color:#76808f; border:.3mm dashed #aab3bf; padding:2mm; }
.grid { display:grid; gap:3mm 6mm; }
.f span { display:block; font-size:6.3pt; letter-spacing:.08em; text-transform:uppercase; }
.f strong { display:block; font-size:10pt; margin-top:.8mm; padding-bottom:1mm; min-height:5.2mm; overflow-wrap:anywhere; }
.s2 { grid-column:span 2; }
.signcol { display:flex; flex-direction:column; justify-content:flex-end; }
.sigbox { height:13mm; display:flex; align-items:flex-end; justify-content:center; }
.sigbox img { max-height:13mm; max-width:100%; object-fit:contain; }
.sline { border-top:.3mm solid var(--primary); padding-top:1.4mm; text-align:center; font-size:7.6pt; line-height:1.3; }
.sline b { display:block; font-size:9pt; }
.qrbox { text-align:center; font:600 6pt/1.25 Arial,sans-serif; letter-spacing:.06em; }
.qrbox img { width:30mm; height:30mm; display:block; margin:0 auto 1mm; }
.seal { justify-self:center; width:27mm; height:27mm; border:.35mm dashed var(--secondary); border-radius:50%;
        display:flex; align-items:center; justify-content:center; text-align:center; padding:3mm;
        font:600 5.8pt/1.3 Arial,sans-serif; letter-spacing:.06em; color:#6b7686; }
.note { font:5.8pt/1.3 Arial,sans-serif; color:#5b6675; text-align:center; }
`;

  /* ---------- Éléments partagés ---------- */
  function parts(ctx) {
    const E = ctx.esc, I = ctx.issuer, U = ctx.urls, V = ctx.vals;

    const field = (key, cls) => {
      const L = LABELS[key];
      return `<div class="f ${cls || ""}"><span>${L[0]} / ${L[1]}</span><strong>${E(V[key])}</strong></div>`;
    };

    const rowStacked = (key) => {
      const L = LABELS[key];
      return `<div class="pf"><span>${L[0]}<br><i>${L[1]}</i></span><strong>${E(V[key])}</strong></div>`;
    };

    const logo = U.logo
      ? `<img src="${E(U.logo)}" alt="Logo officiel" onerror="imgFail(this,'LOGO OFFICIEL<br>OFFICIAL LOGO')">`
      : `<div class="ph">EMPLACEMENT RÉSERVÉ<br>LOGO OFFICIEL</div>`;

    const photo = U.photo
      ? `<img src="${E(U.photo)}" alt="Photo du titulaire" referrerpolicy="no-referrer"
           data-alt="${E(U.photoFallback || "")}"
           onerror="imgFail(this,'PHOTO NON DISPONIBLE<br>PHOTO NOT AVAILABLE')">`
      : `<div class="ph">PHOTO NON DISPONIBLE<br>PHOTO NOT AVAILABLE</div>`;

    const sig = U.signature
      ? `<img src="${E(U.signature)}" alt="Signature" onerror="this.remove()">`
      : "";

    const signBlock = `<div class="signcol"><div class="sigbox">${sig}</div>
      <div class="sline"><b>${E(I.signatory)}</b>${E(I.titleFr)}<br>${E(I.titleEn)}</div></div>`;

    const qr = `<div class="qrbox"><img src="${E(U.qr)}" alt="QR code de vérification">SCAN TO VERIFY<br>SCANNER POUR VÉRIFIER</div>`;

    const seal = `<div class="seal">CACHET OFFICIEL<br>OFFICIAL STAMP</div>`;

    // Lien fiable vers le document source lorsque Google Drive ne fournit pas de miniature.
    const photoSource = U.photoSource
      ? `<br><a href="${E(U.photoSource)}" target="_blank" rel="noopener noreferrer">Consulter le document photo fourni / View source photo document</a>`
      : "";
    const note = `<div class="note">Document généré à partir du registre numérique de l’établissement. Les champs non renseignés sont laissés vierges et doivent être complétés par l’établissement émetteur.<br>Generated from the institution’s digital register. Unfilled fields are left blank and must be completed by the issuing institution.${photoSource}</div>`;

    // Texte de certification (le titre n'est pas répété s'il contient déjà le nom).
    const inFr = I.titleFr.indexOf(I.name) >= 0 ? "" : " de " + I.name;
    const inEn = I.titleEn.indexOf(I.name) >= 0 ? "" : " of " + I.name;
    const certFr = `Je soussigné(e), <b>${E(I.signatory)}</b>, ${E(I.titleFr)}${E(inFr)}, certifie que le diplôme ci-dessous est authentique et enregistré dans le registre numérique de l’établissement.`;
    const certEn = `I, <b>${E(I.signatory)}</b>, ${E(I.titleEn)}${E(inEn)}, hereby certify that the diploma below is authentic and recorded in the institution’s digital register.`;
    const cert = `<p class="cert">${certFr}<br><span>${certEn}</span></p>`;

    return { field, rowStacked, logo, photo, signBlock, qr, seal, note, cert };
  }

  function page(ctx, cls, css, body) {
    const p = ctx.issuer.palette || {};
    const vars = `--primary:${p.primary};--secondary:${p.secondary};--accent:${p.accent};--ink:${p.ink};--tint:${p.tint};--paper:${p.paper};`;
    return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Certificate of Authenticity — ${ctx.esc(ctx.d.serial_number)}</title>
<style>:root{${vars}}${COMMON_CSS}${css}</style></head>
<body><div class="stage"><main class="sheet ${cls}">${body}</main></div>
<div class="bar"><button type="button" onclick="window.print()">Imprimer / Enregistrer en PDF</button></div>
<script>${ctx.script}<\/script></body></html>`;
  }

  /* =========================================================
     BCC — prestige académique britannique (indigo / or)
     ========================================================= */
  const BCC_CSS = `
.t-bcc { background:var(--paper); color:var(--ink); font-family:Georgia,"Times New Roman",serif; border:1.4mm double var(--accent); }
.t-bcc::before { content:""; position:absolute; inset:2.6mm; border:.3mm solid var(--primary); }
.t-bcc .dm { position:absolute; width:3mm; height:3mm; background:var(--secondary); transform:rotate(45deg); }
.t-bcc .dm.a { top:1.1mm; left:1.1mm; } .t-bcc .dm.b { top:1.1mm; right:1.1mm; }
.t-bcc .dm.c { bottom:1.1mm; left:1.1mm; } .t-bcc .dm.d { bottom:1.1mm; right:1.1mm; }
.t-bcc .in { position:absolute; inset:7mm 11mm 6mm; display:flex; flex-direction:column; justify-content:space-between; }
.t-bcc .hd { display:grid; grid-template-columns:54mm 1fr 34mm; gap:6mm; align-items:center; }
.t-bcc .logo { height:52mm; }
.t-bcc .ttl { text-align:center; }
.t-bcc .inst { font-size:12.5pt; letter-spacing:.2em; color:var(--primary); font-weight:700; }
.t-bcc .orn { display:flex; align-items:center; gap:2.5mm; width:70%; margin:1.8mm auto; }
.t-bcc .orn b { flex:1; height:.3mm; background:var(--secondary); }
.t-bcc .orn i { width:2mm; height:2mm; background:var(--secondary); transform:rotate(45deg); }
.t-bcc h2 { margin:0; font-size:21pt; letter-spacing:.05em; color:var(--primary); }
.t-bcc .sub { font-size:8.5pt; letter-spacing:.28em; color:var(--accent); margin-top:.8mm; }
.t-bcc .cert { font-size:8.2pt; line-height:1.4; margin:2.4mm auto 1.6mm; max-width:152mm; }
.t-bcc .cert span { font-style:italic; }
.t-bcc .is { font-size:7pt; letter-spacing:.14em; color:var(--accent); text-transform:uppercase; }
.t-bcc .holder { font-size:21pt; font-weight:700; color:var(--accent); line-height:1.15; }
.t-bcc .photo { width:32mm; height:40mm; justify-self:end; border:.4mm solid var(--accent); padding:1mm; background:#fff; outline:.3mm solid var(--secondary); outline-offset:1mm; }
.t-bcc .grid { grid-template-columns:repeat(4,1fr); gap:4.5mm 6mm; }
.t-bcc .f strong { font-size:10.6pt; }
.t-bcc .f span { color:var(--accent); }
.t-bcc .f strong { border-bottom:.25mm solid var(--secondary); color:var(--ink); }
.t-bcc .ft { display:grid; grid-template-columns:1fr 38mm 1fr; gap:8mm; align-items:end; }
.t-bcc .sline { border-color:var(--primary); }
`;
  function bcc(ctx) {
    const P = parts(ctx), E = ctx.esc;
    const body = `<i class="dm a"></i><i class="dm b"></i><i class="dm c"></i><i class="dm d"></i>
<div class="in">
  <header class="hd">
    <div class="logo">${P.logo}</div>
    <div class="ttl">
      <div class="inst">${E(ctx.issuer.name)}</div>
      <div class="orn"><b></b><i></i><b></b></div>
      <h2>CERTIFICAT D’AUTHENTICITÉ</h2>
      <div class="sub">CERTIFICATE OF AUTHENTICITY</div>
      ${P.cert}
      <div class="is">Il est attesté que · This is to certify that</div>
      <div class="holder">${E(ctx.vals.holder)}</div>
    </div>
    <div class="photo">${P.photo}</div>
  </header>
  <section class="grid">
    ${P.field("program", "s2")}${P.field("serial")}${P.field("duration")}
    ${P.field("institution", "s2")}${P.field("year")}${P.field("issued")}
    ${P.field("dob")}${P.field("pob")}${P.field("nat")}${P.field("sid")}
  </section>
  <footer class="ft">${P.signBlock}${P.qr}<div>${P.seal}</div></footer>
  ${P.note}
</div>`;
    return page(ctx, "t-bcc", BCC_CSS, body);
  }

  /* =========================================================
     GENIUS — innovation et modernité (rouge / bleu acier / bleu nuit)
     ========================================================= */
  const GENIUS_CSS = `
.t-gen { display:grid; grid-template-columns:62mm 1fr; background:#fff; color:var(--ink); font-family:"Segoe UI","Helvetica Neue",Arial,sans-serif; }
.t-gen .side { position:relative; overflow:hidden; display:flex; flex-direction:column; align-items:center; gap:5mm; padding:8mm 6mm;
  background:linear-gradient(165deg,var(--primary) 0%,#1d4768 58%,var(--secondary) 100%); }
.t-gen .side::before { content:""; position:absolute; top:-20mm; right:-20mm; width:46mm; height:46mm; background:var(--accent); transform:rotate(45deg); }
.t-gen .side::after { content:""; position:absolute; left:-22mm; bottom:-22mm; width:52mm; height:52mm; border:3mm solid rgba(255,255,255,.18); transform:rotate(45deg); }
.t-gen .logocard { position:relative; z-index:1; width:50mm; height:46mm; padding:3mm; background:#fff; border-radius:3mm; display:flex; align-items:center; justify-content:center; }
.t-gen .photo { position:relative; z-index:1; width:32mm; height:40mm; border:1.2mm solid var(--accent); background:#fff; }
.t-gen .qrcard { position:relative; z-index:1; margin-top:auto; width:40mm; padding:2.5mm; background:#fff; border-radius:3mm; color:var(--ink); }
.t-gen .qrcard img { width:31mm; height:31mm; }
.t-gen .bd { padding:8mm 11mm 5mm 10mm; display:flex; flex-direction:column; justify-content:space-between; }
.t-gen .kick { font-size:6.6pt; font-weight:700; letter-spacing:.2em; color:var(--accent); }
.t-gen .inst { font-size:12.5pt; font-weight:800; letter-spacing:.02em; color:var(--primary); margin-top:1mm; }
.t-gen h2 { margin:2.5mm 0 0; font-size:23pt; font-weight:800; letter-spacing:-.01em; color:var(--primary); line-height:1.1; }
.t-gen h2::after { content:""; display:block; width:24mm; height:1.2mm; margin-top:2mm; background:linear-gradient(90deg,var(--accent) 60%,var(--secondary) 60%); }
.t-gen .cert { font-size:8pt; line-height:1.4; margin:2.6mm 0 1mm; }
.t-gen .cert span { color:#4a5a6a; }
.t-gen .holder { font-size:21pt; font-weight:800; color:var(--accent); line-height:1.15; margin-top:1mm; }
.t-gen .grid { grid-template-columns:repeat(3,1fr); gap:2.6mm 4mm; }
.t-gen .f { background:var(--tint); border-left:1.2mm solid var(--secondary); padding:1.5mm 2.5mm; }
.t-gen .f span { color:var(--secondary); font-weight:700; }
.t-gen .f strong { padding-bottom:0; min-height:4.8mm; color:var(--ink); }
.t-gen .ft { display:grid; grid-template-columns:1fr 36mm; gap:10mm; align-items:end; }
.t-gen .sline { border-color:var(--accent); }
`;
  function genius(ctx) {
    const P = parts(ctx), E = ctx.esc;
    const body = `<aside class="side">
  <div class="logocard">${P.logo}</div>
  <div class="photo">${P.photo}</div>
  <div class="qrcard">${P.qr}</div>
</aside>
<section class="bd">
  <div>
    <div class="kick">CERTIFICATE OF AUTHENTICITY · CERTIFICAT D’AUTHENTICITÉ</div>
    <div class="inst">${E(ctx.issuer.name)}</div>
    <h2>CERTIFICAT D’AUTHENTICITÉ</h2>
    ${P.cert}
    <div class="holder">${E(ctx.vals.holder)}</div>
  </div>
  <div class="grid">
    ${P.field("program", "s2")}${P.field("serial")}
    ${P.field("institution", "s2")}${P.field("year")}
    ${P.field("dob")}${P.field("pob")}${P.field("nat")}
    ${P.field("duration")}${P.field("sid")}${P.field("issued")}
  </div>
  <div class="ft">${P.signBlock}${P.seal}</div>
  ${P.note}
</section>`;
    return page(ctx, "t-gen", GENIUS_CSS, body);
  }

  /* =========================================================
     MJB — excellence institutionnelle (vert / rouge)
     ========================================================= */
  const MJB_CSS = `
.t-mjb { background:#fff; color:var(--ink); font-family:Georgia,"Times New Roman",serif; border:.5mm solid var(--primary); }
.t-mjb .rl { position:absolute; left:10mm; right:10mm; top:7mm; height:2.4mm; border-top:1.1mm solid var(--secondary); border-bottom:.5mm solid var(--accent); }
.t-mjb .rl.bt { top:auto; bottom:7mm; }
.t-mjb .cn { position:absolute; width:8mm; height:8mm; border:0 solid var(--accent); }
.t-mjb .cn.a { top:2.5mm; left:2.5mm; border-width:.8mm 0 0 .8mm; } .t-mjb .cn.b { top:2.5mm; right:2.5mm; border-width:.8mm .8mm 0 0; }
.t-mjb .cn.c { bottom:2.5mm; left:2.5mm; border-width:0 0 .8mm .8mm; } .t-mjb .cn.d { bottom:2.5mm; right:2.5mm; border-width:0 .8mm .8mm 0; }
.t-mjb .in { position:absolute; inset:13mm 12mm 12mm; display:grid; grid-template-columns:52mm 1fr; gap:9mm; }
.t-mjb .col { display:flex; flex-direction:column; align-items:center; justify-content:space-between; }
.t-mjb .logo { width:100%; height:44mm; }
.t-mjb .photo { width:32mm; height:40mm; border:.9mm solid var(--secondary); outline:.4mm solid var(--accent); outline-offset:1mm; background:#fff; }
.t-mjb .mn { display:flex; flex-direction:column; justify-content:space-between; min-width:0; }
.t-mjb .inst { font-size:12pt; font-weight:700; letter-spacing:.06em; color:var(--primary); }
.t-mjb .kick { font-size:6.6pt; letter-spacing:.22em; color:var(--accent); margin-top:.6mm; }
.t-mjb h2 { margin:2mm 0 0; font-size:20pt; letter-spacing:.04em; color:var(--primary); }
.t-mjb .cert { font-size:8pt; line-height:1.4; margin:2mm 0 1mm; }
.t-mjb .cert span { font-style:italic; }
.t-mjb .holder { display:inline-block; font-size:19pt; font-weight:700; color:var(--secondary); line-height:1.2; border-bottom:.7mm solid var(--accent); padding-bottom:.6mm; }
.t-mjb .pan { display:grid; grid-template-columns:1fr 1.25fr; gap:5mm; }
.t-mjb .p { border:.3mm solid var(--secondary); }
.t-mjb .p h4 { margin:0; padding:1.3mm 2.5mm; background:var(--primary); color:#fff; font:700 6.6pt Arial,sans-serif; letter-spacing:.16em; }
.t-mjb .pf { display:grid; grid-template-columns:30mm 1fr; gap:2mm; padding:1.1mm 2.5mm; border-bottom:.2mm dotted #8fb08f; align-items:baseline; }
.t-mjb .pf:last-child { border-bottom:0; }
.t-mjb .pf span { font:6pt/1.25 Arial,sans-serif; letter-spacing:.05em; text-transform:uppercase; color:var(--secondary); }
.t-mjb .pf span i { font-style:normal; color:#5f7a62; }
.t-mjb .pf strong { font-size:9.2pt; overflow-wrap:anywhere; }
.t-mjb .ft { display:grid; grid-template-columns:1fr 36mm; gap:10mm; align-items:end; }
.t-mjb .sline { border-color:var(--primary); }
.t-mjb .qrbox { color:var(--primary); }
`;
  function mjb(ctx) {
    const P = parts(ctx), E = ctx.esc;
    const body = `<i class="rl"></i><i class="rl bt"></i><i class="cn a"></i><i class="cn b"></i><i class="cn c"></i><i class="cn d"></i>
<div class="in">
  <aside class="col">
    <div class="logo">${P.logo}</div>
    <div class="photo">${P.photo}</div>
    ${P.qr}
  </aside>
  <section class="mn">
    <div>
      <div class="inst">${E(ctx.issuer.name)}</div>
      <div class="kick">CERTIFICATE OF AUTHENTICITY · CERTIFICAT D’AUTHENTICITÉ</div>
      <h2>CERTIFICAT D’AUTHENTICITÉ</h2>
      ${P.cert}
      <div class="holder">${E(ctx.vals.holder)}</div>
    </div>
    <div class="pan">
      <div class="p"><h4>TITULAIRE · HOLDER</h4>
        ${P.rowStacked("dob")}${P.rowStacked("pob")}${P.rowStacked("nat")}${P.rowStacked("sid")}</div>
      <div class="p"><h4>FORMATION · ACADEMIC RECORD</h4>
        ${P.rowStacked("program")}${P.rowStacked("institution")}${P.rowStacked("year")}${P.rowStacked("duration")}${P.rowStacked("serial")}${P.rowStacked("issued")}</div>
    </div>
    <div class="ft">${P.signBlock}${P.seal}</div>
    ${P.note}
  </section>
</div>`;
    return page(ctx, "t-mjb", MJB_CSS, body);
  }

  /* =========================================================
     SCIPT — médaillon bronze (bronze / rouge / or clair)
     ========================================================= */
  const SCIPT_CSS = `
.t-scp { background:var(--paper); color:var(--ink); font-family:Georgia,"Times New Roman",serif; border:2mm solid var(--primary); }
.t-scp::before { content:""; position:absolute; inset:1.4mm; border:.35mm solid var(--accent); pointer-events:none; }
.t-scp .band { position:absolute; left:0; right:0; top:0; height:19mm; background:var(--accent); color:#f7efe3;
  display:flex; align-items:center; justify-content:space-between; padding:0 14mm; border-bottom:1mm solid var(--secondary); }
.t-scp .band span { width:92mm; font-size:11pt; font-weight:700; letter-spacing:.14em; }
.t-scp .band span:last-child { text-align:right; font-size:9.5pt; font-weight:400; }
.t-scp .medal { position:absolute; top:6mm; left:50%; transform:translateX(-50%); width:43mm; height:43mm; padding:1mm; border-radius:50%;
  background:var(--paper); box-shadow:0 0 0 .9mm var(--secondary); }
.t-scp .medal img { width:100%; height:100%; object-fit:contain; }
.t-scp .in { position:absolute; inset:52mm 11mm 7mm; display:flex; flex-direction:column; justify-content:space-between; }
.t-scp .mid { display:grid; grid-template-columns:34mm 1fr 34mm; gap:7mm; align-items:center; }
.t-scp .photo { width:32mm; height:40mm; border:.9mm solid var(--primary); outline:.4mm solid var(--secondary); outline-offset:.9mm; background:#fff; }
.t-scp .ctr { text-align:center; }
.t-scp .inst { font-size:13pt; font-weight:700; letter-spacing:.16em; color:var(--accent); }
.t-scp .cert { font-size:8.1pt; line-height:1.4; margin:2mm auto 1.4mm; max-width:140mm; }
.t-scp .cert span { font-style:italic; }
.t-scp .is { font-size:6.8pt; letter-spacing:.14em; text-transform:uppercase; color:var(--primary); }
.t-scp .holder { font-size:20pt; font-weight:700; color:var(--accent); line-height:1.15; }
.t-scp .grid { grid-template-columns:repeat(4,1fr); }
.t-scp .f { background:var(--tint); border-top:.8mm solid var(--primary); padding:1.5mm 2.5mm 1mm; }
.t-scp .f span { color:var(--primary); font-weight:700; }
.t-scp .f strong { padding-bottom:0; }
.t-scp .ft { display:grid; grid-template-columns:1fr 1.2fr 36mm; gap:8mm; align-items:end; }
.t-scp .sline { border-color:var(--accent); }
.t-scp .seal { border-color:var(--primary); }
.t-scp .qrbox { color:var(--ink); }
`;
  function scipt(ctx) {
    const P = parts(ctx), E = ctx.esc;
    const logoImg = ctx.urls.logo
      ? `<img src="${E(ctx.urls.logo)}" alt="Logo officiel" onerror="imgFail(this,'LOGO OFFICIEL<br>OFFICIAL LOGO')">`
      : `<div class="ph">EMPLACEMENT RÉSERVÉ<br>LOGO OFFICIEL</div>`;
    const body = `<div class="band"><span>CERTIFICAT D’AUTHENTICITÉ</span><span>CERTIFICATE OF AUTHENTICITY</span></div>
<div class="medal">${logoImg}</div>
<div class="in">
  <div class="mid">
    <div class="photo">${P.photo}</div>
    <div class="ctr">
      <div class="inst">${E(ctx.issuer.name)}</div>
      ${P.cert}
      <div class="is">Il est attesté que · This is to certify that</div>
      <div class="holder">${E(ctx.vals.holder)}</div>
    </div>
    ${P.qr}
  </div>
  <section class="grid">
    ${P.field("program", "s2")}${P.field("serial")}${P.field("duration")}
    ${P.field("institution", "s2")}${P.field("year")}${P.field("issued")}
    ${P.field("dob")}${P.field("pob")}${P.field("nat")}${P.field("sid")}
  </section>
  <footer class="ft">${P.signBlock}${P.note}<div>${P.seal}</div></footer>
</div>`;
    return page(ctx, "t-scp", SCIPT_CSS, body);
  }

  window.SCIPT_CERT_TEMPLATES = { bcc: { render: bcc }, genius: { render: genius }, mjb: { render: mjb }, scipt: { render: scipt } };
})();
