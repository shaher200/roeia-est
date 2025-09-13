// Supabase Edge Function: custom-auth
// نظام مصادقة مخصص بدون بريد إلكتروني - رقم الهاتف وكلمة المرور فقط

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHash } from "https://deno.land/std@0.224.0/crypto/mod.ts";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

interface AuthRequest {
  action: 'signup' | 'signin';
  phone: string;
  password: string;
  name?: string;
}

interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    phone: string;
    name: string;
    role: string;
  };
  token?: string;
  error?: string;
}

// دالة لإنشاء JWT بسيط
function createSimpleJWT(user: any): string {
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    sub: user.id,
    phone: user.phone,
    name: user.name,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 ساعة
  };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa("simple-signature-" + user.id); // توقيع بسيط

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// دالة لتشفير كلمة المرور (SHA-256 بسيط)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "salt-key-2024"); // إضافة salt
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const requestData: AuthRequest = await req.json();
    const { action, phone, password, name } = requestData;

    if (!action || !phone || !password) {
      return new Response(
        JSON.stringify({ success: false, error: "البيانات المطلوبة مفقودة" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // التحقق من صحة رقم الهاتف
    const phoneStr = String(phone);
    if (!/^01\d{9}$/.test(phoneStr)) {
      return new Response(
        JSON.stringify({ success: false, error: "رقم الهاتف يجب أن يبدأ بـ 01 ويحتوي على 11 رقم" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // التحقق من صحة كلمة المرور
    const passwordStr = String(password);
    if (!/^\d{6}$/.test(passwordStr)) {
      return new Response(
        JSON.stringify({ success: false, error: "كلمة المرور يجب أن تكون 6 أرقام فقط" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "خطأ في إعدادات الخادم" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    if (action === 'signup') {
      // التسجيل الجديد
      if (!name) {
        return new Response(
          JSON.stringify({ success: false, error: "الاسم مطلوب للتسجيل" }),
          { status: 400, headers: corsHeaders }
        );
      }

      // التحقق من عدم وجود المستخدم مسبقاً
      const { data: existingUser } = await supabase
        .from('custom_users')
        .select('id')
        .eq('phone', phoneStr)
        .maybeSingle();

      if (existingUser) {
        return new Response(
          JSON.stringify({ success: false, error: "رقم الهاتف مسجل مسبقاً" }),
          { status: 400, headers: corsHeaders }
        );
      }

      // إنشاء المستخدم الجديد
      const hashedPassword = await hashPassword(passwordStr);
      const { data: newUser, error: createError } = await supabase
        .from('custom_users')
        .insert({
          phone: phoneStr,
          password_hash: hashedPassword,
          name: String(name),
          role: 'user'
        })
        .select()
        .single();

      if (createError || !newUser) {
        console.error('Create user error:', createError);
        return new Response(
          JSON.stringify({ success: false, error: "فشل في إنشاء الحساب" }),
          { status: 500, headers: corsHeaders }
        );
      }

      const token = createSimpleJWT(newUser);
      const response: AuthResponse = {
        success: true,
        user: {
          id: newUser.id,
          phone: newUser.phone,
          name: newUser.name,
          role: newUser.role
        },
        token
      };

      return new Response(JSON.stringify(response), { headers: corsHeaders });

    } else if (action === 'signin') {
      // تسجيل الدخول
      const hashedPassword = await hashPassword(passwordStr);
      const { data: user, error: loginError } = await supabase
        .from('custom_users')  
        .select('*')
        .eq('phone', phoneStr)
        .eq('password_hash', hashedPassword)
        .eq('is_active', true)
        .maybeSingle();

      if (loginError || !user) {
        return new Response(
          JSON.stringify({ success: false, error: "رقم الهاتف أو كلمة المرور غير صحيحة" }),
          { status: 401, headers: corsHeaders }
        );
      }

      const token = createSimpleJWT(user);
      const response: AuthResponse = {
        success: true,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role
        },
        token
      };

      return new Response(JSON.stringify(response), { headers: corsHeaders });
    }

    return new Response(
      JSON.stringify({ success: false, error: "عملية غير مدعومة" }),
      { status: 400, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Auth function error:', error);
    return new Response(
      JSON.stringify({ success: false, error: "خطأ غير متوقع في الخادم" }),
      { status: 500, headers: corsHeaders }
    );
  }
});