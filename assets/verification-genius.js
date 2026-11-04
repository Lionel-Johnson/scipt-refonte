/* =========================================================
   SCIPT INTERNATIONAL — Vérification des certificats
   Registre Genius College / Blessed Cosmopolitan College UK / MJB
   À charger avec : <script src="assets/js/verification-genius.js" defer></script>
   ========================================================= */

/* ---- LOGOS : renseignez les URLs (laisser "" pour ne rien afficher) ---- */
const LOGO_GENIUS = "";
const LOGO_BCC    = "";
const LOGO_MJB    = "";

/* ---- Données (52 fiches issues de code_GENIUS.docx) ---- */
const certificats = {
  "A105D63": {
    photo: "https://drive.google.com/uc?export=view&id=1caIA_PQnKzXqKFUr4kMQ_vxziGKdL5wQ",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">SHAOMBA DIKITELE Sylvain</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">June 6, 1973, in Kitengue (Congo)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Congolese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 7 - Master of Sciences (MSc)</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">General Medicine – Integrated Clinical Approach</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">25th January 2025 Obtained in collaboration with The Blessed Cosmopolitain College of UK</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">3 years – 2024</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">730606-SCIPT288</span><br>
       Serial N° : <span style="color:green;font-weight:700;">A105D63</span>`
  },
  "0010134": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">PAYONG SAYOU Richelle Flore</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">February 8, 1993, in Kribi (Cameroon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Cameroonian</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 7 – Professional Master’s Degree delivered by BLESSED COSMOPOLITAIN COLLEGE UK</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Nursing Sciences – Specialization in Healthcare Services Organization and Management</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th November 2025</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">2 years – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">730626-SCIPT288</span><br>
       Serial N° : <span style="color:green;font-weight:700;">0010134</span>`
  },
  "6F60A0Q": {
    photo: "",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">MOUSSOUNDA MOUELET Linda</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">September 27, 1986, in Ndendé (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 6 – Professional Bachelor’s Degree</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Pharmaceutical Sciences Specialization Community Pharmacy Practice and Pharmaceutical Management</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">29th May 2026 Obtained in collaboration with The Blessed Cosmopolitain College of UK</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">3 years – 2026</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">860927-SCIPT424</span><br>
       Serial N° : <span style="color:green;font-weight:700;">6F6OAOQ</span>`
  },
  "6F58A0E": {
    photo: "https://drive.google.com/uc?export=view&id=1ykRgYxyabV0G9WKB3tIcEQ0gcfq7Dt2b",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">MEKUI ASSOGO Winnie Ornella</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">April 11, 1990, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 4 – International Diploma (ID)</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Oil and Gas Exploration and Production</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">04th November 2024 Obtained in collaboration with The Blessed Cosmopolitain College of UK</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">1 year – 2023/2024</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">900411-SCIPT129</span><br>
       Serial N° : <span style="color:green;font-weight:700;">6F58A0E</span>`
  },
  "B089DE4": {
    photo: "https://drive.google.com/uc?export=view&id=1ykRgYxyabV0G9WKB3tIcEQ0gcfq7Dt2b",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">MEKUI ASSOGO Winnie Ornella</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">April 11, 1990, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 4 – International Diploma (ID)</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Mineral Resources Exploration and Mining Operations</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">04th November 2024 Obtained in collaboration with The Blessed Cosmopolitain College of UK</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">1 year – 2023/2024</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">900411-SCIPT129</span><br>
       Serial N° : <span style="color:green;font-weight:700;">B089DE4</span>`
  },
  "EA18C92": {
    photo: "https://drive.google.com/uc?export=view&id=1ykRgYxyabV0G9WKB3tIcEQ0gcfq7Dt2b",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">MEKUI ASSOGO Winnie Ornella</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">April 11, 1990, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 5 – Advanced Diploma (AD)</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Geology and Mining Operations</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">23th July 2025 Obtained in collaboration with The Blessed Cosmopolitain College of UK</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">2 years – 2024/2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">900411-SCIPT129</span><br>
       Serial N° : <span style="color:green;font-weight:700;">EA18C92</span>`
  },
  "D86AE19": {
    photo: "https://drive.google.com/uc?export=view&id=1ykRgYxyabV0G9WKB3tIcEQ0gcfq7Dt2b",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">MEKUI ASSOGO Winnie Ornella</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">April 11, 1990, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 5 – Advanced Diploma (AD)</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Geology, Driling, Oil and Gas Production</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">25th July 2025 Obtained in collaboration with The Blessed Cosmopolitain College of UK</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">2 years – 2024/2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">900411-SCIPT129</span><br>
       Serial N° : <span style="color:green;font-weight:700;">D86AE19</span>`
  },
  "0010132": {
    photo: "https://drive.google.com/uc?export=view&id=1BWIiWZbqSgam8mSSEqttm7p6JQ3s3rhq",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">BIVA Love Princia</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">January 15, 1995, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 6 – Professional Bachelor’s Degree</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Multi-Skilled Nurse</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th September 2025</span><br><br>
       Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 5 – Advanced Diploma</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Multi-Skilled Nurse</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">13th September 2024</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">2 years – 2024/2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">950115-SCIPT199</span><br>
       Serial N° : <span style="color:green;font-weight:700;">0010132</span>`
  },
  "0010136": {
    photo: "https://drive.google.com/uc?export=view&id=1cQ1XQMsqR_O68AvFvKjjWMh1jNI9K3rZ",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">BIRINDA MOUGALA Nelson</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">February 18, 1989, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 5 – Advanced Diploma</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Human Resource Management</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th September 2025</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">1 year – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">890218-SCIPT236</span><br>
       Serial N° : <span style="color:green;font-weight:700;">0010136</span>`
  },
  "0010135": {
    photo: "https://drive.google.com/uc?export=view&id=1Kw3TQ9Xm6oBlYvYqymucoz7MTBefEA6_",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">OKOME EDZANG Arnette</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">July 29, 1988, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 5 – Advanced Diploma</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Midwifery and Obstetrics</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th September 2025</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">1 year – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">880729-SCIPT378</span><br>
       Serial N° : <span style="color:green;font-weight:700;">0010135</span>`
  },
  "0010255": {
    photo: "https://drive.google.com/uc?export=view&id=1Kw3TQ9Xm6oBlYvYqymucoz7MTBefEA6_",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">MIKOLO MIA MAPOUKOU Cemen Gervelin</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">April 17, 1997, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 7 - Master of Business Administration (MBA)</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Economis – Banking and Finance track</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th September 2025</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">2 years – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">970417-SCIPT379</span><br>
       Serial N° : <span style="color:green;font-weight:700;">0010255</span>`
  },
  "0001020": {
    photo: "https://drive.google.com/uc?export=view&id=1BWIiWZbqSgam8mSSEqttm7p6JQ3s3rhq",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">OBONE EHEPPAT Kelda Brundoline</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">September 18, 1994, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 7 - Master of Business Administration (MBA)</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Human Resource Management</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th September 2025</span><br><br>
       Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 6 – Professional Bachelor’s Degree</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Human Resource Management</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">07th September 2023</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">5 years – 2020/2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">950115-SCIPT199</span><br>
       Serial N° : <span style="color:green;font-weight:700;">0010132</span>`
  },
  "0010260": {
    photo: "https://drive.google.com/uc?export=view&id=1Kw3TQ9Xm6oBlYvYqymucoz7MTBefEA6_",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">ITSITSA BAMOUCANA KOUMBA Isaac</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">July 17, 2000, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 5 – Avanced Diploma</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Logistics and Tranport Management</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th September 2025</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">1 years – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">000717-SCIPT239</span><br>
       Serial N° : <span style="color:green;font-weight:700;">0010260</span>`
  },
  "0010256": {
    photo: "https://drive.google.com/uc?export=view&id=1BWIiWZbqSgam8mSSEqttm7p6JQ3s3rhq",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">BIA MVELE Olivia Farelle</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">August 07, 2001, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 2 – Certificat</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Pharmacy Sales Assistant</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th September 2025</span><br><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">1 year – 2020/2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">010807-SCIPT393</span><br>
       Serial N° : <span style="color:green;font-weight:700;">0010256</span>`
  },
  "0010261": {
    photo: "https://drive.google.com/uc?export=view&id=1BWIiWZbqSgam8mSSEqttm7p6JQ3s3rhq",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">PEMBA ESSIA Chrisline</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">August 29, 2002, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 6 – Professional Bachelor’s Degree</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Supply Chain Management</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th September 2025</span><br><br>
       Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 5 – Advanced Diploma</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Logistics and Transport Management</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">13th September 2024</span><br><br>
       Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 4 – International Diploma Delivred by Blessed Cosmopolitain College UK</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Logistics and Transport Management</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">08th July 2023</span><br><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">3 years – 2023/2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">020829-SCIPT162</span><br>
       Serial N° : <span style="color:green;font-weight:700;">0010261</span>`
  },
  "0001021": {
    photo: "",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">MBIA Syndie Orphelie</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">Mars 17, 1990, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 6 – Professional Bachelor’s Degree</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Diplomacy and international relations</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th September 2025</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">1 year – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">900317-SCIPT217</span><br>
       Serial N° : <span style="color:green;font-weight:700;">0001021</span>`
  },
  "0001017": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">NKARA IBONA Michela Elsa Leslie</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">January 06, 1996, in Moanda (Libreville)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 4 – International Diploma</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Multi-Skilled Nurse</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th September 2025</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">3 years – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">900106-SCIPT83</span><br>
       Serial N° : <span style="color:green;font-weight:700;">0001017</span>`
  },
  "0010262": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">NDONG ENGOUANG Andre</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">October 7, 1997, in Medouneu (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 4 – International Diploma</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Oil and Gas Production</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">13th September 2024</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">1 years – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">971007-SCIPT190</span><br>
       Serial N° : <span style="color:green;font-weight:700;">0010262</span>`
  },
  "0010138": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">BOUYAZIE MOUSSONGO Murielle</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">June 5, 1995, in Port Gentil (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 5 – Advanced Diploma</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Medical Secretarial Studies</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th September 2025 Obtained in collaboration with The Blessed Cosmopolitain College of UK</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">1 years – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">950605-SCIPT395</span><br>
       Serial N° : <span style="color:green;font-weight:700;">0010138</span>`
  },
  "0010137": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">RILEWE Auguste</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">September 19, 1989, in Port Gentil (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 4 – International Diploma</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Logistics and Transport Management</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th September 2025 Obtained in collaboration with The Blessed Cosmopolitain College of UK</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">1 years – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">890919-SCIPT247</span><br>
       Serial N° : <span style="color:green;font-weight:700;">0010137</span>`
  },
  "6F55A0E": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">WALO WOMAKINDA Marie</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">December 27, 1982, in Lomela (RDC)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Congolese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 7 – Research Master’s Degree (MRes)</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Public Health, with a specialization in Epidemiology and Population Health Interventions</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">07th January 2024 Obtained in collaboration with The Blessed Cosmopolitain College of UK</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">2 years – 2021/2023</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">821227-SCIPT178</span><br>
       Serial N° : <span style="color:green;font-weight:700;">6F55A0E</span>`
  },
  "6F57A0E": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">NFOUBOU BIGNOUMBA Tulingui</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">March 26, 1985, in Libreville (GABON)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 7 – Professional Master’s Degree (PMD)</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Quality, Health, Safety and Environment - QHSE</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">04th November 2022 Obtained in collaboration with The Blessed Cosmopolitain College of UK</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">2 years – 2020/2022</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">850326-SCIPT404</span><br>
       Serial N° : <span style="color:green;font-weight:700;">6F57A0E</span>`
  },
  "0010270": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">BISSAGOU-DINZAMBOU Audrey</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">November 11, 1995, in Port Gentil (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 6 – Professional Bachelor’s Degree</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Medical Secretarial Studies</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th September 2025 Obtained in collaboration with The Blessed Cosmopolitain College of UK</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">1 years – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">951112-SCIPT405</span><br>
       Serial N° : <span style="color:green;font-weight:700;">0010270</span>`
  },
  "0010150": {
    photo: "https://drive.google.com/uc?export=view&id=1Kw3TQ9Xm6oBlYvYqymucoz7MTBefEA6_",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">ANDEME NDONG Daniella</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">January 01, 1994, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;"> Level 6 – Professional Bachelor’s Degree</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Midwifery and Obstetrics</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th September 2025 Obtained in collaboration with The Blessed Cosmopolitain College of UK</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">1 year – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">940130 SCIPT406</span><br>
       Serial N° : <span style="color:green;font-weight:700;">0010150</span>`
  },
  "6F56A0E": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">PEMBA MBOUMBA Reine</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">Sepember 12, 1980, in Port Gentil (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 6 – Professional Bachelor’s Degree</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Multi-Skilled Nurse</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th September 2025 Obtained in collaboration with The Blessed Cosmopolitain College of UK</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">3 years – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">800912-SCIPT401</span><br>
       Serial N° : <span style="color:green;font-weight:700;">6F56A0E</span>`
  },
  "60A0E": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">ESSIE Cerina Alexandra</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">January 21, 1991, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 6 – Professional Bachelor’s Degree</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Accounting Control and Auditing - ACA</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">04th November 2023 Obtained in collaboration with The Blessed Cosmopolitain College of UK</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">3 years – 2023</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">910121-SCIPT408</span><br>
       Serial N° : <span style="color:green;font-weight:700;">60A0E</span>`
  },
  "5D3D97B": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">FUEMA MABANZA NSIMBA Floden</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">March 30, 1991, in Douala (Cameroon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Cameroonian</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 7 – Professional Master’s Degree</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Electrical Engineering and Industrial Computing</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">04th July 2025 Obtained in collaboration with The Blessed Cosmopolitain College of UK</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;"> 2 years – 2023/2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">930330-SCIPT317</span><br>
       Serial N° : <span style="color:green;font-weight:700;"> 5D3D97B</span>`
  },
  "89DE5": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">ESSIE Cerina Alexandra</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">January 21, 1991, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 4 – International Diploma</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Accounting and Management</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">28th June 2019 Obtained in collaboration with The Blessed Cosmopolitain College of UK</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">1 year – 2019</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">910121-SCIPT408</span><br>
       Serial N° : <span style="color:green;font-weight:700;"> B089DE5</span>`
  },
  "6F60A0H": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">ONTSAGAH NDZONI Isaac Alain-Junior</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">December 29, 1999, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 6 – Professional Bachelor’s Degree</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Transport and Logistic Management</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">25th July 2025 Obtained in collaboration with The Blessed Cosmopolitain College of UK</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">3 years – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">910121-SCIPT409</span><br>
       Serial N° : <span style="color:green;font-weight:700;">6F60A0H</span>`
  },
  "6F60A0F": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">MAGNAMBA KOUMBANGOYE Maick Stallone</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">March 28, 1994, in Moanda (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 6 – Professional Bachelor’s Degree</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Metallic Materials Engineering and Industrial Processes</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">04th November 2023 Obtained in collaboration with The Blessed Cosmopolitain College of UK</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">3 years – 2023</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">940328-SCIPT410</span><br>
       Serial N° : <span style="color:green;font-weight:700;">6F60A0F</span>`
  },
  "6F81A0E": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">MAGNAMBA KOUMBANGOYE Maick Stallone</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">March 28, 1994, in Moanda (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 7 – Professional Master’s Degree</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Quality Control and Inspection of Metallic Materials</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">26th July 2025 Obtained in collaboration with The Blessed Cosmopolitain College of UK</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">5 years – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">940328-SCIPT410</span><br>
       Serial N° : <span style="color:green;font-weight:700;">6F81A0E</span>`
  },
  "6F61A0F": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">ALOUBA Aline</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">October 1, 1976, in Akieni (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 6 – Professional Bachelor’s Degree</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Social Intervention and Family Education</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">04th November 2023 Obtained in collaboration with The Blessed Cosmopolitain College of UK</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">3 years – 2023</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">761001-SCIPT411</span><br>
       Serial N° : <span style="color:green;font-weight:700;">6F61A0F</span>`
  },
  "7F81A0E": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">ALOUBA Aline</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">October 1, 1976, in Akieni (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 7 – Professional Master’s Degree</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Social and Educational Project Management</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">26th July 2025 Obtained in collaboration with The Blessed Cosmopolitain College of UK</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">5 years – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">761001-SCIPT411</span><br>
       Serial N° : <span style="color:green;font-weight:700;">7F81A0E</span>`
  },
  "6F58A0W": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">MOUSSEKI Aristophane</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">March 05, 1984, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 6 – Professional Bachelor’s Degree</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Multi-Skilled Nurse</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">23th December 2025 Obtained in collaboration with The Blessed Cosmopolitain College of UK</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">3 years – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">840305-SCIPT221</span><br>
       Serial N° : <span style="color:green;font-weight:700;">6F58A0W</span>`
  },
  "6F58A0X": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">AKELE-MVONE Nelie Precilia</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">March 25, 2000, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 6 – Professional Bachelor’s Degree</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">State Registered Midwife </span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th November 2025 Obtained in collaboration with The Blessed Cosmopolitain College of UK</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">3 years – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">000325-SCIPT129</span><br>
       Serial N° : <span style="color:green;font-weight:700;">6F56A0X</span>`
  },
  "6F60A0Y": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">MFOUME EYENG N’NANG Yanice</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">Aout 10, 1996, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 6 – Bachelor of Sciences (BSc) </span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Medical Sciences, General Medicine option </span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th November 2025 Obtained in collaboration with The Blessed Cosmopolitain College of UK</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">3 years – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">960810-SCIPT214</span><br>
       Serial N° : <span style="color:green;font-weight:700;">6F60A0Y</span>`
  },
"93A9120": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">PAYONG SAYOU Richelle Flore</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">February 8, 1993, in Kribi (Cameroon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Cameroonian</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 6 – Professional Bachelor’s Degree</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Multi-Skilled Nurse</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">30th May 2023</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">3 years – 2023</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">730626-SCIPT288</span><br>
       Serial N° : <span style="color:green;font-weight:700;">93A9120</span>`
  },
"93A9121": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">ISSIAKOU NTSAME Maïmounatou Djamila</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">April 26, 1983, in Libreville (GABON)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 6 – Professional Bachelor’s Degree</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Accounting and Management</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">30th May 2018</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">3 years – 2018</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">830426-SCIPT415</span><br>
       Serial N° : <span style="color:green;font-weight:700;">93A9121</span>`
  },
"0010135": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">ISSIAKOU NTSAME Maïmounatou Djamila</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">April 26, 1983, in Libreville (GABON)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 7 – Professional Master’s Degree</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Accounting, Auditing and Control</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th November 2020</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">3 years – 2020</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">830426-SCIPT415</span><br>
       Serial N° : <span style="color:green;font-weight:700;">0010135</span>`
  },
"7F81A07": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">PEMBA ESSIA Chrisline</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">August 29, 2002, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 6 – Professional Bachelor’s Degree Delivred by Blessed Cosmopolitain College UK</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Supply Chain Management</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">25th July 2025</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">3 years – 2022/2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;"> 020829-SCIPT162</span><br>
       Serial N° : <span style="color:green;font-weight:700;">7F81A07</span>`
  },
"EA18C93": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">PEMBA ESSIA Chrisline</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">August 29, 2002, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 5 – Advanced Diploma Delivred by Blessed Cosmopolitain College UK</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Logistics and Transport Management</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">13th September 2024</span><br><br>
       Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 4 – International Diploma Delivred by Blessed Cosmopolitain College UK</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Logistics and Transport Management</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">08th July 2023</span><br><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">2 years – 2023/2024</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">020829-SCIPT162</span><br>
       Serial N° : <span style="color:green;font-weight:700;">EA18C93</span>`
  },
"51A679V": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">BEKOUNG ESSONO Sam Wasner</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">February 05, 1990, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 6 – Professional Bachelor’s Degree Delivred by Blessed Cosmopolitain College UK</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Land Development and Management</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">29th October 2021</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">3 years – 2019/2021</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;"> 900205-SCIPT140</span><br>
       Serial N° : <span style="color:green;font-weight:700;">51A679V</span>`
  },
"H4T6503": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">BEKOUNG ESSONO Sam Wasner</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">February 05, 1990, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 7 – Professional Master’s Degree Delivred by Blessed Cosmopolitain College UK</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Land Law and Urban Planning</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">22th July 2023</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">2 years – 2021/2023</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;"> 900205-SCIPT140</span><br>
       Serial N° : <span style="color:green;font-weight:700;">H4T6503</span>`
  },
"6F81A0C": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">OBIANG Stélina Charlene</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">October 30, 1987, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 7 – Professional Master’s Degree Delivred by Blessed Cosmopolitain College UK</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Strategic procurement and Supply Management Specialized in Building and Public Works</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">26th August 2026</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">2 years – 2024/2026</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;"> 871030-SCIPT451</span><br>
       Serial N° : <span style="color:green;font-weight:700;">6F81A0C</span>`
  },
"6F60A1Z": {
    photo: "https://drive.google.com/uc?export=view&id=1vP8NE9-_zabezFhpAkOW2PSYbDwL8ovS",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">WALO WOMAKINDA Marie</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">December 27, 1982, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 6 – Professional Bachelor’s Degree Delivred by Blessed Cosmopolitain College UK</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">State Registered Midwife</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">26th November 2021</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">3 years – 2019/2021</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;"> 821227-SCIPT140</span><br>
       Serial N° : <span style="color:green;font-weight:700;">6F60A1Z</span>`
  },
  "0001019": {
    photo: "https://drive.google.com/uc?export=view&id=1QZlqOFPqgACQyg8_VUQfIwHL2yYJBeGi",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">EKOURE BETOUE Lauryn Isabelle</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">June 11, 2001, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 6 – Professional Bachelor’s Degree</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Organizational Management – Option Assistant Manager</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th September 2025</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">2 years – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">010611-SCIPT274</span><br>
       Serial N° : <span style="color:green;font-weight:700;">0001019</span>`
  },
  "0001011": {
    photo: "",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">KATANGA BEYA Jonathan</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">September 22, 2005, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 4 – International Diploma</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Building Electrical System</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th September 2025</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">1 year – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">050922-SCIPT241</span><br>
       Serial N° : <span style="color:green;font-weight:700;">0001011</span>`
  },
  "000101": {
    photo: "https://drive.google.com/uc?export=view&id=1HYwDvgGXOBp5E52fDsDXHUo9G-_FOtol",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">YEBES MAMFOUYI Hurchard Abdin</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">May 16, 1999, in Bakoumba (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 4 – International Diploma</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Civil Engineering</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th September 2025</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">1 year – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">990516-SCIPT216</span><br>
       Serial N° : <span style="color:green;font-weight:700;">000101</span>`
  },
  "000108": {
    photo: "",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">NYARE ENGO Gina France</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">April 04, 2001, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 4 – International Diploma</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Oil Production</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th September 2025</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">1 year – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">010424-SCIPT388</span><br>
       Serial N° : <span style="color:green;font-weight:700;">000108</span>`
  },
  "000105": {
    photo: "",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">NDZIME BEYEME Dalvyn Yarly Alain</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">April 04, 2003, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 5 – Advanced Diploma</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Logistics and Transport Management</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th September 2025</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">1 year – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">030404-SCIPT240</span><br>
       Serial N° : <span style="color:green;font-weight:700;">000105</span>`
  },
  "000107": {
    photo: "https://drive.google.com/uc?export=view&id=1Ad914mkmPbPAry2xhE-n60FMpGq1ahCQ",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">NSA MVONDO Helena Cyrielle</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">April 30, 1995, in Oyem (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 5 – Advanced Diploma</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Logistics and Transport Management</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">10th September 2025</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">1 year – 2025</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">950430-SCIPT278</span><br>
       Serial N° : <span style="color:green;font-weight:700;">000107</span>`
  },
  "774A24E9": {
    photo: "https://drive.google.com/uc?export=view&id=1cQ1XQMsqR_O68AvFvKjjWMh1jNI9K3rZ",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">MBAZOGHE NGUEMA Johanelle Audhe Patra</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">December 19, 1996, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 4 – International Diploma</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">Nursing Science</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">15th July 2025</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">2 years – 2021/2023</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">971219-SCIPT423</span><br>
       Serial N° : <span style="color:green;font-weight:700;">774A24E9</span>`
  },
  "6F60A0Z": {
    photo: "https://drive.google.com/uc?export=view&id=1Kw3TQ9Xm6oBlYvYqymucoz7MTBefEA6_",
    personal:
      `Student Identity : <span style="color:#154C79;font-weight:700;">MBAZOGHE NGUEMA Johanaelle Audhe Patra</span><br>
       Date of Birth : <span style="color:#154C79;font-weight:700;">December 19, 1997, in Libreville (Gabon)</span><br>
       Nationality : <span style="color:#154C79;font-weight:700;">Gabonese</span>`,
    academic:
      `Degree Obtained : <span style="color:#154C79;font-weight:700;">Level 6 – Professional Bachelor’s Degree</span><br>
       Speciality : <span style="color:#154C79;font-weight:700;">State Registered Multi-Skilled Nurse</span><br>
       Certificat Obtained : <span style="color:#154C79;font-weight:700;">04th June 2026</span><br>
       Duration of Study : <span style="color:#154C79;font-weight:700;">3 years – 2023/2026</span><br>
       Student ID Number : <span style="color:#154C79;font-weight:700;">971219-SCIPT423</span><br>
       Serial N° : <span style="color:green;font-weight:700;">6F60A0Z</span>`
  }
}; // end certificats

(function () {
  "use strict";

  /* Normalisation : majuscules, sans espaces, "O" lu comme "0" (ex. 6F6OAOQ = 6F60A0Q) */
  const norm = (s) => String(s || "").trim().toUpperCase().replace(/\s+/g, "").replace(/O/g, "0");
  const index = {};
  Object.keys(certificats).forEach((k) => { index[norm(k)] = k; });

  function getContext(serial) {
    const s = String(serial || "").trim();
    if (/^MJB/i.test(s)) {
      return { certText: "I, THOMAS SAMSON PhD, Academic Registrar of MJB MANAGEMENT & INTEGRATED SERVICES (MJB), hereby certify that :", sideLogo: LOGO_MJB, alt: "MJB" };
    }
    if (/^[A-Za-z0-9]+$/.test(s) && /[A-Za-z]/.test(s) && /\d/.test(s)) {
      return { certText: "I, ADRIAN ESTES, PhD, Academic Program of BLESSED COSMOPOLITAIN COLLEGE-UK (BCC), hereby certify that :", sideLogo: LOGO_BCC, alt: "BCC" };
    }
    return { certText: "I, NGOMA MAVBUTO PhD, Academic Director of GENIUS COLLEGE OF HEALTH SCIENCES BUSINESS AND TECHNOLOGY, hereby certify that :", sideLogo: LOGO_GENIUS, alt: "Genius College" };
  }

  const $ = (id) => document.getElementById(id);
  const msg = (cls, text) => '<p class="gv-msg ' + cls + '">' + text + "</p>";

  function logosRow() {
    const items = [[LOGO_GENIUS, "Genius College"], [LOGO_BCC, "Blessed Cosmopolitan College UK"], [LOGO_MJB, "MJB"]]
      .filter((x) => x[0])
      .map((x) => '<img src="' + x[0] + '" alt="' + x[1] + '" crossorigin="anonymous">');
    return items.length ? '<div class="gv-logos">' + items.join("") + "</div>" : "";
  }

  function verifier() {
    const res = $("gv-result");
    const raw = $("gv-input").value.trim();
    res.innerHTML = "";
    if (!raw) { res.innerHTML = msg("gv-warn", "⚠️ Veuillez entrer un numéro de série."); return; }
    const key = index[norm(raw)];
    if (!key) { res.innerHTML = msg("gv-err", "❌ Numéro de série non reconnu. Vérifiez la saisie ou contactez le service des examens."); return; }

    const info = certificats[key];
    const ctx = getContext(key);
    const photo = info.photo
      ? '<img src="' + info.photo + '" alt="Photo" referrerpolicy="no-referrer" crossorigin="anonymous">'
      : '<span class="gv-nophoto">Photo<br>non fournie</span>';
    const side = ctx.sideLogo
      ? '<div class="gv-side"><img src="' + ctx.sideLogo + '" alt="' + ctx.alt + '" crossorigin="anonymous"></div>'
      : "";

    res.innerHTML =
      '<article id="gv-fiche" class="gv-fiche">' + logosRow() +
      '<div class="gv-body">' +
        '<div class="gv-id"><div class="gv-photo">' + photo + "</div>" + side + "</div>" +
        '<div class="gv-info">' +
          '<p class="gv-cert">' + ctx.certText + "</p>" +
          "<h3>PERSONAL INFORMATION</h3><p>" + info.personal + "</p>" +
          "<h3>ACADEMIC INFORMATION</h3><p>" + info.academic + "</p>" +
        "</div></div></article>";
    res.dataset.serial = key;
  }

  function loadScript(src) {
    return new Promise((ok, ko) => {
      const s = document.createElement("script");
      s.src = src; s.onload = ok; s.onerror = ko;
      document.head.appendChild(s);
    });
  }

  async function genererPDF() {
    const fiche = $("gv-fiche");
    if (!fiche) { alert("⚠️ Aucune fiche affichée. Veuillez d'abord vérifier un certificat."); return; }
    try {
      if (!window.html2canvas) await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
      if (!window.jspdf) await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
      const { jsPDF } = window.jspdf;
      const canvas = await html2canvas(fiche, { scale: 2, useCORS: true, logging: false, backgroundColor: "#ffffff" });
      const pdf = new jsPDF("p", "mm", "a4");
      const pw = pdf.internal.pageSize.getWidth(), ph = pdf.internal.pageSize.getHeight(), m = 10;
      const w = pw - 2 * m;
      const pxPerPage = Math.floor(canvas.width * ((ph - 2 * m) / w));
      for (let y = 0, first = true; y < canvas.height; y += pxPerPage, first = false) {
        const part = document.createElement("canvas");
        part.width = canvas.width;
        part.height = Math.min(pxPerPage, canvas.height - y);
        part.getContext("2d").drawImage(canvas, 0, y, canvas.width, part.height, 0, 0, canvas.width, part.height);
        if (!first) pdf.addPage();
        pdf.addImage(part.toDataURL("image/png"), "PNG", m, m, w, (part.height * w) / canvas.width);
      }
      pdf.save("certificat_" + ($("gv-result").dataset.serial || "verification") + ".pdf");
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la génération du PDF. Réessayez.");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const input = $("gv-input"); if (!input) return;
    $("gv-btn").addEventListener("click", verifier);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); verifier(); } });
    document.querySelectorAll(".gv-pdf").forEach((b) => b.addEventListener("click", genererPDF));
  });
})();
