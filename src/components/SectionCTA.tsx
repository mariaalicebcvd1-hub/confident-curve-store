import { ShoppingBag } from "lucide-react";
import { trackEventDirect } from "@/hooks/useTracking";

interface SectionCTAProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  variant?: "default" | "minimal";
  trackingLabel?: string;
}

const SectionCTA = ({ 
  title = "Pronta pra experimentar?",
  subtitle = "Escolha sua cor e tamanho — se não servir, a troca é grátis.",
  buttonText = "ESCOLHER MINHA COR E TAMANHO",
  variant = "default",
  trackingLabel = "section_cta"
}: SectionCTAProps) => {
  
  const handleClick = () => {
    trackEventDirect('click', 'Section CTA → Color Selection', trackingLabel);
    
    const productOptions = document.getElementById('product-options');
    if (productOptions) {
      productOptions.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (variant === "minimal") {
    return (
      <div className="py-8 text-center">
        <button
          onClick={handleClick}
          className="inline-flex items-center justify-center gap-2 bg-success hover:bg-success/90 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-wide"
        >
          <ShoppingBag className="w-5 h-5" />
          {buttonText}
        </button>
        <p className="text-xs text-muted-foreground mt-3">Frete grátis • Troca garantida • Pagamento seguro</p>
      </div>
    );
  }

  return (
    <div className="py-10 bg-gradient-to-b from-transparent via-secondary/30 to-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-xl mx-auto bg-card rounded-2xl p-8 border border-border shadow-sm">
          <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-2">
            {title}
          </h3>
          <p className="text-muted-foreground mb-6">
            {subtitle}
          </p>
          <button
            onClick={handleClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-success hover:bg-success/90 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-wide"
          >
            <ShoppingBag className="w-5 h-5" />
            {buttonText}
          </button>
          <p className="text-xs text-muted-foreground mt-3">Frete grátis • Troca garantida • Pagamento seguro</p>
        </div>
      </div>
    </div>
  );
};

export default SectionCTA;
