import { useState, useEffect } from "react";
import { ShoppingCart, X, ChevronDown, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { trackEventDirect } from "@/hooks/useTracking";
import { trackInitiateCheckout } from "@/lib/facebook-pixel";
import { buildCheckoutUrl } from "@/lib/checkout";

const sizes = [
  { value: "P", label: "P", description: "36-38" },
  { value: "M", label: "M", description: "38-40" },
  { value: "G", label: "G", description: "42-44" },
  { value: "GG", label: "GG", description: "44-46" },
  { value: "XG", label: "XG", description: "48-50" },
];

const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("P");
  const [sizeOpen, setSizeOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const descriptionSection = document.getElementById('product-description');
      if (descriptionSection && !isDismissed) {
        const rect = descriptionSection.getBoundingClientRect();
        setIsVisible(rect.top <= window.innerHeight * 0.7);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  const handleClick = (e: React.MouseEvent) => {
    if (!selectedSize) {
      e.preventDefault();
      setSizeOpen(true);
      return;
    }

    trackInitiateCheckout({
      content_name: 'Calcinha Modeladora - Kit 3 unidades',
      value: 69.90,
      num_items: 3,
    });

    trackEventDirect('checkout_start', 'Floating CTA → Checkout', 'floating_cta', {
      size: selectedSize,
    });

    const checkoutUrl = buildCheckoutUrl({
      tamanho: selectedSize,
    });

    window.open(checkoutUrl, "_blank");
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setSizeOpen(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-xl p-3 sm:p-4">
      <div className="container mx-auto flex items-center justify-between gap-2 sm:gap-3 max-w-full px-2 sm:px-4">
        <div className="hidden sm:block flex-shrink-0">
          <p className="font-bold text-foreground text-sm">Kit com 3 Calcinhas</p>
          <p className="text-xs text-muted-foreground">
            <span className="line-through">R$ 179,90</span>{" "}
            <span className="text-primary font-bold">por R$ 69,90 no PIX</span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-1 sm:flex-initial min-w-0">
          <Popover open={sizeOpen} onOpenChange={setSizeOpen}>
            <PopoverTrigger asChild>
              <button
                className={`flex items-center gap-1.5 px-3 py-2 h-10 sm:h-11 rounded-lg border-2 transition-all duration-200 text-sm font-medium flex-shrink-0 ${
                  selectedSize 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-border bg-secondary hover:border-primary/50 text-foreground"
                }`}
              >
                <span className="hidden xs:inline">Tam:</span>
                <span className="font-bold">{selectedSize || "?"}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${sizeOpen ? "rotate-180" : ""}`} />
              </button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-48 p-2 bg-white border border-border shadow-lg z-[60]" 
              align="start"
              side="top"
              sideOffset={8}
            >
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground px-2 pb-1">Selecione o tamanho</p>
                {sizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => handleSizeSelect(size.value)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-150 ${
                      selectedSize === size.value
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary text-foreground"
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-semibold text-sm">{size.label}</span>
                      <span className={`text-xs ${selectedSize === size.value ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        Manequim {size.description}
                      </span>
                    </div>
                    {selectedSize === size.value && (
                      <Check className="w-4 h-4 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <button
            type="button"
            onClick={handleClick}
            className="btn-compra flex-1 sm:flex-initial text-sm sm:text-base h-10 sm:h-11 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-success text-white hover:bg-success/90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 uppercase tracking-wide px-4"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="truncate">COMPRAR AGORA</span>
          </button>

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
