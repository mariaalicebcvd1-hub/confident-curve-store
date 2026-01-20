import { useEffect, useMemo, useState } from "react";
import { ShoppingBag, X } from "lucide-react";
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
  onSelectColor,
  selectedSizeIndex,
  onSelectSizeIndex,
  onOpenOptionsDrawer,
}: {
  selectedColor: ColorKey;
  onSelectColor: (color: ColorKey) => void;
  selectedSizeIndex: number;
  onSelectSizeIndex: (idx: number) => void;
  onOpenOptionsDrawer: (showSizeHint: boolean) => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);


  const selectedSize = useMemo(() => {
    if (selectedSizeIndex < 0) return "";
    return sizes[selectedSizeIndex]?.value ?? "";
  }, [selectedSizeIndex]);

  const isSelectionMissing = selectedSizeIndex < 0;

  const colorLabel = useMemo(() => {
    const map: Record<ColorKey, string> = {
      preto: "Preto",
      bege: "Bege",
      rose: "Rose",
      misto: "Kit Misto",
    };
    return map[selectedColor] ?? selectedColor;
  }, [selectedColor]);

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
      // Padrão e-commerce: mantém o CTA, mas abre o seletor imediatamente.
      onOpenOptionsDrawer(true);
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
  };

  const handleColorSelect = (color: ColorKey) => {
    onSelectColor(color);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-xl p-3 sm:p-4">
      <div className="container mx-auto flex items-center justify-between gap-2 sm:gap-3 max-w-full px-2 sm:px-4">
        <div className="hidden sm:block flex-shrink-0">
          <p className="font-bold text-foreground text-sm">Kit com 3 Calcinhas</p>
          <p className="text-xs text-muted-foreground">
            <span className="line-through">R$ 179,90</span>{" "}
            <span className="text-primary font-bold">por R$ 69,90 no PIX</span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-semibold text-foreground">
              Cor: <span className="ml-1 text-primary font-bold">{colorLabel}</span>
            </span>
            <span className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-semibold text-foreground">
              Tam: <span className="ml-1 text-primary font-bold">{selectedSize || "Escolha"}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 sm:flex-initial min-w-0">
          <button
            type="button"
            onClick={handleClick}
            className="btn-compra flex-1 sm:flex-initial text-sm sm:text-base h-12 sm:h-12 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-extrabold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-success text-success-foreground hover:bg-success/90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 uppercase tracking-wide px-4"
          >
            <ShoppingBag className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Levar 3 por R$ 69,90</span>
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
