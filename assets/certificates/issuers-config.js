/*
 * SCIPT INTERNATIONAL — configuration des certificats d'authenticité.
 * Une seule source de vérité par établissement : logo, signature, palette,
 * modèle de certificat et signataire. Aucune donnée de diplôme ici.
 *
 * Palettes extraites des logos officiels (assets/logos/) :
 *  - BCC     : indigo #281965 · or #bfaa62 (or foncé #8d7748 pour le texte)
 *  - GENIUS  : rouge #f92b3c · bleu acier #5985aa · bleu nuit #102436
 *  - MJB     : vert #027b02 (vert foncé #11521b) · rouge #e70104
 *  - SCIPT   : bronze #a2652a · or clair #e8b069 · rouge #9c0704
 */
window.SCIPT_CERT_CONFIG = {
  // Adresse officielle utilisée dans tous les QR codes.
  verifyBase: "https://sciptinternational.com/verification-diplomes.html",

  issuers: {
    BCC: {
      name: "BLESSED COSMOPOLITAN COLLEGE UK",
      template: "bcc",
      logo: "assets/logos/logo_bcc.PNG",
      signature: "assets/logos/signature_bcc.png",
      signatory: "ADRIAN ESTES, PhD",
      titleFr: "Responsable académique",
      titleEn: "Academic Program",
      palette: {
        primary: "#281965",
        secondary: "#bfaa62",
        accent: "#8d7748",
        ink: "#1b1447",
        tint: "#f6f2e4",
        paper: "#fffdf8"
      }
    },

    GENIUS: {
      name: "GENIUS COLLEGE OF HEALTH SCIENCES, BUSINESS AND TECHNOLOGY",
      template: "genius",
      logo: "assets/logos/logo_genius.PNG",
      signature: "assets/logos/signature_genius.png",
      signatory: "NGOMA MAVBUTO, PhD",
      titleFr: "Directeur académique",
      titleEn: "Academic Director",
      palette: {
        primary: "#102436",
        secondary: "#5985aa",
        accent: "#f92b3c",
        ink: "#102436",
        tint: "#eaf1f7",
        paper: "#ffffff"
      }
    },

    MJB: {
      name: "MJB MANAGEMENT & INTEGRATED SERVICES",
      template: "mjb",
      logo: "assets/logos/logo_mjb.PNG",
      signature: "",
      signatory: "THOMAS SAMSON, PhD",
      titleFr: "Registraire académique",
      titleEn: "Academic Registrar",
      palette: {
        primary: "#11521b",
        secondary: "#027b02",
        accent: "#e70104",
        ink: "#14301a",
        tint: "#eef6ee",
        paper: "#ffffff"
      }
    },

    // SCIPT INTERNATIONAL (Gabon) : logo officiel et palette bronze / rouge.
    SCIPT_GABON: {
      name: "SCIPT INTERNATIONAL",
      template: "scipt",
      logo: "assets/logos/logo_scipt.png",
      signature: "",
      signatory: "Dr Arland Narcisse ELLA",
      titleFr: "Directeur du SCIPT INTERNATIONAL",
      titleEn: "Director of SCIPT INTERNATIONAL",
      palette: {
        primary: "#a2652a",
        secondary: "#e8b069",
        accent: "#9c0704",
        ink: "#3d240d",
        tint: "#f7efe3",
        paper: "#fffdfa"
      }
    }
  }
};
