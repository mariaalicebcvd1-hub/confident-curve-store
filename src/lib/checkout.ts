import { CHECKOUT_URL } from "./constants";

// Lista de parâmetros UTM que queremos repassar
const UTM_PARAMS = [
  'utm_source',
  'utm_campaign', 
  'utm_medium',
  'utm_content',
  'utm_term'
];

/**
 * Constrói a URL do checkout com cor, tamanho e UTMs da página atual
 */
export function buildCheckoutUrl(options: {
  cor?: string;
  tamanho?: string;
}): string {
  const checkoutUrl = new URL(CHECKOUT_URL);
  
  // Adiciona cor e tamanho se fornecidos
  if (options.cor) {
    checkoutUrl.searchParams.set('cor', options.cor);
  }
  if (options.tamanho) {
    checkoutUrl.searchParams.set('tamanho', options.tamanho);
  }
  
  // Captura UTMs da URL atual e repassa para o checkout
  const currentUrl = new URL(window.location.href);
  UTM_PARAMS.forEach(param => {
    const value = currentUrl.searchParams.get(param);
    if (value) {
      checkoutUrl.searchParams.set(param, value);
    }
  });
  
  return checkoutUrl.toString();
}
