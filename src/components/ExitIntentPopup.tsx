import { useState, useEffect } from "react";
import { X, ShieldCheck, Truck, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const ExitIntentPopup = ({
  onOpenOptionsDrawer,
}: {
  onOpenOptionsDrawer?: () => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Verifica se já foi mostrado nesta sessão
    const alreadyShown = sessionStorage.getItem("exitIntentShown");
    if (alreadyShown) {
      setHasShown(true);
      return;
    }

    // Detecta se é mobile
    const isMobile = window.innerWidth < 768;
    const MOBILE_DELAY = 1500; // 1.5 segundos de delay no mobile

    const showPopup = (withDelay = false) => {
      if (hasShown) return;
      
      const triggerShow = () => {
        setHasShown(true);
        sessionStorage.setItem("exitIntentShown", "true");
        setIsAnimating(true);
        // Pequeno delay para a animação do overlay aparecer primeiro
        setTimeout(() => setIsVisible(true), 50);
      };

      if (withDelay) {
        setTimeout(triggerShow, MOBILE_DELAY);
      } else {
        triggerShow();
      }
    };

    // Desktop: detecta quando o mouse sai pelo topo da página
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        showPopup(false);
      }
    };

    // Detecta o botão voltar do navegador
    const handlePopState = () => {
      showPopup(isMobile);
      window.history.pushState(null, "", window.location.href);
    };

    // Mobile: detecta scroll rápido para cima (intenção de sair)
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = lastScrollY - currentScrollY;
      
      // Se scrollou rápido para cima e está perto do topo
      if (scrollVelocity > 50 && currentScrollY < 100 && !hasShown) {
        showPopup(true); // Com delay no mobile
      }
      
      lastScrollY = currentScrollY;
    };

    // Adiciona entrada no histórico para capturar o botão voltar
    window.history.pushState(null, "", window.location.href);

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
    // Aguarda animação de saída antes de esconder completamente
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleAcceptOffer = () => {
    // Fecha o popup com animação
    setIsVisible(false);
    
    // Aguarda animação de saída e então rola
    setTimeout(() => {
      setIsAnimating(false);
      if (onOpenOptionsDrawer) {
        onOpenOptionsDrawer();
        return;
      }

      const productInfo = document.getElementById("product-options");
      if (productInfo) {
        productInfo.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 500);
  };

  if (!isAnimating) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Overlay - aparece primeiro */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal - aparece com delay suave */}
      <div 
        className={`relative bg-card rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden border-2 border-destructive/50 flex flex-col transition-all duration-500 ease-out ${
          isVisible 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        {/* Header - Barra de Urgência */}
        <div className="bg-destructive text-white py-2 px-4 text-center flex-shrink-0">
          <p className="text-xs sm:text-sm font-black uppercase tracking-wide animate-pulse">
            ⚠️ OFERTA FINAL DE SAÍDA ⚠️
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-1 right-1 p-2 hover:bg-secondary rounded-full transition-colors z-20 bg-card shadow-lg border border-border"
          aria-label="Fechar popup"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        {/* Content com scroll */}
        <div className="p-4 sm:p-6 text-center space-y-4 overflow-y-auto flex-1">
          {/* Headline Principal */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
              Você estava a <span className="text-primary">UM passo</span> de se sentir <span className="text-primary">confiante</span> no espelho.
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              <strong className="text-foreground">Seu corpo não vai mudar sozinho</strong> — esse desconto acaba <span className="text-destructive font-bold uppercase">HOJE</span>.
            </p>
          </div>

          {/* Bloco de Oferta - Mais compacto */}
          <div className="bg-gradient-to-br from-destructive/10 via-primary/5 to-destructive/10 border-2 border-destructive/30 rounded-xl p-4 space-y-3">
            {/* Benefícios */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Truck className="w-4 h-4 text-success flex-shrink-0" />
                <span className="font-semibold">Frete 100% GRÁTIS</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-success flex-shrink-0" />
                <span className="font-semibold">PIX: R$ 69,90 (kit com 3)</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Heart className="w-4 h-4 text-success flex-shrink-0" />
                <span className="font-semibold">Modela sem apertar</span>
              </div>
            </div>

            {/* Preço */}
            <div className="pt-1">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wide">
                ⚡ Oferta Especial de Lançamento
              </div>

              <p className="text-sm sm:text-base font-black text-foreground mt-2">
                Kit com 3 Calcinhas Modeladoras por <span className="text-success">R$ 69,90</span> no Pix
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Modela sem apertar, empina com conforto e não marca na roupa
              </p>
              <p className="text-xs sm:text-sm text-foreground font-semibold mt-2">
                De <span className="line-through text-muted-foreground">R$ 179,90</span> → Agora: <span className="font-black text-success">R$ 69,90</span> no Pix <span className="text-muted-foreground">• R$ 23 cada</span>
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                💳 Ou <strong className="text-foreground">R$ 77,70</strong> no cartão (12x de <strong className="text-foreground">R$ 6,47</strong> sem juros)
              </p>
            </div>
          </div>

          {/* Garantia - Mais compacta */}
          <div className="bg-success/10 border border-success/30 rounded-lg p-3 flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-success flex-shrink-0" />
            <div className="text-left">
              <p className="font-bold text-foreground text-xs sm:text-sm">RISCO ZERO: Teste por 30 dias.</p>
              <p className="text-xs text-muted-foreground">Devolvemos 100% se não amar.</p>
            </div>
          </div>

          {/* CTA Principal */}
          <div className="space-y-2">
            <Button
              onClick={handleAcceptOffer}
              variant="success"
              size="lg"
              className="w-full text-sm sm:text-base font-black uppercase tracking-wide shadow-lg shadow-success/30 animate-shake-subtle hover:animate-none"
            >
              SIM, QUERO ESCOLHER MINHA COR
            </Button>
            
            {/* Anti-CTA */}
            <button
              onClick={handleClose}
              className="text-[10px] sm:text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors italic"
            >
              Não, prefiro continuar assim.
            </button>
          </div>
        </div>

        {/* Footer - Micro-Segurança */}
        <div className="bg-secondary/50 px-4 py-2 text-center border-t border-border flex-shrink-0">
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            🔒 Compra segura • Garantia 30 dias • Entrega Brasil
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
