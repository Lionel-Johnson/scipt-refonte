import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
Deno.serve(async req=>{
 const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json"}});
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 if(req.method!=="POST")return json({error:"Méthode non autorisée."},405);
 try{
  const b=await req.json(), issuer=b?.issuer, serial=String(b?.serial_number??"").trim();
  if(!["GENIUS_BCC","SCIPT_GABON"].includes(issuer)||!/^[A-Za-z0-9][A-Za-z0-9 ./_-]{2,99}$/.test(serial))return json({error:"Paramètres invalides."},400);
  const db=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,{auth:{persistSession:false}});
  const table=issuer==="GENIUS_BCC"?"partner_diplomas":"scipt_gabon_diplomas";
  const {data,error}=await db.from(table).select("serial_number,institution,holder_name,program,issue_year,status").eq("serial_number",serial).maybeSingle();
  if(error){console.error("Lookup error",error.message);return json({error:"Recherche impossible."},500);}
  if(!data||data.status!=="valid")return json({found:false});
  return json({found:true,diploma:{serial_number:data.serial_number,institution:data.institution,holder_name:data.holder_name,program:data.program,issue_year:data.issue_year}});
 }catch{return json({error:"Requête invalide."},400);}
});