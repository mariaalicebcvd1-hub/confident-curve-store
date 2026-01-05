import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-vega-signature',
};

// Rate limiting: track requests per IP
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60000; // 1 minute in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);
  
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

// HMAC signature verification for webhook security
async function verifySignature(payload: string, signature: string | null, secret: string | undefined): Promise<{ valid: boolean; error?: string }> {
  // Reject if no signature provided
  if (!signature) {
    return { valid: false, error: 'Missing signature header' };
  }
  
  // Reject if webhook secret is not configured
  if (!secret) {
    console.error('CRITICAL: VEGA_WEBHOOK_SECRET not configured - rejecting request');
    return { valid: false, error: 'Webhook secret not configured' };
  }
  
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Constant-time comparison to prevent timing attacks
    if (signature.length !== expectedSignature.length) {
      return { valid: false, error: 'Invalid signature' };
    }
    
    let result = 0;
    for (let i = 0; i < signature.length; i++) {
      result |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
    }
    
    return result === 0 ? { valid: true } : { valid: false, error: 'Invalid signature' };
  } catch (error) {
    console.error('Signature verification error:', error);
    return { valid: false, error: 'Signature verification failed' };
  }
}

// Sanitize payload to remove sensitive PII before storage
function sanitizePayload(payload: Record<string, unknown>): Record<string, unknown> {
  const sanitized = { ...payload };
  
  // Redact customer PII
  if (sanitized.customer && typeof sanitized.customer === 'object') {
    sanitized.customer = {
      ...(sanitized.customer as Record<string, unknown>),
      email: '[REDACTED]',
      phone: '[REDACTED]',
      document: '[REDACTED]',
      cpf: '[REDACTED]',
    };
  }
  
  if (sanitized.buyer && typeof sanitized.buyer === 'object') {
    sanitized.buyer = {
      ...(sanitized.buyer as Record<string, unknown>),
      email: '[REDACTED]',
      phone: '[REDACTED]',
      document: '[REDACTED]',
      cpf: '[REDACTED]',
    };
  }
  
  // Remove any credit card or payment sensitive data
  delete sanitized.card;
  delete sanitized.credit_card;
  delete sanitized.payment_details;
  
  return sanitized;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('Rejected non-POST request:', req.method);
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Rate limiting check
  const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                   req.headers.get('cf-connecting-ip') || 
                   'unknown';
  
  if (!checkRateLimit(clientIP)) {
    console.log('Rate limit exceeded for IP:', clientIP);
    return new Response(
      JSON.stringify({ success: false, error: 'Rate limit exceeded' }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const rawBody = await req.text();
    
    // Verify webhook signature - ALWAYS required
    const webhookSecret = Deno.env.get('VEGA_WEBHOOK_SECRET');
    const signature = req.headers.get('x-vega-signature');
    
    const verification = await verifySignature(rawBody, signature, webhookSecret);
    if (!verification.valid) {
      console.log('Webhook authentication failed:', verification.error);
      return new Response(
        JSON.stringify({ success: false, error: verification.error }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const payload = JSON.parse(rawBody);
    console.log('Vega Webhook received from IP:', clientIP);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract fields from Vega Checkout payload structure
    const externalId = payload.transaction_id || payload.id || payload.order_id;
    const status = payload.status || 'pending';
    
    // Check for duplicate to prevent replay attacks
    if (externalId) {
      const { data: existing } = await supabase
        .from('sales')
        .select('id')
        .eq('external_id', externalId.toString())
        .maybeSingle();
      
      if (existing) {
        console.log('Duplicate transaction ignored:', externalId);
        return new Response(
          JSON.stringify({ success: true, message: 'Duplicate ignored' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Vega sends amount in total_price (in BRL like "98.01") or sub_price
    const amount = parseFloat(payload.total_price) || 
                   parseFloat(payload.sub_price) || 
                   parseFloat(payload.amount) || 
                   parseFloat(payload.value) || 
                   0;
    
    // Customer info is in customer object
    const customerEmail = payload.customer?.email || payload.buyer?.email || payload.email;
    const customerName = payload.customer?.name || payload.buyer?.name || payload.name;
    
    // Product name is in plans[0].products[0].name or plans[0].name
    const productName = payload.plans?.[0]?.products?.[0]?.name || 
                        payload.plans?.[0]?.name ||
                        payload.product?.name || 
                        payload.product_name || 
                        payload.items?.[0]?.name;
    
    // Payment method
    const paymentMethod = payload.method || payload.payment_method || payload.payment_type;

    // Only save approved/completed sales
    const validStatuses = ['approved', 'completed', 'paid', 'confirmed', 'aprovado', 'pago'];
    const isValidSale = validStatuses.some(s => 
      status?.toLowerCase()?.includes(s)
    );

    if (isValidSale) {
      // Sanitize payload before storing
      const sanitizedPayload = sanitizePayload(payload);
      
      const { error } = await supabase
        .from('sales')
        .insert({
          external_id: externalId?.toString(),
          status: status,
          amount: amount,
          customer_email: customerEmail,
          customer_name: customerName,
          product_name: productName,
          payment_method: paymentMethod,
          raw_payload: sanitizedPayload,
        });

      if (error) {
        console.error('Error inserting sale:', error);
        throw error;
      }

      console.log('Sale recorded successfully:', externalId, 'Amount:', amount);
    } else {
      console.log('Ignoring non-sale event with status:', status);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
