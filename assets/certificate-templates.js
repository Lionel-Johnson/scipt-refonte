(function () {
  "use strict";
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const templates = {};
  function render(kind, data) {
    const {issuer, urls, vals, script} = data;
    const names = {
      BCC: {eyebrow:"BLESSED COSMOPOLITAN COLLEGE · UNITED KINGDOM", title:"CERTIFICATE OF ACHIEVEMENT", sub:"OFFICIAL ACADEMIC RECORD"},
      GENIUS: {eyebrow:"GENIUS COLLEGE OF HEALTH SCIENCES, BUSINESS AND TECHNOLOGY", title:"INTERNATIONAL DIPLOMA", sub:"ACADEMIC CERTIFICATION"},
      MJB: {eyebrow:"MJB MANAGEMENT & INTEGRATED SERVICES", title:"CERTIFICATE OF COMPLETION", sub:"PROFESSIONAL QUALIFICATION"},
      SCIPT_GABON: {eyebrow:"SCIPT INTERNATIONAL · GABON", title:"CERTIFICAT DE RÉUSSITE", sub:"CERTIFICATE OF ACHIEVEMENT"}
    }[kind];
    const fields = [
      ["Date de naissance / Date of birth", vals.dob],
      ["Lieu de naissance / Place of birth", vals.pob],
      ["Nationalité / Nationality", vals.nat],
      ["Matricule / Student ID", vals.sid],
      ["Programme / Programme", vals.program],
      ["Durée / Duration", vals.duration],
      ["Année / Year", vals.year],
      ["Date de délivrance / Date issued", vals.issued],
      ["N° de référence / Serial number", vals.serial]
    ];
    const fieldHtml = fields.map(([label,value]) => '<div class="field"><span>'+esc(label)+'</span><strong>'+esc(value || "—")+'</strong></div>').join("");
    const logo = urls.logo ? '<img class="logo-img" src="'+esc(urls.logo)+'" alt="Logo officiel" onerror="this.style.display=\'none\'">' : "";
    const photo = urls.photo ? '<img class="photo-img" src="'+esc(urls.photo)+'" alt="Photo du titulaire" referrerpolicy="no-referrer" onerror="this.style.display=\'none\'">' : "";
    const signature = urls.signature ? '<img class="signature-img" src="'+esc(urls.signature)+'" alt="Signature officielle">' : "";
    const qr = String(urls.qr || "").startsWith("<") ? urls.qr : '<img src="'+esc(urls.qr)+'" alt="QR de vérification">';
    const holder = esc(vals.holder || "TITULAIRE DU DIPLÔME");
    const org = esc(issuer.name || vals.institution);
    const signatory = esc(issuer.signatory || "");
    const titleFr = esc(issuer.titleFr || "");
    const titleEn = esc(issuer.titleEn || "");
    const common = '<div class="identity"><div class="logo-box">'+logo+'<span>LOGO OFFICIEL</span></div><div class="institution"><div class="eyebrow">'+names.eyebrow+'</div><h1>'+org+'</h1><div class="sub">'+names.sub+'</div></div><div class="photo-box">'+photo+'<span>PHOTO</span></div></div><div class="award"><div class="kicker">HEREBY CERTIFIES THAT · CERTIFIE QUE</div><h2>'+names.title+'</h2><div class="recipient">'+holder+'</div><p>has successfully completed the programme indicated below / a suivi avec succès le programme indiqué ci-dessous.</p></div><section class="fields">'+fieldHtml+'</section><div class="footer"><div class="signature">'+signature+'<strong>'+signatory+'</strong><span>'+titleFr+'</span><small>'+titleEn+'</small></div><div class="verify">'+qr+'<b>SCAN TO VERIFY</b><small>Vérification officielle en ligne</small></div><div class="seal"><span>OFFICIAL</span><b>SEAL</b><small>'+esc(vals.serial)+'</small></div></div><div class="footline">Authenticity can be confirmed through the official online register · Authenticité vérifiable dans le registre officiel</div>';
    const skins = {
      BCC: '<main class="sheet bcc"><div class="diamond d1"></div><div class="diamond d2"></div>'+common+'</main>',
      GENIUS: '<main class="sheet genius"><aside class="side-band"><span>GENIUS</span><i>INTERNATIONAL</i></aside><div class="content">'+common+'</div></main>',
      MJB: '<main class="sheet mjb"><div class="top-band"></div><div class="content">'+common+'</div></main>',
      SCIPT_GABON: '<main class="sheet scipt"><div class="red-band"></div><div class="medallion">S</div><div class="content">'+common+'</div></main>'
    };
    const css = `
      @page{size:A4 landscape;margin:7mm}
      *{box-sizing:border-box}
      html,body{margin:0;padding:0;background:#fff;color:#182333;font-family:Georgia,'Times New Roman',serif}
      .sheet{position:relative;width:283mm;height:196mm;overflow:hidden;padding:11mm 13mm;background:#fff}
      .content{position:relative;height:100%}
      .identity{display:grid;grid-template-columns:46mm 1fr 30mm;gap:7mm;align-items:center;min-height:42mm}
      .logo-box{height:40mm;width:46mm;display:grid;place-items:center;position:relative;overflow:hidden;font:8px Arial;color:#888}.photo-box{height:30mm;width:30mm;display:grid;place-items:center;position:relative;overflow:hidden;font:8px Arial;color:#888}
      .logo-img{display:block;width:100%;height:100%;max-width:none;max-height:none;object-fit:contain;position:absolute;inset:0;margin:auto;padding:1mm}
      .photo-img{width:100%;height:100%;object-fit:cover;position:absolute;inset:0}
      .institution{text-align:center}.institution h1{font-size:17px;letter-spacing:1px;margin:2mm 0}.eyebrow,.sub,.kicker{font:9px Arial;letter-spacing:1.5px}
      .award{text-align:center;margin:7mm 0 5mm}.award h2{font-size:27px;letter-spacing:2px;margin:2mm 0}.recipient{font-size:25px;font-weight:bold;margin:3mm 0}.award p{font:11px Arial;margin:0}
      .fields{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm 7mm}.field{min-height:13mm;padding:2mm 2mm 1mm;border-bottom:1px solid #bbb}.field span{display:block;font:8px Arial;letter-spacing:.5px;text-transform:uppercase;margin-bottom:1.5mm}.field strong{font-size:12px;overflow-wrap:anywhere}
      .footer{display:grid;grid-template-columns:1fr 32mm 1fr;gap:8mm;align-items:end;margin-top:6mm}.signature{text-align:center;border-top:1px solid #777;padding-top:2mm;font:10px Arial;min-height:22mm}.signature-img{display:block;max-width:48mm;max-height:12mm;object-fit:contain;margin:0 auto 1mm}.signature strong,.signature span,.signature small{display:block}.signature strong{font: bold 12px Georgia}.verify{text-align:center;font:8px Arial}.verify img{width:22mm;height:22mm;display:block;margin:0 auto 1mm}.verify b,.verify small{display:block}.seal{text-align:center;border:1px solid currentColor;border-radius:50%;width:24mm;height:24mm;margin:auto;display:flex;flex-direction:column;justify-content:center;font:8px Arial}.seal b{font: bold 13px Georgia}.footline{text-align:center;font:7px Arial;margin-top:3mm;letter-spacing:.3px}
      .bcc{border:5px double #281965;outline:1px solid #bfaa62;outline-offset:-9px;padding:13mm 16mm;color:#281965}.bcc:before,.bcc:after{content:"◆";position:absolute;color:#bfaa62;font-size:20px}.bcc:before{top:5mm;left:7mm}.bcc:after{bottom:5mm;right:7mm}.bcc .institution h1,.bcc .recipient{color:#281965}.bcc .award h2{color:#281965;border-bottom:1px solid #bfaa62;display:inline-block;padding-bottom:2mm}.bcc .field{border-color:#bfaa62}.bcc .seal{color:#bfaa62}
      .genius{border:2px solid #102436;padding:8mm 9mm 8mm 25mm}.genius .side-band{position:absolute;left:0;top:0;bottom:0;width:13mm;background:linear-gradient(180deg,#f92b3c,#5985aa,#102436);color:white;display:flex;align-items:center;justify-content:center;writing-mode:vertical-rl;transform:none;font:bold 12px Arial;letter-spacing:3px}.genius .side-band i{font:8px Arial}.genius .content{height:100%}.genius .award h2{color:#f92b3c}.genius .recipient{color:#102436}.genius .field{background:linear-gradient(90deg,#f1f5f8,#fff);border-bottom:2px solid #5985aa}.genius .seal{background:#102436;color:#fff}
      .mjb{border:3px solid #027b02;padding:8mm 12mm}.mjb .top-band{position:absolute;left:0;right:0;top:0;height:5mm;background:linear-gradient(90deg,#027b02 0 72%,#e70104 72%)}.mjb .award{background:#f4f8f2;border-left:5px solid #027b02;padding:4mm}.mjb .award h2{color:#027b02}.mjb .recipient{color:#027b02}.mjb .field{border:1px solid #d7e4d5;background:#fbfdfb;padding:2mm}.mjb .seal{color:#e70104}
      .scipt{border:3px solid #a2652a;padding:8mm 12mm}.scipt .red-band{position:absolute;top:0;left:0;right:0;height:6mm;background:#9c0704}.scipt .medallion{position:absolute;right:13mm;top:8mm;width:18mm;height:18mm;border:2px solid #e8b069;border-radius:50%;display:grid;place-items:center;color:#a2652a;font:bold 19px Georgia}.scipt .award h2{color:#9c0704}.scipt .recipient{color:#a2652a}.scipt .field{border-bottom:1px solid #e8b069}.scipt .seal{color:#a2652a;border:2px solid #e8b069}
      @media print{html,body{width:283mm;height:196mm}.sheet{width:283mm;height:196mm;break-inside:avoid;page-break-inside:avoid}button{display:none}}
    `;
    return '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(names.title)+' — '+esc(vals.serial)+'</title><style>'+css+'</style><script>'+script+'</scr'+'ipt></head><body>'+skins[kind]+'</body></html>';
  }
  ["BCC","GENIUS","MJB","SCIPT_GABON"].forEach(k => { templates[k] = {render: data => render(k,data)}; });
  window.SCIPT_CERT_TEMPLATES = templates;
})();