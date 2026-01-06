-- Drop the insecure policy that allows anyone to insert
DROP POLICY IF EXISTS "Allow webhook inserts" ON public.sales;

-- Create secure policy that only allows service_role to insert
CREATE POLICY "Only service role can insert sales"
ON public.sales
FOR INSERT
TO service_role
WITH CHECK (true);

-- Add explicit UPDATE policy (admin only, for corrections)
CREATE POLICY "Only admins can update sales"
ON public.sales
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Add explicit DELETE policy (admin only, for cleanup)
CREATE POLICY "Only admins can delete sales"
ON public.sales
FOR DELETE
TO authenticated
USING (is_admin());

-- Add comment for documentation
COMMENT ON TABLE public.sales IS 'Sales records are immutable by default. Only admins can modify for corrections.';