import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, X, ChevronDown, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { trackEventDirect } from "@/hooks/useTracking";
import { trackInitiateCheckout } from "@/lib/facebook-pixel";
import { buildCheckoutUrl } from "@/lib/checkout";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ColorKey } from "@/components/ProductGallery";

const sizes = [
  { value: "P", label: "P", description: "36-38" },
  { value: "M", label: "M", description: "38-40" },
  { value: "G", label: "G", description: "42-44" },
  { value: "GG", label: "GG", description: "44-46" },
  { value: "XG", label: "XG", description: "48-50" },
];

const FloatingCTA = ({
  selectedColor,
  selectedSizeIndex,
  onSelectSizeIndex,
}: {
  selectedColor: ColorKey;
  selectedSizeIndex: number;
  onSelectSizeIndex: (idx: number) => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const [sizeOpen, setSizeOpen] = useState(false);

  const selectedSize = useMemo(() => {
    if (selectedSizeIndex < 0) return "";
    return sizes[selectedSizeIndex]?.value ?? "";
  }, [selectedSizeIndex]);

  const isSelectionMissing = selectedSizeIndex < 0;

  useEffect(() => {
    const handleScroll = () => {
      // Mostra o sticky assim que o card de preço sair totalmente da tela (scroll mínimo após a dobra)
      const priceCard = document.getElementById("price-card");

      if (!priceCard || isDismissed) {
        setIsVisible(false);
        return;
      }

      const rect = priceCard.getBoundingClientRect();
      const isPastPriceCard = rect.bottom <= 0; // card ficou acima do topo da viewport
      setIsVisible(isPastPriceCard);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  const handleClick = (e: React.MouseEvent) => {
    if (isSelectionMissing) {
      e.preventDefault();
      // Em vez de forçar checkout, guia a pessoa pra selecionar com segurança.
      document.getElementById("product-options")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    trackInitiateCheckout({
      content_name: 'Calcinha Modeladora - Kit 3 unidades',
      value: 69.90,
      num_items: 3,
    });

    trackEventDirect('checkout_start', 'Floating CTA → Checkout', 'floating_cta', {
      size: selectedSize,
      color: selectedColor,
    });

    const checkoutUrl = buildCheckoutUrl({
      cor: selectedColor,
      tamanho: selectedSize,
    });

    window.open(checkoutUrl, "_blank");
  };

  const handleSizeSelect = (size: string) => {
    const idx = sizes.findIndex((s) => s.value === size);
    if (idx >= 0) onSelectSizeIndex(idx);
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
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-semibold text-foreground">
              Cor: <span className="ml-1 text-primary font-bold">{selectedColor}</span>
            </span>
            <span className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-semibold text-foreground">
              Tam: <span className="ml-1 text-primary font-bold">{selectedSize || "Escolha"}</span>
            </span>
          </div>
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

          {/* Mobile: chips rápidos (Shopify-like) */}
          <div className="sm:hidden flex-1 min-w-0">
            <ToggleGroup
              type="single"
              value={selectedSize || ""}
              onValueChange={(v) => {
                if (!v) return;
                handleSizeSelect(v);
              }}
              className="flex items-center justify-start gap-1 overflow-x-auto"
            >
              {sizes.map((s) => (
                <ToggleGroupItem
                  key={s.value}
                  value={s.value}
                  aria-label={`Tamanho ${s.label}`}
                  className="h-9 w-11 rounded-xl text-xs font-extrabold data-[state=on]:border-primary data-[state=on]:bg-primary/10"
                >
                  {s.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            {isSelectionMissing && (
              <p className="mt-1 text-[11px] text-muted-foreground">
                Falta escolher o tamanho pra finalizar com segurança.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleClick}
            className="btn-compra flex-1 sm:flex-initial text-sm sm:text-base h-10 sm:h-11 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-success text-white hover:bg-success/90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 uppercase tracking-wide px-4"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="truncate">{isSelectionMissing ? "ESCOLHER TAMANHO" : "COMPRAR AGORA"}</span>
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
