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

Deno.serve(async req => {
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...cors, "Content-Type": "application/json" }
    });

  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Méthode non autorisée." }, 405);

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
      console.error("Missing Supabase environment configuration.");
      return json({ error: "Service momentanément indisponible." }, 500);
    }

    const db = createClient(url, serviceKey, { auth: { persistSession: false } });
    const { data, error } = await db
      .from(TABLES[issuer])
      .select("serial_number,institution,holder_name,program,issue_year,status")
      .eq("serial_number", serial)
      .maybeSingle();

    if (error) {
      console.error("Diploma lookup failed:", error.message);
      return json({ error: "Recherche impossible." }, 500);
    }

    if (!data || data.status !== "valid") return json({ found: false });

    return json({
      found: true,
      diploma: {
        serial_number: data.serial_number,
        institution: data.institution,
        holder_name: data.holder_name,
        program: data.program,
        issue_year: data.issue_year
      }
    });
  } catch {
    return json({ error: "Requête invalide." }, 400);
  }
});
