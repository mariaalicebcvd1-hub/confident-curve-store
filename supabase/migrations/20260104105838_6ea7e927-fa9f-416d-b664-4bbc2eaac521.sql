-- Add a constraint to limit metadata size in tracking_events
-- This prevents database bloat from large JSON payloads
-- Using a trigger instead of CHECK constraint for better flexibility

CREATE OR REPLACE FUNCTION public.check_tracking_metadata_size()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Limit metadata to 10KB
  IF pg_column_size(NEW.metadata) > 10240 THEN
    RAISE EXCEPTION 'Metadata too large: maximum size is 10KB';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to enforce metadata size limit
CREATE TRIGGER enforce_tracking_metadata_size
  BEFORE INSERT OR UPDATE ON public.tracking_events
  FOR EACH ROW
  EXECUTE FUNCTION public.check_tracking_metadata_size();