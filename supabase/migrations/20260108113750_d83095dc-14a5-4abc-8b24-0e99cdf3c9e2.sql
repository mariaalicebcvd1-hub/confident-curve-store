-- Fix the overly permissive INSERT policy on sales table
-- The webhook uses service_role_key which bypasses RLS, so we can safely block all direct inserts

-- Drop the existing permissive INSERT policy
DROP POLICY IF EXISTS "Only service role can insert sales" ON public.sales;

-- Create a restrictive policy that blocks all direct client inserts
-- The webhook using service_role_key will still work as it bypasses RLS entirely
CREATE POLICY "No direct inserts allowed - use webhook" 
ON public.sales 
FOR INSERT 
WITH CHECK (false);