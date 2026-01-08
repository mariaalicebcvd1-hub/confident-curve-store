// Facebook Pixel helper functions
// O pixel do Facebook deve estar instalado no index.html

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

/**
 * Dispara o evento InitiateCheckout do Facebook Pixel
 * Este evento é crucial para rastrear quando usuários iniciam o processo de compra
 */
export const trackInitiateCheckout = (data?: {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  contents?: Array<{ id: string; quantity: number }>;
  currency?: string;
  num_items?: number;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_name: data?.content_name || 'Calcinha Empina Bumbum - Kit 3 unidades',
      content_category: data?.content_category || 'Moda Íntima',
      currency: data?.currency || 'BRL',
      value: data?.value || 87.90,
      num_items: data?.num_items || 3,
      ...data,
    });
    console.log('[FB Pixel] InitiateCheckout tracked');
  } else {
    console.warn('[FB Pixel] fbq not available - make sure the pixel is installed');
  }
};

/**
 * Dispara o evento ViewContent do Facebook Pixel
 */
export const trackViewContent = (data?: {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  currency?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: data?.content_name || 'Calcinha Empina Bumbum - Kit 3 unidades',
      content_category: data?.content_category || 'Moda Íntima',
      currency: data?.currency || 'BRL',
      value: data?.value || 87.90,
      ...data,
    });
    console.log('[FB Pixel] ViewContent tracked');
  }
};

/**
 * Dispara o evento AddToCart do Facebook Pixel
 */
export const trackAddToCart = (data?: {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  currency?: string;
  value?: number;
  contents?: Array<{ id: string; quantity: number }>;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_name: data?.content_name || 'Calcinha Empina Bumbum - Kit 3 unidades',
      content_category: data?.content_category || 'Moda Íntima',
      currency: data?.currency || 'BRL',
      value: data?.value || 87.90,
      ...data,
    });
    console.log('[FB Pixel] AddToCart tracked');
  }
};
