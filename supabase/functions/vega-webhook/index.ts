import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload = await req.json();
    console.log('Vega Webhook received:', JSON.stringify(payload));

    // Extract fields from Vega Checkout payload structure
    const externalId = payload.transaction_id || payload.id || payload.order_id;
    const status = payload.status || 'pending';
    
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
      const { data, error } = await supabase
        .from('sales')
        .insert({
          external_id: externalId?.toString(),
          status: status,
          amount: amount,
          customer_email: customerEmail,
          customer_name: customerName,
          product_name: productName,
          payment_method: paymentMethod,
          raw_payload: payload,
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
