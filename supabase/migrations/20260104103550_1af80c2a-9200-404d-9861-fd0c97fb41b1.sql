-- Create a function to enforce rate limiting on tracking events
-- Limits to 100 events per session per minute to prevent abuse
CREATE OR REPLACE FUNCTION public.check_tracking_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  event_count INTEGER;
BEGIN
  -- Count events from the same session in the last minute
  SELECT COUNT(*) INTO event_count
  FROM public.tracking_events
  WHERE session_id = NEW.session_id
    AND created_at > NOW() - INTERVAL '1 minute';
  
  -- Limit to 100 events per minute per session
  IF event_count >= 100 THEN
    RAISE EXCEPTION 'Rate limit exceeded: too many tracking events';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to enforce rate limit before insert
CREATE TRIGGER enforce_tracking_rate_limit
  BEFORE INSERT ON public.tracking_events
  FOR EACH ROW 
  EXECUTE FUNCTION public.check_tracking_rate_limit();

-- Add an index to improve rate limit check performance
CREATE INDEX IF NOT EXISTS idx_tracking_events_session_created 
  ON public.tracking_events(session_id, created_at DESC);