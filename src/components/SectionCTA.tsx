import { ShoppingBag } from "lucide-react";
import { trackEventDirect } from "@/hooks/useTracking";

interface SectionCTAProps {
  title?: string;
  subtitle?: string;
  priceHighlight?: string;
  buttonText?: string;
  variant?: "default" | "minimal";
  trackingLabel?: string;
}

const SectionCTA = ({ 
  title = "Kit com 3 Calcinhas Modeladoras por R$ 69,90 no Pix",
  subtitle = "Modela sem apertar, empina com conforto e não marca na roupa",
  priceHighlight,
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
          <div className="inline-flex items-center justify-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-3">
            ⚡ Oferta Especial de Lançamento
          </div>

          <h3 className="text-xl lg:text-2xl font-black text-foreground mb-2">
            {title}
          </h3>

          <p className="text-muted-foreground mb-2">{subtitle}</p>

          <p className="text-sm text-foreground font-semibold mb-4">
            De <span className="line-through">R$ 179,90</span> → Agora:{" "}
            <span className="font-black text-success">R$ 69,90</span> no Pix{" "}
            <span className="text-muted-foreground">• R$ 23 cada</span>
          </p>

          {priceHighlight && (
            <p className="text-sm text-success font-semibold mb-4">{priceHighlight}</p>
          )}

          <p className="text-sm text-muted-foreground mb-5">
            💳 Ou <strong className="text-foreground">R$ 77,70</strong> no cartão (12x de{" "}
            <strong className="text-foreground">R$ 6,47</strong> sem juros)
          </p>

          <button
            onClick={handleClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-success hover:bg-success/90 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-wide"
          >
            <ShoppingBag className="w-5 h-5" />
            {buttonText}
          </button>

          <p className="text-xs text-muted-foreground mt-3">Frete grátis • Troca garantida • Loja com CNPJ</p>
        </div>
      </div>
    </div>
  );
};

export default SectionCTA;
