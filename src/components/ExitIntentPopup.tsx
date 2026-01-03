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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in border-2 border-destructive/50">
        {/* Header - Barra de Urgência */}
        <div className="bg-destructive text-white py-3 px-4 text-center">
          <p className="text-sm sm:text-base font-black uppercase tracking-wide animate-pulse">
            ⚠️ TÁ SAINDO AGORA? ESSA OFERTA SOME EM INSTANTES. ⚠️
          </p>
        </div>

        {/* Close Button - Melhorado para mobile e desktop */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-3 hover:bg-secondary rounded-full transition-colors z-20 bg-card shadow-lg border border-border"
          aria-label="Fechar popup"
        >
          <X className="w-6 h-6 text-foreground" />
        </button>

        {/* Content */}
        <div className="p-6 sm:p-8 text-center space-y-5 pt-10">
          {/* Headline Principal */}
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground leading-tight">
              Você estava a <span className="text-primary">UM passo</span> de se sentir <span className="text-primary">confiante</span> no espelho.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Eu sei que você quer pensar melhor…<br />
              <strong className="text-foreground">mas seu corpo não vai mudar sozinho</strong> — e esse desconto acaba <span className="text-destructive font-bold uppercase">HOJE</span>.
            </p>
          </div>

          {/* Bloco de Oferta */}
          <div className="bg-gradient-to-br from-destructive/10 via-primary/5 to-destructive/10 border-2 border-destructive/30 rounded-xl p-5 space-y-4">
            <div className="inline-block bg-destructive text-white text-xs sm:text-sm font-black uppercase px-4 py-1.5 rounded-full">
              🔥 OFERTA FINAL DE SAÍDA 🔥
            </div>
            
            {/* Benefícios */}
            <div className="space-y-2 text-left max-w-xs mx-auto">
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <Truck className="w-5 h-5 text-success flex-shrink-0" />
                <span className="font-semibold">Frete 100% GRÁTIS</span>
              </div>
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <Sparkles className="w-5 h-5 text-success flex-shrink-0" />
                <span className="font-semibold">10% OFF pagando no PIX</span>
              </div>
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <Heart className="w-5 h-5 text-success flex-shrink-0" />
                <span className="font-semibold">Modela cintura e abdômen desde o primeiro uso</span>
              </div>
            </div>

            {/* Preço */}
            <div className="pt-2">
              <p className="text-lg sm:text-xl font-black text-foreground">
                Leve <span className="text-primary">3 calcinhas modeladoras</span> por apenas
              </p>
              <p className="text-3xl sm:text-4xl font-black text-success mt-1">
                R$ 78,30 <span className="text-base font-bold text-muted-foreground">no PIX</span>
              </p>
            </div>
          </div>

          {/* Garantia */}
          <div className="bg-success/10 border border-success/30 rounded-xl p-4 flex items-center gap-3">
            <ShieldCheck className="w-10 h-10 text-success flex-shrink-0" />
            <div className="text-left">
              <p className="font-black text-foreground text-sm sm:text-base">RISCO ZERO: Teste por 30 dias.</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Se não amar, devolvemos 100% do seu dinheiro.</p>
            </div>
          </div>

          {/* CTA Principal */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={handleAcceptOffer}
              variant="success"
              size="xl"
              className="w-full text-base sm:text-lg font-black uppercase tracking-wide shadow-lg shadow-success/30 hover:shadow-success/50 transition-all"
            >
              SIM, QUERO ESCOLHER MINHA COR
            </Button>
            
            {/* Anti-CTA */}
            <button
              onClick={handleClose}
              className="text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors italic"
            >
              Não… prefiro continuar me sentindo desconfortável com meu corpo.
            </button>
          </div>

          {/* Prova Social */}
          <div className="pt-2">
            <p className="text-sm font-semibold text-foreground">
              🔥 Mais de <span className="text-primary">2.847 mulheres</span> já sentiram a diferença no próprio corpo.
            </p>
          </div>
        </div>

        {/* Footer - Micro-Segurança */}
        <div className="bg-secondary/50 px-6 py-3 text-center border-t border-border">
          <p className="text-xs text-muted-foreground">
            🔒 Compra segura • Garantia de 30 dias • Entrega em todo o Brasil
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
