import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const TABLES: Record<string, string> = {
  GENIUS: "genius_diplomas",
  BCC: "bcc_diplomas",
  MJB: "mjb_diplomas",
  SCIPT_GABON: "scipt_gabon_diplomas"
};

const firstValue = (...values: unknown[]) =>
  values.find(value => value !== null && value !== undefined && value !== "");

Deno.serve(async req => {
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...cors, "Content-Type": "application/json" }
    });

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  if (req.method !== "POST") {
    return json({ error: "Méthode non autorisée." }, 405);
  }

  try {
    const body = await req.json();
    const issuer = body?.issuer;
    const serial = String(body?.serial_number ?? "").trim();

    if (
      typeof issuer !== "string" ||
      !Object.hasOwn(TABLES, issuer) ||
      !/^[A-Za-z0-9][A-Za-z0-9 ./_-]{2,99}$/.test(serial)
    ) {
      return json({ error: "Paramètres invalides." }, 400);
    }

    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!url || !serviceKey) {
      console.error("Configuration Supabase manquante.");
      return json({ error: "Service momentanément indisponible." }, 500);
    }

    const db = createClient(url, serviceKey, {
      auth: { persistSession: false }
    });

    // Lecture de toutes les colonnes pour accepter les noms français
    // et anglais déjà présents dans les différents registres.
    const { data: row, error } = await db
      .from(TABLES[issuer])
      .select("*")
      .eq("matricule", serial)
      .maybeSingle();

    if (error) {
      console.error("Erreur de recherche :", error.message);
      return json({ error: "Recherche impossible." }, 500);
    }

    if (!row) return json({ found: false });

    const status = String(firstValue(row.statut, row.status) ?? "").toLowerCase();

    // Seuls les diplômes confirmés sont affichés comme authentiques.
    if (status !== "valid") return json({ found: false });

    const diploma = {
      serial_number: firstValue(row.matricule, row.serial_number),
      institution: firstValue(row.etablissement, row.institution),
      holder_name: firstValue(row.nom_complet, row.holder_name),
      program: firstValue(row.diplome_formation, row.program, row.degree_title),
      issue_year: firstValue(row.annee, row.issue_year),
      date_of_birth: firstValue(row.date_of_birth),
      place_of_birth: firstValue(row.place_of_birth, row.birth_place),
      study_duration: firstValue(row.study_duration),
      nationality: firstValue(row.nationality, row.nationalite, row["nationalité"], row.nationality_name),
      student_id: firstValue(row.student_id, row.student_id_number),
      issue_date: firstValue(row.issue_date, row.certificate_issue_date, row.date_delivrance),
      photo_url: firstValue(row.photo_url, row.student_photo_url),
      institution_logo_url: firstValue(row.institution_logo_url, row.issuer_logo_url, row.logo_url)
    };

    return json({ found: true, diploma });
  } catch (error) {
    console.error("Erreur inattendue :", error);
    return json({ error: "Requête invalide." }, 400);
  }
});
