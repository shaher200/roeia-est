// Supabase Edge Function: admin-signup
// Creates a user with confirmed email and stores profile data

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, phone, password } = await req.json();

    if (!name || !phone || !password) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Basic validations similar to client-side
    if (!/^01\d{9}$/.test(String(phone))) {
      return new Response(
        JSON.stringify({ error: "Invalid phone format. Must start with 01 and be 11 digits" }),
        { status: 400, headers: corsHeaders }
      );
    }
    if (!/^\d{6}$/.test(String(password))) {
      return new Response(
        JSON.stringify({ error: "Password must be exactly 6 digits" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ error: "Server misconfiguration" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const email = `${phone}@temp.com`;

    // Create user with email confirmed to bypass email confirmation flow
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      raw_user_meta_data: {
        name,
        phone,
        display_name: name,
      },
    });

    if (createError) {
      return new Response(
        JSON.stringify({ error: createError.message || "Failed to create user" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const userId = created.user?.id;

    // Store/update profile record (avoids needing an auth.users trigger)
    if (userId) {
      const { error: profileError } = await admin
        .from("profiles")
        .upsert(
          { user_id: userId, name, phone, role: "user" },
          { onConflict: "user_id" }
        );

      // Not fatal: just log server-side
      if (profileError) {
        console.log("Profile upsert error", profileError);
      }
    }

    return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Unexpected server error" }),
      { status: 500, headers: corsHeaders }
    );
  }
});
