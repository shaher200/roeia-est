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
    const phoneStr = String(phone);
    const passwordStr = String(password);
    
    if (!/^01\d{9}$/.test(phoneStr)) {
      console.log("Phone validation failed:", phoneStr);
      return new Response(
        JSON.stringify({ error: "Invalid phone format. Must start with 01 and be 11 digits" }),
        { status: 400, headers: corsHeaders }
      );
    }
    if (!/^\d{6}$/.test(passwordStr)) {
      console.log("Password validation failed:", passwordStr);
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

    console.log("Creating user with email:", email);

    // Create user with email confirmed to bypass email confirmation flow
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password: passwordStr,
      email_confirm: true,
      user_metadata: {
        name,
        phone: phoneStr,
        display_name: name,
      },
    });

    if (createError) {
      console.log("User creation error:", createError);
      return new Response(
        JSON.stringify({ error: createError.message || "Failed to create user" }),
        { status: 400, headers: corsHeaders }
      );
    }

    console.log("User created successfully:", created.user?.id);

    const userId = created.user?.id;

    // Store/update profile record (avoids needing an auth.users trigger)
    if (userId) {
      console.log("Creating profile for user:", userId);
      const { error: profileError } = await admin
        .from("profiles")
        .upsert(
          { user_id: userId, name, phone: phoneStr, role: "user" },
          { onConflict: "user_id" }
        );

      // Not fatal: just log server-side
      if (profileError) {
        console.log("Profile upsert error", profileError);
      } else {
        console.log("Profile created successfully");
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
