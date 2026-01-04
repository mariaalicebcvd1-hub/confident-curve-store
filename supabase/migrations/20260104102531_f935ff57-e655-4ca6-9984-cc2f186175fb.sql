-- 1. Criar enum de roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Criar tabela de roles de usuário
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 3. Habilitar RLS na tabela de roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Política para roles - apenas leitura para usuários autenticados
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- 5. Criar função security definer para verificar roles (evita recursão)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 6. Criar função para verificar se é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
$$;

-- 7. Remover políticas antigas e criar novas mais seguras

-- tracking_events: manter inserção pública mas leitura só para admin
DROP POLICY IF EXISTS "Authenticated users can view tracking events" ON public.tracking_events;
CREATE POLICY "Only admins can view tracking events"
ON public.tracking_events FOR SELECT TO authenticated
USING (public.is_admin());

-- funnel_metrics: apenas admin
DROP POLICY IF EXISTS "Authenticated users can manage funnel metrics" ON public.funnel_metrics;
CREATE POLICY "Only admins can manage funnel metrics"
ON public.funnel_metrics FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- funnel_goals: apenas admin
DROP POLICY IF EXISTS "Authenticated users can manage funnel goals" ON public.funnel_goals;
CREATE POLICY "Only admins can manage funnel goals"
ON public.funnel_goals FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ai_suggestions: apenas admin
DROP POLICY IF EXISTS "Authenticated users can manage suggestions" ON public.ai_suggestions;
CREATE POLICY "Only admins can manage suggestions"
ON public.ai_suggestions FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- dashboard_settings: apenas admin
DROP POLICY IF EXISTS "Authenticated users can manage settings" ON public.dashboard_settings;
CREATE POLICY "Only admins can manage settings"
ON public.dashboard_settings FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- user_roles: apenas admin pode inserir/deletar roles
CREATE POLICY "Only admins can manage user roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());