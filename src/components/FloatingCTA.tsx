import { useState, useEffect } from "react";
import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Find the ProductDescription section by its ID
      const descriptionSection = document.getElementById('product-description');
      
      if (descriptionSection && !isDismissed) {
        const rect = descriptionSection.getBoundingClientRect();
        // Show when ProductDescription section enters the viewport
        setIsVisible(rect.top <= window.innerHeight * 0.7);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  const handleClick = () => {
    window.open("https://pay.caminhodasaude.com/nWrxGWAr01X3654", "_blank");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-xl p-3 sm:p-4 animate-slide-up">
      <div className="container mx-auto flex items-center justify-between gap-3 max-w-full px-2 sm:px-4">
        <div className="hidden sm:block flex-shrink-0">
          <p className="font-bold text-foreground text-sm">🔥 Última chance - 70% OFF</p>
          <p className="text-xs text-muted-foreground">
            <span className="line-through">R$ 289,99</span>{" "}
            <span className="text-primary font-bold">3 calcinhas por R$ 87,90</span>
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-initial min-w-0">
          <Button
            onClick={handleClick}
            variant="success"
            size="default"
            className="flex-1 sm:flex-initial text-sm sm:text-base h-10 sm:h-11 animate-pulse"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="truncate">GARANTIR MINHA OFERTA</span>
          </Button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingCTA;
