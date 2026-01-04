import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Allowed origins for CORS - restrict to known domains for defense-in-depth
const allowedOrigins = [
  'https://grwovoemciemplljkboy.supabase.co',
  'http://localhost:8080',
  'http://localhost:5173',
  // Lovable preview domains
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  // Allow Lovable preview domains (*.lovableproject.com)
  const isLovablePreview = origin.includes('.lovableproject.com');
  const isAllowedOrigin = allowedOrigins.includes(origin) || isLovablePreview;
  
  return {
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

// Simple in-memory rate limiting (per function instance)
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute

function checkRateLimit(userId: string): boolean {
  const lastCall = rateLimitMap.get(userId);
  const now = Date.now();
  
  if (lastCall && now - lastCall < RATE_LIMIT_WINDOW_MS) {
    return false; // Rate limited
  }
  
  rateLimitMap.set(userId, now);
  return true;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log('No authorization header provided');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create client with user's token for authentication
    const supabaseAuth = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Verify the user using their token
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();

    if (authError || !user) {
      console.log('Authentication failed:', authError?.message || 'No user found');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('User authenticated:', user.id);

    // Create service role client for admin operations
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    // Check if user is admin
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError) {
      console.log('Role check error:', roleError.message);
      return new Response(JSON.stringify({ error: 'Error checking permissions' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!roleData) {
      console.log('User is not admin:', user.id);
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Rate limiting check (1 call per minute per user)
    if (!checkRateLimit(user.id)) {
      console.log('Rate limit exceeded for user:', user.id);
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please wait 1 minute between requests.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Generating AI insights for admin user:', user.id);

    // Buscar dados do funil dos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [metricsResult, goalsResult, eventsResult] = await Promise.all([
      supabase
        .from('funnel_metrics')
        .select('*')
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: false }),
      supabase
        .from('funnel_goals')
        .select('*')
        .eq('is_active', true),
      supabase
        .from('tracking_events')
        .select('event_type, created_at')
        .gte('created_at', thirtyDaysAgo.toISOString())
    ]);

    const metrics = metricsResult.data || [];
    const goals = goalsResult.data || [];
    const events = eventsResult.data || [];

    // Calcular estatísticas de eventos
    const eventStats: Record<string, number> = {};
    events.forEach((e: { event_type: string }) => {
      eventStats[e.event_type] = (eventStats[e.event_type] || 0) + 1;
    });

    // Preparar contexto para a IA
    const context = `
Você é um especialista em funis de vendas e marketing digital. Analise os dados abaixo e forneça 3-5 sugestões práticas e acionáveis para melhorar a performance do funil.

## Métricas do Funil (últimos 30 dias):
${JSON.stringify(metrics.slice(0, 20), null, 2)}

## Metas Ativas:
${JSON.stringify(goals, null, 2)}

## Eventos de Tracking:
${JSON.stringify(eventStats, null, 2)}

## Instruções:
1. Analise padrões e gargalos no funil
2. Compare métricas com as metas estabelecidas
3. Identifique oportunidades de melhoria
4. Priorize sugestões por impacto potencial

Responda em formato JSON com a seguinte estrutura:
{
  "suggestions": [
    {
      "stage": "attraction|engagement|consideration|conversion|retention",
      "type": "urgente|otimização|oportunidade|alerta",
      "title": "Título curto e claro",
      "description": "Descrição detalhada da sugestão com ações específicas",
      "priority": "high|medium|low"
    }
  ]
}
`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'Você é um consultor especialista em funis de vendas e otimização de conversão. Sempre responda em português brasileiro.' },
          { role: 'user', content: context }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      console.error('AI Gateway error:', response.status);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    console.log('AI response received successfully');

    // Parse JSON da resposta
    let suggestions = [];
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        suggestions = parsed.suggestions || [];
      }
    } catch (parseError) {
      console.error('Error parsing AI response');
      // Criar sugestão padrão se não conseguir parsear
      suggestions = [{
        stage: 'conversion',
        type: 'oportunidade',
        title: 'Análise de dados inconclusiva',
        description: 'Não foi possível gerar insights automaticamente. Adicione mais dados ao funil para obter sugestões personalizadas.',
        priority: 'low'
      }];
    }

    // Salvar sugestões no banco
    if (suggestions.length > 0) {
      const suggestionsToInsert = suggestions.map((s: { stage: string; type: string; title: string; description: string; priority: string }) => ({
        stage: s.stage,
        suggestion_type: s.type,
        title: s.title,
        description: s.description,
        priority: s.priority,
      }));

      const { error: insertError } = await supabase
        .from('ai_suggestions')
        .insert(suggestionsToInsert);

      if (insertError) {
        console.error('Error saving suggestions to database');
      }
    }

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-funnel-insights:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
