export type Row = Record<string, unknown>;

export interface Repo {
  listIndex(table: string): Promise<Row[]>;
  listAliases(issuer: string): Promise<Row[]>;
  getById(table: string, id: unknown): Promise<Row | null>;
}

export const TABLES: Record<string, string> = {
  GENIUS: "genius_diplomas",
  BCC: "bcc_diplomas",
  MJB: "mjb_diplomas",
  SCIPT_GABON: "scipt_gabon_diplomas"
};

export const SERIAL_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 ./_-]{2,99}$/;

export function serialKey(value: unknown): string {
  return String(value ?? "").normalize("NFKC").replace(/\s+/g, "").toUpperCase();
}

export function isValidStatus(status: unknown): boolean {
  return String(status ?? "").trim().toLowerCase() === "valid";
}

export type Lookup =
  | { kind: "none" }
  | { kind: "one"; row: Row }
  | { kind: "ambiguous" };

export function findMatches(index: Row[], serial: unknown, aliases: Row[] = []): Lookup {
  const key = serialKey(serial);
  // Une référence officielle exacte reste toujours prioritaire sur un alias.
  const exact = index.filter(row =>
    serialKey(row.serial_number) === key && isValidStatus(row.status)
  );
  if (exact.length === 1) return { kind: "one", row: exact[0] };
  if (exact.length > 1) return { kind: "ambiguous" };

  const aliasTargets = [...new Set(
    aliases
      .filter(alias => serialKey(alias.alias_serial) === key)
      .map(alias => serialKey(alias.canonical_serial))
      .filter(Boolean)
  )];
  if (aliasTargets.length === 0) return { kind: "none" };
  if (aliasTargets.length > 1) return { kind: "ambiguous" };

  const resolved = index.filter(row =>
    serialKey(row.serial_number) === aliasTargets[0] && isValidStatus(row.status)
  );
  if (resolved.length === 0) return { kind: "none" };
  if (resolved.length > 1) return { kind: "ambiguous" };
  return { kind: "one", row: resolved[0] };
}

const NATIONALITIES: Record<string, { fr: string; fem: string; en: string }> = {
  gabonais: { fr: "Gabonais", fem: "Gabonaise", en: "Gabonese" },
  camerounais: { fr: "Camerounais", fem: "Camerounaise", en: "Cameroonian" },
  congolais: { fr: "Congolais", fem: "Congolaise", en: "Congolese" },
  tchadien: { fr: "Tchadien", fem: "Tchadienne", en: "Chadian" },
  centrafricain: { fr: "Centrafricain", fem: "Centrafricaine", en: "Central African" },
  "équato-guinéen": { fr: "Équato-guinéen", fem: "Équato-guinéenne", en: "Equatorial Guinean" },
  santoméen: { fr: "Santoméen", fem: "Santoméenne", en: "São Toméan" },
  ivoirien: { fr: "Ivoirien", fem: "Ivoirienne", en: "Ivorian" },
  sénégalais: { fr: "Sénégalais", fem: "Sénégalaise", en: "Senegalese" },
  béninois: { fr: "Béninois", fem: "Béninoise", en: "Beninese" },
  togolais: { fr: "Togolais", fem: "Togolaise", en: "Togolese" },
  malien: { fr: "Malien", fem: "Malienne", en: "Malian" },
  guinéen: { fr: "Guinéen", fem: "Guinéenne", en: "Guinean" },
  nigérian: { fr: "Nigérian", fem: "Nigériane", en: "Nigerian" },
  nigérien: { fr: "Nigérien", fem: "Nigérienne", en: "Nigerien" },
  burkinabè: { fr: "Burkinabè", fem: "Burkinabè", en: "Burkinabe" },
  rwandais: { fr: "Rwandais", fem: "Rwandaise", en: "Rwandan" },
  burundais: { fr: "Burundais", fem: "Burundaise", en: "Burundian" },
  angolais: { fr: "Angolais", fem: "Angolaise", en: "Angolan" },
  marocain: { fr: "Marocain", fem: "Marocaine", en: "Moroccan" },
  algérien: { fr: "Algérien", fem: "Algérienne", en: "Algerian" },
  tunisien: { fr: "Tunisien", fem: "Tunisienne", en: "Tunisian" },
  français: { fr: "Français", fem: "Française", en: "French" }
};

function plain(value: unknown): string {
  return String(value ?? "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .trim().toLowerCase().replace(/\s+/g, " ");
}

function neutralFr(m: string, f: string): string {
  if (m === f) return m;
  return m.replace(/e?$/, "") + "(e)";
}

export function shapeNationality(row: Row): {
  nationality: string | null;
  nationality_fr: string | null;
  nationality_en: string | null;
} {
  const raw = row.nationality ?? row.nationalite ?? row["nationalité"] ?? null;
  const existingFr = row.nationality_fr;
  const existingEn = row.nationality_en;
  const key = plain(raw);
  const match = NATIONALITIES[key] ??
    Object.values(NATIONALITIES).find(v => plain(v.en) === key);
  if (!match) {
    return {
      nationality: raw == null ? null : String(raw),
      nationality_fr: existingFr == null ? null : String(existingFr),
      nationality_en: existingEn == null ? null : String(existingEn)
    };
  }
  const fr = existingFr == null ? neutralFr(match.fr, match.fem) : String(existingFr);
  const en = existingEn == null ? match.en : String(existingEn);
  return { nationality: String(raw ?? fr), nationality_fr: fr, nationality_en: en };
}

export function shapeDiploma(row: Row): Row {
  const nationality = shapeNationality(row);
  return {
    serial_number: row.serial_number ?? row.matricule ?? null,
    institution: row.institution ?? row.etablissement ?? null,
    holder_name: row.holder_name ?? row.nom_complet ?? null,
    program: row.program ?? row.diplome_formation ?? row.degree_title ?? null,
    issue_year: row.issue_year ?? row.annee ?? null,
    date_of_birth: row.date_of_birth ?? null,
    birth_place: row.birth_place ?? row.place_of_birth ?? null,
    place_of_birth: row.place_of_birth ?? row.birth_place ?? null,
    ...nationality,
    study_duration: row.study_duration ?? null,
    student_id_number: row.student_id_number ?? row.student_id ?? null,
    student_id: row.student_id ?? row.student_id_number ?? null,
    certificate_issue_date: row.certificate_issue_date ?? row.issue_date ?? row.date_delivrance ?? null,
    issue_date: row.issue_date ?? row.certificate_issue_date ?? row.date_delivrance ?? null,
    photo_url: row.photo_url ?? row.student_photo_url ?? null,
    status: row.status ?? row.statut ?? null
  };
}

export async function verify(repo: Repo, body: unknown): Promise<{ status: number; body: Row }> {
  try {
    if (!body || typeof body !== "object") {
      return { status: 400, body: { error: "Paramètres invalides." } };
    }
    const input = body as Record<string, unknown>;
    const issuer = String(input.issuer ?? "");
    const serial = String(input.serial_number ?? "").trim();
    if (!Object.hasOwn(TABLES, issuer) || !SERIAL_PATTERN.test(serial)) {
      return { status: 400, body: { error: "Paramètres invalides." } };
    }

    const table = TABLES[issuer];
    const index = await repo.listIndex(table);
    const aliases = issuer === "BCC" ? await repo.listAliases(issuer) : [];
    const match = findMatches(index, serial, aliases);
    if (match.kind === "none") return { status: 200, body: { found: false } };
    if (match.kind === "ambiguous") {
      return {
        status: 409,
        body: { found: false, error: "Plusieurs dossiers correspondent à cette référence. Une vérification manuelle est nécessaire." }
      };
    }

    const full = await repo.getById(table, match.row.id);
    if (!full || !isValidStatus(full.status ?? full.statut)) {
      return { status: 200, body: { found: false } };
    }
    return { status: 200, body: { found: true, diploma: shapeDiploma(full) } };
  } catch (error) {
    console.error("Erreur interne de vérification :", error);
    return { status: 500, body: { error: "Service momentanément indisponible." } };
  }
}
