import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verify, type Repo, type Row } from "./logic.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const reply = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...cors,
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") {
    return reply({ error: "Méthode non autorisée." }, 405);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return reply({ error: "Requête invalide." }, 400);
  }

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) {
    console.error("Configuration Supabase manquante.");
    return reply({ error: "Service momentanément indisponible." }, 500);
  }

  // La clé service_role reste exclusivement côté serveur.
  const db = createClient(url, serviceKey, {
    auth: { persistSession: false }
  });

  const repo: Repo = {
    // PostgREST limite les réponses : lecture paginée par blocs de 1000.
    async listIndex(table) {
      const rows: Row[] = [];
      for (let from = 0; ; from += 1000) {
        const { data, error } = await db
          .from(table)
          .select("id,serial_number,status")
          .order("id")
          .range(from, from + 999);
        if (error) throw new Error(error.message);
        rows.push(...(data ?? []));
        if (!data || data.length < 1000) break;
      }
      return rows;
    },
    async getById(table, id) {
      const { data, error } = await db
        .from(table)
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data ?? null;
    }
  };

  const out = await verify(repo, body);
  return reply(out.body, out.status);
});
