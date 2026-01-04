import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

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

    console.log('Generating AI insights...');

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
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    console.log('AI response received:', content.substring(0, 200));

    // Parse JSON da resposta
    let suggestions = [];
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        suggestions = parsed.suggestions || [];
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
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
        console.error('Error saving suggestions:', insertError);
      }
    }

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-funnel-insights:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
