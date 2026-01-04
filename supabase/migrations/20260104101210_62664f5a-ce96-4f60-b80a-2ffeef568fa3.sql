-- Enum para etapas do funil
CREATE TYPE public.funnel_stage AS ENUM ('attraction', 'engagement', 'consideration', 'conversion', 'retention');

-- Enum para tipos de eventos
CREATE TYPE public.event_type AS ENUM ('page_view', 'click', 'scroll', 'video_view', 'form_submit', 'add_to_cart', 'checkout_start');

-- Tabela de eventos de tracking (coletados automaticamente no site)
CREATE TABLE public.tracking_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type event_type NOT NULL,
    event_name TEXT,
    page_url TEXT,
    element_id TEXT,
    session_id TEXT,
    visitor_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de métricas manuais (importadas pelo usuário)
CREATE TABLE public.funnel_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    stage funnel_stage NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(date, stage, metric_name)
);

-- Tabela de metas do funil
CREATE TABLE public.funnel_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage funnel_stage NOT NULL,
    goal_name TEXT NOT NULL,
    target_value NUMERIC NOT NULL,
    current_value NUMERIC DEFAULT 0,
    deadline DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de sugestões da IA
CREATE TABLE public.ai_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage funnel_stage,
    suggestion_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    is_read BOOLEAN DEFAULT false,
    is_dismissed BOOLEAN DEFAULT false,
    action_taken BOOLEAN DEFAULT false,
    action_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de configurações do dashboard
CREATE TABLE public.dashboard_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_tracking_events_created_at ON public.tracking_events(created_at DESC);
CREATE INDEX idx_tracking_events_type ON public.tracking_events(event_type);
CREATE INDEX idx_funnel_metrics_date ON public.funnel_metrics(date DESC);
CREATE INDEX idx_funnel_metrics_stage ON public.funnel_metrics(stage);
CREATE INDEX idx_ai_suggestions_read ON public.ai_suggestions(is_read, is_dismissed);

-- RLS - Tracking events são públicos para inserção (vem do frontend do site)
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert tracking events" ON public.tracking_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view tracking events" ON public.tracking_events FOR SELECT TO authenticated USING (true);

-- RLS - Métricas, metas e sugestões só para usuários autenticados
ALTER TABLE public.funnel_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage funnel metrics" ON public.funnel_metrics FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.funnel_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage funnel goals" ON public.funnel_goals FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.ai_suggestions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage suggestions" ON public.ai_suggestions FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.dashboard_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage settings" ON public.dashboard_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_funnel_metrics_updated_at
    BEFORE UPDATE ON public.funnel_metrics
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_funnel_goals_updated_at
    BEFORE UPDATE ON public.funnel_goals
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dashboard_settings_updated_at
    BEFORE UPDATE ON public.dashboard_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();