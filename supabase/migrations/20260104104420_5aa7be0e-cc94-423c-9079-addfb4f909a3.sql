-- Add DELETE and UPDATE RLS policies for tracking_events table
-- This allows admins to manage/clean up tracking data

-- Allow admins to delete tracking events (for data cleanup)
CREATE POLICY "Only admins can delete tracking events"
ON public.tracking_events FOR DELETE TO authenticated
USING (public.is_admin());

-- Allow admins to update tracking events (for corrections if needed)
CREATE POLICY "Only admins can update tracking events"
ON public.tracking_events FOR UPDATE TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());