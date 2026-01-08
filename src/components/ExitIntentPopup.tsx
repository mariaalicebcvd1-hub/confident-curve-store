import { useState, useEffect } from "react";
import { X, ShieldCheck, Truck, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const ExitIntentPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Verifica se já foi mostrado nesta sessão
    const alreadyShown = sessionStorage.getItem("exitIntentShown");
    if (alreadyShown) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Detecta quando o mouse sai pelo topo da página (intenção de sair)
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem("exitIntentShown", "true");
      }
    };

    // Detecta o botão voltar do navegador
    const handlePopState = () => {
      if (!hasShown) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem("exitIntentShown", "true");
        // Previne a navegação imediata
        window.history.pushState(null, "", window.location.href);
      }
    };

    // Adiciona entrada no histórico para capturar o botão voltar
    window.history.pushState(null, "", window.location.href);

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleAcceptOffer = () => {
    // Fecha o popup e rola até a seção de seleção de cor/tamanho
    setIsVisible(false);
    
    // Aguarda um momento para o popup fechar e então rola
    setTimeout(() => {
      const productInfo = document.getElementById("product-options");
      if (productInfo) {
        productInfo.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal - Compacto e com scroll interno */}
      <div className="relative bg-card rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden animate-scale-in border-2 border-destructive/50 flex flex-col">
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
                <span className="font-semibold">10% OFF pagando no PIX</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Heart className="w-4 h-4 text-success flex-shrink-0" />
                <span className="font-semibold">Modela cintura e abdômen</span>
              </div>
            </div>

            {/* Preço */}
            <div className="pt-1">
              <p className="text-sm sm:text-base font-bold text-foreground">
                Leve <span className="text-primary">3 calcinhas</span> por apenas
              </p>
              <p className="text-2xl sm:text-3xl font-black text-success">
                R$ 79,11 <span className="text-sm font-bold text-muted-foreground">no PIX</span>
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
              className="w-full text-sm sm:text-base font-black uppercase tracking-wide shadow-lg shadow-success/30"
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
