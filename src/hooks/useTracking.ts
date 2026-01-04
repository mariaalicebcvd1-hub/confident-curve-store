import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

type EventType = 'page_view' | 'click' | 'scroll' | 'video_view' | 'form_submit' | 'add_to_cart' | 'checkout_start';

const getOrCreateVisitorId = (): string => {
  let visitorId = localStorage.getItem('bellashape_visitor_id');
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem('bellashape_visitor_id', visitorId);
  }
  return visitorId;
};

const getOrCreateSessionId = (): string => {
  let sessionId = sessionStorage.getItem('bellashape_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('bellashape_session_id', sessionId);
  }
  return sessionId;
};

export const useTracking = () => {
  const visitorId = getOrCreateVisitorId();
  const sessionId = getOrCreateSessionId();

  const trackEvent = useCallback(async (
    eventType: EventType,
    eventName?: string,
    elementId?: string,
    metadata?: Json
  ) => {
    try {
      await supabase.from('tracking_events').insert([{
        event_type: eventType,
        event_name: eventName,
        page_url: window.location.pathname,
        element_id: elementId,
        session_id: sessionId,
        visitor_id: visitorId,
        metadata: metadata || {},
      }]);
    } catch (error) {
      console.error('Tracking error:', error);
    }
  }, [sessionId, visitorId]);

  // Auto-track page view on mount
  useEffect(() => {
    trackEvent('page_view', 'Page Load');
  }, [trackEvent]);

  return { trackEvent, visitorId, sessionId };
};

export const trackClick = async (elementId: string, eventName?: string) => {
  const visitorId = getOrCreateVisitorId();
  const sessionId = getOrCreateSessionId();
  
  try {
    await supabase.from('tracking_events').insert({
      event_type: 'click' as EventType,
      event_name: eventName || `Click on ${elementId}`,
      page_url: window.location.pathname,
      element_id: elementId,
      session_id: sessionId,
      visitor_id: visitorId,
    });
  } catch (error) {
    console.error('Tracking error:', error);
  }
};
